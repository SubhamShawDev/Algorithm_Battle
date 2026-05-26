/* =====================================================================
   BATTLE ARENA ENGINE — Multi-Algorithm Comparison Visualizer
   Premium Edition with animations, rank badges, and stagger effects
   ===================================================================== */
(function () {
    'use strict';

    const BCOLORS = {
        bar:     '#3b82f6',
        compare: '#00eeff',
        swap:    '#10b981',
        set:     '#d946ef',
        done:    '#22c55e',
    };

    // Per-algorithm accent colors for card headers
    const ACCENT_COLORS = [
        '#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6',
        '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6366f1',
        '#14b8a6', '#e11d48', '#a855f7'
    ];

    const BATTLE = {
        slots: [],
        maxSlots: 13,
        finishOrder: [],      // tracks completion order for rank badges
        sharedArray: null,    // same array for fair comparison
    };

    /* ─── Helpers ─── */
    function battleSize() {
        const s = document.getElementById('battle-size');
        return parseInt(s ? s.value : 25);
    }
    function battleSpeed() {
        const s = document.getElementById('battle-speed');
        return parseInt(s ? s.value : 60);
    }
    function battleDelay() {
        const speed = battleSpeed();
        if (speed === 100) return 1;
        return Math.pow(101 - speed, 1.5) * 0.6;
    }

    /* ─── Sort API per slot ─── */
    class BattleSortAPI {
        constructor(slot) {
            this.slot = slot;
            this.arr = [...slot.array];
            this.bars = slot.bars;
            this.ops = 0;
            this.aborted = false;
            this.startTime = performance.now();
        }

        updateOps() {
            const el = document.getElementById('battle-ops-' + this.slot.index);
            if (el) el.textContent = this.ops.toLocaleString();
        }

        updateTime() {
            const el = document.getElementById('battle-time-' + this.slot.index);
            if (el) {
                const ms = (performance.now() - this.startTime).toFixed(0);
                el.textContent = ms + 'ms';
            }
        }

        async sleep() {
            if (this.aborted) throw new Error("Aborted");
            await new Promise(r => setTimeout(r, Math.max(battleDelay(), 2)));
        }

        async compare(i, j) {
            this.ops++; this.updateOps(); this.updateTime();
            this.bars[i].style.background = BCOLORS.compare;
            this.bars[j].style.background = BCOLORS.compare;
            this.bars[i].classList.add('dvis-comparing');
            this.bars[j].classList.add('dvis-comparing');
            await this.sleep();
            this.bars[i].classList.remove('dvis-comparing');
            this.bars[j].classList.remove('dvis-comparing');
            this.bars[i].style.background = this.slot.barColor;
            this.bars[j].style.background = this.slot.barColor;
            return this.arr[i] - this.arr[j];
        }

        async swap(i, j) {
            this.ops++; this.updateOps(); this.updateTime();
            let t = this.arr[i]; this.arr[i] = this.arr[j]; this.arr[j] = t;
            this.bars[i].style.height = `${this.arr[i]}%`;
            this.bars[j].style.height = `${this.arr[j]}%`;
            this.bars[i].style.background = BCOLORS.swap;
            this.bars[j].style.background = BCOLORS.swap;
            this.bars[i].classList.add('dvis-swapping');
            this.bars[j].classList.add('dvis-swapping');
            await this.sleep();
            this.bars[i].classList.remove('dvis-swapping');
            this.bars[j].classList.remove('dvis-swapping');
            this.bars[i].style.background = this.slot.barColor;
            this.bars[j].style.background = this.slot.barColor;
        }

        async set(i, val) {
            this.ops++; this.updateOps(); this.updateTime();
            this.arr[i] = val;
            this.bars[i].style.height = `${val}%`;
            this.bars[i].style.background = BCOLORS.set;
            this.bars[i].classList.add('dvis-setting');
            await this.sleep();
            this.bars[i].classList.remove('dvis-setting');
            this.bars[i].style.background = this.slot.barColor;
        }

        async markLine() {
            if (this.aborted) throw new Error("Aborted");
            await new Promise(r => setTimeout(r, Math.max(battleDelay() / 4, 2)));
        }
    }

    /* ─── Array generation ─── */
    function generateArray(slot) {
        const size = battleSize();
        if (BATTLE.sharedArray && BATTLE.sharedArray.length === size) {
            slot.array = [...BATTLE.sharedArray];
        } else {
            slot.array = [];
            for (let i = 0; i < size; i++) slot.array.push(Math.floor(Math.random() * 90) + 5);
        }
    }

    /* ─── Render bars ─── */
    function renderBars(slot) {
        const arena = document.getElementById('battle-arena-' + slot.index);
        if (!arena) return;
        arena.querySelectorAll('.b-bar').forEach(b => b.remove());
        slot.bars = [];
        const gap = slot.array.length > 40 ? '0.5px' : '1px';
        const accent = ACCENT_COLORS[slot.index % ACCENT_COLORS.length];
        slot.array.forEach(val => {
            const bar = document.createElement('div');
            bar.className = 'b-bar flex-1 rounded-t-sm';
            bar.style.cssText = `height:${val}%;background:${accent};margin:0 ${gap};transition:height 60ms ease,background 80ms ease;opacity:0.85;`;
            arena.appendChild(bar);
            slot.bars.push(bar);
        });
        // Update the bar color reference for this slot's API
        slot.barColor = accent;
        const ops = document.getElementById('battle-ops-' + slot.index);
        if (ops) ops.textContent = '0';
        const time = document.getElementById('battle-time-' + slot.index);
        if (time) time.textContent = '—';
    }

    /* ─── Picker list builder ─── */
    function buildPickerHTML() {
        const usedIds = BATTLE.slots.map(s => s.algoId);
        const available = Object.keys(algorithms).filter(id => !usedIds.includes(id));
        if (available.length === 0) return '<p class="text-slate-500 text-xs p-4 text-center">All algorithms added!</p>';

        return available.map(id => {
            const algo = algorithms[id];
            return `<button data-algo="${id}"
                class="battle-pick-algo w-full text-left px-4 py-2.5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center gap-3 cursor-pointer border-b border-white/5 last:border-0 group">
                <span class="material-symbols-outlined text-primary text-base group-hover:scale-110 transition-transform">bolt</span>
                <span class="flex-1">${algo.title}</span>
                <span class="text-[9px] text-slate-600 font-mono bg-white/5 px-2 py-0.5 rounded">${algo.avg}</span>
            </button>`;
        }).join('');
    }

    /* ─── Slot card HTML ─── */
    function createSlotCard(slot) {
        const algo = algorithms[slot.algoId];
        const accent = ACCENT_COLORS[slot.index % ACCENT_COLORS.length];
        const delay = slot.index * 80; // stagger animation

        return `
        <div id="battle-card-${slot.index}" class="battle-card glass border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-white/20 transition-all"
             style="animation-delay:${delay}ms;">
            <!-- Ambient glow per card -->
            <div class="absolute top-0 left-0 w-full h-1 rounded-t-2xl" style="background:linear-gradient(90deg, ${accent}40, transparent);"></div>

            <!-- Header -->
            <div class="battle-card-header flex items-center justify-between px-3 py-2.5 border-b border-white/5 relative">
                <div class="flex items-center gap-2 min-w-0">
                    <div class="size-2 rounded-full" style="background:${accent};box-shadow:0 0 8px ${accent}60;"></div>
                    <span class="text-white text-[13px] font-bold truncate">${algo.title}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-[8px] text-slate-500 font-mono bg-white/5 px-1.5 py-0.5 rounded">${algo.avg}</span>
                    <button data-remove="${slot.index}" class="battle-remove-btn text-slate-600 hover:text-rose-400 transition-colors cursor-pointer" title="Remove">
                        <span class="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
            </div>

            <!-- Mini Arena -->
            <div id="battle-arena-${slot.index}" class="flex-1 flex items-end px-2 py-2 min-h-[130px] relative overflow-hidden">
                <div class="absolute inset-0 opacity-5 pointer-events-none"
                     style="background:radial-gradient(circle at 50% 100%, ${accent}, transparent 70%);"></div>
            </div>

            <!-- Stats Footer -->
            <div class="flex items-center justify-between px-3 py-2 border-t border-white/5 bg-white/[0.02]">
                <div class="flex items-center gap-3">
                    <span class="text-[9px] text-slate-500 font-mono">Ops: <span id="battle-ops-${slot.index}" class="text-amber-400 font-bold">0</span></span>
                    <span class="text-[9px] text-slate-500 font-mono">Time: <span id="battle-time-${slot.index}" class="text-cyan-400">—</span></span>
                </div>
                <div class="flex items-center gap-1.5">
                    <span id="battle-rank-${slot.index}"></span>
                    <span id="battle-status-${slot.index}" class="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Ready</span>
                </div>
            </div>
        </div>`;
    }

    /* ─── "Add Algorithm" card ─── */
    function createAddCard() {
        const usedIds = BATTLE.slots.map(s => s.algoId);
        const remaining = Object.keys(algorithms).filter(id => !usedIds.includes(id));
        if (remaining.length === 0) return '';

        const delay = BATTLE.slots.length * 80;
        return `
        <div id="battle-add-card" class="battle-card battle-add-card rounded-2xl flex flex-col items-center justify-center min-h-[130px] cursor-pointer relative"
             style="animation-delay:${delay}ms;">
            <div id="battle-add-btn" class="flex flex-col items-center gap-2 py-6 z-[2]">
                <span class="material-symbols-outlined text-4xl text-slate-600 battle-add-icon">add_circle</span>
                <span class="text-slate-500 text-xs font-semibold">Add Algorithm</span>
                <span class="text-[9px] text-slate-600 bg-white/5 px-2 py-0.5 rounded-full">${remaining.length} remaining</span>
            </div>
            <!-- Picker dropdown -->
            <div id="battle-picker" class="hidden absolute inset-0 bg-[#0d1117]/95 backdrop-blur-xl border border-primary/20 rounded-2xl z-10 overflow-hidden flex flex-col">
                <div class="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-primary/5">
                    <span class="text-primary text-[10px] font-bold uppercase tracking-[0.15em]">Choose Algorithm</span>
                    <button id="battle-picker-close" class="text-slate-500 hover:text-white cursor-pointer transition-colors">
                        <span class="material-symbols-outlined text-base">close</span>
                    </button>
                </div>
                <div id="battle-picker-list" class="flex-1 overflow-y-auto custom-scrollbar">
                </div>
            </div>
        </div>`;
    }

    /* ─── Render entire grid ─── */
    function renderGrid() {
        const grid = document.getElementById('battle-grid-inner');
        if (!grid) return;

        let html = '';
        BATTLE.slots.forEach(slot => { html += createSlotCard(slot); });
        html += createAddCard();
        grid.innerHTML = html;

        // Render bars
        BATTLE.slots.forEach(slot => renderBars(slot));

        // Update counter
        const count = document.getElementById('battle-slot-count');
        if (count) count.textContent = `${BATTLE.slots.length} / 13`;

        bindGridEvents();
    }

    /* ─── Bind grid events ─── */
    function bindGridEvents() {
        const addBtn = document.getElementById('battle-add-btn');
        const picker = document.getElementById('battle-picker');
        const pickerList = document.getElementById('battle-picker-list');
        const pickerClose = document.getElementById('battle-picker-close');

        if (addBtn && picker && pickerList) {
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                pickerList.innerHTML = buildPickerHTML();
                picker.classList.remove('hidden');
                picker.classList.add('battle-picker-open');
                pickerList.querySelectorAll('.battle-pick-algo').forEach(btn => {
                    btn.addEventListener('click', (e2) => {
                        e2.stopPropagation();
                        addSlot(btn.dataset.algo);
                    });
                });
            });
        }

        if (pickerClose) {
            pickerClose.addEventListener('click', (e) => {
                e.stopPropagation();
                if (picker) { picker.classList.add('hidden'); picker.classList.remove('battle-picker-open'); }
            });
        }

        document.querySelectorAll('.battle-remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeSlot(parseInt(btn.dataset.remove));
            });
        });
    }

    /* ─── Add / Remove slots ─── */
    function addSlot(algoId) {
        if (BATTLE.slots.length >= BATTLE.maxSlots) return;
        const slot = {
            index: BATTLE.slots.length,
            algoId, array: [], bars: [], api: null, isPlaying: false, barColor: BCOLORS.bar
        };
        generateArray(slot);
        BATTLE.slots.push(slot);
        renderGrid();
    }

    function removeSlot(idx) {
        const slot = BATTLE.slots[idx];
        if (slot && slot.api) slot.api.aborted = true;
        BATTLE.slots.splice(idx, 1);
        BATTLE.slots.forEach((s, i) => s.index = i);
        renderGrid();
    }

    /* ─── Rank badge helper ─── */
    function getRankEmoji(rank) {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return '#' + rank;
    }

    /* ─── Run a single slot ─── */
    async function runSlot(slot) {
        if (!algorithms[slot.algoId]) return;
        slot.isPlaying = true;

        const card = document.getElementById('battle-card-' + slot.index);
        const status = document.getElementById('battle-status-' + slot.index);
        const rankEl = document.getElementById('battle-rank-' + slot.index);

        if (card) { card.classList.add('battle-card-running'); card.classList.remove('battle-card-done'); }
        if (status) {
            status.textContent = 'SORTING…';
            status.className = 'text-[9px] text-amber-400 font-mono uppercase tracking-wider battle-status-sorting';
        }
        if (rankEl) rankEl.innerHTML = '';

        slot.api = new BattleSortAPI(slot);

        try {
            await algorithms[slot.algoId].run(slot.api);
            if (!slot.api.aborted) {
                // Record finish
                BATTLE.finishOrder.push(slot.index);
                const rank = BATTLE.finishOrder.indexOf(slot.index) + 1;
                const elapsed = (performance.now() - slot.api.startTime).toFixed(0);

                // Celebration: sweep bars green
                const accent = ACCENT_COLORS[slot.index % ACCENT_COLORS.length];
                slot.bars.forEach((bar, i) => {
                    setTimeout(() => {
                        bar.style.background = BCOLORS.done;
                        bar.style.filter = 'brightness(1.4)';
                        setTimeout(() => {
                            bar.style.background = accent;
                            bar.style.filter = '';
                            bar.style.opacity = '0.9';
                        }, 500);
                    }, i * 12);
                });

                if (card) { card.classList.remove('battle-card-running'); card.classList.add('battle-card-done'); }
                if (status) {
                    status.textContent = `${elapsed}ms · ${slot.api.ops.toLocaleString()} ops`;
                    status.className = 'text-[9px] text-emerald-400 font-mono uppercase tracking-wider';
                }
                if (rankEl) {
                    rankEl.innerHTML = `<span class="battle-rank-badge inline-flex items-center justify-center text-xs font-black rounded-full ${rank <= 3 ? 'text-base' : 'text-[9px] bg-white/10 text-slate-300 px-1.5 py-0.5'}">${getRankEmoji(rank)}</span>`;
                }

                // Update time display
                const timeEl = document.getElementById('battle-time-' + slot.index);
                if (timeEl) timeEl.textContent = elapsed + 'ms';
            }
        } catch (e) {
            if (e.message !== "Aborted") console.error('[Battle] Error:', e);
            if (card) { card.classList.remove('battle-card-running'); }
            if (status) {
                status.textContent = 'STOPPED';
                status.className = 'text-[9px] text-slate-500 font-mono uppercase tracking-wider';
            }
        }
        slot.isPlaying = false;
    }

    /* ─── Run All — same array for fairness ─── */
    function runAll() {
        BATTLE.finishOrder = [];
        const size = battleSize();
        BATTLE.sharedArray = [];
        for (let i = 0; i < size; i++) BATTLE.sharedArray.push(Math.floor(Math.random() * 90) + 5);

        BATTLE.slots.forEach(slot => {
            if (slot.api) slot.api.aborted = true;
            slot.array = [...BATTLE.sharedArray];
            renderBars(slot);
            // Stagger start for visual effect
            setTimeout(() => runSlot(slot), slot.index * 50);
        });
    }

    /* ─── Stop / Reset ─── */
    function stopAll() {
        BATTLE.slots.forEach(slot => {
            if (slot.api) slot.api.aborted = true;
            slot.isPlaying = false;
            const card = document.getElementById('battle-card-' + slot.index);
            if (card) card.classList.remove('battle-card-running');
            const status = document.getElementById('battle-status-' + slot.index);
            if (status) {
                status.textContent = 'STOPPED';
                status.className = 'text-[9px] text-slate-500 font-mono uppercase tracking-wider';
            }
        });
    }

    function resetAll() {
        stopAll();
        BATTLE.finishOrder = [];
        BATTLE.sharedArray = null;
        BATTLE.slots.forEach(slot => {
            generateArray(slot);
            renderBars(slot);
            const status = document.getElementById('battle-status-' + slot.index);
            if (status) {
                status.textContent = 'Ready';
                status.className = 'text-[9px] text-slate-500 font-mono uppercase tracking-wider';
            }
            const rankEl = document.getElementById('battle-rank-' + slot.index);
            if (rankEl) rankEl.innerHTML = '';
            const card = document.getElementById('battle-card-' + slot.index);
            if (card) card.classList.remove('battle-card-done', 'battle-card-running');
        });
    }

    /* ─── Open / Close ─── */
    function openBattle() {
        BATTLE.slots = [];
        BATTLE.finishOrder = [];
        BATTLE.sharedArray = null;
        addSlot('bubble-sort');

        const arena = document.getElementById('battle-arena');
        const appShell = document.getElementById('app-shell');
        if (appShell) appShell.classList.add('hidden');
        const algoModal = document.getElementById('algorithm-modal');
        if (algoModal && !algoModal.classList.contains('hidden')) algoModal.classList.add('hidden');

        arena.classList.remove('hidden');
        void arena.offsetWidth; // force reflow
        arena.classList.remove('opacity-0');
    }

    function closeBattle() {
        stopAll();
        BATTLE.slots = [];
        const arena = document.getElementById('battle-arena');
        const appShell = document.getElementById('app-shell');
        arena.classList.add('opacity-0');
        setTimeout(() => {
            arena.classList.add('hidden');
            if (appShell) appShell.classList.remove('hidden');
            const allPIds = ['home-page', 'arena-page', 'visualization-page', 'benchmark-page', 'performance-matrices-page', 'game-page'];
            allPIds.forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                if (id === 'home-page') { el.classList.remove('hidden'); el.classList.add('flex'); }
                else { el.classList.add('hidden'); el.classList.remove('flex'); }
            });
        }, 400);
    }

    window._openBattle = openBattle;
    window._closeBattle = closeBattle;

    /* ─── DOM Ready ─── */
    document.addEventListener('DOMContentLoaded', () => {
        const backBtn = document.getElementById('battle-back-btn');
        if (backBtn) backBtn.addEventListener('click', closeBattle);

        const runAllBtn = document.getElementById('battle-run-all');
        const stopAllBtn = document.getElementById('battle-stop-all');
        const resetAllBtn = document.getElementById('battle-reset-all');
        const sizeSlider = document.getElementById('battle-size');
        const speedSlider = document.getElementById('battle-speed');
        const sizeVal = document.getElementById('battle-size-val');
        const speedVal = document.getElementById('battle-speed-val');

        if (runAllBtn)   runAllBtn.addEventListener('click', runAll);
        if (stopAllBtn)  stopAllBtn.addEventListener('click', stopAll);
        if (resetAllBtn) resetAllBtn.addEventListener('click', resetAll);

        if (sizeSlider) sizeSlider.addEventListener('input', () => {
            if (sizeVal) sizeVal.textContent = sizeSlider.value;
            resetAll();
        });
        if (speedSlider) speedSlider.addEventListener('input', () => {
            if (speedVal) speedVal.textContent = speedSlider.value;
        });

        // Sidebar & homepage buttons handled in arena.js via window._openBattle
    });
})();

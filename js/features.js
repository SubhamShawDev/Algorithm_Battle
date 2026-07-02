/* =====================================================================
   VISUALIZATION PAGE + BENCHMARK PAGE LOGIC
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const allPages = ['welcome-page', 'home-page', 'arena-page', 'visualization-page', 'benchmark-page'];
    const algoKeysList = Object.keys(algorithms);

    // Icon map for algo selector cards
    const algoIcons = {
        'quick-sort': 'bolt', 'merge-sort': 'merge_type', 'bubble-sort': 'bubble_chart',
        'heap-sort': 'heap_snapshot_thumbnail', 'selection-sort': 'design_services',
        'insertion-sort': 'input', 'tim-sort': 'timer', 'intro-sort': 'psychology',
        'shell-sort': 'layers', 'pdq-sort': 'speed', 'dual-pivot-quick-sort': 'compare_arrows',
        'block-sort': 'view_module', 'dual-fusion-sort': 'all_inclusive'
    };
    const algoColors = {
        'quick-sort': 'text-primary', 'merge-sort': 'text-secondary', 'bubble-sort': 'text-slate-400',
        'heap-sort': 'text-slate-400', 'selection-sort': 'text-indigo-400',
        'insertion-sort': 'text-emerald-400', 'tim-sort': 'text-violet-400', 'intro-sort': 'text-amber-400',
        'shell-sort': 'text-cyan-400', 'pdq-sort': 'text-fuchsia-400', 'dual-pivot-quick-sort': 'text-rose-400',
        'block-sort': 'text-teal-400', 'dual-fusion-sort': 'text-orange-400'
    };

    function showPage(pageId) {
        allPages.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (id === pageId) {
                el.classList.remove('hidden');
                el.classList.add('flex');
            } else {
                el.classList.add('hidden');
                el.classList.remove('flex');
            }
        });
    }

    function buildAlgoGrid(containerId, accentClass, onSelect) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        algoKeysList.forEach(key => {
            const algo = algorithms[key];
            const card = document.createElement('button');
            card.className = `algo-select-card glass p-3 rounded-lg border border-white/10 hover:border-white/30 cursor-pointer flex flex-col items-center gap-2 text-center ${accentClass}`;
            card.dataset.algo = key;
            card.innerHTML = `
                <span class="material-symbols-outlined text-xl ${algoColors[key] || 'text-slate-400'}">${algoIcons[key] || 'sort'}</span>
                <span class="text-[10px] sm:text-xs font-semibold text-slate-300 leading-tight">${algo.title}</span>
            `;
            card.addEventListener('click', () => {
                container.querySelectorAll('.algo-select-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                onSelect(key);
            });
            container.appendChild(card);
        });
    }

    // ==================== FEATURE CARD NAVIGATION ====================
    const btnEnterVis = document.getElementById('btn-enter-visualization');
    const btnStartBench = document.getElementById('btn-start-benchmarking');

    if (btnEnterVis) btnEnterVis.addEventListener('click', (e) => { e.stopPropagation(); showPage('visualization-page'); });
    if (btnStartBench) btnStartBench.addEventListener('click', (e) => { e.stopPropagation(); showPage('benchmark-page'); });

    // Back buttons
    const btnVisBack = document.getElementById('btn-vis-back');
    const btnBenchBack = document.getElementById('btn-bench-back');
    if (btnVisBack) btnVisBack.addEventListener('click', () => { visStopSorting(); showPage('home-page'); });
    if (btnBenchBack) btnBenchBack.addEventListener('click', () => showPage('home-page'));

    // ==================== VISUALIZATION PAGE ====================
    const VIS = {
        selectedAlgo: null,
        isPlaying: false,
        isPaused: false,
        array: [],
        bars: [],
        api: null,
        resolvers: [],
    };

    const visArena = document.getElementById('vis-arena');
    const visAlgoTitle = document.getElementById('vis-algo-title');
    const visOps = document.getElementById('vis-ops');
    const visSwaps = document.getElementById('vis-swaps');
    const visArraySize = document.getElementById('vis-array-size');
    const visSizeLabel = document.getElementById('vis-size-label');
    const visCodeDisplay = document.getElementById('vis-code-display');
    const btnVisStart = document.getElementById('btn-vis-start');
    const btnVisStop = document.getElementById('btn-vis-stop');
    const btnVisRestart = document.getElementById('btn-vis-restart');
    const visSpeedSlider = document.getElementById('vis-speed-slider');
    const visSizeSlider = document.getElementById('vis-size-slider');
    const visSpeedLabel = document.getElementById('vis-speed-label');
    const visAlgoSelect = document.getElementById('vis-algo-select');
    const visInfoPanel = document.getElementById('vis-algo-info-panel');
    const visInfoWorst = document.getElementById('vis-info-worst');
    const visInfoBest = document.getElementById('vis-info-best');
    const visInfoAvg = document.getElementById('vis-info-avg');
    const visInfoSpace = document.getElementById('vis-info-space');
    const visStatusBadge = document.getElementById('vis-status-badge');

    if (visSizeSlider) {
        visSizeSlider.addEventListener('input', () => {
            if (visSizeLabel) visSizeLabel.textContent = visSizeSlider.value;
            if (VIS.selectedAlgo) { visStopSorting(); visGenerateArray(); visRenderBars(); }
        });
    }

    if (visSpeedSlider) {
        visSpeedSlider.addEventListener('input', () => {
            if (visSpeedLabel) {
                visSpeedLabel.textContent = `Speed: ${visSpeedSlider.value}%`;
            }
        });
    }

    if (visAlgoSelect) {
        algoKeysList.forEach(key => {
            const algo = algorithms[key];
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = algo.title;
            visAlgoSelect.appendChild(opt);
        });
        visAlgoSelect.addEventListener('change', (e) => {
            if (e.target.value) visOnAlgoSelect(e.target.value);
        });
    }

    function visGenerateArray() {
        const size = parseInt(visSizeSlider ? visSizeSlider.value : 30);
        VIS.array = [];
        for (let i = 0; i < size; i++) VIS.array.push(Math.floor(Math.random() * 90) + 5);
        if (visArraySize) visArraySize.textContent = size;
    }

    function visRenderBars() {
        if (!visArena) return;
        visArena.innerHTML = '<div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style="background-image: radial-gradient(circle at 50% 120%, rgba(245,158,11,0.15), transparent 70%);"></div>';
        VIS.bars = [];
        const margin = VIS.array.length > 50 ? 'mx-[0.5px]' : 'mx-[1px]';
        VIS.array.forEach(val => {
            const bar = document.createElement('div');
            bar.className = `vis-sort-bar flex-1 ${margin} rounded-t-sm`;
            bar.style.height = `${val}%`;
            visArena.appendChild(bar);
            VIS.bars.push(bar);
        });
        if (visOps) visOps.textContent = '0';
        if (visSwaps) visSwaps.textContent = '0';
    }

    // Vis SortAPI — standalone vis page with gradient glow effects
    class VisSortAPI {
        constructor() {
            this.arr = [...VIS.array];
            this.bars = VIS.bars;
            this.ops = 0;
            this.swapCount = 0;
            this.aborted = false;
        }

        updateOps() {
            if (visOps) visOps.textContent = this.ops.toLocaleString();
            if (visSwaps) visSwaps.textContent = this.swapCount.toLocaleString();
        }

        // Smoother, exponential speed curve
        getDelay() {
            const visSpeedSlider = document.getElementById('vis-speed-slider');
            const speed = parseInt(visSpeedSlider ? visSpeedSlider.value : 50);
            if (speed === 100) return 1;
            return Math.pow(101 - speed, 1.5) * 0.8;
        }

        async sleep() {
            if (this.aborted) throw new Error("Aborted");
            await new Promise(r => setTimeout(r, Math.max(this.getDelay(), 1)));
            while (VIS.isPaused) {
                await new Promise(r => VIS.resolvers.push(r));
                if (this.aborted) throw new Error("Aborted");
            }
        }

        async compare(i, j) {
            this.ops++;
            this.updateOps();
            this.bars[i].style.background = 'linear-gradient(180deg, #22d3ee, #06b6d4)';
            this.bars[i].style.boxShadow = '0 0 14px rgba(6,182,212,0.5), 0 -4px 20px rgba(6,182,212,0.15)';
            this.bars[i].style.transform = 'scaleY(1.05)';
            this.bars[j].style.background = 'linear-gradient(180deg, #22d3ee, #06b6d4)';
            this.bars[j].style.boxShadow = '0 0 14px rgba(6,182,212,0.5), 0 -4px 20px rgba(6,182,212,0.15)';
            this.bars[j].style.transform = 'scaleY(1.05)';
            await this.sleep();
            this.bars[i].style.background = '';
            this.bars[i].style.boxShadow = '';
            this.bars[i].style.transform = '';
            this.bars[j].style.background = '';
            this.bars[j].style.boxShadow = '';
            this.bars[j].style.transform = '';
            return this.arr[i] - this.arr[j];
        }

        async swap(i, j) {
            this.ops++;
            this.swapCount++;
            this.updateOps();
            let temp = this.arr[i]; this.arr[i] = this.arr[j]; this.arr[j] = temp;
            this.bars[i].style.height = `${this.arr[i]}%`;
            this.bars[j].style.height = `${this.arr[j]}%`;
            this.bars[i].style.background = 'linear-gradient(180deg, #34d399, #10b981)';
            this.bars[j].style.background = 'linear-gradient(180deg, #34d399, #10b981)';
            this.bars[i].style.boxShadow = '0 0 14px rgba(16,185,129,0.5), 0 -4px 20px rgba(16,185,129,0.15)';
            this.bars[j].style.boxShadow = '0 0 14px rgba(16,185,129,0.5), 0 -4px 20px rgba(16,185,129,0.15)';
            this.bars[i].style.transform = 'scaleY(1.1)';
            this.bars[j].style.transform = 'scaleY(1.1)';
            await this.sleep();
            this.bars[i].style.background = '';
            this.bars[j].style.background = '';
            this.bars[i].style.boxShadow = '';
            this.bars[j].style.boxShadow = '';
            this.bars[i].style.transform = '';
            this.bars[j].style.transform = '';
        }

        async set(i, val) {
            this.ops++;
            this.updateOps();
            this.arr[i] = val;
            this.bars[i].style.height = `${val}%`;
            this.bars[i].style.background = 'linear-gradient(180deg, #e879f9, #d946ef)';
            this.bars[i].style.boxShadow = '0 0 14px rgba(217,70,239,0.5), 0 -4px 20px rgba(217,70,239,0.15)';
            this.bars[i].style.transform = 'scaleY(1.08)';
            await this.sleep();
            this.bars[i].style.background = '';
            this.bars[i].style.boxShadow = '';
            this.bars[i].style.transform = '';
        }

        async markLine(lineNum) {
            if (this.aborted) throw new Error("Aborted");
            // Highlight line
            document.querySelectorAll('#vis-code-display div').forEach(el => {
                el.classList.remove('active-exec-line');
            });
            const target = document.getElementById(`vis-exec-line-${lineNum}`);
            if (target) {
                target.classList.add('active-exec-line');
                target.scrollIntoView({ behavior: 'auto', block: 'center' });
            }
            // Add a short delay for smooth line tracing based on current speed
            await new Promise(r => setTimeout(r, Math.max(this.getDelay() / 3, 3)));
        }
    }

    function visHighlightCodeForExec(code) {
        let html = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        const lines = html.split('\n');
        return lines.map((line, i) => {
            let cl = line
                .replace(/(\/\/.*)/g, '<span style=color:#6a9955;font-style:italic;>$1</span>')
                .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, '<span style=color:#ce9178;>$1</span>')
                .replace(/\b(function|const|let|var|if|else|for|while|return|break|continue|new|typeof|class|extends|async|await)\b/g, '<span style=color:#c586c0;>$1</span>')
                .replace(/\b(\d+\.?\d*)\b/g, '<span style=color:#b5cea8;>$1</span>')
                .replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span style=color:#dcdcaa;>$1</span>')
                .replace(/\.(length|push|pop|slice|concat|floor|log)\b/g, '.<span style=color:#4fc1ff;>$1</span>');
            return `<div id="vis-exec-line-${i + 1}" class="px-2 py-[1.5px] leading-tight border-l-[3px] border-transparent transition-colors duration-150 whitespace-pre font-mono text-sm group"><span class="text-slate-500/40 group-hover:text-slate-500/70 mr-3 select-none inline-block w-6 text-right">${i + 1}</span>${cl}</div>`;
        }).join('\n');
    }

    function visOnAlgoSelect(key) {
        VIS.selectedAlgo = key;
        const algo = algorithms[key];
        if (visAlgoTitle) visAlgoTitle.textContent = algo.title;
        if (btnVisStart) btnVisStart.disabled = false;
        if (btnVisRestart) btnVisRestart.disabled = false;

        // Generate array and render bars
        visGenerateArray();
        visRenderBars();

        // Show code
        const code = window.algorithmCode[key];
        if (visCodeDisplay && code) {
            visCodeDisplay.innerHTML = visHighlightCodeForExec(code);
        }

        // Update Info Panel
        if (visInfoPanel) {
            visInfoPanel.classList.remove('hidden');
            visInfoPanel.classList.add('flex');
            if (visInfoBest) visInfoBest.textContent = algo.best;
            if (visInfoAvg) visInfoAvg.textContent = algo.avg;
            if (visInfoWorst) visInfoWorst.textContent = algo.worst;
            if (visInfoSpace) visInfoSpace.textContent = algo.space;
        }

        // Reset status badge
        if (visStatusBadge) {
            visStatusBadge.textContent = 'Ready';
            visStatusBadge.className = 'vis-status-badge ready';
        }
    }

    // Generate Dropdown Options happens in initialization now.
    
    function visStopSorting() {
        VIS.isPlaying = false;
        VIS.isPaused = false;
        if (VIS.api) VIS.api.aborted = true;
        VIS.resolvers.forEach(r => r());
        VIS.resolvers = [];
        if (btnVisStart) {
            btnVisStart.disabled = !VIS.selectedAlgo;
            btnVisStart.innerHTML = '<span class="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">play_arrow</span>START SORTING';
        }
        if (btnVisStop) btnVisStop.disabled = true;
        if (visStatusBadge) {
            visStatusBadge.textContent = 'Ready';
            visStatusBadge.className = 'vis-status-badge ready';
        }
    }
    async function visStartSorting() {
        if (!VIS.selectedAlgo) return;
        VIS.isPlaying = true;
        VIS.isPaused = false;
        visGenerateArray();
        visRenderBars();

        VIS.api = new VisSortAPI();
        if (btnVisStart) {
            btnVisStart.innerHTML = '<span class="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">pause</span>PAUSE SORTING';
        }
        if (btnVisStop) btnVisStop.disabled = false;
        if (btnVisRestart) btnVisRestart.disabled = false;
        if (visStatusBadge) {
            visStatusBadge.textContent = 'Sorting';
            visStatusBadge.className = 'vis-status-badge sorting';
        }

        try {
            await algorithms[VIS.selectedAlgo].run(VIS.api);
            // Sort complete — persistent green sweep + status
            if (!VIS.api.aborted) {
                VIS.bars.forEach((bar, i) => {
                    setTimeout(() => {
                        bar.classList.add('sorted');
                        bar.style.background = '';
                        bar.style.boxShadow = '';
                    }, i * 12);
                });
                if (visStatusBadge) {
                    visStatusBadge.textContent = 'Complete!';
                    visStatusBadge.className = 'vis-status-badge complete';
                }
            }
        } catch (e) {
            if (e.message !== "Aborted") console.error(e);
        }

        if (!VIS.api.aborted) {
            VIS.isPlaying = false;
            if (btnVisStart) {
                btnVisStart.innerHTML = '<span class="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">play_arrow</span>START SORTING';
                btnVisStart.disabled = false;
            }
            if (btnVisStop) btnVisStop.disabled = true;
            // Clear highlighted line
            document.querySelectorAll('#vis-code-display div').forEach(el => {
                el.classList.remove('active-exec-line');
            });
        }
    }

    if (btnVisStart) {
        btnVisStart.addEventListener('click', () => {
            if (!VIS.isPlaying) {
                visStartSorting();
            } else if (VIS.isPaused) {
                // Resume
                VIS.isPaused = false;
                VIS.resolvers.forEach(r => r());
                VIS.resolvers = [];
                btnVisStart.innerHTML = '<span class="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">pause</span>PAUSE SORTING';
                if (visStatusBadge) {
                    visStatusBadge.textContent = 'Sorting';
                    visStatusBadge.className = 'vis-status-badge sorting';
                }
            } else {
                // Pause
                VIS.isPaused = true;
                btnVisStart.innerHTML = '<span class="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">play_arrow</span>RESUME SORTING';
                if (visStatusBadge) {
                    visStatusBadge.textContent = 'Paused';
                    visStatusBadge.className = 'vis-status-badge paused';
                }
            }
        });
    }

    if (btnVisStop) btnVisStop.addEventListener('click', () => {
        visStopSorting();
        if (VIS.selectedAlgo) { visGenerateArray(); visRenderBars(); }
    });

    if (btnVisRestart) btnVisRestart.addEventListener('click', () => {
        visStopSorting();
        if (VIS.selectedAlgo) {
            visGenerateArray();
            visRenderBars();
        }
    });

    // ==================== BENCHMARK PAGE ====================
    let benchStandaloneAlgo = null;
    let benchStandaloneData = null;
    let benchStandaloneTimeMs = 0;
    let benchStandaloneUnit = 'ms';
    let benchSTheoreticalBest = 0, benchSTheoreticalAvg = 0, benchSTheoreticalWorst = 0;

    const BSE = {
        // Data Sources
        genSlider: document.getElementById('bench-gen-slider'),
        genVal: document.getElementById('bench-gen-val'),
        btnGenerate: document.getElementById('btn-bench-generate'),
        file: document.getElementById('bench-standalone-file'),
        fileLabel: document.getElementById('bench-standalone-file-label'),
        fileActions: document.getElementById('bench-file-actions'),
        btnDeleteFile: document.getElementById('btn-bench-standalone-delete-file'),
        dataStatus: document.getElementById('bench-data-status'),
        statusN: document.getElementById('bench-s-n'),

        // Execution
        algoSection: document.getElementById('bench-algo-section'),
        btnRun: document.getElementById('btn-bench-standalone-run'),
        btnRunAll: document.getElementById('btn-bench-run-all'),
        algoName: document.getElementById('bench-standalone-algo-name'),

        // Results Container
        resultsWrapper: document.getElementById('bench-standalone-results'),
        
        // Single Results
        singleView: document.getElementById('bench-single-results-view'),
        status: document.getElementById('bench-s-status'),
        statusContainer: document.getElementById('bench-s-status-container'),
        actualTime: document.getElementById('bench-s-actual-time'),
        actualUnit: document.getElementById('bench-s-actual-unit'),
        comparisons: document.getElementById('bench-s-comparisons'),
        swaps: document.getElementById('bench-s-swaps'),
        diffBadge: document.getElementById('bench-s-diff-badge'),
        barActual: document.getElementById('bench-s-bar-actual'),
        barTheory: document.getElementById('bench-s-bar-theory'),
        barActualLabel: document.getElementById('bench-s-bar-actual-label'),
        barTheoryLabel: document.getElementById('bench-s-bar-theory-label'),
        theoryBest: document.getElementById('bench-s-theory-best'),
        theoryAvg: document.getElementById('bench-s-theory-avg'),
        theoryWorst: document.getElementById('bench-s-theory-worst'),

        // Suite Results
        suiteView: document.getElementById('bench-suite-results-view'),
        suiteCount: document.getElementById('bench-suite-count'),
        suiteN: document.getElementById('bench-suite-n'),
        suiteLeaderboard: document.getElementById('bench-suite-leaderboard')
    };

    function unlockAlgoSection(count) {
        if (!count || count <= 0) {
            BSE.algoSection.classList.add('opacity-50', 'pointer-events-none');
            BSE.dataStatus.classList.add('hidden');
            BSE.btnRun.disabled = true;
            return;
        }
        BSE.algoSection.classList.remove('opacity-50', 'pointer-events-none');
        BSE.dataStatus.classList.remove('hidden');
        BSE.dataStatus.classList.add('flex');
        BSE.statusN.innerHTML = `${count.toLocaleString()} <span class="text-[10px] text-slate-500 uppercase tracking-widest ml-1">Elements</span>`;
        
        // Show presortedness analysis
        const sortednessEl = document.getElementById('bench-data-sortedness');
        if (sortednessEl && benchStandaloneData) {
            const p = analyzePresortedness(benchStandaloneData);
            sortednessEl.textContent = `Presortedness: ${p.pIndex}% · Pattern: ${p.type}`;
        }
        
        if (benchStandaloneAlgo) BSE.btnRun.disabled = false;
    }

    // Auto-Generate Data
    if (BSE.genSlider) {
        BSE.genSlider.addEventListener('input', (e) => {
            BSE.genVal.textContent = Number(e.target.value).toLocaleString();
        });
    }

    if (BSE.btnGenerate) {
        BSE.btnGenerate.addEventListener('click', () => {
            const count = Number(BSE.genSlider.value) || 10000;
            const arr = [];
            for (let i = 0; i < count; i++) {
                arr.push(Math.floor(Math.random() * count) + 1);
            }
            benchStandaloneData = arr;
            
            // Clear file if any
            BSE.file.value = '';
            BSE.fileLabel.textContent = 'Click to browse file...';
            BSE.fileActions.classList.add('hidden');
            BSE.fileActions.classList.remove('flex');

            BSE.resultsWrapper.classList.add('hidden');
            BSE.resultsWrapper.classList.remove('flex');
            
            // Success animation
            BSE.btnGenerate.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> Generated!';
            BSE.btnGenerate.classList.replace('text-emerald-400', 'text-background-dark');
            BSE.btnGenerate.classList.replace('bg-emerald-500/20', 'bg-emerald-500');
            setTimeout(() => {
                BSE.btnGenerate.innerHTML = '<span class="material-symbols-outlined text-sm">memory</span> Generate Array Buffer';
                BSE.btnGenerate.classList.replace('text-background-dark', 'text-emerald-400');
                BSE.btnGenerate.classList.replace('bg-emerald-500', 'bg-emerald-500/20');
            }, 1000);

            unlockAlgoSection(arr.length);
        });
    }

    const btnBenchGenReset = document.getElementById('btn-bench-gen-reset');
    if (btnBenchGenReset) {
        btnBenchGenReset.addEventListener('click', (e) => {
            e.preventDefault();
            benchStandaloneData = null;
            benchStandaloneTimeMs = 0;
            BSE.resultsWrapper.classList.add('hidden');
            BSE.resultsWrapper.classList.remove('flex');
            unlockAlgoSection(0);
        });
    }

    function benchStandaloneOnAlgoSelect(key) {
        benchStandaloneAlgo = key;
        const algo = algorithms[key];
        if (BSE.algoName) BSE.algoName.textContent = algo.title.toUpperCase();
        if (BSE.btnRun && benchStandaloneData) BSE.btnRun.disabled = false;
    }

    buildAlgoGrid('bench-algo-grid', 'hover:border-emerald-500/40', benchStandaloneOnAlgoSelect);

    // File upload
    if (BSE.file) {
        BSE.file.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            // Validate file size (max 5MB)
            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            if (file.size > MAX_FILE_SIZE) {
                alert('File is too large. Maximum file size is 5MB.');
                BSE.fileLabel.textContent = 'File too large';
                return;
            }
            
            BSE.fileLabel.textContent = file.name;
            BSE.fileActions.classList.remove('hidden');
            BSE.fileActions.classList.add('flex');
            
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const text = evt.target.result;
                    const tokens = text.split(/[\s,]+/);
                    const nums = [];
                    for (let i = 0; i < tokens.length; i++) {
                        if (!tokens[i]) continue;
                        const num = Number(tokens[i]);
                        if (isFinite(num)) nums.push(num);
                    }
                    
                    if (nums.length > 0) {
                        benchStandaloneData = nums;
                        unlockAlgoSection(nums.length);
                        BSE.resultsWrapper.classList.add('hidden');
                        BSE.resultsWrapper.classList.remove('flex');
                        console.log('Successfully loaded', nums.length, 'elements from file');
                    } else {
                        benchStandaloneData = null;
                        unlockAlgoSection(0);
                        alert("Invalid Data Format. Found 0 numeric elements.");
                    }
                } catch (err) {
                    console.error('Error parsing benchmark file:', err);
                    alert('Error parsing file: ' + err.message);
                    BSE.fileLabel.textContent = 'Parse error';
                    benchStandaloneData = null;
                    unlockAlgoSection(0);
                }
            };
            reader.onerror = () => {
                alert('Error reading file. Please try again.');
                console.error('FileReader error');
                BSE.fileLabel.textContent = 'Read error';
                benchStandaloneData = null;
                unlockAlgoSection(0);
            };
            reader.readAsText(file);
        });
    }

    if (BSE.btnDeleteFile) {
        BSE.btnDeleteFile.addEventListener('click', (e) => {
            e.preventDefault(); // prevent triggering the label's click
            benchStandaloneData = null;
            benchStandaloneTimeMs = 0;
            BSE.file.value = '';
            BSE.fileLabel.textContent = 'Click to browse file...';
            BSE.fileActions.classList.add('hidden');
            BSE.fileActions.classList.remove('flex');
            BSE.resultsWrapper.classList.add('hidden');
            BSE.resultsWrapper.classList.remove('flex');
            unlockAlgoSection(0);
        });
    }

    // Unit selector buttons
    document.querySelectorAll('.bench-s-unit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            benchStandaloneUnit = btn.getAttribute('data-unit');
            document.querySelectorAll('.bench-s-unit-btn').forEach(b => {
                b.className = 'bench-s-unit-btn flex-1 sm:flex-none text-[10px] font-bold px-4 py-1.5 rounded-md text-slate-400 hover:text-emerald-400 transition-all';
            });
            btn.className = 'bench-s-unit-btn flex-1 sm:flex-none text-[10px] font-bold px-4 py-1.5 rounded-md bg-emerald-500/20 text-emerald-400 transition-all shadow-sm';
            if (benchStandaloneTimeMs > 0) updateBenchStandaloneDisplays();
        });
    });

    function updateBenchStandaloneDisplays() {
        if (!benchStandaloneAlgo) return;
        const u = benchStandaloneUnit;
        BSE.actualTime.textContent = displayTimeInUnit(benchStandaloneTimeMs, u);
        BSE.actualUnit.textContent = u;
        BSE.barActualLabel.textContent = displayTimeInUnit(benchStandaloneTimeMs, u) + ' ' + u;
        BSE.barTheoryLabel.textContent = displayTimeInUnit(benchSTheoreticalAvg, u) + ' ' + u;
        BSE.theoryBest.textContent = displayTimeInUnit(benchSTheoreticalBest, u) + ' ' + u;
        BSE.theoryAvg.textContent = displayTimeInUnit(benchSTheoreticalAvg, u) + ' ' + u;
        BSE.theoryWorst.textContent = displayTimeInUnit(benchSTheoreticalWorst, u) + ' ' + u;
    }

    function runInWorker(algo, dataArray) {
        return new Promise((resolve, reject) => {
            const runRawStr = algo.runRaw ? algo.runRaw.toString() : null;
            const workerCode = `
                self.onmessage = function(e) {
                    try {
                        const arr = e.data.arr;
                        const t0 = performance.now();
                        if (e.data.runRawStr) {
                            const runRaw = new Function('return ' + e.data.runRawStr)();
                            runRaw(arr);
                        } else {
                            arr.sort(function(a, b) { return a - b; });
                        }
                        const t1 = performance.now();
                        self.postMessage({ success: true, time: t1 - t0 });
                    } catch(err) {
                        self.postMessage({ success: false, error: err.message });
                    }
                };
            `;
            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));
            
            worker.onmessage = (e) => {
                if (e.data.success) resolve(e.data.time);
                else reject(new Error(e.data.error));
                worker.terminate();
            };
            worker.onerror = (err) => {
                reject(err);
                worker.terminate();
            };
            worker.postMessage({ arr: dataArray, runRawStr: runRawStr });
        });
    }

    // Single Run
    if (BSE.btnRun) {
        BSE.btnRun.addEventListener('click', async () => {
            if (!benchStandaloneData || !benchStandaloneAlgo) return;
            
            // UI State updates
            BSE.btnRun.innerHTML = '<span class="material-symbols-outlined text-sm animate-spin">sync</span> Running...';
            BSE.btnRun.disabled = true;
            BSE.resultsWrapper.classList.remove('hidden');
            BSE.resultsWrapper.classList.add('flex');
            BSE.singleView.classList.remove('hidden');
            BSE.singleView.classList.add('flex');
            BSE.suiteView.classList.add('hidden');
            BSE.suiteView.classList.remove('flex');
            
            BSE.status.textContent = "BENCHMARKING...";
            BSE.statusContainer.className = "flex items-center gap-2 text-sm font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-lg animate-pulse";
            await new Promise(r => setTimeout(r, 50));

            let comparisons = 0, swaps = 0;

            try {
                const algo = algorithms[benchStandaloneAlgo];
                const n = benchStandaloneData.length;
                
                // Measure 3 runs and take the median for stability
                const runs = [];
                for (let r = 0; r < 3; r++) {
                    const time = await runInWorker(algo, [...benchStandaloneData]);
                    runs.push(time);
                }
                runs.sort((a, b) => a - b);
                benchStandaloneTimeMs = runs[Math.floor(runs.length / 2)];

                // Estimate ops — check from most specific to least
                const avgC = algo.avg.replace(/\s/g, '');
                if (avgC.includes('nlogn') || avgC.includes('nlog')) { comparisons = Math.round(n * Math.log2(n)); swaps = Math.round(n * Math.log2(n) / 3); }
                else if (avgC.includes('n^2') || avgC.includes('n2')) { comparisons = Math.round(n * n / 2); swaps = Math.round(n * n / 4); }
                else if (avgC.includes('n')) { comparisons = n; swaps = n; }

                BSE.status.textContent = `${algo.title.toUpperCase()} SUCCESS`;
                BSE.statusContainer.className = "flex items-center gap-2 text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg";
                BSE.comparisons.textContent = Number(comparisons).toLocaleString();
                BSE.swaps.textContent = Number(swaps).toLocaleString();

                benchSTheoreticalBest = computeTheoreticalTimeMs(n, algo.best);
                benchSTheoreticalAvg = computeTheoreticalTimeMs(n, algo.avg);
                benchSTheoreticalWorst = computeTheoreticalTimeMs(n, algo.worst);
                updateBenchStandaloneDisplays();

                const diffPercent = ((benchStandaloneTimeMs - benchSTheoreticalAvg) / benchSTheoreticalAvg) * 100;
                if (Math.abs(diffPercent) < 5) {
                    BSE.diffBadge.textContent = 'â‰ˆ Matches Theory';
                    BSE.diffBadge.className = 'text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shrink-0';
                } else if (diffPercent < 0) {
                    BSE.diffBadge.textContent = `${Math.abs(diffPercent).toFixed(1)}% Faster`;
                    BSE.diffBadge.className = 'text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shrink-0';
                } else {
                    BSE.diffBadge.textContent = `${diffPercent.toFixed(1)}% Slower`;
                    BSE.diffBadge.className = 'text-[10px] font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/20 shrink-0';
                }

                const maxTime = Math.max(benchStandaloneTimeMs, benchSTheoreticalWorst, benchSTheoreticalAvg, 0.001);
                requestAnimationFrame(() => {
                    BSE.barActual.style.width = Math.max(Math.min((benchStandaloneTimeMs / maxTime) * 100, 100), 2) + '%';
                    BSE.barTheory.style.width = Math.max(Math.min((benchSTheoreticalAvg / maxTime) * 100, 100), 2) + '%';
                });
            } catch (err) {
                console.error(err);
                BSE.status.textContent = "EXECUTION ERROR";
                BSE.statusContainer.className = "flex items-center gap-2 text-sm font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-lg";
            }

            BSE.btnRun.innerHTML = '<span class="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">play_arrow</span> Run Selected Algorithm (<span class="font-mono text-xs tracking-wider">' + algorithms[benchStandaloneAlgo].title.toUpperCase() + '</span>)';
            BSE.btnRun.disabled = false;
        });
    }

    // Suite Run (Run All)
    if (BSE.btnRunAll) {
        BSE.btnRunAll.addEventListener('click', async () => {
            if (!benchStandaloneData) return;
            
            const originalText = BSE.btnRunAll.innerHTML;
            BSE.btnRunAll.innerHTML = '<span class="material-symbols-outlined text-sm animate-spin">sync</span> Running Suite...';
            BSE.btnRunAll.disabled = true;
            
            BSE.resultsWrapper.classList.remove('hidden');
            BSE.resultsWrapper.classList.add('flex');
            BSE.singleView.classList.add('hidden');
            BSE.singleView.classList.remove('flex');
            BSE.suiteView.classList.remove('hidden');
            BSE.suiteView.classList.add('flex');
            
            BSE.suiteLeaderboard.innerHTML = '<div class="text-center p-8 text-cyan-400 animate-pulse font-bold text-xs">Evaluating all algorithms...</div>';

            await new Promise(r => setTimeout(r, 100)); // Paint
            
            const results = [];
            const n = benchStandaloneData.length;
            const keys = Object.keys(algorithms);
            
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const algo = algorithms[key];
                
                // Show progress
                BSE.suiteLeaderboard.innerHTML = `<div class="text-center p-8 text-cyan-400 animate-pulse font-bold text-xs">Evaluating ${algo.title} (${i + 1}/${keys.length})...</div>`;
                await new Promise(r => setTimeout(r, 10));
                
                try {
                    // Measure 3 runs per algorithm and take the median
                    const runs = [];
                    for (let r = 0; r < 3; r++) {
                        const time = await runInWorker(algo, [...benchStandaloneData]);
                        runs.push(time);
                    }
                    runs.sort((a, b) => a - b);
                    const duration = runs[Math.floor(runs.length / 2)];
                    
                    results.push({
                        key: key,
                        title: algo.title,
                        time: duration,
                        color: algo.color || 'primary',
                        complex: algo.avg
                    });
                } catch(e) {
                    console.error("Suite error on", key, e);
                    results.push({ key, title: algo.title, time: Infinity, color: algo.color || 'rose-500', complex: 'ERROR' });
                }
            }
            
            // Sort by time
            results.sort((a, b) => a.time - b.time);
            
            BSE.suiteCount.textContent = results.length;
            BSE.suiteN.textContent = Number(n).toLocaleString();
            
            // Render Leaderboard
            BSE.suiteLeaderboard.innerHTML = '';
            const bestTime = results[0].time;
            const worstTime = results.filter(r => r.time !== Infinity).pop()?.time || 0.001;
            
            results.forEach((res, index) => {
                const row = document.createElement('div');
                row.className = 'grid grid-cols-12 gap-3 items-center hover:bg-white/5 p-2 rounded-lg transition-colors group border border-transparent hover:border-white/10';
                
                const rankColor = index === 0 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 
                                 (index < 3 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-slate-500 bg-white/5 border-white/5');
                
                const timeStr = res.time === Infinity ? 'FAIL' : displayTimeInUnit(res.time, benchStandaloneUnit) + ' ' + benchStandaloneUnit;
                const percent = res.time === Infinity ? 0 : Math.max(2, Math.sqrt(res.time / worstTime) * 100);
                
                let relStr = '';
                if (index === 0) relStr = '<span class="text-[9px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded ml-2">BASELINE</span>';
                else if (res.time !== Infinity) {
                    const mult = res.time / bestTime;
                    relStr = `<span class="text-[9px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded ml-2">${mult.toFixed(1)}x slower</span>`;
                }

                row.innerHTML = `
                    <div class="col-span-1 hidden sm:flex items-center justify-center">
                        <div class="size-6 rounded-md flex items-center justify-center font-bold textxs border ${rankColor}">
                            ${index + 1}
                        </div>
                    </div>
                    <div class="col-span-12 sm:col-span-4 flex flex-col justify-center">
                        <span class="text-white font-bold text-sm leading-tight flex items-center gap-2">
                            ${res.title}
                            ${index === 0 ? '<span class="material-symbols-outlined text-[14px] text-amber-400">workspace_premium</span>' : ''}
                        </span>
                        <span class="text-[9px] text-slate-500 font-mono mt-0.5">${res.complex}</span>
                    </div>
                    <div class="col-span-5 sm:col-span-3 text-right flex flex-col justify-center items-end">
                        <span class="${index === 0 ? 'text-amber-400' : 'text-cyan-400'} font-mono font-bold text-sm tracking-wide">
                            ${timeStr}
                        </span>
                    </div>
                    <div class="col-span-7 sm:col-span-4 pl-4 sm:pl-6 flex items-center h-full">
                        <div class="w-full flex items-center h-full">
                            <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex items-center">
                                <div class="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000 ease-out" style="width: ${percent}%"></div>
                            </div>
                            ${relStr}
                        </div>
                    </div>
                `;
                BSE.suiteLeaderboard.appendChild(row);
            });
            
            BSE.btnRunAll.innerHTML = originalText;
            BSE.btnRunAll.disabled = false;
        });
    }
});



/* =====================================================================
   DETAIL PAGE — MINI VISUALIZER ENGINE
   ===================================================================== */
(function () {
    /* ---- Color Palette ---- */
    const COLORS = {
        bar:      '#3b82f6',   // Blue — default idle bar
        compare:  '#00eeff',   // Neon cyan — comparing
        swap:     '#10b981',   // Emerald green — swapping
        set:      '#d946ef',   // Magenta — set/write
        done:     '#22c55e',   // Green — sort complete
    };

    const DVIS = {
        isPlaying: false,
        isPaused: false,
        array: [],
        bars: [],
        api: null,
        resolvers: [],
    };

    function dvisGetArena() { return document.getElementById('detail-vis-arena'); }
    function dvisGetOps() { return document.getElementById('detail-vis-ops'); }
    function dvisGetSizeSlider() { return document.getElementById('detail-vis-size'); }
    function dvisGetSpeedSlider() { return document.getElementById('detail-vis-speed'); }

    function dvisGenerateArray() {
        const sizeSlider = dvisGetSizeSlider();
        const size = parseInt(sizeSlider ? sizeSlider.value : 30);
        DVIS.array = [];
        for (let i = 0; i < size; i++) DVIS.array.push(Math.floor(Math.random() * 90) + 5);
    }

    function dvisRenderBars() {
        const arena = dvisGetArena();
        if (!arena) return;
        arena.querySelectorAll('.detail-bar').forEach(b => b.remove());
        const placeholder = document.getElementById('detail-vis-placeholder');
        if (placeholder) placeholder.classList.add('hidden');

        DVIS.bars = [];
        const gap = DVIS.array.length > 50 ? '0.5px' : '1px';
        DVIS.array.forEach(val => {
            const bar = document.createElement('div');
            bar.className = 'detail-bar flex-1 rounded-t-sm relative z-10';
            bar.style.cssText = `height:${val}%;background:${COLORS.bar};margin:0 ${gap};transition:height 60ms ease,background 120ms ease,transform 120ms ease;`;
            arena.appendChild(bar);
            DVIS.bars.push(bar);
        });
        const ops = dvisGetOps();
        if (ops) ops.textContent = '0';
    }

    /** Called by openModal to show default bars immediately */
    function dvisInit() {
        dvisGenerateArray();
        dvisRenderBars();
    }

    class DetailSortAPI {
        constructor() {
            this.arr = [...DVIS.array];
            this.bars = DVIS.bars;
            this.ops = 0;
            this.aborted = false;
        }

        updateOps() {
            const ops = dvisGetOps();
            if (ops) ops.textContent = this.ops.toLocaleString();
        }

        getDelay() {
            const slider = dvisGetSpeedSlider();
            const speed = parseInt(slider ? slider.value : 50);
            if (speed === 100) return 2;
            return Math.pow(101 - speed, 1.5) * 0.8;
        }

        async sleep() {
            if (this.aborted) throw new Error("Aborted");
            await new Promise(r => setTimeout(r, Math.max(this.getDelay(), 5)));
            while (DVIS.isPaused) {
                await new Promise(r => DVIS.resolvers.push(r));
                if (this.aborted) throw new Error("Aborted");
            }
        }

        async compare(i, j) {
            this.ops++;
            this.updateOps();
            this.bars[i].style.background = COLORS.compare;
            this.bars[i].style.transform = 'scaleY(1.06)';
            this.bars[i].classList.add('dvis-comparing');
            this.bars[j].style.background = COLORS.compare;
            this.bars[j].style.transform = 'scaleY(1.06)';
            this.bars[j].classList.add('dvis-comparing');
            await this.sleep();
            this.bars[i].classList.remove('dvis-comparing');
            this.bars[i].style.background = COLORS.bar;
            this.bars[i].style.transform = '';
            this.bars[i].style.boxShadow = '';
            this.bars[j].classList.remove('dvis-comparing');
            this.bars[j].style.background = COLORS.bar;
            this.bars[j].style.transform = '';
            this.bars[j].style.boxShadow = '';
            return this.arr[i] - this.arr[j];
        }

        async swap(i, j) {
            this.ops++;
            this.updateOps();
            let temp = this.arr[i]; this.arr[i] = this.arr[j]; this.arr[j] = temp;
            this.bars[i].style.height = `${this.arr[i]}%`;
            this.bars[j].style.height = `${this.arr[j]}%`;
            this.bars[i].style.background = COLORS.swap;
            this.bars[j].style.background = COLORS.swap;
            this.bars[i].style.transform = 'scaleY(1.1)';
            this.bars[j].style.transform = 'scaleY(1.1)';
            this.bars[i].classList.add('dvis-swapping');
            this.bars[j].classList.add('dvis-swapping');
            await this.sleep();
            this.bars[i].classList.remove('dvis-swapping');
            this.bars[j].classList.remove('dvis-swapping');
            this.bars[i].style.background = COLORS.bar;
            this.bars[j].style.background = COLORS.bar;
            this.bars[i].style.transform = '';
            this.bars[j].style.transform = '';
            this.bars[i].style.boxShadow = '';
            this.bars[j].style.boxShadow = '';
        }

        async set(i, val) {
            this.ops++;
            this.updateOps();
            this.arr[i] = val;
            this.bars[i].style.height = `${val}%`;
            this.bars[i].style.background = COLORS.set;
            this.bars[i].style.transform = 'scaleY(1.08)';
            this.bars[i].classList.add('dvis-setting');
            await this.sleep();
            this.bars[i].classList.remove('dvis-setting');
            this.bars[i].style.background = COLORS.bar;
            this.bars[i].style.transform = '';
            this.bars[i].style.boxShadow = '';
        }

        async markLine(lineNum) {
            if (this.aborted) throw new Error("Aborted");
            // Highlight the line in the execution tracker
            const codePanel = document.getElementById('detail-exec-code');
            const indicator = document.getElementById('detail-exec-line-indicator');
            if (codePanel) {
                // Remove previous highlight
                const prev = codePanel.querySelector('.exec-line-active');
                if (prev) prev.classList.remove('exec-line-active');
                // Add highlight to current line
                const lineEl = document.getElementById('dvis-exec-line-' + lineNum);
                if (lineEl) {
                    lineEl.classList.add('exec-line-active');
                    // Auto-scroll to keep the active line visible
                    lineEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            }
            if (indicator) indicator.textContent = 'Line: ' + lineNum;
            await new Promise(r => setTimeout(r, Math.max(this.getDelay() / 3, 5)));
        }
    }

    function dvisStop() {
        DVIS.isPlaying = false;
        DVIS.isPaused = false;
        if (DVIS.api) DVIS.api.aborted = true;
        DVIS.resolvers.forEach(r => r());
        DVIS.resolvers = [];
        const startBtn = document.getElementById('btn-start-visualization');
        if (startBtn) {
            startBtn.innerHTML = '<span class="material-symbols-outlined text-base">play_arrow</span> START';
        }
        // Clear line highlight
        const codePanel = document.getElementById('detail-exec-code');
        if (codePanel) {
            const prev = codePanel.querySelector('.exec-line-active');
            if (prev) prev.classList.remove('exec-line-active');
        }
        const indicator = document.getElementById('detail-exec-line-indicator');
        if (indicator) indicator.textContent = 'Line: —';
    }

    /** Populate the execution tracker code panel */
    function dvisPopulateTracker(algoId) {
        const tracker = document.getElementById('detail-code-tracker');
        const codePanel = document.getElementById('detail-exec-code');
        if (!tracker || !codePanel) return;

        const codeStr = window.algorithmCode && window.algorithmCode[algoId];
        if (!codeStr) {
            tracker.classList.add('hidden');
            return;
        }

        // Render code with exec-line IDs using the execution highlighter
        let html = codeStr
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        const lines = html.split('\n');
        codePanel.innerHTML = lines.map((line, i) => {
            const lineNum = String(i + 1).padStart(3, ' ');
            let coloredLine = line
                .replace(/(\/\/.*)/g, '<span style=color:#6a9955;font-style:italic;>$1</span>')
                .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, '<span style=color:#ce9178;>$1</span>')
                .replace(/\b(function|const|let|var|if|else|for|while|return|break|continue|new|typeof|class|extends|async|await)\b/g, '<span style=color:#c586c0;>$1</span>')
                .replace(/\b(\d+\.?\d*)\b/g, '<span style=color:#b5cea8;>$1</span>')
                .replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span style=color:#dcdcaa;>$1</span>')
                .replace(/\.(length|push|pop|slice|concat|floor|log)\b/g, '.<span style=color:#4fc1ff;>$1</span>');
            return `<div id="dvis-exec-line-${i + 1}" class="whitespace-pre"><span style="color:#858585;user-select:none;margin-right:1rem;">${lineNum}</span>${coloredLine}</div>`;
        }).join('');

        tracker.classList.remove('hidden');
    }

    async function dvisStart() {
        const algoId = currentModalAlgoId;
        if (!algoId || !algorithms[algoId]) {
            console.warn('[DetailVis] No algorithm selected:', algoId);
            return;
        }

        DVIS.isPlaying = true;
        DVIS.isPaused = false;
        dvisGenerateArray();
        dvisRenderBars();

        // Show code execution tracker
        dvisPopulateTracker(algoId);

        DVIS.api = new DetailSortAPI();
        const startBtn = document.getElementById('btn-start-visualization');
        if (startBtn) {
            startBtn.innerHTML = '<span class="material-symbols-outlined text-base">pause</span> PAUSE';
        }

        try {
            await algorithms[algoId].run(DVIS.api);
            // Sort complete — persistent cascading green
            if (!DVIS.api.aborted) {
                DVIS.bars.forEach((bar, i) => {
                    setTimeout(() => {
                        bar.classList.add('sorted');
                        bar.style.background = COLORS.done;
                        bar.style.boxShadow = `0 0 10px ${COLORS.done}60`;
                    }, i * 12);
                });
            }
        } catch (e) {
            if (e.message !== "Aborted") console.error('[DetailVis] Sort error:', e);
        }

        if (DVIS.api && !DVIS.api.aborted) {
            DVIS.isPlaying = false;
            if (startBtn) {
                startBtn.innerHTML = '<span class="material-symbols-outlined text-base">play_arrow</span> START';
            }
        }
    }

    // Expose functions globally
    window._dvisStop = dvisStop;
    window._dvisInit = dvisInit;

    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('btn-start-visualization');
        const stopBtn = document.getElementById('detail-vis-stop');
        const resetBtn = document.getElementById('detail-vis-reset');
        const sizeSlider = document.getElementById('detail-vis-size');

        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (!DVIS.isPlaying) {
                    dvisStart();
                } else if (DVIS.isPaused) {
                    DVIS.isPaused = false;
                    DVIS.resolvers.forEach(r => r());
                    DVIS.resolvers = [];
                    startBtn.innerHTML = '<span class="material-symbols-outlined text-base">pause</span> PAUSE';
                } else {
                    DVIS.isPaused = true;
                    startBtn.innerHTML = '<span class="material-symbols-outlined text-base">play_arrow</span> RESUME';
                }
            });
        }

        if (stopBtn) {
            stopBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dvisStop();
                if (currentModalAlgoId) { dvisGenerateArray(); dvisRenderBars(); }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dvisStop();
                if (currentModalAlgoId) { dvisGenerateArray(); dvisRenderBars(); }
            });
        }

        if (sizeSlider) {
            sizeSlider.addEventListener('input', () => {
                if (DVIS.isPlaying) { dvisStop(); }
                if (currentModalAlgoId) { dvisGenerateArray(); dvisRenderBars(); }
            });
        }
    });
})();



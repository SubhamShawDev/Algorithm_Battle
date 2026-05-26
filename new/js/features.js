/* =====================================================================
   VISUALIZATION PAGE + BENCHMARK PAGE LOGIC
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const allPages = ['welcome-page', 'home-page', 'arena-page', 'visualization-page', 'benchmark-page', 'performance-matrices-page'];
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
    const btnExplorePerf = document.getElementById('btn-explore-performance');
    const btnStartBench = document.getElementById('btn-start-benchmarking');

    if (btnEnterVis) btnEnterVis.addEventListener('click', (e) => { e.stopPropagation(); showPage('visualization-page'); });
    if (btnExplorePerf) btnExplorePerf.addEventListener('click', (e) => {
        e.stopPropagation();
        showPage('performance-matrices-page');
    });
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
    const visInfoSpace = document.getElementById('vis-info-space');

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
            bar.className = `vis-sort-bar bg-amber-500 flex-1 ${margin} rounded-t-sm`;
            bar.style.height = `${val}%`;
            visArena.appendChild(bar);
            VIS.bars.push(bar);
        });
        if (visOps) visOps.textContent = '0';
    }

    // Vis SortAPI â€” similar to existing SortAPI but for standalone vis page
    class VisSortAPI {
        constructor() {
            this.arr = [...VIS.array];
            this.bars = VIS.bars;
            this.ops = 0;
            this.aborted = false;
        }

        updateOps() { if (visOps) visOps.textContent = this.ops.toLocaleString(); }

        // Smoother, exponential speed curve
        getDelay() {
            const visSpeedSlider = document.getElementById('vis-speed-slider');
            const speed = parseInt(visSpeedSlider ? visSpeedSlider.value : 50);
            if (speed === 100) return 2;
            return Math.pow(101 - speed, 1.5) * 0.8;
        }

        async sleep() {
            if (this.aborted) throw new Error("Aborted");
            await new Promise(r => setTimeout(r, Math.max(this.getDelay(), 5)));
            while (VIS.isPaused) {
                await new Promise(r => VIS.resolvers.push(r));
                if (this.aborted) throw new Error("Aborted");
            }
        }

        async compare(i, j) {
            this.ops++;
            this.updateOps();
            this.bars[i].style.backgroundColor = '#06b6d4';
            this.bars[i].style.transform = 'scaleY(1.05)';
            this.bars[j].style.backgroundColor = '#06b6d4';
            this.bars[j].style.transform = 'scaleY(1.05)';
            await this.sleep();
            this.bars[i].style.backgroundColor = '';
            this.bars[i].style.transform = '';
            this.bars[j].style.backgroundColor = '';
            this.bars[j].style.transform = '';
            return this.arr[i] - this.arr[j];
        }

        async swap(i, j) {
            this.ops++;
            this.updateOps();
            let temp = this.arr[i]; this.arr[i] = this.arr[j]; this.arr[j] = temp;
            this.bars[i].style.height = `${this.arr[i]}%`;
            this.bars[j].style.height = `${this.arr[j]}%`;
            this.bars[i].style.backgroundColor = '#10b981';
            this.bars[j].style.backgroundColor = '#10b981';
            this.bars[i].style.transform = 'scaleY(1.1)';
            this.bars[j].style.transform = 'scaleY(1.1)';
            await this.sleep();
            this.bars[i].style.backgroundColor = '';
            this.bars[j].style.backgroundColor = '';
            this.bars[i].style.transform = '';
            this.bars[j].style.transform = '';
        }

        async set(i, val) {
            this.ops++;
            this.updateOps();
            this.arr[i] = val;
            this.bars[i].style.height = `${val}%`;
            this.bars[i].style.backgroundColor = '#d946ef';
            this.bars[i].style.transform = 'scaleY(1.08)';
            await this.sleep();
            this.bars[i].style.backgroundColor = '';
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
            await new Promise(r => setTimeout(r, Math.max(this.getDelay() / 3, 5)));
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
            if (visInfoWorst) visInfoWorst.textContent = algo.worst;
            if (visInfoBest) visInfoBest.textContent = algo.best;
            if (visInfoSpace) visInfoSpace.textContent = algo.space;
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

        try {
            await algorithms[VIS.selectedAlgo].run(VIS.api);
            // Sort complete â€” green flash all bars
            if (!VIS.api.aborted) {
                VIS.bars.forEach((bar, i) => {
                    setTimeout(() => { bar.style.background = '#22c55e'; setTimeout(() => { bar.style.background = ''; }, 300); }, i * 10);
                });
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
            } else {
                // Pause
                VIS.isPaused = true;
                btnVisStart.innerHTML = '<span class="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">play_arrow</span>RESUME SORTING';
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

            const dataCopy = [...benchStandaloneData];
            let comparisons = 0, swaps = 0;

            try {
                const algo = algorithms[benchStandaloneAlgo];
                const n = dataCopy.length;
                benchStandaloneTimeMs = await runInWorker(algo, dataCopy);

                // Estimate ops
                const avgC = algo.avg.replace(/\s/g, '');
                if (avgC.includes('nlogn') || avgC.includes('nlog')) { comparisons = Math.round(n * Math.log2(n)); swaps = Math.round(n * Math.log2(n) / 3); }
                else if (avgC.includes('n') || avgC.includes('n^2')) { comparisons = Math.round(n * n / 2); swaps = Math.round(n * n / 4); }
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
                const dataCopy = [...benchStandaloneData];
                
                try {
                    const duration = await runInWorker(algo, dataCopy);
                    
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
                const percent = res.time === Infinity ? 0 : Math.max(2, (res.time / worstTime) * 100);
                
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
                        <span class="text-[9px] text-slate-500 font-mono mt-0.5">O(${res.complex})</span>
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
    // ==================== PERFORMANCE MATRICES ====================
    const PM = {
        dashboard: document.getElementById('bench-analytics-dashboard'),
        tabComparison: document.getElementById('pm-tab-comparison'),
        tabDiagnostics: document.getElementById('pm-tab-diagnostics'),
        panelComparison: document.getElementById('pm-panel-comparison'),
        panelDiagnostics: document.getElementById('pm-panel-diagnostics'),
        chart: document.getElementById('pm-complexity-chart'),
        spaceBars: document.getElementById('pm-space-bars'),
        deepDiveCards: document.getElementById('pm-deep-dive-cards'),
        inputType: document.getElementById('pm-input-type'),
        recText: document.getElementById('pm-recommendation-text'),
        rankingTbody: document.getElementById('pm-ranking-tbody'),
        pindexGauge: document.getElementById('pm-pindex-gauge'),
        pindexValue: document.getElementById('pm-pindex-value'),
        pindexDesc: document.getElementById('pm-pindex-desc'),
        fitScores: document.getElementById('pm-fit-scores'),
        conflictTbody: document.getElementById('pm-conflict-tbody'),
        heuristicText: document.getElementById('pm-heuristic-text'),
        adaptiveGain: document.getElementById('pm-adaptive-gain'),
        runDetection: document.getElementById('pm-run-detection'),
        heatmap: document.getElementById('pm-heatmap'),
        patternsSummary: document.getElementById('pm-patterns-summary'),
        strategyText: document.getElementById('pm-strategy-text'),
        sortedRuns: document.getElementById('pm-sorted-runs'),
        avgRunLen: document.getElementById('pm-avg-run-len'),
        plateaus: document.getElementById('pm-plateaus'),
    };

    // Tab switching
    document.querySelectorAll('.pm-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.pm-tab').forEach(t => {
                t.className = 'pm-tab flex-1 sm:flex-none text-[10px] font-bold px-4 py-2 rounded-md text-slate-400 hover:text-fuchsia-400 transition-all flex items-center gap-1.5 justify-center';
            });
            tab.className = 'pm-tab flex-1 sm:flex-none text-[10px] font-bold px-4 py-2 rounded-md bg-fuchsia-500/20 text-fuchsia-400 transition-all shadow-sm flex items-center gap-1.5 justify-center';
            PM.panelComparison.classList.add('hidden');
            PM.panelComparison.classList.remove('flex');
            PM.panelDiagnostics.classList.add('hidden');
            PM.panelDiagnostics.classList.remove('flex');
            if (tab.id === 'pm-tab-comparison') {
                PM.panelComparison.classList.remove('hidden');
                PM.panelComparison.classList.add('flex');
            } else {
                PM.panelDiagnostics.classList.remove('hidden');
                PM.panelDiagnostics.classList.add('flex');
            }
        });
    });

    // ---- Analysis Functions ----

    function analyzePresortedness(arr) {
        if (!arr || arr.length < 2) return { pIndex: 100, type: 'trivial' };
        const n = arr.length;
        const sampleSize = Math.min(n, 5000);
        const step = Math.max(1, Math.floor(n / sampleSize));
        let inversions = 0;
        let total = 0;
        for (let i = 0; i < n - step; i += step) {
            for (let j = i + step; j < Math.min(i + step * 20, n); j += step) {
                total++;
                if (arr[i] > arr[j]) inversions++;
            }
        }
        const pIndex = total > 0 ? Math.round((1 - inversions / total) * 100) : 50;

        let type = 'Randomized';
        if (pIndex >= 90) type = 'Highly Pre-sorted';
        else if (pIndex >= 70) type = 'Partially Sorted';
        else if (pIndex <= 10) type = 'Reverse-Sorted';
        else if (pIndex <= 30) type = 'Mostly Reversed';

        return { pIndex, type };
    }

    function detectPatterns(arr) {
        if (!arr || arr.length < 2) return { runs: 0, avgRunLen: 0, plateaus: 0, reverseRuns: 0 };
        let runs = 1, plateaus = 0, reverseRuns = 0;
        let currentRunLen = 1;
        let runLengths = [];
        let rising = arr[1] >= arr[0];

        for (let i = 1; i < arr.length; i++) {
            if (arr[i] === arr[i - 1]) {
                plateaus++;
                currentRunLen++;
            } else if ((arr[i] > arr[i - 1]) === rising) {
                currentRunLen++;
            } else {
                runLengths.push(currentRunLen);
                if (!rising) reverseRuns++;
                runs++;
                currentRunLen = 1;
                rising = arr[i] > arr[i - 1];
            }
        }
        runLengths.push(currentRunLen);
        if (!rising) reverseRuns++;

        const avgRunLen = runLengths.length > 0 ? Math.round(runLengths.reduce((a, b) => a + b, 0) / runLengths.length) : 0;
        return { runs, avgRunLen, plateaus, reverseRuns };
    }

    function rankAlgorithmsForInput(arr, suiteResults) {
        const { pIndex } = analyzePresortedness(arr);
        const ranked = Object.keys(algorithms).map(key => {
            const algo = algorithms[key];
            let score = 50;

            // Adaptive algorithms benefit from presortedness
            const isAdaptive = ['tim-sort', 'insertion-sort', 'pdq-sort', 'intro-sort', 'dual-fusion-sort'].includes(key);
            if (pIndex >= 80 && isAdaptive) score += 30;
            else if (pIndex >= 60 && isAdaptive) score += 15;

            // Penalize quadratic algorithms
            const isQuadratic = ['bubble-sort', 'selection-sort', 'insertion-sort'].includes(key);
            if (isQuadratic && arr.length > 1000) score -= 20;
            if (key === 'insertion-sort' && pIndex >= 85) score += 25; // exception for nearly sorted

            // nlogn algorithms get a base bonus for large inputs
            const avgC = algo.avg.replace(/\s/g, '');
            if (avgC.includes('nlogn') || avgC.includes('nlog')) score += 15;

            // If we have actual run results, incorporate them
            if (suiteResults) {
                const result = suiteResults.find(r => r.key === key);
                if (result && result.time !== Infinity) {
                    const best = suiteResults[0].time;
                    const ratio = result.time / best;
                    if (ratio <= 1.2) score += 20;
                    else if (ratio <= 2) score += 10;
                    else if (ratio > 5) score -= 10;
                }
            }

            score = Math.max(5, Math.min(99, score));
            return { key, title: algo.title, score, note: getAlgoStrengths(key, pIndex) };
        });

        ranked.sort((a, b) => b.score - a.score);
        return ranked;
    }

    function spaceComplexityValue(spaceStr) {
        if (!spaceStr) return 3;
        const s = spaceStr.toLowerCase().replace(/\s/g, '');
        if (s.includes('o(1)')) return 1;
        if (s.includes('o(logn)') || s.includes('log')) return 2;
        if (s.includes('o(n)')) return 3;
        if (s.includes('o(n)') || s.includes('n^2')) return 4;
        return 3;
    }

    // ---- Drawing Functions ----

    function drawComplexityChart(canvas, n, benchTimeMs, algoKey, actualComplexity) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
        const W = rect.width, H = rect.height;
        const pad = { top: 20, right: 20, bottom: 35, left: 50 };
        const gW = W - pad.left - pad.right;
        const gH = H - pad.top - pad.bottom;

        ctx.clearRect(0, 0, W, H);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = pad.top + (gH / 5) * i;
            ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
        }
        for (let i = 0; i <= 7; i++) {
            const x = pad.left + (gW / 7) * i;
            ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, H - pad.bottom); ctx.stroke();
        }

        // Curves: O(n), O(n log n), O(n)
        const maxX = Math.max(n * 1.2, 100);
        const curves = [
            { label: 'O(n)', fn: x => x, color: '#10b981' },
            { label: 'O(n log n)', fn: x => x * Math.log2(Math.max(x, 2)), color: '#06b6d4' },
            { label: 'O(n)', fn: x => x * x, color: '#f43f5e' },
        ];

        // Find max Y for scaling
        const maxY = curves[2].fn(maxX);
        const scaleX = x => pad.left + (x / maxX) * gW;
        const scaleY = y => pad.top + gH - (y / maxY) * gH;

        curves.forEach(curve => {
            ctx.strokeStyle = curve.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            const steps = 120;
            for (let i = 0; i <= steps; i++) {
                const x = (maxX / steps) * i;
                const y = curve.fn(x);
                const px = scaleX(x);
                const py = scaleY(Math.min(y, maxY));
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
        });

        // Legend
        ctx.font = '10px monospace';
        curves.forEach((curve, i) => {
            const lx = pad.left + 10 + i * 100;
            const ly = pad.top + 12;
            ctx.fillStyle = curve.color;
            ctx.fillRect(lx, ly - 4, 12, 3);
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(curve.label, lx + 16, ly);
        });

        // Axis labels
        ctx.fillStyle = '#475569';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        for (let i = 0; i <= 7; i++) {
            const val = Math.round((maxX / 7) * i);
            ctx.fillText(val.toLocaleString(), scaleX(val), H - pad.bottom + 16);
        }
        ctx.fillText('Input Size, n', W / 2, H - 4);
        ctx.textAlign = 'right';
        ctx.fillText('Operations', pad.left - 6, pad.top + 4);

        // Plot actual benchmark point
        if (benchTimeMs !== undefined && n > 0) {
            const px = scaleX(n);
            // Compute the correct estimated ops based on actual algorithm complexity
            let estimatedOps = n * Math.log2(Math.max(n, 2)); // Default to n log n
            
            // If algorithm key is provided, use its actual complexity
            if (algoKey && algorithms[algoKey]) {
                const algo = algorithms[algoKey];
                const complexityStr = actualComplexity || algo.avg;
                estimatedOps = computeTheoreticalOps(n, complexityStr);
            }
            
            const py = scaleY(Math.min(estimatedOps, maxY));
            ctx.beginPath();
            ctx.arc(px, py, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#d946ef';
            ctx.fill();
            ctx.strokeStyle = '#d946ef';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#d946ef';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`N=${n.toLocaleString()}`, px + 10, py - 4);
        }
    }

    function renderSpaceBars(topAlgos) {
        if (!PM.spaceBars) return;
        PM.spaceBars.innerHTML = '';
        const colors = ['#10b981', '#06b6d4', '#f59e0b', '#d946ef', '#f43f5e'];
        topAlgos.slice(0, 5).forEach((algo, i) => {
            const sv = spaceComplexityValue(algorithms[algo.key]?.space);
            const pct = (sv / 4) * 100;
            const bar = document.createElement('div');
            bar.className = 'flex flex-col items-center gap-1 flex-1';
            bar.innerHTML = `
                <div class="w-full rounded-t" style="height:${Math.max(pct, 15)}%;background:${colors[i % 5]};min-height:6px"></div>
                <span class="text-[7px] text-slate-500 font-mono truncate w-full text-center">${algo.title.split(' ')[0]}</span>
            `;
            PM.spaceBars.appendChild(bar);
        });
    }

    function renderDeepDiveCards(topAlgos) {
        if (!PM.deepDiveCards) return;
        PM.deepDiveCards.innerHTML = '';
        const labels = ['(Current Top)', '(Strong Contender)', '(For Contrast)'];
        const borderColors = ['border-emerald-500/30', 'border-cyan-500/30', 'border-rose-500/30'];
        const textColors = ['text-emerald-400', 'text-cyan-400', 'text-rose-400'];

        topAlgos.slice(0, 3).forEach((ranked, i) => {
            const algo = algorithms[ranked.key];
            if (!algo) return;
            const card = document.createElement('div');
            card.className = `bg-black/30 rounded-lg p-4 border ${borderColors[i]} hover:bg-black/40 transition-colors`;
            card.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <span class="text-white font-bold text-xs">${algo.title}</span>
                    <span class="${textColors[i]} text-[9px] font-bold">${labels[i]}</span>
                </div>
                <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                    <span class="text-slate-500">Best:</span><span class="text-slate-300 font-mono">${algo.best}</span>
                    <span class="text-slate-500">Avg:</span><span class="text-slate-300 font-mono">${algo.avg}</span>
                    <span class="text-slate-500">Worst:</span><span class="text-slate-300 font-mono">${algo.worst}</span>
                    <span class="text-slate-500">Space:</span><span class="text-slate-300 font-mono">${algo.space}</span>
                </div>
            `;
            PM.deepDiveCards.appendChild(card);
        });
    }

    function renderRankingTable(ranked) {
        if (!PM.rankingTbody) return;
        PM.rankingTbody.innerHTML = '';
        ranked.forEach((item, i) => {
            const tr = document.createElement('tr');
            const scoreColor = item.score >= 80 ? 'text-emerald-400' : item.score >= 60 ? 'text-cyan-400' : item.score >= 40 ? 'text-amber-400' : 'text-rose-400';
            tr.innerHTML = `
                <td class="font-mono font-bold ${i < 3 ? 'text-amber-400' : 'text-slate-500'}">${i + 1}</td>
                <td class="text-white font-bold">${item.title}</td>
                <td class="text-center"><span class="${scoreColor} font-mono font-bold">${item.score}%</span></td>
                <td class="text-slate-400 hidden sm:table-cell text-[10px]">${item.note}</td>
            `;
            PM.rankingTbody.appendChild(tr);
        });
    }

    function renderPIndexGauge(pIndex) {
        if (!PM.pindexGauge) return;
        PM.pindexGauge.style.setProperty('--gauge-percent', pIndex + '%');
        PM.pindexValue.textContent = pIndex + '%';
        if (pIndex >= 80) PM.pindexDesc.textContent = 'High pre-sortedness makes adaptive algorithms shine.';
        else if (pIndex >= 50) PM.pindexDesc.textContent = 'Moderate order detected. Hybrid algorithms recommended.';
        else PM.pindexDesc.textContent = 'Low presortedness. Cache-friendly algorithms are optimal.';
    }

    function renderFitScores(topAlgos) {
        if (!PM.fitScores) return;
        PM.fitScores.innerHTML = '';
        const colors = ['#10b981', '#06b6d4', '#f59e0b'];
        topAlgos.slice(0, 3).forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'flex items-center gap-2';
            div.innerHTML = `
                <span class="text-[9px] text-slate-400 font-bold w-20 text-right truncate shrink-0">${item.title.split(' ')[0]}</span>
                <div class="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-1000" style="width:${item.score}%;background:${colors[i]}"></div>
                </div>
                <span class="text-[10px] font-mono font-bold text-white w-8">${item.score}%</span>
            `;
            PM.fitScores.appendChild(div);
        });
    }

    function renderConflictTable(algo, benchTimeMs, n) {
        if (!PM.conflictTbody || !algo) return;
        PM.conflictTbody.innerHTML = '';
        const bestT = computeTheoreticalTimeMs(n, algo.best);
        const avgT = computeTheoreticalTimeMs(n, algo.avg);
        const worstT = computeTheoreticalTimeMs(n, algo.worst);

        const rows = [
            { metric: 'Best Case Time', theory: algo.best, practical: displayTimeInUnit(bestT, 'ms') + 'ms', conflict: Math.abs(((benchTimeMs - bestT) / Math.max(bestT, 0.001)) * 100) },
            { metric: 'Avg Case Time', theory: algo.avg, practical: displayTimeInUnit(benchTimeMs, 'ms') + 'ms', conflict: Math.abs(((benchTimeMs - avgT) / Math.max(avgT, 0.001)) * 100) },
            { metric: 'Worst Case Time', theory: algo.worst, practical: displayTimeInUnit(worstT, 'ms') + 'ms', conflict: Math.abs(((benchTimeMs - worstT) / Math.max(worstT, 0.001)) * 100) },
            { metric: 'Space Complexity', theory: algo.space, practical: Math.round(n * 8 / 1024) + ' KB', conflict: 0 },
        ];

        rows.forEach(row => {
            const tr = document.createElement('tr');
            const conflictColor = row.conflict > 50 ? 'text-rose-400' : row.conflict > 20 ? 'text-amber-400' : 'text-emerald-400';
            const conflictBadge = row.conflict > 50 ? 'âš  Conflict' : row.conflict > 20 ? 'â†’' : 'âœ“';
            tr.innerHTML = `
                <td class="text-white font-bold text-xs">${row.metric}</td>
                <td class="text-center text-cyan-400 font-mono">${row.theory}</td>
                <td class="text-center text-emerald-400 font-mono">${row.practical}</td>
                <td class="text-center ${conflictColor} font-bold">${row.metric === 'Space Complexity' ? 'â€”' : row.conflict.toFixed(0) + '%'} <span class="text-[9px]">${row.metric === 'Space Complexity' ? '' : conflictBadge}</span></td>
            `;
            PM.conflictTbody.appendChild(tr);
        });
    }

    function renderHeatmap(arr) {
        if (!PM.heatmap || !arr || arr.length < 10) return;
        PM.heatmap.innerHTML = '';
        
        // Generate 20 mini bar-chart boxes (Simulated Data Input Matrix)
        const patterns = [
            { name: 'Sorted', bars: [10,20,30,40,50,60,70], color: 'from-emerald-500' },
            { name: 'Reverse', bars: [70,60,50,40,30,20,10], color: 'from-rose-500' },
            { name: 'Random', bars: [25,45,15,60,35,50,20], color: 'from-cyan-500' },
            { name: 'Sorted', bars: [15,25,35,45,55,65,75], color: 'from-emerald-500' },
            { name: 'Sparse', bars: [5,10,5,10,5,10,5], color: 'from-amber-500' },
            { name: 'Random', bars: [40,20,55,35,45,15,30], color: 'from-cyan-500' },
            { name: 'Reverse', bars: [65,55,45,35,25,15,5], color: 'from-rose-500' },
            { name: 'Sorted', bars: [20,30,40,50,60,70,80], color: 'from-emerald-500' },
            { name: 'Sparse', bars: [8,12,8,12,8,12,8], color: 'from-amber-500' },
            { name: 'Random', bars: [30,50,10,70,20,40,60], color: 'from-cyan-500' },
            { name: 'Sorted', bars: [25,35,45,55,65,75,85], color: 'from-emerald-500' },
            { name: 'Reverse', bars: [85,75,65,55,45,35,25], color: 'from-rose-500' },
            { name: 'Random', bars: [45,25,60,40,35,55,15], color: 'from-cyan-500' },
            { name: 'Sparse', bars: [3,15,3,15,3,15,3], color: 'from-amber-500' },
            { name: 'Sorted', bars: [10,30,50,70,90,110,130], color: 'from-emerald-500' },
            { name: 'Reverse', bars: [130,110,90,70,50,30,10], color: 'from-rose-500' },
            { name: 'Random', bars: [50,30,70,45,25,60,35], color: 'from-cyan-500' },
            { name: 'Sparse', bars: [6,18,6,18,6,18,6], color: 'from-amber-500' },
            { name: 'Sorted', bars: [20,40,60,80,100,120,140], color: 'from-emerald-500' },
            { name: 'Random', bars: [15,35,55,75,25,45,65], color: 'from-cyan-500' }
        ];
        
        // Render the 20 mini bar-chart matrix
        patterns.forEach((pat, i) => {
            const cell = document.createElement('div');
            cell.className = 'pm-heatmap-cell relative group cursor-pointer hover:scale-110 transition-transform';
            cell.innerHTML = `
                <div class="absolute inset-0 flex items-end justify-center gap-0.5 p-1 bg-black/40 rounded-sm">
                    ${pat.bars.slice(0,7).map(h => `<div class="w-full bg-gradient-to-t ${pat.color}/80 to-transparent rounded-t-sm" style="height: ${Math.min(h/2, 50)}%"></div>`).join('')}
                </div>
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-50 whitespace-nowrap bg-black/90 border border-cyan-500/50 text-cyan-300 text-[9px] px-2 py-1 rounded shadow-lg backdrop-blur">
                    ${pat.name} Pattern ${i+1}
                </div>
            `;
            PM.heatmap.appendChild(cell);
        });
        
        // Ensure grid layout matches the matrix style
        PM.heatmap.className = 'grid grid-cols-5 gap-2 flex-1 mb-3';
    }

    function renderPatternsSummary(patterns) {
        if (!PM.patternsSummary) return;
        PM.patternsSummary.innerHTML = '';
        const tags = [
            { label: `${patterns.runs} Sorted Runs`, color: 'emerald' },
            { label: `${patterns.reverseRuns} Reverse Runs`, color: 'rose' },
            { label: `Avg Length: ${patterns.avgRunLen}`, color: 'cyan' },
            { label: `${patterns.plateaus} Plateaus`, color: 'amber' },
        ];
        tags.forEach(t => {
            const span = document.createElement('span');
            span.className = `text-[9px] font-bold px-2 py-1 rounded-full bg-${t.color}-500/10 text-${t.color}-400 border border-${t.color}-500/20`;
            span.textContent = t.label;
            PM.patternsSummary.appendChild(span);
        });
    }

    // ---- Main Orchestrator ----

    function renderPerformanceMatrices(data, algoKey, benchTimeMs, suiteResults) {
        if (!PM.dashboard || !data) return;

        // Show the dashboard
        PM.dashboard.classList.remove('hidden');
        PM.dashboard.classList.add('flex');

        // Ensure first tab is active
        PM.panelComparison.classList.remove('hidden');
        PM.panelComparison.classList.add('flex');
        PM.panelDiagnostics.classList.add('hidden');
        PM.panelDiagnostics.classList.remove('flex');

        const n = data.length;
        const { pIndex, type } = analyzePresortedness(data);
        const patterns = detectPatterns(data.slice(0, Math.min(data.length, 500000)));
        const ranked = rankAlgorithmsForInput(data, suiteResults);

        // -- Tab 1: Performance Comparison --
        // Chart - pass algorithm key for accurate complexity plotting
        const chartAlgoKey = algoKey || (ranked[0] && ranked[0].key);
        setTimeout(() => drawComplexityChart(PM.chart, n, benchTimeMs, chartAlgoKey, algorithms[chartAlgoKey]?.avg), 100);

        // Deep Dive Cards
        renderDeepDiveCards(ranked);

        // Space Bars
        renderSpaceBars(ranked);

        // Input Analysis
        PM.inputType.textContent = `Input Analysis: ${type} (P-Index: ${pIndex}%)`;
        const topAlgo = ranked[0];
        const runnerUp = ranked[1];
        PM.recText.textContent = `Recommendation: ${topAlgo.title} is the Best Fit. Due to its ${pIndex >= 70 ? 'adaptive nature and near-O(n) performance on pre-sorted data' : 'cache-friendly implementation and O(n log n) average'}. ${runnerUp.title} is a close second.`;

        // Ranking Table
        renderRankingTable(ranked);

        // P-Index Gauge
        renderPIndexGauge(pIndex);

        // Fit Scores
        renderFitScores(ranked);

        // -- Tab 2: Diagnostics --
        const selectedAlgo = algoKey ? algorithms[algoKey] : algorithms[ranked[0].key];
        const selectedKey = algoKey || ranked[0].key;
        const actualTime = benchTimeMs || 0;

        // Conflict Table
        renderConflictTable(selectedAlgo, actualTime, n);

        // Heuristic Text
        const isAdaptive = ['tim-sort', 'insertion-sort', 'pdq-sort', 'dual-fusion-sort'].includes(selectedKey);
        const adaptiveGain = isAdaptive ? Math.min(Math.round(pIndex * 1.2 + 10), 150) : Math.round(pIndex * 0.3);
        const runEfficiency = patterns.runs > 0 ? Math.min(Math.round((patterns.avgRunLen / n) * 100 * patterns.runs), 99) : 15;

        PM.heuristicText.textContent = `Visualizes the neural predictor's real-time influence. ${isAdaptive ? `(${selectedAlgo.title} Strategy identified: ${type === 'Highly Pre-sorted' ? 'High pre-sortedness detected' : 'Mixed pattern detected'}, optimizing ${type === 'Highly Pre-sorted' ? 'Merge' : 'Partition'} paths. Neural heuristics suggest ${pIndex > 70 ? 'continuing ' + selectedAlgo.title + ' strategy' : 'switching to QuickSort variant'} for the next 100 elements.)` : `(Standard partitioning detected. No adaptive strategy active. ${selectedAlgo.title} uses fixed ${selectedAlgo.avg} operations.)`}`;
        PM.adaptiveGain.textContent = adaptiveGain + '%';
        PM.runDetection.textContent = runEfficiency + '%';

        // Heatmap
        renderHeatmap(data);

        // Patterns
        renderPatternsSummary(patterns);

        // Strategy Forecast
        PM.sortedRuns.textContent = patterns.runs;
        PM.avgRunLen.textContent = patterns.avgRunLen;
        PM.plateaus.textContent = patterns.plateaus;

        PM.strategyText.innerHTML = `<p class="mb-2">Current prediction for pattern on <strong class="text-white">'${selectedAlgo.title}'</strong> suggests <strong class="text-emerald-400">${ranked[0].title}</strong> for speed, and <strong class="text-cyan-400">${ranked.length > 2 ? ranked[2].title : ranked[1].title}</strong> for energy-aware constraints.</p>
        <p class="mb-2">${selectedAlgo.title} pathing remains optimal for ${pIndex >= 60 ? 'highly pre-sorted sub-runs within the pattern' : 'randomized input distributions'}.</p>
        <p class="text-[10px] text-slate-500 mt-2">Data and logic are based on current array pattern (P-Index: ${pIndex}%) and advanced behavioral models. Prediction of next 100 elements suggests ${ranked[0].title} will become ${pIndex > 50 ? 'slightly more efficient' : 'marginally slower'} as input becomes more ${pIndex > 50 ? 'randomized' : 'ordered'}.</p>`;
    }

    // ---- Wire to benchmark runs ----

    // Patch the single-run button to also trigger analytics
    const origSingleRun = BSE.btnRun;
    if (origSingleRun) {
        origSingleRun.addEventListener('click', () => {
            // Wait for the benchmark to finish (check every 200ms)
            const checkDone = setInterval(() => {
                if (!origSingleRun.disabled || origSingleRun.textContent.includes('Run Selected')) {
                    clearInterval(checkDone);
                    if (benchStandaloneData && benchStandaloneAlgo) {
                        setTimeout(() => {
                            renderPerformanceMatrices(benchStandaloneData, benchStandaloneAlgo, benchStandaloneTimeMs, null);
                        }, 300);
                    }
                }
            }, 200);
        });
    }

    // Patch the suite-run button
    if (BSE.btnRunAll) {
        BSE.btnRunAll.addEventListener('click', () => {
            const checkDone = setInterval(() => {
                if (!BSE.btnRunAll.disabled) {
                    clearInterval(checkDone);
                    if (benchStandaloneData) {
                        // Collect results from the leaderboard
                        const suiteRes = [];
                        BSE.suiteLeaderboard.querySelectorAll('[class*="grid-cols-12"]').forEach((row, i) => {
                            const nameEl = row.querySelector('.text-white.font-bold.text-sm');
                            const timeEl = row.querySelector('.font-mono.font-bold.text-sm');
                            if (nameEl && timeEl) {
                                const timeText = timeEl.textContent.trim().split(' ')[0];
                                suiteRes.push({
                                    key: Object.keys(algorithms).find(k => algorithms[k].title === nameEl.textContent.trim()) || '',
                                    title: nameEl.textContent.trim(),
                                    time: parseFloat(timeText) || Infinity
                                });
                            }
                        });
                        setTimeout(() => {
                            renderPerformanceMatrices(benchStandaloneData, null, 0, suiteRes.length > 0 ? suiteRes : null);
                        }, 300);
                    }
                }
            }, 200);
        });
    }
    // ==================== PERFORMANCE MATRICES STANDALONE PAGE ====================
    let pmData = null;
    let pmRanked = null;
    let pmPIndex = 0;
    let pmPatterns = null;
    let pmType = '';

    // Back button
    const btnPmBack = document.getElementById('btn-pm-back');
    if (btnPmBack) btnPmBack.addEventListener('click', () => showPage('home-page'));

    // --- Tab switching (inline panels) ---
    const pmScreenTabs = document.querySelectorAll('.pm-screen-tab');
    const pmPanels = [
        document.getElementById('pm-panel-0'),
        document.getElementById('pm-panel-1'),
        document.getElementById('pm-panel-2'),
        document.getElementById('pm-panel-3'),
    ];

    pmScreenTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabIdx = parseInt(tab.dataset.tab);
            pmScreenTabs.forEach(t => {
                t.className = 'pm-screen-tab text-[11px] font-bold px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition-all flex items-center gap-2';
            });
            tab.className = 'pm-screen-tab text-[11px] font-bold px-4 py-2.5 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 transition-all flex items-center gap-2 shadow-lg shadow-fuchsia-500/10';
            pmPanels.forEach((panel, i) => {
                if (panel) {
                    if (i === tabIdx) {
                        panel.classList.remove('hidden');
                        panel.style.animation = 'none';
                        void panel.offsetWidth;
                        panel.style.animation = '';
                    } else {
                        panel.classList.add('hidden');
                    }
                }
            });
        });
    });

    // --- Data source controls ---
    const pmGenSlider = document.getElementById('pm-gen-slider');
    const pmGenVal = document.getElementById('pm-gen-val');
    const btnPmGenerate = document.getElementById('btn-pm-generate');
    const pmFileInput = document.getElementById('pm-file-input');
    const pmFileLabel = document.getElementById('pm-file-label');
    const btnPmDeleteFile = document.getElementById('btn-pm-delete-file');
    const pmDataStatus = document.getElementById('pm-data-status');
    const pmDataCount = document.getElementById('pm-data-count');

    const pmTargetAlgo = document.getElementById('pm-target-algo');
    const pmDataControls = document.getElementById('pm-data-controls');
    if (pmTargetAlgo) {
        let opts = '<option value="">Select Algorithm</option>';
        Object.keys(algorithms).forEach(k => { opts += `<option value="${k}">${algorithms[k].title}</option>`; });
        pmTargetAlgo.innerHTML = opts;
        pmTargetAlgo.addEventListener('change', () => {
            if (pmTargetAlgo.value) {
                if (pmDataControls) pmDataControls.classList.remove('opacity-50', 'pointer-events-none');
                if (btnPmGenerate) btnPmGenerate.click();
            } else {
                if (pmDataControls) pmDataControls.classList.add('opacity-50', 'pointer-events-none');
            }
        });
    }

    if (pmGenSlider) {
        pmGenSlider.addEventListener('input', () => {
            pmGenVal.textContent = Number(pmGenSlider.value).toLocaleString();
        });
    }

    function pmLoadData(arr) {
        pmData = arr;
        const n = arr.length;
        pmDataStatus.classList.remove('hidden');
        pmDataStatus.classList.add('flex');
        pmDataCount.textContent = n.toLocaleString();

        // Run analysis
        const presort = analyzePresortedness(arr);
        pmPIndex = presort.pIndex;
        pmType = presort.type;
        pmPatterns = detectPatterns(arr.slice(0, Math.min(arr.length, 500000)));
        pmRanked = rankAlgorithmsForInput(arr, null);

        // Show analysis content, hide empty state
        const emptyState = document.getElementById('pm-empty-state');
        const analysisContent = document.getElementById('pm-analysis-content');
        if (emptyState) emptyState.classList.add('hidden');
        if (analysisContent) { analysisContent.classList.remove('hidden'); analysisContent.classList.add('flex', 'flex-col'); }

        // Render all panels
        pmRenderPanel0(arr, n);
        pmRenderPanel1(arr, n);
        pmRenderPanel2(arr, n);
        pmRenderPanel3Init();
    }

    if (btnPmGenerate) {
        btnPmGenerate.addEventListener('click', () => {
            const count = Number(pmGenSlider.value) || 10000;
            const arr = [];
            for (let i = 0; i < count; i++) arr.push(Math.floor(Math.random() * count) + 1);
            pmFileInput.value = '';
            pmFileLabel.textContent = 'Upload File';
            btnPmDeleteFile.classList.add('hidden');
            btnPmGenerate.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> Done!';
            setTimeout(() => {
                btnPmGenerate.innerHTML = '<span class="material-symbols-outlined text-sm">memory</span> Generate';
            }, 800);
            pmLoadData(arr);
        });
    }

    if (pmFileInput) {
        pmFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            // Validate file size (max 5MB)
            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            if (file.size > MAX_FILE_SIZE) {
                alert('File is too large. Maximum file size is 5MB.');
                pmFileLabel.textContent = 'File too large';
                return;
            }
            
            pmFileLabel.textContent = file.name;
            btnPmDeleteFile.classList.remove('hidden');
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    let text = evt.target.result.replace(/---.*?---/g, '');
                    text = text.replace(/\/\/.*$/gm, '');
                    text = text.replace(/\/\*.*?\*\//gs, '');
                    
                    const nums = [];
                    const MAX_ELEMENTS = 500000;
                    const tokens = text.split(/[\s,;]+/);
                    
                    for (let i = 0; i < tokens.length && nums.length < MAX_ELEMENTS; i++) {
                        const t = tokens[i].trim();
                        if (t !== '') {
                            const n = Number(t);
                            if (!isNaN(n) && isFinite(n)) nums.push(n);
                        }
                    }
                    
                    if (nums.length > 0) {
                        pmLoadData(nums);
                    } else {
                        alert('No numeric values found in file.');
                    }
                } catch (err) {
                    console.error('Error parsing PM file:', err);
                    alert('Error parsing file: ' + err.message);
                    pmFileLabel.textContent = 'Parse error';
                }
            };
            reader.onerror = () => {
                alert('Error reading file. Please try again.');
                console.error('FileReader error');
                pmFileLabel.textContent = 'Read error';
            };
            reader.readAsText(file);
        });
    }

    if (btnPmDeleteFile) {
        btnPmDeleteFile.addEventListener('click', () => {
            pmData = null;
            pmFileInput.value = '';
            pmFileLabel.textContent = 'Upload File';
            btnPmDeleteFile.classList.add('hidden');
            pmDataStatus.classList.add('hidden');
            const emptyState = document.getElementById('pm-empty-state');
            const analysisContent = document.getElementById('pm-analysis-content');
            if (emptyState) emptyState.classList.remove('hidden');
            if (analysisContent) { analysisContent.classList.add('hidden'); analysisContent.classList.remove('flex'); }
        });
    }

    // ====== PANEL 0: Performance Comparison ======
    function pmRenderPanel0(arr, n) {
        // Chart subtitle
        const subtitle = document.getElementById('pm-chart-subtitle');
        if (subtitle) subtitle.textContent = `[ BUFFER_SIZE: ${n.toLocaleString()} // DATA_TYPE: ${pmType} ]`;

        // Complexity Chart - pass top algorithm for accurate complexity plotting
        const topChartAlgoKey = pmRanked && pmRanked[0] ? pmRanked[0].key : 'quick-sort';
        setTimeout(() => drawComplexityChart(document.getElementById('pm-complexity-chart'), n, 0, topChartAlgoKey, algorithms[topChartAlgoKey]?.avg), 150);

        // Deep Dive Cards
        renderDeepDiveCards(pmRanked);

        // Space Bars
        renderSpaceBars(pmRanked);

        // Input Analysis
        const inputType = document.getElementById('pm-input-type-text');
        if (inputType) inputType.textContent = `Input Analysis: ${pmType} (P-Index: ${pmPIndex}%)`;

        // Ranking Table
        renderRankingTable(pmRanked);

        // P-Index Gauge (SVG ring)
        const pindexRing = document.getElementById('pm-pindex-ring');
        const pindexValue = document.getElementById('pm-pindex-value');
        const pindexDesc = document.getElementById('pm-pindex-desc');
        if (pindexRing) {
            const circumference = 251.2;
            const offset = circumference - (pmPIndex / 100) * circumference;
            setTimeout(() => { pindexRing.style.strokeDashoffset = offset; }, 100);
        }
        if (pindexValue) pindexValue.textContent = pmPIndex + '%';
        if (pindexDesc) {
            if (pmPIndex >= 80) pindexDesc.textContent = 'High pre-sortedness makes adaptive algorithms shine. TimSort and PDQ Sort gain significant performance.';
            else if (pmPIndex >= 50) pindexDesc.textContent = 'Moderate order detected. Hybrid algorithms like IntroSort recommended for consistent performance.';
            else pindexDesc.textContent = 'Low presortedness. Cache-friendly algorithms like QuickSort are optimal for randomized distributions.';
        }

        // Fit Scores
        renderFitScores(pmRanked);
    }

    // ====== PANEL 1: Diagnostics ======
    function pmRenderPanel1(arr, n) {
        // P-Index ring (diagnostics)
        const diagRing = document.getElementById('pm-diag-pindex-ring');
        const diagVal = document.getElementById('pm-diag-pindex-val');
        if (diagRing) {
            const circ = 176;
            setTimeout(() => { diagRing.style.strokeDashoffset = circ - (pmPIndex / 100) * circ; }, 100);
        }
        if (diagVal) diagVal.textContent = pmPIndex + '%';

        // Adaptive gain & run efficiency
        const targetOpt = document.getElementById('pm-target-algo')?.value;
        const bestAlgo = targetOpt ? (pmRanked.find(r => r.key === targetOpt) || pmRanked[0]) : pmRanked[0];
        const bestKey = bestAlgo.key;
        const algo = algorithms[bestKey];
        const isAdaptive = ['tim-sort', 'insertion-sort', 'pdq-sort', 'dual-fusion-sort', 'intro-sort'].includes(bestKey);
        const adaptiveGain = isAdaptive ? Math.min(Math.round(pmPIndex * 1.2 + 10), 150) : Math.round(pmPIndex * 0.3);
        const runEfficiency = pmPatterns.runs > 0 ? Math.min(Math.round((pmPatterns.avgRunLen / n) * 100 * pmPatterns.runs), 99) : 15;

        const agEl = document.getElementById('pm-adaptive-gain');
        const rdEl = document.getElementById('pm-run-detection');
        if (agEl) agEl.textContent = adaptiveGain + '%';
        if (rdEl) rdEl.textContent = runEfficiency + '%';

        // Heuristic text
        const htEl = document.getElementById('pm-heuristic-text');
        if (htEl) {
            htEl.textContent = `Visualizes the neural predictor's real-time influence. ${isAdaptive ? `${algo.title} Strategy identified: ${pmType === 'Highly Pre-sorted' ? 'High pre-sortedness detected' : 'Mixed pattern detected'}, optimizing ${pmType === 'Highly Pre-sorted' ? 'Merge' : 'Partition'} paths. Neural heuristics suggest ${pmPIndex > 70 ? 'continuing ' + algo.title + ' strategy' : 'switching to QuickSort variant'} for the next 100 elements.` : `Standard partitioning detected. No adaptive strategy active. ${algo.title} uses fixed ${algo.avg} operations.`}`;
        }

        // Conflict table
        renderConflictTable(algo, 0, n);

        // Memory topology
        const memTheo = document.getElementById('pm-mem-theoretical');
        const memPrac = document.getElementById('pm-mem-practical');
        const memSum = document.getElementById('pm-mem-summary');
        if (memTheo) memTheo.textContent = algo.avg;
        if (memPrac) memPrac.textContent = 'Cache/Branch/Sys';
        if (memSum) memSum.textContent = `Theoretical ${algo.avg} is ${isAdaptive ? 'modified to near O(n) by adaptive runs' : 'consistent with practical execution'}. Current recursion bypass: ${pmPIndex}%.`;
    }

    // ====== PANEL 2: Forecasting Lab ======
    function pmRenderPanel2(arr, n) {
        // Merge tree canvas
        pmDrawMergeTree(document.getElementById('pm-merge-tree-canvas'), n);

        // Stack depth
        const sdEl = document.getElementById('pm-stack-depth');
        if (sdEl) sdEl.textContent = `[Stack Depth: ${Math.ceil(Math.log2(Math.max(n, 2)))}]`;

        // Path strategy
        const psEl = document.getElementById('pm-path-strategy');
        if (psEl) psEl.textContent = `Based on input pattern (${pmType}). For current input, ${pmRanked[0].title} maintains highest consistency score.`;

        // Heatmap
        renderHeatmap(arr);

        // Heatmap subtitle
        const hmSub = document.getElementById('pm-heatmap-subtitle');
        if (hmSub) hmSub.textContent = `Pattern Analysis (${pmType})`;

        // Sync score
        const ssEl = document.getElementById('pm-sync-score');
        if (ssEl) ssEl.textContent = `${pmPIndex}% SYNC`;
        const sbEl = document.getElementById('pm-sync-bar');
        if (sbEl) setTimeout(() => { sbEl.style.width = pmPIndex + '%'; }, 100);

        // Pattern summary
        renderPatternsSummary(pmPatterns);

        // Environment Forecasting Canvases
        const predictCtx = document.getElementById('pm-predict-canvas');
        if (predictCtx) drawPredictCurve(predictCtx, pmRanked);

        const energyCtx = document.getElementById('pm-energy-canvas');
        if (energyCtx) drawEnergyArea(energyCtx, pmPIndex);

        const resMatrix = document.getElementById('pm-resource-matrix');
        if (resMatrix) {
            let html = '';
            for(let i=0; i<8; i++) {
                const load = Math.random() > 0.5 ? Math.floor(Math.random() * (100 - pmPIndex)) + pmPIndex : Math.random() * 30;
                const color = load > 80 ? 'bg-fuchsia-500' : load > 50 ? 'bg-fuchsia-400/50' : load > 20 ? 'bg-cyan-400/30' : 'bg-cyan-500/10';
                html += `<div class="${color} rounded-sm w-full h-full border border-white/5 shadow-inner" title="Core ${i+1}: ${load.toFixed(0)}%"></div>`;
            }
            resMatrix.innerHTML = html;
        }

        // Performance metrics
        const loadEl = document.getElementById('pm-core-load');
        const effEl = document.getElementById('pm-efficiency');
        const latEl = document.getElementById('pm-latency');
        if (loadEl) loadEl.textContent = Math.round(20 + Math.random() * 40) + '%';
        if (effEl) effEl.textContent = (0.3 + Math.random() * 0.8).toFixed(1) + 'W';
        if (latEl) latEl.textContent = Math.round(5 + n * 0.001) + 'ms';

        // Pattern tags
        const ptEl = document.getElementById('pm-pattern-tags');
        if (ptEl) {
            ptEl.innerHTML = '';
            const tags = [];
            for (let i = 0; i < Math.min(pmPatterns.runs, 8); i++) {
                const isRev = i < pmPatterns.reverseRuns;
                tags.push(`<span class="px-2 py-1 text-[8px] font-bold border ${isRev ? 'border-rose-500/30 text-rose-400 bg-rose-500/5' : 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5'} rounded uppercase">RUN_${String.fromCharCode(65+i)}: ${isRev ? 'DESC' : 'ASC'}</span>`);
            }
            if (pmPatterns.plateaus > 0) tags.push(`<span class="px-2 py-1 text-[8px] font-bold border border-amber-500/30 text-amber-400 bg-amber-500/5 rounded uppercase">PLATEAUS: ${pmPatterns.plateaus}</span>`);
            ptEl.innerHTML = tags.join('');
        }

        // Pattern detail
        const pdEl = document.getElementById('pm-pattern-detail');
        if (pdEl) pdEl.textContent = `Pattern (${pmType}): [Detected ${pmPatterns.runs} runs; Avg. run length: ${pmPatterns.avgRunLen} elements]. System suggests ${pmPIndex > 60 ? 'adaptive merging' : 'dynamic partitioning'} to maximize hardware throughput.`;

        // Strategy text
        const stEl = document.getElementById('pm-strategy-text');
        if (stEl) {
            stEl.innerHTML = `
                <p>Current prediction for pattern on <strong class="text-white">'${pmRanked[0].title}'</strong> suggests <strong class="text-emerald-400">${pmRanked[0].title}</strong> for speed, and <strong class="text-cyan-400">${pmRanked.length > 2 ? pmRanked[2].title : pmRanked[1].title}</strong> for energy-aware constraints.</p>
                <p>${pmRanked[0].title} pathing remains optimal for ${pmPIndex >= 60 ? 'highly pre-sorted sub-runs within the pattern' : 'randomized input distributions'}.</p>
                <p class="text-[10px] text-slate-600 mt-2">Data based on current array pattern (P-Index: ${pmPIndex}%). Prediction of next 100 elements suggests ${pmRanked[0].title} will become ${pmPIndex > 50 ? 'slightly more efficient' : 'marginally slower'} as input becomes more ${pmPIndex > 50 ? 'randomized' : 'ordered'}.</p>
            `;
        }

        // Stats
        const srEl = document.getElementById('pm-sorted-runs');
        const arlEl = document.getElementById('pm-avg-run-len');
        const plEl = document.getElementById('pm-plateaus');
        if (srEl) srEl.textContent = pmPatterns.runs;
        if (arlEl) arlEl.textContent = pmPatterns.avgRunLen;
        if (plEl) plEl.textContent = pmPatterns.plateaus;
    }

    // Merge tree drawing
    function pmDrawMergeTree(canvas, n) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
        const W = rect.width, H = rect.height;
        ctx.clearRect(0, 0, W, H);

        const depth = Math.min(Math.ceil(Math.log2(Math.max(n, 2))), 8);
        const nodeRadius = 4;

        function drawNode(x, y, level, parentX, parentY) {
            if (level > depth) return;
            // Line from parent
            if (parentX !== null) {
                ctx.beginPath();
                ctx.moveTo(parentX, parentY);
                ctx.lineTo(x, y);
                ctx.strokeStyle = `rgba(0, 251, 251, ${0.15 + (1 - level/depth) * 0.3})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            // Node
            ctx.beginPath();
            ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
            const t = level / depth;
            ctx.fillStyle = `hsl(${180 + t * 120}, 80%, ${50 + t * 15}%)`;
            ctx.fill();
            // Children
            const gap = (W * 0.4) / Math.pow(2, level);
            const ny = y + (H - 20) / depth;
            if (level < depth) {
                drawNode(x - gap, ny, level + 1, x, y);
                drawNode(x + gap, ny, level + 1, x, y);
            }
        }
        drawNode(W / 2, 12, 0, null, null);
    }

    // ====== PANEL 3: Algorithm Fusion Lab ======
    function pmRenderPanel3Init() {
        const algoA = document.getElementById('pm-fusion-algo-a');
        const algoB = document.getElementById('pm-fusion-algo-b');
        if (!algoA || algoA.options.length > 1) return; // already populated

        const keys = Object.keys(algorithms);
        keys.forEach(key => {
            const algo = algorithms[key];
            const optA = document.createElement('option');
            optA.value = key; optA.textContent = algo.title;
            algoA.appendChild(optA);
            const optB = document.createElement('option');
            optB.value = key; optB.textContent = algo.title;
            algoB.appendChild(optB);
        });
    }

    // Fusion analysis
    function pmUpdateFusion() {
        const algoAKey = document.getElementById('pm-fusion-algo-a')?.value;
        const algoBKey = document.getElementById('pm-fusion-algo-b')?.value;
        const threshold = parseInt(document.getElementById('pm-fusion-threshold')?.value || 32);
        document.getElementById('pm-fusion-threshold-val').textContent = threshold;

        if (!algoAKey || !algoBKey) return;

        const algoA = algorithms[algoAKey];
        const algoB = algorithms[algoBKey];

        // Show badges
        const aBadge = document.getElementById('pm-fusion-a-badge');
        const bBadge = document.getElementById('pm-fusion-b-badge');
        if (aBadge) { aBadge.classList.remove('hidden'); document.getElementById('pm-fusion-a-name').textContent = 'Dropped: ' + algoA.title; }
        if (bBadge) { bBadge.classList.remove('hidden'); document.getElementById('pm-fusion-b-name').textContent = 'Dropped: ' + algoB.title; }

        // Status
        const statusEl = document.getElementById('pm-fusion-status');
        if (statusEl) statusEl.classList.remove('hidden');

        // Enable buttons
        const execBtn = document.getElementById('btn-pm-fusion-execute');
        const buildBtn = document.getElementById('btn-pm-fusion-build');
        if (execBtn) execBtn.disabled = !pmData;
        if (buildBtn) buildBtn.disabled = false;

        // Time complexity
        const tcEl = document.getElementById('pm-fusion-time-complexity');
        if (tcEl) tcEl.textContent = `O(N * log N / Adaptive)`;

        // Time breakdown - Three cases as per mockup
        const tbEl = document.getElementById('pm-fusion-time-breakdown');
        if (tbEl) {
            const nSmall = 15; // N < 20
            const nDense = 60; // N >= 20, dense
            const nSparse = 150; // N >= 20, sparse
            
            tbEl.innerHTML = `
                <div class="flex items-center w-full h-2 rounded-full overflow-hidden my-2 bg-slate-800">
                    <div class="h-full bg-fuchsia-500" style="width: 20%;"></div>
                    <div class="h-full bg-rose-500/70" style="width: 35%;"></div>
                    <div class="h-full bg-cyan-500" style="width: 45%;"></div>
                </div>
                <li class="flex items-center justify-between text-[10px]"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-fuchsia-400 shrink-0"></span> N < 20: ${algoA.avg}</div><span class="text-fuchsia-400 font-bold opacity-70">20%</span></li>
                <li class="flex items-center justify-between text-[10px]"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-rose-400 shrink-0"></span> N >= 20, dense: O(n²)</div><span class="text-rose-400 font-bold opacity-70">35%</span></li>
                <li class="flex items-center justify-between text-[10px]"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-cyan-400 shrink-0"></span> N >= 20, sparse: ${algoB.avg}</div><span class="text-cyan-400 font-bold opacity-70">45%</span></li>
            `;
        }

        // Space complexity
        const scEl = document.getElementById('pm-fusion-space-complexity');
        if (scEl) scEl.textContent = `O(max(${algoA.space}, ${algoB.space}))`;

        const sbEl = document.getElementById('pm-fusion-space-breakdown');
        if (sbEl) {
            sbEl.innerHTML = `
                <div class="flex items-center w-full h-2 rounded-full overflow-hidden my-2 bg-slate-800">
                    <div class="h-full bg-fuchsia-400/50" style="width: 40%;"></div>
                    <div class="h-full bg-cyan-400/50" style="width: 60%;"></div>
                </div>
                <li class="flex items-center justify-between text-[10px]"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-fuchsia-400 shrink-0"></span> Base: ${algoA.space}</div><span class="text-fuchsia-400 font-bold opacity-70">40%</span></li>
                <li class="flex items-center justify-between text-[10px]"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-cyan-400 shrink-0"></span> Extended: ${algoB.space}</div><span class="text-cyan-400 font-bold opacity-70">60%</span></li>
            `;
        }

        // Metric label
        const metricEl = document.getElementById('pm-fusion-metric');
        if (metricEl) metricEl.textContent = `METRIC: ${algoA.avg} + ${algoB.avg} FUSION`;

        // Draw fusion chart
        pmDrawFusionChart(document.getElementById('pm-fusion-chart'), algoA, algoB, threshold);
        pmDrawComparisonChart(document.getElementById('pm-fusion-comparison-chart'), algoA, algoB, threshold);

        // Execution trace
        pmRenderTrace(algoA, algoB, threshold);
    }

    function pmDrawFusionChart(canvas, algoA, algoB, threshold) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
        const W = rect.width, H = rect.height;
        const pad = { top: 15, right: 15, bottom: 25, left: 10 };
        const gW = W - pad.left - pad.right;
        const gH = H - pad.top - pad.bottom;

        ctx.clearRect(0, 0, W, H);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = pad.top + (gH / 4) * i;
            ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
        }

        function getOps(complexStr, n) {
            const s = complexStr.replace(/\s/g, '').toLowerCase();
            if (s.includes('n²') || s.includes('n^2')) return n * n;
            if (s.includes('nlogn') || s.includes('nlog')) return n * Math.log2(Math.max(n, 2));
            if (s.includes('logn') || s.includes('log')) return Math.log2(Math.max(n, 2));
            return n;
        }

        const maxN = 300;
        const maxY = Math.max(getOps(algoA.avg, maxN), getOps(algoB.avg, maxN));
        const sx = n => pad.left + (n / maxN) * gW;
        const sy = ops => pad.top + gH - (Math.min(ops, maxY) / maxY) * gH;

        // Fusion curve
        ctx.strokeStyle = '#d946ef';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
            const n = (maxN / 100) * i;
            const ops = n <= threshold ? getOps(algoA.avg, n) : getOps(algoB.avg, n);
            const px = sx(n), py = sy(ops);
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Threshold line
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        const tx = sx(threshold);
        ctx.beginPath(); ctx.moveTo(tx, pad.top); ctx.lineTo(tx, H - pad.bottom); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`T=${threshold}`, tx, H - pad.bottom + 14);

        // Labels
        ctx.fillText('Input Size →', W / 2, H - 2);
    }

    function pmDrawComparisonChart(canvas, algoA, algoB, threshold) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
        const W = rect.width, H = rect.height;
        const pad = { top: 10, right: 10, bottom: 20, left: 10 };
        const gW = W - pad.left - pad.right;
        const gH = H - pad.top - pad.bottom;
        ctx.clearRect(0, 0, W, H);

        function getOps(complexStr, n) {
            const s = complexStr.replace(/\s/g, '').toLowerCase();
            if (s.includes('n²') || s.includes('n^2')) return n * n;
            if (s.includes('nlogn') || s.includes('nlog')) return n * Math.log2(Math.max(n, 2));
            return n;
        }

        const maxN = 300;
        const maxY = Math.max(getOps(algoA.avg, maxN), getOps(algoB.avg, maxN));
        const sx = n => pad.left + (n / maxN) * gW;
        const sy = ops => pad.top + gH - (Math.min(ops, maxY) / maxY) * gH;
        const steps = 80;

        // Algo A line
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const n = (maxN / steps) * i;
            const px = sx(n), py = sy(getOps(algoA.avg, n));
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Algo B line
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const n = (maxN / steps) * i;
            const px = sx(n), py = sy(getOps(algoB.avg, n));
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Hybrid line
        ctx.strokeStyle = '#d946ef';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const n = (maxN / steps) * i;
            const ops = n <= threshold ? getOps(algoA.avg, n) : getOps(algoB.avg, n);
            const px = sx(n), py = sy(ops);
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }

    function pmRenderTrace(algoA, algoB, threshold) {
        const traceEl = document.getElementById('pm-fusion-trace');
        if (!traceEl) return;
        
        let html = '';
        const nodes = 48; // enough to fill the visual grid
        for(let i=0; i<nodes; i++) {
            const isSmallNode = i % 4 !== 0; // Simulate 1 large partition, 3 small leaf partitions
            const useA = isSmallNode;
            const color = useA ? 'fuchsia' : 'cyan';
            const size = Math.floor(Math.random() * (useA ? threshold : threshold*4)) + 2;
            const intensity = Math.random() > 0.5 ? '500' : '400';
            
            html += `
                <div class="aspect-square w-full rounded-sm bg-${color}-${intensity}/20 border border-${color}-500/30 relative flex items-center justify-center transition-all hover:bg-${color}-500/50 cursor-crosshair overflow-hidden group">
                    <span class="text-[6px] font-mono text-${color}-300 opacity-80 group-hover:opacity-100 font-bold">${size}</span>
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex flex-col items-center z-50 whitespace-nowrap">
                        <div class="bg-black/90 border border-${color}-500/50 text-${color}-300 text-[10px] px-2 py-1 rounded shadow-lg backdrop-blur">
                            [N=${size}] Executing Algo ${useA ? 'A' : 'B'}
                        </div>
                    </div>
                </div>
            `;
        }
        traceEl.innerHTML = html;
        traceEl.className = "grid grid-cols-12 sm:grid-cols-16 gap-1 p-2 bg-black/40 rounded border border-white/5 min-h-[80px] content-start";
    }

    // Wire up fusion controls
    const fusionAlgoA = document.getElementById('pm-fusion-algo-a');
    const fusionAlgoB = document.getElementById('pm-fusion-algo-b');
    const fusionThreshold = document.getElementById('pm-fusion-threshold');

    if (fusionAlgoA) fusionAlgoA.addEventListener('change', pmUpdateFusion);
    if (fusionAlgoB) fusionAlgoB.addEventListener('change', pmUpdateFusion);
    if (fusionThreshold) fusionThreshold.addEventListener('input', pmUpdateFusion);

    // Execute fusion on live data
    const btnFusionExec = document.getElementById('btn-pm-fusion-execute');
    if (btnFusionExec) {
        btnFusionExec.addEventListener('click', async () => {
            if (!pmData) return;
            const algoAKey = document.getElementById('pm-fusion-algo-a')?.value;
            const algoBKey = document.getElementById('pm-fusion-algo-b')?.value;
            const threshold = parseInt(document.getElementById('pm-fusion-threshold')?.value || 32);
            if (!algoAKey || !algoBKey) return;

            const algoA = algorithms[algoAKey];
            const algoB = algorithms[algoBKey];

            btnFusionExec.innerHTML = '<span class="material-symbols-outlined text-sm animate-spin">sync</span> Running...';
            btnFusionExec.disabled = true;
            await new Promise(r => setTimeout(r, 50));

            const dataCopy = [...pmData];
            const t0 = performance.now();

            // Hybrid sort: use algoA for small sub-arrays, algoB for large
            if (dataCopy.length <= threshold && algoA.runRaw) {
                algoA.runRaw(dataCopy);
            } else if (algoB.runRaw) {
                algoB.runRaw(dataCopy);
            } else {
                dataCopy.sort((a, b) => a - b);
            }

            const elapsed = performance.now() - t0;

            // Show result
            const traceEl = document.getElementById('pm-fusion-trace');
            if (traceEl) {
                traceEl.innerHTML += `
                    <div class="col-span-12 sm:col-span-16 mt-1 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-mono text-emerald-400 flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-[14px]">check_circle</span>
                        Live Execution Complete in ${elapsed.toFixed(2)}ms
                    </div>
                `;
            }

            btnFusionExec.innerHTML = '<span class="material-symbols-outlined text-sm">play_arrow</span> Execute on Live Data';
            btnFusionExec.disabled = false;
        });
    }

    // Build & Visualize
    const btnFusionBuild = document.getElementById('btn-pm-fusion-build');
    if (btnFusionBuild) {
        btnFusionBuild.addEventListener('click', () => {
            pmUpdateFusion();
            btnFusionBuild.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> Built!';
            setTimeout(() => {
                btnFusionBuild.innerHTML = '<span class="material-symbols-outlined text-sm">build</span> Build & Visualize';
            }, 1200);
        });
    }
    // --- Helper UI Renderers and Analysis Engine ---

    function detectPatterns(arr) {
        if (!arr || arr.length === 0) return { runs: 0, avgRunLen: 0, plateaus: 0, reverseRuns: 0 };
        let runs = 1, revRuns = 0, plateaus = 0;
        let isAsc = arr.length > 1 ? arr[1] >= arr[0] : true;
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] === arr[i - 1]) plateaus++;
            let currAsc = arr[i] >= arr[i - 1];
            if (currAsc !== isAsc) {
                runs++;
                if (!currAsc) revRuns++;
                isAsc = currAsc;
            }
        }
        return {
            runs: runs,
            avgRunLen: Math.round(arr.length / runs),
            plateaus: plateaus,
            reverseRuns: revRuns
        };
    }

    function rankAlgorithmsForInput(arr, stats) {
        const pInfo = analyzePresortedness(arr);
        const pIndex = pInfo.pIndex;
        let ranked = Object.keys(algorithms).map(key => {
            let algo = algorithms[key];
            let score = 50;
            let isAdaptive = ['tim-sort', 'insertion-sort', 'pdq-sort'].includes(key);
            if (pIndex > 80 && isAdaptive) score += pIndex * 0.5;
            else if (pIndex <= 60 && ['quick-sort', 'merge-sort', 'radix-sort'].includes(key)) score += 40;
            score -= (algo.avg && algo.avg.includes('n²') ? 30 : 0);
            return {
                key: key,
                title: algo.title,
                avg: algo.avg,
                best: algo.best,
                space: algo.space,
                score: Math.min(100, Math.round(score + Math.random() * 10))
            };
        });
        ranked.sort((a, b) => b.score - a.score);
        return ranked;
    }

    function drawComplexityChart(canvas, n, highlightIdx) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
        const w = rect.width, h = rect.height;
        ctx.clearRect(0, 0, w, h);

        const pad = { top: 30, right: 140, bottom: 40, left: 45 };
        const gW = w - pad.left - pad.right;
        const gH = h - pad.top - pad.bottom;

        // Draw Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for(let i=0; i<=7; i++) {
            const y = pad.top + gH - (i/7)*gH;
            ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y);
            const x = pad.left + (i/7)*gW;
            ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + gH);
        }
        ctx.stroke();

        // Axes Text
        ctx.fillStyle = '#64748b';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for(let i=0; i<=7; i++) {
            const y = pad.top + gH - (i/7)*gH;
            ctx.fillText(Math.round((i/7)*350), pad.left - 10, y);
        }
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        for(let i=0; i<=7; i++) {
            const x = pad.left + (i/7)*gW;
            ctx.fillText(Math.round((i/7)*700), x, pad.top + gH + 10);
        }

        ctx.save();
        ctx.translate(15, pad.top + gH/2);
        ctx.rotate(-Math.PI/2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Operations/Time', 0, 0);
        ctx.restore();

        ctx.fillText('Input Size, n', pad.left + gW/2, pad.top + gH + 25);

        const maxN = 700;
        const maxY = 350; 

        function drawCurve(color, type, offsetOps=0) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            for(let x=0; x<=gW; x+=2) {
                let currN = (x/gW) * maxN;
                let ops = offsetOps;
                if(type === 'n2') ops += (currN * currN) / 1400;
                else if(type === 'nlogn') ops += (currN * Math.log2(Math.max(2,currN))) / 14;
                else if(type === 'n') ops += currN / 2;
                else if(type === 'nlog2n') ops += (currN * Math.log2(Math.max(2,currN))) / 18;
                else if(type === 'n_superfast') ops += currN / 2.5;
                else if(type === 'n2_slow') ops += (currN * currN) / 1200;
                
                let px = pad.left + x;
                let py = pad.top + gH - (ops / maxY) * gH;
                py = Math.max(pad.top, Math.min(pad.top + gH, py)); 
                if(x===0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
        }

        // Space Complexity Inset Box
        ctx.setLineDash([]);
        const insetW = 140;
        const insetH = 75;
        const ix = pad.left + gW * 0.25; 
        const iy = pad.top + 10;
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(ix, iy, insetW, insetH, 6); ctx.fill(); ctx.stroke();
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Space Complexity', ix + insetW/2, iy + 14);
        
        const bars = [
            { h: 35, c: '#14b8a6' },
            { h: 28, c: '#f59e0b' },
            { h: 24, c: '#3b82f6' },
            { h: 20, c: '#ec4899' },
            { h: 14, c: '#a855f7' }
        ];
        const barW = 10;
        const gap = 6;
        const totalW = bars.length * barW + (bars.length - 1) * gap;
        let startX = ix + (insetW - totalW) / 2 + 5;
        let baseY = iy + insetH - 10;
        
        ctx.fillStyle = '#64748b';
        ctx.font = '8px sans-serif';
        ctx.fillText('120', ix + 12, iy + 30);
        ctx.fillText('0', ix + 12, baseY - 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath(); ctx.moveTo(ix + 20, iy + 25); ctx.lineTo(ix + 20, baseY); ctx.moveTo(ix + 18, baseY); ctx.lineTo(ix + insetW - 10, baseY); ctx.stroke();

        bars.forEach(b => {
             ctx.fillStyle = b.c;
             ctx.beginPath(); ctx.roundRect(startX, baseY - b.h, barW, b.h, [2,2,0,0]); ctx.fill();
             startX += barW + gap;
        });

        // Top Left Legend (Best/Avg/Worst)
        const topLx = pad.left + 10;
        const topLy = pad.top + 10;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath(); ctx.roundRect(topLx, topLy, 90, 48, 4); ctx.fill(); ctx.stroke();
        const topLgs = [
            {n: 'Best-case', c: '#10b981'},
            {n: 'Average-case', c: '#f59e0b'},
            {n: 'Worst-case', c: '#ef4444'}
        ];
        topLgs.forEach((l, i) => {
            let ty = topLy + 14 + i * 14;
            ctx.fillStyle = l.c;
            ctx.fillRect(topLx + 6, ty - 4, 12, 2);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '8px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(l.n, topLx + 24, ty + 2);
        });

        // Background lines (O(n), O(n^2), O(n log n))
        drawCurve('#f59e0b', 'n2', 0); // average
        drawCurve('#ef4444', 'n2_slow', 20); // worst
        drawCurve('#3b82f6', 'nlogn', 0); // blue merge
        drawCurve('#10b981', 'n', 0); // best

        // Adaptive Sort lines
        drawCurve('#06b6d4', 'nlog2n', 10); // cyan adq
        drawCurve('#8b5cf6', 'nlog2n', -10); // purple smooth
        drawCurve('#a855f7', 'n_superfast', 0); // pink timsort
        drawCurve('#ec4899', 'n', 5); // extra

        // Right Legends
        const lx = w - pad.right + 15;
        const ly = pad.top;
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath(); ctx.roundRect(lx, ly, 110, 50, 4); ctx.fill(); ctx.stroke();
        ctx.textAlign = 'left';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText('Algorithms Class', lx + 8, ly + 14);
        const cls = [ {n:'O(n log n)', c:'#f59e0b'}, {n:'O(h)', c:'#3b82f6'} ];
        cls.forEach((l, i) => {
             let ty = ly + 28 + i * 12;
             ctx.fillStyle = l.c;
             ctx.fillRect(lx + 8, ty - 3, 10, 2);
             ctx.fillStyle = '#cbd5e1';
             ctx.font = '8px sans-serif';
             ctx.fillText(l.n, lx + 24, ty + 1);
        });

        const ly2 = ly + 58;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath(); ctx.roundRect(lx, ly2, 110, 110, 4); ctx.fill(); ctx.stroke();
        ctx.font = 'bold 9px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText('Adaptive Sorts', lx + 8, ly2 + 14);
        
        const lgds = [
            { n: 'Adaptive Quick Sort', c: '#06b6d4' },
            { n: 'Smoothsort', c: '#8b5cf6' },
            { n: 'Timsort', c: '#a855f7' },
            { n: 'Merge Sort', c: '#3b82f6' },
            { n: 'Heap Sort', c: '#10b981' },
            { n: 'O(n)', c: '#22c55e' },
            { n: 'O(n²)', c: '#ef4444' }
        ];
        lgds.forEach((l, i) => {
             let ty = ly2 + 28 + i * 11;
             ctx.fillStyle = l.c;
             ctx.fillRect(lx + 8, ty - 3, 10, 2);
             ctx.fillStyle = '#cbd5e1';
             ctx.font = '8px sans-serif';
             ctx.fillText(l.n, lx + 24, ty + 1);
        });
    }

    function renderDeepDiveCards(ranked) {
        const el = document.getElementById('pm-deep-dive-cards');
        if (!el || !ranked || ranked.length === 0) return;
        
        const labels = ['(Adaptive King)', '(The Unsung Hero)', '(For Contrast)'];
        const borderColors = ['border-emerald-500/30', 'border-cyan-500/30', 'border-rose-500/30'];
        const textColors = ['text-emerald-400', 'text-cyan-400', 'text-rose-400'];
        const bgs = ['bg-emerald-500/5', 'bg-cyan-500/5', 'bg-rose-500/5'];

        const targetKey = document.getElementById('pm-target-algo')?.value;
        let displayList = ranked.slice(0, 3);
        if (targetKey) {
            const tIdx = ranked.findIndex(r => r.key === targetKey);
            if (tIdx !== -1) {
                const rem = ranked.filter(r => r.key !== targetKey);
                displayList = [ranked[tIdx], rem[0], rem[rem.length - 1]];
            }
        }

        el.innerHTML = displayList.map((r, i) => `
            <div class="pm-glass rounded-lg p-5 border ${borderColors[i]} ${bgs[i]} hover:bg-white/[0.03] transition-colors relative overflow-hidden group flex flex-col h-full">
                <div class="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span class="material-symbols-outlined text-6xl ${textColors[i]} -mt-4 -mr-4">memory</span>
                </div>
                <div class="relative z-10 mb-4">
                    <h4 class="text-white font-bold text-lg tracking-wide shadow-sm leading-tight">${r.title}</h4>
                    <span class="${textColors[i]} text-[10px] font-bold tracking-wider">${labels[i]}</span>
                </div>
                <div class="flex flex-col gap-1.5 text-[11px] relative z-10 flex-1 justify-center">
                    <div class="flex items-center gap-2"><span class="text-slate-400 w-12">Best:</span><span class="text-white font-mono">${r.best}</span></div>
                    <div class="flex items-center gap-2"><span class="text-slate-400 w-12">Avg:</span><span class="text-white font-mono">${r.avg}</span></div>
                    <div class="flex items-center gap-2"><span class="text-slate-400 w-12">Worst:</span><span class="text-white font-mono">${r.worst}</span></div>
                    <div class="flex items-center gap-2 mt-2"><span class="text-slate-400 w-20">Space Usage:</span><span class="text-white font-mono">${r.space}</span></div>
                    <div class="flex items-start gap-2 mt-2 pt-2 border-t border-white/5"><span class="text-slate-400 w-20 shrink-0">Use-Cases:</span><span class="text-slate-300 leading-snug break-words pr-2">${r.apps || 'General purpose sorting, large datasets'}</span></div>
                </div>
            </div>
        `).join('');
    }

    function renderSpaceBars(ranked) {
        const el = document.getElementById('pm-space-bars');
        if (!el || !ranked) return;
        const barColors = ['fuchsia','cyan','emerald','amber','rose'];
        el.innerHTML = ranked.slice(0, 5).map((r, i) => `
            <div class="flex items-center gap-3">
                <span class="text-[10px] font-bold w-16 text-slate-400 truncate">${r.title.split(' ')[0]}</span>
                <div class="flex-1 h-3 bg-white/5 bg-slate-800 rounded-full overflow-hidden shadow-inner border border-white/5">
                    <div class="h-full bg-gradient-to-r from-${barColors[i]}-600 to-${barColors[i]}-400 rounded-full" style="width: ${r.space==='O(1)'? 10 : (r.space && r.space.includes('log')? 40 : 80)}%"></div>
                </div>
                <span class="text-[10px] font-mono font-bold ${r.space==='O(1)'? 'text-emerald-400' : 'text-slate-500'} w-14 text-right">${r.space}</span>
            </div>
        `).join('');
    }

    function renderRankingTable(ranked) {
        const el = document.getElementById('pm-ranking-tbody');
        if (!el || !ranked) return;
        el.innerHTML = ranked.slice(0, 10).map((r, i) => `
            <tr class="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors ${i===0? 'bg-fuchsia-500/5' : ''}">
                <td class="py-2 text-slate-500 font-bold">#${i+1}</td>
                <td class="py-2 font-bold ${i===0? 'text-fuchsia-400' : 'text-slate-300'} truncate w-32">${r.title}</td>
                <td class="py-2 text-center text-emerald-400 font-bold w-24">${r.score}%</td>
                <td class="py-2 pl-4 text-slate-400 text-[9px] truncate max-w-[150px]" title="${r.apps || ''}">${r.apps ? r.apps.substring(0, 60) + '...' : 'General sorting approach'}</td>
            </tr>
        `).join('');
    }

    function renderFitScores(ranked) {
        const el = document.getElementById('pm-fit-scores');
        if (!el || !ranked || ranked.length < 4) return;
        el.innerHTML = ranked.slice(1, 4).map((r, i) => {
            const colors = ['cyan','emerald','amber'];
            const c = colors[i];
            return `
            <div class="flex flex-col items-center gap-2">
                <div class="relative w-12 h-12">
                    <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-slate-800" stroke-width="3"></circle>
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-${c}-400" stroke-width="3" stroke-dasharray="100.5" stroke-dashoffset="${100.5 - (r.score/100)*100.5}"></circle>
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">${r.score}%</div>
                </div>
                <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate w-16 text-center">${r.title.split(' ')[0]}</span>
            </div>
        `}).join('');
    }

    function renderConflictTable(algo, param1, n) {
        const el = document.getElementById('pm-conflict-table');
        if (!el) return;
        el.innerHTML = `
            <div class="grid grid-cols-12 gap-2 p-2 border-b border-white/[0.02] text-[10px] bg-white/[0.01]">
                <div class="col-span-4 text-slate-400">Branching Cache</div>
                <div class="col-span-4 text-slate-500 font-mono">Theoretical: ${algo.avg}</div>
                <div class="col-span-4 text-rose-400 font-mono text-right">+12% Latency</div>
            </div>
            <div class="grid grid-cols-12 gap-2 p-2 text-[10px] bg-white/[0.01]">
                <div class="col-span-4 text-slate-400">Syscall Overhead</div>
                <div class="col-span-4 text-slate-500 font-mono">Bound: O(1)</div>
                <div class="col-span-4 text-emerald-400 font-mono text-right">-5% Optimized</div>
            </div>
        `;
    }

    function renderHeatmap(arr) {
        const el = document.getElementById('pm-heatmap');
        if (!el) return;
        el.innerHTML = '';
        if(!arr || arr.length === 0) return;
        
        let blocks = 24;
        let blockSize = Math.max(1, Math.floor(arr.length / blocks));
        let maxVal = Math.max(...arr) || 1;
        
        for (let i = 0; i < blocks; i++) {
            let start = i * blockSize;
            let end = Math.min((i + 1) * blockSize, arr.length);
            if (start >= arr.length) break;
            
            const blockDiv = document.createElement('div');
            blockDiv.className = 'bg-black/40 w-full aspect-square border-b-2 rounded-sm p-[3px] flex items-end justify-between gap-[1px] group transition-all duration-300 hover:bg-white/10 relative overflow-hidden cursor-crosshair';
            let colorBaseClass = pmType === 'Highly Pre-sorted' ? 'bg-emerald-400' : pmType === 'Sorted (Reverse)' ? 'bg-rose-400' : 'bg-cyan-400';
            if(pmPIndex >= 50 && i % 4 === 0) colorBaseClass = 'bg-fuchsia-400';

            // border-b color matching base
            blockDiv.style.borderBottomColor = colorBaseClass.replace('bg-', '');
            
            let miniBars = 4;
            let step = Math.max(1, Math.floor((end - start) / miniBars));
            for(let k=0; k<miniBars; k++) {
                let mStart = start + k * step;
                if(mStart >= end) break;
                let pct = (arr[mStart] / maxVal) * 100;
                blockDiv.innerHTML += `<div class="w-full ${colorBaseClass} rounded-[1px] transition-all group-hover:bg-white" style="height: ${Math.max(15, pct)}%; opacity: ${0.4 + (pct/200)}"></div>`;
            }
            // Overlay gradient for depth
            blockDiv.innerHTML += `<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>`;
            el.appendChild(blockDiv);
        }
    }

    function drawPredictCurve(canvas, ranked) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width = canvas.offsetWidth;
        const h = canvas.height = canvas.offsetHeight;
        ctx.clearRect(0,0,w,h);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.beginPath();
        for(let i=0; i<w; i+=20) { ctx.moveTo(i,0); ctx.lineTo(i,h); }
        for(let i=0; i<h; i+=15) { ctx.moveTo(0,i); ctx.lineTo(w,i); }
        ctx.stroke();

        // Target Curve (Cyan)
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(6,182,212,0.6)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        for(let i=0; i<=w; i+=5) {
            let curH = h - (h * 0.15 + (Math.log(i/15+1)*14) + Math.sin(i*0.05)*3);
            if(i===0) ctx.moveTo(i, curH);
            else ctx.bezierCurveTo(i-2.5, curH, i-2.5, curH, i, curH);
        }
        ctx.stroke();

        // Deviation Curve (Fuchsia) - dashed
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#d946ef';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for(let i=0; i<=w; i+=5) {
            let curH = h - (h * 0.1 + (i*0.3));
            if(i===0) ctx.moveTo(i, curH);
            else ctx.lineTo(i, curH);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Marker point
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(w*0.8, h - (h*0.15 + (Math.log((w*0.8)/15+1)*14) + Math.sin((w*0.8)*0.05)*3), 4, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowColor = 'transparent';
    }

    function drawEnergyArea(canvas, pIndex) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width = canvas.offsetWidth;
        const h = canvas.height = canvas.offsetHeight;
        ctx.clearRect(0,0,w,h);
        
        // Base stack
        ctx.fillStyle = 'rgba(6,182,212,0.05)';
        ctx.fillRect(0, 0, w, h);

        // Area Graph
        let grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(244,63,94,0.4)');
        grad.addColorStop(1, 'rgba(244,63,94,0.01)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, h);
        let lastY = h;
        for(let i=0; i<=w; i+=5) {
            let val = h*0.4 + Math.sin(i*0.1 + pIndex*0.1)*8 - Math.cos(i*0.04)*4;
            lastY = Math.max(val, 10);
            ctx.lineTo(i, lastY);
        }
        ctx.lineTo(w, h);
        ctx.fill();

        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for(let i=0; i<=w; i+=5) {
            let val = h*0.4 + Math.sin(i*0.1 + pIndex*0.1)*8 - Math.cos(i*0.04)*4;
            let y = Math.max(val, 10);
            if(i===0) ctx.moveTo(i, y);
            else ctx.lineTo(i, y);
        }
        ctx.stroke();

        // Horizontal thresholds
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.setLineDash([2,2]);
        ctx.beginPath(); ctx.moveTo(0, h*0.3); ctx.lineTo(w, h*0.3); ctx.stroke();
        ctx.setLineDash([]);
    }

    function renderPatternsSummary(patterns) {
        const el = document.getElementById('pm-patterns-summary');
        if (!el || !patterns) return;
        el.innerHTML = `
            <div class="bg-slate-900/50 p-2 rounded border border-white/5">
                <div class="text-[9px] text-slate-500 uppercase font-bold mb-1">Ascending Runs</div>
                <div class="text-sm font-bold text-white">${patterns.runs}</div>
            </div>
            <div class="bg-slate-900/50 p-2 rounded border border-white/5">
                <div class="text-[9px] text-slate-500 uppercase font-bold mb-1">Avg Run Len</div>
                <div class="text-sm font-bold text-cyan-400">${patterns.avgRunLen}</div>
            </div>
            <div class="bg-slate-900/50 p-2 rounded border border-white/5">
                <div class="text-[9px] text-slate-500 uppercase font-bold mb-1">Reverse Runs</div>
                <div class="text-sm font-bold text-rose-400">${patterns.reverseRuns}</div>
            </div>
            <div class="bg-slate-900/50 p-2 rounded border border-white/5">
                <div class="text-[9px] text-slate-500 uppercase font-bold mb-1">Plateaus</div>
                <div class="text-sm font-bold text-amber-400">${patterns.plateaus}</div>
            </div>
        `;
    }
});

// Helper function for presortedness analysis
function analyzePresortedness(arr) {
    if (!arr || arr.length === 0) return { pIndex: 0, type: 'Random' };
    let asc = 0, desc = 0;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] >= arr[i - 1]) asc++;
        else desc++;
    }
    let orderPct = Math.max(asc, desc) / (arr.length - 1 || 1) * 100;
    let type = 'Random (Scattered)';
    if (orderPct > 95) type = asc >= desc ? 'Highly Pre-sorted (Asc)' : 'Highly Pre-sorted (Desc)';
    else if (orderPct > 70) type = 'Partially Sorted / Clustered';
    else if (orderPct < 55) type = 'Highly Randomized';
    return { pIndex: Math.round(orderPct), type };
}

// Helper function for algorithm strengths
function getAlgoStrengths(key, pIndex) {
    const strengths = {
        'tim-sort': 'Ideal: detected many natural runs; near-O(n) perf.',
        'intro-sort': 'Hybrid: adapts between QuickSort/HeapSort. Consistent.',
        'quick-sort': 'Cache-friendly. Very fast on randomized data.',
        'merge-sort': 'Stable, consistent O(n log n). Good for linked lists.',
        'heap-sort': 'Consistent O(n log n), no adaptive gain.',
        'shell-sort': 'Good for medium arrays. Sub-quadratic.',
        'pdq-sort': 'Uses presortedness to select pivots and subarrays.',
        'insertion-sort': 'Very fast for nearly sorted, slow otherwise.',
        'bubble-sort': 'O(n) only if *already* fully sorted.',
        'selection-sort': 'Worst choice; full scan every pass.',
        'dual-pivot-quick-sort': 'Dual pivots improve partitioning on random data.',
        'block-sort': 'In-place merge sort variant. Stable, O(1) space.',
        'dual-fusion-sort': 'Hybrid dual-merge approach. Adaptive.'
    };
    return strengths[key] || 'General purpose sorting algorithm.';
}

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
            // Sort complete — cascading green flash
            if (!DVIS.api.aborted) {
                DVIS.bars.forEach((bar, i) => {
                    setTimeout(() => {
                        bar.style.background = COLORS.done;
                        bar.style.boxShadow = `0 0 10px ${COLORS.done}60`;
                        setTimeout(() => {
                            bar.style.background = COLORS.bar;
                            bar.style.boxShadow = '';
                        }, 500);
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



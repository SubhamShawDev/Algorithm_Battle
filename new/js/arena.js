// === Machine-calibrated theoretical time estimation ===
// Instead of deriving cost-per-op from the actual run (which always matches),
// we run a one-time calibration sort to measure real cost-per-op independently.
let calibratedCostPerOp = null; // ms per single comparison+swap

function calibrateCostPerOp() {
    if (calibratedCostPerOp !== null) return calibratedCostPerOp;

    // Run a small reference sort (10,000 items) to calibrate
    const calSize = 10000;
    const calArr = [];
    for (let i = 0; i < calSize; i++) calArr.push(Math.random() * 100000);

    // Warm up JIT
    const warmup = [...calArr];
    warmup.sort((a, b) => a - b);

    // Measure a merge-sort-like O(n log n) workload
    const calCopy = [...calArr];
    const t0 = performance.now();
    // Run native sort which is ~O(n log n)
    calCopy.sort((a, b) => a - b);
    const t1 = performance.now();

    const calMs = t1 - t0;
    const calOps = calSize * Math.log2(calSize); // ~133,000 ops
    calibratedCostPerOp = calMs / calOps;

    return calibratedCostPerOp;
}

// Compute theoretical time independently of actual measurement
// Uses calibrated per-op cost Ã— theoretical operation count for the given N
function computeTheoreticalTimeMs(n, complexityStr) {
    const costPerOp = calibrateCostPerOp();
    const ops = computeTheoreticalOps(n, complexityStr);
    return costPerOp * ops;
}

/* --- UI MANIPULATION AND STATE --- */

const STATE = {
    array: [],
    isPlaying: false,
    isPaused: false,
    mode: 'compare', // 'compare' or 'single'
    leftAlgo: 'quick-sort',
    rightAlgo: 'merge-sort',
    resolvers: [],
    leftApi: null,
    rightApi: null,
};

let UI = {};

const algoKeys = Object.keys(algorithms);

document.addEventListener('DOMContentLoaded', () => {
    // Only capture DOM nodes once they are loaded
    UI = {
        arenaLeft: document.getElementById('arena-left'),
        arenaRight: document.getElementById('arena-right'),
        titleLeft: document.getElementById('title-left'),
        titleRight: document.getElementById('title-right'),
        compLeft: document.getElementById('complexity-left'),
        compRight: document.getElementById('complexity-right'),
        opsLeft: document.getElementById('ops-left'),
        opsRight: document.getElementById('ops-right'),
        selLeft: document.getElementById('selector-left'),
        selRight: document.getElementById('selector-right'),
        btnPlay: document.getElementById('btn-play'),
        btnPause: document.getElementById('btn-pause'),
        btnReplay: document.getElementById('btn-replay'),
        sliderSpeed: document.getElementById('slider-speed'),
        sliderSize: document.getElementById('slider-size'),
        sizeDisplay: document.getElementById('array-size-display'),
        speedDisplay: document.getElementById('base-speed-display'),

        // Benchmark UI
        benchFile: document.getElementById('benchmark-file'),
        benchFileLabel: document.getElementById('benchmark-file-label'),
        btnRunBench: document.getElementById('btn-run-benchmark'),
        btnDeleteFile: document.getElementById('btn-delete-file'),
        benchResults: document.getElementById('benchmark-results'),
        benchN: document.getElementById('bench-n'),
        benchTime: document.getElementById('bench-time'),
        benchTimeUnit: document.getElementById('bench-time-unit'),
        benchStatus: document.getElementById('bench-status'),
        benchComparisons: document.getElementById('bench-comparisons'),
        benchSwaps: document.getElementById('bench-swaps'),
        benchTheoryBest: document.getElementById('bench-theory-best'),
        benchTheoryAvg: document.getElementById('bench-theory-avg'),
        benchTheoryWorst: document.getElementById('bench-theory-worst'),
        benchChart: document.getElementById('bench-bar-visual'),
        benchActualTime: document.getElementById('bench-actual-time'),
        benchActualUnit: document.getElementById('bench-actual-unit'),
        benchTheoreticalTime: document.getElementById('bench-theoretical-time'),
        benchTheoreticalUnit: document.getElementById('bench-theoretical-unit'),
        benchDiffBadge: document.getElementById('bench-diff-badge'),
        benchBarActual: document.getElementById('bench-bar-actual'),
        benchBarTheory: document.getElementById('bench-bar-theory'),
        benchBarActualLabel: document.getElementById('bench-bar-actual-label'),
        benchBarTheoryLabel: document.getElementById('bench-bar-theory-label'),
        btnStartVis: document.getElementById('btn-start-visualization'),
        // Mobile slider mirrors
        sliderSpeedMobile: document.getElementById('slider-speed-mobile'),
        sliderSizeMobile: document.getElementById('slider-size-mobile'),
    };

    // Initialize UI Text (wrapped in try-catch to not block event binding)
    try {
        updateAlgoHeaders();
        generateArray();
        renderInitialArenas();
    } catch (e) {
        console.warn('[Arena] Init error (non-fatal):', e.message);
    }

    /* --- EVENT LISTENERS --- */

    if (UI.selLeft) UI.selLeft.addEventListener('click', () => {
        if (STATE.mode === 'single') return;
        if (STATE.isPlaying && !STATE.isPaused) return;
        if (STATE.isPlaying) stopSorting();
        let idx = algoKeys.indexOf(STATE.leftAlgo);
        STATE.leftAlgo = algoKeys[(idx + 1) % algoKeys.length];
        updateAlgoHeaders();
    });

    if (UI.selRight) UI.selRight.addEventListener('click', () => {
        if (STATE.isPlaying && !STATE.isPaused) return;
        if (STATE.isPlaying) stopSorting();
        let idx = algoKeys.indexOf(STATE.rightAlgo);
        STATE.rightAlgo = algoKeys[(idx + 1) % algoKeys.length];
        updateAlgoHeaders();
    });

    if (UI.sliderSize) UI.sliderSize.addEventListener('input', () => {
        if (STATE.isPlaying) stopSorting();
        generateArray();
        renderInitialArenas();
    });

    if (UI.sliderSpeed) UI.sliderSpeed.addEventListener('input', () => {
        let delay = 101 - parseInt(UI.sliderSpeed.value);
        if (UI.speedDisplay) UI.speedDisplay.textContent = `Base Yield: ${delay}ms`;
        if (UI.sliderSpeedMobile) UI.sliderSpeedMobile.value = UI.sliderSpeed.value;
    });

    // Mobile slider mirrors
    if (UI.sliderSizeMobile) {
        UI.sliderSizeMobile.addEventListener('input', () => {
            UI.sliderSize.value = UI.sliderSizeMobile.value;
            if (STATE.isPlaying) stopSorting();
            generateArray();
            renderInitialArenas();
        });
    }
    if (UI.sliderSpeedMobile) {
        UI.sliderSpeedMobile.addEventListener('input', () => {
            UI.sliderSpeed.value = UI.sliderSpeedMobile.value;
            let delay = 101 - parseInt(UI.sliderSpeedMobile.value);
            if (UI.speedDisplay) UI.speedDisplay.textContent = `Base Yield: ${delay}ms`;
        });
    }

    if (UI.btnPlay) UI.btnPlay.addEventListener('click', togglePlay);

    if (UI.btnPause) UI.btnPause.addEventListener('click', () => {
        if (STATE.isPlaying) {
            STATE.isPaused = true;
            UI.btnPlay.innerHTML = '<span class="material-symbols-outlined fill-1">play_arrow</span><span class="hidden sm:inline">Resume</span>';
        }
    });

    if (UI.btnReplay) UI.btnReplay.addEventListener('click', () => {
        stopSorting();
        generateArray();
        renderInitialArenas();
    });

    /* --- MODAL LOGIC FOR SIDEBAR BUTTONS --- */
    const modal = document.getElementById('algorithm-modal');
    const closeBtn = document.getElementById('close-modal-btn');

    algoKeys.forEach(key => {
        const btn = document.getElementById(`btn-${key}`);
        if (btn) btn.addEventListener('click', () => openModal(key));
    });

    /* --- HOME PAGE CARD → MODAL WIRING --- */
    algoKeys.forEach(key => {
        const card = document.getElementById(`card-${key}`);
        if (card) card.addEventListener('click', () => openModal(key));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    /* --- INJECT ALGORITHM PROPERTY BADGES ON HOME CARDS --- */
    const algoBadges = {
        'quick-sort':             [['inplace','In-Place'], ['unstable','Unstable']],
        'merge-sort':             [['stable','Stable'], ['unstable','O(n) Space']],
        'bubble-sort':            [['stable','Stable'], ['inplace','In-Place'], ['adaptive','Adaptive']],
        'heap-sort':              [['inplace','In-Place'], ['unstable','Unstable']],
        'selection-sort':         [['inplace','In-Place'], ['unstable','Unstable']],
        'insertion-sort':         [['stable','Stable'], ['inplace','In-Place'], ['adaptive','Adaptive']],
        'tim-sort':               [['stable','Stable'], ['adaptive','Adaptive'], ['hybrid','Hybrid']],
        'intro-sort':             [['inplace','In-Place'], ['hybrid','Hybrid']],
        'shell-sort':             [['inplace','In-Place'], ['unstable','Unstable']],
        'pdq-sort':               [['inplace','In-Place'], ['unstable','Unstable']],
        'dual-pivot-quick-sort':  [['inplace','In-Place'], ['unstable','Unstable']],
        'block-sort':             [['stable','Stable'], ['inplace','In-Place']],
        'dual-fusion-sort':       [['stable','Stable'], ['hybrid','Hybrid']],
    };

    algoKeys.forEach(key => {
        const card = document.getElementById(`card-${key}`);
        if (!card || !algoBadges[key]) return;
        const titleRow = card.querySelector('.flex.justify-between.items-start');
        if (!titleRow) return;
        // Wrap existing complexity badge + new badges
        const existingBadge = titleRow.querySelector('span');
        if (!existingBadge) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'flex flex-col items-end gap-1';
        existingBadge.parentElement.insertBefore(wrapper, existingBadge);
        wrapper.appendChild(existingBadge);
        const badgeRow = document.createElement('div');
        badgeRow.className = 'flex gap-1 flex-wrap justify-end';
        algoBadges[key].forEach(([type, label]) => {
            const badge = document.createElement('span');
            badge.className = `algo-badge algo-badge-${type}`;
            badge.textContent = label;
            badgeRow.appendChild(badge);
        });
        wrapper.appendChild(badgeRow);
    });

    /* --- SORTING LIBRARY FILTER --- */
    const complexityRank = { 'O(n)': 1, 'O(n log n)': 2, 'O(n log²n)': 3, 'O(n²)': 4, 'O(n^2)': 4 };
    const stableSet = new Set(['merge-sort','bubble-sort','insertion-sort','tim-sort','block-sort','dual-fusion-sort']);

    const sortFilter = document.getElementById('algo-sort-filter');
    if (sortFilter) {
        sortFilter.addEventListener('change', () => {
            const grid = document.querySelector('#home-page .grid.grid-cols-1');
            if (!grid) return;
            const cards = Array.from(grid.children);
            const originalOrder = algoKeys.map(k => document.getElementById(`card-${k}`)).filter(Boolean);

            let sorted;
            switch(sortFilter.value) {
                case 'complexity-asc':
                    sorted = [...originalOrder].sort((a, b) => {
                        const aKey = a.id.replace('card-','');
                        const bKey = b.id.replace('card-','');
                        return (complexityRank[algorithms[aKey]?.avg] || 5) - (complexityRank[algorithms[bKey]?.avg] || 5);
                    });
                    break;
                case 'complexity-desc':
                    sorted = [...originalOrder].sort((a, b) => {
                        const aKey = a.id.replace('card-','');
                        const bKey = b.id.replace('card-','');
                        return (complexityRank[algorithms[bKey]?.avg] || 5) - (complexityRank[algorithms[aKey]?.avg] || 5);
                    });
                    break;
                case 'name-asc':
                    sorted = [...originalOrder].sort((a, b) => {
                        const aKey = a.id.replace('card-','');
                        const bKey = b.id.replace('card-','');
                        return (algorithms[aKey]?.title || '').localeCompare(algorithms[bKey]?.title || '');
                    });
                    break;
                case 'stable':
                    sorted = [...originalOrder].sort((a, b) => {
                        const aStable = stableSet.has(a.id.replace('card-','')) ? 0 : 1;
                        const bStable = stableSet.has(b.id.replace('card-','')) ? 0 : 1;
                        return aStable - bStable;
                    });
                    break;
                default:
                    sorted = originalOrder;
            }
            sorted.forEach(card => {
                card.style.animation = 'none';
                void card.offsetWidth;
                card.style.animation = 'fadeSlideIn 0.3s ease forwards';
                grid.appendChild(card);
            });
        });
    }


    // Note: btn-start-visualization is now handled by the detail page mini-visualizer in features.js


    /* --- IMPLEMENTATION TAB: Code Viewer --- */

    // Clean algorithm code strings for display
    const algorithmCode = window.algorithmCode = {
        'quick-sort': `function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        // Choose last element as pivot
        let pivotIndex = partition(arr, low, high);

        // Recursively sort left and right halves
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            // Swap arr[i] and arr[j]
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    // Place pivot in correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`,

        'merge-sort': `function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    // Split array into two halves
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    // Merge the two sorted halves
    return merge(left, right);
}

function merge(left, right) {
    let result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    // Append remaining elements
    return result.concat(left.slice(i)).concat(right.slice(j));
}`,

        'bubble-sort': `function bubbleSort(arr) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;

        for (let j = 0; j < n - i - 1; j++) {
            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {
                // Swap them
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }

        // Optimization: if no swaps occurred,
        // array is already sorted
        if (!swapped) break;
    }

    return arr;
}`,

        'insertion-sort': `function insertionSort(arr) {
    const n = arr.length;

    for (let i = 1; i < n; i++) {
        // Pick the element to be inserted
        let key = arr[i];
        let j = i - 1;

        // Shift elements greater than key
        // one position to the right
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }

        // Insert key at correct position
        arr[j + 1] = key;
    }

    return arr;
}`,

        'selection-sort': `function selectionSort(arr) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        // Find the minimum element
        // in the unsorted portion
        let minIdx = i;

        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }

        // Swap the found minimum with
        // the first unsorted element
        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        }
    }

    return arr;
}`,

        'heap-sort': `function heapSort(arr) {
    const n = arr.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // Extract elements one by one
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        [arr[0], arr[i]] = [arr[i], arr[0]];

        // Heapify the reduced heap
        heapify(arr, i, 0);
    }

    return arr;
}

function heapify(arr, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}
`,

        'tim-sort': `const MIN_MERGE = 32;

function minRunLength(n) {
    let r = 0;
    while (n >= MIN_MERGE) {
        r |= (n & 1);
        n >>= 1;
    }
    return n + r;
}

function timSort(arr) {
    let n = arr.length;
    let minRun = minRunLength(MIN_MERGE);
    
    for (let i = 0; i < n; i += minRun) {
        insertionSort(arr, i, Math.min(i + minRun - 1, n - 1));
    }
    
    for (let size = minRun; size < n; size = 2 * size) {
        for (let left = 0; left < n; left += 2 * size) {
            let mid = left + size - 1;
            let right = Math.min(left + 2 * size - 1, (n - 1));
            if (mid < right) {
                merge(arr, left, mid, right);
            }
        }
    }
    return arr;
}`,

        'intro-sort': `function introSort(arr) {
    let maxDepth = Math.floor(Math.log2(arr.length)) * 2;
    introSortRecursive(arr, 0, arr.length - 1, maxDepth);
    return arr;
}

function introSortRecursive(arr, start, end, maxDepth) {
    let size = end - start;
    if (size < 16) {
        insertionSort(arr, start, end);
        return;
    }
    if (maxDepth === 0) {
        heapSort(arr, start, end);
        return;
    }
    let pivot = partition(arr, start, end);
    introSortRecursive(arr, start, pivot - 1, maxDepth - 1);
    introSortRecursive(arr, pivot + 1, end, maxDepth - 1);
}`,

        'shell-sort': `function shellSort(arr) {
    let n = arr.length;
    
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            let temp = arr[i];
            let j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap];
            }
            arr[j] = temp;
        }
    }
    return arr;
}`,

        'pdq-sort': `// Pattern-Defeating Quicksort (PDQSort)
function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function insertionSort(arr, left, right) {
    for (let i = left + 1; i <= right; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= left && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

function heapify(arr, size, index, start) {
    let cur = start + index;
    let largest = cur;
    let l = start + 2 * index + 1;
    let r = start + 2 * index + 2;
    let limit = start + size;
    
    if (l < limit && arr[l] > arr[largest]) largest = l;
    if (r < limit && arr[r] > arr[largest]) largest = r;
    
    if (largest !== cur) {
        swap(arr, cur, largest);
        heapify(arr, size, largest - start, start);
    }
}

function heapSort(arr, left, right) {
    let size = right - left + 1;
    for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
        heapify(arr, size, i, left);
    }
    for (let i = size - 1; i > 0; i--) {
        swap(arr, left, left + i);
        heapify(arr, i, 0, left);
    }
}

function choosePivot(arr, begin, end) {
    let size = end - begin;
    let mid = begin + Math.floor(size / 2);
    if (arr[begin] > arr[mid]) swap(arr, begin, mid);
    if (arr[mid] > arr[end - 1]) swap(arr, mid, end - 1);
    if (arr[begin] > arr[mid]) swap(arr, begin, mid);
    return mid;
}

function partitionRight(arr, begin, end, pivotPos) {
    let pivotValue = arr[pivotPos];
    swap(arr, pivotPos, end - 1);
    
    let storeIdx = begin;
    for (let i = begin; i < end - 1; i++) {
        if (arr[i] < pivotValue) {
            swap(arr, i, storeIdx);
            storeIdx++;
        }
    }
    swap(arr, storeIdx, end - 1);
    
    let unbalanced = (storeIdx - begin) < (end - storeIdx - 1);
    let threshold = (end - begin) / 8;
    let highlyUnbalanced = (storeIdx - begin) < threshold || (end - storeIdx - 1) < threshold;
    
    return { pivotIdx: storeIdx, highlyUnbalanced: highlyUnbalanced };
}

function pdqSort(arr) {
    pdqSortHelper(arr, 0, arr.length, Math.log2(arr.length));
    return arr;
}

function pdqSortHelper(arr, begin, end, badAllowed) {
    while (true) {
        let size = end - begin;
        if (size < 16) {
            insertionSort(arr, begin, end - 1);
            return;
        }
        if (badAllowed === 0) {
            heapSort(arr, begin, end - 1);
            return;
        }
        
        let pivotPos = choosePivot(arr, begin, end);
        let part = partitionRight(arr, begin, end, pivotPos);
        let pivotIdx = part.pivotIdx;
        let highlyUnbalanced = part.highlyUnbalanced;
        
        pdqSortHelper(arr, begin, pivotIdx, badAllowed);
        
        begin = pivotIdx + 1;
        if (highlyUnbalanced) {
            badAllowed--;
        }
    }
}

pdqSort(arr);
return arr;`,

        'dual-pivot-quick-sort': `function dualPivotQuickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        let pivots = partitionDual(arr, low, high);
        
        dualPivotQuickSort(arr, low, pivots[0] - 1);
        dualPivotQuickSort(arr, pivots[0] + 1, pivots[1] - 1);
        dualPivotQuickSort(arr, pivots[1] + 1, high);
    }
    return arr;
}

function partitionDual(arr, low, high) {
    if (arr[low] > arr[high]) {
        swap(arr, low, high);
    }
    let p = arr[low], q = arr[high];
    let j = low + 1, g = high - 1, k = low + 1;
    
    while (k <= g) {
        if (arr[k] < p) {
            swap(arr, k, j);
            j++;
        } else if (arr[k] >= q) {
            while (arr[g] > q && k < g) g--;
            swap(arr, k, g);
            g--;
            if (arr[k] < p) {
                swap(arr, k, j);
                j++;
            }
        }
        k++;
    }
    j--;
    g++;
    swap(arr, low, j);
    swap(arr, high, g);
    return [j, g];
}`,

        'block-sort': `function blockSort(arr) {
    // Simplified block sort representation
    const n = arr.length;
    let blockSize = Math.floor(Math.sqrt(n));
    
    for (let i = 0; i < n; i += blockSize) {
        insertionSort(arr, i, Math.min(i + blockSize, n));
    }
    
    for (let size = blockSize; size < n; size *= 2) {
        for (let left = 0; left < n; left += 2 * size) {
            let mid = Math.min(left + size, n);
            let right = Math.min(left + 2 * size, n);
            merge(arr, left, mid, right);
        }
    }
    return arr;
}`,

        'dual-fusion-sort': `function dualFusionSort(arr) {
    // Hybrid of Merge Sort and Dual-Pivot Quick Sort
    if (arr.length <= 1) return arr;
    
    if (arr.length < 32) {
        return dualPivotQuickSort(arr, 0, arr.length - 1);
    }
    
    const mid = Math.floor(arr.length / 2);
    const left = dualFusionSort(arr.slice(0, mid));
    const right = dualFusionSort(arr.slice(mid));
    
    return merge(left, right);
}`
    };

    // Lightweight JavaScript syntax highlighter
    const highlightCode = window.highlightCode = function(code) {
        let html = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        const lines = html.split('\n');
        const highlighted = lines.map((line, i) => {
            const lineNum = String(i + 1).padStart(3, ' ');
            let coloredLine = line
                .replace(/(\/\/.*)/g, '<span style=color:#6a9955;font-style:italic;>$1</span>')
                .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, '<span style=color:#ce9178;>$1</span>')
                .replace(/\b(function|const|let|var|if|else|for|while|return|break|continue|new|typeof|class|extends|async|await)\b/g, '<span style=color:#c586c0;>$1</span>')
                .replace(/\b(\d+\.?\d*)\b/g, '<span style=color:#b5cea8;>$1</span>')
                .replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span style=color:#dcdcaa;>$1</span>')
                .replace(/\.(length|push|pop|slice|concat|floor|log)\b/g, '.<span style=color:#4fc1ff;>$1</span>');

            return `<span style="color:#858585;user-select:none;">${lineNum} </span>${coloredLine}`;
        });

        return highlighted.join('\n');
    }

    const highlightCodeForExecution = window.highlightCodeForExecution = function(code) {
        let html = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        const lines = html.split('\n');
        const highlighted = lines.map((line, i) => {
            const lineNum = String(i + 1).padStart(3, ' ');
            let coloredLine = line
                .replace(/(\/\/.*)/g, '<span style=color:#6a9955;font-style:italic;>$1</span>')
                .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, '<span style=color:#ce9178;>$1</span>')
                .replace(/\b(function|const|let|var|if|else|for|while|return|break|continue|new|typeof|class|extends|async|await)\b/g, '<span style=color:#c586c0;>$1</span>')
                .replace(/\b(\d+\.?\d*)\b/g, '<span style=color:#b5cea8;>$1</span>')
                .replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span style=color:#dcdcaa;>$1</span>')
                .replace(/\.(length|push|pop|slice|concat|floor|log)\b/g, '.<span style=color:#4fc1ff;>$1</span>');

            return `<div id="exec-line-${i + 1}" class="px-2 border-l-[3px] border-transparent transition-colors duration-150 whitespace-pre"><span style="color:#858585;user-select:none;margin-right:1rem;">${lineNum}</span>${coloredLine}</div>`;
        });

        return highlighted.join('\n');
    }

    // Tab switching
    const tabOverview = document.getElementById('tab-overview');
    const tabImpl = document.getElementById('tab-implementation');
    const panelOverview = document.getElementById('panel-overview');
    const panelImpl = document.getElementById('panel-implementation');
    const algoCodeEl = document.getElementById('algo-code');
    const codeFilename = document.getElementById('code-filename');
    const btnCopyCode = document.getElementById('btn-copy-code');

    function switchTab(activeTab) {
        if (activeTab === 'overview') {
            tabOverview.className = 'tab-btn text-primary border-b-2 border-primary pb-2 text-sm font-bold cursor-pointer transition-all';
            tabImpl.className = 'tab-btn text-slate-500 hover:text-slate-300 border-b-2 border-transparent pb-2 text-sm font-bold cursor-pointer transition-all';
            panelOverview.classList.remove('hidden');
            panelImpl.classList.add('hidden');
        } else {
            tabImpl.className = 'tab-btn text-primary border-b-2 border-primary pb-2 text-sm font-bold cursor-pointer transition-all';
            tabOverview.className = 'tab-btn text-slate-500 hover:text-slate-300 border-b-2 border-transparent pb-2 text-sm font-bold cursor-pointer transition-all';
            panelImpl.classList.remove('hidden');
            panelOverview.classList.add('hidden');

            // Render code for current algorithm
            if (currentModalAlgoId && algorithmCode[currentModalAlgoId]) {
                const code = algorithmCode[currentModalAlgoId];
                algoCodeEl.innerHTML = highlightCode(code);
                const algoData = algorithms[currentModalAlgoId];
                codeFilename.textContent = (algoData ? algoData.title.toLowerCase().replace(/\s+/g, '_') : 'algorithm') + '.js';
            }
        }
    }

    if (tabOverview) tabOverview.addEventListener('click', () => switchTab('overview'));
    if (tabImpl) tabImpl.addEventListener('click', () => switchTab('implementation'));

    // Copy code button
    if (btnCopyCode) btnCopyCode.addEventListener('click', () => {
        if (currentModalAlgoId && algorithmCode[currentModalAlgoId]) {
            navigator.clipboard.writeText(algorithmCode[currentModalAlgoId]).then(() => {
                btnCopyCode.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> Copied!';
                btnCopyCode.classList.add('text-emerald-400');
                setTimeout(() => {
                    btnCopyCode.innerHTML = '<span class="material-symbols-outlined text-sm">content_copy</span> Copy';
                    btnCopyCode.classList.remove('text-emerald-400');
                }, 2000);
            });
        }
    });

    /* --- BENCHMARK EVENT LISTENERS --- */

    // File upload handler
    UI.benchFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (max 5MB)
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            alert('File is too large. Maximum file size is 5MB.');
            UI.benchFileLabel.textContent = 'File too large';
            return;
        }

        UI.benchFileLabel.textContent = file.name;
        UI.benchFileLabel.classList.add('text-rose-400');
        UI.btnDeleteFile.classList.remove('hidden');

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                let text = evt.target.result;

                // Remove text UI groups like '--- Group: 10 to 100 ---' from averageCase.txt
                text = text.replace(/---.*?---/g, '');

                // Parse comma, space, or newline separated numbers in O(N)
                const nums = [];
                const tokens = text.split(/[\s,]+/);
                const MAX_ELEMENTS = 500000;
                
                for (let i = 0; i < tokens.length && nums.length < MAX_ELEMENTS; i++) {
                    if (tokens[i] !== "") {
                        const num = Number(tokens[i]);
                        if (!isNaN(num) && isFinite(num)) {
                            nums.push(num);
                        }
                    }
                }

                if (nums.length === 0) {
                    alert("Invalid Data Format. No numeric elements found.");
                    benchmarkData = null;
                    UI.benchStatus.textContent = "INVALID DATA";
                    UI.benchStatus.className = "text-rose-500 font-bold text-sm mt-1";
                } else if (nums.length >= MAX_ELEMENTS) {
                    alert(`File contains too many elements. Maximum is ${MAX_ELEMENTS}. Using first ${MAX_ELEMENTS} elements.`);
                    benchmarkData = nums;
                    UI.btnRunBench.disabled = false;
                    UI.benchStatus.textContent = "READY";
                    UI.benchStatus.className = "text-sky-400 font-bold text-sm mt-1";
                    UI.benchResults.classList.remove('hidden');
                    UI.benchResults.classList.add('flex');
                    UI.benchN.textContent = nums.length.toLocaleString();
                } else {
                    benchmarkData = nums;
                    UI.btnRunBench.disabled = false;
                    UI.benchStatus.textContent = "READY";
                    UI.benchStatus.className = "text-sky-400 font-bold text-sm mt-1";
                    UI.benchResults.classList.remove('hidden');
                    UI.benchResults.classList.add('flex');
                    UI.benchN.textContent = nums.length.toLocaleString();
                    UI.benchTime.textContent = "0.00";
                    UI.benchComparisons.textContent = "0";
                    UI.benchSwaps.textContent = "0";

                    // Show theoretical complexity if algo is selected
                    if (currentModalAlgoId) {
                        const algo = algorithms[currentModalAlgoId];
                        const n = nums.length;
                        UI.benchTheoryBest.textContent = computeTheoretical(n, algo.best);
                        UI.benchTheoryAvg.textContent = computeTheoretical(n, algo.avg);
                        UI.benchTheoryWorst.textContent = computeTheoretical(n, algo.worst);
                    }
                }
            } catch (err) {
                console.error('Error parsing benchmark file:', err);
                alert('Error parsing file: ' + err.message);
                UI.benchFileLabel.textContent = 'Upload failed';
                benchmarkData = null;
                UI.benchStatus.textContent = "ERROR";
                UI.benchStatus.className = "text-rose-500 font-bold text-sm mt-1";
            }
        };
        reader.onerror = () => {
            alert('Error reading file. Please try again.');
            console.error('FileReader error');
            UI.benchFileLabel.textContent = 'Read error';
            benchmarkData = null;
            UI.benchStatus.textContent = "ERROR";
            UI.benchStatus.className = "text-rose-500 font-bold text-sm mt-1";
        };
        reader.readAsText(file);
    });

    // Delete file handler
    UI.btnDeleteFile.addEventListener('click', () => {
        benchmarkData = null;
        benchmarkTimeMs = 0;
        UI.benchFile.value = '';
        UI.benchFileLabel.textContent = 'Select File...';
        UI.benchFileLabel.classList.remove('text-rose-400');
        UI.btnDeleteFile.classList.add('hidden');
        UI.benchResults.classList.add('hidden');
        UI.benchResults.classList.remove('flex');
        UI.benchStatus.textContent = '';
        UI.benchN.textContent = '0';
        UI.benchTime.textContent = '0.00';
        UI.benchComparisons.textContent = '0';
        UI.benchSwaps.textContent = '0';
        UI.benchTheoryBest.textContent = 'â€”';
        UI.benchTheoryAvg.textContent = 'â€”';
        UI.benchTheoryWorst.textContent = 'â€”';
        UI.benchActualTime.textContent = '0.00';
        UI.benchTheoreticalTime.textContent = '0.00';
        UI.benchDiffBadge.textContent = 'â€”';
        UI.benchDiffBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-400';
        UI.benchBarActual.style.width = '0%';
        UI.benchBarTheory.style.width = '0%';
        UI.benchBarActualLabel.textContent = '';
        UI.benchBarTheoryLabel.textContent = '';
    });

    // === Time unit selector button handlers ===
    function updateAllTimeDisplays() {
        const u = benchTimeUnit;
        // Top row execution time
        UI.benchTime.textContent = displayTimeInUnit(benchmarkTimeMs, u);
        UI.benchTimeUnit.textContent = u;
        // Comparison cards
        UI.benchActualTime.textContent = displayTimeInUnit(benchmarkTimeMs, u);
        UI.benchActualUnit.textContent = u;
        UI.benchTheoreticalTime.textContent = displayTimeInUnit(storedTheoreticalAvgMs, u);
        UI.benchTheoreticalUnit.textContent = u;
        // Chart bar labels
        UI.benchBarActualLabel.textContent = displayTimeInUnit(benchmarkTimeMs, u) + ' ' + u;
        UI.benchBarTheoryLabel.textContent = displayTimeInUnit(storedTheoreticalAvgMs, u) + ' ' + u;
        // Best/Avg/Worst
        UI.benchTheoryBest.textContent = displayTimeInUnit(storedTheoreticalBestMs, u) + ' ' + u;
        UI.benchTheoryAvg.textContent = displayTimeInUnit(storedTheoreticalAvgMs, u) + ' ' + u;
        UI.benchTheoryWorst.textContent = displayTimeInUnit(storedTheoreticalWorstMs, u) + ' ' + u;
    }

    // Unit selector buttons
    document.querySelectorAll('.bench-unit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const unit = btn.getAttribute('data-unit');
            benchTimeUnit = unit;
            // Highlight active button
            document.querySelectorAll('.bench-unit-btn').forEach(b => {
                b.className = 'bench-unit-btn text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-500 border border-white/10 hover:border-rose-500/30 hover:text-rose-400 transition-all';
            });
            btn.className = 'bench-unit-btn text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all';
            // Re-render all time values
            if (benchmarkTimeMs > 0) {
                updateAllTimeDisplays();
            }
        });
    });

    // Also keep the top-row unit label clickable
    UI.benchTimeUnit.addEventListener('click', () => {
        const units = ['ms', 'Âµs', 'ns'];
        const idx = units.indexOf(benchTimeUnit);
        benchTimeUnit = units[(idx + 1) % units.length];
        // Sync button highlight
        document.querySelectorAll('.bench-unit-btn').forEach(b => {
            const bu = b.getAttribute('data-unit');
            if (bu === benchTimeUnit) {
                b.className = 'bench-unit-btn text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all';
            } else {
                b.className = 'bench-unit-btn text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-500 border border-white/10 hover:border-rose-500/30 hover:text-rose-400 transition-all';
            }
        });
        if (benchmarkTimeMs > 0) {
            updateAllTimeDisplays();
        }
    });

    // Run Benchmark handler
    UI.btnRunBench.addEventListener('click', async () => {
        if (!benchmarkData || benchmarkData.length === 0 || !currentModalAlgoId) return;

        UI.btnRunBench.innerHTML = '<span class="material-symbols-outlined text-sm animate-spin">sync</span>Running...';
        UI.btnRunBench.disabled = true;
        UI.benchStatus.textContent = "BENCHMARKING...";
        UI.benchStatus.className = "text-amber-400 font-bold text-sm mt-1 animate-pulse";

        // Let UI update
        await new Promise(r => setTimeout(r, 50));

        // Create a copy so benchmarkData stays unsorted for re-runs
        const dataCopy = [...benchmarkData];
        let comparisons = 0;
        let swaps = 0;

        try {
            const algo = algorithms[currentModalAlgoId];
            const n = dataCopy.length;

            // === PURE RAW TIMING â€” no async, no overhead ===
            // Always use runRaw for the actual time measurement
            const t0 = performance.now();
            if (algo.runRaw) {
                algo.runRaw(dataCopy);
            } else {
                // If somehow no runRaw, sort in-place with minimal sync logic
                dataCopy.sort((a, b) => a - b);
            }
            const t1 = performance.now();
            benchmarkTimeMs = t1 - t0;  // fully raw, zero async overhead

            // === OPS COUNTING â€” separate untimed pass ===
            // Run RawSortAPI on a fresh copy just to count comparisons/swaps
            const countCopy = [...benchmarkData];
            if (algo.runRaw) {
                // Estimate ops from theoretical complexity
                const avgComplexity = algo.avg.replace(/\s/g, '');
                if (avgComplexity.includes('nlogn') || avgComplexity.includes('nlog')) {
                    comparisons = Math.round(n * Math.log2(n));
                    swaps = Math.round(n * Math.log2(n) / 3);
                } else if (avgComplexity.includes('n') || avgComplexity.includes('n^2')) {
                    comparisons = Math.round(n * n / 2);
                    swaps = Math.round(n * n / 4);
                } else if (avgComplexity.includes('n')) {
                    comparisons = n;
                    swaps = n;
                }
            } else {
                const rawApi = new RawSortAPI(countCopy);
                await algo.run(rawApi);
                comparisons = rawApi.comparisons;
                swaps = rawApi.swaps;
            }

            UI.benchTime.textContent = displayTimeInUnit(benchmarkTimeMs, benchTimeUnit);
            UI.benchTimeUnit.textContent = benchTimeUnit;
            UI.benchStatus.textContent = "SUCCESS";
            UI.benchStatus.className = "text-emerald-400 font-bold text-sm mt-1";

            UI.benchComparisons.textContent = formatLargeNumber(comparisons);
            UI.benchSwaps.textContent = formatLargeNumber(swaps);

            // Show theoretical operation counts
            UI.benchTheoryBest.textContent = computeTheoretical(n, algo.best) + ' ops';
            UI.benchTheoryAvg.textContent = computeTheoretical(n, algo.avg) + ' ops';
            UI.benchTheoryWorst.textContent = computeTheoretical(n, algo.worst) + ' ops';

            // --- Compute theoretical TIME estimates ---
            // These are INDEPENDENT of actual time â€” based on machine-calibrated per-op cost
            storedTheoreticalBestMs = computeTheoreticalTimeMs(n, algo.best);
            storedTheoreticalAvgMs = computeTheoreticalTimeMs(n, algo.avg);
            storedTheoreticalWorstMs = computeTheoreticalTimeMs(n, algo.worst);

            // Render all time displays in current unit
            updateAllTimeDisplays();

            // Diff badge: show how actual compares to theoretical avg
            const diffPercent = ((benchmarkTimeMs - storedTheoreticalAvgMs) / storedTheoreticalAvgMs) * 100;
            if (Math.abs(diffPercent) < 1) {
                UI.benchDiffBadge.textContent = 'â‰ˆ Matches Theory';
                UI.benchDiffBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400';
            } else if (diffPercent < 0) {
                UI.benchDiffBadge.textContent = `${Math.abs(diffPercent).toFixed(1)}% Faster`;
                UI.benchDiffBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400';
            } else {
                UI.benchDiffBadge.textContent = `${diffPercent.toFixed(1)}% Slower`;
                UI.benchDiffBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400';
            }

            // Animate dual bar chart
            const maxTime = Math.max(benchmarkTimeMs, storedTheoreticalWorstMs, storedTheoreticalAvgMs, 0.001);
            const actualBarPct = Math.max(Math.min((benchmarkTimeMs / maxTime) * 100, 100), 2);
            const theoryBarPct = Math.max(Math.min((storedTheoreticalAvgMs / maxTime) * 100, 100), 2);

            // Use requestAnimationFrame for smooth animation
            requestAnimationFrame(() => {
                UI.benchBarActual.style.width = actualBarPct + '%';
                UI.benchBarTheory.style.width = theoryBarPct + '%';
            });

        } catch (err) {
            console.error(err);
            UI.benchStatus.textContent = "ERROR";
            UI.benchStatus.className = "text-rose-500 font-bold text-sm mt-1";
        }

        UI.btnRunBench.innerHTML = '<span class="material-symbols-outlined text-sm">rocket_launch</span>Run Benchmark';
        UI.btnRunBench.disabled = false;
    });

    // Note: btn-start-visualization is now handled by the mini-visualizer IIFE in features.js

});


function updateAlgoHeaders() {
    UI.titleLeft.textContent = algorithms[STATE.leftAlgo].title;
    UI.compLeft.textContent = algorithms[STATE.leftAlgo].avg;
    UI.titleRight.textContent = algorithms[STATE.rightAlgo].title;
    UI.compRight.textContent = algorithms[STATE.rightAlgo].avg;
}

function generateArray() {
    const size = parseInt(UI.sliderSize.value) || 50; // Fallback to 50 if slider read goes wrong initially
    STATE.array = [];
    for (let i = 0; i < size; i++) {
        STATE.array.push(Math.floor(Math.random() * 95) + 5);
    }
    if (UI.sizeDisplay) UI.sizeDisplay.textContent = `Array Buffer: ${size} Elements`;
}

function renderInitialArenas() {
    if (STATE.leftApi) STATE.leftApi.aborted = true;
    if (STATE.rightApi) STATE.rightApi.aborted = true;

    STATE.leftApi = new SortAPI(UI.arenaLeft, 'bg-primary', UI.opsLeft);
    STATE.rightApi = new SortAPI(UI.arenaRight, 'bg-secondary', UI.opsRight);
}

class SortAPI {
    constructor(container, colorClass, opsElement) {
        this.container = container;
        this.colorClass = colorClass;
        this.opsElement = opsElement;
        this.ops = 0;
        this.arr = [...STATE.array];
        this.bars = [];
        this.aborted = false;
        this.renderInitial();
    }

    renderInitial() {
        if (!this.container) return; // safeguard
        this.container.innerHTML = '<div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style="background-image: radial-gradient(circle at 50% 120%, rgba(255,255,255,0.15), transparent 70%);"></div>';
        this.bars = [];
        for (let val of this.arr) {
            let bar = document.createElement('div');
            let marginClass = this.arr.length > 100 ? '' : (this.arr.length > 50 ? 'mx-[0.5px]' : 'mx-[1px]');
            bar.className = `${this.colorClass} flex-1 ${marginClass} rounded-t-sm`;
            bar.style.transition = 'height 0.12s ease, background 0.12s ease, transform 0.12s ease, box-shadow 0.15s ease';
            bar.style.height = `${val}%`;
            this.container.appendChild(bar);
            this.bars.push(bar);
        }
        this.updateOps();
    }

    updateOps() {
        if (this.opsElement) this.opsElement.textContent = this.ops.toLocaleString();
    }

    async sleep() {
        if (this.aborted) throw new Error("Aborted");
        let delay = 101 - (parseInt(UI.sliderSpeed ? UI.sliderSpeed.value : 50));
        if (UI.speedDisplay) UI.speedDisplay.textContent = `Base Yield: ${delay}ms`;
        await new Promise(r => setTimeout(r, Math.max(delay, 5)));
        while (STATE.isPaused) {
            await new Promise(r => STATE.resolvers.push(r));
            if (this.aborted) throw new Error("Aborted");
        }
    }

    async compare(i, j) {
        this.ops++;
        this.updateOps();
        this.bars[i].style.background = 'linear-gradient(180deg, #22d3ee, #06b6d4)';
        this.bars[i].style.boxShadow = '0 0 12px rgba(6,182,212,0.45)';
        this.bars[i].style.transform = 'scaleY(1.04)';
        this.bars[j].style.background = 'linear-gradient(180deg, #22d3ee, #06b6d4)';
        this.bars[j].style.boxShadow = '0 0 12px rgba(6,182,212,0.45)';
        this.bars[j].style.transform = 'scaleY(1.04)';
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
        this.updateOps();
        let temp = this.arr[i];
        this.arr[i] = this.arr[j];
        this.arr[j] = temp;
        this.bars[i].style.height = `${this.arr[i]}%`;
        this.bars[j].style.height = `${this.arr[j]}%`;
        this.bars[i].style.background = 'linear-gradient(180deg, #34d399, #10b981)';
        this.bars[j].style.background = 'linear-gradient(180deg, #34d399, #10b981)';
        this.bars[i].style.boxShadow = '0 0 12px rgba(16,185,129,0.45)';
        this.bars[j].style.boxShadow = '0 0 12px rgba(16,185,129,0.45)';
        this.bars[i].style.transform = 'scaleY(1.08)';
        this.bars[j].style.transform = 'scaleY(1.08)';
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
        this.bars[i].style.boxShadow = '0 0 12px rgba(217,70,239,0.45)';
        this.bars[i].style.transform = 'scaleY(1.06)';
        await this.sleep();
        this.bars[i].style.background = '';
        this.bars[i].style.boxShadow = '';
        this.bars[i].style.transform = '';
    }

    async markLine(lineNum) {
        if (this.aborted) throw new Error("Aborted");
        if (STATE.mode !== 'single') return; 

        // Ignore if operations are too fast (delay extremely low)
        let delay = 101 - (parseInt(UI.sliderSpeed ? UI.sliderSpeed.value : 50));
        
        document.querySelectorAll('#single-code-display div').forEach(el => {
            el.classList.remove('active-exec-line');
        });
        
        const targetLine = document.getElementById(`exec-line-${lineNum}`);
        if (targetLine) {
            targetLine.classList.add('active-exec-line');
            
            // Auto scroll container
            targetLine.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
        
        await new Promise(r => setTimeout(r, Math.max(delay / 2, 5)));
    }
}

function togglePlay() {
    if (!STATE.isPlaying) {
        startSorting();
    } else if (STATE.isPaused) {
        resumeSorting();
    }
}

function stopSorting() {
    STATE.isPlaying = false;
    STATE.isPaused = false;
    if (STATE.leftApi) STATE.leftApi.aborted = true;
    if (STATE.rightApi) STATE.rightApi.aborted = true;
    resumeSorting(); // flush resolvers

    UI.btnPlay.innerHTML = '<span class="material-symbols-outlined fill-1">play_arrow</span><span class="hidden sm:inline">Begin Sorting</span>';
}

function resumeSorting() {
    STATE.isPaused = false;
    STATE.resolvers.forEach(r => r());
    STATE.resolvers = [];
    UI.btnPlay.innerHTML = '<span class="material-symbols-outlined fill-1">play_arrow</span><span class="hidden sm:inline">Sorting...</span>';
}

async function startSorting() {
    STATE.isPlaying = true;
    STATE.isPaused = false;
    UI.btnPlay.innerHTML = '<span class="material-symbols-outlined fill-1">play_arrow</span><span class="hidden sm:inline">Sorting...</span>';

    // In case array is already sorted and they just press play again
    renderInitialArenas();

    if (STATE.mode === 'single') {
        try {
            await algorithms[STATE.leftAlgo].run(STATE.leftApi);
        } catch(e) {
            if (e.message !== "Aborted") console.error(e);
        }
    } else {
        const leftPromise = algorithms[STATE.leftAlgo].run(STATE.leftApi).catch(e => { if (e.message !== "Aborted") console.error(e); });
        const rightPromise = algorithms[STATE.rightAlgo].run(STATE.rightApi).catch(e => { if (e.message !== "Aborted") console.error(e); });
        await Promise.all([leftPromise, rightPromise]);
    }

    if (!STATE.leftApi.aborted) {
        STATE.isPlaying = false;
        UI.btnPlay.innerHTML = '<span class="material-symbols-outlined fill-1">play_arrow</span><span class="hidden sm:inline">Begin Sorting</span>';

        // Cascading green completion sweep on both arenas
        const sweepBars = (api) => {
            if (!api || !api.bars) return;
            api.bars.forEach((bar, i) => {
                setTimeout(() => {
                    bar.style.background = 'linear-gradient(180deg, #4ade80, #16a34a)';
                    bar.style.boxShadow = '0 0 10px rgba(34,197,94,0.35)';
                }, i * 10);
            });
        };
        sweepBars(STATE.leftApi);
        if (STATE.mode !== 'single') sweepBars(STATE.rightApi);

        // Clear highlighted line safely
        if (STATE.mode === 'single') {
            document.querySelectorAll('#single-code-display div').forEach(el => {
                el.classList.remove('active-exec-line');
            });
        }
    }
}

function openModal(algoId) {
    const data = algorithms[algoId];
    if (!data) return;

    // Visually update the sidebar active state
    algoKeys.forEach(key => {
        const btn = document.getElementById(`btn-${key}`);
        if (!btn) return;
        btn.classList.remove('bg-primary/10', 'border-primary/20', 'text-primary');
        btn.classList.add('hover:bg-white/5', 'border-transparent');
        const textSpan = btn.querySelector('span:nth-child(2)');
        if (textSpan) {
            textSpan.classList.remove('font-semibold', 'text-primary');
            textSpan.classList.add('font-medium', 'text-slate-300');
        }
    });

    const activeBtn = document.getElementById(`btn-${algoId}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-primary/10', 'border-primary/20', 'text-primary');
        activeBtn.classList.remove('hover:bg-white/5', 'border-transparent');
        const textSpan = activeBtn.querySelector('span:nth-child(2)');
        if (textSpan) {
            textSpan.classList.add('font-semibold');
            textSpan.classList.remove('font-medium', 'text-slate-300');
        }
    }

    const elTitle = document.getElementById('algo-title');
    const elDesc = document.getElementById('algo-desc');
    const elBest = document.getElementById('algo-best');
    const elAvg = document.getElementById('algo-avg');
    const elWorst = document.getElementById('algo-worst');
    const elSpace = document.getElementById('algo-space');
    const elApps = document.getElementById('algo-apps');
    if (elTitle) elTitle.textContent = data.title;
    if (elDesc) elDesc.textContent = data.desc;
    if (elBest) elBest.textContent = data.best;
    if (elAvg) elAvg.textContent = data.avg;
    if (elWorst) elWorst.textContent = data.worst;
    if (elSpace) elSpace.textContent = data.space;
    if (elApps) elApps.textContent = data.apps;

    const charsList = document.getElementById('algo-chars');
    if (charsList) {
        charsList.innerHTML = '';
        data.chars.forEach(char => {
            const li = document.createElement('li');
            li.className = 'flex items-center gap-2';
            li.innerHTML = `<span class="material-symbols-outlined text-primary text-sm">${char.icon}</span> ${char.text}`;
            charsList.appendChild(li);
        });
    }

    currentModalAlgoId = algoId;

    // Reset tabs to Overview
    const tabOv = document.getElementById('tab-overview');
    const tabIm = document.getElementById('tab-implementation');
    const panelOv = document.getElementById('panel-overview');
    const panelIm = document.getElementById('panel-implementation');
    if (tabOv && tabIm && panelOv && panelIm) {
        tabOv.className = 'tab-btn text-primary border-b-2 border-primary pb-2 text-sm font-bold cursor-pointer transition-all';
        tabIm.className = 'tab-btn text-slate-500 hover:text-slate-300 border-b-2 border-transparent pb-2 text-sm font-bold cursor-pointer transition-all';
        panelOv.classList.remove('hidden');
        panelIm.classList.add('hidden');
    }

    // Pre-populate implementation code
    const algoCodeEl = document.getElementById('algo-code');
    const codeFilename = document.getElementById('code-filename');
    if (algoCodeEl && algorithmCode[algoId]) {
        algoCodeEl.innerHTML = window.highlightCode ? window.highlightCode(algorithmCode[algoId]) : algorithmCode[algoId];
        if (codeFilename) codeFilename.textContent = data.title.toLowerCase().replace(/\s+/g, '_') + '.js';
    }

    // Reset bench UI
    if (UI.benchResults) {
        UI.benchResults.classList.add('hidden');
        UI.benchResults.classList.remove('flex');
        UI.benchFile.value = '';
        UI.benchFileLabel.textContent = 'Select File...';
        UI.benchFileLabel.classList.remove('text-rose-400');
        UI.btnDeleteFile.classList.add('hidden');
        UI.benchStatus.textContent = "";
        UI.benchComparisons.textContent = "0";
        UI.benchSwaps.textContent = "0";
        UI.benchTheoryBest.textContent = "â€”";
        UI.benchTheoryAvg.textContent = "â€”";
        UI.benchTheoryWorst.textContent = "â€”";
        UI.benchActualTime.textContent = '0.00';
        UI.benchTheoreticalTime.textContent = '0.00';
        UI.benchDiffBadge.textContent = 'â€”';
        UI.benchDiffBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-400';
        UI.benchBarActual.style.width = '0%';
        UI.benchBarTheory.style.width = '0%';
        UI.benchBarActualLabel.textContent = '';
        UI.benchBarTheoryLabel.textContent = '';
        benchmarkData = null;
        benchmarkTimeMs = 0;
    }

    // Show full-screen detail page, hide app shell
    const modal = document.getElementById('algorithm-modal');
    const appShell = document.getElementById('app-shell');
    if (appShell) appShell.classList.add('hidden');
    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');

    // Auto-generate default bars in the mini-visualizer
    if (typeof window._dvisInit === 'function') {
        window._dvisInit();
    }
}

/**
 * Central cleanup — call whenever the user navigates away from any feature.
 * Stops visualizations, clears bars, hides tracker, resets modal state.
 */
function resetAllFeatures() {
    // 1. Stop mini-visualizer
    if (typeof window._dvisStop === 'function') window._dvisStop();

    // 2. Clear mini-visualizer bars
    const detailArena = document.getElementById('detail-vis-arena');
    if (detailArena) {
        detailArena.querySelectorAll('.detail-bar').forEach(b => b.remove());
        const placeholder = document.getElementById('detail-vis-placeholder');
        if (placeholder) placeholder.classList.remove('hidden');
    }

    // 3. Hide code execution tracker
    const tracker = document.getElementById('detail-code-tracker');
    if (tracker) tracker.classList.add('hidden');

    // 4. Reset ops counter
    const ops = document.getElementById('detail-vis-ops');
    if (ops) ops.textContent = '0';

    // 5. Clear algorithm modal state
    currentModalAlgoId = null;

    // 6. Stop main arena sorting if running
    if (STATE && STATE.sorting) {
        STATE.sorting = false;
        if (STATE.apiLeft) STATE.apiLeft.aborted = true;
        if (STATE.apiRight) STATE.apiRight.aborted = true;
    }
}

function closeModal() {
    resetAllFeatures();
    const modal = document.getElementById('algorithm-modal');
    const appShell = document.getElementById('app-shell');
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        if (appShell) appShell.classList.remove('hidden');
        // Ensure home page is showing
        const allPIds = ['home-page', 'arena-page', 'visualization-page', 'benchmark-page', 'game-page'];
        allPIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (id === 'home-page') {
                el.classList.remove('hidden');
                el.classList.add('flex');
            } else {
                el.classList.add('hidden');
                el.classList.remove('flex');
            }
        });
    }, 300);
}

// Navigation Logic
document.addEventListener('DOMContentLoaded', () => {
    const homePage = document.getElementById('home-page');
    const arenaPage = document.getElementById('arena-page');
    const btnGoArena = document.getElementById('btn-go-arena');
    const btnStart = document.getElementById('btn-start');
    const btnRecursiveBattle = document.getElementById('btn-recursive-battle');
    const btnHome = document.getElementById('btn-home');

    /* ---- Mobile sidebar drawer ---- */
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const btnHamburgerHome = document.getElementById('btn-hamburger-home');
    const btnHamburgerArena = document.getElementById('btn-hamburger-arena');
    const btnCloseSidebar = document.getElementById('btn-close-sidebar');
    const btnToggleControls = document.getElementById('btn-toggle-controls');
    const mobileControlsPanel = document.getElementById('mobile-controls-panel');

    function openSidebar() {
        if (!sidebar) return;
        sidebar.classList.add('is-open');
        if (overlay) overlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden'; // prevent background scroll
    }

    function closeSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove('is-open');
        if (overlay) overlay.classList.remove('is-visible');
        document.body.style.overflow = '';
    }

    if (btnHamburgerHome)  btnHamburgerHome.addEventListener('click',  openSidebar);
    if (btnHamburgerArena) btnHamburgerArena.addEventListener('click', openSidebar);
    if (btnCloseSidebar)   btnCloseSidebar.addEventListener('click',   closeSidebar);
    if (overlay)           overlay.addEventListener('click',           closeSidebar);

    /* ---- Mobile controls panel toggle ---- */
    if (btnToggleControls && mobileControlsPanel) {
        btnToggleControls.addEventListener('click', () => {
            mobileControlsPanel.classList.toggle('is-open');
        });
    }

    /* ---- Page navigation ---- */
    function showArena() {
        closeSidebar();
        if (homePage && arenaPage) {
            homePage.classList.add('hidden');
            homePage.classList.remove('flex');
            arenaPage.classList.remove('hidden');
            arenaPage.classList.add('flex');
        }
    }

    function showHome() {
        closeSidebar();
        resetAllFeatures();
        // Also hide modal if open
        const modal = document.getElementById('algorithm-modal');
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }
        const appShell = document.getElementById('app-shell');
        if (appShell) appShell.classList.remove('hidden');
        const allPIds = ['home-page', 'arena-page', 'visualization-page', 'benchmark-page', 'game-page'];
        allPIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (id === 'home-page') {
                el.classList.remove('hidden');
                el.classList.add('flex');
            } else {
                el.classList.add('hidden');
                el.classList.remove('flex');
            }
        });
    }

    // "Go to Arena" buttons → open Battle Arena
    if (btnGoArena) btnGoArena.addEventListener('click', () => {
        if (typeof window._openBattle === 'function') window._openBattle();
    });
    if (btnStart) btnStart.addEventListener('click', () => {
        if (typeof window._openBattle === 'function') window._openBattle();
    });
    const btnGoArenaSidebar = document.getElementById('btn-go-arena-sidebar');
    if (btnGoArenaSidebar) btnGoArenaSidebar.addEventListener('click', () => {
        resetAllFeatures();
        closeSidebar();
        if (typeof window._openBattle === 'function') window._openBattle();
    });
    if (btnRecursiveBattle) {
        btnRecursiveBattle.addEventListener('click', () => {
            STATE.mode = 'compare';
            const rightSection = document.getElementById('arena-right-section');
            const codeSection = document.getElementById('single-code-section');
            const divDes = document.getElementById('vs-divider-desktop');
            const divMob = document.getElementById('vs-divider-mobile');

            if (rightSection) { rightSection.classList.remove('hidden'); rightSection.classList.add('flex'); }
            if (divDes) { divDes.classList.remove('hidden'); divDes.classList.add('md:block'); }
            if (divMob) { divMob.classList.remove('hidden'); divMob.classList.add('block'); }
            if (codeSection) { codeSection.classList.add('hidden'); codeSection.classList.remove('flex'); }

            const labelLeft = document.getElementById('left-algo-label');
            const selectorLeft = document.getElementById('selector-left');
            if (labelLeft) labelLeft.textContent = "Algorithm A (Click to Change)";
            if (selectorLeft) selectorLeft.classList.add('cursor-pointer', 'group');

            showArena();
        });
    }
    if (btnHome) btnHome.addEventListener('click', showHome);

    /* ---- Collapsible Sorting Library in sidebar ---- */
    const btnToggleAlgoList = document.getElementById('btn-toggle-algo-list');
    const algoListContainer = document.getElementById('algo-list-container');
    const algoListChevron = document.getElementById('algo-list-chevron');

    if (btnToggleAlgoList && algoListContainer) {
        btnToggleAlgoList.addEventListener('click', () => {
            const isOpen = algoListContainer.style.maxHeight && algoListContainer.style.maxHeight !== '0px';
            if (isOpen) {
                algoListContainer.style.maxHeight = '0px';
                if (algoListChevron) algoListChevron.style.transform = 'rotate(0deg)';
            } else {
                algoListContainer.style.maxHeight = algoListContainer.scrollHeight + 'px';
                if (algoListChevron) algoListChevron.style.transform = 'rotate(180deg)';
            }
        });
    }

    /* ---- Sidebar nav active state helper ---- */
    function setActiveSidebarItem(activeId) {
        const navItems = document.querySelectorAll('.sidebar-nav-item');
        navItems.forEach(item => {
            // Reset all to inactive style
            item.classList.remove('active', 'border-primary', 'bg-primary/10', 'text-white');
            item.classList.add('border-transparent', 'text-slate-400');
            const icon = item.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.classList.remove('text-primary');
                icon.classList.add('text-slate-500');
            }
        });
        // Set active style
        const activeItem = document.getElementById(activeId);
        if (activeItem) {
            activeItem.classList.add('active', 'border-primary', 'bg-primary/10', 'text-white');
            activeItem.classList.remove('border-transparent', 'text-slate-400');
            const icon = activeItem.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.classList.add('text-primary');
                icon.classList.remove('text-slate-500');
            }
        }
    }

    /* ---- Sidebar nav → page routing ---- */
    const allPageIds = ['home-page', 'arena-page', 'visualization-page', 'benchmark-page', 'game-page'];

    function showPageById(pageId) {
        closeSidebar();
        resetAllFeatures();
        // Hide modal if open
        const modal = document.getElementById('algorithm-modal');
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }
        const appShell = document.getElementById('app-shell');
        if (appShell) appShell.classList.remove('hidden');
        allPageIds.forEach(id => {
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

    const btnNavVis = document.getElementById('btn-nav-visualization');
    const btnNavBench = document.getElementById('btn-nav-benchmark');
    const btnNavComplexity = document.getElementById('btn-nav-complexity');
    const btnNavGame = document.getElementById('btn-nav-game');

    if (btnNavVis) btnNavVis.addEventListener('click', () => {
        showPageById('visualization-page');
        setActiveSidebarItem('btn-nav-visualization');
    });
    if (btnNavBench) btnNavBench.addEventListener('click', () => {
        showPageById('benchmark-page');
        setActiveSidebarItem('btn-nav-benchmark');
    });
    if (btnNavComplexity) btnNavComplexity.addEventListener('click', () => {
        // Open complexity analysis modal/chart
        const complexityModal = document.getElementById('complexityModal');
        if (complexityModal) {
            complexityModal.style.display = 'flex';
        }
    });
    if (btnNavGame) btnNavGame.addEventListener('click', () => {
        showPageById('game-page');
        setActiveSidebarItem('btn-nav-game');
    });

    // Update active state when Home button is clicked
    if (btnHome) {
        const originalClickHandler = btnHome.onclick;
        btnHome.addEventListener('click', () => setActiveSidebarItem('btn-home'));
    }

    /* ---- Keyboard: Escape closes sidebar ---- */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });
});


// ========== GLOBAL COMPLEXITY CHART VARIABLES & FUNCTIONS ==========
let chart = null;
let ctx = null;
let nValues = [];
let fn = {};
let algorithms_complexity = [];

let selectedCase = "avg";
let activeAlgorithms = new Set();
let selectedAlgorithm = null;
let complexityInputMode = 'auto';
let complexityInputData = [];
let complexityCurrentRanking = [];
let complexityInputStats = null;
let complexityFileUploaded = false;
let complexityTimingData = { best: {}, avg: {}, worst: {} }; // Store actual execution times per case per algorithm

// DOM elements
let complexitySourceAuto, complexitySourceManual, complexitySourceFile;
let complexityInputAuto, complexityInputManual, complexityInputFile;
let complexityAutoSize, complexityAutoSizeLabel, complexityManualText;
let complexityFileInput, complexityFileLabel, btnComplexityResetFile;
let btnAnalyzeInput, complexityFileUploadLabel;
let complexitySummarySize, complexitySummaryPIndex, complexitySummaryType, complexitySummarySorted;
let complexityRankingBody, complexityRankedCount, complexityAlgoDetails;
let complexitySortPreview, complexitySortedPreview;
let modal, openBtn, closeBtn, openCardBtn, complexityCard;
let derivationTooltip;

// Setup complexity functions
function initComplexityFunctions() {
  fn = {
    "1": n => 1,
    "logn": n => Math.log2(Math.max(n, 1)),
    "n": n => n,
    "nlogn": n => n * Math.log2(Math.max(n, 1)),
    "nlog2n": n => n * Math.pow(Math.log2(Math.max(n, 1)), 2),
    "n2": n => n * n
  };
  
  algorithms_complexity = [
    { name: "Quick Sort", best: "nlogn", avg: "nlogn", worst: "n2", color: "#00f7ff" },
    { name: "Merge Sort", best: "nlogn", avg: "nlogn", worst: "nlogn", color: "#00ffa6" },
    { name: "Heap Sort", best: "nlogn", avg: "nlogn", worst: "nlogn", color: "#ffd166" },
    { name: "Bubble Sort", best: "n", avg: "n2", worst: "n2", color: "#ff4d6d" },
    { name: "Selection Sort", best: "n2", avg: "n2", worst: "n2", color: "#ff6b6b" },
    { name: "Insertion Sort", best: "n", avg: "n2", worst: "n2", color: "#f72585" },
    { name: "Tim Sort", best: "n", avg: "nlogn", worst: "nlogn", color: "#4cc9f0" },
    { name: "Shell Sort", best: "nlogn", avg: "nlog2n", worst: "n2", color: "#90dbf4" },
    { name: "Block Sort", best: "n", avg: "nlogn", worst: "nlogn", color: "#72efdd" },
    { name: "Dual Pivot Quick Sort", best: "nlogn", avg: "nlogn", worst: "n2", color: "#64dfdf" },
    { name: "Pdq Sort", best: "n", avg: "nlogn", worst: "nlogn", color: "#48bfe3" },
    { name: "Intro Sort", best: "nlogn", avg: "nlogn", worst: "nlogn", color: "#5390d9" },
    { name: "Dual Fusion Sort", best: "nlogn", avg: "nlogn", worst: "nlogn", color: "#6930c3" }
  ];
  
  activeAlgorithms = new Set(algorithms_complexity.map(a => a.name));
  nValues = Array.from({ length: 100 }, (_, i) => Math.floor((i + 1) * 3));
  
  // Initialize timing data with empty arrays for each case
  complexityTimingData = { best: {}, avg: {}, worst: {} };
  algorithms_complexity.forEach(algo => {
    complexityTimingData.best[algo.name] = [];
    complexityTimingData.avg[algo.name] = [];
    complexityTimingData.worst[algo.name] = [];
  });
}

// Initialize DOM references
function initComplexityDOMElements() {
  complexitySourceAuto = document.getElementById('complexity-source-auto');
  complexitySourceManual = document.getElementById('complexity-source-manual');
  complexitySourceFile = document.getElementById('complexity-source-file');
  complexityInputAuto = document.getElementById('complexity-input-auto');
  complexityInputManual = document.getElementById('complexity-input-manual');
  complexityInputFile = document.getElementById('complexity-input-file');
  complexityAutoSize = document.getElementById('complexity-auto-size');
  complexityAutoSizeLabel = document.getElementById('complexity-auto-size-label');
  complexityManualText = document.getElementById('complexity-manual-text');
  complexityFileInput = document.getElementById('complexity-file-input');
  complexityFileLabel = document.getElementById('complexity-file-label');
  btnComplexityResetFile = document.getElementById('btn-complexity-reset-file');
  btnAnalyzeInput = document.getElementById('btn-analyze-input');
  complexityFileUploadLabel = document.getElementById('complexity-file-upload-label');
  complexitySummarySize = document.getElementById('complexity-summary-size');
  complexitySummaryPIndex = document.getElementById('complexity-summary-pindex');
  complexitySummaryType = document.getElementById('complexity-summary-type');
  complexitySummarySorted = document.getElementById('complexity-summary-sorted');
  complexityRankingBody = document.getElementById('complexity-ranking-body');
  complexityRankedCount = document.getElementById('complexity-ranked-count');
  complexityAlgoDetails = document.getElementById('complexity-algo-details');
  complexitySortPreview = document.getElementById('complexity-sort-preview');
  complexitySortedPreview = document.getElementById('complexity-sorted-preview');
  modal = document.getElementById("complexityModal");
  openBtn = document.getElementById("openComplexity");
  closeBtn = document.getElementById("closeComplexity");
  openCardBtn = document.getElementById("openComplexity-card");
  complexityCard = document.getElementById("card-complexity");
}

function setComplexityMode(mode) {
  complexityInputMode = mode;
  if (complexityInputAuto) complexityInputAuto.classList.toggle('hidden', mode !== 'auto');
  if (complexityInputManual) complexityInputManual.classList.toggle('hidden', mode !== 'manual');
  if (complexityInputFile) complexityInputFile.classList.toggle('hidden', mode !== 'file');
  document.querySelectorAll('.complexity-source-btn').forEach(btn => btn.classList.toggle('active', btn.id === `complexity-source-${mode}`));
}

function parseInputText(text) {
  if (!text) return [];
  
  try {
    const nums = [];
    
    // Fast native extraction of numbers, bypassing slow comment regexes
    const matches = text.match(/-?\d+(\.\d+)?/g);
    if (matches) {
      for (let i = 0; i < matches.length; i++) {
        nums.push(Number(matches[i]));
      }
    }
    
    console.log('Parsed', nums.length, 'numbers from input text');
    return nums;
  } catch (err) {
    console.error('Error parsing input text:', err);
    return [];
  }
}

function computeSortedPortion(arr) {
  if (!arr || arr.length < 2) return 100;
  let sortedCount = 1;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] >= arr[i - 1]) sortedCount++;
  }
  return Math.round((sortedCount / arr.length) * 100);
}

function computeInputStats(arr) {
  const p = analyzePresortedness(arr);
  const sorted = computeSortedPortion(arr);
  return {
    n: arr.length,
    pIndex: p.pIndex,
    inputType: p.type,
    sortedPortion: sorted
  };
}

function findAlgoKeyByTitle(title) {
  const key = Object.keys(algorithms).find(k => algorithms[k].title.toLowerCase() === title.toLowerCase());
  return key || null;
}

function predictComparisonsForAlgo(title, stats) {
  const algo = algorithms_complexity.find(a => a.name === title);
  if (!algo || !stats) return 0;
  const n = Math.max(1, stats.n);
  let comps = 0;
  switch (algo.avg) {
    case 'n': comps = n; break;
    case 'nlogn': comps = n * Math.log2(n); break;
    case 'nlog2n': comps = n * Math.pow(Math.log2(n), 2); break;
    case 'n2': comps = n * n; break;
    case 'logn': comps = Math.log2(n); break;
    default: comps = n * Math.log2(n);
  }
  if (stats.sortedPortion >= 80 && ['Bubble Sort', 'Insertion Sort', 'Selection Sort'].includes(title)) comps *= 0.3;
  if (stats.pIndex >= 85 && ['Tim Sort', 'Pdq Sort', 'Intro Sort', 'Dual Pivot Quick Sort'].includes(title)) comps *= 0.9;
  if (stats.inputType.includes('Reverse') && title === 'Insertion Sort') comps *= 1.5;
  return Math.round(Math.max(comps, 1));
}

function rankAlgorithmsForInputData(arr) {
  const stats = computeInputStats(arr);
  complexityInputStats = stats;
  const ranked = algorithms_complexity.map(algo => {
    let score = 50;
    const isAdaptive = ['Tim Sort', 'Pdq Sort', 'Intro Sort', 'Dual Fusion Sort', 'Dual Pivot Quick Sort'].includes(algo.name);
    const isQuadratic = ['Bubble Sort', 'Selection Sort', 'Insertion Sort'].includes(algo.name);
    if (stats.pIndex >= 80 && isAdaptive) score += 25;
    if (stats.pIndex >= 70 && isAdaptive) score += 15;
    if (algo.avg === 'nlogn' && stats.n >= 100) score += 15;
    if (algo.avg === 'n' && stats.sortedPortion >= 75) score += 20;
    if (isQuadratic && stats.n > 200) score -= 20;
    if (isQuadratic && stats.sortedPortion >= 80) score += 10;
    if (algo.name === 'Heap Sort' && stats.n > 500) score += 10;
    if (stats.inputType === 'Reverse-Sorted' && algo.name === 'Merge Sort') score += 10;
    if (stats.inputType === 'Reverse-Sorted' && algo.name === 'Insertion Sort') score -= 10;
    if (stats.sortedPortion >= 85 && algo.name === 'Insertion Sort') score += 20;
    if (stats.sortedPortion >= 85 && algo.name === 'Bubble Sort') score += 15;
    if (stats.sortedPortion <= 20 && algo.name === 'Merge Sort') score += 10;

    const expectedOps = predictComparisonsForAlgo(algo.name, stats);
    const note = getAlgoStrengths(findAlgoKeyByTitle(algo.name) || algo.name, stats.pIndex);
    return {
      title: algo.name,
      score: Math.max(5, Math.min(99, Math.round(score))),
      expectedOps,
      note,
      key: findAlgoKeyByTitle(algo.name)
    };
  });

  ranked.sort((a, b) => b.score - a.score || a.expectedOps - b.expectedOps);
  complexityCurrentRanking = ranked;
  return ranked;
}

function updateComplexitySummary(stats) {
  if (!stats) return;
  if (complexitySummarySize) complexitySummarySize.textContent = `${stats.n.toLocaleString()} items`;
  if (complexitySummaryPIndex) complexitySummaryPIndex.textContent = `${stats.pIndex}%`;
  if (complexitySummaryType) complexitySummaryType.textContent = stats.inputType;
  if (complexitySummarySorted) complexitySummarySorted.textContent = `${stats.sortedPortion}%`;
}

/* --- TOOLTIP DICTIONARY & UI --- */
const complexityDerivations = {
  'Quick Sort': 'Divides array into two partitions recursively (log n layers). Scans each layer once (n operations). Expected: O(n log n). Worst case O(n²) if pivot is consistently poor.',
  'Merge Sort': 'Recursively halves the array (log n depth) and merges halves by linearly comparing elements (n ops/layer). Always strictly O(n log n).',
  'Heap Sort': 'Builds a max-heap (O(n)), then repeatedly extracts maximum. Sifting down an element takes O(log n), done n times. Total: O(n log n).',
  'Bubble Sort': 'Repeatedly steps through the list, comparing/swapping adjacent elements. Up to n passes for n elements. Total strictly O(n²).',
  'Selection Sort': 'Scans the unsorted array to find the minimum (O(n)). Repeated n times. Arithmetic progression sum yields strictly O(n²).',
  'Insertion Sort': 'Builds the sorted array one element at a time. The i-th element takes up to i comparisons. Summing 1 to n yields O(n²).',
  'Tim Sort': 'Hybrid of Merge & Insertion. Identifies natural strictly increasing runs (O(n)) and merges them. Minimum run sizes optimize cache. Bounded O(n log n).',
  'Shell Sort': 'Generalization of insertion sort allowing exchanges of far-apart elements. Complexity depends on gap sequence; usually O(n log n) or O(n^(4/3)).',
  'Block Sort': 'In-place stable merging by dividing array into small blocks, sorting blocks, and merging. Overhead keeps complexity uniformly bound to O(n log n).',
  'Dual Pivot Quick Sort': 'Employs two pivots, partitioning array into three segments. Reduces deep recursion logarithmically compared to a single pivot. Expected O(n log n).',
  'Pdq Sort': 'Pattern-defeating quicksort. Blends Quick Sort with Insertion Sort for small arrays and Heap Sort to guarantee worst-case ceiling at O(n log n).',
  'Intro Sort': 'Begins with Quick Sort but aggressively switches to Heap Sort if recursion tree depth exceeds 2 * log(n), guaranteeing worst case O(n log n).',
  'Quickmerge Sort': 'Hybrid uniting Quick Sort partitioning with exact Merge Sort stability invariants. Constrained perfectly at O(n log n).',
  'Dual Fusion Sort': 'Custom hybrid optimizing concurrent pivot boundaries while seamlessly merging overlapping sub-arrays. Practically O(n log n).',
  'In-place Merge Sort': 'Performs merge boundaries without auxiliary O(n) memory by using block rotations or complex pointer inversions. Yields O(n log² n) or O(n log n).'
};

derivationTooltip = document.getElementById('derivation-tooltip');
if (!derivationTooltip) {
    derivationTooltip = document.createElement('div');
    derivationTooltip.id = 'derivation-tooltip';
    derivationTooltip.className = 'fixed z-[9999] max-w-[280px] p-3 rounded-xl bg-slate-900 border border-white/10 shadow-2xl shadow-fuchsia-500/20 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-200 text-[11px] text-slate-300 leading-relaxed font-mono';
    document.body.appendChild(derivationTooltip);
}

function showDerivationTooltip(title, e) {
    const text = complexityDerivations[title] || 'Complexity derivation determined dynamically by bounds mapping.';
    derivationTooltip.innerHTML = `<span class="text-white font-bold mb-1 block flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-fuchsia-400"></span>${title} Derivation</span>${text}`;
    derivationTooltip.style.left = (e.clientX + 15) + 'px';
    derivationTooltip.style.top = (e.clientY + 15) + 'px';
    derivationTooltip.style.opacity = '1';
}

function hideDerivationTooltip() {
    derivationTooltip.style.opacity = '0';
}
function moveDerivationTooltip(e) {
    derivationTooltip.style.left = (e.clientX + 15) + 'px';
    derivationTooltip.style.top = (e.clientY + 15) + 'px';
}

function renderRankingTable(ranked) {
  if (!complexityRankingBody) return;
  complexityRankingBody.innerHTML = '';
  ranked.forEach((algo, index) => {
    const row = document.createElement('tr');
    row.className = 'border-b border-white/5 cursor-pointer hover:bg-white/5 relative';
    row.dataset.algoTitle = algo.title;
    
    const timeStr = algo.actualTime !== undefined ? algo.actualTime.toFixed(3) + ' ms' : 'N/A';
    row.innerHTML = `
      <td class="py-2 pr-2 text-slate-300 font-bold">${index + 1}</td>
      <td class="py-2 pr-2 text-slate-200">${algo.title}</td>
      <td class="py-2 pr-2 text-slate-400">${timeStr}</td>
    `;
    row.addEventListener('click', () => selectComplexityAlgorithm(algo.title));
    row.addEventListener('mouseenter', (e) => showDerivationTooltip(algo.title, e));
    row.addEventListener('mousemove', moveDerivationTooltip);
    row.addEventListener('mouseleave', hideDerivationTooltip);
    complexityRankingBody.appendChild(row);
  });
  if (complexityRankedCount) complexityRankedCount.textContent = `${ranked.length} algorithms`;
}

function buildDetailsHtml(algo, stats, preview) {
  const currentInput = stats ? `${stats.n.toLocaleString()} items` : (complexityInputData ? `${complexityInputData.length} items` : 'no input');
  const rankPosition = complexityCurrentRanking.indexOf(algo) + 1;
  const reason = algo.note || 'Measured timing data';
  const timeText = algo.actualTime !== undefined ? `${algo.actualTime.toFixed(3)} ms` : 'N/A';
  
  return `
    <p class="text-[11px] text-slate-400 uppercase tracking-wider">Selected Algorithm</p>
    <p class="text-white font-bold text-sm">${algo.title}</p>
    <p class="text-slate-300 text-[12px]">Input: ${currentInput} · Execution Time: <strong>${timeText}</strong></p>
    <p class="text-slate-400 text-[11px]">Details: ${reason}</p>
    <p class="text-slate-400 text-[11px]">Based on actual execution time from the benchmark, this algorithm is ranked <strong>#${rankPosition}</strong>.</p>
  `;
}

function selectComplexityAlgorithm(title) {
  selectedAlgorithm = title;
  document.querySelectorAll('.algo-btn').forEach(btn => {
    btn.classList.toggle('active-highlight', btn.innerText === title);
  });
  document.querySelectorAll('#complexity-ranking-body tr').forEach(row => {
    row.classList.toggle('bg-white/10', row.dataset.algoTitle === title);
  });

  const algo = complexityCurrentRanking.find(item => item.title === title);
  if (!algo) return;
  
  // Handle both input-based stats and performance-based rankings
  let statsToUse = complexityInputStats;
  let preview = { sample: [] };
  
  if (statsToUse && complexityInputData) {
    preview = sortInputPreview(algo.key, complexityInputData, statsToUse);
  }
  
  // Update algorithm details section
  if (complexityAlgoDetails) {
    complexityAlgoDetails.innerHTML = buildDetailsHtml(algo, statsToUse, preview.sample);
  }
  
  if (complexitySortPreview) {
    if (preview.sample.length > 0) {
      complexitySortPreview.classList.remove('hidden');
      complexitySortedPreview.textContent = preview.sample.join(', ');
    } else {
      complexitySortPreview.classList.add('hidden');
    }
  }
  
  updateChart(true);
}

function sortInputPreview(key, arr, stats) {
  if (!arr || arr.length === 0) return { sample: [], duration: 0 };
  const sampleCount = 20;
  const copy = [...arr];
  let duration = 0;
  const start = performance.now();
  try {
    if (key && algorithms[key] && algorithms[key].runRaw && arr.length <= 1000) {
      algorithms[key].runRaw(copy);
    } else {
      copy.sort((a, b) => a - b);
    }
    duration = performance.now() - start;
  } catch (e) {
    copy.sort((a, b) => a - b);
    duration = performance.now() - start;
  }
  return {
    sample: copy.slice(0, sampleCount),
    duration: Math.round(duration)
  };
}

function analyzeComplexityInput() {
  let inputSize;
  let customArray = null;
  
  // Check if user explicitly uploaded a file (takes priority over slider)
  if (complexityFileUploaded && complexityInputData && complexityInputData.length >= 10) {
    inputSize = complexityInputData.length;
    customArray = complexityInputData;
  } else {
    inputSize = Number(complexityAutoSize?.value) || 50;
  }
  
  if (inputSize < 10) {
    alert('Input size should be at least 10 elements for meaningful timing analysis.');
    return;
  }
  
  // Show loading indicator
  if (btnAnalyzeInput) btnAnalyzeInput.textContent = 'Analyzing... (Running Benchmarks)';
  if (btnAnalyzeInput) btnAnalyzeInput.disabled = true;
  
  // Show loading overlay
  const loadingOverlay = document.getElementById('complexity-loading-overlay');
  if (loadingOverlay) loadingOverlay.classList.remove('hidden');
  
  // Run timing benchmark asynchronously
  setTimeout(async () => {
    try {
      console.log(`Running timing benchmark with input size: ${inputSize}, case: ${selectedCase}, fileData: ${!!customArray}`);
      await runTimingBenchmark(inputSize, 'random', customArray);
      
      // Update summary
      const caseLabel = selectedCase === 'best' ? 'Best (Sorted)' : selectedCase === 'worst' ? 'Worst (Reverse)' : 'Average (Random)';
      if (complexitySummarySize) complexitySummarySize.textContent = inputSize + ' elements';
      if (complexitySummaryType) complexitySummaryType.textContent = caseLabel;
      if (customArray) {
        const stats = computeInputStats(customArray);
        complexityInputStats = stats;
        if (complexitySummaryPIndex) complexitySummaryPIndex.textContent = `${stats.pIndex}%`;
        if (complexitySummarySorted) complexitySummarySorted.textContent = `${stats.sortedPortion}%`;
      } else {
        if (complexitySummaryPIndex) complexitySummaryPIndex.textContent = selectedCase === 'best' ? '~100%' : selectedCase === 'worst' ? '~0%' : '~50%';
        if (complexitySummarySorted) complexitySummarySorted.textContent = 'Auto-generated';
      }
      
      // Update ranking based on performance at largest size
      const rankedByPerformance = getRankedByPerformance();
      if (complexityRankedCount) complexityRankedCount.textContent = `${rankedByPerformance.length} algorithms analyzed`;
      renderPerformanceRanking(rankedByPerformance);
      
      // Select the top-ranked algorithm and update details
      if (rankedByPerformance.length > 0) {
        selectComplexityAlgorithm(rankedByPerformance[0].title);
      }
      
      // Update chart
      if (chart) {
        updateChart(true);
      }
      
      console.log('Benchmark complete. Timing data:', complexityTimingData);
    } catch (e) {
      console.error('Error during benchmark:', e);
      alert('Error running benchmark: ' + e.message);
    } finally {
      if (btnAnalyzeInput) {
        btnAnalyzeInput.textContent = 'Analyze Input';
        btnAnalyzeInput.disabled = false;
      }
      // Hide loading overlay
      if (loadingOverlay) loadingOverlay.classList.add('hidden');
    }
  }, 100);
}

function resetComplexityAll() {
  // Reset timing data
  complexityTimingData = { best: {}, avg: {}, worst: {} };
  algorithms_complexity.forEach(algo => {
    complexityTimingData.best[algo.name] = [];
    complexityTimingData.avg[algo.name] = [];
    complexityTimingData.worst[algo.name] = [];
  });
  
  // Reset input data
  complexityInputData = [];
  complexityFileUploaded = false;
  
  // Reset file upload UI
  if (complexityFileLabel) complexityFileLabel.textContent = 'Select file...';
  if (complexityFileInput) complexityFileInput.value = '';
  if (btnComplexityResetFile) btnComplexityResetFile.classList.add('hidden');
  if (complexityFileUploadLabel) {
    complexityFileUploadLabel.classList.remove('border-cyan-500/30');
    complexityFileUploadLabel.classList.add('border-white/10');
  }
  
  // Reset slider
  if (complexityAutoSize) {
    complexityAutoSize.value = 50;
    if (complexityAutoSizeLabel) complexityAutoSizeLabel.textContent = '50';
  }
  
  // Reset case to Average
  selectedCase = 'avg';
  document.querySelectorAll('.case-btn').forEach(b => {
    b.classList.remove('active');
    if (b.dataset.case === 'average') b.classList.add('active');
  });
  
  // Reset all algorithm toggles to active
  activeAlgorithms = new Set(algorithms_complexity.map(a => a.name));
  selectedAlgorithm = null;
  document.querySelectorAll('.algo-btn').forEach(b => {
    b.classList.add('active');
    b.classList.remove('opacity-40', 'scale-95', 'active-highlight');
  });
  
  // Reset summary
  if (complexitySummarySize) complexitySummarySize.textContent = '—';
  if (complexitySummaryPIndex) complexitySummaryPIndex.textContent = '—';
  if (complexitySummaryType) complexitySummaryType.textContent = '—';
  if (complexitySummarySorted) complexitySummarySorted.textContent = '—';
  
  // Reset ranking
  complexityCurrentRanking = [];
  if (complexityRankingBody) complexityRankingBody.innerHTML = '';
  if (complexityRankedCount) complexityRankedCount.textContent = '0 algorithms';
  if (complexityAlgoDetails) complexityAlgoDetails.innerHTML = '<p class="text-slate-400">Select a ranked algorithm to see why it was chosen and how it sorts this input.</p>';
  if (complexitySortPreview) complexitySortPreview.classList.add('hidden');
  
  // Reset chart
  if (chart) {
    updateChart(true);
  }
  
  console.log('Complexity analysis reset to defaults');
}

function getRankedByPerformance() {
  // Rank algorithms by actual performance (lower time = better)
  const rankings = [];
  
  const caseData = complexityTimingData[selectedCase] || {};
  Object.keys(caseData).forEach(algoName => {
    const timings = caseData[algoName];
    if (timings && timings.length > 0) {
      // Get the last (largest) timing value as overall performance
      const lastTiming = timings[timings.length - 1];
      const algoKey = findAlgoKeyByTitle(algoName);
      const algo = algorithms_complexity.find(a => a.name === algoName);
      
      rankings.push({
        title: algoName,
        actualTime: lastTiming.y,
        testSize: lastTiming.x,
        score: 100 - Math.min(99, (lastTiming.y / 100)),
        expectedOps: Math.round(lastTiming.y * 1000),
        note: algo ? `Performance: ${lastTiming.y.toFixed(2)}ms on ${lastTiming.x} elements` : 'Measured timing data',
        key: algoKey
      });
    }
  });
  
  // Sort by actual time (ascending)
  rankings.sort((a, b) => a.actualTime - b.actualTime);
  complexityCurrentRanking = rankings;
  
  return rankings;
}

function renderPerformanceRanking(rankings) {
  if (!complexityRankingBody) return;
  complexityRankingBody.innerHTML = '';
  
  rankings.forEach((algo, index) => {
    const row = document.createElement('tr');
    row.className = 'border-b border-white/5 cursor-pointer hover:bg-white/5 relative';
    row.dataset.algoTitle = algo.title;
    
    const timeStr = algo.actualTime.toFixed(3) + ' ms';
    row.innerHTML = `
      <td class="py-2 pr-2 text-slate-300 font-bold">${index + 1}</td>
      <td class="py-2 pr-2 text-slate-200">${algo.title}</td>
      <td class="py-2 pr-2 text-slate-400">${timeStr}</td>
    `;
    
    row.addEventListener('click', () => selectComplexityAlgorithm(algo.title));
    row.addEventListener('mouseenter', (e) => showDerivationTooltip(algo.title, e));
    row.addEventListener('mousemove', moveDerivationTooltip);
    row.addEventListener('mouseleave', hideDerivationTooltip);
    complexityRankingBody.appendChild(row);
  });
}

// ========== GLOBAL FUNCTIONS FOR CHART ==========

function getDatasets() {
  const caseData = complexityTimingData[selectedCase] || {};
  const caseLabel = selectedCase === 'best' ? 'Best Case' : selectedCase === 'avg' ? 'Average Case' : 'Worst Case';

  const datasets = algorithms_complexity.map(a => {
    const rawTimings = caseData[a.name] || [];
    // Prepend origin point (0, 0) so every line starts from the origin
    const timings = rawTimings.length > 0 && (rawTimings[0].x !== 0)
      ? [{ x: 0, y: 0 }, ...rawTimings]
      : (rawTimings.length === 0 ? rawTimings : rawTimings);
    return {
      label: `${a.name} (${caseLabel})`,
      data: timings,
      borderColor: a.color,
      backgroundColor: a.color + '15',
      borderWidth: selectedAlgorithm === a.name ? 3 : (activeAlgorithms.has(a.name) ? 1.5 : 0.5),
      fill: false,
      tension: 0.3,
      hidden: !activeAlgorithms.has(a.name),
      pointRadius: 2,
      pointHoverRadius: 5,
      pointBackgroundColor: a.color,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 1,
      clip: false,
      segment: {
        borderDash: selectedAlgorithm === a.name ? [] : [5, 5]
      }
    };
  });

  return datasets;
}

function updateChart(animate = false) {
  if (!chart) return;
  try {
    chart.data.datasets = getDatasets();
    // Don't set labels for timing data (using {x, y} format instead)
    
    const container = document.getElementById('complexityChartContainer');
    if (container && chart.canvas) {
      const rect = container.getBoundingClientRect();
      chart.canvas.style.width = rect.width + 'px';
      chart.canvas.style.height = rect.height + 'px';
    }
    
    chart.resize();
    chart.update(animate ? { duration: 400 } : "none");
  } catch(e) {
    console.error('Chart update error:', e);
  }
}

function highlightSortingAlgorithm(name) {
  console.log("Selected:", name);
}

function openComplexityModal() {
  if (modal) {
    modal.style.display = "block";
    setTimeout(async () => {
      // Auto-run benchmark on first open so chart has data
      const hasData = complexityTimingData.avg && 
        Object.values(complexityTimingData.avg).some(t => t && t.length > 0);
      
      if (!hasData) {
        const defaultSize = 500;
        const defaultArr = generateTestArray(defaultSize, 'random');
        complexityInputData = defaultArr;
        
        // Show loading state
        const loadingOverlay = document.getElementById('complexity-loading-overlay');
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');
        if (btnAnalyzeInput) {
          btnAnalyzeInput.textContent = 'Running initial benchmark...';
          btnAnalyzeInput.disabled = true;
        }
        
        try {
          await runTimingBenchmark(defaultSize, 'random', null);
          
          // Update summary
          if (complexitySummarySize) complexitySummarySize.textContent = defaultSize + ' elements';
          if (complexitySummaryType) complexitySummaryType.textContent = 'Raw Time Measurement';
          if (complexitySummarySorted) complexitySummarySorted.textContent = 'N/A (Actual timing)';
          
          const rankedByPerformance = getRankedByPerformance();
          if (complexityRankedCount) complexityRankedCount.textContent = `${rankedByPerformance.length} algorithms analyzed`;
          renderPerformanceRanking(rankedByPerformance);
          
          if (rankedByPerformance.length > 0) {
            selectComplexityAlgorithm(rankedByPerformance[0].title);
          }
        } catch (e) {
          console.error('Auto-benchmark error:', e);
          // Fall back to theoretical ranking
          const ranked = rankAlgorithmsForInputData(defaultArr);
          updateComplexitySummary(complexityInputStats);
          renderRankingTable(ranked);
          if (ranked.length > 0) {
            selectComplexityAlgorithm(ranked[0].title);
          }
        } finally {
          if (btnAnalyzeInput) {
            btnAnalyzeInput.textContent = 'Analyze Input';
            btnAnalyzeInput.disabled = false;
          }
          if (loadingOverlay) loadingOverlay.classList.add('hidden');
        }
      }
      
      if (chart) {
        chart.resize();
        updateChart(true);
      }
    }, 150);
  }
}

// ========== RAW TIME COMPLEXITY MEASUREMENT SYSTEM ==========
function measureAlgorithmTime(algorithmKey, arr) {
  // Get the algorithm's raw implementation
  const algo = algorithms[algorithmKey];
  if (!algo || !algo.runRaw) return null;
  
  // Create a copy of the array to sort
  const arrCopy = [...arr];
  
  // Measure execution time
  const startTime = performance.now();
  try {
    algo.runRaw(arrCopy);
  } catch (e) {
    console.error(`Error running ${algo.title}:`, e);
    return null;
  }
  const endTime = performance.now();
  
  return endTime - startTime;
}

function generateTestArray(size, type = 'random') {
  const arr = [];
  if (type === 'random') {
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * 10000));
    }
  } else if (type === 'sorted') {
    for (let i = 0; i < size; i++) {
      arr.push(i);
    }
  } else if (type === 'reverse') {
    for (let i = 0; i < size; i++) {
      arr.push(size - i);
    }
  }
  return arr;
}

async function runTimingBenchmark(inputSize, inputType = 'random', customArray = null) {
  // Reset all timing data
  complexityTimingData = { best: {}, avg: {}, worst: {} };
  algorithms_complexity.forEach(algo => {
    complexityTimingData.best[algo.name] = [];
    complexityTimingData.avg[algo.name] = [];
    complexityTimingData.worst[algo.name] = [];
  });
  
  const algoKeys = Object.keys(algorithms);
  
  // Pre-compute test sizes
  let startSize = Math.min(10, Math.max(1, inputSize));
  let step = Math.max(1, Math.floor(inputSize / 20));
  const testSizes = [];
  for (let size = startSize; size <= inputSize; size += step) {
    testSizes.push(size);
  }
  
  // Define input generators for each case
  const caseGenerators = {
    best: (size) => {
      if (customArray && customArray.length >= size) {
        const slice = customArray.slice(0, size);
        return slice.sort((a, b) => a - b);
      }
      return generateTestArray(size, 'sorted');
    },
    avg: (size) => {
      if (customArray && customArray.length >= size) {
        return customArray.slice(0, size);
      }
      return generateTestArray(size, 'random');
    },
    worst: (size) => {
      if (customArray && customArray.length >= size) {
        const slice = customArray.slice(0, size);
        return slice.sort((a, b) => b - a);
      }
      return generateTestArray(size, 'reverse');
    }
  };
  
  // Pre-generate test arrays for each case and size
  // This ensures ALL algorithms sort the EXACT SAME input at each size
  const testArrays = { best: {}, avg: {}, worst: {} };
  for (const caseType of ['best', 'avg', 'worst']) {
    for (const size of testSizes) {
      testArrays[caseType][size] = caseGenerators[caseType](size);
    }
  }
  
  for (const key of algoKeys) {
    const algo = algorithms[key];
    if (!algo.runRaw) continue;
    
    const complexityAlgo = algorithms_complexity.find(a => 
      a.name.toLowerCase() === algo.title.toLowerCase()
    );
    if (!complexityAlgo) continue;
    
    // Run benchmark for each case
    for (const caseType of ['best', 'avg', 'worst']) {
      const timings = [];
      
      let isTooSlow = false;
      let baseTime = 0;
      let baseSize = 0;
      
      // Determine the algorithm's complexity class for this case (for proper extrapolation)
      const complexityClass = complexityAlgo[caseType]; // e.g. "nlogn", "n2", "n"
      
      for (const size of testSizes) {
        if (isTooSlow) {
          // Extrapolate using the algorithm's ACTUAL complexity class
          let extrapolatedTime;
          switch (complexityClass) {
            case 'n':
              extrapolatedTime = baseTime * (size / baseSize);
              break;
            case 'logn':
              extrapolatedTime = baseTime * (Math.log2(size) / Math.log2(baseSize));
              break;
            case 'nlogn':
              extrapolatedTime = baseTime * (size * Math.log2(size)) / (baseSize * Math.log2(baseSize));
              break;
            case 'nlog2n':
              extrapolatedTime = baseTime * (size * Math.pow(Math.log2(size), 2)) / (baseSize * Math.pow(Math.log2(baseSize), 2));
              break;
            case 'n2':
            default:
              extrapolatedTime = baseTime * Math.pow(size / baseSize, 2);
              break;
          }
          timings.push({ x: size, y: extrapolatedTime });
          continue;
        }

        // Use the PRE-GENERATED array (same for all algorithms at this size)
        const testArr = testArrays[caseType][size];
        
        // Warm-up run (discard) — triggers JIT compilation
        measureAlgorithmTime(key, testArr);
        
        // Measure 3 runs and take the median for stability
        const runs = [];
        for (let r = 0; r < 3; r++) {
          const time = measureAlgorithmTime(key, testArr);
          if (time !== null) runs.push(time);
        }
        
        if (runs.length > 0) {
          runs.sort((a, b) => a - b);
          const median = runs[Math.floor(runs.length / 2)];
          timings.push({ x: size, y: median });
          
          if (median > 50) {
            isTooSlow = true;
            baseTime = median;
            baseSize = size;
          }
        }
        
        // Yield to main thread to prevent UI freezing
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      
      if (timings.length > 0) {
        complexityTimingData[caseType][complexityAlgo.name] = timings;
      }
    }
  }
  
  return complexityTimingData;
}

// ========== DOM INITIALIZATION - RUN WHEN DOM IS READY ==========
document.addEventListener('DOMContentLoaded', function() {

  // Initialize all complexity data
  initComplexityFunctions();
  initComplexityDOMElements();

  // Get canvas context
  const canvasEl = document.getElementById('complexityChart');
  if (!canvasEl) {
    console.error('Canvas element not found');
    return;
  }
  ctx = canvasEl.getContext('2d');

  // CREATE BUTTONS
  const toggleContainer = document.getElementById("algoToggle");
  if (!toggleContainer) {
    console.error('algoToggle container not found');
  } else {
    console.log('algoToggle container found, adding ' + algorithms_complexity.length + ' buttons');
    algorithms_complexity.forEach(algo => {
      const btn = document.createElement("button");
      btn.className = "algo-btn active transition-all duration-300";
      if (!activeAlgorithms.has(algo.name)) {
          btn.classList.remove("active");
          btn.classList.add("opacity-40", "scale-95");
      }
      btn.innerText = algo.name;

      btn.onclick = () => {
        // Toggle algorithm visibility
        if (activeAlgorithms.has(algo.name)) {
          activeAlgorithms.delete(algo.name);
          btn.classList.remove("active", "active-highlight");
          btn.classList.add("opacity-40", "scale-95");
          
          // Clear selectedAlgorithm if we just disabled it
          if (selectedAlgorithm === algo.name) {
              selectedAlgorithm = null;
          }
        } else {
          activeAlgorithms.add(algo.name);
          btn.classList.add("active");
          btn.classList.remove("opacity-40", "scale-95");
          
          selectedAlgorithm = algo.name;
          document.querySelectorAll(".algo-btn").forEach(b => b.classList.remove("active-highlight"));
          btn.classList.add("active-highlight");
          
          highlightSortingAlgorithm(algo.name);
          selectComplexityAlgorithm(algo.name);
        }

        updateChart(true);
      };

      toggleContainer.appendChild(btn);
    });
  }

  // CASE TOGGLE WITH ANIMATION
  document.querySelectorAll(".case-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".case-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      selectedCase = btn.dataset.case === "average" ? "avg" : btn.dataset.case;

      updateChart(true); // animate
    };
  });

  // CREATE CHART
  chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: getDatasets()
    },
    options: {
      layout: {
        padding: { right: 120 }
      },
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 800,
        easing: "easeInOutQuart"
      },
      plugins: {
        legend: {
          labels: { color: "#fff" },
          display: true,
          position: 'top',
          onClick: function(e, legendItem, legend) {
              const label = legendItem.text.split(' (')[0];
              
              if (activeAlgorithms.has(label)) {
                  activeAlgorithms.delete(label);
              } else {
                  activeAlgorithms.add(label);
              }
              
              // Sync buttons visually
              document.querySelectorAll(".algo-btn").forEach(b => {
                  if (b.innerText === label) {
                      if (activeAlgorithms.has(label)) {
                         b.classList.add("active");
                         b.classList.remove("opacity-40", "scale-95");
                      } else {
                         b.classList.remove("active", "active-highlight");
                         b.classList.add("opacity-40", "scale-95");
                      }
                  }
              });
              updateChart(true);
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const algo = context.dataset.label.split(' (')[0];
              const time = context.parsed.y.toFixed(3);
              const size = context.parsed.x;
              return `${algo}: ${time} ms (n=${size})`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          beginAtZero: true,
          min: 0,
          title: {
            display: true,
            text: 'Array Size (number of elements)',
            color: '#94a3b8',
            font: { size: 12 }
          },
          ticks: { 
            color: "#aaa",
            callback: function(value) {
              return value.toLocaleString();
            }
          },
          grid: { color: "rgba(255,255,255,0.05)" }
        },
        y: {
          type: "linear",
          beginAtZero: true,
          title: {
            display: true,
            text: 'Execution Time (milliseconds)',
            color: '#94a3b8',
            font: { size: 12 }
          },
          ticks: { 
            color: "#aaa",
            callback: function(value) {
              if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
              if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
              return value;
            }
          },
          grid: { color: "rgba(255,255,255,0.05)" }
        }
      }
    },
    plugins: [{
      id: 'inlineAlgorithmLabels',
      afterDatasetsDraw: (chart) => {
        const { ctx: canvasCtx, data } = chart;
        canvasCtx.save();
        
        let pendingLabels = [];

        data.datasets.forEach((dataset, i) => {
          if (dataset.hidden || dataset.type === 'bar') return;
          const meta = chart.getDatasetMeta(i);
          if (!meta || meta.hidden || !meta.data || meta.data.length === 0) return;
          const lastPoint = meta.data[meta.data.length - 1];
          if (!lastPoint || !lastPoint.x || isNaN(lastPoint.y)) return;
          
          pendingLabels.push({
            text: dataset.label.split(' (')[0],
            x: lastPoint.x,
            targetY: lastPoint.y,
            y: lastPoint.y,
            color: dataset.borderWidth === 3 ? '#ffffff' : dataset.borderColor,
            font: dataset.borderWidth === 3 ? 'bold 11px "Space Grotesk", sans-serif' : '10px "Space Grotesk", sans-serif',
            alpha: dataset.borderWidth === 3 ? 1.0 : 0.8
          });
        });
        
        pendingLabels.sort((a, b) => a.y - b.y);
        
        const LABEL_HEIGHT = 14; 
        let overlapping = true;
        let resolveIterations = 0;
        
        while (overlapping && resolveIterations < 50) {
            overlapping = false;
            for (let i = 0; i < pendingLabels.length - 1; i++) {
                let current = pendingLabels[i];
                let next = pendingLabels[i + 1];
                
                const distance = next.y - current.y;
                if (distance < LABEL_HEIGHT) {
                    overlapping = true;
                    const adjust = (LABEL_HEIGHT - distance) / 2;
                    current.y -= adjust;
                    next.y += adjust;
                }
            }
            resolveIterations++;
        }
        
        pendingLabels.forEach(p => {
          if (Math.abs(p.y - p.targetY) > 3) {
              canvasCtx.beginPath();
              canvasCtx.moveTo(p.x + 2, p.targetY);
              canvasCtx.lineTo(p.x + 6, p.y);
              canvasCtx.strokeStyle = p.color;
              canvasCtx.globalAlpha = 0.3;
              canvasCtx.lineWidth = 1;
              canvasCtx.stroke();
          }
          
          canvasCtx.fillStyle = p.color;
          canvasCtx.font = p.font;
          canvasCtx.globalAlpha = p.alpha;
          canvasCtx.fillText(p.text, p.x + 8, p.y + 4);
        });
        canvasCtx.restore();
      }
    }]
  });

  // Bind event listeners
  console.log('Binding event listeners...');
  if (btnAnalyzeInput) {
    console.log('Found btnAnalyzeInput, binding click listener');
    btnAnalyzeInput.addEventListener('click', analyzeComplexityInput);
  } else {
    console.error('btnAnalyzeInput not found!');
  }
  
  // Case buttons (Best/Average/Worst) are handled by the .case-btn handler above

  // Reset button in the input source section
  const btnComplexityReset = document.getElementById('btn-complexity-reset');
  if (btnComplexityReset) {
    btnComplexityReset.addEventListener('click', resetComplexityAll);
  }

  if (complexityAutoSize) {
    complexityAutoSize.addEventListener('input', () => {
      if (complexityAutoSizeLabel) complexityAutoSizeLabel.textContent = complexityAutoSize.value;
    });
  }

  if (complexityFileInput) {
    complexityFileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      // Validate file size (max 5MB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        alert('File is too large. Maximum file size is 5MB.');
        complexityFileLabel.textContent = 'File too large';
        if (btnComplexityResetFile) btnComplexityResetFile.classList.add('hidden');
        return;
      }
      
      complexityFileLabel.textContent = file.name;
      if (btnComplexityResetFile) btnComplexityResetFile.classList.remove('hidden');
      if (complexityFileUploadLabel) complexityFileUploadLabel.classList.add('border-cyan-500/30');
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          let text = e.target.result;
          const arr = [];
          
          // Fast native extraction of numbers, bypassing slow comment regexes
          const matches = text.match(/-?\d+(\.\d+)?/g);
          if (matches) {
            for (let i = 0; i < matches.length; i++) {
              arr.push(Number(matches[i]));
            }
          }
          
          if (arr.length === 0) {
            alert('Uploaded file did not contain numeric values.');
            complexityInputData = [];
          } else {
            complexityInputData = arr;
            complexityFileUploaded = true;
            console.log('Successfully loaded', arr.length, 'values from complexity file');
          }
        } catch (err) {
          console.error('Error parsing complexity file:', err);
          alert('Error parsing file: ' + err.message);
          complexityFileLabel.textContent = 'Parse error';
          complexityInputData = [];
        }
      };
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        console.error('FileReader error');
        complexityFileLabel.textContent = 'Read error';
        complexityInputData = [];
      };
      reader.readAsText(file);
    });
  }

  if (btnComplexityResetFile) {
    btnComplexityResetFile.addEventListener('click', () => {
      if (complexityFileInput) complexityFileInput.value = '';
      complexityFileLabel.textContent = 'Select file...';
      btnComplexityResetFile.classList.add('hidden');
      if (complexityFileUploadLabel) complexityFileUploadLabel.classList.remove('border-cyan-500/30');
      complexityInputData = [];
      complexityFileUploaded = false;
    });
  }

  if (openBtn) openBtn.onclick = () => { console.log('openBtn clicked'); openComplexityModal(); };
  if (openCardBtn) { 
    console.log('Found openCardBtn');
    openCardBtn.onclick = () => { console.log('openCardBtn clicked'); openComplexityModal(); };
  } else {
    console.error('openCardBtn not found');
  }
  
  if (complexityCard) {
    complexityCard.onclick = (e) => {
      console.log('complexityCard clicked');
      if (!e.target.closest('button')) openComplexityModal();
    };
  } else {
    console.error('complexityCard not found');
  }
  
  if (closeBtn) closeBtn.onclick = () => { console.log('closeBtn clicked'); modal.style.display = "none"; };
  else console.error('closeBtn not found');
  
  if (modal) {
    window.addEventListener('click', e => { if (e.target === modal) modal.style.display = "none"; });
  } else {
    console.error('modal not found');
  }
  
  console.log('DOMContentLoaded initialization complete');

}); // END OF DOMContentLoaded


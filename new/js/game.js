/* STITCH DESIGNED GAMIFIED LEARNING FEATURE */
(function() {
  let isGameMode = false;
  let score = 0;
  let heatmapData = [];
  let moveLogGame = [];
  let selectedIndices = [];
  let compCount = 0;
  let swapCount = 0;
  
  window.toggleGameMode = function() {
    isGameMode = !isGameMode;
    const aiPanel = document.getElementById('aiPanel');
    
    if (isGameMode) {
      if(aiPanel) {
        aiPanel.classList.remove('hidden');
        // trigger reflow
        void aiPanel.offsetWidth;
        aiPanel.classList.add('opacity-100');
      }
      
      // Auto-navigate to arena if not there
      const btnGoArena = document.getElementById('btn-go-arena');
      if (btnGoArena) btnGoArena.click();

      score = 0;
      compCount = 0;
      swapCount = 0;
      heatmapData = [];
      moveLogGame = [];
      selectedIndices = [];
      document.getElementById('score').innerText = '0';
      document.getElementById('strategy').innerText = 'UNKNOWN';
      document.getElementById('feedback').innerText = 'Game Mode Active! Select two bars to swap.';
      
      updateHeatmapGame();
    } else {
      if(aiPanel) {
        aiPanel.classList.remove('opacity-100');
        setTimeout(() => aiPanel.classList.add('hidden'), 300);
      }
      selectedIndices = [];
      
      // Clear visual selections from bars
      document.querySelectorAll('.bar, [style*="height"]').forEach(b => b.style.boxShadow = '');
    }
  };

  // Close button binding
  setTimeout(() => {
    const cb = document.getElementById('close-game-btn');
    if (cb) cb.addEventListener('click', () => { if(isGameMode) window.toggleGameMode(); });
  }, 1000);

  // Bind the Hero Button explicitly
  setTimeout(() => {
    const heroBtn = document.getElementById('btn-hero-gameMode');
    if(heroBtn) heroBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if(!isGameMode) window.toggleGameMode();
    });
  }, 1000);

  // Catch clicks globally for the game
  document.addEventListener('click', (e) => {
    if (!isGameMode) return;
    
    const bar = e.target.closest('.bar') || e.target.closest('[style*="height"]');
    if (!bar) return;
    
    const container = bar.parentElement;
    if (!container || (!container.id.includes('array') && !container.id.includes('vis'))) return;

    const barsList = Array.from(container.children);
    const index = barsList.indexOf(bar);
    
    if (index === -1) return;
    
    // Selection logic
    if (selectedIndices.includes(index)) {
      selectedIndices = selectedIndices.filter(i => i !== index);
      bar.style.boxShadow = ''; // deselect
    } else {
      if (selectedIndices.length < 2) {
        selectedIndices.push(index);
        bar.style.boxShadow = '0 0 15px #00f5d4, inset 0 0 10px #00f5d4';
      }
    }
    
    // Compare & Swap logic
    if (selectedIndices.length === 2) {
      document.getElementById('feedback').innerText = 'Analyzing Neural Pathway...';
      const idx1 = selectedIndices[0];
      const idx2 = selectedIndices[1];
      
      compCount++;
      swapCount++;
      
      setTimeout(() => {
        let diff = Math.abs(idx1 - idx2);
        let moveType = diff === 1 ? 'bubble' : (diff > 1 && diff < 5 ? 'insertion' : 'selection');
        moveLogGame.push(moveType);
        
        let points = 0;
        let cHex = "#ef476f"; 
        if (moveType === 'bubble') { 
          points = 10; cHex = "#00f5d4"; 
        } else if (moveType === 'insertion') {
          points = 25; cHex = "#ffb703"; 
        } else {
          points = 40; cHex = "#f72585"; 
        }
        
        heatmapData.push(cHex);
        score += points;
        
        let strategyStr = "MIXED";
        let bCount = moveLogGame.filter(m=>m==='bubble').length;
        let iCount = moveLogGame.filter(m=>m==='insertion').length;
        let sCount = moveLogGame.filter(m=>m==='selection').length;
        let maxCount = Math.max(bCount, iCount, sCount);
        if(bCount === maxCount && bCount > 0) strategyStr = "BUBBLE SORT ??";
        else if(iCount === maxCount) strategyStr = "INSERTION SORT ?";
        else if(sCount === maxCount) strategyStr = "QUICK/SELECT ?";
        
        document.getElementById('strategy').innerText = strategyStr;
        document.getElementById('strategy').style.color = cHex;
        document.getElementById('strategy').style.textShadow = '0 10px ' + cHex;
        
        // Count animation logic
        let currentScore = parseInt(document.getElementById('score').innerText);
        animateValue("score", currentScore, score, 500);

        document.getElementById('feedback').innerText = (points > 20 ? 'Optimal Meta! +' : 'Move logged. +') + points + ' XP';
        
        updateHeatmapGame();
        
        const b1 = barsList[idx1];
        const b2 = barsList[idx2];
        const inner1 = b1.innerHTML;
        const inner2 = b2.innerHTML;
        const h1 = b1.style.height;
        const h2 = b2.style.height;
        
        b1.style.height = h2;
        b1.innerHTML = inner2;
        b2.style.height = h1;
        b2.innerHTML = inner1;
        
        b1.style.boxShadow = '';
        b2.style.boxShadow = '';
        selectedIndices = [];
      }, 300);
    }
  });

  function updateHeatmapGame() {
    let container = document.getElementById("heatmap");
    if (!container) return;
    container.innerHTML = "";
    heatmapData.forEach(colorHex => {
      let block = document.createElement("div");
      block.className = "w-[12px] h-[12px] rounded-sm transition-transform duration-300 transform scale-0 animate-scale-in";
      block.style.backgroundColor = colorHex;
      block.style.boxShadow = '0 8px ' + colorHex;
      // Animate block appearance
      setTimeout(()=> { block.classList.remove('scale-0'); block.classList.add('scale-100'); }, 10);
      container.appendChild(block);
    });
  }

  function animateValue(id, start, end, duration) {
    if (start === end) return;
    var range = end - start;
    var current = start;
    var increment = end > start ? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
  }
})();

// ==========================================
// GAME PAGE ENGINE (YOU ARE THE ALGORITHM)
// ==========================================
(function() {
  const pageHome = document.getElementById('home-page');
  const pageGame = document.getElementById('game-page');
  const btnHero = document.getElementById('btn-hero-gameMode');
  const btnBack = document.getElementById('btn-back-to-home');
  
  if (!pageGame) return; // Prevent crashes if HTML is missing
  
  // State
  let isGameActive = false;
  let gameArray = [];
  let selectedIndices = [];
  let numBars = 10;
  
  let stats = { compares: 0, swaps: 0, score: 100 };
  let moveHistory = []; // Tracks actions
  let heatmapData = []; // Heatmap colors
  
  // Navigation
  if (btnHero) {
    btnHero.addEventListener('click', () => {
      // Hide all top level pages, show game page
      document.querySelectorAll('.flex-1 > div[id$="-page"]').forEach(p => {
        if (!p.id.includes('game-page')) p.classList.add('hidden');
      });
      pageGame.classList.remove('hidden');
      pageGame.classList.add('flex');
      isGameActive = true;
      initGame();
    });
  }

  // Sidebar "Fun with Sorting" button
  const btnNavGame = document.getElementById('btn-nav-game');
  if (btnNavGame) {
    btnNavGame.addEventListener('click', () => {
      isGameActive = true;
      // Give DOM a tick to ensure the page is visible before rendering bars
      setTimeout(() => initGame(), 50);
    });
  }
  
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      // Hide all pages, show home
      const allPIds = ['home-page', 'arena-page', 'visualization-page', 'benchmark-page', 'performance-matrices-page', 'game-page'];
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
      isGameActive = false;
      // Reset sidebar active state to Home
      const homeBtn = document.getElementById('btn-home');
      if (homeBtn) homeBtn.click();
    });
  }
  
  // Game Logic
  function initGame() {
    gameArray = [];
    selectedIndices = [];
    stats = { compares: 0, swaps: 0, score: 100 };
    moveHistory = [];
    heatmapData = [];
    
    for(let i=0; i<numBars; i++) {
       gameArray.push(Math.floor(Math.random() * 90) + 10);
    }
    
    updateUI();
    renderBars();
    setFeedback("SELECT TWO BARS TO SWAP OR COMPARE");
    document.getElementById('game-strategy-txt').innerText = "- - -";
    document.getElementById('game-heatmap').innerHTML = "";
  }
  
  function renderBars() {
    const container = document.getElementById('game-array-container');
    if(!container) return;
    container.innerHTML = '';
    
    gameArray.forEach((val, i) => {
      const bar = document.createElement('div');
      bar.className = 'w-10 sm:w-16 rounded-t-lg flex flex-col justify-end items-center transition-all duration-300 cursor-pointer hover:brightness-125';
      bar.style.height = val + "%";
      bar.style.backgroundColor = selectedIndices.includes(i) ? '#00f5d4' : '#2b2dc0';
      if (selectedIndices.includes(i)) bar.style.boxShadow = '0 0 15px #00f5d4';
      
      const label = document.createElement('span');
      label.className = 'text-white text-[10px] font-bold mb-1';
      label.innerText = val;
      
      bar.appendChild(label);
      bar.addEventListener('click', () => handleBarClick(i));
      container.appendChild(bar);
    });
  }
  
  function handleBarClick(idx) {
    if (selectedIndices.includes(idx)) {
      selectedIndices = selectedIndices.filter(i => i !== idx);
    } else {
      if (selectedIndices.length < 2) {
        selectedIndices.push(idx);
      }
    }
    renderBars();
  }
  
  // Buttons
  const btnSwap = document.getElementById('game-btn-swap');
  const btnComp = document.getElementById('game-btn-compare');
  const btnReset = document.getElementById('game-btn-reset');
  
  if (btnSwap) btnSwap.addEventListener('click', () => performAction('swap'));
  if (btnComp) btnComp.addEventListener('click', () => performAction('compare'));
  if (btnReset) btnReset.addEventListener('click', initGame);
  
  function performAction(type) {
    if (selectedIndices.length !== 2) {
      setFeedback("Must select exactly 2 bars!");
      return;
    }
    
    let [i, j] = selectedIndices;
    if (i > j) { let temp = i; i = j; j = temp; }
    
    if (type === 'compare') {
      stats.compares++;
      setFeedback("Compared elements.");
      moveHistory.push({ type: 'compare', diff: j - i });
    } else if (type === 'swap') {
      stats.swaps++;
      let temp = gameArray[i];
      gameArray[i] = gameArray[j];
      gameArray[j] = temp;
      setFeedback("Swapped!");
      moveHistory.push({ type: 'swap', diff: j - i, v1: gameArray[j], v2: gameArray[i] }); 
    }
    
    selectedIndices = [];
    analyzeMove(type, j - i);
    renderBars();
    updateUI();
  }
  
  function analyzeMove(type, diff) {
    let pts = 0;
    let color = "#ef476f"; // Red (bad)
    
    if (type === 'swap') {
      if (diff === 1) {
        // Adjacent swap (Bubble sort style)
        pts = 5; color = "#ffd166"; // Yellow
      } else {
        // Long distance swap (Selection/Quick style)
        pts = 15; color = "#00f5d4"; // Green
      }
    } else if (type === 'compare') {
      pts = 2; color = "#118ab2"; // Blue
    }
    
    heatmapData.push(color);
    stats.score += pts;
    if (stats.score > 200) stats.score = 200; // Cap
    
    updateStrategyDetection();
    renderHeatmap();
  }
  
  function updateStrategyDetection() {
    if (moveHistory.length < 3) return;
    
    let swaps = moveHistory.filter(m => m.type === 'swap');
    if (swaps.length === 0) return;
    
    let adjacent = swaps.filter(m => m.diff === 1).length;
    let long = swaps.filter(m => m.diff > 2).length;
    
    let strategy = "MIXED APPROACH";
    let stColor = "#fff";
    
    if (adjacent / swaps.length >= 0.7) {
      strategy = "BUBBLE SORT";
      stColor = "#ffb703";
    } else if (long / swaps.length >= 0.5) {
      strategy = "SELECTION SORT";
      stColor = "#00f5d4";
    }
    
    const sElem = document.getElementById('game-strategy-txt');
    if(sElem) {
      sElem.innerText = strategy;
      sElem.style.color = stColor;
      sElem.style.textShadow = '0 0 10px ' + stColor;
    }
  }
  
  function renderHeatmap() {
    const hm = document.getElementById('game-heatmap');
    if(!hm) return;
    hm.innerHTML = "";
    
    // Limits
    let displayData = heatmapData.slice(-30);
    displayData.forEach(c => {
      let b = document.createElement('div');
      b.className = "w-4 h-full rounded-sm opacity-80 shrink-0";
      b.style.backgroundColor = c;
      hm.appendChild(b);
    });
    hm.scrollLeft = hm.scrollWidth;
    
    // Update Tooltip Heatmap grid
    renderTooltipHeatmap();
  }
  
  function renderTooltipHeatmap() {
    const tg = document.getElementById('tooltip-heatmap-grid');
    if(!tg) return;
    // We only need to generate it once or we can give it dynamic ripples. Let's just generate a nice static-looking matrix with varying opacities if it's empty, and just mildly update it.
    if(tg.children.length === 0) {
      const colors = ['bg-emerald-400', 'bg-emerald-500', 'bg-teal-400', 'bg-cyan-400', 'bg-yellow-400', 'bg-amber-500', 'bg-rose-500', 'bg-pink-500'];
      for (let i = 0; i < 48; i++) {
        let span = document.createElement('div');
        let col = colors[Math.floor(Math.random() * colors.length)];
        let op = [0.4, 0.6, 0.8, 1][Math.floor(Math.random() * 4)];
        span.className = `w-full aspect-square rounded-[2px] ${col}`;
        span.style.opacity = op;
        tg.appendChild(span);
      }
    } else {
      // randomly shift a few blocks to make it feel "live"
      for (let i = 0; i < 5; i++) {
         let idx = Math.floor(Math.random() * 48);
         let colors = ['bg-emerald-400', 'bg-emerald-500', 'bg-teal-400', 'bg-cyan-400', 'bg-yellow-400', 'bg-amber-500', 'bg-rose-500', 'bg-pink-500'];
         let span = tg.children[idx];
         if(span) {
            span.className = `w-full aspect-square rounded-[2px] ${colors[Math.floor(Math.random() * colors.length)]} transition-colors duration-500`;
            span.style.opacity = [0.4, 0.6, 0.8, 1][Math.floor(Math.random() * 4)];
         }
      }
    }
  }
  
  function updateUI() {
    if(document.getElementById('game-comparisons')) document.getElementById('game-comparisons').innerText = stats.compares;
    if(document.getElementById('game-swaps')) document.getElementById('game-swaps').innerText = stats.swaps;
    
    // Update Score
    if(document.getElementById('game-score')) document.getElementById('game-score').innerText = stats.score;
    if(document.getElementById('tooltip-score')) document.getElementById('tooltip-score').innerText = stats.score;
    
    // Update Strategy in tooltip if available
    if(document.getElementById('tooltip-strategy')) {
      const stratElem = document.getElementById('game-strategy-txt');
      if(stratElem) document.getElementById('tooltip-strategy').innerText = stratElem.innerText + " ⚡";
    }

    // Bar
    const b = document.getElementById('game-eff-bar');
    const p = document.getElementById('game-eff-pct');
    let pct = Math.max(0, Math.min(100, Math.floor(stats.score / 2)));
    if(b) b.style.width = pct + "%";
    if(p) p.innerText = pct + "%";
  }
  
  function setFeedback(txt) {
    const f = document.getElementById('game-feedback');
    if(f) {
      f.innerText = txt;
      f.style.transform = 'translate(-50%, -10px)';
      f.style.opacity = '1';
      setTimeout(() => {
        f.style.transform = 'translate(-50%, 0)';
      }, 200);
    }
  }

})();


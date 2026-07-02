/* ============================================================
   GAME ENGINE — "You Are The Algorithm" 
   Premium Gamified Sorting Experience
   ============================================================ */
(function () {
  'use strict';

  const pageGame = document.getElementById('game-page');
  if (!pageGame) return;

  // ─── Constants ───
  const DIFFICULTIES = {
    easy:   { bars: 6,  label: 'Easy',   multiplier: 1,   color: '#4ade80' },
    medium: { bars: 10, label: 'Medium', multiplier: 1.5, color: '#fbbf24' },
    hard:   { bars: 16, label: 'Hard',   multiplier: 2.5, color: '#f87171' },
    expert: { bars: 24, label: 'Expert', multiplier: 4,   color: '#a78bfa' },
  };

  // ─── State ───
  let gameArray = [];
  let selectedIndices = [];
  let isGameActive = false;
  let isAnimating = false;
  let difficulty = 'medium';
  let initialInversions = 0;

  let stats = {
    compares: 0,
    swaps: 0,
    score: 0,
    goodSwaps: 0,
    badSwaps: 0,
  };

  let moveHistory = [];
  let heatmapData = [];
  let startTime = 0;
  let timerInterval = null;
  let isVictory = false;

  // ─── DOM Cache ───
  const DOM = {};
  function cacheDOM() {
    DOM.container = document.getElementById('game-array-container');
    DOM.comparisons = document.getElementById('game-comparisons');
    DOM.swaps = document.getElementById('game-swaps');
    DOM.score = document.getElementById('game-score');
    DOM.feedback = document.getElementById('game-feedback');
    DOM.strategy = document.getElementById('game-strategy-txt');
    DOM.effBar = document.getElementById('game-eff-bar');
    DOM.effPct = document.getElementById('game-eff-pct');
    DOM.heatmap = document.getElementById('game-heatmap');
    DOM.tooltipScore = document.getElementById('tooltip-score');
    DOM.tooltipStrategy = document.getElementById('tooltip-strategy');
    DOM.tooltipGrid = document.getElementById('tooltip-heatmap-grid');
    DOM.timer = document.getElementById('game-timer');
    DOM.moves = document.getElementById('game-moves');
    DOM.level = document.getElementById('game-level-label');
  }

  // ─── Navigation ───
  const btnHero = document.getElementById('btn-hero-gameMode');
  const btnBack = document.getElementById('btn-back-to-home');
  const btnNavGame = document.getElementById('btn-nav-game');

  function showGamePage() {
    const allPIds = ['home-page', 'arena-page', 'visualization-page', 'benchmark-page', 'game-page'];
    allPIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === 'game-page') {
        el.classList.remove('hidden');
        el.classList.add('flex');
      } else {
        el.classList.add('hidden');
        el.classList.remove('flex');
      }
    });
  }

  if (btnHero) {
    btnHero.addEventListener('click', () => {
      showGamePage();
      isGameActive = true;
      setTimeout(() => initGame(), 50);
    });
  }

  if (btnNavGame) {
    btnNavGame.addEventListener('click', () => {
      isGameActive = true;
      setTimeout(() => initGame(), 50);
    });
  }

  if (btnBack) {
    btnBack.addEventListener('click', () => {
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
      isGameActive = false;
      clearInterval(timerInterval);
      const homeBtn = document.getElementById('btn-home');
      if (homeBtn) homeBtn.click();
    });
  }

  // ─── Difficulty Buttons ───
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.diff-btn');
    if (!btn || !btn.dataset.diff) return;
    difficulty = btn.dataset.diff;
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    initGame();
  });

  // ─── Action Buttons ───
  const btnSwap = document.getElementById('game-btn-swap');
  const btnComp = document.getElementById('game-btn-compare');
  const btnReset = document.getElementById('game-btn-reset');

  if (btnSwap) btnSwap.addEventListener('click', () => performAction('swap'));
  if (btnComp) btnComp.addEventListener('click', () => performAction('compare'));
  if (btnReset) btnReset.addEventListener('click', () => initGame());

  // ─── Inversion Counter ───
  function countInversions(arr) {
    let inv = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] > arr[j]) inv++;
      }
    }
    return inv;
  }

  function isSorted(arr) {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i - 1]) return false;
    }
    return true;
  }

  // ─── Initialize Game ───
  function initGame() {
    cacheDOM();

    const diff = DIFFICULTIES[difficulty];
    gameArray = [];
    selectedIndices = [];
    isVictory = false;
    isAnimating = false;
    stats = { compares: 0, swaps: 0, score: 0, goodSwaps: 0, badSwaps: 0 };
    moveHistory = [];
    heatmapData = [];

    // Generate array ensuring it's not already sorted
    do {
      gameArray = [];
      for (let i = 0; i < diff.bars; i++) {
        gameArray.push(Math.floor(Math.random() * 85) + 10);
      }
    } while (isSorted(gameArray));

    initialInversions = countInversions(gameArray);

    // Timer
    startTime = Date.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    // Update UI
    if (DOM.level) DOM.level.textContent = diff.label;
    updateUI();
    renderBars();
    setFeedback('SELECT TWO BARS, THEN SWAP OR COMPARE', '#fbbf24');
    if (DOM.strategy) {
      DOM.strategy.textContent = '- - -';
      DOM.strategy.style.color = '';
      DOM.strategy.style.textShadow = '';
    }
    if (DOM.heatmap) DOM.heatmap.innerHTML = '';
    if (DOM.tooltipGrid) DOM.tooltipGrid.innerHTML = '';

    // Remove any victory overlay
    const existing = DOM.container?.parentElement?.querySelector('.game-victory-overlay');
    if (existing) existing.remove();
  }

  // ─── Render Bars ───
  function renderBars() {
    if (!DOM.container) return;
    DOM.container.innerHTML = '';

    const gap = gameArray.length > 16 ? '3px' : '6px';
    DOM.container.style.gap = gap;

    gameArray.forEach((val, i) => {
      const bar = document.createElement('div');
      bar.className = 'game-bar flex-1';
      bar.style.height = val + '%';

      if (selectedIndices.includes(i)) {
        bar.classList.add('selected');
      }

      // Value label
      const label = document.createElement('span');
      label.className = 'bar-label';
      label.textContent = val;
      bar.appendChild(label);

      bar.addEventListener('click', () => handleBarClick(i));
      DOM.container.appendChild(bar);
    });
  }

  // ─── Bar Click Handler ───
  function handleBarClick(idx) {
    if (isAnimating || isVictory) return;

    if (selectedIndices.includes(idx)) {
      selectedIndices = selectedIndices.filter(i => i !== idx);
    } else {
      if (selectedIndices.length < 2) {
        selectedIndices.push(idx);
      }
    }
    renderBars();
  }

  // ─── Perform Action ───
  function performAction(type) {
    if (isAnimating || isVictory) return;
    if (selectedIndices.length !== 2) {
      setFeedback('⚠️ SELECT EXACTLY 2 BARS FIRST!', '#f87171');
      shakeContainer();
      return;
    }

    let [i, j] = selectedIndices;
    if (i > j) { let t = i; i = j; j = t; }

    const inversionsBefore = countInversions(gameArray);
    const diff = DIFFICULTIES[difficulty];

    if (type === 'compare') {
      stats.compares++;
      isAnimating = true;

      // Visual compare flash
      const bars = DOM.container.children;
      if (bars[i]) bars[i].classList.add('comparing');
      if (bars[j]) bars[j].classList.add('comparing');

      // Show comparison result
      const result = gameArray[i] <= gameArray[j] ? 'IN ORDER ✓' : 'OUT OF ORDER ✗';
      const color = gameArray[i] <= gameArray[j] ? '#4ade80' : '#f87171';
      setFeedback(`COMPARED: ${gameArray[i]} vs ${gameArray[j]} → ${result}`, color);

      // Small score bonus for strategic comparing
      const pts = Math.round(1 * diff.multiplier);
      stats.score += pts;
      showScorePopup(bars[i], '+' + pts, true);

      moveHistory.push({ type: 'compare', diff: j - i });
      heatmapData.push('#118ab2');

      setTimeout(() => {
        if (bars[i]) bars[i].classList.remove('comparing');
        if (bars[j]) bars[j].classList.remove('comparing');
        selectedIndices = [];
        isAnimating = false;
        renderBars();
        updateUI();
      }, 600);

    } else if (type === 'swap') {
      stats.swaps++;
      isAnimating = true;

      // Perform swap
      let temp = gameArray[i]; gameArray[i] = gameArray[j]; gameArray[j] = temp;

      const inversionsAfter = countInversions(gameArray);
      const improved = inversionsAfter < inversionsBefore;
      const swapDist = j - i;

      // Score calculation
      let pts = 0;
      if (improved) {
        // Good swap — more points for larger distance
        pts = Math.round((5 + swapDist * 3) * diff.multiplier);
        stats.goodSwaps++;
        heatmapData.push('#00f5d4');
        moveHistory.push({ type: 'swap', diff: swapDist, quality: 'good' });
      } else {
        // Bad swap — penalty
        pts = -Math.round((3 + swapDist) * diff.multiplier);
        stats.badSwaps++;
        heatmapData.push('#ef476f');
        moveHistory.push({ type: 'swap', diff: swapDist, quality: 'bad' });
      }
      stats.score += pts;

      // Animate swap
      const bars = DOM.container.children;
      const barI = bars[selectedIndices[0] < selectedIndices[1] ? selectedIndices[0] : selectedIndices[1]];
      const barJ = bars[selectedIndices[0] < selectedIndices[1] ? selectedIndices[1] : selectedIndices[0]];

      if (barI) barI.classList.add('swapping-right');
      if (barJ) barJ.classList.add('swapping-left');

      setTimeout(() => {
        // Flash color based on quality
        selectedIndices = [];
        renderBars();

        const newBars = DOM.container.children;
        if (newBars[i]) newBars[i].classList.add(improved ? 'good-swap' : 'bad-swap');
        if (newBars[j]) newBars[j].classList.add(improved ? 'good-swap' : 'bad-swap');

        showScorePopup(newBars[i], (pts >= 0 ? '+' : '') + pts, pts >= 0);

        const fb = improved
          ? `GREAT SWAP! ${gameArray[i]} ↔ ${gameArray[j]} (+${pts} XP)`
          : `BAD MOVE! Disorder increased (${pts} XP)`;
        setFeedback(fb, improved ? '#4ade80' : '#f87171');

        setTimeout(() => {
          if (newBars[i]) newBars[i].classList.remove('good-swap', 'bad-swap');
          if (newBars[j]) newBars[j].classList.remove('good-swap', 'bad-swap');
          isAnimating = false;
          updateUI();

          // Check win
          if (isSorted(gameArray)) {
            triggerVictory();
          }
        }, 400);
      }, 350);
    }

    analyzeStrategy();
    renderHeatmap();
    renderTooltipHeatmap();
  }

  // ─── Shake on error ───
  function shakeContainer() {
    if (!DOM.container) return;
    DOM.container.style.animation = 'none';
    void DOM.container.offsetWidth;
    DOM.container.style.animation = 'shake 0.4s ease';
    setTimeout(() => DOM.container.style.animation = '', 400);

    // Add shake keyframes if not exists
    if (!document.getElementById('game-shake-style')) {
      const style = document.createElement('style');
      style.id = 'game-shake-style';
      style.textContent = `@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }`;
      document.head.appendChild(style);
    }
  }

  // ─── Score Popup ───
  function showScorePopup(bar, text, positive) {
    if (!bar) return;
    const popup = document.createElement('div');
    popup.className = `score-popup ${positive ? 'positive' : 'negative'}`;
    popup.textContent = text;
    bar.style.position = 'relative';
    bar.appendChild(popup);
    setTimeout(() => popup.remove(), 900);
  }

  // ─── Victory ───
  function triggerVictory() {
    isVictory = true;
    clearInterval(timerInterval);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const diff = DIFFICULTIES[difficulty];

    // Time bonus
    const timeBonus = Math.max(0, Math.round((120 - parseFloat(elapsed)) * diff.multiplier));
    stats.score += timeBonus;

    // Efficiency bonus
    const effBonus = Math.round(((stats.goodSwaps / Math.max(1, stats.swaps)) * 50) * diff.multiplier);
    stats.score += effBonus;

    setFeedback('🎉 ARRAY SORTED! YOU WIN!', '#4ade80');

    // Green sweep on bars
    const bars = DOM.container.children;
    for (let i = 0; i < bars.length; i++) {
      setTimeout(() => {
        bars[i].classList.add('sorted');
      }, i * 60);
    }

    // Victory overlay
    setTimeout(() => {
      const overlay = document.createElement('div');
      overlay.className = 'game-victory-overlay';
      overlay.innerHTML = `
        <div class="victory-title">🏆 SORTED!</div>
        <div class="victory-stats">
          ${diff.label} Mode · ${elapsed}s · ${stats.swaps} swaps · ${stats.compares} compares
        </div>
        <div class="victory-stats" style="color:#4ade80; margin-top:8px; font-size:16px;">
          Final Score: ${stats.score} XP
          ${timeBonus > 0 ? `<span style="color:#22d3ee;"> (+${timeBonus} time bonus)</span>` : ''}
        </div>
        <button id="game-play-again" class="game-btn-primary mt-6 px-8 py-3 rounded-xl text-sm">
          <span class="material-symbols-outlined text-base align-middle mr-1">replay</span>
          PLAY AGAIN
        </button>
      `;
      DOM.container.parentElement.appendChild(overlay);

      const playAgain = document.getElementById('game-play-again');
      if (playAgain) playAgain.addEventListener('click', () => initGame());
    }, gameArray.length * 60 + 300);

    updateUI();
  }

  // ─── Strategy Detection ───
  function analyzeStrategy() {
    if (moveHistory.length < 3) return;

    const swaps = moveHistory.filter(m => m.type === 'swap');
    if (swaps.length === 0) return;

    const adjacent = swaps.filter(m => m.diff === 1).length;
    const medium = swaps.filter(m => m.diff >= 2 && m.diff <= 4).length;
    const long = swaps.filter(m => m.diff > 4).length;

    let strategy = 'MIXED APPROACH';
    let stColor = '#94a3b8';

    if (adjacent / swaps.length >= 0.7) {
      strategy = 'BUBBLE SORT';
      stColor = '#fbbf24';
    } else if (medium / swaps.length >= 0.5) {
      strategy = 'INSERTION SORT';
      stColor = '#22d3ee';
    } else if (long / swaps.length >= 0.5) {
      strategy = 'SELECTION SORT';
      stColor = '#00f5d4';
    } else if (adjacent / swaps.length >= 0.4 && long / swaps.length >= 0.3) {
      strategy = 'QUICK SORT';
      stColor = '#a78bfa';
    }

    if (DOM.strategy) {
      DOM.strategy.textContent = strategy;
      DOM.strategy.style.color = stColor;
      DOM.strategy.style.textShadow = '0 0 10px ' + stColor;
    }
  }

  // ─── Timer ───
  function updateTimer() {
    if (!DOM.timer || isVictory) return;
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    DOM.timer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

    if (elapsed > 90) {
      DOM.timer.classList.add('timer-danger');
    } else {
      DOM.timer.classList.remove('timer-danger');
    }
  }

  // ─── Heatmap ───
  function renderHeatmap() {
    if (!DOM.heatmap) return;
    DOM.heatmap.innerHTML = '';

    const displayData = heatmapData.slice(-30);
    displayData.forEach(c => {
      const b = document.createElement('div');
      b.className = 'game-heat-block';
      b.style.backgroundColor = c;
      // Height based on last action value
      b.style.height = (Math.random() * 16 + 8) + 'px';
      DOM.heatmap.appendChild(b);
    });
    DOM.heatmap.scrollLeft = DOM.heatmap.scrollWidth;
  }

  function renderTooltipHeatmap() {
    if (!DOM.tooltipGrid) return;

    if (DOM.tooltipGrid.children.length === 0) {
      const colors = ['bg-emerald-400', 'bg-emerald-500', 'bg-teal-400', 'bg-cyan-400', 'bg-yellow-400', 'bg-amber-500', 'bg-rose-500', 'bg-pink-500'];
      for (let i = 0; i < 48; i++) {
        const span = document.createElement('div');
        const col = colors[Math.floor(Math.random() * colors.length)];
        const op = [0.4, 0.6, 0.8, 1][Math.floor(Math.random() * 4)];
        span.className = `w-full aspect-square rounded-[2px] ${col}`;
        span.style.opacity = op;
        DOM.tooltipGrid.appendChild(span);
      }
    } else {
      for (let i = 0; i < 5; i++) {
        const idx = Math.floor(Math.random() * 48);
        const colors = ['bg-emerald-400', 'bg-emerald-500', 'bg-teal-400', 'bg-cyan-400', 'bg-yellow-400', 'bg-amber-500', 'bg-rose-500', 'bg-pink-500'];
        const span = DOM.tooltipGrid.children[idx];
        if (span) {
          span.className = `w-full aspect-square rounded-[2px] ${colors[Math.floor(Math.random() * colors.length)]} transition-colors duration-500`;
          span.style.opacity = [0.4, 0.6, 0.8, 1][Math.floor(Math.random() * 4)];
        }
      }
    }
  }

  // ─── Update UI ───
  function updateUI() {
    if (DOM.comparisons) DOM.comparisons.textContent = stats.compares;
    if (DOM.swaps) DOM.swaps.textContent = stats.swaps;
    if (DOM.score) DOM.score.textContent = stats.score;
    if (DOM.tooltipScore) DOM.tooltipScore.textContent = stats.score;
    if (DOM.moves) DOM.moves.textContent = stats.compares + stats.swaps;

    // Tooltip strategy
    if (DOM.tooltipStrategy && DOM.strategy) {
      DOM.tooltipStrategy.textContent = DOM.strategy.textContent + ' ⚡';
    }

    // Efficiency bar — based on actual inversions progress
    const currentInversions = countInversions(gameArray);
    let pct = 100;
    if (initialInversions > 0) {
      pct = Math.round(((initialInversions - currentInversions) / initialInversions) * 100);
      pct = Math.max(0, Math.min(100, pct));
    }
    if (DOM.effBar) DOM.effBar.style.width = pct + '%';
    if (DOM.effPct) DOM.effPct.textContent = pct + '%';

    // Color the efficiency bar based on progress
    if (DOM.effBar) {
      if (pct >= 80) {
        DOM.effBar.style.background = 'linear-gradient(90deg, #4ade80, #22d3ee)';
      } else if (pct >= 50) {
        DOM.effBar.style.background = 'linear-gradient(90deg, #fbbf24, #f59e0b)';
      } else {
        DOM.effBar.style.background = 'linear-gradient(90deg, #f87171, #ef4444)';
      }
    }
  }

  // ─── Feedback ───
  function setFeedback(txt, color) {
    if (!DOM.feedback) return;
    DOM.feedback.textContent = txt;
    if (color) DOM.feedback.style.color = color;
    DOM.feedback.style.transform = 'translate(-50%, -8px)';
    DOM.feedback.style.opacity = '1';
    setTimeout(() => {
      if (DOM.feedback) DOM.feedback.style.transform = 'translate(-50%, 0)';
    }, 200);
  }

})();

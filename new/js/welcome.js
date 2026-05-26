// ==========================================
// WELCOME PAGE & HOME PAGE â€" Particles
// ==========================================
(function() {
    const canvasWelcome = document.getElementById('welcome-particles');
    const canvasHome = document.getElementById('home-particles');
    
    const canvases = [];
    if (canvasWelcome) canvases.push({ el: canvasWelcome, ctx: canvasWelcome.getContext('2d') });
    if (canvasHome) canvases.push({ el: canvasHome, ctx: canvasHome.getContext('2d') });
    
    if (canvases.length === 0) return;
    
    let particles = [];
    let animFrameId = null;

    function resize() {
        canvases.forEach(c => {
            c.el.width = window.innerWidth;
            c.el.height = window.innerHeight;
        });
    }
    resize();
    window.addEventListener('resize', resize);

    const w = window.innerWidth || 1000;
    const h = window.innerHeight || 1000;

    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.4 + 0.1,
            color: Math.random() > 0.5 ? '0, 238, 255' : '255, 0, 127'
        });
    }

    function drawParticles() {
        const cw = window.innerWidth;
        const ch = window.innerHeight;

        // Update physics globally
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = cw;
            if (p.x > cw) p.x = 0;
            if (p.y < 0) p.y = ch;
            if (p.y > ch) p.y = 0;
        });

        // Draw to visible canvases
        canvases.forEach(c => {
            // Skip rendering if canvas is hidden
            if (c.el.offsetParent === null) return;
            
            const ctx = c.ctx;
            ctx.clearRect(0, 0, cw, ch);
            
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
                ctx.fill();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 238, 255, ${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        });

        animFrameId = requestAnimationFrame(drawParticles);
    }
    drawParticles();

    // Enter button handler
    const btnEnter = document.getElementById('btn-enter-app');
    const welcomePage = document.getElementById('welcome-page');
    const appShell = document.getElementById('app-shell');
    const homePage = document.getElementById('home-page');

    if (btnEnter) {
        btnEnter.addEventListener('click', () => {
            welcomePage.classList.add('exit-active');
            setTimeout(() => {
                welcomePage.style.display = 'none';
                if (appShell) {
                    appShell.style.display = 'flex';
                    appShell.classList.add('entering');
                }
                if (homePage) {
                    homePage.classList.remove('hidden');
                    homePage.classList.add('flex');
                }
            }, 600);
        });
    }
})();

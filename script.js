(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  let W = 0;
  let H = 0;
  let DPR = 1;
  let particles = [];

  const MAX_PARTICLES = 90;
  const CONNECTION_DIST = 140;
  const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
  const SPEED_CAP = 0.45;

  function targetCount() {
    return Math.min(MAX_PARTICLES, Math.floor((W * H) / 14000));
  }

  class Node {
    constructor() {
      this.respawn();
    }

    respawn() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * SPEED_CAP;
      this.vy = (Math.random() - 0.5) * SPEED_CAP;
      this.r = Math.random() * 1.2 + 0.4;
      this.base = Math.random() * 0.25 + 0.08;
      this.opacity = this.base;
      this.phase = Math.random() * Math.PI * 2;
      this.freq = Math.random() * 0.005 + 0.002;
    }

    tick(t) {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) { this.x = 0; this.vx = Math.abs(this.vx); }
      else if (this.x > W) { this.x = W; this.vx = -Math.abs(this.vx); }

      if (this.y < 0) { this.y = 0; this.vy = Math.abs(this.vy); }
      else if (this.y > H) { this.y = H; this.vy = -Math.abs(this.vy); }

      this.opacity = this.base + Math.sin(t * this.freq + this.phase) * (this.base * 0.5);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, 6.2832);
      ctx.fillStyle = 'rgba(127,86,218,' + this.opacity.toFixed(3) + ')';
      ctx.fill();
    }
  }

  function rebuild() {
    const count = targetCount();
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Node());
    }
  }

  function applyDimensions() {
    DPR = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(DPR, DPR);
  }

  function resize() {
    applyDimensions();
    rebuild();
  }

  let debounceTimer = null;
  function onResize() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(resize, 100);
  }

  let tick = 0;
  function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, W, H);
    tick++;

    const len = particles.length;

    for (let i = 0; i < len; i++) {
      particles[i].tick(tick);
      particles[i].draw();
    }

    for (let i = 0; i < len; i++) {
      const a = particles[i];
      for (let j = i + 1; j < len; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < CONNECTION_DIST_SQ) {
          const t = 1 - Math.sqrt(dSq) / CONNECTION_DIST;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(127,86,218,' + (t * 0.1).toFixed(3) + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  window.addEventListener('resize', onResize, { passive: true });
  resize();
  loop();
}());

(function () {
  var trigger = document.getElementById('menu-trigger');
  var menu = document.getElementById('mobile-menu');

  if (!trigger || !menu) return;

  function openMenu() {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (menu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  trigger.addEventListener('click', toggleMenu);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
      trigger.focus();
    }
  });

  var mql = window.matchMedia('(min-width: 640px)');
  function onBreakpoint(e) {
    if (e.matches && menu.classList.contains('is-open')) {
      closeMenu();
    }
  }

  if (mql.addEventListener) {
    mql.addEventListener('change', onBreakpoint);
  } else {
    mql.addListener(onBreakpoint);
  }
}());


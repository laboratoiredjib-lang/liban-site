/* Effets d'ambiance : halos, projecteur, parallaxe douce des photos */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduce) return;

  // halos flottants
  const orbs = document.createElement('div');
  orbs.className = 'orbs'; orbs.setAttribute('aria-hidden', 'true');
  orbs.innerHTML = '<i></i><i></i><i></i>';
  document.body.prepend(orbs);

  // projecteur qui suit le curseur (souris uniquement)
  if (fine) {
    const spot = document.createElement('div');
    spot.className = 'spot'; spot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(spot);
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      spot.style.transform = `translate(${x}px, ${y}px)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; spot.classList.add('on'); if (!raf) raf = requestAnimationFrame(loop); }, { passive: true });
    document.addEventListener('mouseleave', () => spot.classList.remove('on'));
  }

  // parallaxe douce des photos au défilement
  let ticking = false;
  const move = () => {
    document.querySelectorAll('.dphoto img, .info-photo img').forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50) return;
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      img.style.translate = `0 ${(-p * 22).toFixed(1)}px`;
    });
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(move); } }, { passive: true });
  move();
})();

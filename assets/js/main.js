/* ==========================================================================
   Rendu et interactions du site (aucune dépendance sauf KaTeX pour les équations)
   ========================================================================== */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const ARROW = `<svg class="arr" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10h13M11 5l5 5-5 5"/></svg>`;
  const EXT = `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10 10 4M5 4h5v5"/></svg>`;

  const NAV = [
    ['profil', 'Profil'], ['recherche', 'Recherche'], ['publications', 'Publications'], ['these', 'Thèse'],
    ['encadrement', 'Encadrement'], ['enseignement', 'Enseignement'], ['expertise', 'Expertise'],
    ['parcours', 'Parcours'], ['cv', 'CV'], ['contact', 'Contact']
  ];

  /* ------------------------------------------------------------------ */
  /* 1. Rendu du contenu à partir de data.js                             */
  /* ------------------------------------------------------------------ */
  function renderNav() {
    $('#nav').innerHTML = NAV.map(([id, l], i) => `<a href="#${id}" data-id="${id}" style="--k:${i}">${l}</a>`).join('');
    $('#drawer').innerHTML = NAV.map(([id, l], i) => `<a href="#${id}" style="--i:${i}"><small>${String(i + 1).padStart(2, '0')}</small>${l}</a>`).join('');
  }

  function renderStats() {
    $('#stats').innerHTML = SITE.stats.map((s, i) => `
      <div class="stat" data-reveal style="--d:${i * 0.1}">
        <div class="num"><span data-count="${s.n}">0</span>${s.plus ? '<sup>+</sup>' : ''}</div>
        <p>${s.label}</p>
      </div>`).join('');
  }

  function renderAxes() {
    $('#axisList').innerHTML = SITE.axes.map((a, i) => `
      <button class="axis-btn${i === 0 ? ' active' : ''}" role="tab" aria-selected="${i === 0}" data-i="${i}">
        <span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${a.title}</span>
        <svg class="go" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10h13M11 5l5 5-5 5"/></svg>
      </button>`).join('');
    $('#axisPanels').innerHTML = SITE.axes.map((a, i) => `
      <article class="panel${i === 0 ? ' active' : ''}" role="tabpanel" data-i="${i}">
        <span class="eyebrow">${a.kicker}</span>
        <h3 style="margin-top:1rem">${a.title}</h3>
        <p>${a.text}</p>
        <div class="eq-box" data-label="${a.eqLabel}"><span class="tex-slot" data-i="${i}"></span></div>
        <div class="chips">${a.tags.map(t => `<span class="chip">${t}</span>`).join('')}</div>
        <a class="link-u" href="${a.target || '#publications'}" data-pub="${a.pub}">${a.linkLabel} ${ARROW.replace('class="arr"', 'width="16" height="16"')}</a>
      </article>`).join('');
  }

  function renderPubs() {
    $('#pubFilters').innerHTML = SITE.pubFilters.map((f, i) =>
      `<button type="button" data-f="${f.key}" class="${i === 0 ? 'active' : ''}">${f.label}</button>`).join('');
    $('#pubList').innerHTML = SITE.pubs.map((p, i) => {
      const authors = p.authors.replace('Liban Ismail', '<b>Liban Ismail</b>');
      const tags = p.tags.map(t => `<span>${SITE.tagNames[t]}</span>`).join('');
      const action = p.forthcoming || !p.doi
        ? `<span class="ft">À paraître</span>`
        : `<a class="doi" href="${p.doi}" target="_blank" rel="noopener">DOI ${EXT}</a>`;
      const hay = `${p.title} ${p.authors} ${p.journal} ${p.year}`.toLowerCase();
      return `<article class="pub" data-reveal style="--d:${i * 0.07}" data-tags="${p.tags.join(' ')}" data-hay="${hay.replace(/"/g, '')}">
        <div class="yr">${p.year}</div>
        <div><h3>${p.title}</h3><p class="au">${authors}</p><p class="jr">${p.journal}</p><div class="tg">${tags}</div></div>
        <div>${action}</div></article>`;
    }).join('') + `<p class="pub-empty" id="pubEmpty" hidden>Aucune publication ne correspond à cette recherche.</p>`;
  }

  function renderThesis() {
    const t = SITE.thesis;
    $('#thesisTitle').innerHTML = `<q>${t.titleFr}</q>`;
    $('#thesisEn').textContent = t.titleEn;
    $('#thesisMeta').innerHTML = t.meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    $('#thesisLink').href = t.link;
    $('#pillars').innerHTML = t.pillars.map((p, i) => `
      <div class="pillar" data-reveal="right" style="--d:${i * 0.15}">${ICON[p.icon]}<div><h4>${p.title}</h4><p>${p.text}</p></div></div>`).join('');
  }

  function renderStudents() {
    $('#students').innerHTML = SITE.students.map((s, i) => `
      <div class="dcard" data-reveal style="--d:${(i % 3) * 0.12}">
        <article class="dcard-in tilt">
          <div class="dphoto"><img src="assets/img/doctorants/${s.photo}" alt="${s.name}" loading="lazy"><span class="since">${s.since}</span></div>
          <div class="dbody"><span class="uni">${s.uni}</span><h3>${s.name}</h3><p>${s.topic}</p>
            <div class="dir">Direction de thèse : <b>${s.dir}</b></div></div>
        </article>
      </div>`).join('');
  }

  function renderNetwork() {
    const card = n => {
      const inner = n.logo ? `<img src="${n.logo}" alt="${n.name}">` : `<b>${n.name}</b>`;
      const cls = 'pcard' + (n.logo ? '' : ' txt');
      return n.url
        ? `<a class="${cls}" href="${n.url}" target="_blank" rel="noopener" title="${n.name}" aria-label="${n.name}">${inner}</a>`
        : `<span class="${cls}" title="${n.name}">${inner}</span>`;
    };
    const track = arr => `<div class="mq-track">${arr.map(card).join('')}</div>`;
    ['row1', 'row2'].forEach((k, i) => {
      const html = track(SITE.network[k]);
      $(`#mq${i + 1}`).innerHTML = html + html; // dupliqué pour la boucle continue
    });
  }

  function renderTeaching() {
    const m = SITE.iamd;
    $('#iamdTag').textContent = m.tagline;
    $('#iamdTitle').textContent = m.title;
    $('#iamdText').textContent = m.text;
    $('#iamdTracks').innerHTML = m.tracks.map(([a, b]) => `<div><b>${a}</b>${b}</div>`).join('');
    $('#courses').innerHTML = SITE.courses.map(c => `
      <div class="course"><span class="lvl">${c.level}</span><div><h4>${c.title}</h4><p>${c.text}</p></div></div>`).join('');
    $('#labText').textContent = SITE.lab.text;
  }

  function renderExpertise() {
    $('#expGrid').innerHTML = SITE.expertise.map((e, i) => `
      <article class="exp" data-reveal style="--d:${i * 0.09}">${ICON[e.icon]}<h3>${e.title}</h3><p>${e.text}</p></article>`).join('');
    $('#missions').innerHTML = SITE.missions.map((m, i) => `
      <div class="mission" data-reveal style="--d:${i * 0.07}"><span class="when">${m.when}</span><div><h4>${m.title}</h4><p>${m.text}</p></div><span class="who">${m.who}</span></div>`).join('');
  }

  function renderTimeline() {
    $('#timeline').innerHTML = SITE.timeline.map(t => `
      <div class="tl-item${t.major ? ' major' : ''}" data-tl>
        <div class="y">${t.y}${t.sub ? `<small>${t.sub}</small>` : ''}</div>
        <div><h3>${t.t}</h3><p>${t.d}</p></div>
      </div>`).join('');
  }

  function renderContact() {
    $('#contactList').innerHTML = SITE.contact.map(([k, v]) => `<li><span>${k}</span><span>${v}</span></li>`).join('');
    $('#year').textContent = new Date().getFullYear();
  }

  function renderCV() {
    const c = SITE.cv;
    $('#cvSummary').innerHTML = c.summary.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    $('#cvSkills').innerHTML = c.skills.map(([t, items]) => `
      <div class="skill-group"><h4>${t}</h4><div class="chips">${items.map(i => `<span class="chip">${i}</span>`).join('')}</div></div>`).join('');
    $('#cvLangs').innerHTML = c.languages.map(l => `
      <li><span class="ln">${l.name}</span><span class="lv">${l.level}</span>
        <span class="dots" aria-hidden="true">${Array.from({ length: 5 }, (_, i) => `<i class="${i < l.dots ? 'on' : ''}"></i>`).join('')}</span></li>`).join('');
    $('#cvDownload').href = c.file; $('#cvOpen').href = c.file;
  }

  /* Équations : KaTeX si disponible, sinon texte de secours */
  function renderMath() {
    const ok = typeof katex !== 'undefined';
    const put = (el, tex, fallback, display) => {
      if (!ok) { el.textContent = fallback || tex; return; }
      try { katex.render(tex, el, { displayMode: !!display, throwOnError: false }); }
      catch { el.textContent = fallback || tex; }
    };
    $$('.tex[data-tex]').forEach(el => put(el, el.dataset.tex, el.textContent, false));
    $$('.tex-slot').forEach(el => { const a = SITE.axes[+el.dataset.i]; put(el, a.eq, a.eqFallback, true); });
    const te = $('#thesisEq'); if (te) put(te, SITE.thesis.eq, 'Sᵢ = Var(E[Y|Xᵢ]) / Var(Y)', true);
  }

  /* ------------------------------------------------------------------ */
  /* 2. Titres animés mot par mot                                        */
  /* ------------------------------------------------------------------ */
  function splitHeading(el) {
    let i = 0, glue = false, last = null; // glue : le mot précédent n'est pas suivi d'un espace
    const walk = node => {
      [...node.childNodes].forEach(ch => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); glue = false; return; }
            // une ponctuation collée à un mot placé juste avant est fusionnée avec lui
            if (glue && last && /^[,.;:!?»)…]+$/.test(part)) { last.textContent += part; return; }
            if (glue) frag.appendChild(document.createTextNode('⁠')); // interdit la coupure de ligne
            glue = true;
            const w = document.createElement('span'); w.className = 'w';
            const s = document.createElement('span'); s.textContent = part; s.style.setProperty('--i', i++);
            w.appendChild(s); frag.appendChild(w); last = s;
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1) walk(ch);
      });
    };
    el.setAttribute('aria-label', el.textContent.trim());
    walk(el);
  }

  /* ------------------------------------------------------------------ */
  /* 3. Apparition au défilement + compteurs                             */
  /* ------------------------------------------------------------------ */
  function countUp(el) {
    const target = parseFloat(el.dataset.count), dur = 1900, t0 = performance.now();
    if (reduce) { el.textContent = target; return; }
    const tick = now => {
      const p = clamp((now - t0) / dur, 0, 1), e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(target * e);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* Ajoute une apparition à presque tout le contenu, avec décalage en cascade */
  function prepareReveal() {
    const SEL = 'main p, main li, .stat, .exp, .pub, .course, .mission, .lab-card, .dcard, .field, .skill-group, .cv-summary > div, .langs li, .tl-item, .tracks > div, .thesis-meta > div, .eq-box, .avail, .form, .pdf-frame, .chip, .links-row, .cta, .search, .filters, .pub-bar, .network .pcard';
    const SKIP = '.hero, .marquee, .axis-panels, .axis-list, .drawer, .preloader, [data-reveal], [data-split], .pillar';
    const variants = ['up', 'rise', 'flip', 'zoom'];
    $$(SEL).forEach(el => {
      if (el.closest(SKIP) || el.matches(SKIP)) return;
      const sibs = [...el.parentElement.children].filter(n => n.matches(SEL));
      const idx = Math.max(0, sibs.indexOf(el));
      let v = 'up';
      if (el.matches('.tl-item')) v = idx % 2 ? 'right' : 'left';
      else if (el.matches('.dcard, .exp, .lab-card, .eq-box, .avail')) v = variants[(idx + 1) % 4];
      else if (el.matches('.stat')) v = 'rise';
      else if (el.matches('.chip')) v = 'zoom';
      else if (el.matches('.pdf-frame')) v = 'flip';
      el.setAttribute('data-reveal', v);
      el.style.setProperty('--d', Math.min(idx, 7) * (el.matches('.chip') ? 0.05 : 0.09));
    });
  }

  let io = null;
  const REVEAL_SEL = '[data-reveal], [data-split], .img-reveal, [data-tl], .pillar, .eyebrow';
  function setupReveal() {
    const targets = $$(REVEAL_SEL);
    if (!('IntersectionObserver' in window)) { targets.forEach(t => t.classList.add('in-view')); $$('[data-count]').forEach(countUp); return; }
    io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        el.classList.add('in-view');
        if (el.hasAttribute('data-reveal')) setTimeout(() => el.classList.add('done'), 1200 + (parseFloat(el.style.getPropertyValue('--d')) || 0) * 1000);
        $$('[data-count]', el).forEach(countUp);
        if (el.matches('[data-count]')) countUp(el);
        io.unobserve(el);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -4% 0px' });
    targets.forEach(t => io.observe(t));
  }

  /* ------------------------------------------------------------------ */
  /* 4. En-tête, progression, navigation                                 */
  /* ------------------------------------------------------------------ */
  function setupHeader() {
    const header = $('#header'), bar = $('#progress'), top = $('#toTop');
    let lastY = scrollY, ticking = false;
    const tl = $('#timeline');

    const onScroll = () => {
      const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
      header.classList.toggle('scrolled', y > 24);
      header.classList.toggle('hide', innerWidth > 1080 && y > lastY && y > 520 && !document.body.classList.contains('menu-open'));
      top.classList.toggle('show', y > 900);
      lastY = y;

      if (tl) {
        const r = tl.getBoundingClientRect();
        tl.style.setProperty('--p', clamp((innerHeight * 0.55 - r.top) / r.height, 0, 1).toFixed(3));
      }
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();

    top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

    const btn = $('#menuBtn');
    const setMenu = open => {
      document.body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', open);
      btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    };
    btn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
    $$('#drawer a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  }

  /* ------------------------------------------------------------------ */
  /* 5. Axes de recherche (onglets)                                      */
  /* ------------------------------------------------------------------ */
  function setupAxes() {
    const btns = $$('.axis-btn'), panels = $$('.panel');
    const select = i => {
      btns.forEach((b, k) => { b.classList.toggle('active', k === i); b.setAttribute('aria-selected', k === i); });
      panels.forEach((p, k) => p.classList.toggle('active', k === i));
    };
    btns.forEach((b, i) => {
      b.addEventListener('click', () => select(i));
      if (fine) b.addEventListener('mouseenter', () => select(i));
    });
    $('#axisList').addEventListener('keydown', e => {
      const i = btns.findIndex(b => b.classList.contains('active'));
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { select((i + 1) % btns.length); btns[(i + 1) % btns.length].focus(); e.preventDefault(); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { select((i - 1 + btns.length) % btns.length); btns[(i - 1 + btns.length) % btns.length].focus(); e.preventDefault(); }
    });
    // Lien « publications associées » : applique le filtre correspondant
    $$('.panel a[data-pub]').forEach(a => a.addEventListener('click', () => {
      if (a.dataset.pub) setPubFilter(a.dataset.pub);
    }));
  }

  /* ------------------------------------------------------------------ */
  /* 6. Publications : filtres + recherche                               */
  /* ------------------------------------------------------------------ */
  let pubState = { f: 'all', q: '' };
  function applyPubs() {
    const items = $$('.pub'); let n = 0;
    items.forEach(it => {
      const okF = pubState.f === 'all' || it.dataset.tags.split(' ').includes(pubState.f);
      const okQ = !pubState.q || it.dataset.hay.includes(pubState.q);
      const show = okF && okQ;
      const was = !it.hidden;
      it.hidden = !show;
      if (show) { it.style.setProperty('--i', n); if (!was) { it.classList.remove('pop'); void it.offsetWidth; it.classList.add('pop'); it.classList.add('in-view'); } n++; }
    });
    const done = SITE.pubs.filter(p => !p.forthcoming).length;
    $('#pubCount').textContent = `${n} sur ${SITE.pubs.length} · ${done} publiées, ${SITE.pubs.length - done} à paraître`;
    $('#pubEmpty').hidden = n !== 0;
  }
  function setPubFilter(key) {
    pubState.f = key; pubState.q = ''; $('#pubSearch').value = '';
    $$('#pubFilters button').forEach(b => b.classList.toggle('active', b.dataset.f === key));
    applyPubs();
  }
  function setupPubs() {
    $('#pubFilters').addEventListener('click', e => {
      const b = e.target.closest('button'); if (b) setPubFilter(b.dataset.f);
    });
    $('#pubSearch').addEventListener('input', e => { pubState.q = e.target.value.trim().toLowerCase(); applyPubs(); });
    applyPubs();
  }

  /* ------------------------------------------------------------------ */
  /* 7. Effets : parallaxe, aimants, inclinaison                         */
  /* ------------------------------------------------------------------ */
  function setupHeroParallax() {
    if (!fine || reduce) return;
    const hero = $('.hero'), els = $$('[data-depth]', hero);
    let tx = 0, ty = 0, cx = 0, cy = 0, run = false;
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5;
      if (!run) { run = true; requestAnimationFrame(loop); }
    });
    hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; if (!run) { run = true; requestAnimationFrame(loop); } });
    function loop() {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      els.forEach(el => { const d = parseFloat(el.dataset.depth); el.style.translate = `${(-cx * d).toFixed(2)}px ${(-cy * d).toFixed(2)}px`; });
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) requestAnimationFrame(loop); else run = false;
    }
  }

  function setupMagnetic() {
    if (!fine || reduce) return;
    $$('.magnetic').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        b.style.translate = `${((e.clientX - r.left) / r.width - 0.5) * 14}px ${((e.clientY - r.top) / r.height - 0.5) * 10}px`;
      });
      b.addEventListener('mouseleave', () => { b.style.translate = ''; });
    });
  }

  function setupTilt() {
    if (!fine || reduce) return;
    $$('.tilt').forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.transform = `rotateY(${(x - 0.5) * 8}deg) rotateX(${(0.5 - y) * 7}deg) translateY(-6px)`;
        c.style.setProperty('--mx', `${x * 100}%`); c.style.setProperty('--my', `${y * 100}%`);
      });
      c.addEventListener('mouseleave', () => { c.style.transform = ''; });
    });
  }

  /* Champ de flux du hero : trajectoires douces, évoquant un champ de vecteurs */
  function setupFlow() {
    const cv = $('#flow'); if (!cv || reduce) return;
    const ctx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2);
    let w = 0, h = 0, pts = [], raf = 0, visible = true;
    const resize = () => {
      w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(clamp(w * h / 8500, 60, 230));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, life: Math.random() * 300, c: Math.random() < 0.7 }));
    };
    const field = (x, y, t) => Math.sin(x * 0.0021 + t * 0.00016) * Math.cos(y * 0.0027 - t * 0.00011) * 6.283 + Math.sin((x + y) * 0.0011) * 1.4;
    const frame = t => {
      if (!visible) { raf = 0; return; }
      ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = 'rgba(0,0,0,0.045)'; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over'; ctx.lineWidth = 1.1;
      for (const p of pts) {
        const a = field(p.x, p.y, t), nx = p.x + Math.cos(a) * 1.25, ny = p.y + Math.sin(a) * 1.25;
        ctx.strokeStyle = p.c ? 'rgba(47,93,168,0.34)' : 'rgba(181,138,60,0.45)';
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
        p.x = nx; p.y = ny; p.life--;
        if (p.life < 0 || nx < 0 || nx > w || ny < 0 || ny > h) { p.x = Math.random() * w; p.y = Math.random() * h; p.life = 200 + Math.random() * 300; }
      }
      raf = requestAnimationFrame(frame);
    };
    resize(); addEventListener('resize', resize);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); }).observe(cv);
    raf = requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------------ */
  /* 8. Formulaire de contact (ouvre la messagerie)                      */
  /* ------------------------------------------------------------------ */
  function setupForm() {
    $('#contactForm').addEventListener('submit', e => {
      e.preventDefault();
      const f = new FormData(e.target);
      const subject = f.get('subject') || 'Prise de contact depuis votre site';
      const body = `${f.get('message')}\n\n${f.get('name')}\n${f.get('email')}`;
      location.href = `mailto:liban_ismail_abdillahi@univ.edu.dj?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  /* ------------------------------------------------------------------ */
  /* 8b. Routeur : une seule rubrique affichée à la fois                 */
  /* ------------------------------------------------------------------ */
  const VIEW_IDS = ['accueil', ...NAV.map(n => n[0])];
  function swapView(raw) {
    let id = (raw || '').replace('#', '');
    if (id === 'accueil' || !VIEW_IDS.includes(id)) id = 'profil';
    document.body.dataset.view = id;
    $$('section[data-view]').forEach(sec => { sec.hidden = sec.dataset.view !== id; });
    $$('#nav a').forEach(a => a.classList.toggle('active', a.dataset.id === id));
    const entry = NAV.find(n => n[0] === id);
    document.title = (entry ? entry[1] + ' · ' : '') + 'Dr Liban Ismail Abdillahi';
    scrollTo({ top: 0, behavior: 'instant' });
    $('#header').classList.remove('hide');

    // rejouer les animations d'apparition de la rubrique affichée
    $$('section[data-view]:not([hidden])').forEach(sec => {
      $$('.in-view', sec).forEach(el => el.classList.remove('in-view', 'done'));
      $$('[data-count]', sec).forEach(el => { el.textContent = '0'; });
      if (io) $$(REVEAL_SEL, sec).forEach(el => io.observe(el));
    });

    // filet de sécurité : rien ne doit rester caché dans la zone visible
    setTimeout(() => {
      $$(REVEAL_SEL).forEach(el => {
        if (el.closest('[hidden]') || el.classList.contains('in-view')) return;
        if (el.getBoundingClientRect().top < innerHeight) { el.classList.add('in-view'); $$('[data-count]', el).forEach(countUp); if (el.matches('[data-count]')) countUp(el); }
      });
    }, 1400);

    // l'aperçu du CV ne se charge qu'à la première visite de la rubrique
    const frame = $('#cvFrame');
    if (id === 'cv' && innerWidth > 900 && !frame.getAttribute('src')) frame.src = SITE.cv.file + '#view=FitH&navpanes=0';

    // lien vers la rubrique suivante
    const bar = $('#nextBar'), i = NAV.findIndex(n => n[0] === id);
    if (id === 'accueil') bar.innerHTML = '';
    else {
      const last = i === NAV.length - 1;
      const next = last ? ['profil', "Retour à l'accueil"] : NAV[i + 1];
      bar.innerHTML = `<div class="wrap"><a href="#${next[0]}"><span>${last ? 'Fin du parcours' : 'Rubrique suivante'}</span><strong>${next[1]}</strong>${ARROW}</a></div>`;
    }
  }
  /* Rideau bleu nuit qui balaie l'écran pendant le changement de rubrique */
  let curtain = null, busy = false, pending = null, first = true;
  function showView(raw) {
    if (first || reduce) { first = false; swapView(raw); return; }
    if (busy) { pending = raw; return; }
    busy = true;
    if (!curtain) {
      curtain = document.createElement('div');
      curtain.className = 'curtain'; curtain.setAttribute('aria-hidden', 'true');
      curtain.innerHTML = '<div class="cu"><small>Dr Liban Ismail Abdillahi</small><strong></strong></div>';
      document.body.appendChild(curtain);
    }
    const id = (raw || '').replace('#', ''), entry = NAV.find(n => n[0] === id);
    $('strong', curtain).textContent = entry ? entry[1] : 'Profil';
    curtain.classList.remove('go'); void curtain.offsetWidth; curtain.classList.add('go');
    setTimeout(() => swapView(raw), 480);
    setTimeout(() => {
      curtain.classList.remove('go'); busy = false;
      if (pending !== null) { const p = pending; pending = null; if (p !== location.hash) showView(location.hash); }
    }, 1080);
  }
  function setupRouter() {
    addEventListener('hashchange', () => showView(location.hash));
    showView(location.hash);
  }

  /* ------------------------------------------------------------------ */
  /* 9. Préchargeur et démarrage                                         */
  /* ------------------------------------------------------------------ */
  function start() {
    document.documentElement.classList.add('ready');
    const pre = $('#preloader'); pre.classList.add('done');
    try { sessionStorage.setItem('li-seen', '1'); } catch {}
  }

  function init() {
    renderNav(); renderStats(); renderAxes(); renderPubs(); renderThesis(); renderStudents();
    renderNetwork(); renderTeaching(); renderExpertise(); renderTimeline(); renderContact(); renderCV(); renderMath();
    $$('[data-split]').forEach(splitHeading);
    prepareReveal(); setupHeader(); setupAxes(); setupPubs(); setupReveal();
    setupRouter(); setupHeroParallax(); setupMagnetic(); setupTilt(); setupFlow(); setupForm();

    let seen = false; try { seen = sessionStorage.getItem('li-seen') === '1'; } catch {}
    if (seen || reduce) { $('#preloader').style.display = 'none'; document.documentElement.classList.add('ready'); }
    else setTimeout(start, 1900);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

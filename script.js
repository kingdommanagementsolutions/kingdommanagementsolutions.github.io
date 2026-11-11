const btn = document.querySelector('.menu-btn');
const menu = document.getElementById('menu');
btn.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', e => {
  if (e.target.tagName === 'A') { menu.classList.remove('open'); btn.setAttribute('aria-expanded', false); }
});
document.getElementById('yr').textContent = new Date().getFullYear();

(function () {
  const media = document.querySelector('.hero-media');
  if (!media) return;
  const heroVideo = media.querySelector('.hero-video');
  const heroStill = media.querySelector('.hero-still');
  const nowCard = document.getElementById('now');
  const items = (media.dataset.playlist || '').split(',').map(x => x.split('|').map(s => s.trim())).filter(x => x[0]);
  const SLIDE_MS = 7000; // every preview (video or still) lasts this long
  if (items.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let i = -1, timer = 0;
    const label = ([, title, type, url]) => {
      nowCard.classList.remove('show');
      setTimeout(() => {
        nowCard.querySelector('.now-title').textContent = title || '';
        nowCard.querySelector('.now-type').textContent = type || '';
        if (url) nowCard.href = url;
        nowCard.hidden = !title;
        requestAnimationFrame(() => nowCard.classList.add('show'));
      }, 300);
    };
    const next = () => { clearTimeout(timer); i = (i + 1) % items.length; show(items[i]); };
    const show = item => {
      const src = item[0];
      label(item);
      if (/\.(mp4|webm|mov)$/i.test(src)) {
        heroVideo.onloadedmetadata = () => {
          // start in the middle of the clip so the 7 seconds shown are centered on it
          heroVideo.currentTime = Math.max(0, heroVideo.duration / 2 - SLIDE_MS / 2000);
          heroVideo.play().then(() => {
            heroVideo.classList.add('on');
            heroStill.classList.remove('on');
            timer = setTimeout(next, SLIDE_MS);
          }).catch(next);
        };
        heroVideo.src = src;
      } else {
        heroVideo.onloadedmetadata = null;
        heroStill.classList.remove('on');
        void heroStill.offsetWidth;
        heroStill.src = src;
        heroStill.classList.add('on');
        heroVideo.classList.remove('on');
        timer = setTimeout(next, SLIDE_MS);
      }
    };
    heroVideo.addEventListener('ended', next);
    heroVideo.addEventListener('error', next);
    next();
  }
})();

(function () {
  const tabs = [...document.querySelectorAll('.tab')];
  if (!tabs.length) return;
  const select = (name, focus) => {
    tabs.forEach(t => {
      const on = t.dataset.tab === name;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById('panel-' + t.dataset.tab).hidden = !on;
      if (on && focus) t.focus();
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { select(t.dataset.tab); history.replaceState(null, '', '#' + t.dataset.tab); });
    t.addEventListener('keydown', e => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      const n = tabs[(i + step + tabs.length) % tabs.length];
      select(n.dataset.tab, true);
      history.replaceState(null, '', '#' + n.dataset.tab);
    });
  });
  const fromHash = () => { const h = location.hash.slice(1); select(tabs.some(t => t.dataset.tab === h) ? h : 'apps'); };
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();

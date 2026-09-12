(() => {
  'use strict';
  const story = document.querySelector('.story');
  const stage = document.querySelector('.stage');
  const chapters = [...document.querySelectorAll('.chapter')];
  const menu = document.querySelector('.menu-button');
  const navigation = document.querySelector('.navigation');
  const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
  const portraitCard = document.querySelector('.portrait-card-shell');
  const cinematic = matchMedia('(min-width:1000px) and (min-height:620px) and (prefers-reduced-motion:no-preference)');
  const finePointer = matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
  const smallMenu = matchMedia('(max-width:650px)');
  let frame = 0;
  let activeChapter = '';
  let pointerX = 0;
  let pointerY = 0;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  function closeMenu(restoreFocus = false) {
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    if (restoreFocus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true);
    if (event.key !== 'Tab' || menu.getAttribute('aria-expanded') !== 'true' || !smallMenu.matches) return;
    const last = navigation.querySelector('a:last-child');
    if (event.shiftKey && document.activeElement === menu) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); menu.focus(); }
  });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  smallMenu.addEventListener('change', () => closeMenu());

  // Preserve native anchors, keyboard navigation, deep links and browser history.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      target.inert = false;
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    });
  });

  function render() {
    frame = 0;
    const viewport = stage.clientHeight || innerHeight;
    const windowHeight = innerHeight;
    const storyBounds = story.getBoundingClientRect();
    let closest = Infinity;
    let current = chapters[0];
    const boxes = chapters.map(chapter => ({ chapter, box: chapter.getBoundingClientRect() }));
    if (cinematic.matches) {
      boxes.forEach(({ chapter, box }) => {
        const distance = (box.top + box.height / 2 - viewport / 2) / viewport;
        const opacity = clamp((.86 - Math.abs(distance)) / .3);
        chapter.style.setProperty('--copy-opacity', opacity.toFixed(3));
        chapter.style.setProperty('--copy-y', `${clamp(distance, -1, 1) * 35}px`);
        // Invisible scenes never intercept clicks or keyboard focus.
        chapter.inert = opacity < .015;
        if (Math.abs(distance) < closest) { closest = Math.abs(distance); current = chapter; }
      });
      const progress = clamp(-storyBounds.top / Math.max(1, storyBounds.height - viewport));
      stage.style.setProperty('--progress', progress.toFixed(3));
      stage.style.setProperty('--portrait-x', `${pointerX * 7}px`);
      stage.style.setProperty('--portrait-y', `${pointerY * 5 - progress * 8}px`);
      stage.style.setProperty('--portrait-scale', (1 + progress * .035).toFixed(4));
      stage.style.setProperty('--light', (.92 + Math.sin(progress * Math.PI) * .08).toFixed(3));
      if (activeChapter !== current.dataset.chapter) {
        activeChapter = current.dataset.chapter;
        document.querySelector('#chapter-number').textContent = activeChapter;
      }
    } else {
      chapters.forEach(chapter => {
        chapter.style.removeProperty('--copy-opacity');
        chapter.style.removeProperty('--copy-y');
        chapter.inert = false;
      });
    }
    let activeTarget = '';
    navLinks.forEach(link => {
      const rect = document.querySelector(link.hash).getBoundingClientRect();
      if (rect.top <= windowHeight * .55 && rect.bottom > windowHeight * .3) activeTarget = link.hash;
    });
    navLinks.forEach(link => {
      if (link.hash === activeTarget) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(render); }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('pageshow', schedule);
  cinematic.addEventListener('change', schedule);
  document.fonts?.ready.then(schedule);
  document.querySelectorAll('img').forEach(img => img.addEventListener('load', schedule, { once: true }));
  story.addEventListener('pointermove', event => {
    if (!finePointer.matches || !cinematic.matches) return;
    pointerX = (event.clientX / innerWidth - .5) * 2;
    pointerY = (event.clientY / innerHeight - .5) * 2;
    schedule();
  }, { passive: true });
  story.addEventListener('pointerleave', () => { pointerX = pointerY = 0; schedule(); });
  portraitCard.addEventListener('pointermove', event => {
    if (!finePointer.matches) return;
    const box = portraitCard.getBoundingClientRect();
    portraitCard.style.setProperty('--tilt-y', `${((event.clientX - box.left) / box.width - .5) * 14}deg`);
    portraitCard.style.setProperty('--tilt-x', `${-((event.clientY - box.top) / box.height - .5) * 10}deg`);
  }, { passive: true });
  portraitCard.addEventListener('pointerleave', () => {
    portraitCard.style.removeProperty('--tilt-x');
    portraitCard.style.removeProperty('--tilt-y');
  });
  const visibility = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
      if (entry.target === stage) stage.querySelector('.portrait-haze > div').style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
    });
  });
  visibility.observe(portraitCard);
  visibility.observe(stage);
  document.getElementById('year').textContent = new Date().getFullYear();
  schedule();
})();

/* ==========================================================================
   The Test Lab shared layout
   Renders the header, sidebar, footer and prev/next links on every page,
   and exposes small helpers on window.TB (log, toast, $, $$).
   ========================================================================== */
(function () {
  'use strict';

  // Your repository URL. Leave CUSTOM_REPO_URL empty and it is worked out
  // automatically when the site is hosted on GitHub Pages.
  const CUSTOM_REPO_URL = 'https://github.com/noorearafin/the-test-lab';

  // Author credit shown in the footer. Edit these three values to change it.
  const AUTHOR = {
    name: 'Noor E Arafin',
    github: 'https://github.com/noorearafin',
    linkedin: 'https://www.linkedin.com/in/noorearafin'
  };
  const REPO_URL = (function () {
    if (CUSTOM_REPO_URL) return CUSTOM_REPO_URL;
    const m = location.hostname.match(/^([\w-]+)\.github\.io$/);
    if (m) {
      const seg = location.pathname.split('/').filter(Boolean)[0];
      const repo = seg && !/\.html$/.test(seg) ? seg : m[1] + '.github.io';
      return 'https://github.com/' + m[1] + '/' + repo;
    }
    return 'https://github.com/noorearafin/the-test-lab';
  })();

  const ICONS = {
    logo: '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    form: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
    check: '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    pointer: '<path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    window: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8h20"/><path d="M6 4v4"/><path d="M10 4v4"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    table: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
    move: '<polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    keyboard: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/>',
    box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.3 7 12 12 20.7 7"/><line x1="12" y1="22" x2="12" y2="12"/>',
    scroll: '<path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>',
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
    menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    tick: '<polyline points="20 6 9 17 4 12"/>',
    terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'
  };
  const icon = (name, cls) => `<svg class="icon ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  const PAGES = [
    { slug: 'forms', title: 'Form inputs', group: 'Basics', icon: 'form', desc: 'Every input type, validation messages, read-only and disabled fields.' },
    { slug: 'dropdowns', title: 'Dropdowns', group: 'Basics', icon: 'list', desc: 'Native, multi-select, dependent and custom dropdowns plus datalists.' },
    { slug: 'checkboxes', title: 'Checkboxes & radios', group: 'Basics', icon: 'check', desc: 'Checkbox groups, select all, radio buttons, toggles and ARIA controls.' },
    { slug: 'buttons', title: 'Buttons & mouse', group: 'Basics', icon: 'pointer', desc: 'Click, double-click, right-click, dynamic ids and moving targets.' },
    { slug: 'alerts', title: 'Alerts & modals', group: 'Browser', icon: 'bell', desc: 'JavaScript alert, confirm and prompt dialogs, plus HTML modals.' },
    { slug: 'windows', title: 'Windows & tabs', group: 'Browser', icon: 'window', desc: 'Open new tabs and popups, then switch between window handles.' },
    { slug: 'frames', title: 'Iframes', group: 'Browser', icon: 'layers', desc: 'Single frames, nested frames and frames that talk to the parent.' },
    { slug: 'links', title: 'Links & images', group: 'Browser', icon: 'link', desc: 'Working, broken and external links, and broken image detection.' },
    { slug: 'storage', title: 'Cookies & storage', group: 'Browser', icon: 'database', desc: 'Set and verify cookies, localStorage and sessionStorage.' },
    { slug: 'tables', title: 'Web tables', group: 'Data', icon: 'table', desc: 'Static and dynamic tables with sorting, filtering and pagination.' },
    { slug: 'files', title: 'Upload & download', group: 'Data', icon: 'upload', desc: 'Single and multiple file uploads, drop zones and file downloads.' },
    { slug: 'drag-drop', title: 'Drag & drop', group: 'Interactions', icon: 'move', desc: 'HTML5 drag and drop, sortable lists and a custom slider.' },
    { slug: 'hover', title: 'Hover & tooltips', group: 'Interactions', icon: 'eye', desc: 'Menus and overlays that only appear on hover, and tooltips.' },
    { slug: 'keyboard', title: 'Keyboard', group: 'Interactions', icon: 'keyboard', desc: 'Key presses, shortcuts, key combinations and clipboard actions.' },
    { slug: 'scrolling', title: 'Scrolling', group: 'Interactions', icon: 'scroll', desc: 'Infinite scroll, scroll containers and elements below the fold.' },
    { slug: 'svg-canvas', title: 'SVG & canvas', group: 'Interactions', icon: 'pen', desc: 'Clickable SVG shapes and a canvas you draw on with the mouse.' },
    { slug: 'waits', title: 'Waits & dynamic content', group: 'Advanced', icon: 'clock', desc: 'Elements that appear, vanish, enable or change after a delay.' },
    { slug: 'widgets', title: 'UI widgets', group: 'Advanced', icon: 'grid', desc: 'Tabs, accordions, autocomplete, ratings, steppers and toasts.' },
    { slug: 'shadow-dom', title: 'Shadow DOM', group: 'Advanced', icon: 'box', desc: 'Open shadow roots, nested shadow roots and web components.' },
    { slug: 'login', title: 'Login flow', group: 'Advanced', icon: 'lock', desc: 'A complete login with validation, lockout and a secure page.' }
  ];
  const GROUPS = ['Basics', 'Browser', 'Data', 'Interactions', 'Advanced'];

  const body = document.body;
  const ROOT = body.dataset.root || '.';
  const CURRENT = body.dataset.page || '';
  const pageUrl = slug => `${ROOT}/pages/${slug}.html`;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

  /* ---------- Theme ---------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  const savedTheme = store.get('tl-theme');
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  // The site starts in light mode; dark mode is opt-in and remembered.
  const isDark = () => document.documentElement.dataset.theme === 'dark';

  /* ---------- Header ---------- */
  const header = document.getElementById('app-header');
  if (header) {
    header.outerHTML = `
    <header class="site-header" data-testid="site-header">
      <div class="container">
        <button class="icon-btn menu-toggle" id="menuToggle" aria-label="Open navigation" data-testid="menu-toggle">${icon('menu')}</button>
        <a class="brand" href="${ROOT}/index.html" data-testid="brand-link"><span class="brand-mark">${icon('logo')}</span><span class="brand-name">The Test Lab</span></a>
        <nav class="main-nav" aria-label="Primary">
          <a href="${ROOT}/index.html" ${CURRENT === 'home' ? 'aria-current="page"' : ''} data-testid="nav-home">Home</a>
          <a href="${pageUrl('forms')}" ${CURRENT && CURRENT !== 'home' ? 'aria-current="page"' : ''} data-testid="nav-practice">Practice</a>
          <a href="${ROOT}/index.html#components" data-testid="nav-components">Components</a>
          <a href="${ROOT}/index.html#get-started" data-testid="nav-get-started">Run locally</a>
        </nav>
        <div class="header-actions">
          <button class="icon-btn" id="themeToggle" aria-label="Toggle dark mode" data-testid="theme-toggle">${icon(isDark() ? 'sun' : 'moon')}</button>
          <a class="btn btn-secondary btn-sm" href="${REPO_URL}" target="_blank" rel="noopener" data-testid="github-link">${icon('code')} GitHub</a>
        </div>
      </div>
    </header>`;
  }
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    store.set('tl-theme', next);
    themeBtn.innerHTML = icon(next === 'dark' ? 'sun' : 'moon');
  });

  /* ---------- Sidebar ---------- */
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) {
    sidebar.className = 'sidebar';
    sidebar.setAttribute('aria-label', 'Practice pages');
    sidebar.innerHTML = `
      <div class="sidebar-search">${icon('search')}<input class="input" type="search" id="sidebarSearch" placeholder="Search components" aria-label="Search components" data-testid="sidebar-search"></div>
      ${GROUPS.map(g => `
        <div class="side-group" data-group="${g}">
          <h4>${g}</h4>
          ${PAGES.filter(p => p.group === g).map(p => `
            <a class="side-link" href="${pageUrl(p.slug)}" data-testid="side-${p.slug}" ${p.slug === CURRENT ? 'aria-current="page"' : ''}>${icon(p.icon)}<span>${p.title}</span></a>`).join('')}
        </div>`).join('')}`;
    $('#sidebarSearch').addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      $$('.side-group', sidebar).forEach(grp => {
        let any = false;
        $$('.side-link', grp).forEach(a => { const m = a.textContent.toLowerCase().includes(q); a.style.display = m ? '' : 'none'; any = any || m; });
        grp.style.display = any ? '' : 'none';
      });
    });
    const toggle = document.getElementById('menuToggle');
    if (toggle) toggle.addEventListener('click', () => body.classList.toggle('sidebar-open'));
    document.addEventListener('click', e => {
      if (body.classList.contains('sidebar-open') && !e.target.closest('.sidebar') && !e.target.closest('#menuToggle')) body.classList.remove('sidebar-open');
    });
  } else {
    const toggle = document.getElementById('menuToggle');
    if (toggle) toggle.style.display = 'none';
  }

  /* ---------- Breadcrumb + page header + prev/next ---------- */
  const page = PAGES.find(p => p.slug === CURRENT);
  const main = document.getElementById('main');
  if (page && main) {
    const idx = PAGES.indexOf(page);
    const head = document.createElement('div');
    head.innerHTML = `
      <nav class="breadcrumb" aria-label="Breadcrumb" data-testid="breadcrumb"><a href="${ROOT}/index.html">Home</a><span>/</span><span>${page.group}</span><span>/</span><span aria-current="page">${page.title}</span></nav>
      <div class="page-head">
        <h1 id="pageTitle" data-testid="page-title">${page.title}</h1>
        <p data-testid="page-description">${page.desc}</p>
        ${main.dataset.tags ? `<div class="page-tags">${main.dataset.tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('')}</div>` : ''}
      </div>`;
    main.prepend(...head.children);
    const prev = PAGES[idx - 1], next = PAGES[idx + 1];
    const navEl = document.createElement('nav');
    navEl.className = 'page-nav';
    navEl.setAttribute('aria-label', 'Previous and next page');
    navEl.innerHTML = `${prev ? `<a class="prev" href="${pageUrl(prev.slug)}" data-testid="prev-page-link"><small>Previous</small><strong>${prev.title}</strong></a>` : ''}
                       ${next ? `<a class="next" href="${pageUrl(next.slug)}" data-testid="next-page-link"><small>Next</small><strong>${next.title}</strong></a>` : ''}`;
    main.appendChild(navEl);
    document.title = `${page.title} | The Test Lab`;
  }

  /* ---------- Footer ---------- */
  const footer = document.getElementById('app-footer');
  if (footer) {
    footer.outerHTML = `
    <footer class="site-footer" data-testid="site-footer">
      <div class="container">
        <span>The Test Lab is an open-source playground for practising UI test automation.<br>
          Built by <a href="${AUTHOR.github}" target="_blank" rel="noopener" data-testid="author-link">${AUTHOR.name}</a>.</span>
        <nav aria-label="Footer">
          <a href="${pageUrl('forms')}">Start practising</a>
          <a href="${REPO_URL}" target="_blank" rel="noopener" data-testid="footer-repo-link">Source code</a>
          <a href="${AUTHOR.github}" target="_blank" rel="noopener" data-testid="footer-github-link">GitHub</a>
          <a href="${AUTHOR.linkedin}" target="_blank" rel="noopener" data-testid="footer-linkedin-link">LinkedIn</a>
          <a href="${REPO_URL}/issues" target="_blank" rel="noopener">Report an issue</a>
        </nav>
      </div>
    </footer>`;
  }

  /* ---------- Toasts ---------- */
  const toastStack = document.createElement('div');
  toastStack.className = 'toast-stack';
  toastStack.setAttribute('aria-live', 'polite');
  toastStack.dataset.testid = 'toast-stack';
  body.appendChild(toastStack);
  function toast(message, ms) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.dataset.testid = 'toast';
    t.innerHTML = `${icon('tick')}<span>${message}</span>`;
    toastStack.appendChild(t);
    setTimeout(() => t.remove(), ms || 3000);
  }

  /* ---------- Event log ---------- */
  let logCount = 0;
  if (page) {
    const fab = document.createElement('button');
    fab.className = 'btn btn-primary log-fab';
    fab.id = 'eventLogToggle';
    fab.dataset.testid = 'event-log-toggle';
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = `${icon('activity')} Event log <span class="count" id="eventLogCount">0</span>`;
    const panel = document.createElement('section');
    panel.className = 'log-panel';
    panel.id = 'eventLog';
    panel.dataset.testid = 'event-log';
    panel.setAttribute('aria-label', 'Event log');
    panel.innerHTML = `<header><span>Event log</span><div class="row" style="gap:4px"><button class="btn btn-ghost btn-sm" id="eventLogClear" data-testid="event-log-clear">Clear</button><button class="icon-btn" id="eventLogClose" aria-label="Close event log" style="width:30px;height:30px">${icon('x')}</button></div></header>
      <ul class="log-list" id="eventLogList" data-testid="event-log-list"></ul><div class="log-empty" id="eventLogEmpty">Actions you perform on this page are listed here.</div>`;
    body.append(fab, panel);
    body.classList.add('has-log');
    fab.addEventListener('click', () => { panel.classList.toggle('open'); fab.setAttribute('aria-expanded', panel.classList.contains('open')); });
    $('#eventLogClose').addEventListener('click', () => { panel.classList.remove('open'); fab.setAttribute('aria-expanded', 'false'); });
    $('#eventLogClear').addEventListener('click', () => { $('#eventLogList').innerHTML = ''; logCount = 0; $('#eventLogCount').textContent = '0'; $('#eventLogEmpty').style.display = ''; });
  }
  function log(message) {
    const list = document.getElementById('eventLogList');
    if (!list) return;
    const li = document.createElement('li');
    li.dataset.testid = 'event-log-item';
    li.innerHTML = `<time>${new Date().toLocaleTimeString()}</time><span></span>`;
    li.lastChild.textContent = message;
    list.prepend(li);
    while (list.children.length > 100) list.lastChild.remove();
    $('#eventLogCount').textContent = ++logCount;
    $('#eventLogEmpty').style.display = 'none';
  }

  /* ---------- Locator chips: click to copy ---------- */
  document.addEventListener('click', e => {
    const chip = e.target.closest('.loc');
    if (!chip) return;
    const text = chip.textContent.trim();
    const done = () => toast(`Copied ${text}`);
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done).catch(() => {});
    else { const ta = document.createElement('textarea'); ta.value = text; body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (err) { /* ignore */ } ta.remove(); }
  });

  /* ---------- Offline support ----------
     Caches the site after the first visit so it also works without a network
     connection. Delete sw.js and this block to turn it off. */
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(ROOT + '/sw.js').catch(() => { /* offline support unavailable */ });
    });
  }

  window.TB = { $, $$, log, toast, icon, PAGES, GROUPS, pageUrl, ROOT, REPO_URL, AUTHOR, store };
})();

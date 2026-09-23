(function () {
  const { $, $$, log } = window.TB;
  $$('.hover-menu').forEach(m => m.addEventListener('mouseenter', () => { $('#hoverMenuResult').textContent = m.querySelector('button').textContent.replace('▾', '').trim() + ' menu opened'; log('hover: ' + m.id); }));
  $$('.hover-menu a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); const r = $('#hoverMenuResult'); r.className = 'result success'; r.textContent = 'You selected: ' + a.textContent; log('menu item: ' + a.textContent); }));
  $('#tooltipBtn').addEventListener('mouseenter', () => log('tooltip shown'));
  $$('.hover-card').forEach(c => c.addEventListener('mouseenter', () => { $('#hoverCardResult').textContent = 'Hovering: ' + c.querySelector('button').dataset.product; }));
  $$('.hover-card button').forEach(b => b.addEventListener('click', () => { const r = $('#hoverCardResult'); r.className = 'result success'; r.textContent = 'Opened details for ' + b.dataset.product; log('view product: ' + b.dataset.product); }));
})();

(function () {
  const { $, log } = window.TB;
  let n = 0, busy = false;
  const list = $('#infiniteList'), box = $('#infiniteBox');
  function add(count) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count && n < 100; i++) { n++; const li = document.createElement('li'); li.textContent = `Feed item ${n}`; li.id = 'feedItem' + n; li.setAttribute('data-testid', 'feed-item-' + n); frag.appendChild(li); }
    list.appendChild(frag); $('#infiniteCount').textContent = n;
    if (n >= 100 && !$('#feedEnd')) { const end = document.createElement('li'); end.id = 'feedEnd'; end.setAttribute('data-testid', 'feed-end'); end.className = 'muted'; end.textContent = "You've reached the end of the feed"; list.appendChild(end); }
  }
  add(10);
  box.addEventListener('scroll', () => {
    if (busy || n >= 100 || box.scrollTop + box.clientHeight < box.scrollHeight - 10) return;
    busy = true; $('#infiniteLoader').hidden = false;
    setTimeout(() => { add(10); busy = false; $('#infiniteLoader').hidden = true; log('loaded items up to ' + n); }, 700);
  });
  const vb = $('#verticalBox'), cr = $('#containerResult');
  vb.addEventListener('scroll', () => { cr.textContent = `Vertical box scrollTop: ${Math.round(vb.scrollTop)}`; });
  $('#hiddenInBoxBtn').addEventListener('click', () => { cr.className = 'result success'; cr.textContent = 'Hidden button clicked'; log('hidden button clicked'); });
  $('#tileTrack').innerHTML = Array.from({ length: 15 }, (_, i) => `<div class="tile" id="tile${i + 1}" data-testid="tile-${i + 1}">Card ${i + 1}</div>`).join('');
  $('#horizontalBox').addEventListener('scroll', e => { cr.textContent = `Carousel scrollLeft: ${Math.round(e.target.scrollLeft)}`; });
  $('#tileTrack').addEventListener('click', e => { const t = e.target.closest('.tile'); if (t) { cr.className = 'result success'; cr.textContent = t.textContent + ' clicked'; log(t.textContent + ' clicked'); } });
  const y = () => { $('#scrollY').textContent = Math.round(window.scrollY); };
  window.addEventListener('scroll', y, { passive: true });
  $('#scrollBottomBtn').addEventListener('click', () => window.scrollTo(0, document.documentElement.scrollHeight));
  $('#scrollDemoBtn').addEventListener('click', () => window.scrollBy(0, 500));
  $('#scrollTopBtn').addEventListener('click', () => window.scrollTo(0, 0));
  new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) log('bottom marker visible'); })).observe($('#pageBottomMarker'));
})();

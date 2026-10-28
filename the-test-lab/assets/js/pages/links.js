(function () {
  const { $, $$, log } = window.TB;
  const out = $('#linkStatus');
  $('#jsLink').addEventListener('click', e => { e.preventDefault(); out.className = 'result success'; out.textContent = 'JavaScript link clicked (navigation prevented)'; log('js link'); });
  $('#noHrefLink').addEventListener('click', () => { out.textContent = 'Anchor without href clicked'; log('no-href anchor'); });
  $('#countLinksBtn').addEventListener('click', () => {
    const links = $$('#linkList a'); const withHref = links.filter(a => a.hasAttribute('href'));
    out.className = 'result'; out.textContent = `${links.length} links found, ${withHref.length} with an href`; log('links counted');
  });
  $('#checkLinksBtn').addEventListener('click', async () => {
    if (location.protocol === 'file:') { out.className = 'result error'; out.textContent = 'Status checks need a web server. Run npm start and open http://localhost:3000.'; return; }
    out.className = 'result'; out.textContent = 'Checking…';
    const local = $$('#linkList a[href]').filter(a => a.host === location.host && !a.getAttribute('href').startsWith('#'));
    const results = await Promise.all(local.map(a => fetch(a.href, { method: 'HEAD' }).then(r => `${a.textContent}: ${r.status}`).catch(() => `${a.textContent}: failed`)));
    out.textContent = results.join(' | '); log('local links checked');
  });
  function checkImages() {
    const parts = $$('.card img').map(img => `${img.alt}: ${img.complete && img.naturalWidth > 0 ? 'loaded' : 'broken'}`);
    $('#imageStatus').textContent = parts.join(' | ');
  }
  $('#checkImagesBtn').addEventListener('click', () => { checkImages(); log('images checked'); });
  window.addEventListener('load', checkImages);
})();

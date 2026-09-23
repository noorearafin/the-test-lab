(function () {
  const { $, log } = window.TB;
  window.addEventListener('message', e => {
    if (!e.data || e.data.type !== 'tl-frame') return;
    const r = $('#frameResult'); r.className = 'result success';
    r.textContent = `Message from ${e.data.frame} frame: ${e.data.text}`;
    log(e.data.frame + ' frame: ' + e.data.text);
  });
})();

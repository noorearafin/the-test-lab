(function () {
  const { $, log } = window.TB;
  const ok = (el, html) => { el.className = 'result success'; el.innerHTML = html; };

  $('#addElementBtn').addEventListener('click', () => { const a = $('#addArea'); a.className = 'result'; a.textContent = 'Adding in 5 seconds…'; setTimeout(() => { ok(a, '<span id="delayedElement" data-testid="delayed-element">I appeared after 5 seconds</span>'); log('element added'); }, 5000); });
  $('#showElementBtn').addEventListener('click', () => { $('#hiddenElement').style.display = 'none'; setTimeout(() => { $('#hiddenElement').style.display = ''; log('hidden element shown'); }, 3000); });
  $('#removeElementBtn').addEventListener('click', () => {
    const area = $('#removeArea');
    if (!$('#vanishingElement')) area.innerHTML = '<span id="vanishingElement" data-testid="vanishing-element">I will be removed</span>';
    setTimeout(() => { const v = $('#vanishingElement'); if (v) v.remove(); area.textContent = 'Element removed'; log('element removed'); }, 3000);
  });

  $('#enableInputBtn').addEventListener('click', () => { const i = $('#delayedInput'); i.disabled = true; i.placeholder = 'Enabling in 3 seconds…'; setTimeout(() => { i.disabled = false; i.placeholder = 'Now enabled. Type here'; log('input enabled'); }, 3000); });
  $('#changeTextBtn').addEventListener('click', () => {
    const s = $('#statusText'); s.className = 'result';
    const steps = [['Status: Queued', 0], ['Status: Running', 1500], ['Status: Completed', 4000]];
    steps.forEach(([t, ms]) => setTimeout(() => { s.textContent = t; if (t.endsWith('Completed')) s.className = 'result success'; log(t); }, ms));
  });
  $('#changeAttrBtn').addEventListener('click', () => { const b = $('#colorBox'); b.dataset.state = 'pending'; b.className = 'result'; b.textContent = 'data-state="pending"'; setTimeout(() => { b.dataset.state = 'ready'; b.className = 'result success'; b.textContent = 'data-state="ready"'; log('attribute changed'); }, 2000); });

  $('#loadDataBtn').addEventListener('click', () => {
    const a = $('#dataArea'); a.className = 'result'; a.innerHTML = '<span class="spinner" id="loadingSpinner" data-testid="loading-spinner" role="status" aria-label="Loading"></span>';
    setTimeout(() => { ok(a, '<ul id="loadedData" data-testid="loaded-data" style="margin:0;padding-left:18px"><li>Order #1042 shipped</li><li>Order #1043 processing</li><li>Order #1044 delivered</li></ul>'); log('data loaded'); }, 2500);
  });
  let timer;
  $('#startProgressBtn').addEventListener('click', () => {
    clearInterval(timer); let p = 0;
    timer = setInterval(() => {
      p = Math.min(100, p + Math.ceil(Math.random() * 6));
      $('#progressFill').style.width = p + '%'; $('#progressBar').setAttribute('aria-valuenow', p);
      $('#progressLabel').textContent = p === 100 ? 'Complete' : p + '%';
      if (p === 100) { clearInterval(timer); log('progress complete'); }
    }, 120);
  });
  $('#loadProfileBtn').addEventListener('click', () => {
    const a = $('#profileArea'); a.className = 'result'; a.innerHTML = '<div class="skeleton" style="width:60%"></div><div class="skeleton" style="width:90%"></div><div class="skeleton" style="width:40%;margin:0"></div>';
    setTimeout(() => { ok(a, '<div id="userCard" data-testid="user-card"><strong id="userName" data-testid="user-name">Aisha Rahman</strong><br><span id="userRole" data-testid="user-role">Senior QA Engineer</span></div>'); log('profile loaded'); }, 3000);
  });

  $('#randomDelayBtn').addEventListener('click', () => {
    const ms = 1000 + Math.random() * 7000, a = $('#randomArea'); a.className = 'result'; a.textContent = 'Working…';
    setTimeout(() => { ok(a, `<span id="randomResult" data-testid="random-result">Finished in ${(ms / 1000).toFixed(1)}s</span>`); log('random delay done'); }, ms);
  });
  let renders = 1;
  $('#rerenderBtn').addEventListener('click', () => {
    const fruits = ['Apple', 'Banana', 'Cherry', 'Mango', 'Grape'].sort(() => Math.random() - 0.5).slice(0, 3);
    const ul = document.createElement('ul'); ul.id = 'staleList'; ul.dataset.testid = 'stale-list'; ul.style.cssText = 'margin:0;padding-left:18px';
    ul.innerHTML = fruits.map(f => `<li>${f}</li>`).join('');
    $('#staleList').replaceWith(ul); $('#renderCount').textContent = ++renders; log('list re-rendered');
  });
  $('#showOverlayBtn').addEventListener('click', () => { const o = $('#overlay'); o.hidden = false; o.style.display = 'grid'; setTimeout(() => { o.hidden = true; o.style.display = 'none'; log('overlay removed'); }, 3000); });
  $('#overlay').style.display = 'none';
  $('#blockedBtn').addEventListener('click', () => { ok($('#overlayResult'), 'Button clicked'); log('blocked button clicked'); });
})();

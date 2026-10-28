(function () {
  const { $, $$, log, toast } = window.TB;
  const res = $('#clickResult'), st = $('#stateResult');
  const setRes = (el, msg, ok) => { el.textContent = msg; el.className = 'result' + (ok ? ' success' : ''); };

  $('#singleClickBtn').addEventListener('click', () => { setRes(res, 'You clicked the button', true); log('single click'); });
  $('#doubleClickBtn').addEventListener('dblclick', () => { setRes(res, 'You double-clicked the button', true); log('double click'); });
  const menu = $('#contextMenu');
  $('#rightClickBtn').addEventListener('contextmenu', e => {
    e.preventDefault();
    menu.style.left = Math.min(e.clientX, innerWidth - 200) + 'px'; menu.style.top = e.clientY + 'px';
    menu.classList.add('open');
    setRes(res, 'You right-clicked the button', true); log('right click');
  });
  $$('#contextMenu li').forEach(li => li.addEventListener('click', () => { menu.classList.remove('open'); setRes(res, 'Context menu action: ' + li.dataset.action, true); log('context menu: ' + li.dataset.action); }));
  document.addEventListener('click', e => { if (!e.target.closest('#contextMenu')) menu.classList.remove('open'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') menu.classList.remove('open'); });

  const dyn = $('#dynamicIdBtn');
  dyn.id = 'dyn-' + Math.random().toString(36).slice(2, 10);
  $('#currentDynamicId').textContent = dyn.id;
  dyn.addEventListener('click', () => { setRes(st, 'Dynamic id button clicked', true); log('dynamic id click (' + dyn.id + ')'); });
  $('#enableDisabledBtn').addEventListener('click', () => { $('#disabledBtn').disabled = false; setRes(st, 'Disabled button is now enabled', true); log('button enabled'); });
  $('#disabledBtn').addEventListener('click', () => { setRes(st, 'Previously disabled button clicked', true); log('disabled button clicked'); });
  $('#inputTypeBtn').addEventListener('click', () => { setRes(st, 'input type=button clicked', true); log('input button'); });
  $('#inputSubmitBtn').addEventListener('click', () => { setRes(st, 'input type=submit clicked', true); log('input submit'); });
  $('#anchorBtn').addEventListener('click', e => { e.preventDefault(); setRes(st, 'Anchor button clicked', true); log('anchor button'); });
  const divBtn = $('#divBtn');
  divBtn.addEventListener('click', () => { setRes(st, 'Div button clicked', true); log('div button'); });
  divBtn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); divBtn.click(); } });
  $('#iconBtn').addEventListener('click', () => { setRes(st, 'Icon-only button clicked (aria-label="Settings")', true); log('icon button'); });

  let count = 0; const cv = $('#counterValue');
  $('#incrementBtn').addEventListener('click', () => { cv.textContent = ++count; log('count ' + count); });
  $('#decrementBtn').addEventListener('click', () => { cv.textContent = --count; log('count ' + count); });
  $('#resetCounterBtn').addEventListener('click', () => { count = 0; cv.textContent = 0; log('count reset'); });
  const save = $('#saveBtn');
  save.addEventListener('click', () => {
    save.disabled = true; save.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px"></span> Saving…';
    save.setAttribute('aria-busy', 'true');
    setTimeout(() => { save.disabled = false; save.textContent = 'Saved'; save.removeAttribute('aria-busy'); toast('Changes saved'); log('saved'); setTimeout(() => { save.textContent = 'Save changes'; }, 2000); }, 1800);
  });

  const pad = $('#mousePad');
  pad.addEventListener('mousemove', e => { const r = pad.getBoundingClientRect(); $('#mouseCoords').textContent = `x: ${Math.round(e.clientX - r.left)}, y: ${Math.round(e.clientY - r.top)}`; });
  pad.addEventListener('mouseenter', () => { $('#mouseResult').textContent = 'mouseenter on pad'; log('mouseenter'); });
  pad.addEventListener('mouseleave', () => { $('#mouseResult').textContent = 'mouseleave from pad'; log('mouseleave'); });
  pad.addEventListener('click', e => { const r = pad.getBoundingClientRect(); setRes($('#mouseResult'), `Clicked pad at x: ${Math.round(e.clientX - r.left)}, y: ${Math.round(e.clientY - r.top)}`, true); log('pad click'); });

  const run = $('#runawayBtn'), area = $('#runawayArea'); let jumps = 0;
  run.addEventListener('mouseenter', () => {
    if (jumps >= 5) return;
    jumps++;
    run.style.left = Math.random() * (area.clientWidth - run.offsetWidth) + 'px';
    run.style.top = Math.random() * (area.clientHeight - run.offsetHeight) + 'px';
    log('runaway button moved (' + jumps + '/5)');
    if (jumps === 5) run.textContent = 'OK, you win';
  });
  run.addEventListener('click', () => { setRes($('#mouseResult'), 'You caught the button', true); log('runaway caught'); });
})();

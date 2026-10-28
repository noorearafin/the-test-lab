(function () {
  const { $, $$, log } = window.TB;
  // Basic
  const drag = $('#draggable'), drop = $('#droppable');
  drag.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', 'draggable'); e.dataTransfer.effectAllowed = 'move'; });
  drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('over'));
  drop.addEventListener('drop', e => {
    e.preventDefault(); drop.classList.remove('over');
    drop.classList.add('done'); drop.textContent = 'Dropped!'; drop.appendChild(drag); log('item dropped');
  });
  $('#resetDragBtn').addEventListener('click', () => { $('#dragSource').appendChild(drag); drop.classList.remove('done'); drop.childNodes.forEach(n => { if (n.nodeType === 3) n.remove(); }); drop.prepend('Drop here'); log('drag reset'); });

  // Kanban
  let dragged = null;
  $$('#todoList li, #doneList li').forEach(li => li.addEventListener('dragstart', e => { dragged = li; li.classList.add('dragging'); e.dataTransfer.setData('text/plain', li.id); }));
  document.addEventListener('dragend', () => { if (dragged) dragged.classList.remove('dragging'); });
  const counts = () => { $('#todoCount').textContent = $$('#todoList li').length; $('#doneCount').textContent = $$('#doneList li').length; };
  ['#todoList', '#doneList'].forEach(sel => {
    const list = $(sel);
    list.addEventListener('dragover', e => { if (dragged && dragged.closest('#todoList, #doneList')) { e.preventDefault(); list.classList.add('over'); } });
    list.addEventListener('dragleave', () => list.classList.remove('over'));
    list.addEventListener('drop', e => { e.preventDefault(); list.classList.remove('over'); if (dragged && dragged.closest('#todoList, #doneList')) { list.appendChild(dragged); counts(); log(`${dragged.textContent.replace('⋮⋮', '').trim()} moved to ${sel === '#doneList' ? 'Done' : 'To do'}`); } });
  });

  // Sortable
  const sl = $('#sortableList');
  sl.addEventListener('dragstart', e => { dragged = e.target.closest('li'); dragged.classList.add('dragging'); e.dataTransfer.setData('text/plain', dragged.dataset.value); });
  sl.addEventListener('dragover', e => {
    e.preventDefault(); const t = e.target.closest('li'); if (!t || t === dragged || !dragged || dragged.parentNode !== sl) return;
    const r = t.getBoundingClientRect(); sl.insertBefore(dragged, e.clientY - r.top > r.height / 2 ? t.nextSibling : t);
  });
  sl.addEventListener('drop', e => {
    e.preventDefault();
    const order = $$('#sortableList li').map(li => li.dataset.value);
    const ok = order.join() === '1,2,3,4,5';
    const r = $('#sortResult'); r.className = 'result' + (ok ? ' success' : ''); r.textContent = ok ? 'Sorted correctly: 1, 2, 3, 4, 5' : 'Current order: ' + order.join(', ');
    log('list order: ' + order.join(','));
  });

  // Slider
  const track = $('#sliderTrack'), handle = $('#sliderHandle');
  let active = false;
  function setVal(v) { v = Math.max(0, Math.min(100, Math.round(v))); handle.style.left = v + '%'; $('#sliderFill').style.width = v + '%'; handle.setAttribute('aria-valuenow', v); $('#sliderValue').textContent = v; }
  const fromX = x => { const r = track.getBoundingClientRect(); setVal((x - r.left) / r.width * 100); };
  handle.addEventListener('mousedown', e => { active = true; e.preventDefault(); });
  document.addEventListener('mousemove', e => { if (active) fromX(e.clientX); });
  document.addEventListener('mouseup', () => { if (active) { active = false; log('slider value ' + $('#sliderValue').textContent); } });
  handle.addEventListener('touchstart', () => { active = true; }, { passive: true });
  document.addEventListener('touchmove', e => { if (active) fromX(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('touchend', () => { active = false; });
  track.addEventListener('click', e => { if (e.target === track || e.target.id === 'sliderFill') { fromX(e.clientX); log('slider value ' + $('#sliderValue').textContent); } });
  handle.addEventListener('keydown', e => {
    const v = +handle.getAttribute('aria-valuenow');
    const map = { ArrowRight: v + 1, ArrowUp: v + 1, ArrowLeft: v - 1, ArrowDown: v - 1, PageUp: v + 10, PageDown: v - 10, Home: 0, End: 100 };
    if (e.key in map) { e.preventDefault(); setVal(map[e.key]); log('slider value ' + $('#sliderValue').textContent); }
  });
})();

(function () {
  const { $, log, toast } = window.TB;
  $('#keyInput').addEventListener('keydown', e => {
    const parts = [e.ctrlKey && 'Ctrl', e.metaKey && 'Meta', e.altKey && 'Alt', e.shiftKey && 'Shift'].filter(Boolean);
    const k = e.key === ' ' ? 'Space' : e.key;
    if (!['Control', 'Meta', 'Alt', 'Shift'].includes(k)) parts.push(k);
    $('#keyDisplay').innerHTML = parts.map(p => `<kbd>${p.replace(/[<>&]/g, '')}</kbd>`).join('<span class="muted">+</span>');
    $('#keyCode').textContent = e.code;
    log('key: ' + parts.join('+'));
  });
  const sr = $('#shortcutResult');
  document.addEventListener('keydown', e => {
    const inField = e.target.matches('input, textarea, [contenteditable]');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#shortcutSearch').focus(); sr.className = 'result success'; sr.textContent = 'Ctrl + K: search focused'; log('shortcut Ctrl+K'); return; }
    if (inField) return;
    if (e.shiftKey && e.key === '?') { sr.className = 'result success'; sr.textContent = 'Shift + ?: help opened'; log('shortcut Shift+?'); }
    else if (e.altKey && e.code === 'KeyS') { e.preventDefault(); sr.className = 'result success'; sr.textContent = 'Alt + S: saved'; toast('Saved'); log('shortcut Alt+S'); }
    else if (e.key === 'Escape') { sr.className = 'result'; sr.textContent = 'Result cleared'; log('shortcut Esc'); }
  });
  ['#tabField1', '#tabField2', '#tabField3'].forEach(s => $(s).addEventListener('focus', () => { $('#tabResult').className = 'result'; $('#tabResult').textContent = 'Focused field: ' + s.slice(1); }));
  $('#tabForm').addEventListener('submit', e => {
    e.preventDefault();
    const r = $('#tabResult'); r.className = 'result success';
    r.textContent = `Submitted with Enter: ${$('#tabField1').value || '-'}, ${$('#tabField2').value || '-'}, ${$('#tabField3').value || '-'}`; log('tab form submitted');
  });
  function compare() {
    const same = $('#pasteTarget').value === $('#copySource').value && $('#pasteTarget').value !== '';
    const r = $('#clipboardResult'); r.className = 'result' + (same ? ' success' : ''); r.textContent = same ? 'Pasted text matches the source' : "Values don't match yet.";
  }
  $('#pasteTarget').addEventListener('paste', () => { setTimeout(compare, 0); log('paste'); });
  $('#pasteTarget').addEventListener('input', compare);
  $('#copySource').addEventListener('copy', () => log('copy'));
})();

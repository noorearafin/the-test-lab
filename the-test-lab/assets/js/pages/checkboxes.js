(function () {
  const { $, $$, log } = window.TB;
  const boxes = $$('input[name="interest"]');
  const all = $('#selectAll');

  function syncAll() {
    const n = boxes.filter(b => b.checked).length;
    all.checked = n === boxes.length; all.indeterminate = n > 0 && n < boxes.length;
  }
  function summary() {
    const interests = boxes.filter(b => b.checked).map(b => b.value).join(', ') || 'none';
    const plan = ($('input[name="plan"]:checked') || {}).value || 'none';
    const exp = ($('input[name="experience"]:checked') || {}).value || 'none';
    $('#choiceResult').textContent = `Interests: ${interests} | Plan: ${plan} | Experience: ${exp} | Email notifications: ${$('#emailNotifications').checked ? 'on' : 'off'} | Auto-save: ${$('#darkPreview').checked ? 'on' : 'off'} | Newsletter: ${$('#ariaCheckbox').getAttribute('aria-checked')}`;
  }
  all.addEventListener('change', () => { boxes.forEach(b => { b.checked = all.checked; }); log('select all: ' + all.checked); summary(); });
  boxes.forEach(b => b.addEventListener('change', () => { syncAll(); log(`${b.value}: ${b.checked ? 'checked' : 'unchecked'}`); summary(); }));
  $$('input[type="radio"]').forEach(r => r.addEventListener('change', () => { log(`${r.name} = ${r.value}`); summary(); }));

  function bindSwitch(id) {
    const el = $('#' + id), badge = $('#' + id + 'State');
    el.addEventListener('change', () => {
      badge.textContent = el.checked ? 'On' : 'Off';
      badge.className = 'badge ' + (el.checked ? 'badge-success' : 'badge-danger');
      log(`${id}: ${el.checked ? 'on' : 'off'}`); summary();
    });
  }
  bindSwitch('emailNotifications'); bindSwitch('darkPreview');

  const aria = $('#ariaCheckbox');
  function toggleAria() {
    const v = aria.getAttribute('aria-checked') !== 'true';
    aria.setAttribute('aria-checked', v);
    const box = $('#ariaBox'); box.style.background = v ? 'var(--primary)' : 'transparent'; box.style.borderColor = v ? 'var(--primary)' : 'var(--muted)'; box.textContent = v ? '✓' : '';
    log('newsletter: ' + v); summary();
  }
  aria.addEventListener('click', toggleAria);
  aria.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleAria(); } });
  syncAll(); summary();
})();

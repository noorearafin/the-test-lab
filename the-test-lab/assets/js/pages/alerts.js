(function () {
  const { $, log, toast } = window.TB;
  const out = $('#dialogResult'), mout = $('#modalResult');
  const set = (el, msg, ok) => { el.textContent = msg; el.className = 'result' + (ok === true ? ' success' : ok === false ? ' error' : ''); };

  $('#alertBtn').addEventListener('click', () => { alert('This is a simple alert.'); set(out, 'Alert accepted', true); log('alert accepted'); });
  $('#confirmBtn').addEventListener('click', () => { const r = confirm('Do you want to continue?'); set(out, r ? 'You pressed OK' : 'You pressed Cancel', r); log('confirm: ' + r); });
  $('#promptBtn').addEventListener('click', () => {
    const r = prompt('What is your name?', 'Tester');
    if (r === null) { set(out, 'Prompt dismissed', false); log('prompt dismissed'); }
    else { set(out, 'Hello, ' + r + '!', true); log('prompt: ' + r); }
  });
  $('#delayedAlertBtn').addEventListener('click', () => { set(out, 'An alert will open in 3 seconds…'); setTimeout(() => { alert('Delayed alert'); set(out, 'Delayed alert accepted', true); log('delayed alert accepted'); }, 3000); });
  $('#chainedBtn').addEventListener('click', () => { const r = confirm('Step 1: confirm to continue'); alert(r ? 'Step 2: you confirmed' : 'Step 2: you cancelled'); set(out, 'Chained dialogs finished (' + (r ? 'confirmed' : 'cancelled') + ')', r); log('chained dialogs: ' + r); });

  function openModal(id, focusId) { const b = $('#' + id); b.classList.add('open'); setTimeout(() => $('#' + focusId).focus(), 20); log(id.replace('Backdrop', '') + ' modal opened'); }
  function closeModal(id, msg) { $('#' + id).classList.remove('open'); if (msg) set(mout, msg); log(msg || 'modal closed'); }

  $('#openModalBtn').addEventListener('click', () => openModal('subscribeBackdrop', 'modalEmail'));
  $('#autoModalBtn').addEventListener('click', () => { set(mout, 'Modal opens in 2 seconds…'); setTimeout(() => openModal('subscribeBackdrop', 'modalEmail'), 2000); });
  $('#modalCloseBtn').addEventListener('click', () => closeModal('subscribeBackdrop', 'Subscribe modal closed with the close button'));
  $('#modalCancelBtn').addEventListener('click', () => closeModal('subscribeBackdrop', 'Subscribe modal cancelled'));
  $('#modalSubscribeBtn').addEventListener('click', () => {
    const v = $('#modalEmail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { $('#modalEmailError').textContent = 'Enter a valid email address.'; return; }
    $('#modalEmailError').textContent = '';
    closeModal('subscribeBackdrop'); set(mout, 'Subscribed: ' + v, true); toast('Subscribed');
  });

  $('#openDeleteBtn').addEventListener('click', () => { $('#deleteConfirmInput').value = ''; $('#deleteConfirmBtn').disabled = true; openModal('deleteBackdrop', 'deleteConfirmInput'); });
  $('#deleteConfirmInput').addEventListener('input', e => { $('#deleteConfirmBtn').disabled = e.target.value !== 'DELETE'; });
  $('#deleteCancelBtn').addEventListener('click', () => closeModal('deleteBackdrop', 'Account kept'));
  $('#deleteConfirmBtn').addEventListener('click', () => { closeModal('deleteBackdrop'); set(mout, 'Account deleted', true); log('account deleted'); });

  ['subscribeBackdrop', 'deleteBackdrop'].forEach(id => $('#' + id).addEventListener('click', e => { if (e.target.id === id) closeModal(id, 'Modal closed by clicking the backdrop'); }));
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    ['subscribeBackdrop', 'deleteBackdrop'].forEach(id => { if ($('#' + id).classList.contains('open')) closeModal(id, 'Modal closed with Escape'); });
  });
})();

(function () {
  const { $, log } = window.TB;
  let opened = 0, popup = null;
  const out = $('#windowResult');
  const bump = () => { $('#openedCount').textContent = ++opened; };
  function open(source, features) {
    const w = window.open('new-window.html?source=' + encodeURIComponent(source), features ? 'tlPopup' : '_blank', features || '');
    if (!w) { out.className = 'result error'; out.textContent = 'The browser blocked the popup. Allow popups for this site and try again.'; return null; }
    bump(); log('opened window: ' + source); return w;
  }
  $('#newTabLink').addEventListener('click', () => { bump(); log('opened window: link'); });
  $('#newTabBtn').addEventListener('click', () => open('javascript'));
  $('#multiTabBtn').addEventListener('click', () => { ['tab-1', 'tab-2', 'tab-3'].forEach(s => open(s)); });
  $('#delayedTabBtn').addEventListener('click', () => { out.textContent = 'A new tab opens in 2 seconds…'; setTimeout(() => open('delayed'), 2000); });
  $('#popupBtn').addEventListener('click', () => { popup = open('popup', 'width=640,height=480,left=120,top=120'); $('#closePopupBtn').disabled = !popup; });
  $('#closePopupBtn').addEventListener('click', () => { if (popup && !popup.closed) popup.close(); $('#closePopupBtn').disabled = true; out.textContent = 'Popup closed from the parent page'; log('popup closed by parent'); });
  window.addEventListener('message', e => {
    if (!e.data || e.data.type !== 'tl-child') return;
    out.className = 'result success'; out.textContent = `Message from child window (${e.data.source}): ${e.data.text}`;
    log('child message: ' + e.data.text);
  });
})();

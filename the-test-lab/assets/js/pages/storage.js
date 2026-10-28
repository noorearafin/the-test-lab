(function () {
  const { $, log, toast } = window.TB;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rowsHtml = obj => { const e = Object.entries(obj); return e.length ? e.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('') : '<tr><td colspan="2" class="muted">Empty</td></tr>'; };
  const readCookies = () => Object.fromEntries(document.cookie.split(';').map(c => c.trim()).filter(Boolean).map(c => { const i = c.indexOf('='); return [decodeURIComponent(c.slice(0, i)), decodeURIComponent(c.slice(i + 1))]; }));
  const readStore = get => { const o = {}; try { const s = get(); for (let i = 0; i < s.length; i++) { const k = s.key(i); if (k !== 'tl-theme') o[k] = s.getItem(k); } } catch (e) { /* storage unavailable */ } return o; };
  function refresh() {
    $('#cookieTable tbody').innerHTML = rowsHtml(readCookies());
    $('#localTable tbody').innerHTML = rowsHtml(readStore(() => localStorage));
    $('#sessionTable tbody').innerHTML = rowsHtml(readStore(() => sessionStorage));
    const consent = readCookies().tl_consent;
    $('#consentBanner').style.display = consent ? 'none' : '';
    $('#consentResult').textContent = consent ? `Consent saved: ${consent}. Clear everything to see the banner again.` : 'No consent cookie yet.';
  }
  const kv = () => [$('#storageKey').value.trim(), $('#storageValue').value];
  $('#setCookieBtn').addEventListener('click', () => { const [k, v] = kv(); if (!k) return; document.cookie = `${encodeURIComponent(k)}=${encodeURIComponent(v)}; path=/; max-age=86400; SameSite=Lax`; refresh(); toast('Cookie set'); log('cookie set: ' + k); });
  $('#setLocalBtn').addEventListener('click', () => { const [k, v] = kv(); if (!k) return; try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } refresh(); toast('localStorage updated'); log('localStorage set: ' + k); });
  $('#setSessionBtn').addEventListener('click', () => { const [k, v] = kv(); if (!k) return; try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } refresh(); toast('sessionStorage updated'); log('sessionStorage set: ' + k); });
  $('#clearAllBtn').addEventListener('click', () => {
    Object.keys(readCookies()).forEach(k => { document.cookie = `${encodeURIComponent(k)}=; path=/; max-age=0`; });
    try { const theme = localStorage.getItem('tl-theme'); localStorage.clear(); if (theme) localStorage.setItem('tl-theme', theme); sessionStorage.clear(); } catch (e) { /* ignore */ }
    refresh(); toast('Storage cleared'); log('all storage cleared');
  });
  const consent = v => { document.cookie = `tl_consent=${v}; path=/; max-age=31536000; SameSite=Lax`; refresh(); log('consent: ' + v); };
  $('#acceptCookiesBtn').addEventListener('click', () => consent('accepted'));
  $('#rejectCookiesBtn').addEventListener('click', () => consent('rejected'));
  refresh();
})();

(function () {
  const { $, log } = window.TB;
  const USERS = { testuser: { pass: 'Test@123', role: 'Tester' }, admin: { pass: 'Admin@123', role: 'Administrator' }, locked: { pass: 'Test@123', locked: true }, slowuser: { pass: 'Test@123', role: 'Tester', delay: 4000 } };
  let fails = 0;
  const err = $('#loginError'), btn = $('#loginBtn');
  const showError = msg => { err.hidden = false; err.textContent = msg; log('login error: ' + msg); };
  try { const saved = localStorage.getItem('tl-remember'); if (saved) { $('#username').value = saved; $('#rememberMe').checked = true; } } catch (e) { /* ignore */ }

  $('#togglePassword').addEventListener('click', () => {
    const p = $('#password'), show = p.type === 'password';
    p.type = show ? 'text' : 'password'; $('#togglePassword').textContent = show ? 'Hide' : 'Show';
    $('#togglePassword').setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });
  $('#forgotLink').addEventListener('click', e => { e.preventDefault(); err.hidden = false; err.className = 'result'; err.textContent = 'Password reset is disabled in this demo. Use the test accounts.'; });

  $('#loginForm').addEventListener('submit', e => {
    e.preventDefault(); err.className = 'result error';
    const u = $('#username').value.trim(), p = $('#password').value;
    if (!u && !p) return showError('Username and password are required.');
    if (!u) return showError('Username is required.');
    if (!p) return showError('Password is required.');
    const acc = USERS[u];
    if (acc && acc.locked && acc.pass === p) return showError('This account has been locked. Contact support.');
    if (!acc || acc.pass !== p) {
      fails++;
      if (fails >= 3) {
        btn.disabled = true; let s = 30;
        showError(`Too many failed attempts. Try again in ${s} seconds.`);
        const t = setInterval(() => { s--; err.textContent = `Too many failed attempts. Try again in ${s} seconds.`; if (s <= 0) { clearInterval(t); btn.disabled = false; fails = 0; err.hidden = true; } }, 1000);
        return;
      }
      return showError(`Invalid username or password. ${3 - fails} attempt(s) left.`);
    }
    err.hidden = true; fails = 0;
    btn.disabled = true; btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px"></span> Signing in…';
    try { if ($('#rememberMe').checked) localStorage.setItem('tl-remember', u); else localStorage.removeItem('tl-remember'); sessionStorage.setItem('tl-session', JSON.stringify({ user: u, role: acc.role, at: Date.now() })); } catch (e2) { /* ignore */ }
    log('login success: ' + u);
    setTimeout(() => { location.href = 'secure.html?user=' + encodeURIComponent(u); }, acc.delay || 600);
  });
})();
(function () {
  if (new URLSearchParams(location.search).get('loggedOut')) {
    const e = document.getElementById('loginError');
    e.hidden = false; e.className = 'result success'; e.textContent = 'You have been logged out.';
    e.dataset.testid = 'login-error';
  }
})();

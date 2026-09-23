(function () {
  const { $, $$, log, toast } = window.TB;
  const form = $('#registrationForm');
  const result = $('#formResult');

  const rules = {
    firstName: v => v.trim() ? '' : 'First name is required.',
    lastName: v => v.trim() ? '' : 'Last name is required.',
    email: v => !v.trim() ? 'Email is required.' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.',
    phone: v => !v || /^[0-9]{10,11}$/.test(v) ? '' : 'Phone must be 10 or 11 digits.',
    password: v => v.length >= 8 ? '' : 'Password must be at least 8 characters.',
    confirmPassword: v => v && v === $('#password').value ? '' : 'Passwords do not match.',
    age: v => !v || (+v >= 18 && +v <= 100) ? '' : 'Age must be between 18 and 100.'
  };
  function validate(name) {
    const el = form.elements[name];
    const msg = rules[name](el.value);
    $('#' + name + 'Error').textContent = msg;
    el.classList.toggle('is-invalid', !!msg);
    el.classList.toggle('is-valid', !msg && !!el.value);
    el.setAttribute('aria-invalid', !!msg);
    return !msg;
  }
  Object.keys(rules).forEach(n => form.elements[n].addEventListener('blur', () => validate(n)));

  $('#password').addEventListener('input', e => {
    const v = e.target.value;
    const score = [v.length >= 8, /[A-Z]/.test(v), /[0-9]/.test(v), /[^A-Za-z0-9]/.test(v)].filter(Boolean).length;
    $('#passwordStrength').textContent = v ? 'Strength: ' + ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'][score] : 'At least 8 characters';
  });
  $('#experience').addEventListener('input', e => { $('#experienceValue').textContent = e.target.value; });
  $('#bio').addEventListener('input', e => { $('#bioCount').textContent = e.target.value.length; });
  $('#enableFieldBtn').addEventListener('click', () => { const f = $('#toggleEditable'); f.disabled = false; f.placeholder = 'Now editable'; f.focus(); log('field enabled'); });

  $('#fillSampleBtn').addEventListener('click', () => {
    const s = { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', phone: '01712345678', password: 'Secret@123', confirmPassword: 'Secret@123', age: '28', website: 'https://example.com' };
    Object.entries(s).forEach(([k, v]) => { form.elements[k].value = v; });
    $('#terms').checked = true;
    log('sample data filled');
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = Object.keys(rules).map(validate).every(Boolean);
    const terms = $('#terms').checked;
    $('#termsError').textContent = terms ? '' : 'You must accept the terms.';
    if (!ok || !terms) {
      result.className = 'result error';
      result.textContent = 'Fix the highlighted fields and try again.';
      const first = form.querySelector('.is-invalid') || $('#terms');
      first.focus();
      log('submit failed: validation errors');
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    delete data.password; delete data.confirmPassword;
    data.richText = $('#richEditor').innerText;
    result.className = 'result success';
    result.innerHTML = '';
    const h = document.createElement('strong'); h.id = 'successMessage'; h.dataset.testid = 'success-message';
    h.textContent = `Account created for ${data.firstName} ${data.lastName}`;
    const pre = document.createElement('pre'); pre.style.cssText = 'margin:8px 0 0;white-space:pre-wrap;font-size:12px';
    pre.id = 'submittedData'; pre.dataset.testid = 'submitted-data'; pre.textContent = JSON.stringify(data, null, 2);
    result.append(h, pre);
    toast('Account created');
    log('form submitted');
  });

  form.addEventListener('reset', () => {
    setTimeout(() => {
      $$('.is-invalid, .is-valid', form).forEach(el => el.classList.remove('is-invalid', 'is-valid'));
      $$('.error', form).forEach(el => { el.textContent = ''; });
      $('#experienceValue').textContent = '3'; $('#bioCount').textContent = '0';
      $('#passwordStrength').textContent = 'At least 8 characters';
      result.className = 'result'; result.textContent = 'Form reset.';
      log('form reset');
    });
  });
})();

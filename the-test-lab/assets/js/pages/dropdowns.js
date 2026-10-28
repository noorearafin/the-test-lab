(function () {
  const { $, $$, log } = window.TB;
  const CITIES = { bd: ['Dhaka', 'Chattogram', 'Sylhet', 'Khulna'], in: ['Delhi', 'Mumbai', 'Bengaluru'], us: ['New York', 'San Francisco', 'Austin'], gb: ['London', 'Manchester'], de: ['Berlin', 'Munich'], jp: ['Tokyo', 'Osaka'], au: ['Sydney', 'Melbourne'] };
  const CURRENCIES = ['BDT - Bangladeshi Taka', 'USD - US Dollar', 'EUR - Euro', 'GBP - British Pound', 'INR - Indian Rupee', 'JPY - Japanese Yen', 'AUD - Australian Dollar', 'CAD - Canadian Dollar', 'SGD - Singapore Dollar', 'AED - UAE Dirham'];
  const state = { framework: '', currency: '' };

  function summary() {
    const langs = Array.from($('#languages').selectedOptions).map(o => o.text);
    $('#dropdownResult').textContent =
      `Country: ${$('#country').value ? $('#country').selectedOptions[0].text : 'none'} | City: ${$('#city').value || 'none'} | Vehicle: ${$('#vehicle').value} | Sort: ${$('#sortBy').value} | Languages: ${langs.join(', ') || 'none'} | Framework: ${state.framework || 'none'} | Currency: ${state.currency || 'none'} | Browser: ${$('#browserInput').value || 'none'}`;
    $('#languageChips').innerHTML = langs.length ? langs.map(l => `<span class="badge badge-success">${l}</span>`).join('') : '<span class="muted small">Nothing selected</span>';
  }

  $('#country').addEventListener('change', e => {
    const city = $('#city'), list = CITIES[e.target.value];
    city.disabled = !list;
    city.innerHTML = list ? '<option value="">Select a city</option>' + list.map(c => `<option value="${c}">${c}</option>`).join('') : '<option value="">Select a country first</option>';
    log('country selected: ' + (e.target.value || 'none')); summary();
  });
  ['#city', '#vehicle', '#sortBy', '#languages', '#browserInput'].forEach(s => $(s).addEventListener('change', () => { log(s.slice(1) + ' changed'); summary(); }));
  $('#clearLanguages').addEventListener('click', () => { Array.from($('#languages').options).forEach(o => { o.selected = false; }); log('languages cleared'); summary(); });

  // Custom listbox
  const trigger = $('#frameworkTrigger'), menu = $('#frameworkMenu');
  const setOpen = open => { menu.hidden = !open; trigger.setAttribute('aria-expanded', open); };
  trigger.addEventListener('click', () => setOpen(menu.hidden));
  $$('#frameworkMenu [role="option"]').forEach(o => o.addEventListener('click', () => {
    $$('#frameworkMenu [role="option"]').forEach(x => x.setAttribute('aria-selected', x === o));
    state.framework = o.dataset.value; $('#frameworkValue').textContent = o.textContent;
    setOpen(false); log('framework selected: ' + o.dataset.value); summary();
  }));

  // Searchable
  const sInput = $('#searchableInput'), sMenu = $('#searchableMenu');
  let active = -1;
  function renderOptions() {
    const q = sInput.value.toLowerCase();
    const items = CURRENCIES.filter(c => c.toLowerCase().includes(q));
    sMenu.innerHTML = items.length ? items.map((c, i) => `<li role="option" data-testid="currency-option" id="currency-${i}">${c}</li>`).join('') : '<li class="muted" aria-disabled="true">No currency matches</li>';
    sMenu.hidden = false; sInput.setAttribute('aria-expanded', 'true'); active = -1;
  }
  sInput.addEventListener('focus', renderOptions);
  sInput.addEventListener('input', renderOptions);
  sInput.addEventListener('keydown', e => {
    const opts = $$('[role="option"]', sMenu);
    if (!opts.length) return;
    if (e.key === 'ArrowDown') active = (active + 1) % opts.length;
    else if (e.key === 'ArrowUp') active = (active - 1 + opts.length) % opts.length;
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); opts[active].click(); return; }
    else if (e.key === 'Escape') { sMenu.hidden = true; return; }
    else return;
    opts.forEach((o, i) => o.classList.toggle('active', i === active));
    sInput.setAttribute('aria-activedescendant', opts[active].id);
  });
  sMenu.addEventListener('click', e => {
    const o = e.target.closest('[role="option"]'); if (!o) return;
    sInput.value = o.textContent; state.currency = o.textContent.slice(0, 3);
    sMenu.hidden = true; sInput.setAttribute('aria-expanded', 'false');
    log('currency selected: ' + state.currency); summary();
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#frameworkDropdown')) setOpen(false);
    if (!e.target.closest('.combo')) { sMenu.hidden = true; sInput.setAttribute('aria-expanded', 'false'); }
  });
  summary();
})();

(function () {
  const { $, $$, log, toast } = window.TB;
  const out = msg => { const r = $('#widgetResult'); r.className = 'result success'; r.textContent = msg; };
  const tabs = $$('#demoTabs [role="tab"]');
  function select(t, focus) {
    tabs.forEach(x => { const s = x === t; x.setAttribute('aria-selected', s); x.tabIndex = s ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !s; });
    if (focus) t.focus(); out('Tab selected: ' + t.textContent); log('tab: ' + t.textContent);
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => { const n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key]; if (n !== undefined) { e.preventDefault(); select(tabs[(n + tabs.length) % tabs.length], true); } });
  });
  $$('#faq details').forEach(d => d.addEventListener('toggle', () => { out(`${d.querySelector('summary').textContent} ${d.open ? 'expanded' : 'collapsed'}`); log(d.id + (d.open ? ' opened' : ' closed')); }));

  const CITIES = ['Dhaka', 'Chattogram', 'Khulna', 'Rajshahi', 'Sylhet', 'Barishal', 'Rangpur', 'Mymensingh', 'Delhi', 'Dubai', 'Doha', 'Dublin', 'London', 'Lisbon', 'Tokyo', 'Toronto', 'Sydney', 'Singapore', 'Berlin', 'Bangkok'];
  const ac = $('#cityAutocomplete'), sug = $('#citySuggestions'); let idx = -1;
  const close = () => { sug.hidden = true; ac.setAttribute('aria-expanded', 'false'); idx = -1; };
  ac.addEventListener('input', () => {
    const q = ac.value.trim().toLowerCase();
    if (q.length < 2) return close();
    const m = CITIES.filter(c => c.toLowerCase().startsWith(q));
    sug.innerHTML = m.length ? m.map((c, i) => `<li role="option" class="suggestion" id="suggestion-${i}" data-testid="suggestion">${c}</li>`).join('') : '<li class="muted" aria-disabled="true" id="noSuggestions" data-testid="no-suggestions">No cities found</li>';
    sug.hidden = false; ac.setAttribute('aria-expanded', 'true'); idx = -1;
  });
  ac.addEventListener('keydown', e => {
    const opts = $$('.suggestion', sug); if (!opts.length || sug.hidden) return;
    if (e.key === 'ArrowDown') idx = (idx + 1) % opts.length; else if (e.key === 'ArrowUp') idx = (idx - 1 + opts.length) % opts.length;
    else if (e.key === 'Enter' && idx >= 0) { e.preventDefault(); opts[idx].click(); return; } else if (e.key === 'Escape') return close(); else return;
    e.preventDefault(); opts.forEach((o, i) => o.classList.toggle('active', i === idx)); ac.setAttribute('aria-activedescendant', opts[idx].id);
  });
  sug.addEventListener('click', e => { const o = e.target.closest('.suggestion'); if (!o) return; ac.value = o.textContent; close(); out('City selected: ' + o.textContent); log('autocomplete: ' + o.textContent); });
  document.addEventListener('click', e => { if (!e.target.closest('.combo')) close(); });

  const labels = ['Not rated', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']; let rating = 0;
  $('#rating').innerHTML = [1, 2, 3, 4, 5].map(n => `<button type="button" role="radio" aria-checked="false" aria-label="${n} star${n > 1 ? 's' : ''}" data-value="${n}" data-testid="star-${n}" id="star${n}">★</button>`).join('');
  const paint = n => $$('#rating button').forEach(b => { b.classList.toggle('on', +b.dataset.value <= n); b.setAttribute('aria-checked', +b.dataset.value === rating); });
  $('#rating').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; rating = +b.dataset.value; paint(rating); $('#ratingText').textContent = `${rating} / 5 – ${labels[rating]}`; out('Rated ' + rating + ' stars'); log('rating: ' + rating); });
  $('#rating').addEventListener('mouseover', e => { const b = e.target.closest('button'); if (b) paint(+b.dataset.value); });
  $('#rating').addEventListener('mouseleave', () => paint(rating));

  let qty = 1; const q = $('#qtyValue');
  const setQty = v => { qty = Math.max(1, Math.min(10, v)); q.textContent = qty; $('#qtyMinus').disabled = qty === 1; $('#qtyPlus').disabled = qty === 10; log('quantity: ' + qty); };
  $('#qtyMinus').addEventListener('click', () => setQty(qty - 1)); $('#qtyPlus').addEventListener('click', () => setQty(qty + 1)); $('#qtyMinus').disabled = true;

  // Date picker
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  function renderCal() {
    $('#monthLabel').textContent = view.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const first = view.getDay(), days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    let h = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => `<span class="muted small" style="padding:4px 0">${d}</span>`).join('');
    h += '<span></span>'.repeat(first);
    for (let d = 1; d <= days; d++) {
      const date = new Date(view.getFullYear(), view.getMonth(), d), past = date < today, isToday = +date === +today;
      h += `<button type="button" class="btn btn-sm ${isToday ? 'btn-secondary' : 'btn-ghost'}" style="padding:6px 0;color:${past ? 'var(--muted)' : 'var(--ink)'}" data-date="${iso(date)}" ${past ? 'disabled' : ''}>${d}</button>`;
    }
    $('#calendarGrid').innerHTML = h;
  }
  const cal = $('#calendar');
  $('#dateInput').addEventListener('click', () => { cal.hidden = !cal.hidden; if (!cal.hidden) renderCal(); });
  $('#prevMonth').addEventListener('click', () => { view.setMonth(view.getMonth() - 1); renderCal(); });
  $('#nextMonth').addEventListener('click', () => { view.setMonth(view.getMonth() + 1); renderCal(); });
  $('#calendarGrid').addEventListener('click', e => { const b = e.target.closest('button[data-date]'); if (!b) return; $('#dateInput').value = b.dataset.date; cal.hidden = true; out('Date selected: ' + b.dataset.date); log('date: ' + b.dataset.date); });
  document.addEventListener('click', e => { if (!e.target.closest('#calendar') && e.target.id !== 'dateInput') cal.hidden = true; });

  $('#toastBtn').addEventListener('click', () => { toast('Settings saved successfully'); log('toast shown'); });
  $('#bannerBtn').addEventListener('click', () => { $('#alertBanner').hidden = false; $('#alertBanner').style.display = 'flex'; log('banner shown'); });
  $('#closeBannerBtn').addEventListener('click', () => { $('#alertBanner').hidden = true; $('#alertBanner').style.display = 'none'; log('banner dismissed'); });
  $('#alertBanner').style.display = 'none';
})();

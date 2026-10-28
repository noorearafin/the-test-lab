(function () {
  const { $, $$, log, toast } = window.TB;
  const FIRST = ['Aisha', 'Rahim', 'Karim', 'Nadia', 'John', 'Priya', 'Liam', 'Sofia', 'Tanvir', 'Mei', 'Omar', 'Elena', 'Farhan', 'Grace', 'Hasan', 'Ivy', 'Jamal', 'Kavya', 'Leo', 'Maya', 'Nabil', 'Olga', 'Pablo', 'Rafi', 'Sara', 'Tomas', 'Uma', 'Victor', 'Wei', 'Yasmin', 'Zara', 'Arif'];
  const LAST = ['Khan', 'Rahman', 'Smith', 'Das', 'Chen', 'Garcia', 'Ahmed', 'Patel', 'Silva', 'Novak'];
  const DEPTS = ['Engineering', 'QA', 'Design', 'Sales', 'HR'];
  let rows = FIRST.map((f, i) => {
    const l = LAST[(i * 3) % LAST.length];
    return { id: 1001 + i, name: `${f} ${l}`, email: `${f}.${l}`.toLowerCase() + '@testlab.dev', dept: DEPTS[i % 5], salary: 35000 + ((i * 7919) % 60) * 1000, active: i % 4 !== 0 };
  });
  let sortKey = 'id', sortDir = 1, page = 1, editingId = null;
  const out = $('#tableResult');

  function filtered() {
    const q = $('#tableSearch').value.toLowerCase(), d = $('#deptFilter').value;
    return rows.filter(r => (!d || r.dept === d) && (r.name.toLowerCase().includes(q) || r.email.includes(q) || r.dept.toLowerCase().includes(q)))
      .sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : a[sortKey] < b[sortKey] ? -1 : 0) * sortDir);
  }
  function render() {
    const size = +$('#pageSize').value, all = filtered(), pages = Math.max(1, Math.ceil(all.length / size));
    page = Math.min(page, pages);
    const slice = all.slice((page - 1) * size, page * size);
    $('#employeeBody').innerHTML = slice.length ? slice.map(r => `
      <tr data-row-id="${r.id}" data-testid="row-${r.id}">
        <td><input type="checkbox" class="row-check" data-testid="row-check-${r.id}" aria-label="Select ${r.name}"></td>
        <td>${r.id}</td><td>${r.name}</td><td>${r.email}</td><td>${r.dept}</td><td>${r.salary.toLocaleString('en-US')}</td>
        <td><span class="badge ${r.active ? 'badge-success' : 'badge-danger'}">${r.active ? 'Active' : 'Inactive'}</span></td>
        <td><div class="row" style="gap:4px;flex-wrap:nowrap"><button class="btn btn-ghost btn-sm" data-action="edit" data-testid="edit-${r.id}">Edit</button><button class="btn btn-ghost btn-sm" data-action="delete" data-testid="delete-${r.id}" style="color:var(--danger)">Delete</button></div></td>
      </tr>`).join('') : '<tr><td colspan="8" class="muted" style="text-align:center;padding:28px" id="noResults" data-testid="no-results">No employees match your search. Clear the filters to see everyone.</td></tr>';
    const start = all.length ? (page - 1) * size + 1 : 0;
    $('#pageInfo').textContent = `Showing ${start}–${(page - 1) * size + slice.length} of ${all.length} employees`;
    let btns = `<button id="prevPage" data-testid="prev-page" ${page === 1 ? 'disabled' : ''} aria-label="Previous page">‹</button>`;
    for (let i = 1; i <= pages; i++) btns += `<button data-page="${i}" data-testid="page-${i}" ${i === page ? 'aria-current="page"' : ''}>${i}</button>`;
    btns += `<button id="nextPage" data-testid="next-page" ${page === pages ? 'disabled' : ''} aria-label="Next page">›</button>`;
    $('#pagerButtons').innerHTML = btns;
    $$('th.sortable').forEach(th => { if (th.dataset.key === sortKey) { th.setAttribute('aria-sort', sortDir > 0 ? 'ascending' : 'descending'); th.querySelector('.sort-ind').textContent = sortDir > 0 ? '↑' : '↓'; } else { th.removeAttribute('aria-sort'); th.querySelector('.sort-ind').textContent = '↕'; } });
    $('#selectAllRows').checked = false; updateBulk();
  }
  function updateBulk() { $('#deleteSelectedBtn').disabled = !$$('.row-check:checked').length; }

  $('#pagerButtons').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    page = b.id === 'prevPage' ? page - 1 : b.id === 'nextPage' ? page + 1 : +b.dataset.page;
    render(); log('page ' + page);
  });
  $$('th.sortable').forEach(th => th.addEventListener('click', () => { const k = th.dataset.key; sortDir = sortKey === k ? -sortDir : 1; sortKey = k; render(); log(`sorted by ${k} ${sortDir > 0 ? 'ascending' : 'descending'}`); }));
  let t; $('#tableSearch').addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { page = 1; render(); log('search: ' + $('#tableSearch').value); }, 250); });
  $('#deptFilter').addEventListener('change', () => { page = 1; render(); log('department filter: ' + ($('#deptFilter').value || 'all')); });
  $('#pageSize').addEventListener('change', () => { page = 1; render(); log('page size ' + $('#pageSize').value); });
  $('#selectAllRows').addEventListener('change', e => { $$('.row-check').forEach(c => { c.checked = e.target.checked; }); updateBulk(); });
  $('#employeeBody').addEventListener('change', e => { if (e.target.classList.contains('row-check')) updateBulk(); });
  $('#deleteSelectedBtn').addEventListener('click', () => {
    const ids = $$('.row-check:checked').map(c => +c.closest('tr').dataset.rowId);
    if (!confirm(`Delete ${ids.length} employee(s)?`)) return;
    rows = rows.filter(r => !ids.includes(r.id)); render();
    out.className = 'result success'; out.textContent = `Deleted ${ids.length} employee(s): ${ids.join(', ')}`; log('bulk delete ' + ids.join(','));
  });
  $('#employeeBody').addEventListener('click', e => {
    const b = e.target.closest('button[data-action]'); if (!b) return;
    const id = +b.closest('tr').dataset.rowId, r = rows.find(x => x.id === id);
    if (b.dataset.action === 'delete') {
      if (!confirm(`Delete ${r.name}?`)) return;
      rows = rows.filter(x => x.id !== id); render();
      out.className = 'result success'; out.textContent = `Deleted employee ${id} (${r.name})`; log('deleted ' + id);
    } else openForm(r);
  });

  function openForm(r) {
    editingId = r ? r.id : null;
    $('#employeeModalTitle').textContent = r ? `Edit employee ${r.id}` : 'Add employee';
    $('#empName').value = r ? r.name : ''; $('#empEmail').value = r ? r.email : '';
    $('#empDept').value = r ? r.dept : 'Engineering'; $('#empSalary').value = r ? r.salary : 50000; $('#empActive').checked = r ? r.active : true;
    $('#employeeError').textContent = '';
    $('#employeeBackdrop').classList.add('open'); setTimeout(() => $('#empName').focus(), 20);
  }
  const closeForm = () => $('#employeeBackdrop').classList.remove('open');
  $('#addEmployeeBtn').addEventListener('click', () => openForm(null));
  $('#employeeCloseBtn').addEventListener('click', closeForm);
  $('#employeeCancelBtn').addEventListener('click', closeForm);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeForm(); });
  $('#employeeForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#empName').value.trim(), email = $('#empEmail').value.trim();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $('#employeeError').textContent = 'Enter a name and a valid email address.'; return; }
    const data = { name, email, dept: $('#empDept').value, salary: +$('#empSalary').value || 0, active: $('#empActive').checked };
    const existing = editingId && rows.find(r => r.id === editingId);
    if (existing) { Object.assign(existing, data); out.textContent = `Updated employee ${editingId}`; log('updated ' + editingId); }
    else { const id = Math.max(1000, ...rows.map(r => r.id)) + 1; rows.push({ id, ...data }); out.textContent = `Added employee ${id} (${name})`; log('added ' + id); }
    out.className = 'result success'; closeForm(); render(); toast('Employee saved');
  });
  render();
})();

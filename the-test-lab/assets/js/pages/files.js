(function () {
  const { $, log, toast } = window.TB;
  const out = $('#uploadResult');
  const fmt = b => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
  const describe = files => Array.from(files).map(f => `${f.name} (${fmt(f.size)})`).join(', ');

  $('#singleUpload').addEventListener('change', e => { out.className = 'result'; out.textContent = 'Selected: ' + (describe(e.target.files) || 'none'); log('single file selected'); });
  $('#multiUpload').addEventListener('change', e => {
    const bad = Array.from(e.target.files).filter(f => !/\.(png|jpe?g)$/i.test(f.name) || f.size > 2 * 1048576);
    if (bad.length) { out.className = 'result error'; out.textContent = 'Rejected: ' + bad.map(f => f.name).join(', ') + '. Only PNG or JPG up to 2 MB.'; e.target.value = ''; log('multi upload rejected'); return; }
    out.className = 'result'; out.textContent = `${e.target.files.length} image(s) selected: ${describe(e.target.files)}`; log('multi files selected');
  });
  $('#hiddenUploadTrigger').addEventListener('click', () => $('#hiddenUpload').click());
  $('#hiddenUpload').addEventListener('change', e => { $('#hiddenUploadName').textContent = describe(e.target.files) || 'No file selected'; log('hidden input file selected'); });

  $('#uploadBtn').addEventListener('click', () => {
    const files = [...$('#singleUpload').files, ...$('#multiUpload').files, ...$('#hiddenUpload').files];
    if (!files.length) { out.className = 'result error'; out.textContent = 'Choose at least one file before uploading.'; return; }
    let p = 0; const bar = $('#uploadProgressBar'), pr = $('#uploadProgress');
    $('#uploadBtn').disabled = true;
    const timer = setInterval(() => {
      p += 5; bar.style.width = p + '%'; pr.setAttribute('aria-valuenow', p);
      if (p >= 100) { clearInterval(timer); $('#uploadBtn').disabled = false; out.className = 'result success'; out.innerHTML = ''; const s = document.createElement('span'); s.id = 'uploadSuccess'; s.dataset.testid = 'upload-success'; s.textContent = `Uploaded ${files.length} file(s): ${describe(files)}`; out.appendChild(s); toast('Upload complete'); log('upload complete'); }
    }, 60);
  });
  $('#clearUploadBtn').addEventListener('click', () => { ['#singleUpload', '#multiUpload', '#hiddenUpload'].forEach(s => { $(s).value = ''; }); $('#hiddenUploadName').textContent = 'No file selected'; $('#uploadProgressBar').style.width = '0'; $('#uploadProgress').setAttribute('aria-valuenow', 0); out.className = 'result'; out.textContent = 'No file chosen.'; log('uploads cleared'); });

  const zone = $('#dropZone'), list = $('#droppedFiles');
  const showDropped = files => { list.innerHTML = Array.from(files).map(f => `<li data-testid="dropped-file">${f.name} (${fmt(f.size)})</li>`).join(''); zone.classList.add('done'); zone.innerHTML = `<strong>${files.length} file(s) received</strong><span class="small">Drop more to replace</span>`; log('files dropped: ' + files.length); };
  ['dragenter', 'dragover'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('over'); }));
  zone.addEventListener('dragleave', () => zone.classList.remove('over'));
  zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('over'); if (e.dataTransfer.files.length) showDropped(e.dataTransfer.files); });
  zone.addEventListener('click', () => $('#dropZoneInput').click());
  zone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('#dropZoneInput').click(); } });
  $('#dropZoneInput').addEventListener('change', e => { if (e.target.files.length) showDropped(e.target.files); });

  const dOut = $('#downloadResult');
  function download(name, content, type) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    dOut.className = 'result success'; dOut.textContent = 'Download started: ' + name; log('download: ' + name);
  }
  ['#downloadTxt', '#downloadJson'].forEach(s => $(s).addEventListener('click', () => { dOut.className = 'result success'; dOut.textContent = 'Download started: ' + $(s).getAttribute('download'); log('download: ' + $(s).getAttribute('download')); }));
  const csv = () => 'id,name,department,score\n1,Aisha Khan,QA,92\n2,Rahim Das,Engineering,88\n3,Priya Patel,Design,95\n';
  $('#downloadCsvBtn').addEventListener('click', () => download('report.csv', csv(), 'text/csv'));
  $('#delayedDownloadBtn').addEventListener('click', () => { dOut.className = 'result'; dOut.textContent = 'Preparing file…'; setTimeout(() => download('delayed-report.csv', csv(), 'text/csv'), 3000); });
})();

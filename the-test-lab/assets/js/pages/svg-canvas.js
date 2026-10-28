(function () {
  const { $, $$, log } = window.TB;
  $$('#svgStage .shape').forEach(s => s.addEventListener('click', () => {
    $$('#svgStage .shape').forEach(x => x.classList.toggle('selected', x === s));
    const r = $('#svgResult'); r.className = 'result success'; r.textContent = 'You clicked the ' + s.dataset.name; log('svg: ' + s.dataset.name);
  }));

  const data = [['Jan', 42], ['Feb', 68], ['Mar', 55], ['Apr', 90], ['May', 76], ['Jun', 120]];
  const svg = $('#barChart'), max = 130, w = 50, gap = 26, x0 = 50;
  let html = '<line x1="40" y1="180" x2="470" y2="180" stroke="currentColor" opacity=".25"/>';
  data.forEach(([m, v], i) => {
    const h = v / max * 150, x = x0 + i * (w + gap);
    html += `<rect class="shape bar" data-month="${m}" data-value="${v}" data-testid="bar-${m.toLowerCase()}" x="${x}" y="${180 - h}" width="${w}" height="${h}" rx="4" fill="#3B3FD8"/>`;
    html += `<text x="${x + w / 2}" y="200" text-anchor="middle" font-size="12" fill="currentColor">${m}</text>`;
  });
  svg.innerHTML = html;
  const tip = $('#chartTooltip');
  $$('#barChart .bar').forEach(b => {
    b.addEventListener('mouseenter', () => {
      const sr = svg.getBoundingClientRect(), br = b.getBoundingClientRect();
      tip.textContent = `${b.dataset.month}: ${b.dataset.value} test runs`;
      tip.style.left = (br.left - sr.left + br.width / 2) + 'px'; tip.style.top = (br.top - sr.top - 34) + 'px';
      tip.style.opacity = 1; tip.style.visibility = 'visible'; log('bar hover: ' + b.dataset.month);
    });
    b.addEventListener('mouseleave', () => { tip.style.opacity = 0; tip.style.visibility = 'hidden'; });
  });

  const c = $('#drawCanvas'), ctx = c.getContext('2d');
  let drawing = false, strokes = 0;
  const pos = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * c.width / r.width, (e.clientY - r.top) * c.height / r.height]; };
  c.addEventListener('pointerdown', e => {
    drawing = true; c.setPointerCapture(e.pointerId);
    ctx.strokeStyle = $('#brushColor').value; ctx.lineWidth = +$('#brushSize').value * 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(...pos(e));
  });
  c.addEventListener('pointermove', e => { if (!drawing) return; ctx.lineTo(...pos(e)); ctx.stroke(); });
  const end = () => { if (!drawing) return; drawing = false; $('#strokeCount').textContent = ++strokes; log('stroke drawn'); };
  c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
  $('#clearCanvasBtn').addEventListener('click', () => { ctx.clearRect(0, 0, c.width, c.height); strokes = 0; $('#strokeCount').textContent = 0; log('canvas cleared'); });
})();

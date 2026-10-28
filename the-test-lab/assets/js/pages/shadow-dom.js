(function () {
  const { log } = window.TB;
  const report = msg => { const r = document.getElementById('shadowResult'); r.className = 'result success'; r.textContent = msg; log(msg); };
  const STYLE = `<style>
    :host { display: block; font-family: var(--font); color: var(--ink); }
    .box { border: 1px solid var(--line); border-radius: 10px; padding: 16px; background: var(--surface-2); }
    input { font: inherit; padding: 9px 11px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); color: var(--ink); min-width: 220px; }
    button { font: 600 14px var(--font); padding: 9px 14px; border: 0; border-radius: 6px; background: var(--primary); color: var(--primary-ink); cursor: pointer; }
    .row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    p { margin: 0 0 10px; font-size: 14px; color: var(--muted); }
  </style>`;

  class SignupCard extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `${STYLE}<div class="box"><p id="shadowTitle" data-testid="shadow-title">Join the The Test Lab newsletter</p>
        <div class="row"><input id="shadowEmail" data-testid="shadow-email" type="email" placeholder="you@example.com" aria-label="Email"><button id="shadowSubmit" data-testid="shadow-submit">Sign up</button></div>
        <p id="shadowMessage" data-testid="shadow-message" style="margin:10px 0 0"></p></div>`;
      root.getElementById('shadowSubmit').addEventListener('click', () => {
        const v = root.getElementById('shadowEmail').value.trim();
        const msg = root.getElementById('shadowMessage');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { msg.style.color = 'var(--danger)'; msg.textContent = 'Enter a valid email address.'; return; }
        msg.style.color = 'var(--success)'; msg.textContent = 'Thanks! ' + v + ' is signed up.';
        report('Shadow form submitted: ' + v);
      });
    }
  }
  class UserBadge extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `${STYLE}<div class="row" style="margin-top:12px"><span id="badgeText" data-testid="badge-text" style="font-size:14px">Level 3 tester</span><button id="badgeBtn" data-testid="badge-btn">Level up</button></div>`;
      let level = 3;
      root.getElementById('badgeBtn').addEventListener('click', () => { level++; root.getElementById('badgeText').textContent = `Level ${level} tester`; report('Nested shadow button clicked: level ' + level); });
    }
  }
  class UserPanel extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `${STYLE}<div class="box"><p id="panelTitle" data-testid="panel-title" style="font-weight:600;color:var(--ink)">Outer shadow root: user panel</p>
        <input id="panelName" data-testid="panel-name" value="Aisha Rahman" aria-label="Display name"><tl-user-badge id="badgeHost" data-testid="badge-host"></tl-user-badge></div>`;
    }
  }
  class ClosedWidget extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'closed' });
      root.innerHTML = `${STYLE}<div class="box"><p>This content lives in a closed shadow root.</p><button id="closedBtn">Press me</button></div>`;
      root.getElementById('closedBtn').addEventListener('click', () => report('Closed shadow button clicked'));
    }
  }
  customElements.define('tl-signup-card', SignupCard);
  customElements.define('tl-user-badge', UserBadge);
  customElements.define('tl-user-panel', UserPanel);
  customElements.define('tl-closed-widget', ClosedWidget);
})();

(function () {
  const { $, $$, PAGES, GROUPS, pageUrl, icon, toast, REPO_URL } = window.TB;

  // Keep the clone command in step 1 in sync with the repository URL
  const cloneCmd = $('#cloneCommand');
  if (cloneCmd) cloneCmd.textContent = 'git clone ' + REPO_URL + '.git';

  // Component cards grouped by category
  $('#categoryGroups').innerHTML = GROUPS.map(g => `
    <h3 class="group-title">${g}</h3>
    <div class="cat-grid">
      ${PAGES.filter(p => p.group === g).map(p => `
        <a class="cat-card" href="${pageUrl(p.slug)}" data-testid="card-${p.slug}">
          <span class="cat-icon">${icon(p.icon)}</span>
          <span><h3>${p.title}</h3><p>${p.desc}</p></span>
        </a>`).join('')}
    </div>`).join('');

  // Code samples
  const k = s => `<span class="tok-k">${s}</span>`, s = t => `<span class="tok-s">${t}</span>`,
        f = t => `<span class="tok-f">${t}</span>`, c = t => `<span class="tok-c">${t}</span>`;
  const SAMPLES = {
    playwright: `${k('import')} { test, expect } ${k('from')} ${s("'@playwright/test'")};

${f('test')}(${s("'user can log in'")}, ${k('async')} ({ page }) => {
  ${k('await')} page.${f('goto')}(${s("'/pages/login.html'")});
  ${k('await')} page.${f('getByTestId')}(${s("'username'")}).${f('fill')}(${s("'testuser'")});
  ${k('await')} page.${f('getByTestId')}(${s("'password'")}).${f('fill')}(${s("'Test@123'")});
  ${k('await')} page.${f('getByRole')}(${s("'button'")}, { name: ${s("'Log in'")} }).${f('click')}();

  ${c('// Lands on the secure page')}
  ${k('await')} ${f('expect')}(page).${f('toHaveURL')}(${s('/secure/')});
  ${k('await')} ${f('expect')}(page.${f('getByTestId')}(${s("'welcome-msg'")}))
    .${f('toContainText')}(${s("'testuser'")});
});`,
    selenium: `${k('from')} selenium ${k('import')} webdriver
${k('from')} selenium.webdriver.common.by ${k('import')} By
${k('from')} selenium.webdriver.support.ui ${k('import')} WebDriverWait
${k('from')} selenium.webdriver.support ${k('import')} expected_conditions ${k('as')} EC

driver = webdriver.${f('Chrome')}()
driver.${f('get')}(${s('"http://localhost:3000/pages/login.html"')})

driver.${f('find_element')}(By.ID, ${s('"username"')}).${f('send_keys')}(${s('"testuser"')})
driver.${f('find_element')}(By.ID, ${s('"password"')}).${f('send_keys')}(${s('"Test@123"')})
driver.${f('find_element')}(By.ID, ${s('"loginBtn"')}).${f('click')}()

${c('# Wait for the secure page')}
msg = WebDriverWait(driver, ${s('10')}).${f('until')}(
    EC.${f('visibility_of_element_located')}((By.ID, ${s('"welcomeMsg"')})))
${k('assert')} ${s('"testuser"')} ${k('in')} msg.text
driver.${f('quit')}()`,
    cypress: `${f('describe')}(${s("'Login'")}, () => {
  ${f('it')}(${s("'logs in with valid credentials'")}, () => {
    cy.${f('visit')}(${s("'/pages/login.html'")});
    cy.${f('get')}(${s(`'[data-testid="username"]'`)}).${f('type')}(${s("'testuser'")});
    cy.${f('get')}(${s(`'[data-testid="password"]'`)}).${f('type')}(${s("'Test@123'")});
    cy.${f('contains')}(${s("'button'")}, ${s("'Log in'")}).${f('click')}();

    ${c('// Assert on the secure page')}
    cy.${f('url')}().${f('should')}(${s("'include'")}, ${s("'secure'")});
    cy.${f('get')}(${s(`'[data-testid="welcome-msg"]'`)})
      .${f('should')}(${s("'contain'")}, ${s("'testuser'")});
  });
});`
  };
  const tabs = $$('.code-tabs [role="tab"]');
  function show(tab) {
    tabs.forEach(t => t.setAttribute('aria-selected', t === tab));
    $('#codeSample').innerHTML = SAMPLES[tab.dataset.lang];
    $('#codeSample').setAttribute('aria-labelledby', tab.id);
  }
  tabs.forEach(t => t.addEventListener('click', () => show(t)));
  show(tabs[0]);

  // Copy buttons on commands
  $$('[data-copy]').forEach(btn => {
    btn.innerHTML = icon('copy');
    btn.addEventListener('click', () => {
      const text = btn.previousElementSibling.textContent;
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => toast('Command copied'));
      else toast('Select the command to copy it');
    });
  });
})();

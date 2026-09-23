describe('The Test Lab', () => {
  it('logs in with valid credentials', () => {
    cy.visit('/pages/login.html');
    cy.get('[data-testid="username"]').type('testuser');
    cy.get('[data-testid="password"]').type('Test@123');
    cy.contains('button', 'Log in').click();
    cy.url().should('include', 'secure.html');
    cy.get('[data-testid="welcome-msg"]').should('have.text', 'Welcome back, testuser!');
  });

  it('accepts a confirm dialog', () => {
    cy.visit('/pages/alerts.html');
    cy.on('window:confirm', () => true);
    cy.get('#confirmBtn').click();
    cy.get('#dialogResult').should('have.text', 'You pressed OK');
  });

  it('filters the employee table', () => {
    cy.visit('/pages/tables.html');
    cy.get('#deptFilter').select('QA');
    cy.get('#employeeBody tr').each($row => cy.wrap($row).find('td').eq(4).should('have.text', 'QA'));
  });

  it('types into a shadow DOM input', () => {
    cy.visit('/pages/shadow-dom.html');
    cy.get('#shadowEmail').type('me@example.com');
    cy.get('#shadowSubmit').click();
    cy.get('#shadowResult').should('contain', 'me@example.com');
  });
});

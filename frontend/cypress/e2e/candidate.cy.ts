describe('Candidate Management E2E', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('#username').clear().type('admin');
    cy.get('#password').clear().type('admin');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/');
  });

  it('should complete the full lifecycle of a candidate', () => {
    const email = `test-${Date.now()}@example.com`;

    // 1. Create
    cy.contains('Add Candidate').click();
    cy.get('input[name="firstName"]').type('Cypress');
    cy.get('input[name="lastName"]').type('Test');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="phone"]').type('1234567890');
    cy.get('button[type="submit"]').click();

    cy.contains(email).should('be.visible');

    // 2. View Detail & Validate
    cy.contains(email).click();
    cy.contains('pending').should('be.visible');
    cy.contains('Validate Candidate').click();
    
    // Wait for the simulated delay (2s)
    cy.wait(3000); 
    cy.contains('validated').should('be.visible');

    // 3. Delete
    cy.contains('Delete').click();
    // Confirm dialog
    cy.on('window:confirm', () => true);
    
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains(email).should('not.exist');
  });
});

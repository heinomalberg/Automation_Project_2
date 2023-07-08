describe('Deleting created Issue', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
    });
  })

  it('Should successfully delete issue', () => {
    // Start deletion by clicking "Trash" button
    cy.get('[data-testid="icon:trash"]').should('be.visible').click();
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    // Confirm the deletion by clicking "Delete issue" button
    cy.get('div.sc-bxivhb').contains('Delete issue').click();
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    // Assert that the issue is deleted and not visible in the backlog list
    cy.get('[data-testid="board-list:backlog').should('be.visible')
      .and('have.length', '1').within(() => {
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '3')
          .first()
          .find('p')
          .should('be.visible')
          .contains("Click on an issue to see what's behind it");
      })
  })

  it('Should be possible to start deleting an issue and cancel deletion', () => {
    cy.get('[data-testid="icon:trash"]').should('be.visible').click();
    // Start deletion by clicking "Trash" button
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    // Abort deletion by clicking "Cancel" button in the confirmation modal
    cy.get('div.sc-bxivhb').contains('Cancel').click();
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    // Close the issue window
    cy.get('[data-testid="icon:close"]').should('be.visible').first().click();
    // Assert that the issue is not deleted and visible in the backlog list
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '4')
        .first()
        .find('p')
        .should('be.visible')
        .contains('This is an issue of type: Task.');
    })
  });
})
beforeEach(() => {
      cy.visit('/');
      cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
        cy.visit(url + '/board/issues');
        cy.contains('This is an issue of type: Task.').click();
      });
});
describe('Issue delete', () => {
it('should delete an issue', () => {
    //assert that issue details view is visible
    cy.get('[data-testid="list-issue"]').should('be.visible');
    //Click on delete button and confirmation button
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('button').contains('Delete issue').click();
    //Assert that confirmation dialogue is not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist')
    //Assert that  issue is not available on jira board
    cy.get('[data-testid="board-list:backlog"]').contains('This is an issue of type: Task.').should('not.exist');
});

it('should start deletation of an issue and then cancel it', () => {
    //assert that issue details view is visible
    cy.get('[data-testid="list-issue"]').should('be.visible');
    //Click on delete button and then cancel button
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('button').contains('Cancel').click();
    //Assert that confirmation dialogue is not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist')
    //Assert that issue is available on jira board
    cy.get('button i[data-testid="icon:close"]').click();
    cy.get('[data-testid="board-list:backlog"]').contains('This is an issue of type: Task.').should('exist');
});
});
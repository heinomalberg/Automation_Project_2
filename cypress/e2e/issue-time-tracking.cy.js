describe('Time-tracking functionality tests of the issue', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board?modal-issue-create=true');
            // Before each test create a new issue
            cy.get('[data-testid="modal:issue-create"]')
                .within(() => {
                    cy.get('[data-testid="select:type"]').click();
                    cy.get('[data-testid="select-option:Bug"]').click();
                    cy.get(".ql-editor").type(issueDescription);
                    cy.get('input[name="title"]').type(issueTitle);
                    cy.get('[data-testid="select:userIds"]').click();
                    cy.get('[data-testid="select-option:Lord Gaben"]').click();
                    cy.get('button[type="submit"]').click();
                });
            // Assert that issue is successfully created and open it
            cy.contains('Issue has been successfully created.').should('be.visible');
            cy.get(backLogList).should('be.visible').contains(issueTitle).click();
        });
    });

    const issueTitle = "Time Estimation Test";
    const issueDescription = "User can add and modify estimated time of issue";
    const backLogList = '[data-testid="board-list:backlog"]';


    it('User can add, update and remove estimated time in the issue', () => {
        // Add estimated time
        cy.get('[data-testid="modal:issue-details"]')
            .within(() => {
                cy.contains('No time logged').should('be.visible');
                cy.get('[placeholder="Number"]').type(10);
                cy.get('[placeholder="Number"]').should('have.value', 10);
                cy.contains('10h estimated').should('be.visible');
                cy.get('[data-testid="icon:close"]').first().click();
            });
        // Assert that added estimated time is saved
        cy.get(backLogList).should('be.visible').contains(issueTitle).click();
        cy.get('[placeholder="Number"]').should('have.value', 10);
        cy.contains('10h estimated').should('be.visible');
        // Update estimated time
        cy.get('[placeholder="Number"]').clear().type(20);
        cy.get('[placeholder="Number"]').should('have.value', 20);
        cy.contains('20h estimated').should('be.visible');
        cy.get('[data-testid="icon:close"]').first().click();
        // Assert that new value of estimated time is saved
        cy.get(backLogList).should('be.visible').contains(issueTitle).click();
        cy.get('[placeholder="Number"]').should('have.value', 20);
        cy.contains('20h estimated').should('be.visible');
        // Remove estimated time from the issue
        cy.get('[placeholder="Number"]').click().clear();
        cy.contains('No time logged').should('be.visible');
        cy.get('[data-testid="icon:close"]').first().click();
        cy.get('[data-testid="modal:issue-details"]').should('not.exist');
        cy.wait(10000);
        // Assert that estimated time is removed
        cy.get(backLogList).should('be.visible').contains(issueTitle).click();
        cy.contains('No time logged').should('be.visible');
        cy.get('[placeholder="Number"]').should('have.value', '');
    });

    it('User can add and remove time logging values', () => {
        // Add estimated time to newly created issue
        cy.get('[data-testid="modal:issue-details"]')
            .within(() => {
                cy.contains('No time logged').should('be.visible');
                cy.get('[placeholder="Number"]').type(10);
                cy.get('[placeholder="Number"]').should('have.value', 10);
                cy.contains('10h estimated').should('be.visible');
                // Add time logging values
                cy.get('[data-testid="icon:stopwatch"]').click();
            });
        cy.get('[data-testid="modal:tracking"]').should('be.visible')
            .within(() => {
                cy.get('[placeholder="Number"]').eq(0).type(2);
                cy.get('[placeholder="Number"]').eq(1).type(5);
                cy.contains('button', 'Done').click();
            });
        // Assert that added time logging values are saved and visible
        cy.get('[data-testid="modal:tracking"]').should('not.exist');
        cy.contains('2h logged').should('be.visible');
        cy.contains('5h remaining').should('be.visible');
        cy.contains('10h estimated').should('not.exist');
        cy.contains('No time logged').should('not.exist');
        cy.get('[data-testid="icon:close"]').first().click();
        // Remove newly added time logging values
        cy.get(backLogList).should('be.visible').contains(issueTitle).click();
        cy.get('[data-testid="icon:stopwatch"]').click();
        cy.get('[data-testid="modal:tracking"]').should('be.visible')
            .within(() => {
                cy.get('[placeholder="Number"]').eq(0).clear();
                cy.get('[placeholder="Number"]').eq(1).clear();
                cy.contains('button', 'Done').click();
            });
        cy.get('[data-testid="icon:close"]').first().click();
        cy.wait(10000);
        // Assert that time logging values are removed
        // and estimated time is visible
        cy.get(backLogList).should('be.visible').contains(issueTitle).click();
        cy.contains('No time logged').should('be.visible');
        cy.contains('10h estimated').should('be.visible');
        cy.contains('2h logged').should('not.exist');
        cy.contains('5h remaining').should('not.exist');
    });
});
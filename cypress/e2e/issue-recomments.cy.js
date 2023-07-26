describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });
    
    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

    it('Should create a comment successfully', () => {
        const comment = 'NOTHING_TO_COMMENT';

        getIssueDetailsModal().within(() => {
            cy.contains('Add a comment...')
                .click();

            cy.get('textarea[placeholder="Add a comment..."]').type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.contains('Add a comment...').should('exist');
            cy.get('[data-testid="issue-comment"]').should('contain', comment);
        });
    });

    it('Should edit a comment successfully', () => {
        const previousComment = 'An old silent pond...';
        const comment = 'NOTHING_TO_COMMENT_EDITED';

        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="issue-comment"]')
                .first()
                .contains('Edit')
                .click()
                .should('not.exist');

            cy.get('textarea[placeholder="Add a comment..."]')
                .should('contain', previousComment)
                .clear()
                .type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.get('[data-testid="issue-comment"]')
                .should('contain', 'Edit')
                .and('contain', comment);
        });
    });

    it('Should delete a comment successfully', () => {
        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .contains('Delete')
            .click();

        cy.get('[data-testid="modal:confirm"]')
            .contains('button', 'Delete comment')
            .click()
            .should('not.exist');

        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .should('not.exist');
    });

    it('Should create,edit and delete comment successfully', () => {
        const comment = 'NOTHIN_TO_COMMENT';
        const comment_edited = 'NOTHING_TO_COMMENT_EDITED';

        getIssueDetailsModal().within(() => {
            // Create a new comment
            cy.contains('Add a comment...').click();
            cy.get('textarea[placeholder="Add a comment..."]').type(comment);
            cy.contains('button', 'Save').click().should('not.exist');
            cy.contains('Add a comment...').should('exist');
            // Assert that new comment exist
            cy.get('[data-testid="issue-comment"]').should('contain', comment);
            // Modify created comment
            cy.get('[data-testid="issue-comment"]').contains('Edit').click().should('not.exist');
            cy.get('textarea[placeholder="Add a comment..."]').should('contain', comment)
                .clear().type(comment_edited);
            cy.contains('button', 'Save').click().should('not.exist');
            cy.contains('Add a comment...').should('exist');
            // Assert that the comment was modified successfully
            cy.get('[data-testid="issue-comment"]').should('contain', comment_edited);
            // Delete the modified comment
            cy.contains('Delete').click();
        })
        cy.get('[data-testid="modal:confirm"]').contains('button', 'Delete comment')
            .click().should('not.exist');
        // Assert that deleted comment not exist
        getIssueDetailsModal().contains(comment_edited).should('not.exist');
    })
})
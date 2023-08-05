describe('Issue details editing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
    });
  });

  it('Should update type, status, assignees, reporter, priority successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click('bottomRight');
      cy.get('[data-testid="select-option:Story"]')
          .trigger('mouseover')
          .trigger('click');
      cy.get('[data-testid="select:type"]').should('contain', 'Story');

      cy.get('[data-testid="select:status"]').click('bottomRight');
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should('have.text', 'Done');

      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should('contain', 'Baby Yoda');
      cy.get('[data-testid="select:assignees"]').should('contain', 'Lord Gaben');

      cy.get('[data-testid="select:reporter"]').click('bottomRight');
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should('have.text', 'Pickle Rick');

      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Medium');
    });
  });

  it('Should update title, description successfully', () => {
    const title = 'TEST_TITLE';
    const description = 'TEST_DESCRIPTION';

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get('.ql-snow')
        .click()
        .should('not.exist');

      cy.get('.ql-editor').clear().type(description);

      cy.contains('button', 'Save')
        .click()
        .should('not.exist');

      cy.get('textarea[placeholder="Short summary"]').should('have.text', title);
      cy.get('.ql-snow').should('have.text', description);
    });
  });

  // Task 1 (not completed)

  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
  const expectedLength = 5;
  let priorityValuesArray = [];

  it('Validates values in issue priorities', () => {
    getIssueDetailsModal().within(() => {
      cy.contains('High');
      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid="option-selected"]').should('be.visible');
      cy.get('[data-testid="select-option:Highest"]')
      .each((option, index) => {
        const priorityValue = option.text().trim();
        if (index === 0) {
          priorityValuesArray.push(priorityValue);
        }
        priorityValuesArray.push(priorityValue);
        cy.log('Added value: ${priorityValue}. Array length: ${priorityValuesArray.length}');
      }).then(() => {
        expect(priorityValuesArray.length).to.equal(expectedLength);
        const expectedValues = ['Lowest', 'Low', 'Medium', 'High', 'Highest'];
        expect(priorityValuesArray).to.deep.equal(expectedValues);
      })
    })
  });

  // Task 2.1

  it('Should validate reporter name format', () => {
    cy.get('[data-testid="select:reporter"]').invoke('text').then(reporterName => {
      // Use string methods to check if reporter name contains only characters
      // and allow spaces inside of the string
      const isOnlyCharacters = /^[A-Za-z ]*$/.test(reporterName.trim());
      // Log the reporter name and the validation result for debugging
      cy.log(`Reporter Name: "${reporterName}", Contains Only Characters: ${isOnlyCharacters}`);
      // Assert that reporter name contains only characters
      expect(isOnlyCharacters).to.be.true;
    })
  });

  // Task 2.2

  it('Should validate reporter name format without spaces', () => {
    cy.get('[data-testid="select:reporter"]').invoke('text').then(reporterName => {
      // Remove all spaces from the reporter name
      const reporterNameWithoutSpaces = reporterName.replace(/\s/g, '');
      // Use string method to check if reporter name contains only characters
      const isOnlyCharacters = /^[A-Za-z]*$/.test(reporterNameWithoutSpaces);
      // Log the reporter name and the validation result for debugging
      cy.log(`Reporter Name: "${reporterName}", Contains Only Characters: ${isOnlyCharacters}`);
      // Assert that reporter name contains only characters
      expect(isOnlyCharacters).to.be.true;
    })
  });

  // Task 3 (not completed)

});

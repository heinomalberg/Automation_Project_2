import { faker } from '@faker-js/faker';
describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    //System will already open issue creating modal in beforeEach block  
    cy.visit(url + '/board?modal-issue-create=true');
    });
  });

  it('Should create an issue and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      
      //open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
          .trigger('click');
            
      //Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');

      //Type value to title input field
      //Order of filling in the fields is first description, then title on purpose
      //Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('TEST_TITLE');
      
      //Select Lord Gaben from reporter dropdown
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    
    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('TEST_TITLE');
      //Assert that correct avatar and type icon are visible
      cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
      cy.get('[data-testid="icon:story"]').should('be.visible');
    });
  });

  it('Create new issue and validate it', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Insert description and title of the issue
      cy.get('.ql-editor').type('My bug description');
      cy.get('input[name="title"]').type('Bug');
      // Select type and priority of the issue
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]').trigger('click');
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Highest"]').trigger('click');
      // Select reporter and sumit the issue
      cy.get('[data-testid="form-field:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('button[type="submit"]').click();
      
      cy.get('[data-testid="modal:issue-create"]').should('not.exist');
      
    })
    // Assert that success message is visible
    cy.contains('Issue has been successfully created.').should('be.visible');
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('Bug');
      //Assert that correct type icon are visible
      cy.get('[data-testid="icon:bug"]').should('be.visible');

    })
  });

  const title = faker.lorem.word();
  const randomDescription = faker.lorem.words(5);

  it('Creating new issue using random data plugin', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Assert that issue type 'Task' set by default is visible
      cy.get('[data-testid="select:type"]').should('have.text', 'Task').should('be.visible');
      // Fill out random description and issue title fields
      cy.get('.ql-editor').type(randomDescription);
      cy.get('input[name="title"]').type(title);
      // Select priority of the issue 'Low'
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Low"]').trigger('click');
      // Select reporter 'Baby Yoda' and click 'Create issue' button
      cy.get('[data-testid="form-field:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('button[type="submit"]').click();

      cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    })
    // Assert that success message is visible
    cy.contains('Issue has been successfully created.').should('be.visible');
      // Assert that issue is created and visible in the backlog
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains(title);
      cy.get('[data-testid="icon:task"]').should('be.visible');
    })
  })

  it('User cannot submit the issue when required fields are missing', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //Try to click create issue button without filling any data
      cy.get('button[type="submit"]')
        .scrollIntoView().
        should('be.visible').click();

      //Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });

  // Task 3

  it.only('Should validate issue title format on the board', () => {
    const title = 'Summer Issue';
    const newTitle = '   Hello   World   ';

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Insert description and title of the issue
      cy.get('.ql-editor').type('My bug description');
      cy.get('input[name="title"]').type(title);
      // Select type and priority of the issue
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]').trigger('click');
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Highest"]').trigger('click');
      // Select reporter and sumit the issue
      cy.get('[data-testid="form-field:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('button[type="submit"]').click();
      
      cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    });
    cy.contains('Issue has been successfully created.').should('be.visible');
    cy.get('[data-testid="board-list:backlog').should('be.visible').contains(title).click();
    cy.get('[placeholder="Short summary"]').clear().type(newTitle).invoke('text')
      
      const trimmedTitle = newTitle.trim();
      cy.get('[data-testid="modal:issue-create"]').contains(trimmedTitle);
      //.then(issueTitle => {
        //const trimmedTitle = newTitle.trim();
        //cy.log(`Issue Title: "${issueTitle}", Trimmed Title: "${trimmedTitle}"`);
        //expect(newTitle).to.equal(trimmedTitle);
      //});
  });
});

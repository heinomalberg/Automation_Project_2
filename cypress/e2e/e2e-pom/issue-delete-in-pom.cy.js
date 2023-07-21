import IssueModal from "../../pages/IssueModal";

describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    //open issue detail modal with title from line 16  
    cy.contains(issueTitle).click();
    });
  });

  //issue title, that we are testing with, saved into variable
  const issueTitle = 'This is an issue of type: Task.';

  it('Should delete issue successfully', () => {
    //Next two steps for delete issue and confirm deletion
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    // Assert that issue is not visible on the board
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle)
  });


  it('Should cancel deletion process successfully', () => {
    /** 1. step is to start deletion proces
     * 2. step to cancel deletion
     * 3. step to close issue detail modal
    */
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();
    // Assert that the issue is visible on the board
    IssueModal.ensureIssueIsVisibleOnBoard(issueTitle)
  });
});

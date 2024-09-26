const { faker } = require('@faker-js/faker');

function createUserData() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return ({
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName })
  })
}

const createUser = (userData) => {
  cy.get('[data-test-id="button-responsibleform-create"]').click(); // create button
  cy.get('[data-test-id="button-responsibleform-create"]')
    .should('contain', 'Create')  // check text
    .should('have.attr', 'data-test-id', 'button-responsibleform-create') // check data id
    .should('be.visible') // text is visible

  cy.get('[data-test-id="custombtn-modal-responsibleform-create-submit"]').click();// inside create button

  //Apply Assertions on validation message
  cy.get('[data-test-id="customtextfield-input-responsiblename-responsibleform-create"]').should('contain.text', 'First name must be at least 3 characters long');
  cy.get('[data-test-id="customtextfield-input-responsiblelastname-responsibleform-create"]').should('contain.text', 'Last name must be at least 3 characters long');
  cy.get('[data-test-id="customtextfield-input-responsibleemail-responsibleform-create"]').should('contain.text', 'Email is required');
  cy.get('[data-test-id="autocompletetextfield-display-responsibleformheadquarter-responsibleform-create"]').should('contain.text', 'Please select a headquarter');
  cy.get('body').click(0, 0);

  cy.get('[data-test-id="modal-cancelaction-responsibleform-create"]').click(); // cencel button
  
  cy.get('[data-test-id="button-responsibleform-create"]').click(); // create button
  cy.get('[data-test-id="custombtn-modal-responsibleform-create-submit"]').click();// inside create button

  cy.get('[data-test-id="customtextfield-input-responsiblename-responsibleform-create"]').type(userData.firstName);  // first name
  cy.get('[data-test-id="customtextfield-input-responsiblelastname-responsibleform-create"]').type(userData.lastName);  // last name

  cy.get('[data-test-id="modal-cancelaction-responsibleform-create"]').click(); // click cencel 
  cy.get('[data-test-id="dialogBox-title-alertBox-responsibleform-create"]') // cancel diglog box
    .should('contain', 'Cancel Reinstatement Responsible')
  cy.get('[data-test-id="dialogBox-content-alertBox-responsibleform-create"]') // cancel diglog box
    .should('contain', 'Are you sure you want to cancel this Reinstatement Responsible?')
  cy.get('[data-test-id="dialogBox-cancelaction-alertBox-responsibleform-create"]').click(); //cencel dialog pop-up

  cy.get('[data-test-id="customtextfield-input-responsibleemail-responsibleform-create"]').type(userData.email);  //enter email

  cy.get('[data-test-id="autocompletetextfield-display-responsibleformheadquarter-responsibleform-create"]').click(); // click on headquarter
  cy.get('[data-test-id="autocompletetextfield-display-responsibleformheadquarter-responsibleform-create"]').type('{downarrow}{enter}', { delay: 100 });  // select headquarter

  cy.get('[data-test-id="input-responsibleswitch-responsibleform-create"]').click(); // inactive status
  cy.get('[data-test-id="input-responsibleswitch-responsibleform-create"]').click(); // active status

  cy.get('[data-test-id="custombtn-modal-responsibleform-create-submit"]').click(); // click on create button

  cy.get('#notistack-snackbar > .MuiBox-root').should('contain', 'Reinstatement Responsible created successfully')
}

describe('User create', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/reinstatement-responsibles')
    cy.wait(2000)
    cy.url().should('include', 'reinstatement-responsibles') //assertion
  })

  it('User create test case', () => {
    const userData = createUserData()
    console.log('userData: ', userData);
    createUser(userData)
  })

  it('Already exist user', () => {
    const userData = createUserData()
    createUser(userData)
    cy.get('#notistack-snackbar > .MuiBox-root').should('contain', 'Reinstatement Responsible created successfully')

    createUser(userData)
    cy.get('#notistack-snackbar > .MuiBox-root').should('contain', 'Email already exists')
  })

  //Delete user case  
  it.skip('Delete user', () => {
    cy.get('[data-test-id="tablebodycell-873318b5-8d5d-4786-97b0-1f57ad24f01f-deleteicon-desktoptable-reinstatement-responsibles-table-list-page-reinstatement"]').click();
    cy.get('[data-test-id="custombtn-dialogBox-submit-alertbox-delete-reinstatement-responsibles-table-list-page-reinstatement"]').click()
    cy.get('[class="notistack-Snackbar go3963613292"]').should('contain.text', 'was successfully deleted');
    cy.log('Delete succuessfully')
  })

  it.only('Search, edit and view user detials', () => {
    cy.get('[data-test-id="input-search-searchbar-page-reinstatement"]').type('UserEZur'); // click on search field
    cy.wait(500)
    
    //click on view icon
   // cy.get('tablebody-desktoptable-reinstatement-responsibles-table-list-page-reinstatement').children();
    cy.get('[data-test-id="tablebodycell-90108dda-ac55-49a9-80bc-9dab8950c25f-viewicon-desktoptable-reinstatement-responsibles-table-list-page-reinstatement"]').click({ multiple: true })
    cy.get('[data-test-id="customdialog-canclebtn-view-viewresponsible-reinstatement-responsibles-table-list-page-reinstatement"]').click()

    // edit profile
    cy.get('[data-test-id="tablebodycell-90108dda-ac55-49a9-80bc-9dab8950c25f-editicon-desktoptable-reinstatement-responsibles-table-list-page-reinstatement"]').click()
    cy.get('[data-test-id="customtextfield-input-responsiblelastname-responsiblitiesform-edit"]')
      .clear().type("Dee");
    cy.get('[data-test-id="custombtn-modal-responsiblitiesform-edit-submit"]').click();
    cy.get('[data-test-id="dialogBox-title-alertBox-responsiblitiesform-edit"]').should('contain', 'Edit Reinstatement Responsible')
    cy.get('[data-test-id="dialogBox-content-alertBox-responsiblitiesform-edit"]').should('contain', 'Are you sure you want to save the changes?')
    cy.get('[data-test-id="custombtn-dialogBox-submit-alertBox-responsiblitiesform-edit"]').click();
    cy.get('#notistack-snackbar > .MuiBox-root').should('contain', "Saved successfully")
    cy.wait(500)
    //filter
    cy.get('[data-test-id="icon-arrowdown-autocompletefilter-destop-filter-headquarter-page-reinstatement"]').click();

    // Match checkout text
    cy.get('[data-test-id="list-item-AO-autocompletefilter-destop-filter-headquarter-page-reinstatement"]').click()
    cy.wait(500)
    cy.get('[data-test-id="list-item-CL-autocompletefilter-destop-filter-headquarter-page-reinstatement"]').click()
    cy.wait(500)
    cy.get('[data-test-id="list-item-DZ-autocompletefilter-destop-filter-headquarter-page-reinstatement"]').click()
    cy.wait(500)
    cy.get('body').click(0, 0); // closed
    cy.get('[data-test-id="icon-cancel-autocompletefilter-destop-filter-headquarter-page-reinstatement"]').click(); //cross icon
    cy.get('[data-test-id="clear-btn-header-page-reinstatement"]').click();

    //click on three triple lines
    cy.get('[data-test-id="appbar-menu-btn"]').click({ force: true });
    cy.get('[data-test-id="layout-sidebar-container"]').should('have.css', 'width', '71.98863220214844px');
    cy.get('[data-test-id="appbar-menu-btn"]').click();
  });

  //Pagintaion
  it.skip('pagination', () => {
    cy.visit('http://localhost:3000/reinstatement-responsibles')
    cy.wait(1000)
    // cy.get('[data-testid="KeyboardArrowRightIcon"]').click()
    cy.get('.mui-1wgbp7b').click()
    cy.wait(1000)
    cy.get('.mui-1deacqj').click()
})


})









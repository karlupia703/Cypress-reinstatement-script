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
const searchUUID = async () => {
  const row = await cy.get('[data-test-id="tablebody-desktoptable-reinstatement-responsibles-table-list-page-reinstatement"]')
    .should('exist')  // Ensure the table exists
    .children()       // Get the children of the table (e.g., rows)
    .first()          // Get the first row
  // .then(($row) => {
  const dataTestId = row.attr('data-test-id');  // Extract the 'data-test-id' attribute
  const uuidMatch = dataTestId.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);  // Refined regex to match only the UUID
  const uuid = uuidMatch ? uuidMatch[0] : 'No UUID found';  // Check if a match was found
  // const userName = row.find(`[tablebodycell-${uuid}-viewicon-desktoptable-reinstatement-responsibles-table-list-page-reinstatement"]`).click()


  return uuid;
};

describe('User create', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('http://localhost:3000/reinstatement-responsibles')
    cy.wait(2000)
   // cy.url().should('include', 'reinstatement-responsibles') //assertion
  })


  it('Create user', () => {
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


  it('User edit', async () => {
    const userData = createUserData()
   // cy.get(2000)
    const uuid = await searchUUID()
    //cy.get(2000)
    cy.get(`[data-test-id="tablebodycell-${uuid}-editicon-desktoptable-reinstatement-responsibles-table-list-page-reinstatement"]`).click()
   // cy.get('[data-test-id="modal-title-responsiblitiesform-edit"]').should('contain', "Edit Reinstatement Responsible")
      cy.get('[data-test-id="customtextfield-input-responsiblelastname-responsiblitiesform-edit"]')  
        .clear().type(userData.lastName);
      cy.get('[data-test-id="custombtn-modal-responsiblitiesform-edit-submit"]').click();  // Click on update button
  
     // cy.get('[data-test-id="dialogBox-title-alertBox-responsiblitiesform-edit"]').should('contain', 'Edit Reinstatement Responsible')
     // cy.get('[data-test-id="dialogBox-content-alertBox-responsiblitiesform-edit"]').should('contain', 'Are you sure you want to save the changes?')
  
      cy.get('[data-test-id="custombtn-dialogBox-submit-alertBox-responsiblitiesform-edit"]').click(); // Click on accept button
     // cy.get('#notistack-snackbar > .MuiBox-root').should('contain', "Saved successfully")
      cy.wait(500)
  
  })


  it('Delete user', async () => { 
    const userData = createUserData()
  
      const uuid = await searchUUID()
      cy.get(3000)
      
      cy.get(`[data-test-id="tablebodycell-${uuid}-deleteicon-desktoptable-reinstatement-responsibles-table-list-page-reinstatement"]`).click()
    //  cy.get('[data-test-id="tablebodycell-873318b5-8d5d-4786-97b0-1f57ad24f01f-deleteicon-desktoptable-reinstatement-responsibles-table-list-page-reinstatement"]').click();
      cy.get('[data-test-id="custombtn-dialogBox-submit-alertbox-delete-reinstatement-responsibles-table-list-page-reinstatement"]').click()
      cy.get('[class="notistack-Snackbar go3963613292"]').should('contain.text', 'was successfully deleted');
      cy.log('Delete succuessfully')
      })


  it('filter',async () => {
        cy.get('[data-test-id="icon-arrowdown-autocompletefilter-destop-filter-headquarter-page-reinstatement"]').click(); // Filter of headquarter
    
        cy.get('[data-test-id="list-item-AO-autocompletefilter-destop-filter-headquarter-page-reinstatement"]').click() // Match checkout text
        cy.wait(500)
        cy.get('[data-test-id="list-item-CL-autocompletefilter-destop-filter-headquarter-page-reinstatement"]').click()
        cy.wait(500)
        cy.get('[data-test-id="list-item-DZ-autocompletefilter-destop-filter-headquarter-page-reinstatement"]').click()
        cy.wait(500)
        cy.get('body').click(0, 0); // Closed
    
        cy.get('[data-test-id="icon-cancel-autocompletefilter-destop-filter-headquarter-page-reinstatement"]').click(); //Cross icon
        cy.get('[data-test-id="clear-btn-header-page-reinstatement"]').click();
    
         // Click on three triple lines
        cy.get('[data-test-id="appbar-menu-btn"]').click({ force: true });
        cy.get('[data-test-id="layout-sidebar-container"]').should('have.css', 'width', '71.98863220214844px');
        cy.get('[data-test-id="appbar-menu-btn"]').click();
    
      })


  it.skip('Search user', async () => {
    const userData = createUserData()

    const searchUser = async () => {
      const row = await cy.get('[data-test-id="tablebody-desktoptable-reinstatement-responsibles-table-list-page-reinstatement"]')
        .should('exist')  // Ensure the table exists
        .children()       // Get the children of the table (e.g., rows)
        .first()          // Get the first row
      //  cy.wait(1000);
      //  .then(($row) => {
      const dataTestId = row.attr('data-test-id'); // Extract the 'data-test-id' attribute
      
      const uuidMatch = dataTestId.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);  // Refined regex to match only the UUID
      const uuid = uuidMatch ? uuidMatch[0] : 'No UUID found';  // Check if a match was found
      const userName = row.find(`[data-test-id="tablebodycell-${uuid}-responsiblename-desktoptable-reinstatement-responsibles-table-list-page-reinstatement"]`).text().trim();
      console.log('Extracted userName:', userName);
      if (userName) {  // Check if userName is not empty
        cy.get('[data-test-id="input-search-searchbar-page-reinstatement"]').type(userName);
       // cy.wait(2000);
      } else {
        throw new Error('No result found');
      }
      return uuid;
      // return uuid;
      //  });
    };
    const dataid = await searchUser();
    cy.log('.sdasdasdasdasdasd', dataid)
    cy.get('[data-test-id="icon-clear-searchbar-page-reinstatement"]').click();
  })
 

  it('pagination', () => {
    cy.visit('http://localhost:3000/reinstatement-responsibles')
    cy.wait(2000)
    
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="KeyboardArrowRightIcon"]').length > 0) {
        cy.get('[data-testid="KeyboardArrowRightIcon"]').then(($rightArrow) => {
          if ($rightArrow.is(':disabled') || $rightArrow.css('pointer-events') === 'none') {
            cy.log('Right pagination arrow is disabled.');
          } else {
            cy.wrap($rightArrow).click();
            cy.wait(2000);
          }
        });
      } else {
        cy.log('Right pagination arrow is not available.');
      }
  
      // Check if the left arrow exists
      if ($body.find('[data-testid="KeyboardArrowLeftIcon"]').length > 0) {
        cy.get('[data-testid="KeyboardArrowLeftIcon"]').then(($leftArrow) => {
          if ($leftArrow.is(':disabled') || $leftArrow.css('pointer-events') === 'none') {
            cy.log('Left pagination arrow is disabled.');
          } else {
            cy.wrap($leftArrow).click();
            cy.wait(2000);
          }
        });
      } else {
        cy.log('Left pagination arrow is not available.');
      }
    });
  });
  

})

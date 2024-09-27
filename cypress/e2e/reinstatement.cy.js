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

  return uuid;
};

describe('Reinstatement', () => {
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

  it('User search', async () => {
    const userData = createUserData()

    const searchUser = async () => {
      const row = await cy.get('[data-test-id="tablebody-desktoptable-reinstatement-responsibles-table-list-page-reinstatement"]')
        .should('exist')  // Ensure the table exists
        .children()       // Get the children of the table (e.g., rows)
        .first()          // Get the first row
      // .then(($row) => {
      const dataTestId = row.attr('data-test-id');  // Extract the 'data-test-id' attribute
      const uuidMatch = dataTestId.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);  // Refined regex to match only the UUID
      const uuid = uuidMatch ? uuidMatch[0] : 'No UUID found';  // Check if a match was found
      const userName = row.find(`[data-test-id="tablebodycell-${uuid}-responsiblename-desktoptable-reinstatement-responsibles-table-list-page-reinstatement"]`).text().trim();
      console.log('Extracted userName:', userName);
      if (userName) {  // Check if userName is not empty
        cy.get('[data-test-id="input-search-searchbar-page-reinstatement"]').type(userName);
        cy.wait(2000);
      } else {
        throw new Error('No result found');
      }
      return uuid;
      // return uuid;
      // });
    };
    const dataid = await searchUser();
    cy.log('.sdasdasdasdasdasd', dataid)

  })

  it('User view', async () => {
    const userData = createUserData()

    const uuid = await searchUUID()
    cy.get(`[data-test-id="tablebodycell-${uuid}-viewicon-desktoptable-reinstatement-responsibles-table-list-page-reinstatement"]`).click()
    cy.get('[data-test-id="customdialog-canclebtn-view-viewresponsible-reinstatement-responsibles-table-list-page-reinstatement"]').click(); // Close icon 
    // searchUser()
  })


  it('User edit', async () => {
    const userData = createUserData()

    const uuid = await searchUUID()
    cy.get(`[data-test-id="tablebodycell-${uuid}-editicon-desktoptable-reinstatement-responsibles-table-list-page-reinstatement"]`).click()
    cy.get('[data-test-id="modal-title-responsiblitiesform-edit"]').should('contain', "Edit Reinstatement Responsible")
      cy.get('[data-test-id="customtextfield-input-responsiblelastname-responsiblitiesform-edit"]')  
        .clear().type(userData.lastName);
      cy.get('[data-test-id="custombtn-modal-responsiblitiesform-edit-submit"]').click();  // Click on update button
  
      cy.get('[data-test-id="dialogBox-title-alertBox-responsiblitiesform-edit"]').should('contain', 'Edit Reinstatement Responsible')
      cy.get('[data-test-id="dialogBox-content-alertBox-responsiblitiesform-edit"]').should('contain', 'Are you sure you want to save the changes?')
  
      cy.get('[data-test-id="custombtn-dialogBox-submit-alertBox-responsiblitiesform-edit"]').click(); // Click on accept button
      cy.get('#notistack-snackbar > .MuiBox-root').should('contain', "Saved successfully")
      cy.wait(500)
  
  })



})









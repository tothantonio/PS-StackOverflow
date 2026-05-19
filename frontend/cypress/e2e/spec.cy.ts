describe('Authentication', () => {
  it('should register and login', () => {
    const unique = Date.now()

    const username = `antonio${unique}`
    const email = `antonio${unique}@test.com`
    const password = `Antonio${unique}!`

    cy.intercept('POST', '**/register', {
      statusCode: 200,
      body: {}
    }).as('register')

    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        user: { username }
      }
    }).as('login')

    cy.visit('/register')

    cy.get('input[placeholder="Username"]').type(username)
    cy.get('input[placeholder="Email"]').type(email)
    cy.get('input[placeholder="Password"]').type(password)
    cy.get('input[placeholder="Confirm Password"]').type(password)

    cy.contains('button', 'Register').click()

    cy.contains(/Registration successful/i).should('be.visible')

    cy.url().should('include', '/login')

    cy.get('input[placeholder="Username"]').type(username)
    cy.get('input[placeholder="Password"]').type(password)

    cy.contains('button', 'Login').click()

    cy.url().should('include', '/questions')
  })
})
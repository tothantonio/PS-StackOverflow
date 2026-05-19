describe('Authentication', () => {

  it('should register and login', () => {

    const unique = Date.now()

    const username = `antonio${unique}`
    const email = `antonio${unique}@test.com`
    const password = `Antonio${unique}!`

    cy.visit('http://localhost:5173/register')

    cy.get('input[placeholder="Username"]')
      .type(username)

    cy.get('input[placeholder="Email"]')
      .type(email)

    cy.get('input[placeholder="Password"]')
      .type(password)

    cy.get('input[placeholder="Confirm Password"]')
      .type(password)

    cy.contains('button', 'Register').click()

    cy.contains('Registration successful')

    cy.visit('http://localhost:5173/login')

    cy.get('input[placeholder="Username"]')
      .type(username)

    cy.get('input[placeholder="Password"]')
      .type(password)

    cy.contains('button', 'Login').click()

    cy.url().should('include', '/questions')

  })

})
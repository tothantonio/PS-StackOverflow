describe('Authentication', () => {
  it('should register and login', () => {
    const unique = Date.now()

    const username = `antonio${unique}`
    const email = `antonio${unique}@test.com`
    const password = `Antonio${unique}!`

    // REGISTER
    cy.visit('http://localhost:5173/register')

    cy.get('input[placeholder="Username"]').type(username)
    cy.get('input[placeholder="Email"]').type(email)
    cy.get('input[placeholder="Password"]').type(password)
    cy.get('input[placeholder="Confirm Password"]').type(password)

    cy.contains('button', 'Register').click()

    // ASSERT registration success (FIXED TEXT)
    cy.contains(/Registration successful/i).should('be.visible')

    // NU mai depindem de timeout-ul de 2 sec
    cy.url().should('include', '/login')

    // LOGIN
    cy.get('input[placeholder="Username"]').should('be.visible').type(username)
    cy.get('input[placeholder="Password"]').type(password)

    cy.contains('button', 'Login').click()

    // ASSERT redirect after login
    cy.url().should('include', '/questions')
  })
})
// Custom Cypress commands

// Login command
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('[data-testid="email-input"]').type(email)
  cy.get('[data-testid="password-input"]').type(password)
  cy.get('[data-testid="login-button"]').click()
  cy.url().should('not.include', '/login')
})

// Logout command
Cypress.Commands.add('logout', () => {
  cy.visit('/')
  cy.get('[data-testid="user-menu"]').click()
  cy.get('[data-testid="logout-button"]').click()
  cy.url().should('include', '/login')
})

// Create church (ADMIN only)
Cypress.Commands.add('createChurch', (churchData) => {
  cy.visit('/admin/igrejas/new')
  cy.get('[data-testid="nome-input"]').type(churchData.nome)
  cy.get('[data-testid="endereco-input"]').type(churchData.endereco)
  cy.get('[data-testid="cidade-input"]').type(churchData.cidade)
  cy.get('[data-testid="estado-select"]').select(churchData.estado)
  cy.get('[data-testid="create-church-button"]').click()
  cy.url().should('include', '/admin/igrejas')
})

// Create user
Cypress.Commands.add('createUser', (userData) => {
  cy.visit('/admin/usuarios/new')
  cy.get('[data-testid="email-input"]').type(userData.email)
  cy.get('[data-testid="password-input"]').type(userData.password)
  cy.get('[data-testid="role-select"]').select(userData.role)
  cy.get('[data-testid="create-user-button"]').click()
  cy.url().should('include', '/admin/usuarios')
})

// Navigate to module
Cypress.Commands.add('goToModule', (moduleName) => {
  cy.visit(`/${moduleName}`)
})

// Wait for loading to complete
Cypress.Commands.add('waitForLoading', () => {
  cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.exist')
})

// Assert permission-based UI elements
Cypress.Commands.add('shouldSeePermission', (resource, action, shouldSee = true) => {
  if (shouldSee) {
    cy.get(`[data-permission="${resource}:${action}"]`).should('exist')
  } else {
    cy.get(`[data-permission="${resource}:${action}"]`).should('not.exist')
  }
})

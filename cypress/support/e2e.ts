// Сypress Support e2e.ts

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Global Cypress hooks
beforeEach(() => {
  // Clear localStorage before each test
  window.localStorage.clear()

  // Clear cookies
  cy.clearCookies()
})

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err) => {
  // Fail tests on uncaught exceptions
  return false
})

// Custom task for API calls if needed
Cypress.Commands.add('apiRequest', (method, url, body) => {
  return cy.request({
    method,
    url: `/api${url}`,
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  })
})

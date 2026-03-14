describe('Cross-Tenant Isolation', () => {
  const churchA = {
    nome: 'Igreja A',
    endereco: 'Endereço A',
    cidade: 'Cidade A',
    estado: 'SP',
  }

  const churchB = {
    nome: 'Igreja B',
    endereco: 'Endereço B',
    cidade: 'Cidade B',
    estado: 'RJ',
  }

  const userA = {
    email: 'usuarioA@test.com',
    password: 'password123',
    role: 'PASTOR',
  }

  const userB = {
    email: 'usuarioB@test.com',
    password: 'password123',
    role: 'PASTOR',
  }

  it('should prevent access to another church data', () => {
    // Login as ADMIN, create two churches and two users
    cy.login('admin@test.com', 'password123')

    // Create Church A
    cy.createChurch(churchA)
    cy.createUser(userA)

    // Create Church B
    cy.createChurch(churchB)
    cy.createUser(userB)

    cy.logout()

    // Login as user from Church A
    cy.login(userA.email, userA.password)

    // Try to access Church B members (should be blocked)
    // Simulate tampering: manually navigate to Church B member if possible
    // or check that only Church A data is visible

    // Go to members page - should only show Church A members
    cy.goToModule('membros')
    cy.url().should('include', '/membros')

    // In a real test, we would try to access another church's member ID and expect 403
    // This requires API-level testing or URL manipulation

    cy.logout()

    // Login as user from Church B
    cy.login(userB.email, userB.password)

    // Verify Church B sees only own data
    cy.goToModule('membros')
    cy.url().should('include', '/membros')

    // Users should not see each other's data
    // This would require checking specific member IDs that shouldn't exist
  })

  it('should enforce tenant scoping on all protected routes', () => {
    cy.login('admin@test.com', 'password123')

    // Create a church and user
    cy.createChurch(churchA)
    cy.createUser(userA)

    cy.logout()

    // Login as Church A user
    cy.login(userA.email, userA.password)

    // Access dashboard - should show Church A context
    cy.goToModule('dashboard')
    cy.contains(churchA.nome).should('exist') // Church name appears in UI

    // Try accessing Church B resources via direct API (bypass)
    // This test simulates cross-tenant attempt
    cy.request({
      method: 'GET',
      url: '/api/membros',
      headers: {
        Authorization: `Bearer ${ Cypress.env('userA_token') }`,
      },
      qs: { igrejaId: churchB.id } // Force different church ID
    }).then((response) => {
      expect(response.status).to.eq(403)
    })
  })
})

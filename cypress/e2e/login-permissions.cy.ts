describe('Login and Permissions', () => {
  const roles = [
    { email: 'admin@test.com', password: 'password123', role: 'ADMIN' },
    { email: 'pastor@test.com', password: 'password123', role: 'PASTOR' },
    { email: 'secretario@test.com', password: 'password123', role: 'SECRETARIO' },
    { email: 'membro@test.com', password: 'password123', role: 'MEMBRO' },
  ]

  describe('Authentication flow', () => {
    it('should login with valid credentials', () => {
      cy.login(roles[0].email, roles[0].password)
      cy.url().should('not.include', '/login')
      cy.get('[data-testid="user-menu"]').should('exist')
    })

    it('should show error with invalid credentials', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('wrong@test.com')
      cy.get('[data-testid="password-input"]').type('wrongpass')
      cy.get('[data-testid="login-button"]').click()
      cy.contains('Credenciais inválidas').should('exist')
    })

    it('should persist session across page reloads', () => {
      cy.login(roles[0].email, roles[0].password)
      cy.reload()
      cy.get('[data-testid="user-menu"]').should('exist')
    })
  })

  describe('Role-based UI rendering', () => {
    beforeEach(() => {
      cy.login(roles[0].email, roles[0].password)
    })

    afterEach(() => {
      cy.logout()
    })

    it('ADMIN should see all navigation items', () => {
      cy.get('[href="/admin"]').should('exist')
      cy.get('[href="/membros"]').should('exist')
      cy.get('[href="/financeiro"]').should('exist')
      cy.get('[href="/patrimonio"]').should('exist')
      cy.get('[href="/relatorios"]').should('exist')
    })

    it('MEMBRO should see limited navigation', () => {
      cy.logout()
      cy.login(roles[3].email, roles[3].password)

      cy.get('[href="/admin"]').should('not.exist')
      cy.get('[href="/membros"]').should('exist')
      cy.get('[href="/financeiro"]').should('not.exist')
      cy.get('[href="/patrimonio"]').should('not.exist')
      cy.get('[href="/relatorios"]').should('not.exist')
    })

    it('should hide action buttons based on permissions', () => {
      cy.logout()
      cy.login(roles[3].email, roles[3].password) // MEMBRO

      cy.goToModule('membros')

      // MEMBRO should not see "Novo Membro" button
      cy.get('[data-permission="membros:create"]').should('not.exist')
    })
  })

  describe('RBAC guards', () => {
    it('should redirect unauthorized users to login', () => {
      // Try access protected route without auth
      cy.visit('/admin')
      cy.url().should('include', '/login')
    })

    it('should show 403 page for insufficient permissions', () => {
      cy.login(roles[3].email, roles[3].password) // MEMBRO

      // Try to access admin route
      cy.visit('/admin/usuarios')
      cy.get('h1').should('contain', '403')
    })
  })
})

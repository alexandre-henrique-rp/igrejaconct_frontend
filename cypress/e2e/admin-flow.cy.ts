describe('Admin Flow - Criar Igreja e Usuários', () => {
  const adminCredentials = {
    email: 'admin@test.com',
    password: 'password123',
  }

  const churchData = {
    nome: 'Igreja Teste Cypress',
    endereco: 'Rua Teste, 123',
    cidade: 'São Paulo',
    estado: 'SP',
  }

  const userData = {
    email: 'usuario@test.com',
    password: 'password123',
    role: 'MEMBRO',
  }

  beforeEach(() => {
    cy.login(adminCredentials.email, adminCredentials.password)
  })

  afterEach(() => {
    cy.logout()
  })

  it('should create a new church', () => {
    cy.createChurch(churchData)

    // Verify church appears in list
    cy.goToModule('admin/igrejas')
    cy.contains('h1', 'Igrejas').should('exist')
    cy.contains(churchData.nome).should('exist')
  })

  it('should create a new user linked to church', () => {
    cy.createUser(userData)

    // Verify user appears in list
    cy.goToModule('admin/usuarios')
    cy.contains('h1', 'Usuários').should('exist')
    cy.contains(userData.email).should('exist')
  })

  it('should have proper permissions after login as new user', () => {
    cy.logout()

    // Login as new user
    cy.login(userData.email, userData.password)

    // Verify MEMBRO sees only allowed content
    cy.goToModule('dashboard')
    cy.url().should('include', '/dashboard')

    // MEMBRO should NOT see admin links
    cy.get('[href="/admin"]').should('not.exist')
    cy.get('[href="/admin/usuarios"]').should('not.exist')
    cy.get('[href="/admin/igrejas"]').should('not.exist')

    // MEMBRO should see own profile
    cy.get('[href="/perfil"]').should('exist')
  })
})

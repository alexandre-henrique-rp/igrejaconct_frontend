describe('Dashboard and Main Modules', () => {
  beforeEach(() => {
    cy.login('admin@test.com', 'password123')
  })

  afterEach(() => {
    cy.logout()
  })

  describe('Dashboard', () => {
    it('should load dashboard with statistics', () => {
      cy.goToModule('dashboard')
      cy.get('h1').should('contain', 'Dashboard')

      // Check key metrics are present
      cy.get('[data-testid="total-membros"]').should('exist')
      cy.get('[data-testid="total-eventos"]').should('exist')
      cy.get('[data-testid="total-financeiro"]').should('exist')
    })

    it('should display recent activities', () => {
      cy.goToModule('dashboard')
      cy.get('[data-testid="recent-activities"]').should('exist')
    })
  })

  describe('Membros Module', () => {
    it('should list members with filters', () => {
      cy.goToModule('membros')
      cy.get('h1').should('contain', 'Membros')
      cy.get('table').should('exist')

      // Test filters exist
      cy.get('[data-testid="filter-status"]').should('exist')
      cy.get('[data-testid="search-input"]').should('exist')
    })

    it('should open member form when clicking "Novo Membro"', () => {
      cy.goToModule('membros')
      cy.contains('button', 'Novo Membro').click()
      cy.get('[data-testid="member-form"]').should('exist')
    })

    it('should view member details', () => {
      cy.goToModule('membros')
      // Assuming there's at least one member
      cy.get('table tbody tr').first().within(() => {
        cy.contains('button', 'Ver').click()
      })
      cy.get('[data-testid="member-details"]').should('exist')
    })
  })

  describe('Eventos Module', () => {
    it('should display calendar view', () => {
      cy.goToModule('eventos')
      cy.get('h1').should('contain', 'Eventos')
      cy.get('[data-testid="calendar"]').should('exist')
    })

    it('should create new event', () => {
      cy.goToModule('eventos')
      cy.contains('button', 'Novo Evento').click()

      cy.get('[data-testid="event-name"]').type('Evento Teste Cypress')
      cy.get('[data-testid="event-date"]').type('2024-12-25')
      cy.get('[data-testid="save-event"]').click()

      cy.contains('Evento Teste Cypress').should('exist')
    })
  })

  describe('Financeiro Module', () => {
    it('should show financial dashboard', () => {
      cy.goToModule('financeiro')
      cy.get('h1').should('contain', 'Financeiro')
      cy.get('[data-testid="financial-summary"]').should('exist')
    })

    it('should display recent transactions', () => {
      cy.goToModule('financeiro')
      cy.get('[data-testid="transactions-table"]').should('exist')
    })
  })

  describe('Relatorios Module', () => {
    it('should show reports hub', () => {
      cy.goToModule('relatorios')
      cy.get('h1').should('contain', 'Relatórios')
      cy.get('[data-testid="reports-grid"]').should('exist')
    })

    it('should generate member report', () => {
      cy.goToModule('relatorios')
      cy.contains('button', 'Membros').click()
      cy.get('[data-testid="report-params"]').should('exist')
    })
  })
})

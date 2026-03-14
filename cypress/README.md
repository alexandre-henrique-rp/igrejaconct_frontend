# Cypress E2E Tests - IgrejaConnect

## Setup

Cypress já está instalado e configurado.

## Running Tests

### Modo interativo (GUI)
```bash
npm run cypress:open
```

### Modo headless (CLI)
```bash
npm run cypress:run
```

## Test Suites

- **admin-flow.cy.ts** - ADMIN cria igreja e usuários, testa permissões
- **cross-tenant.cy.ts** - Isolamento multi-tenant, cross-tenant blocking
- **login-permissions.cy.ts** - Autenticação e RBAC UI
- **dashboard-modules.cy.ts** - Funcionalidade dos módulos principais

## Environment Variables

Para rodar localmente, configure:

```bash
# .env.local ou cypress.env.json
VITE_API_URL=http://localhost:3000
```

## Fixtures

Test data available in `cypress/fixtures/test-data.ts`

## Screenshots & Videos

On failure, Cypress automatically saves:
- Screenshots: `cypress/screenshots/`
- Videos: `cypress/videos/`

## CI Integration

GitHub Actions workflow runs Cypress tests on PRs to main/develop.

import { defineConfig } from 'cypress'
import viteDevServer from '@cypress/vite-dev-server'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',

    // Enable video recording (optional)
    video: true,
    videoCompression: 32,

    // Screenshot on failure
    screenshotOnRunFailure: true,

    // Use Vite dev server
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfigFile: 'vite.config.ts',
    },

    // Default command timeout
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 120000,

    // Global setup/teardown
    setupNodeEvents(on, config) {
      // Implement any node event listeners here
      return config
    },
  },

  // Component testing not needed
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
})

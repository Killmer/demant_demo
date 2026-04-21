import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.ts",
    // Explicit viewport keeps layout consistent across machines and CI
    viewportWidth: 1280,
    viewportHeight: 720,
    // One automatic retry in CI headless mode; no retry in interactive mode
    retries: {
      runMode: 1,
      openMode: 0,
    },
    // Suppress the Cypress.env() deprecation warning (we don't use it)
    allowCypressEnv: false,
  },
});

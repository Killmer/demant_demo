/**
 * Global Cypress support file — runs before every spec.
 *
 * Add custom commands, global beforeEach hooks, or third-party
 * plugin imports here. Keep this file lean; prefer per-spec helpers
 * for anything that is only used in one test file.
 */

// ---------------------------------------------------------------------------
// Custom commands
// ---------------------------------------------------------------------------

/**
 * Opens the newsletter-signup modal from the home page.
 *
 * Usage: cy.openNewsletterModal()
 */
Cypress.Commands.add("openNewsletterModal", () => {
  cy.visit("/");
  cy.contains("button", "Show modal").click();
  // Wait for the modal heading to be visible before proceeding
  cy.contains("Want to see the unseen?").should("be.visible");
});

/**
 * Opens the newsletter-signup modal by navigating directly to
 * /?modal=newsletter, simulating an open-after-redirect flow.
 *
 * Usage: cy.openNewsletterModalViaQueryParam()
 */
Cypress.Commands.add("openNewsletterModalViaQueryParam", () => {
  cy.visit("/?modal=newsletter");
  // Wait for the modal heading to be visible before proceeding
  cy.contains("Want to see the unseen?").should("be.visible");
});


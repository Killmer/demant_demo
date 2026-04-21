/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    openNewsletterModal(): Chainable<void>;
  }
}

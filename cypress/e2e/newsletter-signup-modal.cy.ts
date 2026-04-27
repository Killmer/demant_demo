// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------
const emailInput = () => cy.get('input[type="email"]');
const clinicInput = (index: number) => cy.get(`#clinic-${index}`);
// Target by name so the selector stays correct if more checkboxes are added
const checkbox = () => cy.get('[name="acceptedTerms"]');
const submitButton = () => cy.get('button[aria-label="Submit"]');
const addAnotherLine = () => cy.get('button[aria-label="Add another line"]');
const closeButton = () => cy.get('button[aria-label="Close"]');
const removeLineButton = (line: number) =>
  cy.get(`button[aria-label="Remove address line ${line}"]`);

// ---------------------------------------------------------------------------
describe("NewsletterSignupModal — open via query param", () => {
  it("opens the modal automatically when visiting /?modal=newsletter", () => {
    cy.openNewsletterModalViaQueryParam();
    cy.contains("Want to see the unseen?").should("be.visible");
  });

  it("removes the ?modal param from the URL after opening", () => {
    cy.openNewsletterModalViaQueryParam();
    cy.url().should("not.include", "modal=newsletter");
  });

  it("modal is fully functional after opening via query param — can be closed", () => {
    cy.openNewsletterModalViaQueryParam();
    cy.get('button[aria-label="Close"]').click();
    cy.contains("Want to see the unseen?").should("not.exist");
  });

  it("modal is fully functional after opening via query param — can submit", () => {
    cy.openNewsletterModalViaQueryParam();
    cy.get('input[type="email"]').type("redirect@example.com");
    cy.get('[name="acceptedTerms"]').check({ force: true });
    cy.get('button[aria-label="Submit"]').click();
    cy.contains("Want to see the unseen?").should("not.exist");
  });
});

// ---------------------------------------------------------------------------
describe("NewsletterSignupModal", () => {
  // -------------------------------------------------------------------------
  describe("visibility", () => {
    it("modal is not visible on initial page load", () => {
      cy.visit("/");
      emailInput().should("not.exist");
      cy.contains("Want to see the unseen?").should("not.exist");
    });

    it("modal opens when the 'Show modal' button is clicked", () => {
      cy.openNewsletterModal();
      cy.contains("Want to see the unseen?").should("be.visible");
    });

    it("modal closes when the close button is clicked", () => {
      cy.openNewsletterModal();
      closeButton().click();
      cy.contains("Want to see the unseen?").should("not.exist");
    });

    it("modal closes when the backdrop overlay is clicked", () => {
      cy.openNewsletterModal();
      // Click on the semi-transparent overlay outside the modal card
      cy.get("body").click(0, 0);
      cy.contains("Want to see the unseen?").should("not.exist");
    });

    it("modal closes when the Escape key is pressed", () => {
      cy.openNewsletterModal();
      cy.get("body").type("{esc}");
      cy.contains("Want to see the unseen?").should("not.exist");
    });
  });

  // -------------------------------------------------------------------------
  describe("content", () => {
    beforeEach(() => cy.openNewsletterModal());

    it("renders the headline text", () => {
      cy.contains("h3", "Want to see the unseen?").should("be.visible");
    });

    it("renders the subheading copy", () => {
      cy.contains("A gamechanger is coming.").should("be.visible");
      cy.contains("Get ready for the impossible made possible.").should(
        "be.visible",
      );
    });

    it("renders the hero image", () => {
      cy.get('img[src*="hero.jpg"]').should("exist");
    });

    it("renders the e-mail input", () => {
      emailInput().should("be.visible");
    });

    it("renders the first clinic address input", () => {
      clinicInput(0).should("be.visible");
    });

    it("renders the terms-and-conditions checkbox", () => {
      checkbox().should("exist");
    });

    it("renders the submit button", () => {
      submitButton().should("be.visible");
    });

    it("renders the 'Add another line' button", () => {
      addAnotherLine().should("be.visible");
    });
  });

  // -------------------------------------------------------------------------
  describe("form validation", () => {
    beforeEach(() => cy.openNewsletterModal());

    it("shows an error when submitting with no email", () => {
      submitButton().click();
      cy.contains("E-mail is required.").should("be.visible");
    });

    it("shows an error for an invalid email address", () => {
      emailInput().type("not-an-email");
      submitButton().click();
      cy.contains("Please enter a valid e-mail address.").should("be.visible");
    });

    it("shows an error when terms are not accepted", () => {
      emailInput().type("user@example.com");
      submitButton().click();
      cy.contains("You must accept the terms and conditions.").should(
        "be.visible",
      );
    });

    it("clears validation errors after a valid submission", () => {
      submitButton().click();
      cy.contains("E-mail is required.").should("be.visible");

      emailInput().type("user@example.com");
      checkbox().check({ force: true });
      submitButton().click();

      cy.contains("E-mail is required.").should("not.exist");
      cy.contains("Please enter a valid e-mail address.").should("not.exist");
      cy.contains("You must accept the terms and conditions.").should(
        "not.exist",
      );
    });
  });

  // -------------------------------------------------------------------------
  describe("form submission", () => {
    beforeEach(() => cy.openNewsletterModal());

    it("closes the modal after a successful submission", () => {
      emailInput().type("user@example.com");
      checkbox().check({ force: true });
      submitButton().click();
      cy.contains("Want to see the unseen?").should("not.exist");
    });

    it("updates the data preview with the submitted email", () => {
      emailInput().type("user@example.com");
      checkbox().check({ force: true });
      submitButton().click();
      cy.contains("user@example.com").should("be.visible");
    });

    it("updates the data preview with the clinic address", () => {
      emailInput().type("user@example.com");
      clinicInput(0).type("My Clinic");
      checkbox().check({ force: true });
      submitButton().click();
      cy.contains("My Clinic").should("be.visible");
    });

    it("does not submit the form when it is invalid", () => {
      submitButton().click();
      cy.contains("Want to see the unseen?").should("be.visible");
    });
  });

  // -------------------------------------------------------------------------
  describe("dynamic clinic address lines", () => {
    beforeEach(() => cy.openNewsletterModal());

    it("starts with exactly one clinic address line", () => {
      clinicInput(0).should("exist");
      clinicInput(1).should("not.exist");
    });

    it("adds a second address line when 'Add another line' is clicked", () => {
      addAnotherLine().click();
      clinicInput(1).should("be.visible");
    });

    it("removes an address line when the remove button is clicked", () => {
      addAnotherLine().click();
      clinicInput(1).should("be.visible");
      removeLineButton(2).click();
      clinicInput(1).should("not.exist");
    });

    it("allows adding up to three address lines", () => {
      addAnotherLine().click();
      addAnotherLine().click();
      clinicInput(0).should("exist");
      clinicInput(1).should("exist");
      clinicInput(2).should("exist");
    });

    it("disables 'Add another line' at the maximum of 3 lines", () => {
      addAnotherLine().click();
      addAnotherLine().click();
      addAnotherLine().should("be.disabled");
    });

    it("includes all clinic lines in the data preview after submission", () => {
      addAnotherLine().click();
      clinicInput(0).type("Clinic A");
      clinicInput(1).type("Clinic B");
      emailInput().type("user@example.com");
      checkbox().check({ force: true });
      submitButton().click();
      cy.contains("Clinic A").should("be.visible");
      cy.contains("Clinic B").should("be.visible");
    });
  });
});

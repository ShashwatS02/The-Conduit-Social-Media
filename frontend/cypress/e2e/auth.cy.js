// frontend/cypress/e2e/auth.cy.js
describe("Authentication Flow", () => {
  it("allows a user to log in and redirects to the dashboard", () => {
    cy.visit("/login");

    cy.get("input#email").type("test1@example.com");
    cy.get("input#password").type("password123");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/");
    cy.contains("Welcome, testuser1").should("be.visible");
  });
});

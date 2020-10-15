/* global cy, Cypress */

Cypress.on('window:before:load', win => {
    cy.spy(win.console, 'error')
})
/// <reference types="cypress" />

describe('hooks', () => {
    it('should run starting callbacks', () => {
        cy.visit('/tests/cypress/fixtures/hooks')

        cy.window().then(win => {
            cy.wrap(win.starting).should('equal', 1)
        })
    })

    it('should run started callbacks', () => {
        cy.visit('/tests/cypress/fixtures/hooks')

        cy.window().then(win => {
            cy.wrap(win.started).should('equal', 1)
        })
    })
})
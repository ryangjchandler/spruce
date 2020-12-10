/// <reference types="cypress" />

describe('reset', () => {
    it('should re-render after state reset', () => {
        cy.visit('/tests/cypress/fixtures/reset')

        cy.get('span').should('have.text', 'car')

        cy.get('button').click()

        cy.get('span').should('have.text', 'boo')
    })
})
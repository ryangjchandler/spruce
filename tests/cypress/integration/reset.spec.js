/// <reference types="cypress" />

describe('reset', () => {
    it('should re-render after state reset', () => {
        cy.visit('/tests/cypress/fixtures/reset')

        cy.get('span[data-basic]').should('have.text', 'car')

        cy.get('button[data-basic-update]').click()

        cy.get('span[data-basic]').should('have.text', 'boo')

        cy.get('[data-null-store]').should('have.text', '')

        cy.get('[data-null-store-update]').click()

        cy.get('[data-null-store]').should('have.text', 'Ryan')
    })
})
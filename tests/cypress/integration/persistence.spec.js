/* global describe, it, cy */

describe('persisted stores', () => {
    it('should not fail when persisted store is initialised', () => {
        cy.visit('/tests/cypress/fixtures/persistence/init.html')

        cy.get('p').should('have.text', 'bar')
    })

    it('should persist data between visits', () => {
        cy.visit('/tests/cypress/fixtures/persistence/check-persisted.html')

        cy.get('p').should('have.text', 'bar')

        cy.get('button').click()
        cy.get('p').should('have.text', 'car')

        cy.reload()

        cy.get('p').should('have.text', 'car')
    })

    it('should persist data between visits using a custom driver', () => {
        cy.visit('/tests/cypress/fixtures/persistence/check-persisted.html')

        cy.get('p').should('have.text', 'bar')

        cy.get('button').click()
        cy.get('p').should('have.text', 'car')

        cy.reload()

        cy.get('p').should('have.text', 'car')
    })

    it('should be able to call store methods when persisted', () => {
        cy.visit('/tests/cypress/fixtures/persistence/store-methods.html')

        cy.get('p').should('have.text', 'bar')

        cy.get('button').click()
        cy.get('p').should('have.text', 'car')
    })
})
/// <reference types="cypress" />

describe('watchers', () => {
    it('can watch for changes on a store', () => {
        cy.visit('/tests/cypress/fixtures/watchers/init.html')

        cy.get('p').should('have.text', 'bar')
        cy.get('span').should('have.text', 'boo')

        cy.get('button').click()

        cy.get('p').should('have.text', 'car')
        cy.get('span').should('have.text', 'bop')
    })
})
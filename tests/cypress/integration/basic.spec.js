/// <reference types="cypress" />

describe('basic', () => {
    it('should render store correctly', () => {
        cy.visit('/tests/cypress/fixtures/basic')

        cy.get('span').should('have.text', 'car')
    })

    it('should react to state changes', () => {
        cy.visit('/tests/cypress/fixtures/basic/reactivity.html')

        cy.get('span').should('have.text', 'car')

        cy.get('button').click()

        cy.get('span').should('have.text', 'boo')
    })
})
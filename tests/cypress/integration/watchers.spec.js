/// <reference types="cypress" />

describe('watchers', () => {
    it('can watch for changes on a store', () => {
        cy.visit('/tests/cypress/fixtures/watchers/init.html')

        cy.get('p').should('have.text', 'bar')
        cy.get('[data-bar]').should('have.text', 'boo')

        cy.get('[data-change-foo]').click()

        cy.get('p').should('have.text', 'car')
        cy.get('[data-bar]').should('have.text', 'bop')

        cy.get('[data-todo-item]').should('have.length', 0)
        cy.get('[data-todo-label]').should('have.text', 'Yes!')

        cy.get('[data-add-todo]').click()

        cy.get('[data-todo-item]').should('have.length', 1)
        cy.get('[data-todo-label]').should('have.text', 'Yay!')

        cy.get('[data-change-name]').click()

        cy.get('[data-todo-label]').should('have.text', 'Changed!')
    })
})
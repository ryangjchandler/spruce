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

        cy.get('[data-reset-todo-label]').click()
        cy.get('[data-todo-label]').should('have.text', 'Yes!')

        cy.get('[data-reset-todos]').click()

        cy.get('[data-todo-item]').should('have.length', 0)
        cy.get('[data-todo-label]').should('have.text', 'Yay!')

        cy.get('[data-change-name]').click()

        cy.get('[data-todo-label]').should('have.text', 'Changed!')

        cy.get('[data-input-todo1]').type('sample')
        cy.get('[data-add-todo1]').click()
        cy.get('[data-todo1-item]').should('have.length', 1)
        cy.get('[data-todo2-item]').should('have.length', 1)
        cy.get('[data-todo1-item]').eq(0).should('contain.text', 'sample')
        cy.get('[data-todo2-item]').eq(0).should('contain.text', 'sample')

        cy.get('[data-input-todo2]').type('sample2')
        cy.get('[data-add-todo2]').click()
        cy.get('[data-todo1-item]').should('have.length', 2)
        cy.get('[data-todo2-item]').should('have.length', 2)
        cy.get('[data-todo1-item]').eq(0).should('contain.text', 'sample')
        cy.get('[data-todo2-item]').eq(0).should('contain.text', 'sample')
        cy.get('[data-todo1-item]').eq(1).should('contain.text', 'sample2')
        cy.get('[data-todo2-item]').eq(1).should('contain.text', 'sample2')
    })
})

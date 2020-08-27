import Alpine from 'alpinejs'
import Spruce from '../dist/spruce'
import { waitFor } from '@testing-library/dom'

beforeEach(() => {
    Spruce.subscribers = []
})

beforeAll(() => {
    window.Spruce = Spruce
    window.Alpine = Alpine
})

test('$store > data can be set inside component', async () => {
    document.body.innerHTML = `
        <div x-data x-subscribe>
            <span x-text="$store.foo.bar"></span>
            <button @click="$store.foo.bar = 'car'"></button>
        </div>
    `

    Spruce.store('foo', {
        bar: 'bob'
    })

    await Spruce.start()
    
    Alpine.start()

    document.querySelector('button').click()

    await waitFor(() => {
        expect(Spruce.stores.foo.bar).toEqual('car')
        expect(document.querySelector('span').innerText).toEqual('car')
    })
})

test('$store > array data causes DOM updates', async () => {
    document.body.innerHTML = `
        <div x-data>
            <template x-for="item in $store.todo.todos">
                <p x-text="item"></p>
            </template>
            <button @click="$store.todo.todos.push('foo')"></button>
        </div>
    `

    Spruce.store('todo', {
        todos: []
    })

    await Spruce.start()
    
    Alpine.start()

    expect(document.querySelector('p')).toBeFalsy()

    document.querySelector('button').click()

    await waitFor(() => {
        expect(document.querySelector('p')).toBeTruthy()
        expect(document.querySelector('p').innerText).toEqual('foo')
    })
})
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

test('$store > can be used inside of component without subscribing', async () => {
    document.body.innerHTML = `
        <div x-data>
            <span x-text="$store.foo.bar"></span>
        </div>
    `

    Spruce.store('foo', { bar: 'car' })

    await Spruce.start()
    Alpine.start()

    await waitFor(() => {
        expect(document.querySelector('span').innerText).toEqual('car')
    })
})

test('$store > modifying store value will trigger component re-render', async () => {
    document.body.innerHTML = `
        <div x-data>
            <span x-text="$store.foo.bar"></span>
            <button @click="$store.foo.bar = 'boo'"></button>
        </div>
    `

    Spruce.store('foo', { bar: 'car' })

    await Spruce.start()
    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('car')

    document.querySelector('button').click()

    await waitFor(() => {
        expect(document.querySelector('span').innerText).toEqual('boo')
    })
})
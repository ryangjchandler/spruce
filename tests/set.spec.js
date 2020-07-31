import Alpine from 'alpinejs'
import Spruce from '../dist/spruce'
import { waitFor } from '@testing-library/dom'

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
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

test('$store > data can be retrieved from store inside component', async () => {
    document.body.innerHTML = `
        <div x-data x-subscribe>
            <span x-text="$store.foo.bar"></span>
        </div> 
    `

    Spruce.store('foo', {
        bar: 'bob'
    })

    await Spruce.start()
    
    Alpine.start()

    await waitFor(() => {
        expect(document.querySelector('span').innerText).toEqual('bob')
    })
})
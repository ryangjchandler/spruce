import Spruce from '../dist/spruce'
import Alpine from 'alpinejs'
import { waitFor } from '@testing-library/dom'

beforeEach(() => {
    Spruce.stores = {}
})

beforeAll(() => {
    window.Spruce = Spruce
    window.Alpine = Alpine
})

test('.reset() > will overwrite existing properties', () => {
    Spruce.store('example', {
        foo: 'bar'
    })

    expect(Spruce.stores.example.foo).toEqual('bar')

    Spruce.reset('example', {
        foo: 'bob'
    })

    expect(Spruce.stores.example.foo).toEqual('bob')
})

test('.reset() > will make nested objects reactive', async () => {
    document.body.innerHTML = `
        <div x-data x-subscribe>
            <span x-text="$store.example.foo.bob"></span>
        </div>
    `
    
    Spruce.store('example', {
        foo: {
            bob: 'bar'
        }
    })

    expect(Spruce.stores.example.foo.bob).toEqual('bar')

    await Spruce.start()

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('bar')

    Spruce.reset('example', {
        foo: {
            bob: 'car'
        }
    })

    await waitFor(() => {
        expect(Spruce.stores.example.foo.bob).toEqual('car')
        expect(document.querySelector('span').innerText).toEqual('car')
    })
})
import Alpine from 'alpinejs'
import Spruce from '../dist/spruce'
import { waitFor } from '@testing-library/dom'

beforeEach(() => {
    Spruce.subscribers = []
})

beforeAll(() => {
    window.Spruce = Spruce
    window.Alpine = Alpine

    window.localStorage = {
        storage: {},
        getItem(key) {
            return this.storage[key]
        },
        setItem(key, value) {
            this.storage[key] = value
        }
    }
})

test('persisted stores are correctly persisted', async () => {
    document.body.innerHTML = `
        <div x-data>
            <input type="text" x-model="$store.persisted.foo">
        </div>
    `
    
    Spruce.store('persisted', {
        foo: 'bar',
    }, true)

    await Spruce.start()

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('bar')

    document.querySelector('input').value = 'car'

    document.querySelector('input').dispatchEvent(new Event('input'))

    await waitFor(() => {
        expect(document.querySelector('input').value).toEqual('car')
        expect(Spruce.retrieveFromLocalStorage('persisted').foo).toEqual('car')
    })
})
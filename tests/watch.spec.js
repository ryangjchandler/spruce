import Spruce from '../dist/spruce'
import Alpine from 'alpinejs'
import { waitFor } from '@testing-library/dom'

beforeEach(() => {
    Spruce.subscribers = []
})

beforeAll(() => {
    window.Spruce = Spruce
    window.Alpine = Alpine
})

test('.watch() > can listen for changes to property', async () => {
    let fixture = undefined
    
    Spruce.store('example', {
        cool: 'stuff'
    })

    Spruce.watch('example.cool', (value) => {
        fixture = value
    })

    await Spruce.start()

    expect(fixture).toBeUndefined()

    Spruce.stores.example.cool = 'amazing'

    expect(fixture).toEqual('amazing')
})
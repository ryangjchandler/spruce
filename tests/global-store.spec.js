import Alpine from 'alpinejs'
import Spruce from '../dist/spruce'
import { waitFor } from '@testing-library/dom'

beforeEach(() => {
    Spruce.subscribers = []
})

beforeAll(() => {
    window.Spruce = Spruce
    window.$store = Spruce.stores
})

test('$store > is available as global object', () => {
    Spruce.config({ globalStoreVariable: true })

    expect(Spruce.options.globalStoreVariable).toBeTruthy()

    Spruce.start()

    expect(window.$store).toEqual(Spruce.stores)
})
import Alpine from 'alpinejs'
import Spruce from '../dist/spruce'

beforeEach(() => {
    Spruce.subscribers = []
})

beforeAll(() => {
    window.Spruce = Spruce
    window.Alpine = Alpine
})

test('.starting() > callbacks are executed', () => {
    let fixture = 0;

    Spruce.starting(() => fixture++)

    Spruce.start()

    expect(fixture).toEqual(1)
})

test('.started() > callbacks are executed', () => {
    let fixture = 0;

    Spruce.started(() => fixture++)

    Spruce.start()

    expect(fixture).toEqual(1)
})
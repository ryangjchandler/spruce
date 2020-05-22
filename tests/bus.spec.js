import Spruce from '../dist/spruce'
import Alpine from 'alpinejs'
import { waitFor } from '@testing-library/dom'

beforeEach(() => {
    Spruce.subscribers = []
})

beforeAll(() => {
    window.Spruce = Spruce
})

/* Spruce.on() */

test('.on() > can be used to register event listeners', () => {
    Spruce.on('example', (event) => {})

    expect(Spruce.events.events.hasOwnProperty('example')).toBeTruthy()
})

test('.on() > listener can access store', () => {
    Spruce.store('foo', {
        bar: 'bob'
    })

    let fixture = undefined;

    Spruce.on('example', (detail) => {
        fixture = detail
    })

    Spruce.emit('example')

    expect(fixture.store).toEqual(Spruce.stores)
})

/* Spruce.once() */

test('.once() > can be used to register event listeners', () => {
    Spruce.once('once', (event) => {})

    expect(Spruce.events.events.hasOwnProperty('once')).toBeTruthy()
})

test('.once() > will unhook listener after first run', () => {
    let fixture = 0

    Spruce.once('once', (event) => {
        fixture += 10
    })

    expect(fixture).toEqual(0)

    Spruce.emit('once')

    expect(fixture).toEqual(10)

    Spruce.emit('once')

    expect(fixture).toEqual(10)
})

/* Spruce.emit() */

test('.emit() > will run registered listeners', () => {
    let fixture = 0;

    Spruce.on('example', (detail) => {
        fixture =+ detail.inc
    })

    Spruce.emit('example', { inc: 10 })

    expect(fixture).toEqual(10)
})

test('.emit() > will dispatch browser event to window with spruce: prefix', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }" @spruce:example.window="foo = $event.detail.foo">
            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('bar')

    Spruce.emit('example', { foo: 'car' })

    await waitFor(() => {
        expect(document.querySelector('span').innerText).toEqual('car')
    })
})

test('.watch() > can listen for changes to property', async () => {
    let fixture = undefined
    let oldFixture = undefined
    
    Spruce.store('example', {
        cool: 'stuff'
    })

    Spruce.watch('example.cool', (previous, value) => {
        oldFixture = previous
        fixture = value
    })

    await Spruce.start()

    expect(fixture).toBeUndefined()

    Spruce.stores.example.cool = 'amazing'

    expect(fixture).toEqual('amazing')
    expect(oldFixture).toEqual('stuff')
})

test('.off() > can unregister listener', () => {
    let fixture = undefined;

    const callback = () => {
        fixture = 0
    }

    Spruce.on('fixture-event', callback)
    
    Spruce.off('fixture-event', callback)

    Spruce.emit('fixture-event')

    expect(fixture).toBeUndefined()
})

test('.off() > returned when calling .on()', () => {
    let fixture = undefined;

    let off = Spruce.on('fixture-event', () => {
        fixture = 0
    })

    off()

    Spruce.emit('fixture-event')

    expect(fixture).toBeUndefined()
})
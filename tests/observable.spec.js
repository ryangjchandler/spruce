import { createObservable } from '../src/observable'

test('createObservable > successfully wraps object', () => {
    let target = {
        foo: 'bar'
    }

    let observable = createObservable(target, { get: () => {} })

    expect(observable.foo).toEqual('bar')
})

test('createObservable > can access deeply nested props', () => {
    let target = {
        foo: {
            bar: {
                baz: 'bob'
            }
        }
    }

    let observable = createObservable(target, { get: () => {} })

    expect(observable.foo.bar.baz).toEqual('bob')
})

test('createObservable > will run callback on set trap', () => {
    let target = {
        foo: 'bar'
    }

    let fixture = 0

    let observable = createObservable(target, {
        set: () => {
            fixture = 100
        }
    })

    observable.foo = 'bob'

    expect(fixture).toEqual(100)
})

test('createObservable > will run set trap for Array.* methods', () => {
    let target = {
        items: [
            'foo',
            'bar'
        ],
    }


    let fixture

    let observable = createObservable(target, {
        set() {
            fixture = 'baz'
        }
    })

    observable.items.push('baz')

    expect(target.items).toContain('baz')
    expect(fixture).toEqual('baz')
})
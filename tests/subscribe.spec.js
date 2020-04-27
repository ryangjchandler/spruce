import Spruce from '../dist/spruce'
import { waitFor } from '@testing-library/dom'

test('x-subscribe > correctly updates x-init directive', async () => {
    document.body.innerHTML = `
        <div x-subscribe></div>
    `

    Spruce.start()

    await waitFor(() => {
        expect(document.querySelector('div').getAttribute('x-init')).toEqual('$store = Spruce.subscribe($el)')
    })
})

test('x-subscribe > correctly updates x-init when already defined', async () => {
    document.body.innerHTML = `
        <div x-subscribe x-init="testing = true"></div>
    `

    Spruce.start()

    await waitFor(() => {
        expect(document.querySelector('div').getAttribute('x-init')).toEqual('$store = Spruce.subscribe($el); testing = true')
    })
})
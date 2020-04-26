import Spruce from '../dist/spruce.module.js'

Spruce.store('dropdown', {
    hello: 'world'
})

window.Spruce = Spruce
window.Spruce.start()
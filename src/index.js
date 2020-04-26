import { domReady, buildInitExpression } from './utils'
import { createObservable } from './observable'

const Spruce = {

    stores: {},

    subscribers: [],

    start: async function () {
        await domReady()

        document.querySelectorAll('[x-subscribe]').forEach(el => {
            el.setAttribute('x-init', buildInitExpression(el))
            el.removeAttribute('x-subscribe')
        })

        this.stores = createObservable(this.stores, (key, value) => {
            this.updateSubscribers(key, value)
        })
    },

    store: function (name, state = {}) {
        if (! this.stores[name]) {
            this.stores[name] = state
        }
    },

    subscribe(el) {
        this.subscribers.push(el)

        return this.stores
    },

    updateSubscribers(key, value) {
        this.subscribers.forEach(el => {
            if (el.__x !== 'undefined') {
                el.__x.$data.spruce = [key, value]
            }
        })
    }
}

const deferrer = window.deferLoadingAlpine || function (callback) { callback() }

window.deferLoadingAlpine = function (callback) {
    window.Spruce = Spruce
    window.Spruce.start()

    deferrer(callback)
}

export default Spruce
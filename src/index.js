import { domReady, buildInitExpression } from './utils'
import { createObservable } from './observable'
import EventBus from './bus'

const Spruce = {
    options: {
        globalStoreVariable: false,
    },

    events: EventBus,

    stores: {},

    subscribers: [],

    start: async function () {
        await domReady()

        document.querySelectorAll('[x-subscribe]').forEach(el => {
            el.setAttribute('x-init', buildInitExpression(el))
            el.removeAttribute('x-subscribe')
        })

        this.stores = createObservable(this.stores, {
            set: (key, value) => {
                this.updateSubscribers(key, value)
            }
        })

        if (this.options.globalStoreVariable) {
            document.querySelectorAll('[x-data]').forEach(el => {
                if (! this.subscribers.includes(el)) {
                    this.subscribers.push(el)
                }
            })
            
            window.$store = this.stores
        }
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
            if (el.__x !== undefined) {
                el.__x.$data.spruce = value
            }
        })
    },

    config(options = {}) {
        this.options = Object.assign(this.options, options)
    },

    on(name, callback) {
        this.events.on(name, callback)
    },
}

const deferrer = window.deferLoadingAlpine || function (callback) { callback() }

window.deferLoadingAlpine = function (callback) {
    window.Spruce = Spruce
    window.Spruce.start()

    deferrer(callback)
}

export default Spruce
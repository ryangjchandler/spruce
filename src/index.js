import { domReady, buildInitExpression, isNullOrUndefined } from './utils'
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

        this.emit('init')
        
        this.attach()

        document.addEventListener('turbolinks:render', this.attach)

        this.stores = createObservable(this.stores, {
            set: (target, key, value, oldValue) => {
                this.events.runWatchers(this.stores, target, key, oldValue)

                this.updateSubscribers()
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

    attach() {
        document.querySelectorAll('[x-subscribe]').forEach(el => {
            el.setAttribute('x-init', buildInitExpression(el))
            el.removeAttribute('x-subscribe')
        })
    },

    store: function (name, state) {
        if (! this.stores[name]) {
            this.stores[name] = state
        }

        return this.stores[name]
    },

    reset: function (name, state) {
        this.stores[name] = state
    },

    subscribe(el) {
        this.subscribers.push(el)

        return this.stores
    },

    updateSubscribers() {
        this.subscribers.forEach(el => {
            if (el.__x !== undefined) {
                el.__x.updateElements(el)
            }
        })
    },

    config(options = {}) {
        this.options = Object.assign(this.options, options)
    },

    on(name, callback) {
        return this.events.on(name, callback)
    },

    once(name, callback) {
        return this.events.once(name, callback)
    },

    off(name, callback) {
        this.events.off(name, callback)
    },

    emit(name, data = {}) {
        this.events.emit(name, { ...data, store: this.stores })
    },

    watch(dotNotation, callback) {
        this.events.watch(dotNotation, callback)
    }
}

const deferrer = window.deferLoadingAlpine || function (callback) { callback() }

window.deferLoadingAlpine = function (callback) {
    window.Spruce = Spruce
    window.Spruce.start()

    deferrer(callback)
}

export default Spruce

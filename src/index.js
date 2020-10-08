import { domReady } from './utils'
import { createObservable } from './observable'
import EventBus from './bus'

const Spruce = {
    events: EventBus,

    stores: {},

    subscribers: [],

    async start() {
        await domReady()

        this.emit('init')
        
        this.attach()

        this.stores = createObservable(this.stores, {
            set: (target, key, value) => {
                this.events.runWatchers(this.stores, target, key, value)

                this.updateSubscribers()
            }
        })
    },

    attach() {
        if (! window.Alpine) {
            throw new Error('[Spruce] You must be using Alpine >= 2.5.0 to use Spruce.')
        }

        const self = this

        window.Alpine.addMagicProperty('store', el => {
            self.subscribe(el)

            return self.stores
        })
    },

    store(name, state) {
        if (! this.stores[name]) {
            this.stores[name] = state
        }

        return this.stores[name]
    },

    reset(name, state) {
        this.stores[name] = state
    },

    subscribe(el) {
        if (! this.subscribers.includes(el)) {
            this.subscribers.push(el)
        }

        return this.stores
    },

    updateSubscribers() {
        this.subscribers.filter(el => !! el.__x).forEach(el => {
            el.__x.updateElements(el)
        })
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

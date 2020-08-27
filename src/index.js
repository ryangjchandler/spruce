import { domReady } from './utils'
import { createObservable } from './observable'

const Spruce = {
    stores: {},

    subscribers: [],

    async start() {
        await domReady()

        this.emit('init')
        
        this.attach()

        document.addEventListener('turbolinks:render', this.attach)

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
    }
}

const deferrer = window.deferLoadingAlpine || function (callback) { callback() }

window.deferLoadingAlpine = function (callback) {
    window.Spruce = Spruce
    window.Spruce.start()

    deferrer(callback)
}

export default Spruce

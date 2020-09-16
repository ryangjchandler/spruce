import { domReady, getMethods } from './utils'
import { createObservable } from './observable'

const Spruce = {
    stores: {},

    persisted: [],

    subscribers: [],

    disableReactivity: false,

    async start() {
        await domReady()
        
        this.attach()

        document.addEventListener('turbolinks:render', this.attach)

        this.stores = createObservable(this.stores, {
            set: () => {
                if (this.disableReactivity) {
                    return
                }

                this.updateSubscribers()

                this.disableReactivity = true
                this.persisted.forEach(this.updateLocalStorage.bind(this))
                this.disableReactivity = false
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

    store(name, state, persist = false) {
        if (persist) {
            this.stores[name] = this.retrieveFromLocalStorage(name, getMethods(state))

            if (! this.persisted.includes(name)) {
                this.persisted.push(name)
            }
        }

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

    retrieveFromLocalStorage(name, methods = {}) {
        const storage = JSON.parse(window.localStorage.getItem(`__spruce:${name}`))

        return storage ? Object.assign(methods, storage) : null
    },

    updateLocalStorage(name) {
        window.localStorage.setItem(`__spruce:${name}`, JSON.stringify(this.store(name)))
    }
}

const deferrer = window.deferLoadingAlpine || function (callback) { callback() }

window.deferLoadingAlpine = function (callback) {
    window.Spruce = Spruce
    window.Spruce.start()

    deferrer(callback)
}

export default Spruce

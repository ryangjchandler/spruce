import { domReady, getMethods } from './utils'
import { createObservable } from './observable'
import compareVersions from 'compare-versions';

const Spruce = {
    stores: {},

    persisted: [],

    subscribers: [],

    watchers: {},

    disableReactivity: false,

    async start() {
        await domReady()

        this.attach()

        this.stores = createObservable(this.stores, {
            set: (target, key, value) => {
                if (this.disableReactivity) {
                    return
                }

                this.updateSubscribers()

                this.runWatchers(this.stores, target, key, value)

                this.disableReactivity = true

                try {
                    this.persisted.forEach(this.updateLocalStorage.bind(this))
                } catch (e) {
                    // Do nothing here (thanks Safari!)
                }

                this.disableReactivity = false
            }
        })
    },

    attach() {
        if (!window.Alpine || ! compareVersions.compare(window.Alpine.version, '2.7.0', '>=')) {
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
            try {
                this.stores[name] = this.retrieveFromLocalStorage(name, getMethods(state))

                if (!this.persisted.includes(name)) {
                    this.persisted.push(name)
                }
            } catch (e) {
                // Do nothing here (thanks Safari!)
            }
        }

        if (!this.stores[name]) {
            this.stores[name] = state
        }

        return this.stores[name]
    },

    reset(name, state) {
        this.stores[name] = state
    },

    subscribe(el) {
        if (!this.subscribers.includes(el)) {
            this.subscribers.push(el)
        }

        return this.stores
    },

    updateSubscribers() {
        this.subscribers.filter(el => !!el.__x).forEach(el => {
            el.__x.updateElements(el)
        })
    },

    retrieveFromLocalStorage(name, methods = {}) {
        const storage = JSON.parse(window.localStorage.getItem(`__spruce:${name}`))

        return storage ? Object.assign(methods, storage) : null
    },

    updateLocalStorage(name) {
        window.localStorage.setItem(`__spruce:${name}`, JSON.stringify(this.store(name)))
    },

    watch(name, callback) {
        if (!this.watchers[name]) {
            this.watchers[name] = []
        }

        this.watchers[name].push(callback)
    },

    runWatchers(stores, target, key, value) {
        const self = this

        if (self.watchers[key]) {
            return self.watchers[key].forEach(callback => callback(value))
        }

        Object.keys(self.watchers)
            .filter(watcher => watcher.includes('.'))
            .forEach(fullDotNotationKey => {
                let dotNotationParts = fullDotNotationKey.split('.')

                if (key !== dotNotationParts[dotNotationParts.length - 1]) return

                dotNotationParts.reduce((comparison, part) => {
                    if (comparison[key] === target[key] || Object.is(target, comparison)) {
                        self.watchers[fullDotNotationKey].forEach(callback => callback(value))
                    }

                    return comparison[part]
                }, stores)
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

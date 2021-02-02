import { getMethods, checkForAlpine, isObject, isArray, isNullOrUndefined } from './utils'
import { createObservable } from './observable'

const Spruce = {
    stores: {},

    persistenceDriver: window.localStorage,

    persisted: [],

    subscribers: [],

    pendingWatchers: {},

    disableReactivity: false,

    startingCallbacks: [],

    startedCallbacks: [],

    hasStarted: false,

    start() {
        this.startingCallbacks.forEach(fn => fn())

        this.attach()

        this.stores = createObservable(this.stores, {
            get: (target, key, receiver) => {
                if (Object.is(receiver, this.stores) && ['get', 'set', 'toggle', 'call', 'clear'].includes(key)) {
                    return this[key].bind(this)
                }

                return Reflect.get(target, key, receiver)
            },
            set: (target, key, value, receiver) => {
                if (this.disableReactivity) {
                    return
                }

                this.updateSubscribers()

                this.runWatchers(target, key, value, receiver)

                this.disableReactivity = true

                try {
                    this.persisted.forEach(this.updateLocalStorage.bind(this))
                } catch (e) {
                    // Do nothing here (thanks Safari!)
                }

                this.disableReactivity = false
            }
        })

        this.hasStarted = true

        this.disableReactivity = true

        Object.entries(this.pendingWatchers).forEach(([name, callbacks]) => {
            callbacks.forEach(callback => this.watch(name, callback))
        })

        this.disableReactivity = false

        this.startedCallbacks.forEach(fn => fn())
    },

    starting(callback) {
        this.startingCallbacks.push(callback)
    },

    started(callback) {
        this.startedCallbacks.push(callback)
    },

    attach() {
        if (! checkForAlpine()) {
            throw new Error('[Spruce] You must be using Alpine >= 2.5.0 to use Spruce.')
        }

        const self = this

        window.Alpine.addMagicProperty('store', el => {
            self.subscribe(el)

            return self.stores
        })
    },

    store(name, state, persist = false) {
        if (typeof state === 'function') {
            state = state()
        }
        
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
        if (this.stores[name] === undefined) {
            return;
        }
        
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
        const value = this.persistenceDriver.getItem(`__spruce:${name}`)

        if (! value) {
            return null
        }

        let storage = JSON.parse(value)

        if (typeof storage === 'object') {
            storage = Object.assign(methods, storage)

            delete storage.__watchers
            delete storage.__key_name
        }

        return storage
    },

    updateLocalStorage(name) {
        const store = { ...this.store(name) }

        delete store.__watchers
        delete store.__key_name

        this.persistenceDriver.setItem(`__spruce:${name}`, JSON.stringify(this.store(name)))
    },

    get(name, target = this.stores) {
        return name.split('.').reduce((target, part) => target[part], target)
    },

    set(name, value, target = this.stores) {
        if (! isArray(name)) {
            name = name.split('.')
        }

        if (name.length === 1) return target[name[0]] = value

        if (target[name[0]]) {
            return this.set(name.slice(1), value, target[name[0]])
        } else {
            target[name[0]] = {}

            return this.set(name.slice(1), value, target[name[0]])
        }
    },

    toggle(name) {
        return this.set(name, ! this.get(name))
    },

    call(name, ...args) {
        return this.get(name)(...args)
    },

    clear(name) {
        return this.persistenceDriver.removeItem(`__spruce:${name}`)
    },

    watch(name, callback) {
        if (! this.hasStarted) {
            this.pendingWatchers[name] || (this.pendingWatchers[name] = [])

            this.pendingWatchers[name].push(callback)

            return [() => this.unwatch(name, callback)]
        }

        const nameParts = name.split('.')

        const target = nameParts.reduce((target, part) => {
            const sub = target[part]

            if (! isNullOrUndefined(sub) && (isObject(sub) || isArray(sub))) {
                return sub
            }

            return target
        }, this.stores)

        /**
         * If the target object / array is the property
         * that needs to be watched, a magic `__self` key is
         * used so that runner can pick up on it later.
         */
        const part = Object.is(target, this.get(name)) ? '__self' : nameParts[nameParts.length - 1]

        if (! target.__watchers) {
            target.__watchers = new Map
        }
        
        if (! target.__watchers.has(part)) {
            target.__watchers.set(part, new Set)
        }

        target.__watchers.get(part).add(callback)

        return [() => this.unwatch(name, callback)]
    },

    unwatch(name, callback) {
        const nameParts = name.split('.')

        const target = nameParts.reduce((target, part) => {
            const sub = target[part]

            if (! isNullOrUndefined(sub) && (isObject(sub) || isArray(sub))) {
                return sub
            }

            return target
        }, this.stores)

        const part = Object.is(target, this.get(name)) ? '__self' : nameParts[nameParts.length - 1]
        const watchers = target.__watchers

        if (! watchers.has(part)) {
            return
        }

        watchers.get(part).delete(callback)
    },

    watchers(name) {
        const nameParts = name.split('.')

        const target = nameParts.reduce((target, part) => {
            const sub = target[part]

            if (! isNullOrUndefined(sub) && (isObject(sub) || isArray(sub))) {
                return sub
            }

            return target
        }, this.stores)

        const part = Object.is(target, this.get(name)) ? '__self' : nameParts[nameParts.length - 1]

        if (! target.__watchers) {
            return {}
        }

        return target.__watchers.get(part)
    },

    runWatchers(target, key, value) {
        if (! target.__watchers) {
            return
        }

        if (target.__watchers.has(key)) {
            target.__watchers.get(key).forEach(f => f(value))
        }

        /**
         * The `__self` key is used for watchers that are registered
         * to the object or array being updated.
         */
        if (target.__watchers.has('__self')) {
            target.__watchers.get('__self').forEach(f => f(value, key))
        }
    },

    persistUsing(driver) {
        if (this.persisted.length > 0) {
            console.warn('[Spruce] You have already initialised a persisted store. Changing the driver may cause issues.')
        }

        if (typeof driver.getItem !== 'function') {
            throw new Error('[Spruce] The persistence driver must have a `getItem(key)` method.')
        }

        if (typeof driver.setItem !== 'function') {
            throw new Error('[Spruce] The persistence driver must have a `setItem(key, value)` method.')
        }

        if (typeof driver.removeItem !== 'function') {
            throw new Error('[Spruce] The persistence driver must have a `removeItem(name)` method.')
        }

        this.persistenceDriver = driver
    }
}

window.Spruce = Spruce

const deferrer = window.deferLoadingAlpine || function (callback) { callback() }

window.deferLoadingAlpine = function (callback) {
    window.Spruce.start()

    deferrer(callback)
}

export default Spruce

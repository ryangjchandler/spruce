import EventBus from './bus'

const Spruce = {
    events: EventBus,

    storesStack: {},

    TARGET_ELEMENT_ID: '__spruce_store_target',

    start() {
        this.emit('beforeMount')
            .insertTargetElementIfNotExists()
            .setupMagicProp()
            .emit('mounted')
    },

    insertTargetElementIfNotExists() {
        if (this.targetElement()) {
            return this
        }

        const el = document.createElement('div')

        el.id = this.TARGET_ELEMENT_ID
        el.setAttribute('x-data', '{ stores: {}, subscribers: [] }')

        document.body.insertBefore(el, document.body.firstChild)

        return this
    },

    setupMagicProp() {
        if (! window.Alpine) {
            throw new Error('[Spruce] Alpine >= 2.5.0 is required.')
        }

        window.Alpine.magicProperties['store'] = component => {
            let subscribers = this.targetElement().__x.$data.subscribers

            if (! subscribers.includes(component)) {
                subscribers.push(component)
            }

            if (Object.keys(this.storesStack).length > 0) {
                Object.entries(this.storesStack).forEach(([name, store]) => {
                    this.targetElement().__x.$data.stores[name] = store
                })

                this.storesStack = {}
            }

            return this.stores()
        }

        return this
    },

    targetElement() {
        return document.getElementById(this.TARGET_ELEMENT_ID)
    },

    stores() {
        const target = this.targetElement()
    
        if (! target) {
            return false
        }

        return target.__x.$data.stores
    },

    store(name, state, force = false) {
        console.log(name)
        if (this.storesStack[name] && ! force) {
            return this.storesStack[name]
        }

        if (! this.targetElement()) {
            this.storesStack[name] = state

            return this.storesStack[name]
        }

        let stores = this.stores()

        if (! stores[name] || this.force) {
            stores[name] = state
        }

        return stores[name]
    },

    reset(name, state) {
        this.store(name, state, true)
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

        return this
    },

    watch(target, callback) {
        if (! target.startsWith('stores.')) {
            target = `stores.${target}`
        }

        this.targetElement().__x.$data.$watch(target, callback)
    }
}

const deferrer = window.deferLoadingAlpine || (callback => callback())

window.deferLoadingAlpine = function (callback) {
    window.Spruce = Spruce
    window.Spruce.start()

    deferrer(callback)
}

export default Spruce

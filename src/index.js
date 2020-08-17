import EventBus from './bus'

const Spruce = {
    el: null,

    events: EventBus,

    storesStack: {},

    start() {
        this.guardAgainstAlpineMissing()

        this.emit('beforeMount')
            .insertTargetElementIfNotExists()
            .setupMagicProp()
            .emit('mounted')
    },

    guardAgainstAlpineMissing() {
        if (!window.Alpine || window.Alpine.version < "2.5.0") {
            throw new Error('[Spruce] Alpine v2.5.0 or greater is not installed');
        }
    },

    insertTargetElementIfNotExists() {
        const el = document.createElement('div')

        el.setAttribute('x-data', '{ stores: {}, subscribers: [] }')

        this.el = el

        window.Alpine.initializeComponent(this.el)

        return this
    },

    setupMagicProp() {
        window.Alpine.addMagicProperty('store', component => {
            let subscribers = this.el.__x.$data.subscribers

            if (! subscribers.includes(component)) {
                subscribers.push(component)
            }

            if (Object.keys(this.storesStack).length > 0) {
                Object.entries(this.storesStack).forEach(([name, store]) => {
                    this.el.__x.$data.stores[name] = store
                })

                this.storesStack = {}
            }

            return this.el.__x.$data.stores
        })

        return this
    },

    stores() {
        return this.el.__x.$data.stores
    },

    store(name, state, force = false) {
        if (this.storesStack[name] && !force) {
            return this.storesStack[name]
        }

        if (! this.el) {
            this.storesStack[name] = state

            return this.storesStack[name]
        }

        let stores = this.stores()

        if (!stores[name] || this.force) {
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
        if (!target.startsWith('stores.')) {
            target = `stores.${target}`
        }

        this.el.__x.$data.$watch(target, callback)
    }
}

const deferrer = window.deferLoadingAlpine || (callback => callback())

window.deferLoadingAlpine = function (callback) {
    window.Spruce = Spruce
    window.Spruce.start()

    deferrer(callback)
}

export default Spruce

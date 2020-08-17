import EventBus from './bus'

const Spruce = {
    el: null,

    events: EventBus,

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
        window.Alpine.addMagicProperty('store', function (component) {
            let subscribers = Spruce.el.__x.$data.subscribers

            if (! subscribers.includes(component)) {
                subscribers.push(component)
            }

            return Spruce.el.__x.$data.stores
        })

        return this
    },

    update() {
        console.log('test')
    },

    stores() {
        return this.el.__x.$data.stores
    },

    store(name, state, force = false) {
        let stores = this.stores()

        if (!stores[name] || force) {
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

export default {
    watchers: {},

    events: {},

    on(name, callback) {
        if (! this.events[name]) {
            this.events[name] = []
        }

        this.events[name].push(callback)

        return () => this.off(name, callback)
    },

    off(name, callback) {
        this.events[name] = this.events[name].filter(registerCallback => {
            return registerCallback !== callback
        })
    },

    emit(name, data = {}) {
        if (this.events[name]) {
            this.events[name].forEach(callback => {
                callback(data)
            })
        }

        // TODO: deal with this for IE11 :(
        // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Browser_compatibility#Polyfill
        window.dispatchEvent(new CustomEvent(`spruce:${name}`, {
            detail: data,
            bubbles: true
        }))
    },

    watch(dotNotation, callback) {
        if (! this.watchers[dotNotation]) {
            this.watchers[dotNotation] = []
        }

        this.watchers[dotNotation].push(callback)
    },

    runWatchers(stores, target, key, oldValue) {
        const self = this

        if (self.watchers[key]) {
            return self.watchers[key].forEach(callback => callback(oldValue, target[key]))
        }

        Object.keys(self.watchers)
            .filter(watcher => watcher.includes('.'))
            .forEach(fullDotNotationKey => {
                let dotNotationParts = fullDotNotationKey.split('.')

                if (key !== dotNotationParts[dotNotationParts.length - 1]) return

                dotNotationParts.reduce((comparison, part) => {
                    if (comparison[key] === target[key] || Object.is(target, comparison)) {
                        self.watchers[fullDotNotationKey].forEach(callback => callback(oldValue, target[key]))
                    }

                    return comparison[part]
                }, stores)
            })
    }
}
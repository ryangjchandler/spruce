export default {
    events: {},

    on(name, callback) {
        if (! this.events.hasOwnProperty(name)) {
            this.events[name] = []
        }

        this.events[name].push(callback)
    },

    emit(name, data = {}) {
        if (this.events.hasOwnProperty(name)) {
            this.events[name].forEach(callback => {
                callback(data)
            })
        }

        window.dispatchEvent(new CustomEvent(`spruce:${name}`, {
            detail: data,
            bubbles: true
        }))
    }
}
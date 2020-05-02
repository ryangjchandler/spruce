export default {
    events: {},

    on(name, callback) {
        if (! this.events[name]) {
            this.events[name] = []
        }

        this.events[name].push(callback)
    },

    emit(name, data = {}) {
        if (this.events[name]) {
            this.events[name].forEach(callback => {
                callback(data)
            })
        }

        // TODO: deal with this for IE11 :(
        window.dispatchEvent(new CustomEvent(`spruce:${name}`, {
            detail: data,
            bubbles: true
        }))
    }
}
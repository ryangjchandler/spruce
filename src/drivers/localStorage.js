export default {
    get(name, methods = {}) {
        const storage = JSON.parse(window.localStorage.getItem(`__spruce:${name}`))

        return storage ? Object.assign(methods, storage) : null
    },
    set(name, value) {
        window.localStorage.setItem(`__spruce:${name}`, JSON.stringify(value))
    }
}
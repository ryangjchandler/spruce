export const createObservable = (target, callback) => {
    Object.keys(target).forEach(key => {
        if (! [null, undefined].includes(target[key]) && Object.getPrototypeOf(target[key]) === Object.prototype) {
            target[key] = createObservable(target[key], callback)
        }
    })

    return new Proxy(target, {
        set(target, key, value) {
            if (typeof value === 'object') {
                value = createObservable(value, callback)
            }

            callback(key, target[key] = value)

            return true
        }
    })
}
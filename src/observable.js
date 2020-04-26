export const createObservable = (target, callback) => {
    Object.keys(target).forEach(key => {
        if (Object.getPrototypeOf(target[key]) === Object.prototype && ! [null, undefined].includes(target[key])) {
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
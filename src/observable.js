export const create = (target, callback) => {
    Object.keys(target).forEach(key => {
        if (Object.getPrototypeOf(target[key]) === Object.prototype) {
            target[key] = create(target[key], callback)
        }
    })

    return new Proxy(target, {
        set(target, key, value) {
            if (typeof value === 'object') {
                value = create(value, callback)
            }

            callback(key, target[key] = value)

            return true
        }
    })
}
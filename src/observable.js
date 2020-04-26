import { isNullOrUndefined } from './utils'

export const createObservable = (target, callback) => {
    Object.keys(target).forEach(key => {
        if (! isNullOrUndefined(target[key]) && Object.getPrototypeOf(target[key]) === Object.prototype) {
            target[key] = createObservable(target[key], callback)
        }
    })

    return new Proxy(target, {
        set(target, key, value) {
            if (! isNullOrUndefined(value) && typeof value === 'object') {
                value = createObservable(value, callback)
            }

            callback(key, target[key] = value)

            return true
        }
    })
}
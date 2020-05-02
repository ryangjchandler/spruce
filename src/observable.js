import { isNullOrUndefined } from './utils'

export const createObservable = (target, callbacks) => {
    Object.keys(target).forEach(key => {
        if (! isNullOrUndefined(target[key]) && Object.getPrototypeOf(target[key]) === Object.prototype) {
            target[key] = createObservable(target[key], callbacks)
        }
    })

    return new Proxy(target, {
        get(target, key) {
            callbacks.get(key)

            return target[key]
        },
        set(target, key, value) {
            if (! isNullOrUndefined(value) && typeof value === 'object') {
                value = createObservable(value, callbacks)
            }

            callbacks.set(key, target[key] = value)

            return true
        }
    })
}
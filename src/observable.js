import { isNullOrUndefined, isObject } from './utils'

export const createObservable = (target, callbacks) => {
    Object.keys(target).forEach(key => {
        if (! isNullOrUndefined(target[key]) && isObject(target[key])) {
            target[key] = createObservable(target[key], callbacks)
        }
    })

    return new Proxy(target, {
        set(target, key, value) {
            if (! isNullOrUndefined(value) && isObject(value)) {
                value = createObservable(value, callbacks)
            }

            callbacks.set(target, key, target[key] = value)

            return true
        }
    })
}
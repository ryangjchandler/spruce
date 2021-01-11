import { isNullOrUndefined, isObject, isArray } from './utils'

export const createObservable = (target, callbacks) => {
    Object.entries(target).forEach(([key, value]) => {
        if (! isNullOrUndefined(value) && (isObject(value) || isArray(value))) {            
            target[key] = createObservable(value, callbacks)
        }
    })

    return new Proxy(target, {
        get(target, key, receiver) {
            return callbacks.get(target, key, receiver)
        },
        set(target, key, value, receiver) {
            if (! isNullOrUndefined(value) && (isObject(value) || isArray(value))) {
                value = createObservable(value, callbacks)
            }

            let originalValue = target[key]

            target[key] = value

            // Copy watchers from the original value if they exist
            if (!isNullOrUndefined(originalValue) && !isNullOrUndefined(originalValue.__watchers)) {
                target[key].__watchers = originalValue.__watchers
            }

            callbacks.set(target, key, target[key], receiver)

            return true
        }
    })
}
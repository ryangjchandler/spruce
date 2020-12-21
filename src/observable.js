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
            if (! isNullOrUndefined(value) && isObject(value)) {
                value = createObservable(value, callbacks)
            }

            callbacks.set(target, key, target[key] = value, receiver)

            return true
        }
    })
}
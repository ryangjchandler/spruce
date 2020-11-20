import compareVersions from 'compare-versions'

export const isNullOrUndefined = value => {
    return value === null || value === undefined
}

export const isObject = _ => {
    return Object.getPrototypeOf(_) === Object.prototype
}

export const isArray = _ => Array.isArray(_)

export const getMethods = obj => {
    let methods = {}

    Object.entries(obj).filter(([_, value]) => typeof value === 'function').forEach(([key, value]) => methods[key] = value)

    return methods
}

export const isTesting = () => {
    return navigator.userAgent, navigator.userAgent.includes("Node.js")
        || navigator.userAgent.includes("jsdom")
}

export const checkForAlpine = () => {
    if (isTesting()) {
        return true
    }

    if (! window.Alpine) {
        return false
    }

    return compareVersions.compare(window.Alpine.version, '2.7.0', '>=')
}
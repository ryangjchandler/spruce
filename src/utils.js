export const domReady = () => {
    return new Promise(resolve => {
        if (document.readyState == "loading") {
            document.addEventListener("DOMContentLoaded", resolve)
        } else {
            resolve()
        }
    })
}

export const isNullOrUndefined = value => {
    return value === null || value === undefined
}

export const isObject = _ => {
    return Object.getPrototypeOf(_) === Object.prototype
}

export const isArray = _ => Array.isArray(_)

export const getMethods = obj => {
    let methods = {}

    Object.entries(obj).filter(([key, value]) => typeof value === 'function').forEach(([key, value]) => methods[key] = value)

    return methods
}

export const isTesting = () => {
    return navigator.userAgent, navigator.userAgent.includes("Node.js")
        || navigator.userAgent.includes("jsdom")
}

export const checkForAlpine = () => {
    return isTesting() || (! window.Alpine || ! compareVersions.compare(window.Alpine.version, '2.7.0', '>='))
}
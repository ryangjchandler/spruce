export const domReady = () => {
    return new Promise(resolve => {
        if (document.readyState == "loading") {
            document.addEventListener("DOMContentLoaded", resolve)
        } else {
            resolve()
        }
    })
}

export const buildInitExpression = el => {
    let expression = "$store = Spruce.subscribe($el)"

    if (el.hasAttribute('x-init')) {
        expression = `${expression}; ${el.getAttribute('x-init')}`
    }

    return expression
}

export const isNullOrUndefined = value => {
    return value === null || value === undefined
}
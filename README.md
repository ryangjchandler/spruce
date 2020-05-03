<p align="center">
    <img src="./docs/example.png" width="50%" />
</p>

# 🌲 Spruce

A lightweight state management layer for Alpine.js

![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/ryangjchandler/spruce?label=version&style=flat-square)
![GitHub file size in bytes](https://img.shields.io/github/size/ryangjchandler/spruce/dist/spruce.js?label=min%20%28no%20gzip%29&style=flat-square)

## About

Many large frameworks have their own state management solutions. One thing these libraries have in common is a higher level of complexity and a wide range of API interactions. Since Alpine.js is designed to be a simpler and lighter alternative to larger frameworks such as Vue and React, shouldn't the state management solution be as simple, if not simpler, too?

## Installation

### CDN

Include the following `<script>` tag in the `<head>` of your document:

```html
<script src="https://cdn.jsdelivr.net/gh/ryangjchandler/spruce@0.x.x/dist/spruce.umd.js"></script>
```

> **Important**: This must be added **before** loading Alpine.js when using CDN links.

### Manual (coming soon)

If you wish to include Spruce with your own bundle:

```bash
yarn add @ryangjchandler/spruce
```

Then add the following to your script:

```javascript
import Spruce from '@ryangjchandler/spruce'
```

## Usage

Spruce exposes less than a handful of possible interaction points. There is an extremely simple "subscriptions" interaction which connects the roots from your Alpine component to the global store, then there is the "stores" interaction which allows you to define scopes of global state for use throughout your components.

### Entry point

If you are using the CDN build, you can interact with Spruce using the `window.Spruce` variable:

```html
<script>
    Spruce.store('modals', {
        open: 'login',
    })
</script>
```

If you are importing Spruce into your own bundle, you can interact with it like any other variable:

**store.js**

```javascript
import Spruce from '@ryangjchandler/spruce'

Spruce.store('modals', {
    open: 'login'
})

export default Spruce
```

**app.js**

```javascript
import Store from './store'
import 'alpinejs'
```

> **Note**: You must `import` your store before Alpine.

### Subscribing your components

To access the global state from your Alpine components, you can simply add the `x-subscribe` directive to your root component.

```html
<div x-data="{}" x-subscribe>
    <span x-text="$store.application.name"></span>
</div>
```

This directive adds a new `$store` magic variable to your component. This can be used to "get" and "set" data in your global store.

### Defining global state

To define a piece of global state, you can use the `Spruce.store()` method:

```javascript
Spruce.store('application', {
    name: 'Amazing Alpine Application'
})
```

The first argument defines the top level property of the scope. The second argument defines the state for the scope, it could be a string, integer or object with nested properties.

To access the `name` property, you can do the following inside of your component:

```html
<div x-data="{}" x-subscribe>
    <span x-text="$store.application.name"></span>
</div>
```

The `<span>` will now have "Amazing Alpine Application" set as its `innerText`.

### Modifying state from outside of Alpine

You can modify your global state from external scripts using the `Spruce` object:

```javascript
Spruce.store('application', {
    name: 'Amazing Alpine Application'
})

Spruce.stores.application.name = 'Amazing Spruce Integration'
```

This will trigger Alpine to re-evaluate your subscribed components and re-render.

### Externally watching for changes

You can register watchers in a similar fashion to Alpine. All you need is the full dot-notation representation of your piece of state and a callback.

```html
<script>
    Spruce.store('form', {
        name: 'Ryan',
        email: 'support@ryangjchandler.co.uk'
    })

    Spruce.watch('form.email', (old, next) => {
        // do something with the values here
    })
<script>
```

In the above snippet, when we change the value of `form.email` either from a component or externally in a separate JavaScript file, our callback will be invoked and will receive the old value, as well as the new value. This can be useful for running automatic inline validation when a property changes, or triggering an action elsewhere in another component without the need for dispatching events.

### Removing the need for `x-subscribe`

Alpine offers a Config API. Using this API, you can enable an experimental global `$store` variable that is declared on the `window` object. This means your components do not need to manually "subscribe" to state changes:

```html
<script>
    Spruce.config({
        globalStoreVariable: true
    })
</script>

<div x-data>
    <span x-text="$store.foo.bar"></span>
</div>
```

> **Important**: This feature is **highly unoptimized** at the moment and will actually cause all of your Alpine components on the page to re-render. This is due to the limited API that Alpine exposes to third party libraries and the `$store` variable has no simple way of knowing which element is currently retrieving data from the global store.

## Versioning

This projects follow the [Semantic Versioning](https://semver.org/) guidelines. This means that there *could* be breaking changes on minor version changes, up until v1.x is reached.

For example, 0.1 -> 0.2 might introduce a breaking change.

## License

Copyright (c) 2020 Ryan Chandler and contributors

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.

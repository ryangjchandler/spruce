<p align="center">
    <img src="./docs/example.png" width="50%" />
</p>

# 🌲 Spruce

A lightweight state management layer for Alpine.js

## About

Many large frameworks have their own state management solutions. One thing these libraries have in common is a higher level of complexity and a wide range of API interactions. Since Alpine.js is designed to be a simpler and lighter alternative to larger frameworks such as Vue and React, shouldn't the state management solution be as simple, if not simpler, too?

## Installation

### CDN

Include the following `<script>` tag in the `<head>` of your document:

```html
<script src="https://cdn.jsdelivr.net/gh/ryangjchandler/spruce@0.1.2/dist/spruce.umd.js">
```

> **Important**: This must be added **before** loading Alpine.js when using CDN links.

### Manual

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

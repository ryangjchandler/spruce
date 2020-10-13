> ✨ Help support the maintenance of this package by [sponsoring me](https://github.com/sponsors/ryangjchandler).

# 🌲 Spruce

A lightweight global state management layer for Alpine.js

![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/ryangjchandler/spruce?label=version&style=flat-square)
![GitHub file size in bytes](https://img.shields.io/github/size/ryangjchandler/spruce/dist/spruce.js?label=min%20%28no%20gzip%29&style=flat-square)
[![Monthly downloads via CDN](https://data.jsdelivr.com/v1/package/gh/ryangjchandler/spruce/badge)](https://www.jsdelivr.com/package/gh/ryangjchandler/spruce)

## Installation

### CDN

Include the following `<script>` tag in the `<head>` of your document:

``` html
<script src="https://cdn.jsdelivr.net/npm/@ryangjchandler/spruce@1.x.x/dist/spruce.umd.js"></script>
```

> **Important**: This must be added **before** loading Alpine.js when using CDN links.

### Manual

If you wish to include Spruce with your own bundle:

```bash
yarn add @ryangjchandler/spruce
```

or:

```bash
npm install @ryangjchandler/spruce --save
```

Then add the following to your script:

``` javascript
import Spruce from '@ryangjchandler/spruce'
```

## Quick start

To verify you have correctly installed Spruce, copy & paste the following code snippet into your project.

``` html
<div x-data>
    <div x-show="$store.modal.open === 'login'">
        <p>
            This "login" modal isn't built with a11y in mind, don't actually use it
        </p>
    </div>
</div>

<div x-data>
    <div x-show="$store.modal.open === 'register'">
        <p>
            This "register" modal isn't built with a11y in mind, don't actually use it
        </p>
    </div>
</div>

<div x-data>
    <select x-model="$store.modal.open">
        <option value="login" selected>login</option>
        <option value="register">register</option>
    </select>
</div>

<script>
    Spruce.store('modal', {
        open: 'login',
    });
</script>
```

To see what the code _should_ do, use [this CodePen](https://codepen.io/hugodf/pen/dyYJXEa). Thanks @HugoDF!

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

```js
import Spruce from '@ryangjchandler/spruce'

Spruce.store('modals', {
    open: 'login'
})

export default Spruce
```

**app.js**

```js
import './store'
import 'alpinejs'
```

> **Note**: You must `import` your store before Alpine.

### Subscribing your components

Spruce hooks into Alpine using the "magic properties" API, meaning there are no extra steps needed. Start using the `$store` variable in your components right away.

```html
<div x-data="{}">
    <span x-text="$store.application.name"></span>
</div>
```

### Defining global state

To define a piece of global state, you can use the `Spruce.store()` method:

```js
Spruce.store('application', {
    name: 'Amazing Alpine Application'
})
```

The first argument defines the top level property of the scope. The second argument defines the state for the scope, it could be a string, integer or object with nested properties.

To access the `name` property, you can do the following inside of your component:

```html
<div x-data="{}">
    <span x-text="$store.application.name"></span>
</div>
```

The `<span>` will now have "Amazing Alpine Application" set as its `innerText` .

### Modifying state from outside of Alpine

You can modify your global state from external scripts using the `Spruce.store()` method too:

```js
Spruce.store('application', {
    name: 'Amazing Alpine Application'
})

Spruce.store('application').name = 'Amazing Spruce Integration'
```

This will trigger Alpine to re-evaluate your subscribed components and re-render.

### Resetting global state

A `Spruce.reset()` method is provided so that you can completely overwrite a global store:

```js
Spruce.store('application', {
    name: 'Amazing Alpine Application'
})

Spruce.reset('application', {
    name: 'Reset Application'
})
```

Calling the `reset` method will make the new state reactive and cause subscribed components to re-render.

### Externally watching for changes

You can register watchers in a similar fashion to Alpine. All you need is the full dot-notation representation of your piece of state and a callback.

```js
Spruce.store('form', {
    name: 'Ryan',
    email: 'support@ryangjchandler.co.uk'
})

Spruce.watch('form.email', value => {
    // do something with the new value here
})
```

In the above snippet, when we change the value of `form.email` either from a component or externally in a separate JavaScript file, our callback will be invoked and will receive the new value. This can be useful for running automatic inline validation when a property changes, or triggering an action elsewhere in another component without the need for dispatching events.

> **Note**: you can get stuck in an watch loop if you're updating other store properties that also have watchers defined.

### Persisting stores

You can persist the state of a global store between page loads using [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) by passing a third boolean argument to the `Spruce.store()` method.

```js
Spruce.store('form', {
    name: 'Ryan',
    email: 'support@ryangjchandler.co.uk'
}, true)
```

When the `form` store is updated, any changes will be persisted to `__spruce:form` key in local storage.

> **Note**: some browsers will disable access to local storage when browsing in private mode.

**Persisted stores with methods**

Stores that contain methods can still be persisted. These methods cannot be JSON-serialized, so will be re-added to the data that was retrieved from local storage.

```js
Spruce.store('form', {
    name: 'Ryan',
    email: 'support@ryangjchandler.co.uk',
    logName() {
        console.log(this.name)
    }
}, true)

Spruce.store('form').logName() // logs `Ryan` to console.
```

## Versioning

This project follows the [Semantic Versioning](https://semver.org/) guidelines. This means that there *could* be breaking changes on minor version changes, up until v1.x is reached.

For example, 0.1 -> 0.2 might introduce a breaking change.

## License

Copyright (c) 2020 Ryan Chandler and contributors

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.

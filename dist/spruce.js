function t(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function e(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}var n=function(t){return null==t},r=function(t,e){return Object.keys(t).forEach(function(s){n(t[s])||Object.getPrototypeOf(t[s])!==Object.prototype||(t[s]=r(t[s],e))}),new Proxy(t,{get:function(t,n){return e.hasOwnProperty("get")&&e.get(n),t[n]},set:function(t,s,o){var i=t[s];return n(o)||"object"!=typeof o||(o=r(o,e)),e.set(t,s,t[s]=o,i),!0}})},s={options:{globalStoreVariable:!1},events:{watchers:{},events:{},on:function(t,e,n){var r=this;return void 0===n&&(n=!1),this.events[t]||(this.events[t]=[]),this.events[t].push({callback:e,once:n}),function(){return r.off(t,e)}},once:function(t,e){this.on(t,e,!0)},off:function(t,e){this.events[t]=this.events[t].filter(function(t){return t.callback!==e&&!0!==t.once})},emit:function(t,e){var n=this;void 0===e&&(e={}),this.events[t]&&this.events[t].forEach(function(r){r.callback(e),r.once&&n.off(t,r)}),window.dispatchEvent(new CustomEvent("spruce:"+t,{detail:e,bubbles:!0}))},watch:function(t,e){this.watchers[t]||(this.watchers[t]=[]),this.watchers[t].push(e)},runWatchers:function(t,e,n,r){var s=this;if(s.watchers[n])return s.watchers[n].forEach(function(t){return t(r,e[n])});Object.keys(s.watchers).filter(function(t){return t.includes(".")}).forEach(function(o){var i=o.split(".");n===i[i.length-1]&&i.reduce(function(t,i){return(t[n]===e[n]||Object.is(e,t))&&s.watchers[o].forEach(function(t){return t(r,e[n])}),t[i]},t)})}},stores:{},subscribers:[],start:function(){try{var t=this;return Promise.resolve(new Promise(function(t){"loading"==document.readyState?document.addEventListener("DOMContentLoaded",t):t()})).then(function(){t.emit("init"),t.attach(),document.addEventListener("turbolinks:render",t.attach),t.stores=r(t.stores,{set:function(e,n,r,s){t.events.runWatchers(t.stores,e,n,s),t.updateSubscribers()}}),t.options.globalStoreVariable&&(document.querySelectorAll("[x-data]").forEach(function(e){t.subscribers.includes(e)||t.subscribers.push(e)}),window.$store=t.stores)})}catch(t){return Promise.reject(t)}},attach:function(){document.querySelectorAll("[x-subscribe]").forEach(function(t){t.setAttribute("x-init",function(t){var e="$store = Spruce.subscribe($el)";return t.hasAttribute("x-init")&&(e=e+"; "+t.getAttribute("x-init")),e}(t)),t.removeAttribute("x-subscribe")})},store:function(t,e){return this.stores[t]||(this.stores[t]=e),this.stores[t]},reset:function(t,e){this.stores[t]=e},subscribe:function(t){return this.subscribers.push(t),this.stores},updateSubscribers:function(){this.subscribers.forEach(function(t){void 0!==t.__x&&t.__x.updateElements(t)})},config:function(t){void 0===t&&(t={}),this.options=Object.assign(this.options,t)},on:function(t,e){return this.events.on(t,e)},once:function(t,e){return this.events.once(t,e)},off:function(t,e){this.events.off(t,e)},emit:function(n,r){void 0===r&&(r={}),this.events.emit(n,function(n){for(var r=1;r<arguments.length;r++){var s=null!=arguments[r]?arguments[r]:{};r%2?e(Object(s),!0).forEach(function(e){t(n,e,s[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(s)):e(Object(s)).forEach(function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(s,t))})}return n}({},r,{store:this.stores}))},watch:function(t,e){this.events.watch(t,e)}},o=window.deferLoadingAlpine||function(t){t()};window.deferLoadingAlpine=function(t){window.Spruce=s,window.Spruce.start(),o(t)},module.exports=s;
//# sourceMappingURL=spruce.js.map

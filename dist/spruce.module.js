var t=function(t){return null==t},e=function(r,n){return Object.keys(r).forEach(function(o){t(r[o])||Object.getPrototypeOf(r[o])!==Object.prototype||(r[o]=e(r[o],n))}),new Proxy(r,{get:function(t,e){return n.get(e),t[e]},set:function(r,o,i){return t(i)||"object"!=typeof i||(i=e(i,n)),n.set(o,r[o]=i),!0}})},r={options:{globalStoreVariable:!1},stores:{},subscribers:[],start:function(){try{var t=this;return Promise.resolve(new Promise(function(t){"loading"==document.readyState?document.addEventListener("DOMContentLoaded",t):t()})).then(function(){document.querySelectorAll("[x-subscribe]").forEach(function(t){t.setAttribute("x-init",function(t){var e="$store = Spruce.subscribe($el)";return t.hasAttribute("x-init")&&(e=e+"; "+t.getAttribute("x-init")),e}(t)),t.removeAttribute("x-subscribe")}),t.stores=e(t.stores,{get:function(t){},set:function(e,r){t.updateSubscribers(e,r)}}),t.options.globalStoreVariable&&(window.$store=t.stores)})}catch(t){return Promise.reject(t)}},store:function(t,e){void 0===e&&(e={}),this.stores[t]||(this.stores[t]=e)},subscribe:function(t){return this.subscribers.push(t),this.stores},updateSubscribers:function(t,e){this.subscribers.forEach(function(r){void 0!==r.__x&&(r.__x.$data.spruce=[t,e])})},config:function(t){void 0===t&&(t={}),this.options=Object.assign(this.options,t)}},n=window.deferLoadingAlpine||function(t){t()};window.deferLoadingAlpine=function(t){window.Spruce=r,window.Spruce.start(),n(t)};export default r;
//# sourceMappingURL=spruce.module.js.map

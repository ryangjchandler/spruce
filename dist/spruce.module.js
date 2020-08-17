function t(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function e(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}var n={el:null,events:{events:{},on:function(t,e,n){var r=this;return void 0===n&&(n=!1),this.events[t]||(this.events[t]=[]),this.events[t].push({callback:e,once:n}),function(){return r.off(t,e)}},once:function(t,e){this.on(t,e,!0)},off:function(t,e){this.events[t]=this.events[t].filter(function(t){return t.callback!==e&&!0!==t.once})},emit:function(t,e){var n=this;void 0===e&&(e={}),this.events[t]&&this.events[t].forEach(function(r){r.callback(e),r.once&&n.off(t,r)}),window.dispatchEvent(new CustomEvent("spruce:"+t,{detail:e,bubbles:!0}))}},storesStack:{},start:function(){this.guardAgainstAlpineMissing(),this.emit("beforeMount").insertTargetElementIfNotExists().setupMagicProp().emit("mounted")},guardAgainstAlpineMissing:function(){if(!window.Alpine||window.Alpine.version<"2.5.0")throw new Error("[Spruce] Alpine v2.5.0 or greater is not installed")},insertTargetElementIfNotExists:function(){var t=document.createElement("div");return t.setAttribute("x-data","{ stores: {}, subscribers: [] }"),this.el=t,window.Alpine.initializeComponent(this.el),this},setupMagicProp:function(){var t=this;return window.Alpine.addMagicProperty("store",function(e){var n=t.el.__x.$data.subscribers;return n.includes(e)||n.push(e),Object.keys(t.storesStack).length>0&&(Object.entries(t.storesStack).forEach(function(e){t.el.__x.$data.stores[e[0]]=e[1]}),t.storesStack={}),t.el.__x.$data.stores}),this},stores:function(){return this.el.__x.$data.stores},store:function(t,e,n){if(void 0===n&&(n=!1),this.storesStack[t]&&!n)return this.storesStack[t];if(!this.el)return this.storesStack[t]=e,this.storesStack[t];var r=this.stores();return r[t]&&!this.force||(r[t]=e),r[t]},reset:function(t,e){this.store(t,e,!0)},on:function(t,e){return this.events.on(t,e)},once:function(t,e){return this.events.once(t,e)},off:function(t,e){this.events.off(t,e)},emit:function(n,r){return void 0===r&&(r={}),this.events.emit(n,function(n){for(var r=1;r<arguments.length;r++){var i=null!=arguments[r]?arguments[r]:{};r%2?e(Object(i),!0).forEach(function(e){t(n,e,i[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(i)):e(Object(i)).forEach(function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(i,t))})}return n}({},r,{store:this.stores})),this},watch:function(t,e){t.startsWith("stores.")||(t="stores."+t),this.el.__x.$data.$watch(t,e)}},r=window.deferLoadingAlpine||function(t){return t()};window.deferLoadingAlpine=function(t){window.Spruce=n,window.Spruce.start(),r(t)};export default n;
//# sourceMappingURL=spruce.module.js.map

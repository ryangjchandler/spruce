function t(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function e(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,i)}return n}var n={el:null,events:{events:{},on:function(t,e,n){var i=this;return void 0===n&&(n=!1),this.events[t]||(this.events[t]=[]),this.events[t].push({callback:e,once:n}),function(){return i.off(t,e)}},once:function(t,e){this.on(t,e,!0)},off:function(t,e){this.events[t]=this.events[t].filter(function(t){return t.callback!==e&&!0!==t.once})},emit:function(t,e){var n=this;void 0===e&&(e={}),this.events[t]&&this.events[t].forEach(function(i){i.callback(e),i.once&&n.off(t,i)}),window.dispatchEvent(new CustomEvent("spruce:"+t,{detail:e,bubbles:!0}))}},start:function(){this.guardAgainstAlpineMissing(),this.emit("beforeMount").insertTargetElementIfNotExists().setupMagicProp().emit("mounted")},guardAgainstAlpineMissing:function(){if(!window.Alpine||window.Alpine.version<"2.5.0")throw new Error("[Spruce] Alpine v2.5.0 or greater is not installed")},insertTargetElementIfNotExists:function(){var t=document.createElement("div");return t.setAttribute("x-data","{ stores: {}, subscribers: [] }"),this.el=t,window.Alpine.initializeComponent(this.el),this},setupMagicProp:function(){return window.Alpine.addMagicProperty("store",function(t){var e=n.el.__x.$data.subscribers;return e.includes(t)||e.push(t),n.el.__x.$data.stores}),this},update:function(){console.log("test")},stores:function(){return this.el.__x.$data.stores},store:function(t,e,n){void 0===n&&(n=!1);var i=this.stores();return i[t]&&!n||(i[t]=e),i[t]},reset:function(t,e){this.store(t,e,!0)},on:function(t,e){return this.events.on(t,e)},once:function(t,e){return this.events.once(t,e)},off:function(t,e){this.events.off(t,e)},emit:function(n,i){return void 0===i&&(i={}),this.events.emit(n,function(n){for(var i=1;i<arguments.length;i++){var r=null!=arguments[i]?arguments[i]:{};i%2?e(Object(r),!0).forEach(function(e){t(n,e,r[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(r)):e(Object(r)).forEach(function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(r,t))})}return n}({},i,{store:this.stores})),this},watch:function(t,e){t.startsWith("stores.")||(t="stores."+t),this.el.__x.$data.$watch(t,e)}},i=window.deferLoadingAlpine||function(t){return t()};window.deferLoadingAlpine=function(t){window.Spruce=n,window.Spruce.start(),i(t)};export default n;
//# sourceMappingURL=spruce.module.js.map

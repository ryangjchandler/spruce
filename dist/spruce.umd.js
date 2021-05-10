(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Spruce = factory());
}(this, (function () {
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  /* global define */
  var compareVersions = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
      /* istanbul ignore next */
      {
        module.exports = factory();
      }
    })(commonjsGlobal, function () {
      var semver = /^v?(?:\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+))?(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;

      function indexOrEnd(str, q) {
        return str.indexOf(q) === -1 ? str.length : str.indexOf(q);
      }

      function split(v) {
        var c = v.replace(/^v/, '').replace(/\+.*$/, '');
        var patchIndex = indexOrEnd(c, '-');
        var arr = c.substring(0, patchIndex).split('.');
        arr.push(c.substring(patchIndex + 1));
        return arr;
      }

      function tryParse(v) {
        return isNaN(Number(v)) ? v : Number(v);
      }

      function validate(version) {
        if (typeof version !== 'string') {
          throw new TypeError('Invalid argument expected string');
        }

        if (!semver.test(version)) {
          throw new Error('Invalid argument not valid semver (\'' + version + '\' received)');
        }
      }

      function compareVersions(v1, v2) {
        [v1, v2].forEach(validate);
        var s1 = split(v1);
        var s2 = split(v2);

        for (var i = 0; i < Math.max(s1.length - 1, s2.length - 1); i++) {
          var n1 = parseInt(s1[i] || 0, 10);
          var n2 = parseInt(s2[i] || 0, 10);
          if (n1 > n2) return 1;
          if (n2 > n1) return -1;
        }

        var sp1 = s1[s1.length - 1];
        var sp2 = s2[s2.length - 1];

        if (sp1 && sp2) {
          var p1 = sp1.split('.').map(tryParse);
          var p2 = sp2.split('.').map(tryParse);

          for (i = 0; i < Math.max(p1.length, p2.length); i++) {
            if (p1[i] === undefined || typeof p2[i] === 'string' && typeof p1[i] === 'number') return -1;
            if (p2[i] === undefined || typeof p1[i] === 'string' && typeof p2[i] === 'number') return 1;
            if (p1[i] > p2[i]) return 1;
            if (p2[i] > p1[i]) return -1;
          }
        } else if (sp1 || sp2) {
          return sp1 ? -1 : 1;
        }

        return 0;
      }
      var allowedOperators = ['>', '>=', '=', '<', '<='];
      var operatorResMap = {
        '>': [1],
        '>=': [0, 1],
        '=': [0],
        '<=': [-1, 0],
        '<': [-1]
      };

      function validateOperator(op) {
        if (typeof op !== 'string') {
          throw new TypeError('Invalid operator type, expected string but got ' + typeof op);
        }

        if (allowedOperators.indexOf(op) === -1) {
          throw new TypeError('Invalid operator, expected one of ' + allowedOperators.join('|'));
        }
      }

      compareVersions.validate = function (version) {
        return typeof version === 'string' && semver.test(version);
      };

      compareVersions.compare = function (v1, v2, operator) {
        // Validate operator
        validateOperator(operator); // since result of compareVersions can only be -1 or 0 or 1
        // a simple map can be used to replace switch

        var res = compareVersions(v1, v2);
        return operatorResMap[operator].indexOf(res) > -1;
      };

      return compareVersions;
    });
  });

  const isNullOrUndefined = value => {
    return value === null || value === undefined;
  };
  const isObject = _ => {
    return Object.getPrototypeOf(_) === Object.prototype;
  };
  const isArray = _ => Array.isArray(_);
  const getMethods = obj => {
    let methods = {};
    Object.entries(obj).filter(([_, value]) => typeof value === 'function').forEach(([key, value]) => methods[key] = value);
    return methods;
  };
  const isTesting = () => {
    return navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom");
  };
  const checkForAlpine = () => {
    if (isTesting()) {
      return true;
    }

    if (!window.Alpine) {
      return false;
    }

    return compareVersions.compare(window.Alpine.version, '2.7.0', '>=');
  };

  const createObservable = (target, callbacks) => {
    Object.entries(target).forEach(([key, value]) => {
      if (!isNullOrUndefined(value) && (isObject(value) || isArray(value))) {
        target[key] = createObservable(value, callbacks);
      }
    });
    return new Proxy(target, {
      get(target, key, receiver) {
        return callbacks.get(target, key, receiver);
      },

      set(target, key, value, receiver) {
        if (!isNullOrUndefined(value) && (isObject(value) || isArray(value))) {
          value = createObservable(value, callbacks);
        }

        let originalValue = target[key];
        target[key] = value; // Copy watchers from the original value if they exist

        if (!isNullOrUndefined(originalValue) && !isNullOrUndefined(originalValue.__watchers)) {
          target[key].__watchers = originalValue.__watchers;
        }

        callbacks.set(target, key, target[key], receiver);
        return true;
      }

    });
  };

  const Spruce = {
    stores: {},
    persistenceDriver: window.localStorage,
    persisted: [],
    persistedDrivers: {},
    subscribers: [],
    pendingWatchers: {},
    disableReactivity: false,
    startingCallbacks: [],
    startedCallbacks: [],
    hasStarted: false,

    start() {
      this.startingCallbacks.forEach(fn => fn());
      this.attach();
      this.stores = createObservable(this.stores, {
        get: (target, key, receiver) => {
          if (Object.is(receiver, this.stores) && ['get', 'set', 'toggle', 'call', 'clear'].includes(key)) {
            return this[key].bind(this);
          }

          return Reflect.get(target, key, receiver);
        },
        set: (target, key, value, receiver) => {
          if (this.disableReactivity) {
            return;
          }

          this.updateSubscribers();
          this.runWatchers(target, key, value, receiver);
          this.disableReactivity = true;

          try {
            this.persisted.forEach(this.updateLocalStorage.bind(this));
          } catch (e) {// Do nothing here (thanks Safari!)
          }

          this.disableReactivity = false;
        }
      });
      this.hasStarted = true;
      this.disableReactivity = true;
      Object.entries(this.pendingWatchers).forEach(([name, callbacks]) => {
        callbacks.forEach(callback => this.watch(name, callback));
      });
      this.disableReactivity = false;
      this.startedCallbacks.forEach(fn => fn());
    },

    starting(callback) {
      this.startingCallbacks.push(callback);
    },

    started(callback) {
      this.startedCallbacks.push(callback);
    },

    attach() {
      if (!checkForAlpine()) {
        throw new Error('[Spruce] You must be using Alpine >= 2.5.0 to use Spruce.');
      }

      const self = this;
      window.Alpine.addMagicProperty('store', el => {
        self.subscribe(el);
        return self.stores;
      });
    },

    store(name, state, persist = false) {
      if (typeof state === 'function') {
        state = state();
      }

      const isValidDriver = this.isValidDriver(persist);

      if (persist === true || isValidDriver) {
        try {
          this.stores[name] = this.retrieveFromLocalStorage(name, getMethods(state), isValidDriver ? persist : undefined);

          if (isValidDriver) {
            this.persistedDrivers[name] = persist;
          }

          if (!this.persisted.includes(name)) {
            this.persisted.push(name);
          }
        } catch (e) {// Do nothing here (thanks Safari!)
        }
      }

      if (!this.stores[name]) {
        this.stores[name] = state;
      }

      return this.stores[name];
    },

    reset(name, state) {
      if (this.stores[name] === undefined) {
        return;
      }

      this.stores[name] = state;
    },

    delete(name, reload = true) {
      if (this.stores[name] === undefined) {
        return false;
      }

      delete this.stores[name];

      if (reload) {
        this.updateSubscribers();
      }

      return true;
    },

    deleteAll() {
      const results = Object.keys(this.stores).map(key => this.delete(key, false));
      this.updateSubscribers();
      return !results.some(bool => !bool);
    },

    subscribe(el) {
      if (!this.subscribers.includes(el)) {
        this.subscribers.push(el);
      }

      return this.stores;
    },

    updateSubscribers() {
      this.subscribers.filter(el => !!el.__x).forEach(el => {
        el.__x.updateElements(el);
      });
    },

    retrieveFromLocalStorage(name, methods = {}, handler) {
      let driver = this.persistenceDriver;

      if (handler !== undefined) {
        this.guardAgainstInvalidDrivers(handler);
        driver = handler;
      }

      const value = driver.getItem(`__spruce:${name}`);

      if (!value) {
        return null;
      }

      let storage = JSON.parse(value);

      if (typeof storage === 'object') {
        storage = Object.assign(methods, storage);
        delete storage.__watchers;
        delete storage.__key_name;
      }

      return storage;
    },

    updateLocalStorage(name) {
      const store = _objectSpread2({}, this.store(name));

      delete store.__watchers;
      delete store.__key_name;
      const driver = this.persistedDrivers[name] || this.persistenceDriver;
      driver.setItem(`__spruce:${name}`, JSON.stringify(this.store(name)));
    },

    get(name, target = this.stores) {
      return name.split('.').reduce((target, part) => target[part], target);
    },

    set(name, value, target = this.stores) {
      if (!isArray(name)) {
        name = name.split('.');
      }

      if (name.length === 1) return target[name[0]] = value;

      if (target[name[0]]) {
        return this.set(name.slice(1), value, target[name[0]]);
      } else {
        target[name[0]] = {};
        return this.set(name.slice(1), value, target[name[0]]);
      }
    },

    toggle(name) {
      return this.set(name, !this.get(name));
    },

    call(name, ...args) {
      return this.get(name)(...args);
    },

    clear(name) {
      return this.persistenceDriver.removeItem(`__spruce:${name}`);
    },

    watch(name, callback) {
      if (!this.hasStarted) {
        this.pendingWatchers[name] || (this.pendingWatchers[name] = []);
        this.pendingWatchers[name].push(callback);
        return [() => this.unwatch(name, callback)];
      }

      const nameParts = name.split('.');
      const target = nameParts.reduce((target, part) => {
        const sub = target[part];

        if (!isNullOrUndefined(sub) && (isObject(sub) || isArray(sub))) {
          return sub;
        }

        return target;
      }, this.stores);
      /**
       * If the target object / array is the property
       * that needs to be watched, a magic `__self` key is
       * used so that runner can pick up on it later.
       */

      const part = Object.is(target, this.get(name)) ? '__self' : nameParts[nameParts.length - 1];

      if (!target.hasOwnProperty('__watchers')) {
        Object.defineProperty(target, '__watchers', {
          enumerable: false,
          value: new Map(),
          configurable: true
        });
      }

      if (!target.__watchers.has(part)) {
        target.__watchers.set(part, new Set());
      }

      target.__watchers.get(part).add(callback);

      return [() => this.unwatch(name, callback)];
    },

    unwatch(name, callback) {
      const nameParts = name.split('.');
      const target = nameParts.reduce((target, part) => {
        const sub = target[part];

        if (!isNullOrUndefined(sub) && (isObject(sub) || isArray(sub))) {
          return sub;
        }

        return target;
      }, this.stores);
      const part = Object.is(target, this.get(name)) ? '__self' : nameParts[nameParts.length - 1];
      const watchers = target.__watchers;

      if (!watchers.has(part)) {
        return;
      }

      watchers.get(part).delete(callback);
    },

    watchers(name) {
      const nameParts = name.split('.');
      const target = nameParts.reduce((target, part) => {
        const sub = target[part];

        if (!isNullOrUndefined(sub) && (isObject(sub) || isArray(sub))) {
          return sub;
        }

        return target;
      }, this.stores);
      const part = Object.is(target, this.get(name)) ? '__self' : nameParts[nameParts.length - 1];

      if (!target.__watchers) {
        return {};
      }

      return target.__watchers.get(part);
    },

    runWatchers(target, key, value) {
      if (!target.__watchers) {
        return;
      }

      if (target.__watchers.has(key)) {
        target.__watchers.get(key).forEach(f => f(value));
      }
      /**
       * The `__self` key is used for watchers that are registered
       * to the object or array being updated.
       */


      if (target.__watchers.has('__self')) {
        target.__watchers.get('__self').forEach(f => f(value, key));
      }
    },

    persistUsing(driver) {
      if (this.persisted.length > 0) {
        console.warn('[Spruce] You have already initialised a persisted store. Changing the driver may cause issues.');
      }

      this.guardAgainstInvalidDrivers(driver);
      this.persistenceDriver = driver;
    },

    guardAgainstInvalidDrivers(driver) {
      if (typeof driver.getItem !== 'function') {
        throw new Error('[Spruce] The persistence driver must have a `getItem(key)` method.');
      }

      if (typeof driver.setItem !== 'function') {
        throw new Error('[Spruce] The persistence driver must have a `setItem(key, value)` method.');
      }

      if (typeof driver.removeItem !== 'function') {
        throw new Error('[Spruce] The persistence driver must have a `removeItem(name)` method.');
      }
    },

    isValidDriver(driver) {
      try {
        this.guardAgainstInvalidDrivers(driver);
      } catch (e) {
        return false;
      }

      return true;
    }

  };
  window.Spruce = Spruce;

  const deferrer = window.deferLoadingAlpine || function (callback) {
    callback();
  };

  window.deferLoadingAlpine = function (callback) {
    window.Spruce.start();
    deferrer(callback);
  };

  return Spruce;

})));
//# sourceMappingURL=spruce.umd.js.map

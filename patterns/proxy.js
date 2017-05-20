'use strict';

const XES = require('../xes');


/* ------------------------------- Classes ----------------------------------- */

/**
 * @name KeyValue
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('KeyValue', {
    instance: () => ({
        set: XES.Abstract,
        get: XES.Abstract
    })
});

/**
 * @name Config
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('Config', {
    extends: XES.KeyValue,

    instance: (self) => {
        self._config = {};

        return {
            set: function(key, value) {
                self._config[key] = value;
                return this;
            },

            get: (key) => self._config[key]
        };
    }
});

/**
 * @name Proxy
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('Proxy', {
    extends: XES.KeyValue,

    instance: (self) => {
        self._allowedSetKeys = ['version'];
        self._allowedGetKeys = ['name', 'description', 'version'];

        self._config = {};

        return {
            constructor: (config) => {
                self._config = config;
            },

            set: function(key, value) {
                if (self._allowedSetKeys.indexOf(key) === -1) {
                    return this;
                }

                self._config.set(key, value);
                return this;
            },

            get: (key) => {
                if (self._allowedGetKeys.indexOf(key) === -1) {
                    return;
                }

                return self._config.get(key);
            }
        };
    }
});


/* ------------------------------- Using ----------------------------------- */

const config = new XES.Config();

config
    .set('name', 'classes')
    .set('description', 'OOP framework')
    .set('version', '0.0.1')
    .set('main', 'classes.js');

const proxy = new XES.Proxy(config);

proxy
    .set('name', 'functions')
    .set('description', 'functions framework')
    .set('version', '0.0.2')
    .set('main', 'functions.js');

console.log(proxy.get('name'));
console.log(proxy.get('description'));
console.log(proxy.get('version'));


/* ------------------------------ Testing ---------------------------------- */

console.assert(config.get('main') === 'classes.js');

console.assert(proxy.get('name') === 'classes');
console.assert(proxy.get('description') === 'OOP framework');
console.assert(proxy.get('version') === '0.0.2');
console.assert(proxy.get('main') === undefined);

'use strict';

const XES = require('../xes');


/* ------------------------------- Classes ----------------------------------- */

/**
 * @name JSON
 * @type {XES.Namespace}
 * @memberOf XES
 */
XES.name('JSON');

/**
 * @name Parser
 * @type {XES.Class}
 * @memberOf XES.JSON
 */
XES.JSON.decl('Parser', {
    instance: (self) => ({
        constructor: (data) => {
            self._promise = new Promise((resolve, reject) => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        },

        getPromise: () => self._promise,

        then: (callback) => self._promise.then(callback),

        catch: (callback) => self._promise.catch(callback)
    })
});

/**
 * @name Stringifier
 * @type {XES.Class}
 * @memberOf XES.JSON
 */
XES.JSON.decl('Stringifier', {
    instance: (self) => ({
        constructor: (data) => {
            self._data = data;
        },

        toString: () => JSON.stringify(self._data)
    })
});

/**
 * @name Sorter
 * @type {XES.Class}
 * @memberOf XES.JSON
 */
XES.JSON.decl('Sorter', {
    instance: (self) => {
        self._sort = (obj) => {
            return Object.keys(obj)
                .sort()
                .reduce((res, key) => {
                    res[key] = (obj[key] && typeof obj[key] === 'object')
                        ? self._sort(obj[key])
                        : obj[key];

                    return res;
                }, Object.create(obj.constructor.prototype));
        };

        return {
            constructor: (obj) => {
                self._obj = obj;
            },

            sort: () => self._sort(self._obj)
        };
    }
});

/**
 * @name Facade
 * @type {XES.Class}
 * @memberOf XES.JSON
 */
XES.JSON.decl('Facade', {
    instance: (self) => ({
        constructor: (data) => {
            self._promise = XES.JSON.Parser(data)
                .getPromise()
                .then((json) => XES.JSON.Sorter(json).sort())
                .then((json) => XES.JSON.Stringifier(json).toString());
        },

        then: (callback) => {
            return self._promise.then(callback);
        },

        catch: (callback) => {
            return self._promise.catch(callback);
        }
    })
});


/* ------------------------------- Using ----------------------------------- */

const json = '{"b":2,"c":{"b":2,"a":1},"a":1}';

XES.JSON.Facade(json)
    .then((res) => {
        console.log(res);
    })
    .catch((e) => {
        console.error(e.message);
    });


/* ------------------------------ Testing ---------------------------------- */

XES.JSON.Facade(json)
    .then((res) => {
        console.assert(res === '{"a":1,"b":2,"c":{"a":1,"b":2}}', 'Incorrect result');
    })
    .catch((e) => {
        console.error(e.message);
    });

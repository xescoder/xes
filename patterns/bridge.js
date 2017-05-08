'use strict';

const XES = require('../xes');


/* ------------------------------- Branch first ----------------------------------- */

/**
 * @name Enumerable
 * @type {XES.Namespace}
 * @memberOf XES
 */
XES.name('Enumerable');

/**
 * @name Base
 * @type {XES.Class}
 * @memberOf XES.Enumerable
 */
XES.Enumerable.decl('Base', {
    instance: (self) => ({
        add: XES.Abstract,
        get: XES.Abstract,
        remove: XES.Abstract,
        length: XES.Abstract
    })
});

/**
 * @name String
 * @type {XES.Class}
 * @memberOf XES.Enumerable
 */
XES.Enumerable.decl('String', {
    extends: XES.Enumerable.Base,

    instance: (self) => {
        self._str = '';

        return {
            constructor: (str) => {
                self.add(str);
            },

            add: (val) => {
                self._str += val;
            },

            get: (index) => self._str[index],

            remove: (start, end) => {
                self._str = self._str.slice(start, end);
            },

            length: () => self._str.length
        };
    }
});

/**
 * @name Array
 * @type {XES.Class}
 * @memberOf XES.Enumerable
 */
XES.Enumerable.decl('Array', {
    extends: XES.Enumerable.Base,

    instance: (self) => {
        self._arr = [];

        return {
            constructor: (str) => {
                self.add(str);
            },

            add: (val) => {
                self._arr.push(val);
            },

            get: (index) => self._arr[index],

            remove: (start, end) => {
                self._arr = self._arr.slice(start, end);
            },

            length: () => self._arr.length
        };
    }
});


/* ------------------------------- Branch second ----------------------------------- */

/**
 * @name Iterators
 * @type {XES.Namespace}
 * @memberOf XES
 */
XES.name('Iterators');

/**
 * @name Base
 * @type {XES.Class}
 * @memberOf XES.Iterators
 */
XES.Iterators.decl('Base', {
    instance: (self) => ({
        constructor: (enumerable) => {
            self._list = enumerable;
        },

        getList: () => self._list,

        forEach: XES.Abstract
    })
});

/**
 * @name ASC
 * @type {XES.Class}
 * @memberOf XES.Iterators
 */
XES.Iterators.decl('ASC', {
    extends: XES.Iterators.Base,

    instance: (self, base) => ({
        constructor: (enumerable) => {
            base.constructor(enumerable);
        },

        forEach: (callback) => {
            let list = base.getList(), i;

            for (i = 0; i < list.length(); i++) {
                callback(list.get(i));
            }
        }
    })
});

/**
 * @name DESC
 * @type {XES.Class}
 * @memberOf XES.Iterators
 */
XES.Iterators.decl('DESC', {
    extends: XES.Iterators.Base,

    instance: (self, base) => ({
        constructor: (enumerable) => {
            base.constructor(enumerable);
        },

        forEach: (callback) => {
            let list = base.getList(), i;

            for (i = list.length() - 1; i > -1; i--) {
                callback(list.get(i));
            }
        }
    })
});


/* ------------------------------- Using ----------------------------------- */

const list = new XES.Enumerable.String('qwerty');
const iterator = new XES.Iterators.DESC(list);

iterator.forEach((item) => {
    console.log(item);
});


/* ------------------------------ Testing ---------------------------------- */

let reference = 'ytrewq',
    i = 0;

iterator.forEach((item) => {
    console.assert(item === reference[i], 'Incorrect current item');
    i++;
});

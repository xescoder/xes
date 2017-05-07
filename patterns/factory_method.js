'use strict';

const XES = require('../xes');


/* ------------------------------- Classes ----------------------------------- */

/**
 * @name RandomEnumerable
 * @type {XES.Class}
 * @memberOf XES
 * @abstract
 */
XES.decl('RandomEnumerable', {
    instance: (self) => ({
        constructor: () => {
            self._random = self.create();
        },

        first: () => self._random[0],
        last: () => self._random[self.length() - 1],
        length: () => self._random.length,

        /**
         * Factory method
         */
        create: XES.Abstract
    })
});

/**
 * @name RandomString
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('RandomString', {
    extends: XES.RandomEnumerable,

    instance: () => ({
        create: () => {
            return ((Math.random() + 1) * 3e18).toString(36);
        }
    })
});

/**
 * @name RandomArray
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('RandomArray', {
    extends: XES.RandomEnumerable,

    instance: () => ({
        create: () => {
            const length = (Math.random() + 1) * 30;
            let res = [], i;

            for (i = 0; i < length; i++) {
                res.push(Math.random() * 100);
            }

            return res;
        }
    })
});


/* ------------------------------- Using ----------------------------------- */

console.log('Random string');
console.log('-----------------------------');

const rString = new XES.RandomString();

console.log('First item: ', rString.first());
console.log('Last item: ', rString.last());
console.log('Length: ', rString.length());


console.log();
console.log('Random array');
console.log('-----------------------------');

const rArray = new XES.RandomArray();

console.log('First item: ', rArray.first());
console.log('Last item: ', rArray.last());
console.log('Length: ', rArray.length());

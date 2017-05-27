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

let rString = new XES.RandomString();

console.log('First item: ', rString.first());
console.log('Last item: ', rString.last());
console.log('Length: ', rString.length());

console.log();
console.log('Random array');
console.log('-----------------------------');

let rArray = new XES.RandomArray();

console.log('First item: ', rArray.first());
console.log('Last item: ', rArray.last());
console.log('Length: ', rArray.length());


/* ------------------------------ Testing ---------------------------------- */

// XES.RandomString stub
XES.stub(XES.RandomString, {
    instance: (pub) => {
        pub.create = () => 'qwerty';
    }
});

// XES.RandomArray stub
XES.stub(XES.RandomArray, {
    instance: (pub) => {
        pub.create = () => [0, 1, 2, 3, 4, 5, 6];
    }
});

rString = new XES.RandomString();
rArray = new XES.RandomArray();

console.assert(rString.first() === 'q', 'Incorrect first in RandomString');
console.assert(rString.last() === 'y', 'Incorrect last in RandomString');
console.assert(rString.length() === 6, 'Incorrect length for RandomString');

console.assert(rArray.first() === 0, 'Incorrect first in RandomArray');
console.assert(rArray.last() === 6, 'Incorrect last in RandomArray');
console.assert(rArray.length() === 7, 'Incorrect length for RandomArray');

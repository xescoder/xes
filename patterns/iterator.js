'use strict';

const XES = require('../xes');


/* ------------------------------- Classes ----------------------------------- */

/**
 * @name List
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('List', {
   instance: (self) => ({
       constructor: (...items) => {
           self._items = items;
       },

       add: (item) => {
           self._items.push(item)
       },

       get: (index) => self._items[index],

       length: () => self._items.length,

       getIterator: () => new XES.Iterator(self.public)
   })
});

/**
 * @name Iterator
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('Iterator', {
    instance: (self) => ({
        constructor: (list) => {
            self._list = list;
            self._index = 0;
        },

        toFirst: () => {
            self._index = 0
        },

        toLast: () => {
            self._index = self._list.length() - 1
        },

        next: () => {
            if (self._index + 1 >= self._list.length()) {
                return false;
            }

            self._index++;

            return true;
        },

        prev: () => {
            if (self._index - 1 < 0) {
                return false;
            }

            self._index--;

            return true;
        },

        current: () => self._list.get(self._index)
    })
});


/* ------------------------------- Using ----------------------------------- */

const list = new XES.List('a', 'b', 'c', 'd', 'e', 'f', 'g');
const iterator = list.getIterator();

do {
    console.log(iterator.current());
} while(iterator.next());


/* ------------------------------ Testing ---------------------------------- */

let res = '';

iterator.toLast();

do {
    res += iterator.current();
} while(iterator.prev());

console.assert(res === 'gfedcba', 'Incorrect result');

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
        constructor: (arr) => {
            self._arr = arr;
            self._index = -1;
        },

        next: () => {
            if (self._index >= self._arr.length - 1) {
                return false;
            }

            self._index++;

            return true;
        },

        prev: () => {
            if (self._index < 1) {
                return false;
            }

            self._index--;

            return true;
        },

        current: () => self._arr[self._index]
    })
});


/* ------------------------------- Using ----------------------------------- */

const list = new XES.List(['q', 'w', 'e', 'r', 't', 'y']);

while (list.next()) {
    console.log(list.current());
}


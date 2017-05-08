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

let list = new XES.List(['q', 'w', 'e', 'r', 't', 'y']);

while (list.next()) {
    console.log(list.current());
}


/* ------------------------------ Testing ---------------------------------- */

list = new XES.List([0, 1, 2, 3, 4, 5, 6, 7]);

let reference = [0, 1, 2, 3, 4, 5, 6, 7],
    i = 0, current;

while (list.next()) {
    console.assert(list.current() === reference[i], 'Incorrect current item');
    i++;
}

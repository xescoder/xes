'use strict';

const XES = require('../xes');


/* ------------------------------- Classes ----------------------------------- */

/**
 * @name Counter
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('Counter', {
    instance: (self) => {
        self._count = 0;

        return {
            valueOf: () => ++self._count,
            toString: () => self.valueOf()
        };
    },

    static: (self) => ({
        getInstance: () => {
            if (!self._instance) {
                self._instance = self();
            }

            return self._instance;
        }
    })
});


/* ------------------------------- Using ----------------------------------- */

console.log(XES.Counter.getInstance() + '');
console.log(XES.Counter.getInstance() + '');
console.log(XES.Counter.getInstance() + '');
console.log(XES.Counter.getInstance() + '');
console.log(XES.Counter.getInstance() + '');

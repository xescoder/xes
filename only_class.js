'use strict';

const XES = require('./xes');

const List = XES.decl({
    extends: Array,

    instance: (self, base) => {
        self.index = 0;

        return {
            constructor: (arr) => {
                base.push.apply(base, arr);
            },

            next: () => {
                if (self.index >= base.length - 1) {
                    return false;
                }

                self.index++;

                return true;
            },

            prev: () => {
                if (self.index < 1) {
                    return false;
                }

                self.index--;

                return true;
            },

            current: () => {
                return base[self.index];
            }
        }
    }
});

const list = new List([1, 2, 3, 4, 5]);

do {
   console.log(list.current());
} while(list.next());

console.log();
console.log(List);

console.log();
console.log(XES);

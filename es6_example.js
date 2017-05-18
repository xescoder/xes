'use strict';

const XES = require('./xes');


/* --------------------------------- Декларация ----------------------------- */

XES.decl('List', {
    extends: Array,

    instance: (self, base) => {
        self.index = 0;

        return {
            constructor: (arr) => {
                base.push.apply(base, arr);
            },

            first: () => {
                return base[0];
            },

            last: () => {
                return base[base.length - 1]
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
            },

            forEach: (callback) => {
                base.forEach((val, index) => {
                    if (index % 2 === 0) {
                        callback(val, index);
                    }
                });
            }
        }
    }
});


/* --------------------------------- Использование ----------------------------- */

const list = new XES.List([0, 1, 2, 3, 4, 5, 6, 7]);

console.log('Размер списка: ' + list.length);

console.log();
console.log('Первый элемент списка: ' + list.first());
console.log('Последний элемент списка: ' + list.last());

console.log();
console.log('Содержимое в прямом порядке');

do {
    console.log(list.current());
} while (list.next());

console.log();
console.log('Содержимое в обратном порядке');

do {
    console.log(list.current());
} while (list.prev());

console.log();
console.log('Перебор только чётных с помощью forEach');

list.forEach(function(val) {
    console.log(val);
});

console.log();
console.log('Список - это массив: ' + (list instanceof Array));

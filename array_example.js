var XES = require('./xes');


/* --------------------------------- Декларация ----------------------------- */

var List = XES.decl('List', {
    extends: Array,

    instance: function(self, base) {
        self.index = 0;

        return {
            constructor: function() {
                base.push.apply(base, arguments);
            },

            first: function() {
                return base[0];
            },

            last: function () {
                return base[base.length - 1];
            },

            next: function() {
                if (self.index >= base.length - 1) {
                    return false;
                }

                self.index++;

                return true;
            },

            prev: function() {
                if (self.index < 1) {
                    return false;
                }

                self.index--;

                return true;
            },

            current: function() {
                return base[self.index];
            },

            forEach: function(callback) {
                var _this = this;

                base.forEach(function(val, index) {
                    if (index % 2 === 0) {
                        callback.apply(_this, arguments);
                    }
                });
            },

            valueOf: function() {
                return base.length;
            }
        }
    }
});


/* --------------------------------- Использование ----------------------------- */

var list = new XES.List(0, 1, 2, 3, 4, 5, 6, 7);

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
console.log('Преобразование к числу: ' + +list);
console.log('Список - это массив: ' + XES.is(list, Array));

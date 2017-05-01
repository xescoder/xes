var XES = require('./xes');


/* --------------------------------- Декларация ----------------------------- */

var Hashes = XES.name('Lib.Hashes');

Hashes.decl('HashBase', {
    instance: function(self) {
        self._hash = '';

        return {
            getHash: function() {
                return self._hash;
            },

            _setHash: function() {
                self._hash = self._buildHash();
            },

            _buildHash: function() {
                return 'noop';
            },

            _substr: function() {
                return 'хрень';
            }
        }
    }
});

XES.Lib.Hashes.decl('Hash', {
    extends: Hashes.HashBase,

    instance: function(self, base) {
        return {
            constructor: function() {
                self._setHash();
            },

            _buildHash: function() {
                var value = self.static.getRandom(1000000, 100000000),
                    n = self.static.getRandom(24, 36),
                    maxLen = 32;

                return base._substr(value.toString(n), 0, maxLen);
            },

            _substr: function(str, start, length) {
                return str.substr(start, length);
            },

            toString: function() {
                return base.getHash();
            }
        };
    },

    static: function(self) {
        return {
            getInstance: function() {
                return self();
            },

            getRandom: function(min, max) {
                return (Math.random() * (max - min) + min);
            }
        };
    }
});


/* --------------------------------- Использование ----------------------------- */

var hash = XES.Lib.Hashes.Hash.getInstance(),
    getStringHash = hash.toString;

// Попытка изменить приватное поле после инициализации
hash._hash = '12345';

// Проверка принадлежности базовому классу
console.log('hash унаследован от XES.Libs.Hashes.HashBase: ' + XES.is(hash, Hashes.HashBase));

// Вызов функции без контекста
console.log('Вызов функции без контекста: ' + getStringHash());

// Вызов статической функции
console.log('Вызов статической функции: ' + XES.Lib.Hashes.Hash.getRandom(1000, 5000));

console.log();
console.log('Принт HashBase');
console.log(Hashes.HashBase);

console.log();
console.log('Принт Hash');
console.log(Hashes.Hash);

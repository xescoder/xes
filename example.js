var XES = require('./xes');


/* --------------------------------- Декларация ----------------------------- */

XES.decl('HashBase', {
    init: function(self) {
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

XES.decl('Hash', {
    extend: XES.HashBase,

    init: function(self, base) {
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

    static: function() {
        return {
            getRandom: function(min, max) {
                return (Math.random() * (max - min) + min);
            }
        };
    }
});


/* --------------------------------- Использование ----------------------------- */

var hash = XES.Hash(),
    getStringHash = hash.toString;

// Попытка изменить приватное поле после инициализации
hash._hash = '12345';

// Вызов функции без контекста
console.log(getStringHash());

// Вызов статичной функции
console.log(XES.Hash.getRandom(1000, 5000));

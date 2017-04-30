var XES = (function() {
    var hasOwn = Object.prototype.hasOwnProperty,
        objCreate = Object.create || function(ptp) {
            var inheritance = function () {};
            inheritance.prototype = ptp;
            return new inheritance();
        },
        privateStatic = {}, // хранилище приватных статических областей видимости
        namespaceProto = {}, // прототип для пространств имён
        $ = objCreate(namespaceProto); // публичный интерфейс

    /**
     * Вовзращает true, если переданное значение является фуркцией
     *
     * @private
     * @param {*} value
     * @returns {Boolean}
     */
    function isFunction(value) {
        return typeof value === 'function';
    }

    /**
     * Расширяет объект dest свойствами объекта source
     *
     * @private
     * @param {Object} dest
     * @param {*} source
     */
    function extend(dest, source) {
        if (!source || typeof source !== 'object') {
            return;
        }

        for (var key in source) {
            if (hasOwn.call(source, key)) {
                dest[key] = source[key];
            }
        }
    }

    /**
     * Создаёт экземпляр класса
     *
     * @private
     * @param {Function} Constructor - конструктор класса
     * @param {Object} opt - вспомогательный агрумент для передачи общего публичного интерфейса
     * @returns {Object}
     */
    function create(Constructor, opt) {
        var base, self, pub;

        if (!opt) {
            opt = { res: {} };
        }

        // Если нативный конструктор
        if (!isFunction(Constructor.$instance)) {
            base = new Constructor();
            opt.res = objCreate(base);
            return base;
        }

        if (Constructor.$extend) {
            base = create(Constructor.$extend, opt);
        } else {
            base = {};
        }

        self = objCreate(opt.res);

        self.static = privateStatic[Constructor.$fullName];
        pub = Constructor.$instance(self, base);

        extend(opt.res, pub);

        return opt.res;
    }

    /**
     * Создаёт конструктор класса
     *
     * @private
     * @returns {Function}
     */
    function createConstructor() {
        return function XES_Class() {
            var res = create(XES_Class);

            if (isFunction(res.constructor)) {
                res.constructor.apply(res, arguments);
            }

            res.constructor = XES_Class;

            return res;
        };
    }

    /**
     * Создаёт статическую область видимости класса
     *
     * @private
     * @param {String} fullName - полное имя класса
     * @param {Object} st - декларация статической области видимости
     * @returns {Object}
     */
    function createStatic(fullName, st) {
        var self = privateStatic[fullName] = {},
            pub = st(self);

        extend(self, pub);

        return pub;
    }

    /**
     * Возвращает true, если класс Child унаследован от класса Parent
     *
     * @private
     * @param {Function} Child
     * @param {Function} Parent
     * @returns {Boolean}
     */
    function isExtend(Child, Parent) {
        while (Child && Child.$fullName) {
            if (Child.$fullName === Parent.$fullName) {
                return true;
            }

            Child = Child.$extend;
        }

        return false;
    }

    /**
     * Создаёт пространство имён
     *
     * @private
     * @param {Object} base - базовое пространство имён
     * @param {String} name - название пространства имён
     * @returns {Object}
     */
    function createNamespace(base, name) {
        if (!base || base.$type !== $.TYPES.NAMESPACE) {
            throw new Error('XES: ' + base.$fullName + ' is not namespace');
        }

        if (hasOwn.call(base, name)) {
            return base[name];
        }

        var namespace = base[name] = objCreate(namespaceProto),
            fullName = base.$fullName + '.' + name;

        namespace.$name = name;
        namespace.$fullName = fullName;

        return namespace;
    }

    /**
     * Рекурсивно создаёт пространстро имён,
     * разделяя название по точкам
     *
     * @private
     * @param {Object} base - базовое пространство имён
     * @param {String} name - название пространства имён
     * @returns {Object}
     */
    function createNamespaceRecursive(base, name) {
        var names = name.split('.'), i;

        for (i = 0; i < names.length; i++) {
            base = createNamespace(base, names[i]);
        }

        return base;
    }

    /**
     * Список типов, реализованных в XES
     *
     * @public
     * @type {{NAMESPACE: string, CLASS: string}}
     */
    $.TYPES = {
        NAMESPACE: 'Namespace',
        CLASS: 'Class'
    };

    /**
     * @public
     * @type {string}
     */
    $.$fullName = 'XES';

    /**
     * Возвращает true, если obj унаследован от Constructor
     *
     * @public
     * @param {*} obj
     * @param {*} Constructor
     * @returns {Boolean}
     */
    $.is = function(obj, Constructor) {
        if (obj instanceof Constructor) {
            return true;
        }

        if (!obj || !obj.constructor || obj.constructor.$type !== $.TYPES.CLASS) {
            return false;
        }

        if (!Constructor || Constructor.$type !== $.TYPES.CLASS) {
            return false;
        }

        return isExtend(obj.constructor, Constructor);
    };

    /**
     * @public
     * @type {string}
     */
    namespaceProto.$type = $.TYPES.NAMESPACE;

    /**
     * Создает новое пространство имён
     *
     * @public
     * @param {String} name - название пространста имён
     * @returns {Object}
     */
    namespaceProto.name = function(name) {
        return createNamespaceRecursive(this, name);
    };

    /**
     * Декларирует новый класс
     *
     * @public
     * @param {String} name - имя класса
     * @param {Object} body - тело класса
     * @returns {Function}
     */
    namespaceProto.decl = function(name, body) {
        if (!this || this.$type !== $.TYPES.NAMESPACE) {
            throw new Error('XES: ' + this.$fullName + ' is not namespace');
        }

        var fullName = this.$fullName + '.' + name;

        if (hasOwn.call(this, name)) {
            throw new Error('XES: ' + fullName + ' is exist');
        }

        var Constructor = this[name] = createConstructor();

        Constructor.$name = name;
        Constructor.$fullName = fullName;
        Constructor.$type = $.TYPES.CLASS;

        body = body || {};

        Constructor.$extend = body.extend;
        Constructor.$instance = body.instance || (function() {});

        if (body.static) {
            extend(Constructor, createStatic(fullName, body.static));
        }

        return Constructor;
    };

    return $;
})();

if (module && module.parent) {
    module.exports = XES;
}
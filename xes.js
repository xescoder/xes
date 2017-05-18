(function(global, undef) {

    /**
     * Пространство имён XES
     *
     * @namespace
     * @typedef {Object} XES.Namespace
     * @property {String} $type - тип объекта (Namespace)
     * @property {String} $name - название пространства имён
     * @property {String} $fullName - полное название пространства имён
     * @property {Function} name - создаёт вложенное пространство имён (XES.Namespace)
     * @property {Function} decl - декларирует вложенный класс (XES.Class)
     */

    /**
     * Класс XES
     *
     * @class
     * @typedef {Function} XES.Class
     * @property {String} $type - тип объекта (Class)
     * @property {String} $name - название класса
     * @property {String} $fullName - полное название класса
     * @Property {String} $classId - уникальный идентификатор класса
     * @property {XES.Class} $extends - базовый класс
     * @property {Function} $instance - декларация экземпляра класса
     */

    /**
     * Класс ошибок XES
     *
     * @class
     * @typedef {Function} XES.Error
     * @property {String} name
     * @property {String} message
     * @property {String} stack
     */

    var hasOwn = Object.prototype.hasOwnProperty,
        objCreate = Object.create || function(proto) {
                var inheritance = function () {};
                inheritance.prototype = proto;
                return new inheritance();
            },

        privateStatic = {}, // хранилище приватных статических областей видимости
        namespaceProto = {}, // прототип для пространств имён
        $ = objCreate(namespaceProto); // публичный интерфейс

    /**
     * Вовзращает true, если переданное значение является функцией
     *
     * @private
     * @param {*} value
     * @returns {Boolean}
     */
    function isFunction(value) {
        return typeof value === 'function';
    }

    /**
     * Возвращает true, если переданное значение является объектом
     *
     * @private
     * @param {*} value
     * @returns {Boolean}
     */
    function isObject(value) {
        return Boolean(value) && typeof value === 'object';
    }

    /**
     * Возвращает случайную строку символов
     *
     * @private
     * @returns {String}
     */
    function randomString() {
        var res = '', i;

        for (i = 0; i < 5; i++) {
            res += (((Math.random() + 1) * 5e9)^0).toString(36);
        }

        return res;
    }

    /**
     * Расширяет объект dest свойствами объекта source
     *
     * @private
     * @param {Object} dest
     * @param {*} source
     */
    function extend(dest, source) {
        if (!isObject(source)) {
            return;
        }

        for (var key in source) {
            if (hasOwn.call(source, key)) {
                dest[key] = source[key];
            }
        }
    }

    /**
     * Находит непереопределённый абстракный метод
     * в инстансе класса
     *
     * @private
     * @param {Object} instance
     * @returns {String|Undefined}
     */
    function findAbstractMethod(instance) {
        for (var key in instance) {
            if (hasOwn.call(instance, key) && (instance[key] === $.Abstract)) {
                return key;
            }
        }

        return undef;
    }

    /**
     * Создаёт экземпляр класса
     *
     * @private
     * @param {XES.Class|Function} Constructor - конструктор класса
     * @param {Object} [opt] - вспомогательный агрумент для передачи общего публичного интерфейса
     * @returns {Object}
     */
    function create(Constructor, opt) {
        var base, self, pub;

        if (!opt) {
            opt = {};

            // Нативные методы прототипа считаем
            // базовыми методами создаваемого инстанса
            opt.base = objCreate(Constructor.prototype);
            opt.res = objCreate(opt.base);
        }

        if (!Constructor || !isFunction(Constructor.$instance)) {
            return opt;
        }

        if (Constructor.$extends) {
            opt = create(Constructor.$extends, opt);
        }

        self = objCreate(opt.res);

        base = opt.base;
        opt.base = objCreate(opt.base);

        self.static = privateStatic[Constructor.$classId];
        pub = Constructor.$instance(self, base);

        extend(opt.res, pub);
        extend(opt.base, pub);

        return opt;
    }

    /**
     * Создаёт конструктор класса
     *
     * @private
     * @returns {XES.Class}
     */
    function createConstructor() {
        return function XES_Class() {
            var res = create(XES_Class).res,
                abstract = findAbstractMethod(res);

            if (abstract) {
                throw new $.Error('Abstract method "' + abstract + '" is not override', XES_Class);
            }

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
     * @param {XES.Class} Constructor - конструктор класса
     * @param {Function} st - декларация статической области видимости
     * @returns {Object}
     */
    function createStatic(Constructor, st) {
        var self = privateStatic[Constructor.$classId] = function() {
                return Constructor.apply(this, arguments);
            },
            pub = {};

        if (isFunction(st)) {
            pub = st(self);
            extend(self, pub);
        }

        return pub;
    }

    /**
     * Возвращает true, если класс Child унаследован от класса Parent
     *
     * @private
     * @param {XES.Class} Child
     * @param {XES.Class} Parent
     * @returns {Boolean}
     */
    function isExtends(Child, Parent) {
        while (Child && Child.$classId) {
            if (Child.$classId === Parent.$classId) {
                return true;
            }

            Child = Child.$extends;
        }

        return false;
    }

    /**
     * Создаёт пространство имён
     *
     * @private
     * @param {XES.Namespace} base - базовое пространство имён
     * @param {String} name - название пространства имён
     * @returns {XES.Namespace}
     */
    function createNamespace(base, name) {
        if (!base || base.$type !== $.TYPES.NAMESPACE) {
            throw new $.Error(base.$fullName + ' is not namespace', namespaceProto.name);
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
     * @param {XES.Namespace} base - базовое пространство имён
     * @param {String} name - название пространства имён
     * @returns {XES.Namespace}
     */
    function createNamespaceRecursive(base, name) {
        var names = name.split('.'), i;

        for (i = 0; i < names.length; i++) {
            base = createNamespace(base, names[i]);
        }

        return base;
    }

    /**
     * Публикует библиотеку
     *
     * @private
     * @param {Object} XES
     */
    function publish(XES) {
        if (isObject(exports)) {
            module.exports = XES;
            return;
        }

        if (isObject(modules) && isFunction(modules.define)) {
            modules.define('XES', function(provide) {
                provide(XES);
            });

            return;
        }

        if (isFunction(define)) {
            define(function(require, exports, module) {
                module.exports = XES;
            });

            return;
        }

        global.XES = XES;
    }

    /**
     * Список типов, реализованных в XES
     *
     * @public
     * @type {{NAMESPACE: string, CLASS: string}}
     * @memberOf XES
     */
    $.TYPES = {
        NAMESPACE: 'Namespace',
        CLASS: 'Class'
    };

    /**
     * Идентификатор абстракного метода
     *
     * @public
     * @type {String}
     * @memberOf XES
     */
    $.Abstract = randomString();

    /**
     * @public
     * @type {string}
     * @memberOf XES
     */
    $.$fullName = 'XES';

    /**
     * Возвращает true, если obj унаследован от Constructor
     *
     * @public
     * @memberOf XES
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

        return isExtends(obj.constructor, Constructor);
    };

    /**
     * Класс ошибок XES
     *
     * @public
     * @type {XES.Error}
     * @param {String} message - текст ошибки
     * @param {Function} func - функция, до которой собирается стек ошибок
     * @constructor
     * @memberOf XES
     */
    $.Error = function XES_Error(message, func) {
        this.name = 'XES.Error';
        this.message = message || '';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, func);
        } else {
            this.stack = (new Error()).stack;
        }
    };

    $.Error.prototype = Error.prototype;

    /**
     * @public
     * @memberOf XES
     * @type {string}
     */
    namespaceProto.$type = $.TYPES.NAMESPACE;

    /**
     * Создает новое пространство имён
     *
     * @public
     * @memberOf XES
     * @param {String} name - название пространста имён
     * @returns {XES.Namespace}
     */
    namespaceProto.name = function(name) {
        return createNamespaceRecursive(this, name);
    };

    /**
     * Декларирует новый класс
     *
     * @public
     * @memberOf XES
     * @param {String} name - имя класса
     * @param {Object} body - тело класса
     * @returns {XES.Class}
     */
    namespaceProto.decl = function(name, body) {
        var Constructor = createConstructor(),
            fullName;

        if (!body) {
            body = name;
            name = undef;
        }

        if (name) {
            if (!this || this.$type !== $.TYPES.NAMESPACE) {
                throw new $.Error(this.$fullName + ' is not namespace', namespaceProto.decl);
            }

            fullName = this.$fullName + '.' + name;

            if (hasOwn.call(this, name)) {
                throw new $.Error(fullName + ' is exist', namespaceProto.decl);
            }

            Constructor.$name = name;
            Constructor.$fullName = fullName;

            this[name] = Constructor;
        }

        Constructor.$type = $.TYPES.CLASS;
        Constructor.$classId = randomString();

        body = body || {};

        extend(Constructor, createStatic(Constructor, body.static));

        Constructor.$instance = isFunction(body.instance) ? body.instance : (function() {});
        Constructor.$extends = isFunction(body.extends) ? body.extends : Object;
        Constructor.prototype = objCreate(Constructor.$extends.prototype);

        return Constructor;
    };

    // Публикуем библиотеку
    publish($);
})(this);
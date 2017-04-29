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

    function isFunction(value) {
        return typeof value === 'function';
    }

    function extend(dest, source) {
        for (var key in source) {
            if (hasOwn.call(source, key)) {
                dest[key] = source[key];
            }
        }
    }

    function create(Constructor, res) {
        // Если нативный конструктор
        if (!isFunction(Constructor.$init)) {
            return new Constructor();
        }

        if (!res) {
            res = {};
        }

        var base, self, pub;

        if (Constructor.$extend) {
            base = create(Constructor.$extend, res);
        } else {
            base = {};
        }

        self = objCreate(res);

        self.static = privateStatic[Constructor.$fullName];
        pub = Constructor.$init(self, base);

        extend(res, pub);

        return res;
    }

    function createStatic(fullName, st) {
        var self = privateStatic[fullName] = {},
            pub = st(self);

        extend(self, pub);

        return pub;
    }

    function createNamespace(base, name) {
        var fullName = base.$fullName + '.' + name;

        if (!base || base.$type !== $.TYPES.NAMESPACE) {
            throw new Error('XES: ' + base.$fullName + ' is not namespace');
        }

        if (hasOwn.call(base, name)) {
            return base[name];
        }

        var namespace = base[name] = objCreate(namespaceProto);

        namespace.$name = name;
        namespace.$fullName = fullName;

        return namespace;
    }

    function createNamespaceRecursive(base, name) {
        var names = name.split('.'), i;

        for (i = 0; i < names.length; i++) {
            base = createNamespace(base, names[i]);
        }

        return base;
    }

    $.TYPES = {
        NAMESPACE: 'Namespace',
        CLASS: 'Class'
    };

    namespaceProto.$type = $.TYPES.NAMESPACE;

    namespaceProto.name = function(name) {
        return createNamespaceRecursive(this, name);
    };

    namespaceProto.decl = function(name, body) {
        var fullName = this.$fullName + '.' + name;

        if (hasOwn.call(this, name)) {
            throw new Error('XES: ' + fullName + ' is exist');
        }

        var Constructor = this[name] = function() {
            var res = create(Constructor);

            if (isFunction(res.constructor)) {
                res.constructor.apply(res, arguments);
            }

            delete res.constructor;

            return res;
        };

        Constructor.$name = name;
        Constructor.$fullName = fullName;
        Constructor.$type = $.TYPES.CLASS;

        Constructor.$extend = body.extend;
        Constructor.$init = body.init;

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
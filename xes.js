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
        if (!source || typeof source !== 'object') {
            return;
        }

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

    function isExtend(Child, Parent) {
        while (Child && Child.$fullName) {
            if (Child.$fullName === Parent.$fullName) {
                return true;
            }

            Child = Child.$extend;
        }

        return false;
    }

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

    $.$fullName = 'XES';

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

    namespaceProto.$type = $.TYPES.NAMESPACE;

    namespaceProto.name = function(name) {
        return createNamespaceRecursive(this, name);
    };

    namespaceProto.decl = function(name, body) {
        if (!this || this.$type !== $.TYPES.NAMESPACE) {
            throw new Error('XES: ' + this.$fullName + ' is not namespace');
        }

        var fullName = this.$fullName + '.' + name;

        if (hasOwn.call(this, name)) {
            throw new Error('XES: ' + fullName + ' is exist');
        }

        var Constructor = this[name] = function() {
            var res = create(Constructor);

            if (isFunction(res.constructor)) {
                res.constructor.apply(res, arguments);
            }

            res.constructor = Constructor;

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
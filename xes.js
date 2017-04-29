var XES = (function() {
    var hasOwn = Object.prototype.hasOwnProperty,
        objCreate = Object.create || function(ptp) {
            var inheritance = function () {};
            inheritance.prototype = ptp;
            return new inheritance();
        },
        privateStatic = {};

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

        self.static = privateStatic[Constructor.$name];
        pub = Constructor.$init(self, base);

        extend(res, pub);

        return res;
    }

    function createStatic(name, st) {
        var self = privateStatic[name] = {},
            pub = st(self);

        extend(self, pub);

        return pub;
    }

    return {
        decl: function(name, body) {
            var Constructor = XES[name] = function() {
                var res = create(Constructor);

                if (isFunction(res.constructor)) {
                    res.constructor.apply(res, arguments);
                }

                delete res.constructor;

                return res;
            };

            Constructor.$name = name;
            Constructor.$extend = body.extend;
            Constructor.$init = body.init;

            if (body.static) {
                extend(Constructor, createStatic(name, body.static));
            }

            return Constructor;
        }
    };
})();

if (module && module.parent) {
    module.exports = XES;
}
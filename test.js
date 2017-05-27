var XES = require('./xes');

XES.decl('Class', {
    instance: (self) => ({
        constructor: (value) => {
            self._value = value;
        },

        set: (value) => {
            self._value = value;
        },

        get: () => self._value
    }),

    static: (self) => {
        self._staticValue = 0;

        return {
            set: (value) => {
                self._staticValue = value;
            },

            get: () => self._staticValue
        }
    }
});

XES.stub(XES.Class, {
    base: (base) => ({

    }),

    instance: (pub, self, base) => {
        pub.constructor = () => {
            self._value = 'stub';
        };

        // pub.get = () => 'stub';
    },

    static: (pub, self) => ({

    })
});

var inst1 = new XES.Class('real');

console.log(inst1.get());

XES.resetStub(XES.Class);

var inst2 = new XES.Class('real');

console.log(inst2.get());

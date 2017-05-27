var XES = require('./xes');

XES.decl('Base', {
    instance: () => ({
        get: () => 'base real'
    })
});

XES.decl('Class', {
    extends: XES.Base,

    instance: (self, base) => ({
        constructor: (value) => {
            self._value = value;
        },

        set: (value) => {
            self._value = value;
        },

        get: () => base.get() + ', ' + self._value
    }),

    static: (self) => {
        self._staticValue = 'real';

        return {
            set: (value) => {
                self._staticValue = value;
            },

            get: () => self._staticValue
        }
    }
});

XES.stub(XES.Class, {
    base: (base) => {
        base.get = () => 'base stub';
    },

    instance: (pub, self, base) => {
        pub.constructor = () => {
            self._value = 'stub';
        };
    },

    static: (pub, self) => {
        self._staticValue = 123;

        pub.get = () => 'stub: ' + self._staticValue;
    }
});


const inst1 = new XES.Class('real');

console.log(XES.Class.get());
console.log(inst1.get());
console.log();

XES.resetStub(XES.Class);

const inst2 = new XES.Class('real');

console.log(XES.Class.get());
console.log(inst2.get());

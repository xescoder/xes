'use strict';

const XES = require('../xes');


/* ------------------------------- Base classes ----------------------------------- */

XES.decl('Control', {
    instance: () => ({
        render: XES.Abstract
    })
});

XES.decl('Button', {
    extends: XES.Control,

    instance: (self) => {
        self._text = '';

        return {
            text: function(val) {
                if (typeof val === 'undefined') {
                    return self._text;
                }

                self._text = val;

                return this;
            }
        }
    }
});

XES.decl('AbstractFactory', {
    instance: () => ({
        getButton: XES.Abstract,
        getSearch: XES.Abstract
    })
});


/* ------------------------------- HTML4 classes ----------------------------------- */

XES.name('HTML4');

XES.HTML4.decl('Button', {
    extends: XES.Button,

    instance: (self, base) => ({
        render: () => '<input type="submit" value="' + base.text() + '">'
    })
});

XES.HTML4.decl('Search', {
    extends: XES.Control,

    instance: () => ({
        render: () => '<input type="text" name="q">'
    })
});

XES.HTML4.decl('Factory', {
    extends: XES.AbstractFactory,

    instance: () => ({
        getButton: () => new XES.HTML4.Button(),
        getSearch: () => new XES.HTML4.Search()
    })
});


/* ------------------------------- HTML4 classes ----------------------------------- */

XES.name('HTML5');

XES.HTML5.decl('Button', {
    extends: XES.Button,

    instance: (self, base) => ({
        render: () => '<button>' + base.text() + '</button>'
    })
});

XES.HTML5.decl('Search', {
    extends: XES.Control,

    instance: () => ({
        render: () => '<input type="search" name="q">'
    })
});

XES.HTML5.decl('Factory', {
    extends: XES.AbstractFactory,

    instance: () => ({
        getButton: () => new XES.HTML5.Button(),
        getSearch: () => new XES.HTML5.Search()
    })
});


/* ------------------------------- Factory ----------------------------------- */

XES.decl('Factory', {
    extends: XES.AbstractFactory,

    instance: (self) => {
        self._factory = null;

        return {
            constructor: (htmlType) => {
                switch(htmlType) {
                    case 'html4':
                        self._factory = new XES.HTML4.Factory();
                        break;

                    case 'html5':
                        self._factory = new XES.HTML5.Factory();
                        break;

                    default:
                        throw new Error('invalid html type');
                }
            },

            getButton: (text) => self._factory.getButton().text(text),
            getSearch: () => self._factory.getSearch()
        }
    }
});


/* ------------------------------- Using ----------------------------------- */

const factory = new XES.Factory('html5');

console.log(factory.getButton('click me').render());
console.log(factory.getSearch().render());

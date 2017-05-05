var XES = require('../xes');


/* ------------------------------- Base classes ----------------------------------- */

XES.decl('Control', {
    instance: function() {
        return {
            render: function() {
                throw new Error('abstract method');
            }
        }
    }
});

XES.decl('Button', {
    extends: XES.Control,

    instance: function(self) {
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


/* ------------------------------- HTML4 classes ----------------------------------- */

XES.name('HTML4');

XES.HTML4.decl('Button', {
    extends: XES.Button,

    instance: function(self, base) {
        return {
            render: function() {
                return '<input type="submit" value="' + base.text() + '">';
            }
        }
    }
});

XES.HTML4.decl('Search', {
    extend: XES.Control,

    instance: function() {
        return {
            render: function() {
                return '<input type="text" name="q">';
            }
        }
    }
});

XES.HTML4.decl('Factory', {
    instance: function() {
        return {
            getButton: function() {
                return new XES.HTML4.Button();
            },

            getSearch: function() {
                return new XES.HTML4.Search();
            }
        };
    }
});


/* ------------------------------- HTML4 classes ----------------------------------- */

XES.name('HTML5');

XES.HTML5.decl('Button', {
    extends: XES.Button,

    instance: function(self, base) {
        return {
            render: function() {
                return '<button>' + base.text() + '</button>';
            }
        }
    }
});

XES.HTML5.decl('Search', {
    extend: XES.Control,

    instance: function() {
        return {
            render: function() {
                return '<input type="search" name="q">';
            }
        }
    }
});

XES.HTML5.decl('Factory', {
    instance: function() {
        return {
            getButton: function() {
                return new XES.HTML5.Button();
            },

            getSearch: function() {
                return new XES.HTML5.Search();
            }
        };
    }
});


/* ------------------------------- Factory ----------------------------------- */

XES.decl('Factory', {
    instance: function(self) {
        self._factory = null;

        return {
            constructor: function (htmlType) {
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

            getButton: function(text) {
                return self._factory.getButton().text(text);
            },

            getSearch: function() {
                return self._factory.getSearch();
            }
        }
    }
});


/* ------------------------------- Using ----------------------------------- */

var factory = new XES.Factory('html5');

console.log(factory.getButton('click me').render());
console.log(factory.getSearch().render());

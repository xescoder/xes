'use strict';

const XES = require('../xes');


/* ------------------------------- Classes ----------------------------------- */

/**
 * @name Component
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('Component', {
    instance: () => ({
        render: XES.Abstract
    }),

    static: () => ({
        INDENT: '    '
    })
});

/**
 * @name List
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('List', {
    extends: XES.Component,

    instance: (self) => ({
        constructor: () => {
            self._items = [];
        },

        get: (index) => self._items[index],

        add: (item) => {
            self._items.push(item);
            return self.public;
        },

        remove: (index) => {
            self._items.splice(index, 1);
            return self.public;
        },

        length: () => self._items.length,

        render: (indent) => {
            indent = indent || '';

            const list = self._items
                .map((item) => item.render(indent + XES.Component.INDENT))
                .join('\n');

            const all = [
                indent + '<ul>',
                list,
                indent + '</ul>'
            ];

            return all.join('\n');
        }
    })
});

/**
 * @name SubList
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('SubList', {
    extends: XES.List,

    instance: (self, base) => ({
        constructor: (text) => {
            base.constructor();
            self._text = text;
        },

        render: (indent) => {
            indent = indent || '';

            const list = base.render(indent + XES.Component.INDENT);
            const all = [
                indent + '<li>',
                indent + XES.Component.INDENT + self._text,
                list,
                indent + '</li>'
            ];

            return all.join('\n');
        }
    })
});

/**
 * @name Item
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('Item', {
    extends: XES.Component,

    instance: (self, base) => ({
        constructor: (text) => {
            self._text = text;
        },

        render: (indent) => {
            return (indent || '') + '<li>' + self._text + '</li>';
        }
    })
});


/* ------------------------------- Using ----------------------------------- */

const list = new XES.List();

list.add(
    (new XES.SubList('first'))
        .add(new XES.Item('sub first'))
        .add(new XES.Item('sub second'))
);

list.add(new XES.Item('second'));

console.log(list.render());


/* ------------------------------ Testing ---------------------------------- */

const reference = "\
<ul>\n\
    <li>\n\
        first\n\
        <ul>\n\
            <li>sub first</li>\n\
            <li>sub second</li>\n\
        </ul>\n\
    </li>\n\
    <li>second</li>\n\
</ul>";

console.assert(list.render() === reference, 'Incorrect composite');

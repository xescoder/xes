'use strict';

const XES = require('../xes');


/* ------------------------------- Base classes ----------------------------------- */

/**
 * @name Builder
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('Builder', {
    instance: () => ({
        addTitle: XES.Abstract,
        addContent: XES.Abstract,
        toString: XES.Abstract
    })
});


/* ---------------------------------- Builders ----------------------------------- */

/**
 * @name HTMLBuilder
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('HTMLBuilder', {
    extends: XES.Builder,

    instance: (self) => {
        self._text = '';

        return {
            addTitle: (title) => {
                self._text += '<h1>' + title + '</h1>\n';
            },

            addContent: (content) => {
                self._text += '<p>' + content + '</p>\n';
            },

            toString: () => self._text
        };
    }
});

/**
 * @name MarkdownBuilder
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('MarkdownBuilder', {
    extends: XES.Builder,

    instance: (self) => {
        self._text = '';

        return {
            addTitle: (title) => {
                self._text += '#' + title + '\n';
            },

            addContent: (content) => {
                self._text += content + '\n';
            },

            toString: () => self._text
        };
    }
});


/* ---------------------------------- Client ----------------------------------- */

function getBuilder(type) {
   switch (type) {
       case 'html':
           return new XES.HTMLBuilder();
       case 'markdown':
           return new XES.MarkdownBuilder();
       default:
           throw new Error('invalid builder type');
   }
}

const builder = getBuilder('html');

builder.addTitle('Test title');
builder.addContent('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.');

console.log(String(builder));


/* ------------------------------ Testing ---------------------------------- */

let reference = '';

reference += '<h1>Test title</h1>\n';
reference += '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>\n';

console.assert(String(builder) === reference, 'Incorrect build result');

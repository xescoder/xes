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
    })
});

/**
 * @name Block
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('Image', {
    extends: XES.Component,

    instance: (self) => ({
        constructor: (src) => {
            self._src = src;
        },

        render: () => `<img src="${self._src}">`
    })
});

/**
 * @name Decorator
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('Decorator', {
    extends: XES.Component,

    instance: (self) => ({
        constructor: (component) => {
            self._component = component;
        },

        render: () => self._component.render()
    })
});

/**
 * @name LinkDecorator
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('LinkDecorator', {
    extends: XES.Decorator,

    instance: (self, base) => ({
        constructor: (component, href) => {
            base.constructor(component);
            self._href = href;
        },

        render: () => {
            const content = base.render();
            return `<a href="${self._href}">${content}</a>`;
        }
    })
});


/* ------------------------------- Using ----------------------------------- */

const image = new XES.Image('test.jpg');
const link = new XES.LinkDecorator(image, '/');

console.log(link.render());


/* ------------------------------ Testing ---------------------------------- */

console.assert(link.render() === '<a href="/"><img src="test.jpg"></a>', 'Incorrect result');

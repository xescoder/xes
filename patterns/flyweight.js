'use strict';

const XES = require('../xes');


/* ------------------------------- Classes ----------------------------------- */

/**
 * @name Tag
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('Tag', {
    instance: (self) => ({
        constructor: (name) => {
            self._name = name;
        },

        render: (content) => `<${self._name}>${content}</${self._name}>`
    })
});

/**
 * @name Img
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('Img', {
    extends: XES.Tag,

    instance: () => ({
        render: (src) => `<img src="${src}">`
    })
});

/**
 * @name A
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('A', {
    extends: XES.Tag,

    instance: () => ({
        render: (href, content) => `<a href="${href}">${content}</a>`
    })
});

/**
 * @name TagsFactory
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('TagsFactory', {
    static: (self) => {
        self._tags = {};

        return {
            get: (name) => {
                if (self._tags[name]) {
                    return self._tags[name];
                }

                let tag;

                if (name === 'a') {
                    tag = new XES.A();
                } else if (name === 'img') {
                    tag = new XES.Img();
                } else {
                    tag = new XES.Tag(name);
                }

                self._tags[name] = tag;

                return self._tags[name];
            }
        };
    }
});


/* ------------------------------- Using ----------------------------------- */

const list = XES.TagsFactory.get('ul');
const item = XES.TagsFactory.get('li');
const link = XES.TagsFactory.get('a');
const image = XES.TagsFactory.get('img');

const html = list.render([
    item.render('text'),
    item.render(link.render('/first', image.render('first.jpg'))),
    item.render(link.render('/second', image.render('second.jpg')))
].join(''));

console.log(html);


/* ------------------------------ Testing ---------------------------------- */

const reference = '<ul><li>text</li><li><a href="/first"><img src="first.jpg"></a></li>' +
    '<li><a href="/second"><img src="second.jpg"></a></li></ul>';

console.assert(html === reference, 'Incorrect result');

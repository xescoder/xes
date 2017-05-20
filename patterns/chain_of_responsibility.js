'use strict';

const XES = require('../xes');


/* ------------------------------- Classes ----------------------------------- */

/**
 * @name ClickHandler
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('ClickHandler', {
    instance: (self) => ({
        setParent: (parent) => {
            self._parent = parent;
        },

        onClick: (callback) => {
            self._onclick = callback;
        },

        click: (param) => {
            if (typeof self._onclick === 'function') {
                self._onclick(param);
                return;
            }

            if (self._parent) {
                self._parent.click(param);
            }
        }
    })
});

/**
 * @name Node
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('Node', {
    extends: XES.ClickHandler,

    instance: (self, base) => ({
        constructor: function(name, childs) {
            self._name = name;

            if (childs) {
                (Array.isArray(childs) ? childs : [childs]).forEach((child) => {
                    child.setParent(this);
                });
            }
        },

        click: (name) => {
            base.click(name || self._name);
        }
    })
});


/* ------------------------------- Using ----------------------------------- */

const resetButton = new XES.Node('ResetButton');
const submitButton = new XES.Node('SubmitButton');

const form = new XES.Node('Form', [resetButton, submitButton]);
const page = new XES.Node('Page', form);

page.onClick((name) => {
    console.log(name);
});

submitButton.click();


/* ------------------------------ Testing ---------------------------------- */

form.onClick((name) => {
    console.assert(name === 'ResetButton', 'Incorrect result');
});

resetButton.click();

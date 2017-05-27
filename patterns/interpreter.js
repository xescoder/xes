'use strict';

const XES = require('../xes');


/* ------------------------------- Classes ----------------------------------- */

/**
 * @name BooleanExp
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('BooleanExp', {
    instance: () => ({
        evaluate: XES.Abstract
    })
});

/**
 * @name VariableExp
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('VariableExp', {
    extends: XES.BooleanExp,

    instance: (self) => ({
        set: (value) => {
            self._value = value;
        },

        get: () => self._value,

        evaluate: () => Boolean(self._value)
    })
});

/**
 * @name AndExp
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('AndExp', {
    extends: XES.BooleanExp,

    instance: (self) => ({
        constructor: (...operands) => {
            self._operands = operands;
        },

        evaluate: () => {
            return self._operands.reduce((res, operand) => {
                return res && operand.evaluate();
            }, true);
        }
    })
});

/**
 * @name OrExp
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('OrExp', {
    extends: XES.BooleanExp,

    instance: (self) => ({
        constructor: (...operands) => {
            self._operands = operands;
        },

        evaluate: () => {
            return self._operands.reduce((res, operand) => {
                return res || operand.evaluate();
            }, false);
        }
    })
});

/**
 * @name NotExp
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('NotExp', {
    extends: XES.BooleanExp,

    instance: (self) => ({
        constructor: (operand) => {
            self._operand = operand;
        },

        evaluate: () => !self._operand.evaluate()
    })
});


/* ------------------------------- Using ----------------------------------- */

const x = new XES.VariableExp();
const y = new XES.VariableExp();
const z = new XES.VariableExp();

// x && (y || !z)
const expression = new XES.AndExp(x, new XES.OrExp(y, new XES.NotExp(z)));

x.set(true);
y.set(false);
z.set(false);

let res = expression.evaluate();

console.log(res);


/* ------------------------------ Testing ---------------------------------- */

console.assert(res === true, 'Incorrect first result');

z.set(true);
res = expression.evaluate();

console.assert(expression.evaluate() === false, 'Incorrect second result');

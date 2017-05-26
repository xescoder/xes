'use strict';

const XES = require('../xes');


/* ------------------------------- Classes ----------------------------------- */

/**
 * @name Command
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('Command', {
    instance: (self) => ({
        execute: () => {
            self.static._madeCommands.push(self.public);
        },

        undo: XES.Abstract
    }),

    static: (self) => {
        self._madeCommands = [];

        return {
            undo: () => {
                const command = self._madeCommands.pop();

                if (command) {
                    command.undo();
                }
            }
        }

    }
});

/**
 * @name Menu
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('Menu', {
    instance: (self) => ({
        constructor: (command) => {
            self._command = command;
        },

        click: () => {
            self._command.execute();
        }
    })
});

/**
 * @name Text
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('Text', {
    instance: (self) => ({
        constructor: (text) => {
            self.set(text);
        },

        set: (text) => {
            self._text = text;
        },

        get: () => self._text,

        toString: () => self._text
    })
});

/**
 * @name ToUpperCase
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('ToUpperCase', {
    extends: XES.Command,

    instance: (self, base) => ({
        constructor: (text) => {
            self._text = text;
        },

        execute: (...args) => {
            base.execute(...args);

            self._prev = self._text.get();

            const next = self._prev.toUpperCase();
            self._text.set(next);
        },

        undo: () => {
            self._text.set(self._prev);
        }
    })
});

/**
 * @name RemoveSpaces
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('RemoveSpaces', {
    extends: XES.Command,

    instance: (self, base) => ({
        constructor: (text) => {
            self._text = text;
        },

        execute: (...args) => {
            base.execute(...args);

            self._prev = self._text.get();

            const next = self._prev.replace(/\s+/g, '');
            self._text.set(next);
        },

        undo: () => {
            self._text.set(self._prev);
        }
    })
});

/**
 * @name MacroCommand
 * @type {XES.Class}
 * @memberOf XES
 */
XES.decl('MacroCommand', {
    extends: XES.Command,

    instance: (self, base) => ({
        constructor: () => {
            self._commands = [];
        },

        add: (command) => {
            self._commands.push(command);
        },

        execute: () => {
            self._commands.forEach((command) => {
                command.execute();
            });
        },

        undo: () => {}
    })
});


/* ------------------------------- Using ----------------------------------- */

const text = new XES.Text('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');

const toUpperCaseCommand = new XES.ToUpperCase(text);
const removeSpacesCommand = new XES.RemoveSpaces(text);
const macroCommand = new XES.MacroCommand();

macroCommand.add(toUpperCaseCommand);
macroCommand.add(removeSpacesCommand);

const toUpperCaseMenu = new XES.Menu(toUpperCaseCommand);
const macroMenu = new XES.Menu(macroCommand);

console.log(text.toString());
console.log();

macroMenu.click();

console.log(text.toString());
console.log();

XES.Command.undo();
XES.Command.undo();

console.log(text.toString());


/* ------------------------------ Testing ---------------------------------- */

const beforeText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
const afterText = 'LOREMIPSUMDOLORSITAMET,CONSECTETURADIPISCINGELIT.';

text.set(beforeText);

macroMenu.click();

console.assert(text.toString() === afterText, 'Incorrect result execute command');

XES.Command.undo();
XES.Command.undo();

console.assert(text.toString() === beforeText, 'Incorrect result undo command');

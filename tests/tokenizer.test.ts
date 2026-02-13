import { describe, it, expect } from 'vitest';
import { tokenize } from './helpers';

describe('GDScript Tokenizer', () => {

    // -----------------------------------------------------------------------
    // 1. Keywords in context
    // -----------------------------------------------------------------------
    describe('keywords in context', () => {
        it('func _ready():', () => {
            const result = tokenize(['func _ready():']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },               // func
                { startIndex: 4, type: '' },                                // space
                { startIndex: 5, type: 'identifier.gdscript' },            // _ready
                { startIndex: 11, type: 'delimiter.parenthesis.gdscript' }, // ()
                { startIndex: 13, type: 'delimiter.gdscript' },            // :
            ]);
        });

        it('var speed: float = 5.0', () => {
            const result = tokenize(['var speed: float = 5.0']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },      // var
                { startIndex: 3, type: '' },                        // space
                { startIndex: 4, type: 'identifier.gdscript' },   // speed
                { startIndex: 9, type: 'delimiter.gdscript' },    // :
                { startIndex: 10, type: '' },                       // space
                { startIndex: 11, type: 'type.gdscript' },        // float
                { startIndex: 16, type: '' },                       // space
                { startIndex: 17, type: 'operator.gdscript' },    // =
                { startIndex: 18, type: '' },                       // space
                { startIndex: 19, type: 'number.float.gdscript' }, // 5.0
            ]);
        });

        it('if health <= 0:', () => {
            const result = tokenize(['if health <= 0:']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // if
                { startIndex: 2, type: '' },                      // space
                { startIndex: 3, type: 'identifier.gdscript' }, // health
                { startIndex: 9, type: '' },                      // space
                { startIndex: 10, type: 'operator.gdscript' },  // <=
                { startIndex: 12, type: '' },                     // space
                { startIndex: 13, type: 'number.gdscript' },    // 0
                { startIndex: 14, type: 'delimiter.gdscript' }, // :
            ]);
        });

        it('elif health < 50:', () => {
            const result = tokenize(['elif health < 50:']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // elif
                { startIndex: 4, type: '' },                      // space
                { startIndex: 5, type: 'identifier.gdscript' }, // health
                { startIndex: 11, type: '' },                     // space
                { startIndex: 12, type: 'operator.gdscript' },  // <
                { startIndex: 13, type: '' },                     // space
                { startIndex: 14, type: 'number.gdscript' },    // 50
                { startIndex: 16, type: 'delimiter.gdscript' }, // :
            ]);
        });

        it('else:', () => {
            const result = tokenize(['else:']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // else
                { startIndex: 4, type: 'delimiter.gdscript' },  // :
            ]);
        });

        it('for item in inventory:', () => {
            const result = tokenize(['for item in inventory:']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },     // for
                { startIndex: 3, type: '' },                       // space
                { startIndex: 4, type: 'identifier.gdscript' },  // item
                { startIndex: 8, type: '' },                       // space
                { startIndex: 9, type: 'keyword.gdscript' },     // in
                { startIndex: 11, type: '' },                      // space
                { startIndex: 12, type: 'identifier.gdscript' }, // inventory
                { startIndex: 21, type: 'delimiter.gdscript' },  // :
            ]);
        });

        it('while running:', () => {
            const result = tokenize(['while running:']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // while
                { startIndex: 5, type: '' },                      // space
                { startIndex: 6, type: 'identifier.gdscript' }, // running
                { startIndex: 13, type: 'delimiter.gdscript' }, // :
            ]);
        });

        it('match state:', () => {
            const result = tokenize(['match state:']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // match
                { startIndex: 5, type: '' },                      // space
                { startIndex: 6, type: 'identifier.gdscript' }, // state
                { startIndex: 11, type: 'delimiter.gdscript' }, // :
            ]);
        });

        it('return null', () => {
            const result = tokenize(['return null']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },          // return
                { startIndex: 6, type: '' },                            // space
                { startIndex: 7, type: 'constant.language.gdscript' }, // null
            ]);
        });

        // Word-boundary tests
        it('var format = 1 — "format" must be identifier, not match "for"', () => {
            const result = tokenize(['var format = 1']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // var
                { startIndex: 3, type: '' },                      // space
                { startIndex: 4, type: 'identifier.gdscript' }, // format (not "for")
                { startIndex: 10, type: '' },                     // space
                { startIndex: 11, type: 'operator.gdscript' },  // =
                { startIndex: 12, type: '' },                     // space
                { startIndex: 13, type: 'number.gdscript' },    // 1
            ]);
        });

        it('var notify = true — "notify" must be identifier, not match "not"', () => {
            const result = tokenize(['var notify = true']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },          // var
                { startIndex: 3, type: '' },                            // space
                { startIndex: 4, type: 'identifier.gdscript' },       // notify (not "not")
                { startIndex: 10, type: '' },                           // space
                { startIndex: 11, type: 'operator.gdscript' },        // =
                { startIndex: 12, type: '' },                           // space
                { startIndex: 13, type: 'constant.language.gdscript' }, // true
            ]);
        });

        it('var class_name_ext = 1 — must be identifier, not match "class_name"', () => {
            const result = tokenize(['var class_name_ext = 1']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // var
                { startIndex: 3, type: '' },                      // space
                { startIndex: 4, type: 'identifier.gdscript' }, // class_name_ext (not "class_name")
                { startIndex: 18, type: '' },                     // space
                { startIndex: 19, type: 'operator.gdscript' },  // =
                { startIndex: 20, type: '' },                     // space
                { startIndex: 21, type: 'number.gdscript' },    // 1
            ]);
        });
    });

    // -----------------------------------------------------------------------
    // 2. Annotations
    // -----------------------------------------------------------------------
    describe('annotations', () => {
        it('@export var speed: float = 5.0', () => {
            const result = tokenize(['@export var speed: float = 5.0']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'annotation.gdscript' },    // @export
                { startIndex: 7, type: '' },                         // space
                { startIndex: 8, type: 'keyword.gdscript' },       // var
                { startIndex: 11, type: '' },                        // space
                { startIndex: 12, type: 'identifier.gdscript' },   // speed
                { startIndex: 17, type: 'delimiter.gdscript' },    // :
                { startIndex: 18, type: '' },                        // space
                { startIndex: 19, type: 'type.gdscript' },         // float
                { startIndex: 24, type: '' },                        // space
                { startIndex: 25, type: 'operator.gdscript' },     // =
                { startIndex: 26, type: '' },                        // space
                { startIndex: 27, type: 'number.float.gdscript' }, // 5.0
            ]);
        });

        it('@onready var sprite := $Sprite2D', () => {
            const result = tokenize(['@onready var sprite := $Sprite2D']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'annotation.gdscript' },        // @onready
                { startIndex: 8, type: '' },                             // space
                { startIndex: 9, type: 'keyword.gdscript' },           // var
                { startIndex: 12, type: '' },                            // space
                { startIndex: 13, type: 'identifier.gdscript' },       // sprite
                { startIndex: 19, type: '' },                            // space
                { startIndex: 20, type: 'keyword.operator.gdscript' }, // :=
                { startIndex: 22, type: '' },                            // space
                { startIndex: 23, type: 'variable.other.gdscript' },   // $Sprite2D
            ]);
        });

        it('@export_range(0.0, 1.0) var friction: float', () => {
            const result = tokenize(['@export_range(0.0, 1.0) var friction: float']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'annotation.gdscript' },            // @export_range
                { startIndex: 13, type: 'delimiter.parenthesis.gdscript' }, // (
                { startIndex: 14, type: 'number.float.gdscript' },         // 0.0
                { startIndex: 17, type: 'delimiter.gdscript' },            // ,
                { startIndex: 18, type: '' },                                // space
                { startIndex: 19, type: 'number.float.gdscript' },         // 1.0
                { startIndex: 22, type: 'delimiter.parenthesis.gdscript' }, // )
                { startIndex: 23, type: '' },                                // space
                { startIndex: 24, type: 'keyword.gdscript' },              // var
                { startIndex: 27, type: '' },                                // space
                { startIndex: 28, type: 'identifier.gdscript' },           // friction
                { startIndex: 36, type: 'delimiter.gdscript' },            // :
                { startIndex: 37, type: '' },                                // space
                { startIndex: 38, type: 'type.gdscript' },                 // float
            ]);
        });
    });

    // -----------------------------------------------------------------------
    // 3. Strings
    // -----------------------------------------------------------------------
    describe('strings', () => {
        it('var s = "hello"', () => {
            const result = tokenize(['var s = "hello"']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // var
                { startIndex: 3, type: '' },                      // space
                { startIndex: 4, type: 'identifier.gdscript' }, // s
                { startIndex: 5, type: '' },                      // space
                { startIndex: 6, type: 'operator.gdscript' },   // =
                { startIndex: 7, type: '' },                      // space
                { startIndex: 8, type: 'string.gdscript' },     // "hello"
            ]);
        });

        it("var s = 'hello'", () => {
            const result = tokenize(["var s = 'hello'"]);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // var
                { startIndex: 3, type: '' },                      // space
                { startIndex: 4, type: 'identifier.gdscript' }, // s
                { startIndex: 5, type: '' },                      // space
                { startIndex: 6, type: 'operator.gdscript' },   // =
                { startIndex: 7, type: '' },                      // space
                { startIndex: 8, type: 'string.gdscript' },     // 'hello'
            ]);
        });

        it('var s = "" (empty double-quoted)', () => {
            const result = tokenize(['var s = ""']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // var
                { startIndex: 3, type: '' },                      // space
                { startIndex: 4, type: 'identifier.gdscript' }, // s
                { startIndex: 5, type: '' },                      // space
                { startIndex: 6, type: 'operator.gdscript' },   // =
                { startIndex: 7, type: '' },                      // space
                { startIndex: 8, type: 'string.gdscript' },     // ""
            ]);
        });

        it("var s = '' (empty single-quoted)", () => {
            const result = tokenize(["var s = ''"]);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // var
                { startIndex: 3, type: '' },                      // space
                { startIndex: 4, type: 'identifier.gdscript' }, // s
                { startIndex: 5, type: '' },                      // space
                { startIndex: 6, type: 'operator.gdscript' },   // =
                { startIndex: 7, type: '' },                      // space
                { startIndex: 8, type: 'string.gdscript' },     // ''
            ]);
        });

        it('var n = &"MySignal" (StringName literal)', () => {
            const result = tokenize(['var n = &"MySignal"']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },         // var
                { startIndex: 3, type: '' },                           // space
                { startIndex: 4, type: 'identifier.gdscript' },      // n
                { startIndex: 5, type: '' },                           // space
                { startIndex: 6, type: 'operator.gdscript' },        // =
                { startIndex: 7, type: '' },                           // space
                { startIndex: 8, type: 'string.special.gdscript' },  // &"MySignal"
            ]);
        });

        it('var s = "hello\\nworld" (escape sequence)', () => {
            const result = tokenize(['var s = "hello\\nworld"']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // var
                { startIndex: 3, type: '' },                      // space
                { startIndex: 4, type: 'identifier.gdscript' }, // s
                { startIndex: 5, type: '' },                      // space
                { startIndex: 6, type: 'operator.gdscript' },   // =
                { startIndex: 7, type: '' },                      // space
                { startIndex: 8, type: 'string.gdscript' },     // "hello\nworld"
            ]);
        });
    });

    // -----------------------------------------------------------------------
    // 4. Triple-quoted strings (multiline state transitions)
    // -----------------------------------------------------------------------
    describe('triple-quoted strings', () => {
        it('triple double-quote multiline string', () => {
            const result = tokenize(['var s = """', '    content inside', '"""']);
            // Line 1: var s = """
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // var
                { startIndex: 3, type: '' },                      // space
                { startIndex: 4, type: 'identifier.gdscript' }, // s
                { startIndex: 5, type: '' },                      // space
                { startIndex: 6, type: 'operator.gdscript' },   // =
                { startIndex: 7, type: '' },                      // space
                { startIndex: 8, type: 'string.gdscript' },     // """
            ]);
            // Line 2: entirely string
            expect(result[1].tokens).toEqual([
                { startIndex: 0, type: 'string.gdscript' },
            ]);
            // Line 3: closing """
            expect(result[2].tokens).toEqual([
                { startIndex: 0, type: 'string.gdscript' },
            ]);
        });

        it('triple single-quote multiline string', () => {
            const result = tokenize(["var s = '''", "    content inside", "'''"]);
            // Line 1: var s = '''
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // var
                { startIndex: 3, type: '' },                      // space
                { startIndex: 4, type: 'identifier.gdscript' }, // s
                { startIndex: 5, type: '' },                      // space
                { startIndex: 6, type: 'operator.gdscript' },   // =
                { startIndex: 7, type: '' },                      // space
                { startIndex: 8, type: 'string.gdscript' },     // '''
            ]);
            // Line 2: entirely string
            expect(result[1].tokens).toEqual([
                { startIndex: 0, type: 'string.gdscript' },
            ]);
            // Line 3: closing '''
            expect(result[2].tokens).toEqual([
                { startIndex: 0, type: 'string.gdscript' },
            ]);
        });

        it('single " inside triple-quoted string does not close it', () => {
            const result = tokenize(['var s = """', 'She said "hi"', '"""']);
            // Line 1: var s = """
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // var
                { startIndex: 3, type: '' },                      // space
                { startIndex: 4, type: 'identifier.gdscript' }, // s
                { startIndex: 5, type: '' },                      // space
                { startIndex: 6, type: 'operator.gdscript' },   // =
                { startIndex: 7, type: '' },                      // space
                { startIndex: 8, type: 'string.gdscript' },     // """
            ]);
            // Line 2: entirely string (embedded quotes do not close)
            expect(result[1].tokens).toEqual([
                { startIndex: 0, type: 'string.gdscript' },
            ]);
            // Line 3: closing """
            expect(result[2].tokens).toEqual([
                { startIndex: 0, type: 'string.gdscript' },
            ]);
        });
    });

    // -----------------------------------------------------------------------
    // 5. Comments
    // -----------------------------------------------------------------------
    describe('comments', () => {
        it('# This is a comment', () => {
            const result = tokenize(['# This is a comment']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'comment.gdscript' },
            ]);
        });

        it('## This is a doc comment', () => {
            const result = tokenize(['## This is a doc comment']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'comment.doc.gdscript' },
            ]);
        });

        it('var x = 5 # inline comment', () => {
            const result = tokenize(['var x = 5 # inline comment']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // var
                { startIndex: 3, type: '' },                      // space
                { startIndex: 4, type: 'identifier.gdscript' }, // x
                { startIndex: 5, type: '' },                      // space
                { startIndex: 6, type: 'operator.gdscript' },   // =
                { startIndex: 7, type: '' },                      // space
                { startIndex: 8, type: 'number.gdscript' },     // 5
                { startIndex: 9, type: '' },                      // space
                { startIndex: 10, type: 'comment.gdscript' },   // # inline comment
            ]);
        });
    });

    // -----------------------------------------------------------------------
    // 6. Numbers
    // -----------------------------------------------------------------------
    describe('numbers', () => {
        it('var x = 42 (integer)', () => {
            const result = tokenize(['var x = 42']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // var
                { startIndex: 3, type: '' },                      // space
                { startIndex: 4, type: 'identifier.gdscript' }, // x
                { startIndex: 5, type: '' },                      // space
                { startIndex: 6, type: 'operator.gdscript' },   // =
                { startIndex: 7, type: '' },                      // space
                { startIndex: 8, type: 'number.gdscript' },     // 42
            ]);
        });

        it('var x = 3.14 (float)', () => {
            const result = tokenize(['var x = 3.14']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },      // var
                { startIndex: 3, type: '' },                        // space
                { startIndex: 4, type: 'identifier.gdscript' },   // x
                { startIndex: 5, type: '' },                        // space
                { startIndex: 6, type: 'operator.gdscript' },     // =
                { startIndex: 7, type: '' },                        // space
                { startIndex: 8, type: 'number.float.gdscript' }, // 3.14
            ]);
        });

        it('var x = 0xFF (hex)', () => {
            const result = tokenize(['var x = 0xFF']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },     // var
                { startIndex: 3, type: '' },                       // space
                { startIndex: 4, type: 'identifier.gdscript' },  // x
                { startIndex: 5, type: '' },                       // space
                { startIndex: 6, type: 'operator.gdscript' },    // =
                { startIndex: 7, type: '' },                       // space
                { startIndex: 8, type: 'number.hex.gdscript' },  // 0xFF
            ]);
        });

        it('var x = 0b1010 (binary)', () => {
            const result = tokenize(['var x = 0b1010']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },        // var
                { startIndex: 3, type: '' },                          // space
                { startIndex: 4, type: 'identifier.gdscript' },     // x
                { startIndex: 5, type: '' },                          // space
                { startIndex: 6, type: 'operator.gdscript' },       // =
                { startIndex: 7, type: '' },                          // space
                { startIndex: 8, type: 'number.binary.gdscript' },  // 0b1010
            ]);
        });

        it('var x = 1_000_000 (underscore-separated)', () => {
            const result = tokenize(['var x = 1_000_000']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // var
                { startIndex: 3, type: '' },                      // space
                { startIndex: 4, type: 'identifier.gdscript' }, // x
                { startIndex: 5, type: '' },                      // space
                { startIndex: 6, type: 'operator.gdscript' },   // =
                { startIndex: 7, type: '' },                      // space
                { startIndex: 8, type: 'number.gdscript' },     // 1_000_000
            ]);
        });

        it('var x = 2.5e10 (scientific notation)', () => {
            const result = tokenize(['var x = 2.5e10']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },      // var
                { startIndex: 3, type: '' },                        // space
                { startIndex: 4, type: 'identifier.gdscript' },   // x
                { startIndex: 5, type: '' },                        // space
                { startIndex: 6, type: 'operator.gdscript' },     // =
                { startIndex: 7, type: '' },                        // space
                { startIndex: 8, type: 'number.float.gdscript' }, // 2.5e10
            ]);
        });

        it('var x = 1.5e-3 (negative exponent)', () => {
            const result = tokenize(['var x = 1.5e-3']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },      // var
                { startIndex: 3, type: '' },                        // space
                { startIndex: 4, type: 'identifier.gdscript' },   // x
                { startIndex: 5, type: '' },                        // space
                { startIndex: 6, type: 'operator.gdscript' },     // =
                { startIndex: 7, type: '' },                        // space
                { startIndex: 8, type: 'number.float.gdscript' }, // 1.5e-3
            ]);
        });
    });

    // -----------------------------------------------------------------------
    // 7. Node paths and unique nodes
    // -----------------------------------------------------------------------
    describe('node paths and unique nodes', () => {
        it('var n = $Node/Child', () => {
            const result = tokenize(['var n = $Node/Child']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },       // var
                { startIndex: 3, type: '' },                         // space
                { startIndex: 4, type: 'identifier.gdscript' },    // n
                { startIndex: 5, type: '' },                         // space
                { startIndex: 6, type: 'operator.gdscript' },      // =
                { startIndex: 7, type: '' },                         // space
                { startIndex: 8, type: 'variable.other.gdscript' }, // $Node/Child
            ]);
        });

        it('var n = $"Node/With Spaces"', () => {
            const result = tokenize(['var n = $"Node/With Spaces"']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },       // var
                { startIndex: 3, type: '' },                         // space
                { startIndex: 4, type: 'identifier.gdscript' },    // n
                { startIndex: 5, type: '' },                         // space
                { startIndex: 6, type: 'operator.gdscript' },      // =
                { startIndex: 7, type: '' },                         // space
                { startIndex: 8, type: 'variable.other.gdscript' }, // $"Node/With Spaces"
            ]);
        });

        it('var n = %UniqueNode', () => {
            const result = tokenize(['var n = %UniqueNode']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },       // var
                { startIndex: 3, type: '' },                         // space
                { startIndex: 4, type: 'identifier.gdscript' },    // n
                { startIndex: 5, type: '' },                         // space
                { startIndex: 6, type: 'operator.gdscript' },      // =
                { startIndex: 7, type: '' },                         // space
                { startIndex: 8, type: 'variable.other.gdscript' }, // %UniqueNode
            ]);
        });
    });

    // -----------------------------------------------------------------------
    // 8. Self, super, and constants
    // -----------------------------------------------------------------------
    describe('self, super, and constants', () => {
        it('self.position = Vector2.ZERO', () => {
            const result = tokenize(['self.position = Vector2.ZERO']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'variable.language.gdscript' }, // self
                { startIndex: 4, type: 'delimiter.gdscript' },         // .
                { startIndex: 5, type: 'identifier.gdscript' },       // position
                { startIndex: 13, type: '' },                           // space
                { startIndex: 14, type: 'operator.gdscript' },        // =
                { startIndex: 15, type: '' },                           // space
                { startIndex: 16, type: 'type.gdscript' },            // Vector2
                { startIndex: 23, type: 'delimiter.gdscript' },       // .
                { startIndex: 24, type: 'identifier.gdscript' },      // ZERO
            ]);
        });

        it('super._ready()', () => {
            const result = tokenize(['super._ready()']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'variable.language.gdscript' },  // super
                { startIndex: 5, type: 'delimiter.gdscript' },          // .
                { startIndex: 6, type: 'identifier.gdscript' },        // _ready
                { startIndex: 12, type: 'delimiter.parenthesis.gdscript' }, // ()
            ]);
        });

        it('var alive = true', () => {
            const result = tokenize(['var alive = true']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },          // var
                { startIndex: 3, type: '' },                            // space
                { startIndex: 4, type: 'identifier.gdscript' },       // alive
                { startIndex: 9, type: '' },                            // space
                { startIndex: 10, type: 'operator.gdscript' },        // =
                { startIndex: 11, type: '' },                           // space
                { startIndex: 12, type: 'constant.language.gdscript' }, // true
            ]);
        });

        it('var x = null', () => {
            const result = tokenize(['var x = null']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },          // var
                { startIndex: 3, type: '' },                            // space
                { startIndex: 4, type: 'identifier.gdscript' },       // x
                { startIndex: 5, type: '' },                            // space
                { startIndex: 6, type: 'operator.gdscript' },         // =
                { startIndex: 7, type: '' },                            // space
                { startIndex: 8, type: 'constant.language.gdscript' }, // null
            ]);
        });

        it('var angle = PI', () => {
            const result = tokenize(['var angle = PI']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },          // var
                { startIndex: 3, type: '' },                            // space
                { startIndex: 4, type: 'identifier.gdscript' },       // angle
                { startIndex: 9, type: '' },                            // space
                { startIndex: 10, type: 'operator.gdscript' },        // =
                { startIndex: 11, type: '' },                           // space
                { startIndex: 12, type: 'constant.numeric.gdscript' }, // PI
            ]);
        });

        it('var big = INF', () => {
            const result = tokenize(['var big = INF']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },          // var
                { startIndex: 3, type: '' },                            // space
                { startIndex: 4, type: 'identifier.gdscript' },       // big
                { startIndex: 7, type: '' },                            // space
                { startIndex: 8, type: 'operator.gdscript' },         // =
                { startIndex: 9, type: '' },                            // space
                { startIndex: 10, type: 'constant.numeric.gdscript' }, // INF
            ]);
        });
    });

    // -----------------------------------------------------------------------
    // 9. Built-in functions
    // -----------------------------------------------------------------------
    describe('built-in functions', () => {
        it('print("hello")', () => {
            const result = tokenize(['print("hello")']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'support.function.gdscript' },       // print
                { startIndex: 5, type: 'delimiter.parenthesis.gdscript' },  // (
                { startIndex: 6, type: 'string.gdscript' },                 // "hello"
                { startIndex: 13, type: 'delimiter.parenthesis.gdscript' }, // )
            ]);
        });

        it('var x = clamp(y, 0, 100)', () => {
            const result = tokenize(['var x = clamp(y, 0, 100)']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },               // var
                { startIndex: 3, type: '' },                                 // space
                { startIndex: 4, type: 'identifier.gdscript' },            // x
                { startIndex: 5, type: '' },                                 // space
                { startIndex: 6, type: 'operator.gdscript' },              // =
                { startIndex: 7, type: '' },                                 // space
                { startIndex: 8, type: 'support.function.gdscript' },      // clamp
                { startIndex: 13, type: 'delimiter.parenthesis.gdscript' }, // (
                { startIndex: 14, type: 'identifier.gdscript' },           // y
                { startIndex: 15, type: 'delimiter.gdscript' },            // ,
                { startIndex: 16, type: '' },                                // space
                { startIndex: 17, type: 'number.gdscript' },               // 0
                { startIndex: 18, type: 'delimiter.gdscript' },            // ,
                { startIndex: 19, type: '' },                                // space
                { startIndex: 20, type: 'number.gdscript' },               // 100
                { startIndex: 23, type: 'delimiter.parenthesis.gdscript' }, // )
            ]);
        });

        it('var scene = preload("res://scene.tscn")', () => {
            const result = tokenize(['var scene = preload("res://scene.tscn")']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },               // var
                { startIndex: 3, type: '' },                                 // space
                { startIndex: 4, type: 'identifier.gdscript' },            // scene
                { startIndex: 9, type: '' },                                 // space
                { startIndex: 10, type: 'operator.gdscript' },             // =
                { startIndex: 11, type: '' },                                // space
                { startIndex: 12, type: 'support.function.gdscript' },     // preload
                { startIndex: 19, type: 'delimiter.parenthesis.gdscript' }, // (
                { startIndex: 20, type: 'string.gdscript' },               // "res://scene.tscn"
                { startIndex: 38, type: 'delimiter.parenthesis.gdscript' }, // )
            ]);
        });

        it('var n = len(arr)', () => {
            const result = tokenize(['var n = len(arr)']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },               // var
                { startIndex: 3, type: '' },                                 // space
                { startIndex: 4, type: 'identifier.gdscript' },            // n
                { startIndex: 5, type: '' },                                 // space
                { startIndex: 6, type: 'operator.gdscript' },              // =
                { startIndex: 7, type: '' },                                 // space
                { startIndex: 8, type: 'support.function.gdscript' },      // len
                { startIndex: 11, type: 'delimiter.parenthesis.gdscript' }, // (
                { startIndex: 12, type: 'identifier.gdscript' },           // arr
                { startIndex: 15, type: 'delimiter.parenthesis.gdscript' }, // )
            ]);
        });
    });

    // -----------------------------------------------------------------------
    // 10. Operators
    // -----------------------------------------------------------------------
    describe('operators', () => {
        it('func foo() -> void:', () => {
            const result = tokenize(['func foo() -> void:']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },               // func
                { startIndex: 4, type: '' },                                 // space
                { startIndex: 5, type: 'identifier.gdscript' },            // foo
                { startIndex: 8, type: 'delimiter.parenthesis.gdscript' }, // ()
                { startIndex: 10, type: '' },                                // space
                { startIndex: 11, type: 'keyword.operator.gdscript' },     // ->
                { startIndex: 13, type: '' },                                // space
                { startIndex: 14, type: 'keyword.gdscript' },              // void
                { startIndex: 18, type: 'delimiter.gdscript' },            // :
            ]);
        });

        it('var x := 5', () => {
            const result = tokenize(['var x := 5']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },          // var
                { startIndex: 3, type: '' },                            // space
                { startIndex: 4, type: 'identifier.gdscript' },       // x
                { startIndex: 5, type: '' },                            // space
                { startIndex: 6, type: 'keyword.operator.gdscript' }, // :=
                { startIndex: 8, type: '' },                            // space
                { startIndex: 9, type: 'number.gdscript' },           // 5
            ]);
        });

        it('var x = a + b', () => {
            const result = tokenize(['var x = a + b']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // var
                { startIndex: 3, type: '' },                      // space
                { startIndex: 4, type: 'identifier.gdscript' }, // x
                { startIndex: 5, type: '' },                      // space
                { startIndex: 6, type: 'operator.gdscript' },   // =
                { startIndex: 7, type: '' },                      // space
                { startIndex: 8, type: 'identifier.gdscript' }, // a
                { startIndex: 9, type: '' },                      // space
                { startIndex: 10, type: 'operator.gdscript' },  // +
                { startIndex: 11, type: '' },                     // space
                { startIndex: 12, type: 'identifier.gdscript' }, // b
            ]);
        });

        it('if a == b:', () => {
            const result = tokenize(['if a == b:']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // if
                { startIndex: 2, type: '' },                      // space
                { startIndex: 3, type: 'identifier.gdscript' }, // a
                { startIndex: 4, type: '' },                      // space
                { startIndex: 5, type: 'operator.gdscript' },   // ==
                { startIndex: 7, type: '' },                      // space
                { startIndex: 8, type: 'identifier.gdscript' }, // b
                { startIndex: 9, type: 'delimiter.gdscript' },  // :
            ]);
        });

        it('if a != b:', () => {
            const result = tokenize(['if a != b:']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // if
                { startIndex: 2, type: '' },                      // space
                { startIndex: 3, type: 'identifier.gdscript' }, // a
                { startIndex: 4, type: '' },                      // space
                { startIndex: 5, type: 'operator.gdscript' },   // !=
                { startIndex: 7, type: '' },                      // space
                { startIndex: 8, type: 'identifier.gdscript' }, // b
                { startIndex: 9, type: 'delimiter.gdscript' },  // :
            ]);
        });
    });

    // -----------------------------------------------------------------------
    // 11. Brackets and delimiters
    // -----------------------------------------------------------------------
    describe('brackets and delimiters', () => {
        it('var d = {"key": "val"}', () => {
            const result = tokenize(['var d = {"key": "val"}']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },           // var
                { startIndex: 3, type: '' },                             // space
                { startIndex: 4, type: 'identifier.gdscript' },        // d
                { startIndex: 5, type: '' },                             // space
                { startIndex: 6, type: 'operator.gdscript' },          // =
                { startIndex: 7, type: '' },                             // space
                { startIndex: 8, type: 'delimiter.curly.gdscript' },   // {
                { startIndex: 9, type: 'string.gdscript' },            // "key"
                { startIndex: 14, type: 'delimiter.gdscript' },        // :
                { startIndex: 15, type: '' },                            // space
                { startIndex: 16, type: 'string.gdscript' },           // "val"
                { startIndex: 21, type: 'delimiter.curly.gdscript' },  // }
            ]);
        });

        it('var a = [1, 2, 3]', () => {
            const result = tokenize(['var a = [1, 2, 3]']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },           // var
                { startIndex: 3, type: '' },                             // space
                { startIndex: 4, type: 'identifier.gdscript' },        // a
                { startIndex: 5, type: '' },                             // space
                { startIndex: 6, type: 'operator.gdscript' },          // =
                { startIndex: 7, type: '' },                             // space
                { startIndex: 8, type: 'delimiter.square.gdscript' },  // [
                { startIndex: 9, type: 'number.gdscript' },            // 1
                { startIndex: 10, type: 'delimiter.gdscript' },        // ,
                { startIndex: 11, type: '' },                            // space
                { startIndex: 12, type: 'number.gdscript' },           // 2
                { startIndex: 13, type: 'delimiter.gdscript' },        // ,
                { startIndex: 14, type: '' },                            // space
                { startIndex: 15, type: 'number.gdscript' },           // 3
                { startIndex: 16, type: 'delimiter.square.gdscript' }, // ]
            ]);
        });

        it('func(a, b)', () => {
            const result = tokenize(['func(a, b)']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },               // func
                { startIndex: 4, type: 'delimiter.parenthesis.gdscript' }, // (
                { startIndex: 5, type: 'identifier.gdscript' },            // a
                { startIndex: 6, type: 'delimiter.gdscript' },             // ,
                { startIndex: 7, type: '' },                                 // space
                { startIndex: 8, type: 'identifier.gdscript' },            // b
                { startIndex: 9, type: 'delimiter.parenthesis.gdscript' }, // )
            ]);
        });
    });

    // -----------------------------------------------------------------------
    // 12. Real-world multi-line snippets
    // -----------------------------------------------------------------------
    describe('real-world multi-line snippets', () => {
        it('class_name Player / extends CharacterBody3D', () => {
            const result = tokenize(['class_name Player', 'extends CharacterBody3D']);
            // Line 1: class_name Player
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },    // class_name
                { startIndex: 10, type: '' },                     // space
                { startIndex: 11, type: 'identifier.gdscript' }, // Player
            ]);
            // Line 2: extends CharacterBody3D
            expect(result[1].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },   // extends
                { startIndex: 7, type: '' },                     // space
                { startIndex: 8, type: 'identifier.gdscript' }, // CharacterBody3D
            ]);
        });

        it('signal health_changed(new_health: int)', () => {
            const result = tokenize(['signal health_changed(new_health: int)']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },               // signal
                { startIndex: 6, type: '' },                                 // space
                { startIndex: 7, type: 'identifier.gdscript' },            // health_changed
                { startIndex: 21, type: 'delimiter.parenthesis.gdscript' }, // (
                { startIndex: 22, type: 'identifier.gdscript' },           // new_health
                { startIndex: 32, type: 'delimiter.gdscript' },            // :
                { startIndex: 33, type: '' },                                // space
                { startIndex: 34, type: 'type.gdscript' },                 // int
                { startIndex: 37, type: 'delimiter.parenthesis.gdscript' }, // )
            ]);
        });

        it('@export var speed: float = 5.0', () => {
            const result = tokenize(['@export var speed: float = 5.0']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'annotation.gdscript' },    // @export
                { startIndex: 7, type: '' },                         // space
                { startIndex: 8, type: 'keyword.gdscript' },       // var
                { startIndex: 11, type: '' },                        // space
                { startIndex: 12, type: 'identifier.gdscript' },   // speed
                { startIndex: 17, type: 'delimiter.gdscript' },    // :
                { startIndex: 18, type: '' },                        // space
                { startIndex: 19, type: 'type.gdscript' },         // float
                { startIndex: 24, type: '' },                        // space
                { startIndex: 25, type: 'operator.gdscript' },     // =
                { startIndex: 26, type: '' },                        // space
                { startIndex: 27, type: 'number.float.gdscript' }, // 5.0
            ]);
        });

        it('enum State { IDLE, RUNNING, DEAD }', () => {
            const result = tokenize(['enum State { IDLE, RUNNING, DEAD }']);
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },          // enum
                { startIndex: 4, type: '' },                            // space
                { startIndex: 5, type: 'identifier.gdscript' },       // State
                { startIndex: 10, type: '' },                           // space
                { startIndex: 11, type: 'delimiter.curly.gdscript' }, // {
                { startIndex: 12, type: '' },                           // space
                { startIndex: 13, type: 'identifier.gdscript' },      // IDLE
                { startIndex: 17, type: 'delimiter.gdscript' },       // ,
                { startIndex: 18, type: '' },                           // space
                { startIndex: 19, type: 'identifier.gdscript' },      // RUNNING
                { startIndex: 26, type: 'delimiter.gdscript' },       // ,
                { startIndex: 27, type: '' },                           // space
                { startIndex: 28, type: 'identifier.gdscript' },      // DEAD
                { startIndex: 32, type: '' },                           // space
                { startIndex: 33, type: 'delimiter.curly.gdscript' }, // }
            ]);
        });

        it('complete function: take_damage', () => {
            const result = tokenize([
                'func take_damage(amount: int) -> void:',
                '    health = clamp(health - amount, 0, MAX_HEALTH)',
                '    if health == 0:',
                '        queue_free()',
            ]);

            // Line 1: func take_damage(amount: int) -> void:
            expect(result[0].tokens).toEqual([
                { startIndex: 0, type: 'keyword.gdscript' },               // func
                { startIndex: 4, type: '' },                                 // space
                { startIndex: 5, type: 'identifier.gdscript' },            // take_damage
                { startIndex: 16, type: 'delimiter.parenthesis.gdscript' }, // (
                { startIndex: 17, type: 'identifier.gdscript' },           // amount
                { startIndex: 23, type: 'delimiter.gdscript' },            // :
                { startIndex: 24, type: '' },                                // space
                { startIndex: 25, type: 'type.gdscript' },                 // int
                { startIndex: 28, type: 'delimiter.parenthesis.gdscript' }, // )
                { startIndex: 29, type: '' },                                // space
                { startIndex: 30, type: 'keyword.operator.gdscript' },     // ->
                { startIndex: 32, type: '' },                                // space
                { startIndex: 33, type: 'keyword.gdscript' },              // void
                { startIndex: 37, type: 'delimiter.gdscript' },            // :
            ]);

            // Line 2:     health = clamp(health - amount, 0, MAX_HEALTH)
            expect(result[1].tokens).toEqual([
                { startIndex: 0, type: '' },                                 // leading whitespace
                { startIndex: 4, type: 'identifier.gdscript' },            // health
                { startIndex: 10, type: '' },                                // space
                { startIndex: 11, type: 'operator.gdscript' },             // =
                { startIndex: 12, type: '' },                                // space
                { startIndex: 13, type: 'support.function.gdscript' },     // clamp
                { startIndex: 18, type: 'delimiter.parenthesis.gdscript' }, // (
                { startIndex: 19, type: 'identifier.gdscript' },           // health
                { startIndex: 25, type: '' },                                // space
                { startIndex: 26, type: 'operator.gdscript' },             // -
                { startIndex: 27, type: '' },                                // space
                { startIndex: 28, type: 'identifier.gdscript' },           // amount
                { startIndex: 34, type: 'delimiter.gdscript' },            // ,
                { startIndex: 35, type: '' },                                // space
                { startIndex: 36, type: 'number.gdscript' },               // 0
                { startIndex: 37, type: 'delimiter.gdscript' },            // ,
                { startIndex: 38, type: '' },                                // space
                { startIndex: 39, type: 'identifier.gdscript' },           // MAX_HEALTH
                { startIndex: 49, type: 'delimiter.parenthesis.gdscript' }, // )
            ]);

            // Line 3:     if health == 0:
            expect(result[2].tokens).toEqual([
                { startIndex: 0, type: '' },                      // leading whitespace
                { startIndex: 4, type: 'keyword.gdscript' },    // if
                { startIndex: 6, type: '' },                      // space
                { startIndex: 7, type: 'identifier.gdscript' }, // health
                { startIndex: 13, type: '' },                     // space
                { startIndex: 14, type: 'operator.gdscript' },  // ==
                { startIndex: 16, type: '' },                     // space
                { startIndex: 17, type: 'number.gdscript' },    // 0
                { startIndex: 18, type: 'delimiter.gdscript' }, // :
            ]);

            // Line 4:         queue_free()
            expect(result[3].tokens).toEqual([
                { startIndex: 0, type: '' },                                 // leading whitespace
                { startIndex: 8, type: 'identifier.gdscript' },            // queue_free
                { startIndex: 18, type: 'delimiter.parenthesis.gdscript' }, // ()
            ]);
        });
    });
});

import { describe, it, expect } from 'vitest';
import { conf } from '../src/configuration';

describe('GDScript Language Configuration', () => {

    // -----------------------------------------------------------------------
    // 1. increaseIndentPattern — positive cases
    // -----------------------------------------------------------------------
    describe('increaseIndentPattern — positive cases', () => {
        const increasePattern = conf.indentationRules!.increaseIndentPattern as RegExp;

        it('if x > 0:', () => {
            expect(increasePattern.test('if x > 0:')).toBe(true);
        });

        it('elif x < 0:', () => {
            expect(increasePattern.test('elif x < 0:')).toBe(true);
        });

        it('else:', () => {
            expect(increasePattern.test('else:')).toBe(true);
        });

        it('for i in range(10):', () => {
            expect(increasePattern.test('for i in range(10):')).toBe(true);
        });

        it('while true:', () => {
            expect(increasePattern.test('while true:')).toBe(true);
        });

        it('func _ready():', () => {
            expect(increasePattern.test('func _ready():')).toBe(true);
        });

        it('class MyClass:', () => {
            expect(increasePattern.test('class MyClass:')).toBe(true);
        });

        it('match direction:', () => {
            expect(increasePattern.test('match direction:')).toBe(true);
        });

        it('when State.IDLE:', () => {
            expect(increasePattern.test('when State.IDLE:')).toBe(true);
        });

        // With trailing comments
        it('if x > 0:  # check positive', () => {
            expect(increasePattern.test('if x > 0:  # check positive')).toBe(true);
        });

        it('func _ready():  # init', () => {
            expect(increasePattern.test('func _ready():  # init')).toBe(true);
        });

        it('else:  # fallback', () => {
            expect(increasePattern.test('else:  # fallback')).toBe(true);
        });

        // With leading whitespace
        it('    if nested:', () => {
            expect(increasePattern.test('    if nested:')).toBe(true);
        });

        it('        for item in list:', () => {
            expect(increasePattern.test('        for item in list:')).toBe(true);
        });
    });

    // -----------------------------------------------------------------------
    // 2. increaseIndentPattern — negative cases
    // -----------------------------------------------------------------------
    describe('increaseIndentPattern — negative cases', () => {
        const increasePattern = conf.indentationRules!.increaseIndentPattern as RegExp;

        it('var x = 5', () => {
            expect(increasePattern.test('var x = 5')).toBe(false);
        });

        it('print("hello")', () => {
            expect(increasePattern.test('print("hello")')).toBe(false);
        });

        it('var d = {"key": "value"}', () => {
            expect(increasePattern.test('var d = {"key": "value"}')).toBe(false);
        });

        it('x = "contains: colon"', () => {
            expect(increasePattern.test('x = "contains: colon"')).toBe(false);
        });

        it('var x = {a: 1, b: 2}', () => {
            expect(increasePattern.test('var x = {a: 1, b: 2}')).toBe(false);
        });

        it('pass', () => {
            expect(increasePattern.test('pass')).toBe(false);
        });
    });

    // -----------------------------------------------------------------------
    // 3. decreaseIndentPattern — positive cases
    // -----------------------------------------------------------------------
    describe('decreaseIndentPattern — positive cases', () => {
        const decreasePattern = conf.indentationRules!.decreaseIndentPattern as RegExp;

        it('elif condition:', () => {
            expect(decreasePattern.test('elif condition:')).toBe(true);
        });

        it('else:', () => {
            expect(decreasePattern.test('else:')).toBe(true);
        });

        it('when value:', () => {
            expect(decreasePattern.test('when value:')).toBe(true);
        });

        it('    elif nested:', () => {
            expect(decreasePattern.test('    elif nested:')).toBe(true);
        });

        it('    else:', () => {
            expect(decreasePattern.test('    else:')).toBe(true);
        });
    });

    // -----------------------------------------------------------------------
    // 4. decreaseIndentPattern — negative cases
    // -----------------------------------------------------------------------
    describe('decreaseIndentPattern — negative cases', () => {
        const decreasePattern = conf.indentationRules!.decreaseIndentPattern as RegExp;

        it('if condition:', () => {
            expect(decreasePattern.test('if condition:')).toBe(false);
        });

        it('func foo():', () => {
            expect(decreasePattern.test('func foo():')).toBe(false);
        });

        it('var elsewhere = 1', () => {
            expect(decreasePattern.test('var elsewhere = 1')).toBe(false);
        });
    });

    // -----------------------------------------------------------------------
    // 5. Static configuration values
    // -----------------------------------------------------------------------
    describe('static configuration values', () => {
        it('lineComment is #', () => {
            expect(conf.comments!.lineComment).toBe('#');
        });

        it('brackets contains all three pairs', () => {
            expect(conf.brackets).toContainEqual(['(', ')']);
            expect(conf.brackets).toContainEqual(['[', ']']);
            expect(conf.brackets).toContainEqual(['{', '}']);
        });

        it('folding offSide is true', () => {
            expect(conf.folding!.offSide).toBe(true);
        });

        it('autoClosingPairs has 5 entries', () => {
            expect(conf.autoClosingPairs).toHaveLength(5);
        });

        it('autoClosingPairs for " and \' have notIn string', () => {
            const pairs = conf.autoClosingPairs as Array<{
                open: string;
                close: string;
                notIn?: string[];
            }>;
            const doubleQuotePair = pairs.find((p) => p.open === '"');
            const singleQuotePair = pairs.find((p) => p.open === "'");
            expect(doubleQuotePair!.notIn).toEqual(['string']);
            expect(singleQuotePair!.notIn).toEqual(['string']);
        });

        it('surroundingPairs has 5 entries', () => {
            expect(conf.surroundingPairs).toHaveLength(5);
        });

        it('blockComment is not defined (GDScript has no block comments)', () => {
            expect(conf.comments!.blockComment).toBeUndefined();
        });

        it('bracket autoClosingPairs do not have notIn restrictions', () => {
            const pairs = conf.autoClosingPairs as Array<{ open: string; close: string; notIn?: string[] }>;
            const bracketPairs = pairs.filter(p => ['(', '[', '{'].includes(p.open));
            expect(bracketPairs).toHaveLength(3);
            for (const pair of bracketPairs) {
                expect(pair.notIn).toBeUndefined();
            }
        });
    });
});

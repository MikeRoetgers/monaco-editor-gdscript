import * as monaco from 'monaco-editor';
import { register } from '../src/index';

// Register GDScript with the real Monaco instance exactly once.
let registered = false;

function ensureRegistered(): void {
    if (!registered) {
        register(monaco);
        registered = true;
    }
}

export interface TokenInfo {
    startIndex: number;
    type: string;
}

export interface LineTokens {
    line: string;
    tokens: TokenInfo[];
}

/**
 * Tokenize an array of lines using Monaco's real Monarch tokenizer.
 *
 * The lines are joined with newlines and passed to `editor.tokenize()`,
 * which returns `Token[][]` — one inner array per line. Each `Token`
 * has an `offset` (character index within the line) and a `type` string.
 *
 * Requires at least one line. Returns `[]` for empty input.
 */
export function tokenize(lines: string[]): LineTokens[] {
    if (lines.length === 0) {
        return [];
    }

    ensureRegistered();

    const text = lines.join('\n');
    const rawResult = monaco.editor.tokenize(text, 'gdscript');

    return rawResult.map((lineTokens, i) => ({
        line: lines[i],
        tokens: lineTokens.map((t) => ({
            startIndex: t.offset,
            type: t.type,
        })),
    }));
}

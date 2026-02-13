import type { languages } from 'monaco-editor';

export const conf: languages.LanguageConfiguration = {
    comments: {
        lineComment: '#',
    },
    brackets: [
        ['(', ')'],
        ['[', ']'],
        ['{', '}'],
    ],
    autoClosingPairs: [
        { open: '(', close: ')' },
        { open: '[', close: ']' },
        { open: '{', close: '}' },
        { open: '"', close: '"', notIn: ['string'] },
        { open: "'", close: "'", notIn: ['string'] },
    ],
    surroundingPairs: [
        { open: '(', close: ')' },
        { open: '[', close: ']' },
        { open: '{', close: '}' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
    ],
    indentationRules: {
        increaseIndentPattern: /^\s*(func|class|if|elif|else|for|while|match|when)\b.*:\s*(#.*)?$/,
        decreaseIndentPattern: /^\s*(elif|else|when)\b/,
    },
    folding: {
        offSide: true,
    },
};

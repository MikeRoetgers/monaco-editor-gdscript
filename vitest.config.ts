import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            // Monaco Editor has no "main" or "exports" in its package.json,
            // only "module". Vite cannot resolve the package entry on its own,
            // so we point the bare specifier at the ESM entry explicitly.
            'monaco-editor': path.resolve(
                __dirname,
                'node_modules/monaco-editor/esm/vs/editor/editor.api.js',
            ),
        },
    },
    test: {
        setupFiles: ['./tests/setup.ts'],
        css: false,
    },
});

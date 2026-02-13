import { language } from './gdscript';
import { conf } from './configuration';

declare const monaco: typeof import('monaco-editor') | undefined;

export function register(monacoInstance: { languages: typeof import('monaco-editor').languages }): void {
    monacoInstance.languages.register({ id: 'gdscript', extensions: ['.gd'] });
    monacoInstance.languages.setMonarchTokensProvider('gdscript', language);
    monacoInstance.languages.setLanguageConfiguration('gdscript', conf);
}

// Side-effect: auto-register when global monaco is available
if (typeof monaco !== 'undefined' && monaco && typeof monaco.languages !== 'undefined') {
    register(monaco as { languages: typeof import('monaco-editor').languages });
}

// Re-export for advanced consumers
export { language } from './gdscript';
export { conf } from './configuration';

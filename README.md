# monaco-editor-gdscript

GDScript (Godot 4.x) syntax highlighting for the [Monaco Editor](https://microsoft.github.io/monaco-editor/).

[![CI](https://github.com/MikeRoetgers/monaco-editor-gdscript/actions/workflows/ci.yml/badge.svg)](https://github.com/MikeRoetgers/monaco-editor-gdscript/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/monaco-editor-gdscript.svg)](https://www.npmjs.com/package/monaco-editor-gdscript)
[![license](https://img.shields.io/npm/l/monaco-editor-gdscript)](https://github.com/MikeRoetgers/monaco-editor-gdscript/blob/main/LICENSE.md)

## Why? VSCode has gdscript syntax highlighting.

VScode uses the Monaco Editor internally but utilizes TextMate grammars to provide syntax highlighting whereas the standalone Monaco Editor uses the Monarch tokenizer system.

## Installation

```bash
npm install monaco-editor-gdscript
```

This package requires `monaco-editor` as a peer dependency (`>=0.30.0`). If you do not already have it installed:

```bash
npm install monaco-editor
```

## Usage

### Side-effect import

The simplest way to register GDScript is a bare import. When the module loads, it detects the global `monaco` object and registers the language automatically.

```js
import 'monaco-editor-gdscript';

const editor = monaco.editor.create(document.getElementById('container'), {
    value: 'func _ready():\n\tprint("Hello, Godot!")',
    language: 'gdscript',
});
```

> **Note:** Auto-registration relies on a global `monaco` object, which is typically only available when using Monaco's AMD loader or a CDN build. Modern bundlers (webpack, Vite, esbuild) do **not** create a global `monaco`, so the side-effect import will silently do nothing. If you use a bundler, use the explicit `register()` pattern below instead.

### Explicit registration

If you need more control over when registration happens, or if `monaco` is not available as a global, use the named `register` export and pass your Monaco instance directly.

```js
import { register } from 'monaco-editor-gdscript';
import * as monaco from 'monaco-editor';

register(monaco);

const editor = monaco.editor.create(document.getElementById('container'), {
    value: 'func _ready():\n\tprint("Hello, Godot!")',
    language: 'gdscript',
});
```

### Advanced usage

The underlying Monarch language definition and language configuration objects are also exported for consumers who want to customize or extend them. This is useful if you need to register GDScript under a different language ID, or if you want to extend the tokenizer rules before registering.

```js
import { language, conf } from 'monaco-editor-gdscript';
```

## What's included

- **Syntax highlighting** via Monaco's Monarch tokenizer covering all GDScript 4.x syntax
- **Language configuration**: bracket matching, auto-closing pairs, comment toggling (`#`), indentation rules, and folding

### Highlighted elements

- **Keywords** -- `func`, `var`, `class`, `if`, `for`, `match`, `signal`, `enum`, `await`, etc.
- **Built-in types** -- `Vector2`, `String`, `Array`, `Dictionary`, `PackedByteArray`, etc.
- **Annotations** -- `@export`, `@onready`, `@tool`, etc.
- **Built-in constants** -- `true`, `false`, `null`, `PI`, `TAU`, `INF`, `NAN`
- **Built-in functions** -- `preload`, `print`, `len`, `range`, `clamp`, `lerp`, etc.
- **Strings** -- single-quoted, double-quoted, triple-quoted multiline, and StringName literals (`&"..."`)
- **Comments** (`#`) and **doc comments** (`##`)
- **Numbers** -- integers, floats, hex (`0xFF`), binary (`0b1010`), with underscore separators
- **Node paths** (`$Node/Path`) and **unique nodes** (`%UniqueNode`)
- **`self` / `super`** -- highlighted as language variables
- **Operators** -- `->`, `:=`, and all standard operators

## What's NOT included

- Autocomplete / IntelliSense
- Go-to-definition / hover info
- Error checking / diagnostics
- GDShader support
- Godot scene file (`.tscn`) support

The scope of this package is intentionally limited to syntax highlighting and basic editor configuration. It does not provide language-server features or support for file formats other than `.gd`.

## License

[MIT](LICENSE.md)

## References

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Monaco Monarch documentation](https://microsoft.github.io/monaco-editor/monarch.html)
- [GDScript reference (Godot 4.x)](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html)
- [Godot Engine](https://godotengine.org/)

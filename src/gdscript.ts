import type { languages } from 'monaco-editor';

export const language: languages.IMonarchLanguage = {
    defaultToken: '',
    tokenPostfix: '.gdscript',

    keywords: [
        'if', 'elif', 'else', 'for', 'while', 'match', 'when',
        'break', 'continue', 'pass', 'return',
        'func', 'class', 'class_name', 'extends', 'is',
        'var', 'const', 'enum', 'signal', 'static',
        'await', 'yield',
        'and', 'or', 'not', 'in', 'as',
        'void', 'breakpoint',
    ],

    builtinTypes: [
        'bool', 'int', 'float',
        'String', 'StringName', 'NodePath',
        'Vector2', 'Vector2i', 'Vector3', 'Vector3i',
        'Vector4', 'Vector4i',
        'Color', 'Rect2', 'Rect2i',
        'Transform2D', 'Transform3D', 'Basis', 'Quaternion', 'Projection',
        'AABB', 'Plane', 'RID',
        'Array', 'Dictionary', 'Callable', 'Signal',
        'PackedByteArray', 'PackedInt32Array', 'PackedInt64Array',
        'PackedFloat32Array', 'PackedFloat64Array',
        'PackedStringArray', 'PackedVector2Array', 'PackedVector3Array',
        'PackedVector4Array', 'PackedColorArray',
    ],

    builtinConstants: [
        'true', 'false', 'null',
    ],

    numericConstants: [
        'PI', 'TAU', 'INF', 'NAN',
    ],

    builtinFunctions: [
        'preload', 'load',
        'print', 'print_rich', 'print_verbose', 'prints', 'printt', 'printerr',
        'push_error', 'push_warning',
        'str',
        'len', 'range', 'type_of', 'typeof', 'is_instance_of', 'is_instance_valid',
        'abs', 'sign', 'ceil', 'floor', 'round', 'clamp', 'lerp', 'min', 'max',
        'pow', 'sqrt', 'log', 'exp',
        'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2',
        'deg_to_rad', 'rad_to_deg',
        'randf', 'randi', 'randfn', 'randf_range', 'randi_range',
        'seed', 'randomize',
        'get_node', 'get_node_or_null', 'has_node',
        'instance_from_id', 'is_same', 'weakref',
    ],

    selfSuper: [
        'self', 'super',
    ],

    tokenizer: {
        root: [
            // 1. Doc comments (## ...) — must be before regular comments
            [/##.*$/, 'comment.doc'],

            // 2. Regular comments (# ...)
            [/#.*$/, 'comment'],

            // 3. Annotations (@export, @onready, etc.)
            [/@[a-zA-Z_]\w*/, 'annotation'],

            // 4. StringName literals (&"...") — MUST come before regular strings
            [/&"([^"\\]|\\.)*"/, 'string.special'],

            // 5. Triple-quoted strings (multiline) — must be before single-line strings
            [/"""/, 'string', '@tripleDoubleString'],
            [/'''/, 'string', '@tripleSingleString'],

            // 6. Regular strings
            [/"([^"\\]|\\.)*"/, 'string'],
            [/'([^'\\]|\\.)*'/, 'string'],

            // 7. NodePath shorthand ($"Node/Path" and $Node/Path)
            [/\$"([^"\\]|\\.)*"/, 'variable.other'],
            [/\$[\w/]+/, 'variable.other'],

            // 8. Unique node shorthand (%NodeName)
            [/%\w+/, 'variable.other'],

            // 9. Numbers (hex, binary, float, integer)
            [/0x[0-9a-fA-F_]+/, 'number.hex'],
            [/0b[01_]+/, 'number.binary'],
            [/\d[\d_]*\.[\d_]*([eE][\-+]?\d[\d_]*)?/, 'number.float'],
            [/\d[\d_]*([eE][\-+]?\d[\d_]*)?/, 'number'],

            // 10. Identifiers — case-switch against keyword lists
            [/[a-zA-Z_]\w*/, {
                cases: {
                    '@keywords': 'keyword',
                    '@builtinTypes': 'type',
                    '@builtinConstants': 'constant.language',
                    '@numericConstants': 'constant.numeric',
                    '@builtinFunctions': 'support.function',
                    '@selfSuper': 'variable.language',
                    '@default': 'identifier',
                },
            }],

            // 11. Operators
            [/->/, 'keyword.operator'],
            [/:=/, 'keyword.operator'],
            [/[=!<>]=?|[+\-*\/%&|^~]/, 'operator'],

            // 12. Brackets
            [/[{}()\[\]]/, '@brackets'],

            // 13. Delimiters
            [/[;,.:?]/, 'delimiter'],
        ],

        // States for multiline strings
        tripleDoubleString: [
            [/"""/, 'string', '@pop'],
            [/./, 'string'],
        ],
        tripleSingleString: [
            [/'''/, 'string', '@pop'],
            [/./, 'string'],
        ],
    },
};

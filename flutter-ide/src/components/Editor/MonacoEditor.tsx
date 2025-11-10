import { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: 'vs-dark' | 'light';
  readOnly?: boolean;
}

export function MonacoEditor({
  value,
  onChange,
  language = 'dart',
  theme = 'vs-dark',
  readOnly = false,
}: MonacoEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure Dart language if not already configured
    if (!monaco.languages.getLanguages().some((lang) => lang.id === 'dart')) {
      monaco.languages.register({ id: 'dart' });

      // Dart syntax highlighting
      monaco.languages.setMonarchTokensProvider('dart', {
        defaultToken: '',
        tokenPostfix: '.dart',

        keywords: [
          'abstract', 'as', 'assert', 'async', 'await', 'break', 'case', 'catch',
          'class', 'const', 'continue', 'covariant', 'default', 'deferred', 'do',
          'dynamic', 'else', 'enum', 'export', 'extends', 'extension', 'external',
          'factory', 'false', 'final', 'finally', 'for', 'Function', 'get', 'hide',
          'if', 'implements', 'import', 'in', 'interface', 'is', 'late', 'library',
          'mixin', 'new', 'null', 'on', 'operator', 'part', 'required', 'rethrow',
          'return', 'set', 'show', 'static', 'super', 'switch', 'sync', 'this',
          'throw', 'true', 'try', 'typedef', 'var', 'void', 'while', 'with', 'yield',
        ],

        typeKeywords: [
          'bool', 'double', 'int', 'num', 'String', 'List', 'Map', 'Set',
          'Iterable', 'Future', 'Stream', 'Object', 'Symbol', 'Type',
        ],

        operators: [
          '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
          '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
          '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
          '%=', '<<=', '>>=', '>>>=', '??', '??=', '..', '...', '?.', '!',
        ],

        symbols: /[=><!~?:&|+\-*\/\^%]+/,

        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

        tokenizer: {
          root: [
            // Identifiers and keywords
            [/[a-z_$][\w$]*/, {
              cases: {
                '@typeKeywords': 'type.identifier',
                '@keywords': 'keyword',
                '@default': 'identifier'
              }
            }],
            [/[A-Z][\w\$]*/, 'type.identifier'],

            // Whitespace
            { include: '@whitespace' },

            // Delimiters and operators
            [/[{}()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [/@symbols/, {
              cases: {
                '@operators': 'operator',
                '@default': ''
              }
            }],

            // Numbers
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/0[xX][0-9a-fA-F]+/, 'number.hex'],
            [/\d+/, 'number'],

            // Delimiter: after number because of .\d floats
            [/[;,.]/, 'delimiter'],

            // Strings
            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/'([^'\\]|\\.)*$/, 'string.invalid'],
            [/"/, 'string', '@string_double'],
            [/'/, 'string', '@string_single'],
            [/r"/, 'string', '@string_double_raw'],
            [/r'/, 'string', '@string_single_raw'],
          ],

          whitespace: [
            [/[ \t\r\n]+/, ''],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
          ],

          comment: [
            [/[^\/*]+/, 'comment'],
            [/\*\//, 'comment', '@pop'],
            [/[\/*]/, 'comment']
          ],

          string_double: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, 'string', '@pop']
          ],

          string_single: [
            [/[^\\']+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/'/, 'string', '@pop']
          ],

          string_double_raw: [
            [/[^\\"]+/, 'string'],
            [/"/, 'string', '@pop']
          ],

          string_single_raw: [
            [/[^\\']+/, 'string'],
            [/'/, 'string', '@pop']
          ],
        },
      });

      // Dart language configuration
      monaco.languages.setLanguageConfiguration('dart', {
        comments: {
          lineComment: '//',
          blockComment: ['/*', '*/'],
        },
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
        ],
        autoClosingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"', notIn: ['string'] },
          { open: "'", close: "'", notIn: ['string', 'comment'] },
        ],
        surroundingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
        ],
      });
    }

    // Editor configuration
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 21,
      fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', 'Monaco', monospace",
      fontLigatures: true,
      minimap: {
        enabled: true,
      },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      formatOnPaste: true,
      formatOnType: true,
      bracketPairColorization: {
        enabled: true,
      },
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      language={language}
      value={value}
      theme={theme}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      options={{
        readOnly,
      }}
    />
  );
}

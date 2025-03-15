import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginPrettier from 'eslint-plugin-prettier'; // Плагин Prettier
import prettierConfig from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import'; // Плагин для работы с импортами
import eslintImportResolverTypescript from 'eslint-import-resolver-typescript';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig, // Подключен eslint-config-prettier
  {
    plugins: {
      prettier: pluginPrettier, // Подключен плагин Prettier
      import: eslintPluginImport, // Подключен плагин для работы с импортами
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      'prettier/prettier': 'error', // Правило для Prettier
      'import/no-unresolved': 'error', // Проверка на неразрешенные импорты
      'import/extensions': ['error', 'ignorePackages'], // Игнорирование расширений файлов
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json', // Указываем путь к tsconfig.json
        },
      },
    },
  },
];
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist', 'design', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['cloudflare/supabase-proxy/src/**/*.ts'],
    languageOptions: { globals: globals.worker },
  },
  {
    files: ['cloudflare/supabase-proxy/scripts/**/*.mjs'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': hooks },
    // React Compiler is not enabled. TanStack Table v8 remains intentionally uncompiled.
    rules: {
      ...hooks.configs.recommended.rules,
      'react-hooks/incompatible-library': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  prettier,
);

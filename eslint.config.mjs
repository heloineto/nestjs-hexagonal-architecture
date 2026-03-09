// @ts-check
import eslint from '@eslint/js';
import boundaries from 'eslint-plugin-boundaries';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  {
    plugins: { boundaries },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      'boundaries/elements': [
        // Shared utilities - no feature context
        { type: 'common', pattern: 'common' },
        { type: 'core', pattern: 'core' },
        // Feature layers - capture the bounded context name
        { type: 'domain', pattern: '*/domain', capture: ['feature'] },
        { type: 'application', pattern: '*/application', capture: ['feature'] },
        {
          type: 'infrastructure',
          pattern: '*/infrastructure',
          capture: ['feature'],
        },
        {
          type: 'presentation',
          pattern: '*/presentation',
          capture: ['feature'],
        },
      ],
    },
    rules: {
      ...boundaries.configs.recommended.rules,
      'boundaries/element-types': [
        'error',
        {
          // Deny all cross-layer imports by default; each layer explicitly allows what it needs
          default: 'disallow',
          rules: [
            // common: self-contained, no outward dependencies
            {
              from: 'common',
              allow: ['common'],
            },
            // core: bootstrap only, may use shared utilities
            {
              from: 'core',
              allow: ['common'],
            },
            // domain: pure layer - no frameworks, no infrastructure, no transport details
            {
              from: 'domain',
              allow: ['common', ['domain', { feature: '${from.feature}' }]],
            },
            // application: orchestrates use cases - depends inward on domain, defines ports
            {
              from: 'application',
              allow: [
                'common',
                ['domain', { feature: '${from.feature}' }],
                ['application', { feature: '${from.feature}' }],
              ],
            },
            // infrastructure: implements ports - knows domain and application contracts, never presentation
            {
              from: 'infrastructure',
              allow: [
                'common',
                ['domain', { feature: '${from.feature}' }],
                ['application', { feature: '${from.feature}' }],
                ['infrastructure', { feature: '${from.feature}' }],
              ],
            },
            // presentation: delivery layer - converts transport input to commands, never touches infrastructure
            {
              from: 'presentation',
              allow: [
                'common',
                ['domain', { feature: '${from.feature}' }],
                ['application', { feature: '${from.feature}' }],
                ['presentation', { feature: '${from.feature}' }],
              ],
            },
          ],
        },
      ],
    },
  },
);

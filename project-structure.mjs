import { createIndependentModules } from 'eslint-plugin-project-structure';
import { createFolderStructure } from 'eslint-plugin-project-structure';

export const folderStructureConfig = createFolderStructure({
  structure: [
    { name: '*' }, // any root files (package.json, tsconfig.json, etc.)
    { name: '*', children: [] }, // any root folders (auto-sorted after specific ones)
    {
      name: 'src',
      children: [
        { name: 'main.ts' },
        { name: 'app.module.ts' },
        { ruleId: 'common_folder' },
        { ruleId: 'core_folder' },
        { ruleId: 'feature_folder' },
      ],
    },
  ],
  rules: {
    common_folder: {
      name: 'common',
      children: [
        {
          name: 'interfaces',
          children: [{ name: '{kebab-case}.interface.ts' }],
        },
      ],
    },

    core_folder: {
      name: 'core',
      children: [{ name: '{kebab-case}.module.ts' }],
    },

    feature_folder: {
      name: '{kebab-case}',
      children: [
        { name: '{folder-name}.module.ts' }, // e.g. alarms.module.ts
        { ruleId: 'domain_layer' },
        { ruleId: 'application_layer' },
        { ruleId: 'infrastructure_layer' },
        { ruleId: 'presentation_layer' },
      ],
    },

    domain_layer: {
      name: 'domain',
      children: [
        { name: '{kebab-case}.ts' }, // domain models (alarm.ts)
        {
          name: 'value-objects',
          children: [{ name: '{kebab-case}.ts' }],
        },
        {
          name: 'factories',
          children: [{ name: '{kebab-case}.factory.ts' }],
        },
      ],
    },

    application_layer: {
      name: 'application',
      children: [
        { name: '{kebab-case}.service.ts' },
        { name: '{kebab-case}.service.spec.ts' },
        {
          name: 'commands',
          children: [{ name: '{kebab-case}.command.ts' }],
        },
        {
          name: 'ports',
          children: [{ name: '{kebab-case}.repository.ts' }],
        },
      ],
    },

    infrastructure_layer: {
      name: 'infrastructure',
      children: [
        { name: '{kebab-case}.module.ts' }, // e.g. alarms-infrastructure.module.ts
        {
          name: 'persistence',
          children: [{ ruleId: 'persistence_driver_folder' }],
        },
      ],
    },

    persistence_driver_folder: {
      name: '{kebab-case}', // orm, in-memory, etc.
      children: [
        { name: '{folder-name}-persistence.module.ts' }, // orm-persistence.module.ts
        {
          name: 'entities',
          children: [{ name: '{kebab-case}.entity.ts' }],
        },
        {
          name: 'mappers',
          children: [{ name: '{kebab-case}.mapper.ts' }],
        },
        {
          name: 'repositories',
          children: [{ name: '{kebab-case}.repository.ts' }],
        },
      ],
    },

    presentation_layer: {
      name: 'presentation',
      children: [{ ruleId: 'transport_folder' }],
    },

    transport_folder: {
      name: '{kebab-case}', // http, cli, grpc, etc.
      children: [
        { name: '{kebab-case}.controller.ts' },
        { name: '{kebab-case}.controller.spec.ts' },
        {
          name: 'dto',
          children: [{ name: '{kebab-case}.dto.ts' }],
        },
      ],
    },
  },
});

// {family_2} = common prefix with ≥2 path parts (src + feature) — same feature, cross-layer
// {family_3} = common prefix with ≥3 path parts (src + feature + layer) — same layer

export const independentModulesConfig = createIndependentModules({
  modules: [
    // common: self-contained, no outward dependencies
    {
      name: 'common',
      pattern: 'src/common/**',
      allowImportsFrom: ['src/common/**'],
      errorMessage: 'common/ can only import from itself.',
    },

    // core: global bootstrap, may use common
    {
      name: 'core',
      pattern: 'src/core/**',
      allowImportsFrom: ['src/common/**', 'src/core/**'],
      errorMessage: 'core/ can only import from common/ and itself.',
    },

    // domain: pure layer - no frameworks, no infrastructure, no transport details
    {
      name: 'domain',
      pattern: 'src/*/domain/**',
      allowImportsFrom: [
        'src/common/**',
        '{family_3}/**', // same-feature domain only (src/<feature>/domain/**)
      ],
      errorMessage:
        'domain/ can only import from common/ and same-feature domain/.',
    },

    // application: orchestrates use cases, depends inward on domain, defines ports
    {
      name: 'application',
      pattern: 'src/*/application/**',
      allowImportsFrom: [
        'src/common/**',
        '{family_2}/domain/**', // same-feature domain (src/<feature>/domain/**)
        '{family_3}/**', // same-feature application (src/<feature>/application/**)
      ],
      errorMessage:
        'application/ can only import from common/, same-feature domain/ and application/.',
    },

    // infrastructure: implements ports - knows domain and application contracts, never presentation
    {
      name: 'infrastructure',
      pattern: 'src/*/infrastructure/**',
      allowImportsFrom: [
        'src/common/**',
        '{family_2}/domain/**', // same-feature domain
        '{family_2}/application/**', // same-feature application
        '{family_3}/**', // same-feature infrastructure (src/<feature>/infrastructure/**)
      ],
      errorMessage:
        'infrastructure/ can only import from common/, same-feature domain/, application/ and infrastructure/.',
    },

    // presentation: delivery layer - converts transport input to commands, never touches infrastructure
    {
      name: 'presentation',
      pattern: 'src/*/presentation/**',
      allowImportsFrom: [
        'src/common/**',
        '{family_2}/domain/**', // same-feature domain
        '{family_2}/application/**', // same-feature application
        '{family_3}/**', // same-feature presentation (src/<feature>/presentation/**)
      ],
      errorMessage:
        'presentation/ can only import from common/, same-feature domain/, application/ and presentation/.',
    },

    // feature root: module files that wire up layers within a single feature
    {
      name: 'feature root',
      pattern: 'src/*/*',
      allowImportsFrom: [
        'src/common/**',
        '{family_2}/**', // entire same-feature tree (src/<feature>/**)
      ],
      errorMessage:
        'Feature root modules can only import from within their own feature.',
    },

    // bootstrap: app.module.ts, main.ts - wire up the entire application
    {
      name: 'bootstrap',
      pattern: 'src/*',
      allowImportsFrom: ['src/**'],
      errorMessage: 'Bootstrap files can import from anywhere in src/.',
    },
  ],
});

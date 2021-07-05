import { Ruleset, RulesetDefinition } from '@stoplight/spectral-core';
import * as fs from 'fs';
import * as path from '@stoplight/path';
import * as process from 'process';
import { migrateRuleset } from '@stoplight/spectral-ruleset-migrator';

// eslint-disable-next-line @typescript-eslint/require-await
const AsyncFunction = (async (): Promise<void> => void 0).constructor as FunctionConstructor;

export async function loadRuleset(rulesetFile: string): Promise<Ruleset> {
  let ruleset;

  if (/^\.(json|ya?ml)$/.test(path.extname(rulesetFile))) {
    const m: { exports?: RulesetDefinition } = {};
    const paths = [path.dirname(rulesetFile)];

    await AsyncFunction(
      'module, require',
      await migrateRuleset(rulesetFile, {
        cwd: process.cwd(),
        format: 'commonjs',
        fs,
      }),
      // eslint-disable-next-line @typescript-eslint/no-var-requires
    )(m, (id: string) => require(require.resolve(id, { paths })) as unknown);

    ruleset = m.exports;
  } else {
    const imported = (await import(rulesetFile)) as { default: unknown } | unknown;
    ruleset =
      typeof imported === 'object' && imported !== null && 'default' in imported
        ? (imported as Record<'default', unknown>).default
        : imported;
  }

  return new Ruleset(ruleset, {
    severity: 'recommended',
    source: rulesetFile,
  });
}

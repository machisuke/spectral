import { Optional } from '@stoplight/types';
import { Ruleset, RulesetDefinition } from '@stoplight/spectral-core';
import * as fs from 'fs';
import * as path from '@stoplight/path';
import * as process from 'process';
import { extname, isURL } from '@stoplight/path';
import { migrateRuleset } from '@stoplight/spectral-ruleset-migrator';
import { bundleRuleset } from '@stoplight/spectral-ruleset-bundler';
import { node } from '@stoplight/spectral-ruleset-bundler/presets/node';
import { fetch } from '@stoplight/spectral-runtime';
import { stdin } from '@stoplight/spectral-ruleset-bundler/plugins/stdin';
import { createRequire } from 'module';
import * as commonjs from '@rollup/plugin-commonjs';

const DEFAULT_RULESETS = [
  'spectral.mjs',
  'spectral.js',
  'spectral.cjs',
  'spectral.json',
  'spectral.yaml',
  'spectral.yml',
].flatMap(name => [`.${name}`, name]);

async function getDefaultRulesetFile(): Promise<Optional<string>> {
  const cwd = process.cwd();
  const files = await fs.promises.readdir(cwd);
  const found = DEFAULT_RULESETS.find(ruleset => files.includes(ruleset));
  if (found === void 0) {
    return;
  }

  return path.join(process.cwd(), found);
}

function isLegacyRuleset(filepath: string): boolean {
  return /\.(json|ya?ml)$/.test(extname(filepath));
}

export async function getRuleset(rulesetFile: Optional<string>): Promise<Ruleset> {
  if (rulesetFile === void 0) {
    rulesetFile = await getDefaultRulesetFile();
  } else if (!path.isAbsolute(rulesetFile)) {
    rulesetFile = path.join(process.cwd(), rulesetFile);
  }

  if (rulesetFile === void 0) {
    throw new Error(
      'No ruleset has been found. Please provide a ruleset using the --ruleset CLI argument, or make sure your ruleset file matches .?spectral.(js|ya?ml|json)',
    );
  }

  let ruleset: string;

  if (isLegacyRuleset(rulesetFile)) {
    const migratedRuleset = await migrateRuleset(rulesetFile, {
      format: 'esm',
      fs,
    });

    rulesetFile = isURL(rulesetFile) ? '/.spectral.js' : path.join(path.dirname(rulesetFile), '.spectral.js');

    ruleset = await bundleRuleset('<stdin>', {
      target: 'node',
      format: 'commonjs',
      // @ts-ignore
      plugins: [stdin(migratedRuleset), commonjs(), ...node({ fs, fetch })],
    });
  } else {
    ruleset = await bundleRuleset(rulesetFile, {
      target: 'node',
      format: 'commonjs',
      // @ts-ignore
      plugins: [commonjs(), ...node({ fs, fetch })],
    });
  }

  return new Ruleset(evaluate(ruleset, rulesetFile), {
    severity: 'recommended',
    source: rulesetFile,
  });
}

function evaluate(source: string, uri: string): RulesetDefinition {
  const req = createRequire(uri);
  const m: { exports?: RulesetDefinition } = {};
  const paths = [path.dirname(uri), __dirname];

  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  Function('module, require', source)(m, (id: string) => req(req.resolve(id, { paths })) as unknown);

  if (typeof m.exports !== 'object' || m.exports === null) {
    throw Error('No valid export found');
  }

  return m.exports;
}

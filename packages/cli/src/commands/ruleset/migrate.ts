import * as fs from 'fs';
import type { CommandModule } from 'yargs';
import { isError } from 'lodash';
import * as path from '@stoplight/path';
import { migrateRuleset } from '@stoplight/spectral-ruleset-migrator';
import { IRulesetMigrateConfig } from './types';
import { getDefaultRulesetFile } from '../../services/utils/getDefaultRuleset';
import { isAbsolute } from '@stoplight/path';

export default <CommandModule<IRulesetMigrateConfig, IRulesetMigrateConfig>>{
  describe: 'migrate your ruleset',
  command: 'migrate [ruleset]',
  builder: yargs =>
    yargs
      .positional('ruleset', {
        description: 'path/URL to a ruleset file',
        type: 'string',
      })
      .option('output', {
        alias: 'o',
        description: 'path/URL to a ruleset file',
        type: 'string',
        default: '.spectral.cjs',
      })
      .option('module', {
        description: 'module system to use',
        choices: ['commonjs', 'esm'],
        default: 'commonjs',
      }),
  handler: async args => {
    let ruleset = args.ruleset ?? (await getDefaultRulesetFile());
    if (ruleset === void 0) {
      throw new Error('No ruleset has been provided');
    } else if (!isAbsolute(ruleset)) {
      ruleset = path.join(process.cwd(), ruleset);
    }

    const output = path.isAbsolute(args.output) ? args.output : path.join(process.cwd(), args.output);

    try {
      await fs.promises.access(output);
      console.error(`${output} already exists!`);
      process.exit(1);
    } catch {
      // carry on!
    }

    try {
      const code = await migrateRuleset(ruleset, {
        fs,
        format: args.module,
      });

      await fs.promises.writeFile(output, code);
    } catch (e) {
      if (isError(e)) {
        console.error(e.message);
      }

      process.exit(2);
    }
  },
};

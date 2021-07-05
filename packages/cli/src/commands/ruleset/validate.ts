import * as fs from 'fs';
import type { CommandModule } from 'yargs';
import { IRulesetMigrateConfig } from './types';
import { getDefaultRulesetFile } from '../../services/utils/getDefaultRuleset';
import { loadRuleset } from '../../services/utils/loadRuleset';

export default <CommandModule<IRulesetMigrateConfig, IRulesetMigrateConfig>>{
  describe: 'migrate your ruleset',
  command: 'validate [ruleset]',
  builder: yargs =>
    yargs.positional('ruleset', {
      description: 'path/URL to a ruleset file',
      type: 'string',
    }),
  handler: async args => {
    const ruleset = args.ruleset ?? (await getDefaultRulesetFile());
    if (ruleset === void 0) {
      throw new Error('No ruleset has been provided');
    }

    try {
      await fs.promises.access(ruleset);
    } catch {
      console.error(`${ruleset} does not exist!`);
      process.exit(1);
    }

    try {
      await loadRuleset(ruleset);
    } catch (e) {
      console.error(e);
    }
  },
};

import type { CommandModule } from 'yargs';
import migrateCommand from './migrate';
import validateCommand from './validate';
import { IRulesetMigrateConfig } from './types';

export default <CommandModule<IRulesetMigrateConfig, IRulesetMigrateConfig>>{
  describe: 'a set of utilities for Spectral ruleset',
  command: 'ruleset',
  builder: yargs => {
    const _yargs = yargs.strict().demandCommand();
    _yargs.command<IRulesetMigrateConfig>(migrateCommand);
    _yargs.command<IRulesetMigrateConfig>(validateCommand);
    return _yargs;
  },
  handler() {
    // no-op
  },
};

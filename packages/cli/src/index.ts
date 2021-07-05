#!/usr/bin/env node

import * as yargs from 'yargs';
import { DEFAULT_REQUEST_OPTIONS } from '@stoplight/spectral-runtime';

import lintCommand from './commands/lint';
import rulesetCommand from './commands/ruleset/index';
import type * as Agent from 'proxy-agent';
import { ILintConfig } from './commands/lint/types';
import { IRulesetMigrateConfig } from './commands/ruleset/types';

if (typeof process.env.PROXY === 'string') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ProxyAgent = require('proxy-agent') as typeof Agent;
  DEFAULT_REQUEST_OPTIONS.agent = new ProxyAgent(process.env.PROXY);
}

const _yargs = (yargs as yargs.Argv<ILintConfig & IRulesetMigrateConfig>)
  .scriptName('spectral')
  .parserConfiguration({
    'camel-case-expansion': true,
  })
  .version()
  .help(true)
  .strictCommands()
  .strictOptions()
  .showHelpOnFail(true)
  .wrap(yargs.terminalWidth())
  .demandCommand(1, '');

_yargs.command<ILintConfig>(lintCommand);
_yargs.command<IRulesetMigrateConfig>(rulesetCommand);

export default _yargs.argv;

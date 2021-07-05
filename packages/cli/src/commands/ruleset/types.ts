export interface IRulesetMigrateConfig {
  ruleset?: string;
  module: 'commonjs' | 'esm';
  output: string;
}

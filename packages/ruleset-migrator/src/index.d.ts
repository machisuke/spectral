import { Hook, MigrationOptions } from './types';
import { namedTypes } from 'ast-types';
import { Ruleset } from './validation/types';
export declare function migrateRuleset(filepath: string, opts: MigrationOptions): Promise<string>;
export declare function process(input: Ruleset, hooks: Set<Hook>): Promise<namedTypes.ObjectExpression>;

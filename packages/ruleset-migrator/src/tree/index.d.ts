import { namedTypes } from 'ast-types';
import { MigrationOptions } from '../types';
import { Scope } from './scope';
export { Scope };
export declare class Tree {
    #private;
    ruleset?: namedTypes.ObjectExpression;
    scope: Scope;
    constructor({ cwd, format, npmRegistry, scope, }: Pick<MigrationOptions, 'format' | 'npmRegistry'> & {
        cwd: string;
        scope: Scope;
    });
    addImport(specifier: string, source: string, _default?: boolean): namedTypes.Identifier;
    toString(): string;
    static identifier(name: string, scope: Scope): namedTypes.Identifier;
    resolveModule(identifier: string): string;
}

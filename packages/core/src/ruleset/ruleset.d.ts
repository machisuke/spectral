import { Rule, StringifiedRule } from './rule/rule';
import { FileRulesetSeverityDefinition, ParserOptions, RulesetAliasesDefinition, RulesetDefinition, RulesetOverridesDefinition } from './types';
import { Format } from './format';
declare const STACK_SYMBOL: unique symbol;
declare type RulesetContext = {
    readonly severity?: FileRulesetSeverityDefinition;
    readonly source?: string;
    readonly [STACK_SYMBOL]?: Map<RulesetDefinition, Ruleset>;
};
export declare type StringifiedRuleset = {
    id: number;
    extends: StringifiedRuleset[] | null;
    source: string | null;
    aliases: RulesetAliasesDefinition | null;
    formats: string[] | null;
    rules: Record<string, StringifiedRule>;
    overrides: RulesetOverridesDefinition | null;
    parserOptions: ParserOptions;
};
export declare class Ruleset {
    #private;
    readonly maybeDefinition: unknown;
    readonly id: number;
    protected readonly extends: Ruleset[] | null;
    readonly formats: Set<Format<void>>;
    readonly overrides: RulesetOverridesDefinition | null;
    readonly aliases: RulesetAliasesDefinition | null;
    readonly rules: Record<string, Rule>;
    readonly definition: RulesetDefinition;
    constructor(maybeDefinition: unknown, context?: RulesetContext);
    get source(): string | null;
    fromSource(source: string | null): Ruleset;
    get parserOptions(): ParserOptions;
    static isDefaultRulesetFile(uri: string): boolean;
    toJSON(): Omit<StringifiedRuleset, 'extends' | 'rules'> & {
        extends: Ruleset['extends'];
        rules: Ruleset['rules'];
    };
}
export {};

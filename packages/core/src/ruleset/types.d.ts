import { DiagnosticSeverity } from '@stoplight/types';
import { Format } from './format';
import { RulesetFunction, RulesetFunctionWithValidator } from '../types';
export declare type HumanReadableDiagnosticSeverity = 'error' | 'warn' | 'info' | 'hint' | 'off';
export declare type FileRuleSeverityDefinition = DiagnosticSeverity | HumanReadableDiagnosticSeverity | boolean;
export declare type FileRulesetSeverityDefinition = 'off' | 'recommended' | 'all';
export declare type FileRuleDefinition = RuleDefinition | FileRuleSeverityDefinition;
export declare type ParserOptions = {
    duplicateKeys: DiagnosticSeverity | HumanReadableDiagnosticSeverity;
    incompatibleValues: DiagnosticSeverity | HumanReadableDiagnosticSeverity;
};
export declare type RuleDefinition = {
    type?: 'validation' | 'style';
    formats?: Format[];
    documentationUrl?: string;
    message?: string;
    description?: string;
    severity?: DiagnosticSeverity | HumanReadableDiagnosticSeverity;
    recommended?: boolean;
    given: string | string[];
    resolved?: boolean;
    then: IRuleThen | IRuleThen[];
};
export interface IRuleThen {
    field?: string;
    function: RulesetFunction<any, any> | RulesetFunctionWithValidator<any, any>;
    functionOptions?: unknown;
}
export declare type RulesetExtendsDefinition = RulesetDefinition | (RulesetDefinition | [RulesetDefinition, FileRulesetSeverityDefinition])[];
export declare type RulesetOverrideDefinition = Pick<RulesetDefinition, 'formats' | 'parserOptions' | 'aliases'> & ({
    extends: RulesetExtendsDefinition;
} | {
    rules: Record<string, Readonly<FileRuleDefinition>>;
} | {
    extends: RulesetExtendsDefinition;
    rules: Record<string, Readonly<FileRuleDefinition>>;
});
export declare type RulesetOverridesDefinition = ReadonlyArray<{
    files: string[];
} & RulesetOverrideDefinition>;
export declare type RulesetAliasesDefinition = Record<string, string>;
export declare type RulesetDefinition = Readonly<{
    documentationUrl?: string;
    formats?: Format<any>[];
    parserOptions?: Partial<ParserOptions>;
    overrides?: RulesetOverridesDefinition;
    aliases?: RulesetAliasesDefinition;
} & Readonly<{
    overrides: RulesetOverridesDefinition;
} | {
    extends: RulesetExtendsDefinition;
} | {
    rules: Record<string, Readonly<RuleDefinition>>;
} | {
    extends: RulesetExtendsDefinition;
    rules: Record<string, Readonly<FileRuleDefinition>>;
}>>;

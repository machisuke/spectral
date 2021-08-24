import { JsonPath, Optional } from '@stoplight/types';
import { DiagnosticSeverity } from '@stoplight/types';
import { Ruleset } from '../ruleset';
import { Format } from '../format';
import { HumanReadableDiagnosticSeverity, IRuleThen, RuleDefinition } from '../types';
export interface IRule {
    description: string | null;
    message: string | null;
    severity: DiagnosticSeverity;
    resolved: boolean;
    formats: Set<Format> | null;
    enabled: boolean;
    recommended: boolean;
    documentationUrl: string | null;
    then: IRuleThen[];
    given: string[];
}
export declare type StringifiedRule = Omit<IRule, 'formats' | 'then'> & {
    name: string;
    formats: string[] | null;
    then: (Pick<IRuleThen, 'field'> & {
        function: string;
        functionOptions?: string;
    })[];
    owner: number;
};
export declare class Rule implements IRule {
    #private;
    readonly name: string;
    readonly definition: RuleDefinition;
    readonly owner: Ruleset;
    description: string | null;
    message: string | null;
    resolved: boolean;
    formats: Set<Format> | null;
    recommended: boolean;
    documentationUrl: string | null;
    constructor(name: string, definition: RuleDefinition, owner: Ruleset);
    overrides?: {
        rulesetSource: string;
        definition: Map<string, Map<string, DiagnosticSeverity | -1>>;
    };
    get enabled(): boolean;
    set enabled(enabled: boolean);
    getSeverityForSource(source: string, path: JsonPath): DiagnosticSeverity | -1;
    get severity(): DiagnosticSeverity;
    set severity(severity: Optional<HumanReadableDiagnosticSeverity | DiagnosticSeverity>);
    get then(): IRuleThen[];
    set then(then: RuleDefinition['then']);
    get given(): string[];
    set given(given: RuleDefinition['given']);
    matchesFormat(formats: Set<Format> | null): boolean;
    clone(): Rule;
    toJSON(): StringifiedRule;
}

import type { JsonPath } from '@stoplight/types';
import type { IDocumentInventory } from '../documentInventory';
import type { IRule } from '../ruleset/rule/rule';
import type { IDocument } from '../document';
import type { JSONSchema7 } from 'json-schema';
export declare type RulesetFunction<I extends unknown = unknown, O extends unknown = unknown> = (input: I, options: O, context: RulesetFunctionContext) => void | IFunctionResult[] | Promise<void | IFunctionResult[]>;
export declare type RulesetFunctionContext = {
    path: JsonPath;
    document: IDocument;
    documentInventory: IDocumentInventory;
    rule: IRule;
};
export declare type IFunction = RulesetFunction;
export declare type RulesetFunctionWithValidator<I extends unknown = unknown, O extends unknown = unknown> = RulesetFunction<I, O> & {
    validator<O = unknown>(options: unknown): asserts options is O;
    readonly schemas: Readonly<{
        input: Readonly<JSONSchema7> | null;
        options: Readonly<JSONSchema7> | null;
    }>;
};
export interface IFunctionResult {
    message: string;
    path?: JsonPath;
}

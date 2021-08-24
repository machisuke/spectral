import { ErrorObject } from 'ajv';
import { RulesetValidationError } from './validation';
import { JSONSchema, RulesetFunction, RulesetFunctionWithValidator } from '../types';
export declare class RulesetFunctionValidationError extends RulesetValidationError {
    constructor(fn: string, errors: ErrorObject[]);
}
declare type Schema = JSONSchema & {
    errorMessage?: string | {
        [key in keyof JSONSchema]: string;
    };
} & {
    properties?: {
        [key: string]: SchemaDefinition;
    };
    patternProperties?: {
        [key: string]: SchemaDefinition;
    };
};
declare type SchemaDefinition = Schema | boolean;
export declare function createRulesetFunction<I extends unknown, O extends unknown>({ input, errorOnInvalidInput, options, }: {
    input: Schema | null;
    errorOnInvalidInput?: boolean;
    options: Schema | null;
}, fn: RulesetFunction<I, O>): RulesetFunctionWithValidator<I, O>;
export {};

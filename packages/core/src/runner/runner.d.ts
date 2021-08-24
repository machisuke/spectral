import { IDocument } from '../document';
import { DocumentInventory } from '../documentInventory';
import { IRuleResult } from '../types';
import { ComputeFingerprintFunc } from '../utils';
import { RunnerRuntime } from './runtime';
import { Ruleset } from '../ruleset/ruleset';
export declare class Runner {
    protected readonly runtime: RunnerRuntime;
    protected readonly inventory: DocumentInventory;
    readonly results: IRuleResult[];
    constructor(runtime: RunnerRuntime, inventory: DocumentInventory);
    protected get document(): IDocument;
    addResult(result: IRuleResult): void;
    run(ruleset: Ruleset): Promise<void>;
    getResults(computeFingerprint: ComputeFingerprintFunc): IRuleResult[];
}

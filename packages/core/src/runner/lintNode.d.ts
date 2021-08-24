import { IGivenNode } from '../types';
import { IRunnerInternalContext } from './types';
import { Rule } from '../ruleset/rule/rule';
export declare const lintNode: (context: IRunnerInternalContext, node: IGivenNode, rule: Rule) => void;

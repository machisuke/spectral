import { Dictionary, Optional } from '@stoplight/types';
import * as tmp from 'tmp';
export interface IScenarioFile {
    test: string;
    assets: string[][];
    command: Optional<string>;
    status: Optional<string>;
    stdout: Optional<string>;
    stderr: Optional<string>;
    env: typeof process.env;
}
export declare function parseScenarioFile(data: string): IScenarioFile;
export declare function tmpFile(opts: tmp.TmpNameOptions & {
    tmpdir: string;
}): Promise<tmp.FileResult>;
export declare const applyReplacements: (str: string, values: Dictionary<string>) => string;
export declare const normalizeLineEndings: (str: string) => string;

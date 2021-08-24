import { Optional } from '@stoplight/types';
export declare type SpawnReturn = {
    stdout: string;
    stderr: string;
    status: number;
};
export declare type SpawnFn = (command: string, env: Optional<typeof process.env>, cwd: Optional<string>) => Promise<SpawnReturn>;
export declare const spawnNode: SpawnFn;

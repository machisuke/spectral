import { EventEmitter, IDisposable } from '@stoplight/lifecycle';
declare type Revokable = () => void;
export declare type SpectralEvents = {
    setup(): void;
    beforeTeardown(): void;
    afterTeardown(): void;
};
export declare class RunnerRuntime extends EventEmitter<SpectralEvents> {
    protected readonly revokables: Revokable[];
    constructor();
    persist<O extends Record<string, unknown>>(obj: O): O;
    revoke(): void;
    spawn(): Pick<RunnerRuntime, 'on'>;
    protected hijackDisposable<F extends (...args: any[]) => IDisposable>(fn: F): F;
}
export {};

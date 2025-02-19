import { JsonPath, Optional } from '@stoplight/types';
import { dirname, relative } from '@stoplight/path';
import { DiagnosticSeverity } from '@stoplight/types';
import { pathToPointer } from '@stoplight/json';

import { getDiagnosticSeverity, DEFAULT_SEVERITY_LEVEL } from '../utils/severity';
import { Ruleset } from '../ruleset';
import { Format } from '../format';
import { HumanReadableDiagnosticSeverity, IRuleThen, RuleDefinition } from '../types';
import { minimatch } from '../utils/minimatch';
import { printValue } from '@stoplight/spectral-runtime';

const ALIAS = /^#([A-Za-z0-9_-]+)/;

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

export type StringifiedRule = Omit<IRule, 'formats' | 'then'> & {
  name: string;
  formats: string[] | null;
  then: (Pick<IRuleThen, 'field'> & { function: string; functionOptions?: string })[];
  owner: number;
};

export class Rule implements IRule {
  public description: string | null;
  public message: string | null;
  #severity!: DiagnosticSeverity;
  public resolved: boolean;
  public formats: Set<Format> | null;
  #enabled: boolean;
  public recommended: boolean;
  public documentationUrl: string | null;
  #then!: IRuleThen[];
  #given!: string[];

  constructor(
    public readonly name: string,
    public readonly definition: RuleDefinition,
    public readonly owner: Ruleset,
  ) {
    this.recommended = definition.recommended !== false;
    this.#enabled = this.recommended;
    this.description = definition.description ?? null;
    this.message = definition.message ?? null;
    this.documentationUrl = definition.documentationUrl ?? null;
    this.severity = definition.severity;
    this.resolved = definition.resolved !== false;
    this.formats = 'formats' in definition ? new Set(definition.formats) : null;
    this.then = definition.then;
    this.given = definition.given;
  }

  public overrides?: { rulesetSource: string; definition: Map<string, Map<string, DiagnosticSeverity | -1>> };

  public get enabled(): boolean {
    return this.#enabled || this.overrides !== void 0;
  }

  public set enabled(enabled: boolean) {
    this.#enabled = enabled;
  }

  public getSeverityForSource(source: string, path: JsonPath): DiagnosticSeverity | -1 {
    if (this.overrides === void 0 || this.overrides.definition.size === 0) {
      return this.severity;
    }

    const relativeSource = relative(dirname(this.overrides.rulesetSource), source);
    const relevantOverrides: Map<string, DiagnosticSeverity | -1>[] = [];

    for (const [source, override] of this.overrides.definition.entries()) {
      if (minimatch(relativeSource, source)) {
        relevantOverrides.push(override);
      }
    }

    if (relevantOverrides.length === 0) {
      return this.severity;
    }

    let severity: DiagnosticSeverity = this.severity;
    let closestPointer = '';
    const pointer = pathToPointer(path);

    for (const relevantOverride of relevantOverrides) {
      for (const [overridePath, overrideSeverity] of relevantOverride.entries()) {
        if (overridePath.length >= closestPointer.length && pointer.startsWith(overridePath)) {
          closestPointer = overridePath;
          severity = overrideSeverity;
        }
      }
    }

    return severity;
  }

  public get severity(): DiagnosticSeverity {
    return this.#severity;
  }

  public set severity(severity: Optional<HumanReadableDiagnosticSeverity | DiagnosticSeverity>) {
    if (severity === void 0) {
      this.#severity = DEFAULT_SEVERITY_LEVEL;
    } else {
      this.#severity = getDiagnosticSeverity(severity);
    }
  }

  public get then(): IRuleThen[] {
    return this.#then;
  }

  public set then(then: RuleDefinition['then']) {
    this.#then = Array.isArray(then) ? then : [then];
  }

  public get given(): string[] {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    return this.#given.map(this.#resolveAlias, this);
  }

  public set given(given: RuleDefinition['given']) {
    this.#given = Array.isArray(given) ? given : [given];
  }

  #resolveAlias(this: Rule, expr: string): string {
    let resolvedExpr = expr;

    const stack = new Set<string>();

    while (resolvedExpr.startsWith('#')) {
      const alias = ALIAS.exec(resolvedExpr)?.[1];

      if (alias === void 0 || alias === null) {
        throw new ReferenceError(`"${this.name}" rule references an invalid alias`);
      }

      if (stack.has(alias)) {
        const _stack = [...stack, alias];
        throw new ReferenceError(`Alias "${_stack[0]}" is circular. Resolution stack: ${_stack.join(' -> ')}`);
      }

      stack.add(alias);

      if (this.owner.aliases === null || !(alias in this.owner.aliases)) {
        throw new ReferenceError(`Alias "${alias}" does not exist`);
      }

      if (alias.length + 1 === expr.length) {
        resolvedExpr = this.owner.aliases[alias];
      } else {
        resolvedExpr = this.owner.aliases[alias] + resolvedExpr.slice(alias.length + 1);
      }
    }

    return resolvedExpr;
  }

  public matchesFormat(formats: Set<Format> | null): boolean {
    if (this.formats === null) {
      return true;
    }

    if (formats === null) {
      return false;
    }

    for (const format of formats) {
      if (this.formats.has(format)) {
        return true;
      }
    }

    return false;
  }

  public clone(): Rule {
    return new Rule(this.name, this.definition, this.owner);
  }

  public toJSON(): StringifiedRule {
    return {
      name: this.name,
      recommended: this.recommended,
      enabled: this.enabled,
      description: this.description,
      message: this.message,
      documentationUrl: this.documentationUrl,
      severity: this.severity,
      resolved: this.resolved,
      formats: this.formats === null ? null : Array.from(this.formats).map(fn => fn.displayName ?? fn.name),
      then: this.then.map(then => ({
        ...then.function,
        function: then.function.name,
        ...('functionOptions' in then ? { functionOptions: printValue(then.functionOptions) } : null),
      })),
      given: this.#given,
      owner: this.owner.id,
    };
  }
}

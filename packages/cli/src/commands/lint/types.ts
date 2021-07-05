import type { HumanReadableDiagnosticSeverity } from '@stoplight/spectral-core';

export enum OutputFormat {
  JSON = 'json',
  STYLISH = 'stylish',
  JUNIT = 'junit',
  HTML = 'html',
  TEXT = 'text',
  TEAMCITY = 'teamcity',
  PRETTY = 'pretty',
}

export interface ILintConfig {
  documents: (string | number)[];
  encoding: 'utf8' | 'ascii' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'latin1' | 'binary' | 'hex';
  format: OutputFormat;
  output?: string;
  resolver?: string;
  ruleset?: string;
  stdinFilepath?: string;
  failSeverity: HumanReadableDiagnosticSeverity;
  displayOnlyFailures: boolean;
  ignoreUnknownFormat: boolean;
  failOnUnmatchedGlobs: boolean;
  verbose: boolean;
  quiet: boolean;
}

import { default as AjvBase } from 'ajv';
import type AjvCore from 'ajv/dist/core';
import Ajv2019 from 'ajv/dist/2019';
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';

import * as draft4 from './draft4.json';

const logger = {
  warn(...args: unknown[]): void {
    const firstArg = args[0];
    if (typeof firstArg === 'string') {
      if (firstArg.startsWith('unknown format')) return;
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },
  // eslint-disable-next-line no-console
  log: console.log,
  // eslint-disable-next-line no-console
  error: console.error,
};

function createAjvInstance(Ajv: typeof AjvCore, allErrors: boolean): AjvCore {
  const ajv = new Ajv({
    allErrors,
    meta: true,
    messages: true,
    strict: false,
    allowUnionTypes: true,
    logger,
    unicodeRegExp: false,
  });
  addFormats(ajv);
  if (allErrors) {
    ajvErrors(ajv);
  }

  if (Ajv === AjvBase) {
    ajv.addSchema(draft4);
  }

  return ajv;
}

function createAjvInstances(Ajv: typeof AjvCore): { default: AjvCore; allErrors: AjvCore } {
  let _default: AjvCore;
  let _allErrors: AjvCore;

  return {
    get default(): AjvCore {
      _default ??= createAjvInstance(Ajv, false);
      return _default;
    },
    get allErrors(): AjvCore {
      _allErrors ??= createAjvInstance(Ajv, true);
      return _allErrors;
    },
  };
}

const ajvInstances = {
  default: createAjvInstances(AjvBase),
  draft2019_09: createAjvInstances(Ajv2019),
  draft2020_12: createAjvInstances(Ajv2020),
};

export function assignAjvInstance(dialect: string, allErrors: boolean): AjvCore {
  const draft: keyof typeof ajvInstances =
    dialect === 'draft2020-12' ? 'draft2020_12' : dialect === 'draft2019-10' ? 'draft2019_09' : 'default';

  return ajvInstances[draft][allErrors ? 'allErrors' : 'default'];
}

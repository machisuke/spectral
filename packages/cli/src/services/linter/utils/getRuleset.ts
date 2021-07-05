import { Optional } from '@stoplight/types';
import { Ruleset } from '@stoplight/spectral-core';
import * as path from '@stoplight/path';
import * as process from 'process';
import { getDefaultRulesetFile } from '../../utils/getDefaultRuleset';
import { loadRuleset } from '../../utils/loadRuleset';

export async function getRuleset(rulesetFile: Optional<string>): Promise<Ruleset> {
  if (rulesetFile === void 0) {
    rulesetFile = await getDefaultRulesetFile();
  } else if (!path.isAbsolute(rulesetFile)) {
    rulesetFile = path.join(process.cwd(), rulesetFile);
  }

  if (rulesetFile === void 0) {
    throw new Error(
      'No ruleset has been found. Please provide a ruleset using the --ruleset CLI argument, or make sure your ruleset file matches .?spectral.(js|ya?ml|json)',
    );
  }

  return loadRuleset(rulesetFile);
}

import { Optional } from '@stoplight/types';
import * as process from 'process';
import * as fs from 'fs';

const BASE = ['.spectral', 'spectral'];
const EXTENSIONS = ['.mjs', '.cjs', '.js', '.json', '.yaml', '.yml'];
const KNOWN_NAMES = EXTENSIONS.flatMap(ext => BASE.map(name => `${name}${ext}`));

export async function getDefaultRulesetFile(cwd = process.cwd()): Promise<Optional<string>> {
  const filenames = await fs.promises.readdir(cwd);

  return KNOWN_NAMES.find(name => filenames.includes(name));
}

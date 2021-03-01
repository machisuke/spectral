import typescript from 'rollup-plugin-typescript2';
import * as path from 'path';
import * as fs from 'fs';

const BASE_PATH = process.cwd();

const functions = [];

const builtIns = ['oas', 'asyncapi'];

for (const rulesetName of builtIns) {
  const targetDir = path.join(BASE_PATH, `dist/rulesets/${rulesetName}/functions/`);

  if (!fs.existsSync(targetDir)) {
    continue;
  }

  for (const file of fs.readdirSync(targetDir)) {
    const targetFile = path.join(targetDir, file);
    const stat = fs.statSync(targetFile);
    if (!stat.isFile()) continue;
    const ext = path.extname(targetFile);
    if (ext !== '.js') continue;

    functions.push(targetFile);
  }
}

module.exports = functions.map(fn => ({
  input: fn,
  plugins: [
    typescript({
      tsconfig: path.join(BASE_PATH, './tsconfig.rollup.json'),
      include: ['dist/**/*.{ts,tsx}'],
      check: false,
    }),
  ],
  output: {
    file: fn,
    format: 'es',
    exports: 'named',
  },
}));

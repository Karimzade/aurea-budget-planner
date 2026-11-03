import { readdir, readFile } from 'node:fs/promises';
let total = 0;
for (const name of (await readdir('src')).filter(name => name.endsWith('.jsx'))) {
  const text = await readFile(`src/${name}`, 'utf8');
  const lines = text.split('\n').length - (text.endsWith('\n') ? 1 : 0);
  total += lines;
  console.log(`${name}: ${lines}`);
}
console.log(`Total React source lines (including imports and blank lines): ${total}`);
if (total > 400) process.exitCode = 1;

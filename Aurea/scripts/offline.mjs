import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const assets = await readdir('dist/assets');
const files = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', ...assets.map(name => `./assets/${name}`)];
const hash = createHash('sha256').update(await readFile('dist/index.html')).digest('hex').slice(0, 12);
const worker = (await readFile('public/sw.js', 'utf8')).replace("'aurea-v1'", `'aurea-${hash}'`).replace(/const FILES = .*;/, `const FILES = ${JSON.stringify(files)};`);
await writeFile('dist/sw.js', worker);
console.log(`Offline cache prepared: ${files.length} files.`);

import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
    let content, target = file;
    try { content = await readFile(target); }
    catch {
      if (extname(pathname)) { response.writeHead(404); response.end('Not found'); return; }
      target = resolve(root, 'index.html'); content = await readFile(target);
    }
    response.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    response.end(content);
  } catch { response.writeHead(500); response.end('Unable to serve the application.'); }
}).listen(4181, '0.0.0.0', () => console.log('Aurea is ready: http://localhost:4181\nKeep this window open. Press Ctrl+C to stop.'));

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const routes = new Map([
  ['/', ['index.html', 'text/html']],
  ['/index.html', ['index.html', 'text/html']],
  ['/styles.css', ['styles.css', 'text/css']],
  ['/app.js', ['app.js', 'text/javascript']],
  ['/time.js', ['time.js', 'text/javascript']]
]);
const port = Number(process.env.PORT || 3000);
createServer(async (request, response) => {
  const route = routes.get(new URL(request.url, 'http://localhost').pathname);
  if (!route) { response.writeHead(404); response.end('Not found'); return; }
  try {
    const content = await readFile(new URL(route[0], import.meta.url));
    response.writeHead(200, { 'Content-Type': `${route[1]}; charset=utf-8`, 'Cache-Control': 'no-store' });
    response.end(content);
  } catch {
    response.writeHead(500); response.end('Could not load page');
  }
}).listen(port, '127.0.0.1', () => console.log(`Weekend pass demo: http://localhost:${port}`));

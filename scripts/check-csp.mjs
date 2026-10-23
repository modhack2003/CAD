// The CSP allows exactly one inline script: the import map. If the map is edited
// without regenerating the hash, the app silently fails to boot on the
// deployment while still working on the dev server. Fail the build instead.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const vercel = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));

const inline = [...html.matchAll(/<script type="importmap">([\s\S]*?)<\/script>/g)];
assert.equal(inline.length, 1, 'expected exactly one inline import map');
const expected = 'sha256-' + createHash('sha256').update(inline[0][1], 'utf8').digest('base64');

const meta = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"/);
assert.ok(meta, 'index.html must carry a Content-Security-Policy meta tag');
assert.ok(meta[1].includes(`'${expected}'`), `meta CSP hash is stale; expected '${expected}'`);

const header = vercel.headers
  .flatMap(rule => rule.headers)
  .find(h => h.key === 'Content-Security-Policy');
assert.ok(header, 'vercel.json must set a Content-Security-Policy header');
assert.ok(header.value.includes(`'${expected}'`), `vercel.json CSP hash is stale; expected '${expected}'`);
assert.ok(header.value.includes("frame-ancestors 'none'"), 'CSP must deny framing');

const vendorRule = vercel.headers.find(rule => rule.source.startsWith('/vendor'));
assert.ok(vendorRule?.headers.some(h => h.key === 'Cache-Control' && h.value.includes('immutable')),
  'vendor assets must be served immutable');

assert.ok(html.includes('./vendor/three.module.min.js'), 'ship the minified three build');
assert.ok(!/[\u25C8\u2302\u2659\u25A6\u2197\u229E\u25A5\uFF0B\u26F6\u27F3\u2301\u25A3\u25A7\u2318\u2630]/.test(html),
  'UI icons must be inline SVG, not font-dependent Unicode glyphs');

console.log('CSP, caching and icon checks passed. Import map hash:', expected);

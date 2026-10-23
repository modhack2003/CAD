// The vendored modules are copied verbatim from the published npm package, with
// no bundler in between. That is what makes them auditable: each file can be
// diffed against upstream. This check enforces the property rather than trusting
// it, so an accidental edit or a half-finished upgrade fails the build.
//
// To verify independently:
//   npm pack three@0.170.0 && tar xzf three-0.170.0.tgz
//   cmp package/build/three.module.min.js dist/vendor/three.module.min.js
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

const dir = new URL('../dist/vendor/', import.meta.url);
const manifest = await readFile(new URL('PROVENANCE.txt', dir), 'utf8');

const entries = manifest
  .split('\n')
  .filter(line => line && !line.startsWith('#'))
  .map(line => line.match(/^(\S+)\s+sha256=([0-9a-f]{64})\s+bytes=(\d+)$/))
  .filter(Boolean)
  .map(([, name, sha256, bytes]) => ({name, sha256, bytes: Number(bytes)}));

assert.ok(entries.length >= 2, 'PROVENANCE.txt must pin every vendored module');

for (const entry of entries) {
  const bytes = await readFile(new URL(entry.name, dir));
  assert.equal(bytes.length, entry.bytes, `${entry.name} size changed`);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256,
    `${entry.name} does not match its pinned hash. If this was an intentional upgrade, update PROVENANCE.txt in the same commit.`);
}

console.log('Vendor provenance verified:', entries.map(e => `${e.name} (${e.bytes} bytes)`).join(', '));

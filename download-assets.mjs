#!/usr/bin/env node
/**
 * Baixa os assets originais do CDN do Framer para public/assets/ e VERIFICA cada um:
 *   1. HTTP 200 e corpo não vazio
 *   2. formato real pelos bytes (PNG/JPEG/WebP/SVG/WOFF2…), rejeitando páginas de erro HTML
 *   3. arquivo gravado e RELIDO do disco (tamanho confere)
 *   4. dimensões reais comparadas com as da URL do site
 *
 * Uso:
 *   node download-assets.mjs                  # baixa o manifesto (asset-manifest.json)
 *   node download-assets.mjs --force          # rebaixa mesmo se o arquivo já existir
 *   node download-assets.mjs --from-capture   # também importa fontes/SVGs/imagens descobertos pelo capture.mjs
 *   node download-assets.mjs --capture ./output --concurrency 4
 *
 * Variável opcional ASSET_BASE troca o CDN (usada só nos testes locais).
 * Saída: public/assets/**  e  docs/assets-report.json / docs/assets-report.md
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sniff } from './lib/sniff.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(process.env.ASSET_ROOT || path.join(__dirname, '..', '..'));

function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const k = argv[i].slice(2);
    const n = argv[i + 1];
    if (n === undefined || n.startsWith('--')) o[k] = true; else { o[k] = n; i++; }
  }
  return o;
}
const args = parseArgs(process.argv.slice(2));
const FORCE = Boolean(args.force);
const CONCURRENCY = Number(args.concurrency || 4);
const manifest = JSON.parse(await fs.readFile(path.join(__dirname, 'asset-manifest.json'), 'utf8'));
const CDN = (process.env.ASSET_BASE || manifest.cdn).replace(/\/+$/, '');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const exists = (p) => fs.access(p).then(() => true, () => false);
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

async function fetchBuf(url, tries = 3) {
  let lastErr;
  for (let t = 1; t <= tries; t++) {
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': UA, accept: 'image/png,image/jpeg,image/*;q=0.8,*/*;q=0.5' },
        redirect: 'follow',
        signal: AbortSignal.timeout(60000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (!buf.length) throw new Error('corpo vazio');
      return { buf, status: res.status, contentType: res.headers.get('content-type') || '' };
    } catch (e) {
      lastErr = e;
      if (/HTTP 4\d\d/.test(e.message) && !/HTTP 429/.test(e.message)) break; // 4xx não adianta repetir
      await new Promise((r) => setTimeout(r, 600 * t));
    }
  }
  throw lastErr;
}

async function pool(items, worker, n) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
    }
  }));
  return results;
}

/** Grava, relê do disco e confere. Devolve null se OK, ou mensagem de erro. */
async function writeAndVerify(dest, buf) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, buf);
  const back = await fs.readFile(dest);
  if (back.length !== buf.length) return `arquivo gravado com ${back.length} bytes, esperado ${buf.length}`;
  if (!back.equals(buf)) return 'conteúdo relido difere do baixado';
  return null;
}

async function processEntry(e) {
  const url = `${CDN}/${e.id}.${e.ext}`;
  const result = { id: e.id, role: e.role, url, file: null, status: null, expected: e.width ? `${e.width}x${e.height}` : null };
  let dest = path.join(ROOT, 'public', 'assets', 'images', e.category, e.file);
  try {
    let buf;
    let existing = null;
    if (!FORCE) {
      // aceita o arquivo já salvo com outra extensão (ex.: PNG pedido, mas o CDN serviu JPEG)
      for (const ext of [path.extname(dest).slice(1), 'png', 'jpg', 'webp', 'avif', 'gif']) {
        const cand = dest.replace(/\.[^.]+$/, `.${ext}`);
        if (await exists(cand)) { existing = cand; break; }
      }
    }
    if (existing) {
      dest = existing;
      buf = await fs.readFile(dest);
      result.status = 'exists';
    } else {
      const r = await fetchBuf(url);
      buf = r.buf;
      result.httpContentType = r.contentType;
    }
    const info = sniff(buf);
    result.bytes = buf.length;
    result.detected = info.kind;
    if (info.kind === 'unknown' || info.kind === 'html') {
      result.status = 'INVALID_CONTENT';
      result.error = `conteúdo não é imagem (detectado: ${info.kind})`;
      return result;
    }
    const wantExt = path.extname(dest).slice(1).replace('jpeg', 'jpg');
    if (info.ext && info.ext !== wantExt) {
      dest = dest.replace(/\.[^.]+$/, `.${info.ext}`);
      result.warning = `formato real é ${info.kind}, diferente da extensão ${e.ext}; salvo como .${info.ext}`;
    }
    if (result.status !== 'exists') {
      const err = await writeAndVerify(dest, buf);
      if (err) { result.status = 'WRITE_FAILED'; result.error = err; return result; }
      result.status = 'downloaded';
    }
    result.file = rel(dest);
    if (info.width) {
      result.actual = `${info.width}x${info.height}`;
      if (e.width && (info.width !== e.width || info.height !== e.height)) {
        result.warning = `${result.warning ? result.warning + '; ' : ''}dimensões reais ${info.width}x${info.height} diferem das da URL (${e.width}x${e.height})`;
      }
    }
  } catch (err) {
    result.status = 'FAILED';
    result.error = err.message;
  }
  return result;
}

// ------------------------------------------------------------ --from-capture
async function importFromCapture() {
  const capDir = path.resolve(String(args.capture || path.join(__dirname, 'output')));
  const report = { dir: capDir, fonts: [], icons: [], discovered: [], errors: [] };
  if (!(await exists(capDir))) { report.errors.push(`pasta de captura não encontrada: ${capDir}`); return report; }

  for (const [sub, target, key] of [['fonts', 'fonts', 'fonts'], ['svg', 'icons', 'icons'], ['svg-inline', 'icons', 'icons']]) {
    const src = path.join(capDir, sub);
    if (!(await exists(src))) continue;
    for (const f of await fs.readdir(src)) {
      const to = path.join(ROOT, 'public', 'assets', target, sub === 'svg-inline' ? `inline-${f}` : f);
      try {
        const buf = await fs.readFile(path.join(src, f));
        const info = sniff(buf);
        if (info.kind === 'unknown' || info.kind === 'html') { report.errors.push(`${sub}/${f}: conteúdo inválido (${info.kind})`); continue; }
        const err = await writeAndVerify(to, buf);
        if (err) report.errors.push(`${sub}/${f}: ${err}`); else report[key].push({ file: rel(to), kind: info.kind, bytes: buf.length });
      } catch (e) { report.errors.push(`${sub}/${f}: ${e.message}`); }
    }
  }

  // Imagens/mídia do CDN vistas na rede e ausentes do manifesto
  const known = new Set(manifest.items.map((i) => i.id));
  const fa = JSON.parse(await fs.readFile(path.join(capDir, 'framer-assets.json'), 'utf8').catch(() => '[]'));
  const todo = fa.filter((a) => {
    const base = path.basename(new URL(a.url).pathname);
    const id = base.replace(/\.[^.]+$/, '');
    return !known.has(id) && /^(image|media)$/.test(a.type) && !/\.(woff2?|ttf|otf|js|css|json|mjs)$/i.test(base);
  });
  await pool(todo, async (a) => {
    const base = path.basename(new URL(a.url).pathname);
    try {
      const r = await fetchBuf(a.url);
      const info = sniff(r.buf);
      if (info.kind === 'unknown' || info.kind === 'html') { report.errors.push(`${a.url}: não é imagem (${info.kind})`); return; }
      const to = path.join(ROOT, 'public', 'assets', 'discovered', base.includes('.') ? base : `${base}.${info.ext || 'bin'}`);
      const err = await writeAndVerify(to, r.buf);
      if (err) report.errors.push(`${a.url}: ${err}`);
      else report.discovered.push({ url: a.url, file: rel(to), kind: info.kind, size: info.width ? `${info.width}x${info.height}` : null, bytes: r.buf.length });
    } catch (e) { report.errors.push(`${a.url}: ${e.message}`); }
  }, CONCURRENCY);
  return report;
}

// ------------------------------------------------------------ main
console.log(`CDN: ${CDN}\nDestino: ${path.join(ROOT, 'public', 'assets')}\nItens do manifesto: ${manifest.items.length}`);
const results = await pool(manifest.items, async (e) => {
  const r = await processEntry(e);
  const mark = r.status === 'downloaded' || r.status === 'exists' ? 'ok ' : 'ERR';
  console.log(`  ${mark} ${r.status.padEnd(16)} ${e.category}/${e.file}${r.warning ? `  ⚠ ${r.warning}` : ''}${r.error ? `  → ${r.error}` : ''}`);
  return r;
}, CONCURRENCY);

const fromCapture = args['from-capture'] ? await importFromCapture() : null;
const bad = results.filter((r) => !['downloaded', 'exists'].includes(r.status));
const warned = results.filter((r) => r.warning);
const summary = {
  total: results.length,
  downloaded: results.filter((r) => r.status === 'downloaded').length,
  alreadyPresent: results.filter((r) => r.status === 'exists').length,
  failed: bad.length,
  withWarnings: warned.length,
};

await fs.mkdir(path.join(ROOT, 'docs'), { recursive: true });
await fs.writeFile(path.join(ROOT, 'docs', 'assets-report.json'), JSON.stringify({ date: new Date().toISOString(), cdn: CDN, summary, results, fromCapture }, null, 1));
const md = [
  '# Relatório de assets', '',
  `Gerado em ${new Date().toISOString()}`, '',
  `- Total no manifesto: **${summary.total}**`,
  `- Baixados agora e verificados: **${summary.downloaded}**`,
  `- Já presentes (relidos e verificados): **${summary.alreadyPresent}**`,
  `- Falhas: **${summary.failed}**`,
  `- Com avisos (formato/dimensões): **${summary.withWarnings}**`, '',
  '| status | arquivo | esperado | real | bytes | aviso/erro |', '|---|---|---|---|---|---|',
  ...results.map((r) => `| ${r.status} | ${r.file || r.url} | ${r.expected || '—'} | ${r.actual || '—'} | ${r.bytes ?? '—'} | ${(r.warning || r.error || '').replace(/\|/g, '/')} |`),
];
if (fromCapture) {
  md.push('', '## Importado da captura', '',
    `- Fontes: ${fromCapture.fonts.length} · Ícones/SVG: ${fromCapture.icons.length} · Imagens descobertas fora do manifesto: ${fromCapture.discovered.length}`,
    ...fromCapture.errors.map((e) => `- ERRO: ${e}`));
}
await fs.writeFile(path.join(ROOT, 'docs', 'assets-report.md'), md.join('\n') + '\n');

console.log(`\n${summary.downloaded} baixados, ${summary.alreadyPresent} já presentes, ${summary.failed} com falha, ${summary.withWarnings} com avisos.`);
if (fromCapture) console.log(`Captura: ${fromCapture.fonts.length} fontes, ${fromCapture.icons.length} SVGs, ${fromCapture.discovered.length} imagens extras, ${fromCapture.errors.length} erros.`);
console.log('Relatório: docs/assets-report.md');
if (bad.length) { console.log('\nFalhas — copie para docs/missing-assets.md:'); for (const r of bad) console.log(`  - ${r.role}: ${r.url} (${r.error})`); process.exit(1); }

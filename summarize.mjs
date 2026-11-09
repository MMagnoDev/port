#!/usr/bin/env node
/**
 * Condensa a saída bruta do capture.mjs em:
 *   output/SUMMARY.md    (leitura humana, compacto — é o arquivo para me enviar)
 *   output/summary.json  (mesmos dados, estruturados)
 *
 * Uso: node summarize.mjs [--out caminho/da/saida]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const outIdx = argv.indexOf('--out');
const OUT = path.resolve(outIdx >= 0 ? argv[outIdx + 1] : path.join(__dirname, 'output'));

const readJson = async (p, fallback = null) => {
  try { return JSON.parse(await fs.readFile(p, 'utf8')); } catch (e) { return fallback; }
};
const exists = async (p) => fs.access(p).then(() => true, () => false);
const median = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const px = (v) => (v == null ? null : Number.parseFloat(v));

// ---------------------------------------------------------------- easing
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t;
  const Y = (t) => ((ay * t + by) * t + cy) * t;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0, hi = 1, t = x;
    for (let i = 0; i < 40; i++) { t = (lo + hi) / 2; if (X(t) < x) lo = t; else hi = t; }
    return Y(t);
  };
}
const CANDIDATES = [
  ['linear', (x) => x],
  ['ease (.25,.1,.25,1)', bezier(0.25, 0.1, 0.25, 1)],
  ['ease-in (.42,0,1,1)', bezier(0.42, 0, 1, 1)],
  ['ease-out (0,0,.58,1)', bezier(0, 0, 0.58, 1)],
  ['ease-in-out (.42,0,.58,1)', bezier(0.42, 0, 0.58, 1)],
  ['(.44,0,.56,1)', bezier(0.44, 0, 0.56, 1)],
  ['(.12,.23,.5,1)', bezier(0.12, 0.23, 0.5, 1)],
  ['(.22,1,.36,1) easeOutQuint', bezier(0.22, 1, 0.36, 1)],
  ['(.16,1,.3,1) easeOutExpo', bezier(0.16, 1, 0.3, 1)],
  ['(.65,0,.35,1) easeInOutCubic', bezier(0.65, 0, 0.35, 1)],
  ['(.76,0,.24,1) easeInOutQuart', bezier(0.76, 0, 0.24, 1)],
  ['(.33,1,.68,1) easeOutCubic', bezier(0.33, 1, 0.68, 1)],
];
function fitEasing(progress) {
  let best = null;
  progress.forEach(() => {});
  for (const [name, fn] of CANDIDATES) {
    let err = 0;
    progress.forEach((p, i) => { const d = p - fn(i / (progress.length - 1)); err += d * d; });
    if (!best || err < best.err) best = { name, err: Math.round(err * 1000) / 1000 };
  }
  return best;
}

// ---------------------------------------------------------------- animação
function parseTransform(t) {
  if (!t || t === 'none') return { tx: 0, ty: 0, s: 1 };
  let m = t.match(/matrix3d\(([^)]+)\)/);
  if (m) { const v = m[1].split(',').map(Number); return { tx: v[12], ty: v[13], s: v[0] }; }
  m = t.match(/matrix\(([^)]+)\)/);
  if (m) { const v = m[1].split(',').map(Number); return { tx: v[4], ty: v[5], s: v[0] }; }
  return { tx: 0, ty: 0, s: 1 };
}
const parseBlur = (f) => { const m = (f || '').match(/blur\(([\d.]+)px\)/); return m ? Number(m[1]) : 0; };

function analyseAnimations(anim) {
  if (!anim || !anim.events) return null;
  const marks = Object.fromEntries((anim.marks || []).map(([t, l]) => [l, t]));
  const meta = new Map((anim.describe || []).map((d) => [d.id, d]));
  const byId = new Map();
  for (const ev of anim.events) {
    const [t, id, op, tr, fl] = ev;
    if (!byId.has(id)) byId.set(id, []);
    const T = parseTransform(tr);
    byId.get(id).push({ t, opacity: Number(op), tx: T.tx, ty: T.ty, s: T.s, blur: parseBlur(fl) });
  }
  const PROPS = [['opacity', 1], ['ty', 100], ['tx', 100], ['s', 1], ['blur', 10]];
  const bursts = [];
  for (const [id, series] of byId) {
    // separa em rajadas (lacuna > 300ms = nova animação)
    let cur = [];
    const flush = () => {
      if (cur.length >= 3) {
        let best = null;
        for (const [p, norm] of PROPS) {
          const vals = cur.map((x) => x[p]);
          const range = (Math.max(...vals) - Math.min(...vals)) / norm;
          if (!best || range > best.range) best = { p, range, from: vals[0], to: vals[vals.length - 1] };
        }
        const thresholds = { opacity: 0.15, ty: 0.04, tx: 0.04, s: 0.03, blur: 0.05 };
        if (best && best.range >= thresholds[best.p] && best.from !== best.to) {
          const t0 = Math.max(0, cur[0].t - 16);
          const t1 = cur[cur.length - 1].t;
          const dur = Math.max(t1 - t0, 1);
          const span = best.to - best.from;
          const prog = [];
          for (let k = 0; k <= 10; k++) {
            const target = t0 + (dur * k) / 10;
            let v = cur[0][best.p];
            for (const x of cur) { if (x.t <= target) v = x[best.p]; else break; }
            prog.push(Math.max(0, Math.min(1, (v - best.from) / span)));
          }
          prog[0] = 0; prog[10] = 1;
          const m = meta.get(id) || {};
          let phase = 'after';
          if (t0 < (marks['entry-end'] ?? Infinity)) phase = 'entry';
          else if (t0 >= (marks['scroll-start'] ?? Infinity) && t0 <= (marks['scroll-end'] ?? Infinity)) phase = 'scroll';
          bursts.push({
            id, tag: m.tag, name: m.name, text: m.text, pageY: m.pageY, phase,
            prop: best.p, from: Math.round(best.from * 1000) / 1000, to: Math.round(best.to * 1000) / 1000,
            startMs: t0, durationMs: Math.round(dur), samples: cur.length,
            easing: dur >= 150 ? fitEasing(prog) : null,
          });
        }
      }
      cur = [];
    };
    for (const e of series) {
      if (cur.length && e.t - cur[cur.length - 1].t > 300) flush();
      cur.push(e);
    }
    flush();
  }
  bursts.sort((a, b) => a.startMs - b.startMs);
  const stat = (phase) => {
    const d = bursts.filter((b) => b.phase === phase && b.durationMs >= 100).map((b) => b.durationMs);
    return { count: bursts.filter((b) => b.phase === phase).length, medianDurationMs: median(d) };
  };
  const easingVotes = {};
  for (const b of bursts) if (b.easing && b.durationMs >= 200) easingVotes[b.easing.name] = (easingVotes[b.easing.name] || 0) + 1;
  return { marks, stats: { entry: stat('entry'), scroll: stat('scroll'), after: stat('after') }, easingVotes, bursts: bursts.slice(0, 120) };
}

// ---------------------------------------------------------------- leitura
async function listCaptures() {
  const out = [];
  const pages = (await fs.readdir(OUT, { withFileTypes: true })).filter((d) => d.isDirectory() && !d.name.startsWith('_') && d.name !== 'fonts' && d.name !== 'svg' && d.name !== 'svg-inline');
  for (const p of pages) {
    const vws = (await fs.readdir(path.join(OUT, p.name), { withFileTypes: true })).filter((d) => d.isDirectory() && /^\d+$/.test(d.name));
    for (const v of vws) {
      const dir = path.join(OUT, p.name, v.name);
      if (await exists(path.join(dir, 'extract.json'))) out.push({ page: p.name, vw: Number(v.name), dir });
    }
  }
  out.sort((a, b) => a.page.localeCompare(b.page) || b.vw - a.vw);
  return out;
}

function typography(ex, limit) {
  const sigs = new Map();
  for (const el of ex.elements) {
    if (!el.text) continue;
    const s = ex.styles[el.s];
    const key = [s.fontFamily, s.fontSize, s.fontWeight, s.lineHeight, s.letterSpacing, s.textTransform, s.color].join('|');
    if (!sigs.has(key)) sigs.set(key, { fontFamily: s.fontFamily.split(',')[0].replace(/"/g, ''), fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, textTransform: s.textTransform, color: s.color, count: 0, sample: el.text.slice(0, 40), y: el.y });
    sigs.get(key).count++;
  }
  return [...sigs.values()].sort((a, b) => px(b.fontSize) - px(a.fontSize) || b.count - a.count).slice(0, limit);
}

function sections(ex) {
  const vw = ex.doc.innerWidth;
  return ex.elements
    .filter((e) => e.name && e.w >= vw * 0.9 && e.h >= 120)
    .map((e) => {
      const s = ex.styles[e.s];
      return { name: e.name, tag: e.tag, y: e.y, h: Math.round(e.h), background: s.backgroundColor, padding: `${s.paddingTop} ${s.paddingRight} ${s.paddingBottom} ${s.paddingLeft}` };
    })
    .slice(0, 40);
}

function palette(ex) {
  const count = {};
  for (const el of ex.elements) {
    const s = ex.styles[el.s];
    if (el.text) count[`text ${s.color}`] = (count[`text ${s.color}`] || 0) + 1;
    if (s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)') count[`bg ${s.backgroundColor}`] = (count[`bg ${s.backgroundColor}`] || 0) + 1;
    if (s.borderTopWidth !== '0px' && s.borderTopStyle !== 'none') count[`border ${s.borderTopColor} ${s.borderTopWidth}`] = (count[`border ${s.borderTopColor} ${s.borderTopWidth}`] || 0) + 1;
    if (s.borderRadius && s.borderRadius !== '0px') count[`radius ${s.borderRadius}`] = (count[`radius ${s.borderRadius}`] || 0) + 1;
  }
  return Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 30);
}

// ---------------------------------------------------------------- markdown
const esc = (v) => String(v ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
function table(headers, rows) {
  if (!rows.length) return '_(sem dados)_\n';
  return `| ${headers.join(' | ')} |\n|${headers.map(() => '---').join('|')}|\n${rows.map((r) => `| ${r.map(esc).join(' | ')} |`).join('\n')}\n`;
}

async function main() {
  const meta = await readJson(path.join(OUT, 'meta.json'), {});
  const routes = await readJson(path.join(OUT, 'routes.json'), { routes: meta.routes || [], notFound: [] });
  const errors = await readJson(path.join(OUT, 'errors.json'), []);
  const caps = await listCaptures();
  if (!caps.length) { console.error(`Nenhuma captura encontrada em ${OUT}. Rode capture.mjs primeiro.`); process.exit(1); }

  const S = { meta, routes, errors, fonts: {}, breakpoints: [], pages: {}, probes: {}, network: {} };
  const md = [];
  const fontFamilies = new Map();
  const fontFaces = new Map();
  const media = new Set();
  const failed = [];
  const consoleMsgs = [];
  const icons = new Map();
  const metaTags = {};
  let rootVars = {};
  const hdr = { Desktop: [], Phone: [] };

  md.push(`# Resumo da auditoria — ${meta.base || ''}`);
  md.push(`Gerado em ${new Date().toISOString()} · navegador ${meta.browserVersion || '?'} · capturado em ${meta.date || '?'}\n`);
  md.push(`**Rotas (${(routes.routes || []).length}):** ${(routes.routes || []).join(' ')}${(routes.notFound || []).length ? `  ·  não encontradas: ${routes.notFound.join(' ')}` : ''}\n`);
  if (errors.length) md.push(`**Erros durante a captura:**\n${errors.map((e) => `- ${e.where}: ${e.message}`).join('\n')}\n`);

  // --- por captura
  const layoutRows = [];
  const variantRows = [];
  const focusPages = new Set(['home']);
  for (const c of caps) {
    const ex = await readJson(path.join(c.dir, 'extract.json'));
    const an = await readJson(path.join(c.dir, 'anim.json'));
    const nw = await readJson(path.join(c.dir, 'network.json'), {});
    if (!ex) continue;
    for (const f of ex.doc.fonts) fontFamilies.set(`${f.family}|${f.weight}|${f.style}`, f);
    for (const f of ex.doc.fontFaces) fontFaces.set(`${f.family}|${f.weight}|${f.style}|${f.src}`, f);
    for (const m of ex.doc.mediaQueries) media.add(m);
    for (const i of ex.doc.icons) icons.set(i.href, i);
    Object.assign(metaTags, ex.doc.meta);
    if (Object.keys(ex.doc.rootVars).length > Object.keys(rootVars).length) rootVars = ex.doc.rootVars;
    for (const f of nw.failed || []) failed.push({ page: c.page, vw: c.vw, ...f });
    for (const m of nw.console || []) consoleMsgs.push({ page: c.page, vw: c.vw, ...m });
    for (const m of nw.pageErrors || []) consoleMsgs.push({ page: c.page, vw: c.vw, type: 'pageerror', text: m });
    for (const n of nw.net || []) if (n.status >= 400) failed.push({ page: c.page, vw: c.vw, url: n.url, error: `HTTP ${n.status}` });

    layoutRows.push([c.page, c.vw, ex.doc.innerWidth, ex.doc.scrollWidth, ex.doc.horizontalOverflow ? 'SIM' : 'não', ex.doc.scrollHeight]);
    const vis = ex.inventory.variantRoots.filter((v) => v.visible).map((v) => v.name).join(', ') || '—';
    const hid = ex.inventory.variantRoots.filter((v) => !v.visible).map((v) => v.name).join(', ') || '—';
    const hc = Object.entries(ex.inventory.hiddenClasses).map(([k, v]) => `${k}:${v.visible}/${v.total}`).join(' ');
    const dupHidden = ex.inventory.texts.filter((t) => !t.visible).length;
    variantRows.push([c.page, c.vw, vis, hid, hc || '—', `${ex.inventory.texts.filter((t) => t.visible).length} / ${dupHidden}`]);

    const key = `${c.page}@${c.vw}`;
    S.pages[key] = {
      layout: { innerWidth: ex.doc.innerWidth, scrollWidth: ex.doc.scrollWidth, horizontalOverflow: ex.doc.horizontalOverflow, height: ex.doc.scrollHeight },
      typography: typography(ex, 25),
      sections: sections(ex),
      palette: palette(ex),
      images: ex.inventory.images.filter((i) => i.visible).map((i) => ({ file: (i.currentSrc || i.src || '').split('/').pop().split('?')[0], alt: i.alt, natural: `${i.naturalW}x${i.naturalH}`, rendered: `${i.w}x${i.h}`, objectFit: i.objectFit, radius: i.radius, pageY: i.pageY })),
      backgrounds: ex.inventory.backgrounds.filter((b) => b.visible).slice(0, 20),
      svgs: ex.inventory.svgs.filter((s) => s.visible).map((s) => ({ file: s.file, w: s.w, h: s.h, parent: s.parentName || s.parentTag, pageY: s.pageY })),
      links: ex.inventory.links.filter((l) => l.visible),
      animations: analyseAnimations(an),
      cssAnimations: { entry: (an && an.entryAnimations || []).length, afterScroll: (an && an.afterScrollAnimations || []).length, timings: (an && an.afterScrollAnimations || []).slice(0, 10).map((a) => ({ type: a.type, name: a.name, target: a.target && (a.target.name || a.target.tag), duration: a.timing && a.timing.duration, easing: a.timing && a.timing.easing, iterations: a.timing && (a.timing.iterations === Infinity ? 'infinite' : a.timing.iterations) })) },
    };
    if (c.page === 'home' && c.vw === 1440) S.palette1440 = S.pages[key].palette;
  }

  S.breakpoints = [...media].filter((m) => /width/.test(m)).sort();
  S.fonts = {
    loaded: [...fontFamilies.values()],
    fontFaces: [...fontFaces.values()],
    files: (await exists(path.join(OUT, 'fonts'))) ? await fs.readdir(path.join(OUT, 'fonts')) : [],
  };

  // --- Seção: fontes
  md.push('## 1. Fontes');
  md.push('**Carregadas no documento** (document.fonts):\n');
  md.push(table(['família', 'peso', 'estilo', 'status'], S.fonts.loaded.map((f) => [f.family, f.weight, f.style, f.status])));
  md.push('**@font-face encontrados no CSS:**\n');
  md.push(table(['família', 'peso', 'estilo', 'src'], S.fonts.fontFaces.slice(0, 40).map((f) => [f.family, f.weight, f.style, f.src.slice(0, 110)])));
  md.push(`**Arquivos de fonte baixados pelo capture:** ${S.fonts.files.length ? S.fonts.files.join(', ') : 'nenhum'}\n`);

  // --- Seção: breakpoints
  md.push('## 2. Breakpoints (media queries com largura)');
  md.push(S.breakpoints.length ? S.breakpoints.map((b) => `- \`${b}\``).join('\n') + '\n' : '_(nenhuma encontrada — o CSS pode estar bloqueado ou ser inline)_\n');

  // --- Seção: layout
  md.push('## 3. Layout por página e largura');
  md.push(table(['página', 'viewport', 'innerWidth', 'scrollWidth', 'overflow horizontal', 'altura total'], layoutRows));
  md.push('### Variantes responsivas (quais blocos estão visíveis em cada largura)\n');
  md.push(table(['página', 'viewport', 'variantes visíveis', 'variantes ocultas', 'classes hidden-* (visíveis/total)', 'textos visíveis / ocultos'], variantRows));

  // --- Seção: tipografia por página/viewport
  md.push('## 4. Tipografia (estilos computados dos textos visíveis, do maior ao menor)');
  for (const [key, v] of Object.entries(S.pages)) {
    const [page, vw] = key.split('@');
    const limit = focusPages.has(page) ? 18 : 8;
    md.push(`### ${key}\n`);
    md.push(table(['fonte', 'tamanho', 'peso', 'line-height', 'letter-spacing', 'transform', 'cor', 'n', 'exemplo'],
      v.typography.slice(0, limit).map((t) => [t.fontFamily, t.fontSize, t.fontWeight, t.lineHeight, t.letterSpacing, t.textTransform, t.color, t.count, t.sample])));
  }

  // --- Seção: seções / paleta
  md.push('## 5. Blocos de largura total e paleta');
  for (const [key, v] of Object.entries(S.pages)) {
    if (!key.startsWith('home@')) continue;
    md.push(`### ${key} — blocos\n`);
    md.push(table(['nome', 'tag', 'y', 'altura', 'fundo', 'padding'], v.sections.map((s) => [s.name, s.tag, s.y, s.h, s.background, s.padding])));
    md.push(`### ${key} — paleta/bordas (mais frequentes)\n`);
    md.push(table(['valor', 'ocorrências'], v.palette.slice(0, 20)));
  }

  // --- Seção: imagens
  md.push('## 6. Imagens renderizadas (Home e demais páginas, só visíveis)');
  for (const [key, v] of Object.entries(S.pages)) {
    if (!/@(1440|390)$/.test(key) || !v.images.length) continue;
    md.push(`### ${key}\n`);
    md.push(table(['arquivo', 'natural', 'renderizada', 'object-fit', 'raio', 'alt', 'y'], v.images.slice(0, 30).map((i) => [i.file, i.natural, i.rendered, i.objectFit, i.radius, i.alt, i.pageY])));
  }
  md.push(`**Favicons/ícones:** ${[...icons.values()].map((i) => `${i.rel} ${i.href}`).join(' · ') || 'nenhum encontrado'}\n`);
  const svgCount = Object.values(S.pages).reduce((n, p) => n + p.svgs.length, 0);
  md.push(`**SVGs inline visíveis:** ${svgCount} (arquivos em \`svg-inline/\`)\n`);

  // --- Seção: probes
  md.push('## 7. Comportamentos (probes)');
  const probeDirs = (await exists(path.join(OUT, '_probes'))) ? await fs.readdir(path.join(OUT, '_probes')) : [];
  for (const d of probeDirs.filter((x) => x.startsWith('header-'))) {
    const j = await readJson(path.join(OUT, '_probes', d, 'header.json'));
    if (!j) continue;
    S.probes[d] = j;
    md.push(`### Header @${j.viewport.w} — modo: ${j.marked.mode || 'n/d'} (<${j.marked.tag || '?'}>${j.marked.name ? ` "${j.marked.name}"` : ''})\n`);
    md.push(table(['passo', 'scrollY', 'top', 'altura', 'transform', 'opacity', 'fundo', 'backdrop', 'blend'], j.states.map((s) => [s.step, s.scrollY, s.top, s.height, s.transform, s.opacity, s.backgroundColor, s.backdropFilter, s.mixBlendMode])));
  }
  for (const d of probeDirs.filter((x) => x.startsWith('menu-'))) {
    const j = await readJson(path.join(OUT, '_probes', d, 'menu.json'));
    if (!j) continue;
    S.probes[d] = j;
    md.push(`### Menu mobile @${j.viewport.w}\n`);
    if (!j.found) { md.push('Gatilho "Menu" não encontrado.\n'); continue; }
    md.push(table(['tag', 'position', 'z-index', 'tamanho', 'fundo', 'backdrop', 'links'],
      j.overlays.map((o) => [o.tag, o.position, o.zIndex, `${o.w}x${o.h}`, o.backgroundColor, o.backdropFilter, o.links.map((l) => `${l.text} (${l.fontSize})`).join(', ')])));
    md.push(`Screenshots: ${j.frames.map((f) => f.file).join(', ')}\n`);
  }
  for (const d of probeDirs.filter((x) => x.startsWith('hover-'))) {
    const j = await readJson(path.join(OUT, '_probes', d, 'hover.json'));
    if (!j) continue;
    S.probes[d] = j;
    const changed = j.results.filter((r) => r.changes.length);
    const still = j.results.filter((r) => r.hovered && !r.changes.length);
    const err = j.results.filter((r) => !r.hovered);
    md.push(`### Hover ${j.route} @${j.viewport.w} — ${changed.length} com mudança, ${still.length} sem mudança, ${err.length} não testáveis\n`);
    md.push(table(['alvo', 'href', 'mudanças (elemento: propriedade antes → depois)'],
      changed.map((r) => {
        const hasTransform = new Set(r.changes.filter((c) => c.prop === 'transform' || c.prop === 'scale' || c.prop === 'translate').map((c) => c.i));
        const shown = r.changes.filter((c) => !(['w', 'h', 'x', 'y'].includes(c.prop) && hasTransform.has(c.i)));
        return [r.text, r.href, shown.slice(0, 5).map((c) => `${c.tag}#${c.i}: ${c.prop} ${c.from} → ${c.to}`).join('; ')];
      })));
  }
  for (const d of probeDirs.filter((x) => x.startsWith('form-'))) {
    const j = await readJson(path.join(OUT, '_probes', d, 'form.json'));
    if (!j) continue;
    S.probes[d] = j;
    md.push(`### Formulário @${j.viewport.w} (nada foi enviado: POSTs interceptados)\n`);
    md.push(table(['tag', 'type', 'name', 'label', 'placeholder', 'required', 'pattern', 'visível'],
      j.fieldsInitial.filter((f) => ['input', 'textarea', 'button', 'form', 'select'].includes(f.tag)).map((f) => [f.tag, f.type, f.name, f.label || f.text, f.placeholder, f.required, f.pattern, f.visible])));
    const st = (x) => (x ? x.map((s) => `"${s.text}" (${s.color})`).join('; ') || '—' : '—');
    md.push(`- Envio vazio → ${st(j.stages.emptySubmit && j.stages.emptySubmit.status)}`);
    md.push(`- E-mail inválido → ${st(j.stages.invalidEmail && j.stages.invalidEmail.status)}`);
    md.push(`- Sucesso (resposta 200 simulada) → ${(j.stages.success || []).map((s) => `${s.t}ms: ${st(s.status)}`).join(' | ')}`);
    md.push(`- Erro (resposta 500 simulada) → ${(j.stages.serverError || []).map((s) => `${s.t}ms: ${st(s.status)}`).join(' | ')}`);
    md.push(`- Requisições interceptadas: ${(j.interceptedRequests || []).filter((p) => !/framer\.com\/events|analytics|plausible/.test(p.url)).map((p) => `${p.method} ${p.url} [${p.contentType}] ${p.body.slice(0, 120)}`).join(' ‖ ') || 'nenhuma'}\n`);
  }
  for (const d of probeDirs.filter((x) => x.startsWith('backtotop-'))) {
    const j = await readJson(path.join(OUT, '_probes', d, 'backtotop.json'));
    if (!j) continue;
    S.probes[d] = j;
    if (!j.found) { md.push('### Back to top: não encontrado\n'); continue; }
    const done = j.curve.find((p) => p.y <= 2);
    md.push(`### Back to top @${j.viewport.w}: href \`${j.href}\`, scroll inicial ${j.startY}px → topo em ${done ? done.t + 'ms' : '>3000ms'} (curva: ${j.curve.filter((_, i) => i % 3 === 0).map((p) => `${p.t}:${p.y}`).join(' ')})\n`);
  }
  for (const d of probeDirs.filter((x) => x.startsWith('transitions-'))) {
    const j = await readJson(path.join(OUT, '_probes', d, 'transitions.json'));
    if (!j) continue;
    S.probes[d] = j;
    md.push(`### Transições de página @${j.viewport.w}\n`);
    md.push(table(['link', 'encontrado', 'URL antes', 'URL depois', 'frames'], j.log.map((l) => [l.label, l.found, l.urlBefore, l.urlAfter, (l.frames || []).map((f) => f.file).join(', ')])));
    const an = analyseAnimations(j.anim);
    if (an) md.push(`Animações detectadas durante a navegação: entrada ${an.stats.entry.count}, durante scroll ${an.stats.scroll.count}, pós ${an.stats.after.count}; marcas: ${JSON.stringify(an.marks)}\n`);
  }

  // --- Seção: animações
  md.push('## 8. Animações (amostradas por frame; duração e curva ajustadas a curvas conhecidas)');
  md.push('_Resolução ≈ 16ms por amostra. Curvas muito próximas entre si (ex.: `.44,0,.56,1` e ease-in-out `.42,0,.58,1`) não são distinguíveis por amostragem; a diferença visual é desprezível._\n');
  for (const [key, v] of Object.entries(S.pages)) {
    if (!/^home@(1440|390)$/.test(key) || !v.animations) continue;
    const a = v.animations;
    md.push(`### ${key}\n`);
    const fmtMs = (v) => (v != null ? `${v}ms` : 'n/d');
    md.push(`Entrada: ${a.stats.entry.count} animações (mediana ${fmtMs(a.stats.entry.medianDurationMs)}) · Scroll: ${a.stats.scroll.count} (mediana ${fmtMs(a.stats.scroll.medianDurationMs)}). Curvas mais votadas: ${Object.entries(a.easingVotes).sort((x, y) => y[1] - x[1]).slice(0, 4).map(([k, n]) => `${k} ×${n}`).join(', ') || 'n/d'}\n`);
    md.push(table(['fase', 'início ms', 'duração ms', 'elemento', 'propriedade', 'de → para', 'curva (melhor ajuste)'],
      a.bursts.filter((b) => b.durationMs >= 100).slice(0, 40).map((b) => [b.phase, b.startMs, b.durationMs, `${b.tag}${b.name ? ` "${b.name}"` : ''} ${b.text ? `«${b.text.slice(0, 24)}»` : ''}`, b.prop, `${b.from} → ${b.to}`, b.easing ? `${b.easing.name} (erro ${b.easing.err})` : '—'])));
    md.push(`Web Animations API (CSS/WAAPI) após scroll: ${v.cssAnimations.afterScroll} ativas. ${v.cssAnimations.timings.length ? table(['tipo', 'nome', 'alvo', 'duração', 'easing', 'iterações'], v.cssAnimations.timings.map((t) => [t.type, t.name, t.target, t.duration, t.easing, t.iterations])) : ''}`);
  }

  // --- Seção: rede
  md.push('## 9. Rede, console e metadados');
  const uniq = (arr, k) => [...new Map(arr.map((x) => [k(x), x])).values()];
  const f2 = uniq(failed, (f) => f.url + f.error);
  md.push(`**Requisições com falha / HTTP ≥ 400:** ${f2.length}\n`);
  if (f2.length) md.push(table(['página', 'viewport', 'URL', 'erro'], f2.slice(0, 25).map((f) => [f.page, f.vw, f.url.slice(0, 100), f.error])));
  const c2 = uniq(consoleMsgs, (m) => m.type + m.text);
  md.push(`**Mensagens de console (erro/aviso):** ${c2.length}\n`);
  if (c2.length) md.push(table(['página', 'viewport', 'tipo', 'texto'], c2.slice(0, 25).map((m) => [m.page, m.vw, m.type, m.text.slice(0, 140)])));
  const fa = await readJson(path.join(OUT, 'framer-assets.json'), []);
  md.push(`**URLs do CDN do Framer vistas na rede:** ${fa.length}\n`);
  md.push(`**Meta tags:** ${Object.entries(metaTags).slice(0, 12).map(([k, v]) => `${k}="${String(v).slice(0, 60)}"`).join(' · ')}\n`);
  if (Object.keys(rootVars).length) md.push(`**Variáveis CSS em :root/body (${Object.keys(rootVars).length}):** ${Object.entries(rootVars).slice(0, 25).map(([k, v]) => `${k}: ${v}`).join(' · ')}\n`);

  await fs.writeFile(path.join(OUT, 'SUMMARY.md'), md.join('\n'));
  await fs.writeFile(path.join(OUT, 'summary.json'), JSON.stringify(S, null, 1));
  const size = (await fs.stat(path.join(OUT, 'SUMMARY.md'))).size;
  console.log(`SUMMARY.md (${Math.round(size / 1024)} KB) e summary.json gerados em ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

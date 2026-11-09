#!/usr/bin/env node
/**
 * GRID — captura de auditoria com Playwright.
 *
 * Uso:
 *   node capture.mjs                       # execução completa (todas as rotas x 6 viewports + probes)
 *   node capture.mjs --quick               # teste rápido: só a Home em 1440px + probe do header
 *   node capture.mjs --pages /,/about      # só essas rotas (sem crawl)
 *   node capture.mjs --viewports 1440,390  # só essas larguras
 *   node capture.mjs --skip hover,form     # pula probes (header,menu,hover,form,backtotop,transitions)
 *   node capture.mjs --video               # grava vídeo de cada captura (útil para animações)
 *   node capture.mjs --headed              # abre o navegador visível
 *   node capture.mjs --base http://localhost:8123 --out /tmp/audit   # alvo/saída customizados
 *
 * SEGURANÇA: o formulário do site NUNCA é enviado de verdade. Todo POST/PUT é
 * interceptado e respondido localmente (ver probeForm).
 */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import {
  STYLE_PROPS, HOVER_PROPS, samplerInit, collectAnimations, collectDocument, extractViewport,
  collectInventory, markHeader, measureHeader, markHoverTargets, snapshotHover, findOverlays,
  readFormFields, findStatusTexts,
} from './lib/inpage.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const k = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) o[k] = true;
    else { o[k] = next; i++; }
  }
  return o;
}

const args = parseArgs(process.argv.slice(2));
const BASE = String(args.base || 'https://gridagency.framer.website').replace(/\/+$/, '');
const OUT = path.resolve(String(args.out || path.join(__dirname, 'output')));
const QUICK = Boolean(args.quick);
const WITH_VIDEO = Boolean(args.video);
const NO_FULLPAGE = Boolean(args['no-fullpage']);
const SCROLL_WAIT = Number(args['scroll-wait'] || 1100);
const SKIP = new Set(String(args.skip || '').split(',').filter(Boolean));

const ALL_VIEWPORTS = [
  { w: 1920, h: 1080 }, { w: 1440, h: 900 }, { w: 1280, h: 800 },
  { w: 768, h: 1024 }, { w: 390, h: 844 }, { w: 360, h: 740 },
];
let VIEWPORTS = QUICK ? [{ w: 1440, h: 900 }] : ALL_VIEWPORTS;
if (args.viewports) {
  const want = String(args.viewports).split(',').map(Number).filter(Boolean);
  VIEWPORTS = want.map((w) => ALL_VIEWPORTS.find((v) => v.w === w) || { w, h: Math.round(w * 0.625) });
}

const SEEDS = ['/', '/project', '/about', '/contact',
  '/project/nova-grid', '/project/lumo-wellness', '/project/viron', '/project/kora-co'];

const slugOf = (route) => (route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-'));
const pad = (n) => String(n).padStart(2, '0');
const wantProbe = (name) => !SKIP.has(name);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const writeJson = (file, data) => fs.writeFile(file, JSON.stringify(data, null, 1));

async function firstVisible(locator) {
  const all = await locator.all();
  for (const l of all) {
    if (await l.isVisible().catch(() => false)) return l;
  }
  return null;
}

// --------------------------------------------------------------------------
// Página / contexto
// --------------------------------------------------------------------------

async function handleResponse(res, diag) {
  try {
    const req = res.request();
    const url = res.url();
    const type = req.resourceType();
    const h = res.headers();
    const ct = h['content-type'] || '';
    diag.net.push({ url, status: res.status(), type, contentType: ct, length: Number(h['content-length']) || null });
    const isFont = type === 'font' || /font\//.test(ct) || /\.(woff2?|ttf|otf)(\?|$)/i.test(url);
    const isSvg = /image\/svg/.test(ct) || /\.svg(\?|$)/i.test(url);
    if ((isFont || isSvg) && res.status() === 200) {
      const body = await res.body();
      const sub = isFont ? 'fonts' : 'svg';
      await fs.mkdir(path.join(OUT, sub), { recursive: true });
      const base = path.basename(new URL(url).pathname) || 'file';
      const ext = path.extname(base) || (isFont ? '.woff2' : '.svg');
      const hash = crypto.createHash('sha1').update(url).digest('hex').slice(0, 8);
      const name = `${path.basename(base, path.extname(base))}-${hash}${ext}`;
      await fs.writeFile(path.join(OUT, sub, name), body);
      diag.saved.push({ url, file: `${sub}/${name}`, bytes: body.length });
    }
  } catch (e) { /* corpo indisponível (redirect/cache) */ }
}

async function openPage(browser, vp, route, opts = {}) {
  const { sampler = true, videoDir = null, routeHandler = null, waitMs = 2500 } = opts;
  const ctxOpts = {
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: 1,
    isMobile: vp.w <= 768,
    hasTouch: vp.w <= 768,
    locale: 'en-US',
  };
  if (videoDir) ctxOpts.recordVideo = { dir: videoDir, size: { width: vp.w, height: vp.h } };
  const context = await browser.newContext(ctxOpts);
  if (sampler) await context.addInitScript(samplerInit);
  const page = await context.newPage();
  const diag = { console: [], pageErrors: [], failed: [], net: [], saved: [], pending: [] };
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') diag.console.push({ type: m.type(), text: m.text().slice(0, 300) });
  });
  page.on('pageerror', (e) => diag.pageErrors.push(String(e.message).slice(0, 300)));
  page.on('requestfailed', (r) => diag.failed.push({ url: r.url(), error: r.failure() ? r.failure().errorText : null }));
  page.on('response', (res) => { diag.pending.push(handleResponse(res, diag)); });
  if (routeHandler) await routeHandler(page);
  const resp = await page.goto(BASE + route, { waitUntil: 'load', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  if (waitMs) await page.waitForTimeout(waitMs);
  return { context, page, resp, diag };
}

async function closePage(handle) {
  await Promise.allSettled(handle.diag.pending);
  await handle.context.close();
}

/** Rola a página inteira devagar para disparar reveals/IntersectionObserver. */
async function warmScroll(page, vp) {
  const step = Math.round(vp.h * 0.8);
  let prev = -1;
  for (let i = 0; i < 80; i++) {
    const y = await page.evaluate((s) => { window.scrollBy(0, s); return Math.round(window.scrollY); }, step);
    await page.waitForTimeout(450);
    const total = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
    if (y + vp.h >= total - 2 || y === prev) break;
    prev = y;
  }
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
}

// --------------------------------------------------------------------------
// Descoberta de rotas
// --------------------------------------------------------------------------

async function discoverRoutes(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const origin = new URL(BASE).origin;
  const seen = new Set();
  const notFound = [];
  const queue = [...SEEDS];
  while (queue.length && seen.size + notFound.length < 40) {
    const route = queue.shift();
    if (seen.has(route) || notFound.includes(route)) continue;
    try {
      const resp = await page.goto(BASE + route, { waitUntil: 'load', timeout: 60000 });
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
      if (resp && resp.status() >= 400) { notFound.push(route); continue; }
      seen.add(route);
      const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.href));
      for (const h of hrefs) {
        let u;
        try { u = new URL(h); } catch (e) { continue; }
        if (u.origin !== origin) continue;
        const p = u.pathname.replace(/\/+$/, '') || '/';
        if (!seen.has(p) && !queue.includes(p) && !notFound.includes(p)) queue.push(p);
      }
    } catch (e) {
      console.error(`  ! discover ${route}: ${e.message}`);
      notFound.push(route);
    }
  }
  await ctx.close();
  const routes = [...seen].sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));
  await writeJson(path.join(OUT, 'routes.json'), { routes, notFound });
  return routes;
}

// --------------------------------------------------------------------------
// Captura principal (por rota x viewport)
// --------------------------------------------------------------------------

async function captureOne(browser, route, vp) {
  const slug = slugOf(route);
  const dir = path.join(OUT, slug, String(vp.w));
  await fs.mkdir(dir, { recursive: true });
  const handle = await openPage(browser, vp, route, { videoDir: WITH_VIDEO ? path.join(dir, 'video') : null });
  const { page, resp, diag } = handle;
  try {
    try { await fs.writeFile(path.join(dir, 'source.html'), await resp.text()); } catch (e) { /* sem corpo */ }
    await page.screenshot({ path: path.join(dir, 'viewport-initial.png') });
    const animEntry = await page.evaluate(collectAnimations);
    await page.evaluate(() => window.__animSampler && window.__animSampler.mark('entry-end'));
    const docInfo = await page.evaluate(collectDocument);

    // Passagem de scroll: screenshot + extração de estilos a cada parada
    await page.evaluate(() => window.__animSampler && window.__animSampler.mark('scroll-start'));
    const merged = new Map();
    const stops = [];
    const step = Math.round(vp.h * 0.8);
    let target = 0;
    let prevY = -1;
    for (let i = 0; i < 60; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), target);
      await page.waitForTimeout(SCROLL_WAIT);
      const y = await page.evaluate(() => Math.round(window.scrollY));
      await page.screenshot({ path: path.join(dir, `scroll-${pad(i)}.png`) });
      const recs = await page.evaluate(extractViewport, STYLE_PROPS);
      for (const r of recs) {
        const prev = merged.get(r.id);
        if (!prev || r.centerDist < prev.centerDist) merged.set(r.id, r);
      }
      stops.push({ i, scrollY: y, extracted: recs.length });
      const total = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
      if (y + vp.h >= total - 2 || y === prevY) break;
      prevY = y;
      target = Math.min(y + step, Math.max(0, total - vp.h));
    }
    await page.evaluate(() => window.__animSampler && window.__animSampler.mark('scroll-end'));

    const inventory = await page.evaluate(collectInventory);
    await fs.mkdir(path.join(OUT, 'svg-inline'), { recursive: true });
    for (const s of inventory.svgs) {
      if (!s.markup) continue;
      const hash = crypto.createHash('sha1').update(s.markup).digest('hex').slice(0, 10);
      const file = `svg-inline/${hash}.svg`;
      const full = path.join(OUT, file);
      await fs.writeFile(full, s.markup.includes('xmlns') ? s.markup : s.markup.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"'));
      s.file = file;
      delete s.markup;
    }

    if (!NO_FULLPAGE) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(900);
      try { await page.screenshot({ path: path.join(dir, 'full.png'), fullPage: true }); } catch (e) { diag.fullpageError = e.message; }
    }

    const anim = await page.evaluate(() => ({
      events: window.__animSampler.events,
      marks: window.__animSampler.marks,
      describe: window.__animSampler.describe(),
    }));
    const animAfter = await page.evaluate(collectAnimations);

    // Tabela de estilos deduplicada
    const styleIndex = new Map();
    const styles = [];
    const elements = [];
    for (const r of merged.values()) {
      const key = JSON.stringify(r.style);
      let idx = styleIndex.get(key);
      if (idx === undefined) { idx = styles.length; styles.push(r.style); styleIndex.set(key, idx); }
      const { style, centerDist, ...rest } = r;
      elements.push({ ...rest, s: idx });
    }
    elements.sort((a, b) => a.y - b.y || a.x - b.x);

    await Promise.allSettled(diag.pending);
    await writeJson(path.join(dir, 'extract.json'), { route, viewport: vp, doc: docInfo, stops, styles, elements, inventory });
    await writeJson(path.join(dir, 'anim.json'), { ...anim, entryAnimations: animEntry, afterScrollAnimations: animAfter });
    await writeJson(path.join(dir, 'network.json'), {
      net: diag.net, saved: diag.saved, console: diag.console, pageErrors: diag.pageErrors,
      failed: diag.failed, fullpageError: diag.fullpageError || null,
    });
    console.log(`  ok ${slug}@${vp.w}: ${elements.length} elementos, ${stops.length} paradas de scroll, ${diag.net.length} requisições`);
  } finally {
    await closePage(handle);
  }
}

// --------------------------------------------------------------------------
// Probes de comportamento
// --------------------------------------------------------------------------

async function probeHeader(browser, vp) {
  const dir = path.join(OUT, '_probes', `header-${vp.w}`);
  await fs.mkdir(dir, { recursive: true });
  const h = await openPage(browser, vp, '/', { waitMs: 2000 });
  try {
    const marked = await h.page.evaluate(markHeader);
    const steps = [['to', 0], ['to', 500], ['to', 1500], ['wheel', -150], ['wheel', -500], ['to', 0]];
    const states = [];
    let i = 0;
    for (const [kind, v] of steps) {
      if (kind === 'to') await h.page.evaluate((y) => window.scrollTo(0, y), v);
      else { await h.page.mouse.move(vp.w / 2, vp.h / 2); await h.page.mouse.wheel(0, v); }
      await h.page.waitForTimeout(1000);
      const m = await h.page.evaluate(measureHeader);
      states.push({ step: `${kind}:${v}`, ...m });
      await h.page.screenshot({ path: path.join(dir, `step-${pad(i++)}.png`), clip: { x: 0, y: 0, width: vp.w, height: Math.min(180, vp.h) } });
    }
    await writeJson(path.join(dir, 'header.json'), { viewport: vp, marked, states });
  } finally { await closePage(h); }
}

async function probeMenu(browser, vp) {
  const dir = path.join(OUT, '_probes', `menu-${vp.w}`);
  await fs.mkdir(dir, { recursive: true });
  const h = await openPage(browser, vp, '/', { waitMs: 2000 });
  try {
    const trigger = await firstVisible(h.page.getByText('Menu', { exact: true }));
    if (!trigger) { await writeJson(path.join(dir, 'menu.json'), { viewport: vp, found: false }); return; }
    await h.page.screenshot({ path: path.join(dir, 'closed.png') });
    const box = await trigger.boundingBox();
    // Clique com timeout curto; se algo cobrir o botão, tenta por coordenadas
    const clickAt = async (loc) => {
      try { await loc.click({ timeout: 4000 }); }
      catch (e) { if (box) await h.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2); }
    };
    await clickAt(trigger);
    const frames = [];
    for (const t of [80, 250, 500, 1000]) {
      await h.page.waitForTimeout(t === 80 ? 80 : t - frames[frames.length - 1].t);
      await h.page.screenshot({ path: path.join(dir, `open-${t}ms.png`) });
      frames.push({ t, file: `open-${t}ms.png` });
    }
    const overlays = await h.page.evaluate(findOverlays);
    const closeTrigger = (await firstVisible(h.page.getByText(/^(menu|close|fechar)$/i))) || trigger;
    await clickAt(closeTrigger);
    await h.page.waitForTimeout(600);
    if ((await h.page.evaluate(findOverlays)).length) await h.page.keyboard.press('Escape');
    await h.page.waitForTimeout(600);
    await h.page.screenshot({ path: path.join(dir, 'closed-after.png') });
    await writeJson(path.join(dir, 'menu.json'), { viewport: vp, found: true, triggerBox: box, frames, overlays });
  } finally { await closePage(h); }
}

function diffSnapshots(before, after) {
  const changes = [];
  if (!before || !after) return changes;
  const n = Math.min(before.length, after.length);
  for (let i = 0; i < n; i++) {
    for (const k of Object.keys(before[i])) {
      if (k === 'i' || k === 'tag') continue;
      const a = before[i][k];
      const b = after[i][k];
      if (typeof a === 'number' && typeof b === 'number') { if (Math.abs(a - b) > 1) changes.push({ i, tag: before[i].tag, prop: k, from: a, to: b }); }
      else if (a !== b) changes.push({ i, tag: before[i].tag, prop: k, from: a, to: b });
    }
  }
  return changes;
}

async function probeHover(browser, vp, route) {
  const slug = slugOf(route);
  const dir = path.join(OUT, '_probes', `hover-${slug}-${vp.w}`);
  await fs.mkdir(dir, { recursive: true });
  const h = await openPage(browser, vp, route, { sampler: false, waitMs: 2000 });
  try {
    await warmScroll(h.page, vp);
    const targets = await h.page.evaluate(markHoverTargets, 40);
    const results = [];
    let shots = 0;
    for (const t of targets) {
      const loc = h.page.locator(`[data-audit-hover="${t.id}"]`).first();
      const rec = { ...t, hovered: false, changes: [] };
      try {
        await loc.scrollIntoViewIfNeeded({ timeout: 3000 });
        await h.page.mouse.move(2, 2);
        await h.page.waitForTimeout(500);
        const before = await h.page.evaluate(snapshotHover, { id: t.id, props: HOVER_PROPS });
        const canShot = shots < 10;
        if (canShot) await loc.screenshot({ path: path.join(dir, `t${pad(t.id)}-before.png`), timeout: 4000 }).catch(() => {});
        await loc.hover({ timeout: 4000 });
        await h.page.waitForTimeout(800);
        const after = await h.page.evaluate(snapshotHover, { id: t.id, props: HOVER_PROPS });
        rec.hovered = true;
        rec.changes = diffSnapshots(before, after);
        if (canShot && rec.changes.length) {
          await loc.screenshot({ path: path.join(dir, `t${pad(t.id)}-after.png`), timeout: 4000 }).catch(() => {});
          shots++;
        }
        await h.page.mouse.move(2, 2);
      } catch (e) { rec.error = e.message.split('\n')[0]; }
      results.push(rec);
    }
    await writeJson(path.join(dir, 'hover.json'), { route, viewport: vp, results });
  } finally { await closePage(h); }
}

const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' };

async function fillForm(page, values) {
  let inputs = page.locator('form input:not([type=hidden]):not([type=submit]):not([type=checkbox]):not([type=radio]), form textarea');
  if ((await inputs.count()) === 0) inputs = page.locator('input:not([type=hidden]):not([type=submit]):not([type=checkbox]):not([type=radio]), textarea');
  const n = await inputs.count();
  let textIdx = 0;
  for (let i = 0; i < n; i++) {
    const loc = inputs.nth(i);
    if (!(await loc.isVisible())) continue;
    const tag = await loc.evaluate((e) => e.tagName);
    const type = await loc.getAttribute('type');
    let value;
    if (tag === 'TEXTAREA') value = values.message;
    else if (type === 'email') value = values.email;
    else value = textIdx++ === 0 ? values.first : values.last;
    await loc.fill(value);
  }
}

async function clickSubmit(page) {
  const candidates = page.locator('button, [role=button], input[type=submit]').filter({ hasText: /submit/i });
  let btn = await firstVisible(candidates);
  if (!btn) btn = await firstVisible(page.getByText(/^\s*submit\s*$/i));
  if (!btn) return false;
  await btn.click();
  return true;
}

/** Nunca envia de verdade: todo POST/PUT/OPTIONS é interceptado e respondido localmente. */
async function probeForm(browser, vp) {
  const dir = path.join(OUT, '_probes', `form-${vp.w}`);
  await fs.mkdir(dir, { recursive: true });
  const posts = [];
  let mode = 'success';
  const routeHandler = async (page) => {
    await page.route('**/*', (route) => {
      const req = route.request();
      const m = req.method();
      if (m === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
      if (m === 'POST' || m === 'PUT' || m === 'PATCH') {
        posts.push({ mode, url: req.url(), method: m, contentType: req.headers()['content-type'] || null, body: (req.postData() || '').slice(0, 1500) });
        return route.fulfill({
          status: mode === 'success' ? 200 : 500,
          headers: CORS,
          contentType: 'application/json',
          body: '{}',
        });
      }
      return route.continue();
    });
  };
  const values = { first: 'Audit', last: 'Test', email: 'audit@example.com', message: 'Automated layout audit. This message is never sent.' };
  const out = { viewport: vp, stages: {} };
  const h = await openPage(browser, vp, '/contact', { routeHandler, waitMs: 2000 });
  try {
    out.fieldsInitial = await h.page.evaluate(readFormFields);
    await h.page.screenshot({ path: path.join(dir, '1-initial.png') });

    out.submitClicked = await clickSubmit(h.page);
    await h.page.waitForTimeout(900);
    out.stages.emptySubmit = { fields: await h.page.evaluate(readFormFields), status: await h.page.evaluate(findStatusTexts) };
    await h.page.screenshot({ path: path.join(dir, '2-empty-submit.png') });

    await fillForm(h.page, { ...values, email: 'not-an-email' });
    await clickSubmit(h.page);
    await h.page.waitForTimeout(900);
    out.stages.invalidEmail = { fields: await h.page.evaluate(readFormFields), status: await h.page.evaluate(findStatusTexts) };
    await h.page.screenshot({ path: path.join(dir, '3-invalid-email.png') });

    await fillForm(h.page, values);
    mode = 'success';
    await clickSubmit(h.page);
    out.stages.success = [];
    let last = 0;
    for (const t of [200, 800, 2500, 5000]) {
      await h.page.waitForTimeout(t - last);
      last = t;
      await h.page.screenshot({ path: path.join(dir, `4-success-${t}ms.png`) });
      out.stages.success.push({ t, status: await h.page.evaluate(findStatusTexts) });
    }
  } finally { await closePage(h); }

  const h2 = await openPage(browser, vp, '/contact', { routeHandler, waitMs: 2000 });
  try {
    await fillForm(h2.page, values);
    mode = 'error';
    await clickSubmit(h2.page);
    out.stages.serverError = [];
    let last = 0;
    for (const t of [300, 1500, 4000]) {
      await h2.page.waitForTimeout(t - last);
      last = t;
      await h2.page.screenshot({ path: path.join(dir, `5-error-${t}ms.png`) });
      out.stages.serverError.push({ t, status: await h2.page.evaluate(findStatusTexts) });
    }
  } finally { await closePage(h2); }
  out.interceptedRequests = posts;
  await writeJson(path.join(dir, 'form.json'), out);
}

async function probeBackToTop(browser, vp) {
  const dir = path.join(OUT, '_probes', `backtotop-${vp.w}`);
  await fs.mkdir(dir, { recursive: true });
  const h = await openPage(browser, vp, '/', { sampler: false, waitMs: 2000 });
  try {
    await warmScroll(h.page, vp);
    await h.page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await h.page.waitForTimeout(1200);
    const link = await firstVisible(h.page.getByText(/back to top/i));
    if (!link) { await writeJson(path.join(dir, 'backtotop.json'), { viewport: vp, found: false }); return; }
    const href = await link.evaluate((e) => (e.closest('a') ? e.closest('a').getAttribute('href') : null));
    const startY = await h.page.evaluate(() => Math.round(window.scrollY));
    await link.click();
    const curve = [];
    for (let i = 0; i <= 30; i++) {
      curve.push({ t: i * 100, y: await h.page.evaluate(() => Math.round(window.scrollY)) });
      await h.page.waitForTimeout(100);
    }
    await writeJson(path.join(dir, 'backtotop.json'), { viewport: vp, found: true, href, startY, curve });
  } finally { await closePage(h); }
}

async function probeTransitions(browser, vp) {
  const dir = path.join(OUT, '_probes', `transitions-${vp.w}`);
  await fs.mkdir(dir, { recursive: true });
  const h = await openPage(browser, vp, '/', { videoDir: WITH_VIDEO ? path.join(dir, 'video') : null, waitMs: 2500 });
  try {
    const log = [];
    for (const label of ['Studio', 'Work', 'Contact']) {
      const link = await firstVisible(h.page.getByRole('link', { name: new RegExp(`^\\s*${label}\\s*$`, 'i') }));
      if (!link) { log.push({ label, found: false }); continue; }
      await h.page.evaluate((l) => window.__animSampler && window.__animSampler.mark('click:' + l), label);
      const urlBefore = h.page.url();
      await link.click();
      const frames = [];
      let last = 0;
      for (const t of [60, 200, 400, 800, 1500]) {
        await h.page.waitForTimeout(t - last);
        last = t;
        const file = `${label.toLowerCase()}-${t}ms.png`;
        await h.page.screenshot({ path: path.join(dir, file) });
        frames.push({ t, file });
      }
      await h.page.waitForTimeout(1200);
      log.push({ label, found: true, urlBefore, urlAfter: h.page.url(), frames });
      await h.page.goto(BASE + '/', { waitUntil: 'load' }).catch(() => {});
      await h.page.waitForTimeout(1500);
    }
    const anim = await h.page.evaluate(() => ({
      events: window.__animSampler.events, marks: window.__animSampler.marks, describe: window.__animSampler.describe(),
    }));
    await writeJson(path.join(dir, 'transitions.json'), { viewport: vp, log, anim });
  } finally { await closePage(h); }
}

// --------------------------------------------------------------------------
// main
// --------------------------------------------------------------------------

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: !args.headed });
  const errors = [];
  const guard = async (label, fn) => {
    const t0 = Date.now();
    try { await fn(); console.log(`  ok ${label} (${((Date.now() - t0) / 1000).toFixed(1)}s)`); }
    catch (e) { console.error(`  ! ${label}: ${e.message.split('\n')[0]}`); errors.push({ where: label, message: e.message.split('\n')[0] }); }
  };
  try {
    console.log(`Base: ${BASE}\nSaída: ${OUT}\nViewports: ${VIEWPORTS.map((v) => v.w).join(', ')}`);
    let routes;
    if (args.pages) routes = String(args.pages).split(',').map((r) => (r.startsWith('/') ? r : '/' + r));
    else if (QUICK) routes = ['/'];
    else {
      console.log('Descobrindo rotas…');
      routes = await discoverRoutes(browser).catch((e) => { errors.push({ where: 'discover', message: e.message }); return SEEDS; });
    }
    if (!routes.length) {
      throw new Error(`Nenhuma rota acessível em ${BASE}. Verifique a conexão/URL (a Home precisa responder com status < 400).`);
    }
    console.log(`Rotas (${routes.length}): ${routes.join(' ')}`);

    await writeJson(path.join(OUT, 'meta.json'), {
      base: BASE, date: new Date().toISOString(), browserVersion: browser.version(),
      node: process.version, viewports: VIEWPORTS, routes, quick: QUICK, video: WITH_VIDEO,
    });

    for (const route of routes) {
      for (const vp of VIEWPORTS) await guard(`captura ${slugOf(route)}@${vp.w}`, () => captureOne(browser, route, vp));
    }

    if (wantProbe('header')) for (const vp of VIEWPORTS) await guard(`header@${vp.w}`, () => probeHeader(browser, vp));
    if (!QUICK) {
      if (wantProbe('menu')) for (const vp of VIEWPORTS.filter((v) => v.w <= 810)) await guard(`menu@${vp.w}`, () => probeMenu(browser, vp));
      const desktop = VIEWPORTS.find((v) => v.w === 1440) || VIEWPORTS.find((v) => v.w >= 1280);
      if (desktop) {
        if (wantProbe('hover')) for (const r of routes.slice(0, 8)) await guard(`hover ${slugOf(r)}@${desktop.w}`, () => probeHover(browser, desktop, r));
        if (wantProbe('backtotop')) await guard(`backtotop@${desktop.w}`, () => probeBackToTop(browser, desktop));
        if (wantProbe('transitions')) await guard(`transitions@${desktop.w}`, () => probeTransitions(browser, desktop));
      }
      if (wantProbe('form') && routes.includes('/contact')) {
        for (const vp of [desktop, VIEWPORTS.find((v) => v.w === 390)].filter(Boolean)) await guard(`form@${vp.w}`, () => probeForm(browser, vp));
      }
    }

    // Consolida URLs do CDN do Framer vistas na rede
    const found = new Map();
    const files = (await fs.readdir(OUT, { recursive: true })).filter((f) => f.endsWith('network.json'));
    for (const f of files) {
      const j = JSON.parse(await fs.readFile(path.join(OUT, f), 'utf8'));
      for (const n of j.net || []) {
        if (!/framerusercontent\.com/.test(n.url)) continue;
        const key = n.url.split('?')[0];
        if (!found.has(key)) found.set(key, { url: key, type: n.type, contentType: n.contentType, status: n.status, seenAs: new Set() });
        found.get(key).seenAs.add(n.url);
      }
    }
    await writeJson(path.join(OUT, 'framer-assets.json'),
      [...found.values()].map((v) => ({ url: v.url, type: v.type, contentType: v.contentType, status: v.status, variants: [...v.seenAs].slice(0, 6) })));
  } finally {
    await browser.close();
    await writeJson(path.join(OUT, 'errors.json'), errors);
  }
  console.log(errors.length ? `\nConcluído com ${errors.length} erro(s) — veja output/errors.json` : '\nConcluído sem erros.');
  console.log('Próximo passo: node summarize.mjs');
}

main().catch((e) => { console.error(e); process.exit(1); });

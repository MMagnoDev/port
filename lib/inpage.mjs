/**
 * Funções executadas DENTRO do navegador (page.evaluate / addInitScript).
 * Regra: cada função aqui precisa ser autocontida (não pode referenciar nada
 * fora do próprio corpo), porque o Playwright serializa o código-fonte dela.
 */

/** Lista de propriedades CSS computadas que o extrator registra. */
export const STYLE_PROPS = [
  'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing',
  'textTransform', 'textAlign', 'textDecorationLine', 'whiteSpace', 'color',
  'backgroundColor', 'backgroundImage', 'backgroundSize', 'backgroundPosition',
  'borderTopWidth', 'borderTopStyle', 'borderTopColor',
  'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor',
  'borderRadius', 'boxShadow', 'opacity', 'transform', 'filter', 'backdropFilter',
  'mixBlendMode', 'clipPath', 'maskImage',
  'display', 'position', 'top', 'right', 'bottom', 'left', 'zIndex',
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'gap', 'rowGap', 'columnGap', 'gridTemplateColumns', 'flexDirection',
  'justifyContent', 'alignItems', 'overflow', 'objectFit', 'objectPosition',
  'transition', 'animationName', 'willChange', 'cursor',
];

/** Propriedades comparadas antes/depois do hover. */
export const HOVER_PROPS = [
  'color', 'backgroundColor', 'opacity', 'transform', 'translate', 'scale', 'rotate',
  'filter', 'textDecorationLine', 'borderTopColor', 'borderRadius', 'boxShadow',
  'letterSpacing', 'fontWeight', 'clipPath', 'cursor',
];

/**
 * Amostrador de animações. Roda desde o início do documento (addInitScript) e
 * registra, a cada frame, mudanças de opacity/transform/filter/clip-path.
 * Cada evento: [tMs, id, opacity, transform, filter, clipPath, (1 = estado inicial)]
 */
export function samplerInit() {
  if (window.__animSampler) return;
  const SEL = 'h1,h2,h3,h4,p,img,li,[data-framer-appear-id],[data-framer-name],[style*="transform"],[style*="opacity"]';
  const t0 = performance.now();
  const tracked = new Map();
  const events = [];
  const marks = [];
  let nextId = 0;
  let running = true;
  const api = {
    events,
    marks,
    mark(label) { marks.push([Math.round(performance.now() - t0), label]); },
    stop() { running = false; },
    describe() {
      const out = [];
      tracked.forEach((rec, el) => {
        const r = el.getBoundingClientRect();
        out.push({
          id: rec.id,
          tag: el.tagName.toLowerCase(),
          name: el.getAttribute('data-framer-name'),
          appear: el.getAttribute('data-framer-appear-id'),
          text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
          pageY: Math.round(r.top + window.scrollY),
          w: Math.round(r.width),
          h: Math.round(r.height),
        });
      });
      return out;
    },
  };
  window.__animSampler = api;
  function tick(now) {
    if (!running) return;
    const list = document.querySelectorAll(SEL);
    const n = Math.min(list.length, 1200);
    for (let i = 0; i < n; i++) {
      const el = list[i];
      let rec = tracked.get(el);
      if (!rec) { rec = { id: nextId++, sig: null }; tracked.set(el, rec); }
      const cs = getComputedStyle(el);
      const sig = cs.opacity + '|' + cs.transform + '|' + cs.filter + '|' + cs.clipPath;
      if (sig !== rec.sig) {
        const first = rec.sig === null;
        rec.sig = sig;
        if (events.length < 60000) {
          const ev = [Math.round(now - t0), rec.id, cs.opacity, cs.transform, cs.filter, cs.clipPath];
          if (first) ev.push(1);
          events.push(ev);
        }
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/** Web Animations API: CSS animations/transitions e animações WAAPI em curso. */
export function collectAnimations() {
  const out = [];
  const list = document.getAnimations ? document.getAnimations() : [];
  for (const a of list.slice(0, 300)) {
    const eff = a.effect;
    const tgt = eff && eff.target;
    let timing = null;
    let kfs = null;
    try { timing = eff.getTiming(); } catch (e) { /* sem timing */ }
    try { kfs = eff.getKeyframes(); } catch (e) { /* sem keyframes */ }
    out.push({
      type: a.constructor.name,
      name: a.animationName || a.transitionProperty || null,
      playState: a.playState,
      target: tgt ? {
        tag: tgt.tagName.toLowerCase(),
        name: tgt.getAttribute('data-framer-name'),
        text: (tgt.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30),
      } : null,
      timing,
      keyframes: kfs ? kfs.slice(0, 8) : null,
    });
  }
  return out;
}

/** Informações do documento: fontes, @font-face, media queries, variáveis CSS, favicons. */
export function collectDocument() {
  const mediaSet = new Set();
  const fontFaces = [];
  const rootVars = {};
  function walk(rules) {
    for (const r of rules) {
      if (typeof CSSMediaRule !== 'undefined' && r instanceof CSSMediaRule) {
        mediaSet.add(r.conditionText || r.media.mediaText);
      }
      if (typeof CSSFontFaceRule !== 'undefined' && r instanceof CSSFontFaceRule) {
        fontFaces.push({
          family: r.style.getPropertyValue('font-family'),
          weight: r.style.getPropertyValue('font-weight'),
          style: r.style.getPropertyValue('font-style'),
          display: r.style.getPropertyValue('font-display'),
          range: (r.style.getPropertyValue('unicode-range') || '').slice(0, 80),
          src: (r.style.getPropertyValue('src') || '').slice(0, 300),
        });
      } else if (typeof CSSStyleRule !== 'undefined' && r instanceof CSSStyleRule) {
        if (r.selectorText === ':root' || r.selectorText === 'body' || r.selectorText === 'html') {
          for (let i = 0; i < r.style.length; i++) {
            const n = r.style[i];
            if (n.startsWith('--')) rootVars[n] = r.style.getPropertyValue(n).trim().slice(0, 120);
          }
        }
      } else if (r.cssRules) {
        walk(r.cssRules);
      }
    }
  }
  let sheetsReadable = 0;
  let sheetsBlocked = 0;
  for (const ss of document.styleSheets) {
    let rules = null;
    try { rules = ss.cssRules; } catch (e) { sheetsBlocked++; continue; }
    sheetsReadable++;
    walk(rules);
  }
  const meta = {};
  document.querySelectorAll('meta[name], meta[property]').forEach((m) => {
    meta[m.getAttribute('name') || m.getAttribute('property')] = (m.getAttribute('content') || '').slice(0, 200);
  });
  return {
    url: location.href,
    title: document.title,
    lang: document.documentElement.lang,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    dpr: window.devicePixelRatio,
    userAgent: navigator.userAgent,
    fonts: Array.from(document.fonts).map((f) => ({ family: f.family, weight: f.weight, style: f.style, status: f.status })),
    fontFaces,
    mediaQueries: Array.from(mediaSet),
    rootVars,
    sheetsReadable,
    sheetsBlocked,
    meta,
    icons: Array.from(document.querySelectorAll('link[rel*="icon"]')).map((l) => ({
      rel: l.getAttribute('rel'), href: l.getAttribute('href'), sizes: l.getAttribute('sizes'), type: l.getAttribute('type'),
    })),
    preloads: Array.from(document.querySelectorAll('link[rel="preload"], link[rel="modulepreload"]')).map((l) => ({
      rel: l.getAttribute('rel'), as: l.getAttribute('as'), href: (l.getAttribute('href') || '').slice(0, 200),
    })),
  };
}

/**
 * Extrai elementos que estão (CSS-visíveis e) dentro da viewport atual, com
 * estilos computados. Cada elemento recebe um id estável (WeakMap na página),
 * o que permite mesclar extrações feitas em várias posições de scroll.
 */
export function extractViewport(props) {
  if (!window.__auditIds) { window.__auditIds = new WeakMap(); window.__auditNext = 1; }
  function idOf(el) {
    let id = window.__auditIds.get(el);
    if (!id) { id = window.__auditNext++; window.__auditIds.set(el, id); }
    return id;
  }
  const SKIP = new Set(['script', 'style', 'noscript', 'template', 'meta', 'link', 'head', 'title']);
  const MEDIA = new Set(['img', 'svg', 'video', 'canvas', 'picture', 'iframe']);
  const STRUCT = new Set(['a', 'button', 'input', 'textarea', 'select', 'form', 'section', 'header', 'footer', 'nav', 'main',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'label']);
  const vh = window.innerHeight;
  const out = [];
  const all = document.body.querySelectorAll('*');
  for (const el of all) {
    const tag = el.tagName.toLowerCase();
    if (SKIP.has(tag)) continue;
    if (tag !== 'svg' && el.closest('svg')) continue;
    let ownText = '';
    for (const n of el.childNodes) if (n.nodeType === 3) ownText += n.nodeValue;
    ownText = ownText.replace(/\s+/g, ' ').trim();
    const named = el.hasAttribute('data-framer-name');
    if (!(MEDIA.has(tag) || STRUCT.has(tag) || named || ownText)) continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) continue;
    if (r.bottom < 0 || r.top > vh) continue;
    if (el.checkVisibility && !el.checkVisibility({ checkVisibilityCSS: true })) continue;
    const cs = getComputedStyle(el);
    const style = {};
    for (const p of props) style[p] = cs[p];
    out.push({
      id: idOf(el),
      parent: el.parentElement ? idOf(el.parentElement) : null,
      tag,
      name: el.getAttribute('data-framer-name'),
      text: ownText.slice(0, 80),
      href: el.getAttribute('href'),
      x: Math.round(r.left),
      y: Math.round(r.top + window.scrollY),
      w: Math.round(r.width * 10) / 10,
      h: Math.round(r.height * 10) / 10,
      centerDist: Math.abs(r.top + r.height / 2 - vh / 2),
      style,
    });
  }
  return out;
}

/** Inventário do DOM inteiro: textos (visíveis/ocultos), imagens, backgrounds, SVGs, links, variantes responsivas. */
export function collectInventory() {
  const vis = (el) => (el.checkVisibility ? el.checkVisibility({ checkVisibilityCSS: true }) : !!(el.offsetWidth || el.offsetHeight));
  const SKIP = new Set(['script', 'style', 'noscript', 'template', 'meta', 'link', 'head', 'title']);
  const texts = [];
  const images = [];
  const backgrounds = [];
  const svgs = [];
  const links = [];
  const variantRoots = [];
  const hiddenClasses = {};
  for (const el of document.body.querySelectorAll('*')) {
    const tag = el.tagName.toLowerCase();
    if (SKIP.has(tag)) continue;
    const insideSvg = tag !== 'svg' && !!el.closest('svg');
    const visible = vis(el);
    const name = el.getAttribute('data-framer-name');
    if (!insideSvg) {
      let own = '';
      for (const n of el.childNodes) if (n.nodeType === 3) own += n.nodeValue;
      own = own.replace(/\s+/g, ' ').trim();
      if (own) texts.push({ text: own.slice(0, 140), tag, name, visible });
    }
    if (typeof el.className === 'string' && el.className.indexOf('hidden-') !== -1) {
      for (const c of el.className.split(/\s+/)) {
        if (c.startsWith('hidden-')) {
          const g = hiddenClasses[c] || (hiddenClasses[c] = { total: 0, visible: 0 });
          g.total++;
          if (visible) g.visible++;
        }
      }
    }
    if (name && /^(desktop|tablet|phone|mobile|laptop)/i.test(name)) {
      const r = el.getBoundingClientRect();
      variantRoots.push({ name, visible, w: Math.round(r.width), h: Math.round(r.height), classes: String(el.className).slice(0, 100) });
    }
    if (tag === 'img') {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      images.push({
        src: el.getAttribute('src'),
        currentSrc: el.currentSrc,
        srcset: (el.getAttribute('srcset') || '').slice(0, 400),
        sizes: el.getAttribute('sizes'),
        alt: el.getAttribute('alt'),
        naturalW: el.naturalWidth,
        naturalH: el.naturalHeight,
        w: Math.round(r.width),
        h: Math.round(r.height),
        pageY: Math.round(r.top + window.scrollY),
        objectFit: cs.objectFit,
        objectPosition: cs.objectPosition,
        radius: cs.borderRadius,
        loading: el.getAttribute('loading'),
        visible,
      });
    } else if (!insideSvg) {
      const cs = getComputedStyle(el);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') {
        const r = el.getBoundingClientRect();
        backgrounds.push({
          tag, name, visible,
          backgroundImage: cs.backgroundImage.slice(0, 300),
          size: cs.backgroundSize, position: cs.backgroundPosition,
          w: Math.round(r.width), h: Math.round(r.height), pageY: Math.round(r.top + window.scrollY),
        });
      }
    }
    if (tag === 'svg' && !(el.parentElement && el.parentElement.closest('svg'))) {
      const r = el.getBoundingClientRect();
      const markup = el.outerHTML;
      svgs.push({
        visible,
        w: Math.round(r.width), h: Math.round(r.height), pageY: Math.round(r.top + window.scrollY),
        parentName: el.parentElement ? el.parentElement.getAttribute('data-framer-name') : null,
        parentTag: el.parentElement ? el.parentElement.tagName.toLowerCase() : null,
        markupLength: markup.length,
        markup: markup.length <= 120000 ? markup : null,
      });
    }
    if (tag === 'a') {
      const r = el.getBoundingClientRect();
      links.push({
        href: el.getAttribute('href'),
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
        target: el.getAttribute('target'),
        visible,
        pageY: Math.round(r.top + window.scrollY),
      });
    }
  }
  return { texts, images, backgrounds, svgs, links, variantRoots, hiddenClasses };
}

/** Marca (data-audit-header) a raiz do header: logo "Grid®" -> ancestral fixed/sticky mais externo. */
export function markHeader() {
  const vis = (el) => el.checkVisibility({ checkVisibilityCSS: true });
  const old = document.querySelector('[data-audit-header]');
  if (old) old.removeAttribute('data-audit-header');
  const logos = Array.from(document.querySelectorAll('a')).filter((a) => /^\s*grid\s*[®©]?\s*$/i.test(a.textContent || '') && vis(a));
  if (!logos.length) return { found: false };
  logos.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  const logo = logos[0];
  let root = null;
  let el = logo;
  while (el && el !== document.body) {
    const p = getComputedStyle(el).position;
    if (p === 'fixed' || p === 'sticky') root = el;
    el = el.parentElement;
  }
  if (!root) {
    el = logo;
    while (el && el !== document.body) {
      const r = el.getBoundingClientRect();
      if (r.width >= window.innerWidth * 0.9 && r.height < window.innerHeight * 0.5) { root = el; break; }
      el = el.parentElement;
    }
  }
  if (!root) root = logo.parentElement || logo;
  root.setAttribute('data-audit-header', '1');
  return { found: true, mode: getComputedStyle(root).position, tag: root.tagName.toLowerCase(), name: root.getAttribute('data-framer-name') };
}

export function measureHeader() {
  const el = document.querySelector('[data-audit-header]');
  if (!el) return null;
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return {
    scrollY: Math.round(window.scrollY),
    top: Math.round(r.top),
    left: Math.round(r.left),
    width: Math.round(r.width),
    height: Math.round(r.height),
    position: cs.position,
    opacity: cs.opacity,
    transform: cs.transform,
    backgroundColor: cs.backgroundColor,
    backdropFilter: cs.backdropFilter,
    mixBlendMode: cs.mixBlendMode,
    color: cs.color,
    zIndex: cs.zIndex,
    inViewport: r.bottom > 0 && r.top < window.innerHeight,
  };
}

/** Marca links/botões visíveis (data-audit-hover=N) e devolve a lista. */
export function markHoverTargets(max) {
  const seen = new Set();
  const out = [];
  let n = 0;
  document.querySelectorAll('[data-audit-hover]').forEach((e) => e.removeAttribute('data-audit-hover'));
  for (const a of document.querySelectorAll('a[href], button, [role="button"]')) {
    if (!a.checkVisibility({ checkVisibilityCSS: true })) continue;
    const r = a.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) continue;
    const text = (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50);
    const key = (a.getAttribute('href') || '') + '|' + text;
    if (seen.has(key)) continue;
    seen.add(key);
    a.setAttribute('data-audit-hover', String(n));
    out.push({ id: n, tag: a.tagName.toLowerCase(), href: a.getAttribute('href'), text, pageY: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) });
    n++;
    if (n >= max) break;
  }
  return out;
}

export function snapshotHover(arg) {
  const root = document.querySelector('[data-audit-hover="' + arg.id + '"]');
  if (!root) return null;
  const els = [root].concat(Array.from(root.querySelectorAll('*')).slice(0, 60));
  return els.map((el, i) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const o = { i, tag: el.tagName.toLowerCase(), w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left), y: Math.round(r.top) };
    for (const p of arg.props) o[p] = cs[p];
    return o;
  });
}

/** Elementos grandes e sobrepostos (menu mobile aberto, modais). */
export function findOverlays() {
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' && cs.position !== 'absolute') continue;
    const r = el.getBoundingClientRect();
    if (r.width < window.innerWidth * 0.6 || r.height < window.innerHeight * 0.4) continue;
    if (!el.checkVisibility({ checkVisibilityCSS: true })) continue;
    const links = Array.from(el.querySelectorAll('a')).filter((a) => a.checkVisibility({ checkVisibilityCSS: true }))
      .slice(0, 12).map((a) => {
        const lc = getComputedStyle(a);
        return { text: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40), href: a.getAttribute('href'), fontSize: lc.fontSize, color: lc.color };
      });
    out.push({
      tag: el.tagName.toLowerCase(),
      name: el.getAttribute('data-framer-name'),
      position: cs.position,
      zIndex: cs.zIndex,
      opacity: cs.opacity,
      transform: cs.transform,
      backgroundColor: cs.backgroundColor,
      backdropFilter: cs.backdropFilter,
      x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height),
      links,
    });
    if (out.length >= 10) break;
  }
  return out;
}

export function readFormFields() {
  const vis = (el) => el.checkVisibility({ checkVisibilityCSS: true });
  const els = Array.from(document.querySelectorAll('form, input, textarea, select, button, [type="submit"]'));
  return els.map((el) => ({
    tag: el.tagName.toLowerCase(),
    type: el.getAttribute('type'),
    name: el.getAttribute('name'),
    id: el.id || null,
    placeholder: el.getAttribute('placeholder'),
    required: !!el.required,
    pattern: el.getAttribute('pattern'),
    minlength: el.getAttribute('minlength'),
    maxlength: el.getAttribute('maxlength'),
    autocomplete: el.getAttribute('autocomplete'),
    ariaLabel: el.getAttribute('aria-label'),
    label: el.labels && el.labels[0] ? el.labels[0].textContent.replace(/\s+/g, ' ').trim() : null,
    text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
    action: el.tagName === 'FORM' ? el.getAttribute('action') : (el.form ? el.form.getAttribute('action') : null),
    method: el.tagName === 'FORM' ? el.getAttribute('method') : null,
    visible: vis(el),
    valid: el.checkValidity ? el.checkValidity() : null,
    validationMessage: el.validationMessage || '',
  }));
}

/** Textos visíveis que parecem mensagens de estado (erro/sucesso/obrigatório). */
export function findStatusTexts() {
  const re = /(required|invalid|error|thank|success|sent|please|wrong|failed|try again|obrigat)/i;
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!el.checkVisibility || !el.checkVisibility({ checkVisibilityCSS: true })) continue;
    let own = '';
    for (const n of el.childNodes) if (n.nodeType === 3) own += n.nodeValue;
    own = own.replace(/\s+/g, ' ').trim();
    if (own && re.test(own)) {
      const cs = getComputedStyle(el);
      out.push({ text: own.slice(0, 120), tag: el.tagName.toLowerCase(), color: cs.color, fontSize: cs.fontSize, opacity: cs.opacity });
    }
  }
  return out.slice(0, 30);
}

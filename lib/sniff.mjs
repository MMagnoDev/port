// Identifica o formato real de um arquivo pelos primeiros bytes (e lê dimensões quando possível).
// Retorna { kind, ext, width, height }. kind 'unknown' ou 'html' = conteúdo inválido para asset.
const startsWith = (b, sig, off = 0) => sig.every((v, i) => b[off + i] === v);
const ascii = (b, s, e) => Buffer.from(b.subarray(s, e)).toString('latin1');

export function sniff(buf) {
  const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
  if (b.length < 4) return { kind: 'unknown', ext: null };

  if (startsWith(b, [0x89, 0x50, 0x4e, 0x47]) && b.length >= 24)
    return { kind: 'png', ext: 'png', width: b.readUInt32BE(16), height: b.readUInt32BE(20) };

  if (startsWith(b, [0xff, 0xd8, 0xff])) {
    let i = 2, width = null, height = null;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
      const len = b.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        height = b.readUInt16BE(i + 5); width = b.readUInt16BE(i + 7); break;
      }
      i += 2 + len;
    }
    return { kind: 'jpeg', ext: 'jpg', width, height };
  }

  if (ascii(b, 0, 3) === 'GIF') return { kind: 'gif', ext: 'gif', width: b.readUInt16LE(6), height: b.readUInt16LE(8) };

  if (ascii(b, 0, 4) === 'RIFF' && ascii(b, 8, 12) === 'WEBP') {
    const t = ascii(b, 12, 16);
    let width = null, height = null;
    if (t === 'VP8X') { width = 1 + b.readUIntLE(24, 3); height = 1 + b.readUIntLE(27, 3); }
    else if (t === 'VP8 ') { width = b.readUInt16LE(26) & 0x3fff; height = b.readUInt16LE(28) & 0x3fff; }
    else if (t === 'VP8L') { const v = b.readUInt32LE(21); width = (v & 0x3fff) + 1; height = ((v >> 14) & 0x3fff) + 1; }
    return { kind: 'webp', ext: 'webp', width, height };
  }

  if (ascii(b, 4, 8) === 'ftyp') {
    const brand = ascii(b, 8, 12);
    if (brand === 'avif' || brand === 'avis') return { kind: 'avif', ext: 'avif', width: null, height: null };
  }

  if (ascii(b, 0, 4) === 'wOF2') return { kind: 'woff2', ext: 'woff2' };
  if (ascii(b, 0, 4) === 'wOFF') return { kind: 'woff', ext: 'woff' };
  if (ascii(b, 0, 4) === 'OTTO') return { kind: 'otf', ext: 'otf' };
  if (startsWith(b, [0x00, 0x01, 0x00, 0x00]) || ascii(b, 0, 4) === 'true') return { kind: 'ttf', ext: 'ttf' };

  const head = ascii(b, 0, Math.min(b.length, 1024)).replace(/^\uFEFF/, '').trimStart().toLowerCase();
  if (head.startsWith('<!doctype html') || head.startsWith('<html') || head.startsWith('<head') || head.startsWith('<body')) return { kind: 'html', ext: null };
  if (head.startsWith('<svg') || (head.startsWith('<?xml') && head.includes('<svg'))) {
    const s = ascii(b, 0, Math.min(b.length, 2048));
    const vb = s.match(/viewBox="[\d.\-]+[ ,]+[\d.\-]+[ ,]+([\d.]+)[ ,]+([\d.]+)"/);
    return { kind: 'svg', ext: 'svg', width: vb ? Math.round(+vb[1]) : null, height: vb ? Math.round(+vb[2]) : null };
  }
  return { kind: 'unknown', ext: null };
}

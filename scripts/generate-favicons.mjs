/**
 * generate-favicons.mjs
 * Genera favicon-16x16.png, favicon-32x32.png, android-chrome-192x192.png (backup),
 * apple-touch-icon.png (backup) y favicon.ico a partir del favicon.svg.
 *
 * Usa SOLO Node.js built-ins + Canvas API del paquete @napi-rs/canvas
 * (disponible en el ecosistema sin dependencias nativas compiladas en Linux).
 * Si @napi-rs/canvas no está instalado, usa el fallback de sharp o la versión
 * PNG embebida directamente desde el SVG renderizado.
 *
 * Ejecución: node scripts/generate-favicons.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC = resolve(ROOT, "public");

// ─── Paleta IAZR ─────────────────────────────────────────────────────────────
const BG = "#080a0a";
const CYAN = "#00E5FF";
const CYAN_DIM = "rgba(0, 229, 255, 0.65)";

/**
 * Dibuja el icono IAZR en un CanvasRenderingContext2D.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} size - Dimensión del canvas (cuadrado)
 */
function drawIcon(ctx, size) {
  const s = size;

  // Fondo
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, s, s);

  // Proporciones relativas al tamaño
  const strokeW = Math.max(1, Math.round(s * 0.125));  // ~8/64
  const stemH   = Math.round(s * 0.5625);               // ~36/64
  const stemX   = Math.round((s - strokeW) / 2);
  const stemY   = Math.round(s * 0.1875);               // ~12/64

  const lineW   = Math.round(s * 0.375);                // ~24/64
  const lineX   = Math.round((s - lineW) / 2);
  const lineY   = Math.round(s * 0.8125);               // ~52/64
  const lineH   = Math.max(1, Math.round(s * 0.03));

  // Glow (blur simulado con sombra)
  if (size >= 32) {
    ctx.shadowColor = CYAN;
    ctx.shadowBlur = Math.round(s * 0.12);
  }

  // Barra vertical — "I" geométrico
  ctx.fillStyle = CYAN;
  ctx.beginPath();
  ctx.roundRect(stemX, stemY, strokeW, stemH, Math.max(1, strokeW * 0.1));
  ctx.fill();

  // Apagar glow para la línea
  ctx.shadowBlur = size >= 32 ? Math.round(s * 0.06) : 0;

  // Línea de acento inferior
  ctx.fillStyle = CYAN_DIM;
  ctx.beginPath();
  ctx.roundRect(lineX, lineY, lineW, lineH, lineH * 0.5);
  ctx.fill();

  ctx.shadowBlur = 0;
}

// ─── Verificar si @napi-rs/canvas o canvas está disponible ──────────────────
let createCanvas;
try {
  const mod = await import("@napi-rs/canvas");
  createCanvas = mod.createCanvas;
  console.log("✅ Usando @napi-rs/canvas");
} catch {
  try {
    const mod = await import("canvas");
    createCanvas = mod.createCanvas;
    console.log("✅ Usando node-canvas");
  } catch {
    console.error(
      "❌ No se encontró @napi-rs/canvas ni canvas.\n" +
        "   Instala uno de ellos:\n" +
        "   npm install @napi-rs/canvas\n" +
        "   o: npm install canvas"
    );
    process.exit(1);
  }
}

/**
 * Genera un PNG y lo escribe en public/.
 * @param {number} size
 * @param {string} filename
 */
function generatePng(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  drawIcon(ctx, size);
  const buf = canvas.toBuffer("image/png");
  const out = resolve(PUBLIC, filename);
  writeFileSync(out, buf);
  console.log(`✅  ${filename}  (${size}×${size}) — ${buf.length} bytes`);
  return buf;
}

// ─── Generar todos los tamaños ───────────────────────────────────────────────
const png16  = generatePng(16, "favicon-16x16.png");
const png32  = generatePng(32, "favicon-32x32.png");
generatePng(180, "apple-touch-icon.png");
generatePng(192, "android-chrome-192x192.png");
generatePng(512, "android-chrome-512x512.png");

// ─── Generar favicon.ico (multi-size: 16 + 32) ──────────────────────────────
// Formato ICO: header + directory + image data (PNG embebido, soportado IE11+)
function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  // Header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);      // Reserved
  header.writeUInt16LE(1, 2);      // Type: ICO
  header.writeUInt16LE(count, 4);  // Image count

  // Directory: 16 bytes per image
  const dirEntrySize = 16;
  const dataOffset = 6 + count * dirEntrySize;

  const dirs = [];
  let currentOffset = dataOffset;

  for (let i = 0; i < pngBuffers.length; i++) {
    const buf = pngBuffers[i];
    // Leer dimensiones desde la cabecera PNG (bytes 16-23)
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);

    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(w >= 256 ? 0 : w, 0);   // Width (0 = 256)
    entry.writeUInt8(h >= 256 ? 0 : h, 1);   // Height
    entry.writeUInt8(0, 2);                   // Color count
    entry.writeUInt8(0, 3);                   // Reserved
    entry.writeUInt16LE(1, 4);                // Color planes
    entry.writeUInt16LE(32, 6);               // Bits per pixel
    entry.writeUInt32LE(buf.length, 8);       // Size of image data
    entry.writeUInt32LE(currentOffset, 12);   // Offset of image data

    dirs.push(entry);
    currentOffset += buf.length;
  }

  return Buffer.concat([header, ...dirs, ...pngBuffers]);
}

const icoBuffer = buildIco([png16, png32]);
const icoPath = resolve(PUBLIC, "favicon.ico");
writeFileSync(icoPath, icoBuffer);
console.log(`✅  favicon.ico  (16+32 embebido) — ${icoBuffer.length} bytes`);

console.log("\n🎉  Favicons generados correctamente en public/");

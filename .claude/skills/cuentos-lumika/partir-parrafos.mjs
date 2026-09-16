// Parte en parrafos el texto de las escenas.
//
//   node partir-parrafos.mjs [--dry] [id-del-cuento ...]
//
// Por que existe: 269 de las 318 escenas del catalogo son una sola parrafada,
// algunas de 246 palabras, sin un solo salto de linea. Leyendolo en voz alta
// cada noche se nota: no hay donde respirar y se pierde el renglon.
//
// Y arregla de paso una queja que parecia otra cosa. La palabra magica ya
// estaba bien puesta —el 85% cierra su frase con punto— pero al estar enterrada
// en un bloque corrido, la pausa para que el nino toque cae en mitad de un
// muro de texto y se siente como una interrupcion. Aqui la frase de la palabra
// magica SIEMPRE cierra parrafo: la pausa pasa a tener sitio en la pagina.
//
// Reglas, por orden:
//   1. Cada linea de dialogo va sola. Es como se lee el dialogo en espanol.
//   2. La frase que contiene la palabra magica cierra su parrafo.
//   3. El resto se agrupa de dos en dos o tres frases, sin pasar de 45 palabras.
//
// No reescribe ni una palabra: solo decide donde va el blanco.
import { readFileSync, writeFileSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const DRY = process.argv.includes('--dry');
const PEDIDOS = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const DIR = 'stories';
const MAX_PALABRAS = 45;

/** Parte en frases respetando los puntos suspensivos y la raya de dialogo. */
function enFrases(parrafo) {
  const out = [];
  let buf = '';
  const chars = [...parrafo];
  for (let i = 0; i < chars.length; i++) {
    buf += chars[i];
    if (!'.!?…'.includes(chars[i])) continue;
    // "..." y "…" no cierran frase por si solos si siguen mas puntos
    while (i + 1 < chars.length && '.!?…'.includes(chars[i + 1])) buf += chars[++i];
    // Se traga el cierre de comillas o parentesis Y el punto que venga DETRAS.
    //
    // En espanol el punto va fuera de la comilla: «...algo?».  Sin esta segunda
    // vuelta, el cierre se quedaba en una frase y el punto arrancaba la
    // siguiente, y salia un `algo?" .` con el punto suelto.
    let movio = true;
    while (movio) {
      movio = false;
      while (i + 1 < chars.length && '»")]’”'.includes(chars[i + 1])) {
        buf += chars[++i];
        movio = true;
      }
      while (i + 1 < chars.length && '.!?…,;:'.includes(chars[i + 1])) {
        buf += chars[++i];
        movio = true;
      }
    }
    if (i + 1 < chars.length && chars[i + 1] === ' ') i++;
    out.push(buf.trim());
    buf = '';
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

const palabras = (s) => s.split(/\s+/).filter(Boolean).length;
const esDialogo = (f) => /^[—–-]\s/.test(f.trim());

function partir(texto, anclas) {
  // Si ya viene con parrafos, se respetan y se parten por dentro si hacen falta.
  const bloques = texto
    .split(/\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  const parrafos = [];
  for (const bloque of bloques) {
    const frases = enFrases(bloque);
    let cur = [];
    const cerrar = () => {
      if (cur.length) parrafos.push(cur.join(' '));
      cur = [];
    };
    for (const f of frases) {
      if (esDialogo(f)) {
        cerrar();
        parrafos.push(f);
        continue;
      }
      cur.push(f);
      const llevaAncla = anclas.some((a) => f.toLowerCase().includes(a.toLowerCase()));
      if (llevaAncla || cur.length >= 3 || palabras(cur.join(' ')) >= MAX_PALABRAS) cerrar();
    }
    cerrar();
  }
  return parrafos.join('\n\n');
}

const ficheros = readdirSync(DIR)
  .filter((f) => f.endsWith('.json'))
  .filter((f) => !PEDIDOS.length || PEDIDOS.some((id) => f.startsWith(id + '.')));

let tocados = 0;
let escenas = 0;
for (const nombre of ficheros.sort()) {
  const ruta = join(DIR, nombre);
  const d = JSON.parse(readFileSync(ruta, 'utf8'));
  let cambio = false;
  for (const s of d.scenes ?? []) {
    const anclas = (s.cues ?? []).map((c) => c.anchor).filter(Boolean);
    const nuevo = partir(s.text, anclas);
    if (nuevo !== s.text) {
      const antes = s.text.split('\n').filter((x) => x.trim()).length;
      const ahora = nuevo.split('\n\n').length;
      if (!DRY) s.text = nuevo;
      cambio = true;
      escenas++;
      if (PEDIDOS.length) console.log(`    ${s.id}: ${antes} -> ${ahora} parrafos`);
    }
  }
  if (cambio) {
    tocados++;
    if (!DRY) {
      d.version = (d.version ?? 1) + 1;
      writeFileSync(ruta, JSON.stringify(d, null, 2) + '\n', 'utf8');
    }
    console.log(`  ${nombre}${DRY ? '' : `  -> version ${d.version}`}`);
  }
}

console.log(`\n  ${escenas} escenas partidas en ${tocados} ficheros${DRY ? '  (simulacro)' : ''}`);
if (DRY) console.log('  Quita --dry para aplicarlo.');

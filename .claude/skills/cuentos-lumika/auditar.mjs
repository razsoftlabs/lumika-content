// Auditor mecánico de cuentos de Lumika.
//
//   node auditar.mjs                       todos los cuentos
//   node auditar.mjs stories/x.es.json     uno
//   node auditar.mjs --resumen             solo el recuento por tipo de fallo
//
// Comprueba lo que una máquina puede comprobar sin opinar: identificadores que
// no existen, anclas que no están en el texto, palabras mágicas repetidas,
// escenas mudas. Lo que NO comprueba —si el sonido cae en el momento adecuado,
// si el cuento se sostiene sin sonidos— es la parte humana de la fase 5.
//
// Estar en verde aquí no es aprobar. Es no tener nada roto.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';

const RAIZ = resolve(import.meta.dirname, '../../..');
const CUENTOS = join(RAIZ, 'stories');
const AUDIO = join(RAIZ, 'audio');

// La paleta sale de los ficheros que hay de verdad en disco, no de una lista
// escrita a mano: una lista se desincroniza y entonces el auditor aprueba
// identificadores que no suenan.
function idsDe(carpeta) {
  const d = join(AUDIO, carpeta);
  if (!existsSync(d)) return null;
  return new Set(readdirSync(d).filter((f) => f.endsWith('.mp3')).map((f) => f.slice(0, -4)));
}
const SFX = idsDe('sfx');
const MUSICA = idsDe('music');
const AMBIENTE = idsDe('ambient');

if (!SFX || !MUSICA || !AMBIENTE) {
  console.error(`  No encuentro el audio en ${AUDIO}. ¿Estás en el repo de contenido?`);
  process.exit(2);
}

// Acentos fuera y minúsculas: "Búho" y "buho" son la misma palabra al buscarla
// en el texto.
const plano = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Cuántas veces aparece `palabra` como palabra suelta en `texto`. */
function veces(texto, palabra) {
  const t = plano(texto);
  const p = plano(palabra);
  if (!p) return 0;
  // \b no sirve: con acentos ya normalizados vale, pero seguimos evitándolo por
  // si la palabra lleva guion o apóstrofo. Se mira el carácter de alrededor.
  let n = 0;
  let i = t.indexOf(p);
  while (i !== -1) {
    const antes = i === 0 ? ' ' : t[i - 1];
    const despues = i + p.length >= t.length ? ' ' : t[i + p.length];
    if (!/[a-z0-9]/.test(antes) && !/[a-z0-9]/.test(despues)) n++;
    i = t.indexOf(p, i + 1);
  }
  return n;
}

const GRAVEDAD = { roto: 0, grave: 1, aviso: 2 };

function auditar(ruta) {
  const fallos = [];
  const añade = (nivel, tipo, msg) => fallos.push({ nivel, tipo, msg });

  let d;
  try {
    d = JSON.parse(readFileSync(ruta, 'utf8'));
  } catch (e) {
    return [{ nivel: 'roto', tipo: 'json', msg: `no se puede leer: ${e.message}` }];
  }

  const escenas = d.scenes ?? [];
  if (!escenas.length) añade('roto', 'sin-escenas', 'el cuento no tiene escenas');

  const anclasUsadas = new Map(); // ancla -> primera escena donde salió
  let conAmbiente = 0;
  const ambientes = new Set();
  let cambiaMusica = 0;
  let totalAnclas = 0;

  escenas.forEach((s, i) => {
    const donde = s.id ?? `escena ${i + 1}`;
    const texto = s.text ?? '';

    // `null` es una decision: aqui se calla el ambiente a proposito (el espacio,
    // un sueno, un silencio). Distinto de no poner el campo, que es un olvido.
    if (s.ambient === null) conAmbiente++;
    if (s.ambient) {
      conAmbiente++;
      ambientes.add(s.ambient);
      if (!AMBIENTE.has(s.ambient))
        añade('roto', 'id-inexistente', `${donde}: ambiente "${s.ambient}" no existe`);
    }
    if (s.music) {
      cambiaMusica++;
      if (!MUSICA.has(s.music))
        añade('roto', 'id-inexistente', `${donde}: música "${s.music}" no existe`);
    }

    const enEstaEscena = new Set();
    for (const c of s.cues ?? []) {
      // --- cue automático ---
      if (c.trigger) {
        if (!['atSceneEnter', 'atSceneExit'].includes(c.trigger))
          añade('roto', 'cue-invalido', `${donde}: trigger "${c.trigger}" no existe`);
        if (!c.sfx) añade('roto', 'cue-invalido', `${donde}: cue automático sin sfx`);
        else if (!SFX.has(c.sfx))
          añade('roto', 'id-inexistente', `${donde}: efecto "${c.sfx}" no existe`);
        continue;
      }

      // --- cue de ancla ---
      if (!c.anchor) {
        añade('roto', 'cue-invalido', `${donde}: cue sin anchor ni trigger`);
        continue;
      }
      totalAnclas++;
      const a = c.anchor;

      if (!c.sfx && !c.ambient && !c.music)
        añade('roto', 'cue-invalido', `${donde}: "${a}" no hace nada (sin sfx, ambient ni music)`);
      if (c.sfx && !SFX.has(c.sfx))
        añade('roto', 'id-inexistente', `${donde}: efecto "${c.sfx}" no existe`);
      if (c.ambient && !AMBIENTE.has(c.ambient))
        añade('roto', 'id-inexistente', `${donde}: ambiente "${c.ambient}" no existe`);
      if (c.music && !MUSICA.has(c.music))
        añade('roto', 'id-inexistente', `${donde}: música "${c.music}" no existe`);

      // Regla del esquema: el ancla tiene que estar literalmente en el texto.
      const n = veces(texto, a);
      if (n === 0)
        añade('roto', 'ancla-ausente', `${donde}: "${a}" no aparece en el texto de la escena`);
      // Regla 2: el lector pinta TODAS las apariciones como tocables.
      else if (n > 1)
        añade(
          'aviso',
          'ancla-multiple',
          `${donde}: "${a}" aparece ${n} veces en la escena — el lector resalta la primera, pero el sonido cae ahi y casi nunca es donde querias`,
        );

      // Regla 1: una palabra mágica suena una vez en todo el cuento.
      const previa = anclasUsadas.get(plano(a));
      if (previa) añade('grave', 'ancla-repetida', `${donde}: "${a}" ya se usó en ${previa}`);
      else anclasUsadas.set(plano(a), donde);

      if (enEstaEscena.has(plano(a)))
        añade('grave', 'ancla-repetida', `${donde}: "${a}" dos veces en la misma escena`);
      enEstaEscena.add(plano(a));
    }
  });

  // --- reglas de cuento entero ---
  if (escenas.length && conAmbiente === 0)
    añade('grave', 'sin-ambiente', 'ninguna escena tiene ambiente: el cuento suena a nada');
  else if (conAmbiente < escenas.length)
    añade(
      'aviso',
      'sin-ambiente',
      `${escenas.length - conAmbiente} de ${escenas.length} escenas sin ambiente`,
    );

  if (escenas.length >= 4 && ambientes.size === 1 && !escenas.some((s) => s.ambient === null))
    añade('aviso', 'ambiente-plano', `${escenas.length} escenas y un solo ambiente: nunca cambia de sitio`);

  if (escenas.length >= 4 && cambiaMusica === 0)
    añade('aviso', 'sin-giro', 'la música no cambia en ningún momento (scene.music sin usar)');

  // Regla 3: una por escena, dos como mucho.
  const porEscena = escenas.length ? totalAnclas / escenas.length : 0;
  if (porEscena > 2.2)
    añade(
      'aviso',
      'demasiadas-anclas',
      `${totalAnclas} palabras mágicas en ${escenas.length} escenas (${porEscena.toFixed(1)} por escena)`,
    );
  const mudas = escenas.filter((s) => !(s.cues ?? []).some((c) => c.anchor)).length;
  if (mudas && escenas.length >= 3)
    añade('aviso', 'escena-muda', `${mudas} escena(s) sin ninguna palabra mágica`);

  return fallos;
}

// ── ejecución ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const soloResumen = args.includes('--resumen');
const objetivos = args.filter((a) => !a.startsWith('--'));

const rutas = objetivos.length
  ? objetivos.map((a) => (a.includes('/') || a.includes('\\') ? a : join(CUENTOS, a)))
  : readdirSync(CUENTOS)
      .filter((f) => f.endsWith('.json'))
      .map((f) => join(CUENTOS, f));

// Un cuento puede estar perfecto y no llegar a nadie: si su id no esta en
// index.json, el telefono no se entera de que existe. Paso de verdad con
// la-luciernaga-que-perdio-su-luz: diez escenas invisibles.
const enManifiesto = new Set(
  (JSON.parse(readFileSync(join(RAIZ, 'index.json'), 'utf8')).stories ?? []).map((e) => e.id),
);
const huerfanos = [
  ...new Set(
    readdirSync(CUENTOS)
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.(es|en|pt|fr)\.json$/, ''))
      .filter((id) => !enManifiesto.has(id)),
  ),
];
if (huerfanos.length) {
  console.log('');
  console.log('  SIN ENTRADA EN EL MANIFIESTO (no llegan a ningun telefono):');
  for (const h of huerfanos) console.log(`    ${h}`);
}

const total = { roto: 0, grave: 0, aviso: 0 };
const porTipo = new Map();
let limpios = 0;

for (const ruta of rutas) {
  const fallos = auditar(ruta).sort((a, b) => GRAVEDAD[a.nivel] - GRAVEDAD[b.nivel]);
  for (const f of fallos) {
    total[f.nivel]++;
    porTipo.set(f.tipo, (porTipo.get(f.tipo) ?? 0) + 1);
  }
  if (!fallos.length) {
    limpios++;
    continue;
  }
  if (soloResumen) continue;
  console.log(`\n  ${basename(ruta)}`);
  for (const f of fallos) {
    const marca = { roto: 'ROTO ', grave: 'GRAVE', aviso: 'aviso' }[f.nivel];
    console.log(`    ${marca}  ${f.msg}`);
  }
}

console.log(`\n  ${rutas.length} ficheros · ${limpios} sin nada que decir`);
console.log(`  roto ${total.roto}   grave ${total.grave}   aviso ${total.aviso}`);
if (porTipo.size) {
  console.log('\n  por tipo:');
  for (const [t, n] of [...porTipo].sort((a, b) => b[1] - a[1]))
    console.log(`    ${String(n).padStart(4)}  ${t}`);
}
console.log(
  '\n  Esto solo mira lo que una maquina puede mirar. Que un cuento salga limpio\n' +
    '  no quiere decir que este bien ambientado: eso es la parte humana de la fase 5.',
);

// Solo lo ROTO tumba el proceso: lo demas es criterio, no averia.
process.exit(total.roto > 0 ? 1 : 0);

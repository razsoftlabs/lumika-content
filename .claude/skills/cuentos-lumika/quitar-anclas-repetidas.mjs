// Deja cada palabra mágica sonando UNA vez por cuento.
//
//   node quitar-anclas-repetidas.mjs --dry     simulacro, no escribe
//   node quitar-anclas-repetidas.mjs           aplica y sube la version
//
// Regla 1 del skill: la primera vez que la luna hace tin es magia; la tercera es
// un boton. De cada ancla repetida se conserva UNA aparicion y se quitan las
// demas.
//
// CUAL se conserva no es tan obvio como "la primera". Conservando siempre la
// primera, 17 ficheros se quedaban con escenas enteras sin nada que tocar:
// escenas cuyas dos o tres anclas eran todas repeticiones de algo anterior. Una
// escena muda no esta rota, pero pasar de "en todas hay algo" a "en tres no hay
// nada" es un empeoramiento visible.
//
// Asi que: se conserva la primera, SALVO que eso deje una escena sin ninguna
// palabra magica y la escena anterior pueda ceder esa —porque le quedan otras.
// Sigue siendo mecanico: no se elige por contenido, se reparte para no dejar
// huecos.
//
// Esto es lo unico de la auditoria automatizable sin opinar. Las anclas que
// salen varias veces DENTRO de su escena, y las escenas con demasiadas,
// necesitan reescribir o decidir: eso va cuento a cuento.
//
// Cada idioma por separado: las anclas del .es y del .en son palabras distintas.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';

const DRY = process.argv.includes('--dry');
const RAIZ = resolve(import.meta.dirname, '../../..');
const CUENTOS = join(RAIZ, 'stories');
const MANIFIESTO = join(RAIZ, 'index.json');

const plano = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

const tocados = new Map();
let ficheros = 0;
let quitadasTotal = 0;
let rescatadas = 0;
const detalle = [];

for (const f of readdirSync(CUENTOS).filter((x) => x.endsWith('.json'))) {
  const ruta = join(CUENTOS, f);
  const d = JSON.parse(readFileSync(ruta, 'utf8'));
  const escenas = d.scenes ?? [];

  // ── 1. dónde aparece cada ancla ──
  const apariciones = new Map(); // ancla -> [índices de escena]
  escenas.forEach((s, i) => {
    for (const c of s.cues ?? []) {
      if (!c.anchor) continue;
      const k = plano(c.anchor);
      if (!apariciones.has(k)) apariciones.set(k, []);
      apariciones.get(k).push(i);
    }
  });

  // ── 2. de entrada, cada ancla se queda en su primera escena ──
  const donde = new Map(); // ancla -> índice de escena elegido
  for (const [k, idxs] of apariciones) donde.set(k, idxs[0]);

  // ── 3. rescatar escenas que se quedarían mudas ──
  const cuenta = () => {
    const n = escenas.map(() => 0);
    for (const i of donde.values()) n[i]++;
    return n;
  };
  let n = cuenta();
  escenas.forEach((s, i) => {
    if (n[i] > 0) return;
    const teniaAnclas = (s.cues ?? []).some((c) => c.anchor);
    if (!teniaAnclas) return; // ya estaba muda antes: no es cosa nuestra
    // Alguna de sus anclas repetidas, cuya escena elegida tenga de sobra.
    for (const c of s.cues ?? []) {
      if (!c.anchor) continue;
      const k = plano(c.anchor);
      const actual = donde.get(k);
      if (actual !== i && n[actual] > 1) {
        donde.set(k, i);
        n = cuenta();
        rescatadas++;
        detalle.push(`${basename(f)}  ${s.id}: "${c.anchor}" se queda aqui para no dejar la escena muda`);
        break;
      }
    }
  });

  // ── 4. aplicar ──
  let quitadas = 0;
  escenas.forEach((s, i) => {
    s.cues = (s.cues ?? []).filter((c) => {
      if (!c.anchor) return true; // los cues automáticos no se tocan
      const k = plano(c.anchor);
      if (donde.get(k) === i) {
        donde.set(k, -1); // ya colocada: cualquier otra copia en esta escena cae
        return true;
      }
      quitadas++;
      return false;
    });
  });

  if (!quitadas) continue;
  ficheros++;
  quitadasTotal += quitadas;
  tocados.set(d.id, (tocados.get(d.id) ?? 0) + quitadas);

  if (!DRY) {
    // Sin subir la version el telefono no se vuelve a bajar el fichero y la
    // correccion no llega a nadie.
    d.version = (d.version ?? 1) + 1;
    writeFileSync(ruta, JSON.stringify(d, null, 2) + '\n', 'utf8');
  }
}

// El manifiesto lleva su propia version por cuento, y es la que compara el
// telefono. Subir solo la del fichero no sirve de nada.
if (!DRY && tocados.size) {
  const man = JSON.parse(readFileSync(MANIFIESTO, 'utf8'));
  const lista = man.stories ?? man;
  let n = 0;
  for (const e of lista) {
    if (tocados.has(e.id)) {
      e.version = (e.version ?? 1) + 1;
      n++;
    }
  }
  writeFileSync(MANIFIESTO, JSON.stringify(man, null, 2) + '\n', 'utf8');
  console.log(`\n  manifiesto: ${n} entradas con la version subida`);
}

console.log(DRY ? '\n  (simulacro, no se ha escrito nada)' : '');
for (const l of detalle) console.log('    ' + l);
console.log(
  `\n  ${quitadasTotal} anclas repetidas quitadas en ${ficheros} ficheros (${tocados.size} cuentos)`,
);
console.log(`  ${rescatadas} conservadas fuera de su primera escena para no dejarla muda`);

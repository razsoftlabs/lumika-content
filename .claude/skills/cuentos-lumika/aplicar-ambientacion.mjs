// Aplica un plan de ambientación a los dos idiomas de un cuento.
//
//   node aplicar-ambientacion.mjs plan.json [--dry]
//
// El plan dice, por cuento y por escena, qué ambiente y qué música. Se aplica
// igual al .es y al .en porque son el mismo cuento: las mismas escenas pasan en
// los mismos sitios y giran en el mismo punto. Lo único que cambia entre
// idiomas son las palabras mágicas, y esas no se tocan aquí.
//
// Formato:
//
//   {
//     "el-zorro-y-la-luna": {
//       "ambient": { "s1": "forest_night", "s3": null, "s4": "meadow_night" },
//       "music":   { "s3": "strings_hopeful" }
//     }
//   }
//
// `null` es una decisión: aquí se calla el ambiente a propósito —el espacio, un
// sueño, un silencio— y el lector lo apaga con fundido. Distinto de no nombrar
// la escena, que la deja como estaba.
//
// Sube la version del fichero y la del manifiesto: sin eso el teléfono no se
// vuelve a bajar nada.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const DRY = process.argv.includes('--dry');
const planRuta = process.argv.find((a) => a.endsWith('.json') && !a.startsWith('--'));
if (!planRuta) {
  console.error('  uso: node aplicar-ambientacion.mjs plan.json [--dry]');
  process.exit(2);
}

const RAIZ = resolve(import.meta.dirname, '../../..');
const CUENTOS = join(RAIZ, 'stories');
const MANIFIESTO = join(RAIZ, 'index.json');
const plan = JSON.parse(readFileSync(planRuta, 'utf8'));

const tocados = new Set();
let cambios = 0;
const avisos = [];

for (const [id, spec] of Object.entries(plan)) {
  for (const loc of ['es', 'en']) {
    const ruta = join(CUENTOS, `${id}.${loc}.json`);
    if (!existsSync(ruta)) {
      avisos.push(`${id}.${loc}: no existe`);
      continue;
    }
    const d = JSON.parse(readFileSync(ruta, 'utf8'));
    const porId = new Map((d.scenes ?? []).map((s) => [s.id, s]));
    let n = 0;

    for (const [sid, amb] of Object.entries(spec.ambient ?? {})) {
      const s = porId.get(sid);
      if (!s) {
        avisos.push(`${id}.${loc}: no hay escena "${sid}"`);
        continue;
      }
      if (s.ambient !== amb) {
        s.ambient = amb;
        n++;
      }
    }
    for (const [sid, mus] of Object.entries(spec.music ?? {})) {
      const s = porId.get(sid);
      if (!s) {
        avisos.push(`${id}.${loc}: no hay escena "${sid}"`);
        continue;
      }
      if (s.music !== mus) {
        s.music = mus;
        n++;
      }
    }

    if (!n) continue;
    cambios += n;
    tocados.add(id);
    if (!DRY) {
      d.version = (d.version ?? 1) + 1;
      writeFileSync(ruta, JSON.stringify(d, null, 2) + '\n', 'utf8');
    }
    console.log(`    ${id}.${loc}  ${n} campos`);
  }
}

// `fondo` cambia la musica de todo el cuento en el manifiesto. Hace falta cuando
// el giro no es "aparece otra musica" sino "la de partida era la equivocada": un
// cuento que arranca con cuerdas esperanzadas no tiene donde crecer cuando por
// fin llega la esperanza.
const fondos = Object.entries(plan).filter(([, s]) => s.fondo);
if (!DRY && (tocados.size || fondos.length)) {
  const man = JSON.parse(readFileSync(MANIFIESTO, 'utf8'));
  const porId = new Map((man.stories ?? man).map((e) => [e.id, e]));
  for (const [id, s] of fondos) {
    const e = porId.get(id);
    if (!e) { avisos.push(`${id}: no esta en el manifiesto`); continue; }
    if (e.music !== s.fondo) { e.music = s.fondo; tocados.add(id); cambios++; }
  }
  for (const e of man.stories ?? man) if (tocados.has(e.id)) e.version = (e.version ?? 1) + 1;
  writeFileSync(MANIFIESTO, JSON.stringify(man, null, 2) + '\n', 'utf8');
}

console.log(DRY ? '\n  (simulacro)' : '');
for (const a of avisos) console.log(`    AVISO  ${a}`);
console.log(`\n  ${cambios} campos en ${tocados.size} cuentos`);

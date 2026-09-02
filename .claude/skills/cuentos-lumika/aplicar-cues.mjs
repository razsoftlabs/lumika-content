// Reemplaza las palabras mágicas de un cuento, escena por escena.
//
//   node aplicar-cues.mjs plan.json [--dry]
//
// A diferencia de aplicar-ambientacion.mjs, esto sí cambia por idioma: las
// palabras del .es y las del .en son distintas y no se corresponden una a una.
//
// Formato — la lista SUSTITUYE a las anclas de esa escena:
//
//   {
//     "el-tren-de-los-suenos": {
//       "es": {
//         "s1": [{ "anchor": "silbato", "sfx": "train_soft" }],
//         "s2": [{ "anchor": "bosque", "ambient": "forest_night" }],
//         "s3": []
//       },
//       "en": { ... }
//     }
//   }
//
// Una lista vacía deja la escena sin palabra mágica, que a veces es lo correcto:
// una escena de transición no tiene por qué tener nada que tocar.
//
// Los cues automáticos (trigger) NO se tocan: se conservan tal cual estaban y se
// añaden detrás de las anclas nuevas.
//
// Comprueba antes de escribir que cada ancla está en el texto de su escena, y
// que los identificadores de sonido existen. Si algo falla, no escribe nada de
// ese fichero: mejor no tocarlo que dejarlo a medias.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const DRY = process.argv.includes('--dry');
const planRuta = process.argv.find((a) => a.endsWith('.json') && !a.startsWith('--'));
if (!planRuta) {
  console.error('  uso: node aplicar-cues.mjs plan.json [--dry]');
  process.exit(2);
}

const RAIZ = resolve(import.meta.dirname, '../../..');
const CUENTOS = join(RAIZ, 'stories');
const MANIFIESTO = join(RAIZ, 'index.json');
const AUDIO = join(RAIZ, 'audio');
const ids = (c) =>
  new Set(
    readdirSync(join(AUDIO, c))
      .filter((f) => f.endsWith('.mp3'))
      .map((f) => f.slice(0, -4)),
  );
const SFX = ids('sfx');
const MUSICA = ids('music');
const AMBIENTE = ids('ambient');

const plano = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

function apareceEn(texto, palabra) {
  const t = plano(texto);
  const p = plano(palabra);
  let i = t.indexOf(p);
  while (i !== -1) {
    const a = i === 0 ? ' ' : t[i - 1];
    const b = i + p.length >= t.length ? ' ' : t[i + p.length];
    if (!/[a-z0-9]/.test(a) && !/[a-z0-9]/.test(b)) return true;
    i = t.indexOf(p, i + 1);
  }
  return false;
}

const plan = JSON.parse(readFileSync(planRuta, 'utf8'));
const tocados = new Set();
let quitadas = 0;
let puestas = 0;
const errores = [];

for (const [id, porIdioma] of Object.entries(plan)) {
  for (const [loc, porEscena] of Object.entries(porIdioma)) {
    const ruta = join(CUENTOS, `${id}.${loc}.json`);
    if (!existsSync(ruta)) {
      errores.push(`${id}.${loc}: no existe`);
      continue;
    }
    const d = JSON.parse(readFileSync(ruta, 'utf8'));
    const escenas = new Map((d.scenes ?? []).map((s) => [s.id, s]));
    const fallos = [];
    const usadas = new Set();

    // --- primero se valida TODO, luego se escribe ---
    for (const [sid, nuevas] of Object.entries(porEscena)) {
      const s = escenas.get(sid);
      if (!s) {
        fallos.push(`no hay escena "${sid}"`);
        continue;
      }
      for (const c of nuevas) {
        if (!c.anchor) fallos.push(`${sid}: cue sin anchor`);
        else if (!apareceEn(s.text ?? '', c.anchor))
          fallos.push(`${sid}: "${c.anchor}" no esta en el texto`);
        else if (usadas.has(plano(c.anchor)))
          fallos.push(`${sid}: "${c.anchor}" ya se usa en otra escena`);
        else usadas.add(plano(c.anchor));
        if (!c.sfx && !c.ambient && !c.music) fallos.push(`${sid}: "${c.anchor}" no hace nada`);
        if (c.sfx && !SFX.has(c.sfx)) fallos.push(`${sid}: efecto "${c.sfx}" no existe`);
        if (c.ambient && !AMBIENTE.has(c.ambient))
          fallos.push(`${sid}: ambiente "${c.ambient}" no existe`);
        if (c.music && !MUSICA.has(c.music)) fallos.push(`${sid}: musica "${c.music}" no existe`);
      }
    }
    if (fallos.length) {
      for (const f of fallos) errores.push(`${id}.${loc}: ${f}`);
      continue; // ese fichero no se toca
    }

    let antes = 0;
    for (const [sid, nuevas] of Object.entries(porEscena)) {
      const s = escenas.get(sid);
      const automaticos = (s.cues ?? []).filter((c) => c.trigger);
      antes += (s.cues ?? []).filter((c) => c.anchor).length;
      puestas += nuevas.length;
      s.cues = [...nuevas, ...automaticos];
    }
    quitadas += antes;
    tocados.add(id);
    if (!DRY) {
      d.version = (d.version ?? 1) + 1;
      writeFileSync(ruta, JSON.stringify(d, null, 2) + '\n', 'utf8');
    }
    console.log(`    ${id}.${loc}  ${antes} -> ${Object.values(porEscena).flat().length} anclas`);
  }
}

if (!DRY && tocados.size) {
  const man = JSON.parse(readFileSync(MANIFIESTO, 'utf8'));
  for (const e of man.stories ?? man) if (tocados.has(e.id)) e.version = (e.version ?? 1) + 1;
  writeFileSync(MANIFIESTO, JSON.stringify(man, null, 2) + '\n', 'utf8');
}

console.log(DRY ? '\n  (simulacro)' : '');
for (const e of errores) console.log(`    ERROR  ${e}`);
console.log(`\n  ${tocados.size} cuentos · ${quitadas} anclas fuera, ${puestas} dentro`);
if (errores.length) process.exit(1);

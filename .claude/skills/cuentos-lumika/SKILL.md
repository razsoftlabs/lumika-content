---
name: cuentos-lumika
description: Crear un cuento nuevo de Lumika, o revisar y mejorar uno existente, pasándolo por cinco fases — idea, estructura, escritura, ambientación sonora y auditoría final. Usar siempre que se vaya a escribir un cuento para Lumika, se quiera arreglar la ambientación de uno viejo, o se pregunte dónde poner la música, los ambientes o las palabras mágicas.
---

# Cuentos de Lumika

Un cuento de Lumika no es texto con sonidos encima. Es un texto **escrito para
que el sonido tenga dónde caer**: el adulto lee en voz alta y el niño toca las
palabras resaltadas. Si los sonidos se pueden quitar sin que el cuento pierda
nada, el cuento está mal ambientado.

Antes de escribir o revisar nada, lee [paleta-sonora.md](paleta-sonora.md). Los
identificadores son vocabularios cerrados: uno inventado no suena y **no da
ningún error**.

---

## Las cinco reglas

Salen de auditar los 51 cuentos que ya existen. Cada una arregla un fallo real,
medido.

### 1. Una palabra mágica suena UNA vez en todo el cuento

Hoy hay **93 anclas repetidas** repartidas por 27 de los 51 cuentos: `viento`
cuatro veces en uno, `trueno` cuatro en otro, `luna` tres. La cuarta vez que la
luna hace *tin*, el niño ya no está descubriendo nada: está pulsando un botón.

La primera vez es magia. La tercera es un juguete roto.

### 2. La palabra mágica aparece una vez en su escena

El lector resalta **la primera** aparición y deja el resto como texto normal
(arreglado el 26-ago-2026; antes las resaltaba todas y salían cuatro palabras
subrayadas seguidas haciendo lo mismo).

Así que ya no se rompe nada, pero sigue estando mal escrito: si la palabra sale
cuatro veces, el sonido cae en la primera, que casi nunca es donde querías. Al
escribir, coloca la palabra **una sola vez y en el sitio de la frase donde el
sonido debe caer** — normalmente al final, para que el silencio la deje sonar.

### 3. Una palabra mágica por escena, dos como mucho

La media actual es 1,9 por escena y hay cuentos con **30**. Treinta sonidos en
seis páginas no es un cuento, es un teclado.

La palabra mágica marca **el momento** de la escena: lo que pasa, no lo que se
ve. `puerta` cuando la puerta se abre, no cada vez que se nombre una puerta.

### 4. Toda escena tiene un sitio, y el sitio cambia cuando el cuento se mueve

**11 cuentos no tienen un solo ambiente.** Suenan a nada por debajo.

Cada escena lleva `ambient`. Cuando el cuento cambia de lugar, cambia el
ambiente — es lo que hace que el niño *llegue* a un sitio en vez de que le
cuenten que llegó. Si dos escenas seguidas pasan en el mismo sitio, repite el
mismo id: el bucle continúa sin costura.

### 5. La música cambia cuando cambia el sentimiento

Antes de la revision del 2-sep-2026, **ningun cuento usaba `scene.music`**: la
musica arrancaba y no se enteraba de nada. Ahora los 51 tienen su giro.

Un cuento con giro necesita dos músicas: la de antes y la de después. El cambio
va en la escena donde el personaje deja de tener miedo, o encuentra lo que
buscaba, o entiende algo. No en la mitad por reloj.

---

## Recursos que casi nadie usa y valen mucho

| Escritura | Qué consigue |
|---|---|
| `cue.ambient` en una palabra | El sitio cambia **bajo el dedo del niño**. Toca `lluvia` y empieza a llover. Es el efecto más potente de la app y solo lo usan 2 cuentos. |
| `cue.music` en una palabra | El tono emocional gira en el instante del toque. Reservado para EL momento del cuento, una vez. |
| `cue.delayMs` | El sonido llega un poco después del toque. Para lo que se acerca: pasos que suenan a lo lejos, un trueno tras el relámpago. |
| `trigger: atSceneEnter` | Suena solo al pasar la página, sin tocar nada. Para lo inevitable: la puerta que se cierra detrás. |
| `trigger: atSceneExit` | Suena al salir de la página. Para dejar algo colgando. |

---

## Las cinco fases

Ejecútalas **en orden**. Cada una recibe lo de la anterior y puede devolverla
para atrás. No saltes a escribir.

### Fase 1 — Idea

Sale de aquí un párrafo, no un cuento.

- **Quién**: un protagonista con una carencia concreta (no "un zorro curioso"
  sino "un zorro que nunca ha salido de su cueva de noche").
- **Qué quiere** y **qué se lo impide**.
- **Dónde**, y si el cuento **se mueve** de sitio. Un cuento que se mueve suena
  mejor: da cambios de ambiente naturales.
- **Qué aprende o suelta al final.**
- **Edad** (3-5, 5-7, 6-8) y **duración** (3, 5, 8, 12 min).

### Fase 2 — Estructura (revisor de idea)

Coge la idea y decide **cómo tiene que ser el cuento**. Aquí es donde se gana o
se pierde la ambientación, antes de escribir una sola frase.

- Reparte en **escenas**: 4-6 para 3-5 min, 7-10 para 8-12 min.
- Para cada escena decide **el sitio** y por tanto su `ambient`.
- Marca **dónde está el giro** — la escena en la que cambia el sentimiento. Ahí
  irá el `scene.music`.
- Elige **la música de antes** y **la de después**.
- Apunta **un momento sonoro por escena**: qué pasa que se pueda oír. Si una
  escena no tiene ninguno, esa escena no está pasando nada y hay que
  reescribirla o fundirla con otra.
- Si algún momento es lo bastante grande, márcalo para `cue.ambient` (el sitio
  cambia al tocarlo) en vez de un simple efecto.

**Devuelve a fase 1 si**: el cuento no se mueve de sitio ni cambia de ánimo. No
hay nada que ambientar.

### Fase 3 — Escritura

Escribe el texto de cada escena **sabiendo dónde va el sonido**.

- Frases para decirlas en voz alta. Que el adulto pueda respirar.
- La palabra que va a ser mágica **aparece una sola vez en su escena**, y
  colocada en el sitio de la frase donde el sonido cae bien: normalmente al
  final, para que el silencio que sigue lo deje sonar.
- Nada de listas ni descripciones largas: pasan cosas.
- Diálogo con raya (—), como se lee en español.
- Español neutro. Nada de *vos*, *vosotros*, *tenés*, *coge* con doble sentido.
- Longitud orientativa: 3 min ≈ 400 palabras, 5 min ≈ 700, 8 min ≈ 1100,
  12 min ≈ 1600.

**Devuelve a fase 2 si**: al escribir, una escena resulta no tener momento
sonoro. Es un problema de estructura, no de redacción.

### Fase 4 — Ambientación (revisor de sonido)

Ahora, y no antes, se colocan música, ambientes y palabras mágicas.

Para cada escena:

1. `ambient` — el sitio. Repite el id si no se ha movido.
2. `music` — **solo** en la escena del giro.
3. Las palabras mágicas:
   - ¿Está la palabra en el texto de esa escena, **exactamente una vez**?
   - ¿No se ha usado ya en otra escena del cuento?
   - ¿El sonido que elijo existe en la paleta?
   - ¿Marca un momento, o es decoración?
4. ¿Hay algún momento que merezca `cue.ambient` o `delayMs`?

Y para el cuento entero: la música de fondo del manifiesto.

**Devuelve a fase 3 si**: hay que forzar el texto para meter una palabra mágica.
Se cambia el texto, no se mete a la fuerza.

### Fase 5 — Auditoría

Dos partes: la mecánica y la humana.

**La mecánica** la hacen los scripts, que no se cansan ni se les olvida:

```bash
node .claude/skills/cuentos-lumika/auditar.mjs stories/mi-cuento.es.json
```

Y para arreglar en lote lo que no necesita criterio:

```bash
node .claude/skills/cuentos-lumika/quitar-anclas-repetidas.mjs --dry
node .claude/skills/cuentos-lumika/aplicar-ambientacion.mjs plan.json --dry
```

El segundo toma un plan de ambientacion —que ambiente y que musica por escena—
y lo aplica a los dos idiomas a la vez, subiendo las versiones. Los dos admiten
`--dry` y conviene usarlo siempre antes.

Comprueba identificadores inexistentes, anclas que no están en el texto, anclas
repetidas, anclas que aparecen varias veces en su escena, escenas sin ambiente y
cuentos sin giro de música.

**La humana** la haces tú, leyendo el cuento en voz alta de principio a fin y
preguntando:

- Si quito todos los sonidos, ¿el cuento sigue en pie? (debe seguir)
- Si quito el texto y dejo solo los sonidos, ¿se adivina lo que pasa? (debería)
- ¿Hay alguna escena en la que el niño no tenga nada que tocar? ¿Está bien que
  no lo tenga, o esa escena está muerta?
- ¿El cambio de música cae donde cambia lo que uno siente?
- ¿Alguna palabra mágica está ahí solo porque el sonido existía?

**El script en verde no es aprobar.** Solo dice que no hay nada roto.

---

## El JSON

Un fichero por cuento y por idioma: `stories/<id>.<locale>.json`.

```json
{
  "id": "el-zorro-y-la-luna",
  "schemaVersion": 1,
  "locale": "es",
  "version": 5,
  "title": "El zorro y la luna",
  "summary": "Una frase. Lo que pasa, sin destripar el final.",
  "scenes": [
    {
      "id": "s1",
      "text": "...",
      "ambient": "forest_night",
      "cues": [{ "anchor": "búho", "sfx": "owl_hoot" }]
    },
    {
      "id": "s2",
      "text": "...",
      "ambient": "meadow_night",
      "music": "strings_hopeful",
      "cues": [
        { "anchor": "lluvia", "ambient": "rain" },
        { "trigger": "atSceneEnter", "sfx": "wind_soft" }
      ]
    }
  ]
}
```

**Sube siempre `version`** al editar un cuento que ya está publicado. El teléfono
solo se vuelve a bajar el fichero si el número del manifiesto es mayor que el
que tiene guardado. Sin subirlo, tu corrección no llega a nadie.

Al publicar, la entrada del manifiesto **debe llevar `locales`**. Una entrada sin
ese campo dejó la biblioteca vacía en todos los teléfonos una vez.

---

## Revisar un cuento que ya existe

Mismo recorrido, empezando por la fase 2: lee el cuento, reconstruye su
estructura, y comprueba contra las cinco reglas.

Lo que casi siempre hay que arreglar, por frecuencia medida:

1. Anclas repetidas — quita todas menos la primera, o cambia el texto para que
   la palabra solo esté donde quieres el sonido.
2. Demasiadas palabras mágicas — quédate con **el momento** de cada escena.
3. Falta el ambiente — añádelo escena por escena.
4. La música no cambia nunca — busca el giro y ponle su `scene.music`.
5. Ninguna palabra cambia el sitio — busca el momento en que el cuento se mueve
   y conviértelo en `cue.ambient`.

Y **sube `version`**.

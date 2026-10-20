---
name: cuentos-lumika
description: Crear un cuento nuevo de Lumika, o reescribir uno existente. El cuento se escribe PRIMERO y en libertad, sin mirar la paleta de sonidos; las palabras mágicas, la música y los ambientes se eligen al final, a partir del texto terminado. Usar siempre que se vaya a escribir o reescribir un cuento para Lumika, se quiera arreglar la ambientación de uno viejo, o se pregunte dónde poner la música, los ambientes o las palabras mágicas.
---

# Cuentos de Lumika

**Un cuento de Lumika es, antes que nada, un buen cuento.** El sonido llega
después y se adapta al cuento. Nunca al revés.

Si quitas todos los sonidos, el cuento tiene que seguir en pie entero. Si un
elemento del cuento está ahí porque tiene sonido, el cuento está mal escrito.

---

## Por qué esto va primero

Un niño de cuatro años, después de varias semanas de cuentos, le preguntó a su
padre: **"¿por qué siempre sale un búho?"**.

Tenía razón. Medido sobre los 50 cuentos del catálogo en octubre de 2026:

| | aparece en | es palabra mágica en |
|---|---|---|
| búho | **20 cuentos (40%)** | 13 |
| estrella | 39 (78%) | 10 |
| viento | 38 (76%) | 17 |
| luna | 34 (68%) | 16 |
| rana | 14 | **10** |
| luciérnaga | 7 (14%) | 0 — no tiene sonido |
| grillo | 3 (6%) | 0 — no tiene sonido |

Los elementos que *suenan* se metían en los cuentos; los que no, casi no
aparecían. La rana sale en 14 cuentos y en 10 es palabra mágica.

La causa estaba escrita en este mismo skill. Mandaba leer la paleta de sonidos
**antes de escribir**, apuntar "un momento sonoro por escena", y devolver al
diseño cualquier escena que no tuviera uno. Escribiendo así, cuando hacía falta
un animal de noche se ponía un búho porque el búho suena. Cincuenta veces.

Por eso ahora el orden es el contrario.

---

## Las cinco fases

En orden. **La paleta no se abre hasta la fase 4.**

### Fase 1 — Idea

Sale de aquí un párrafo, no un cuento.

- **Quién**: un protagonista con una carencia concreta (no "un zorro curioso"
  sino "un zorro que nunca ha salido de su cueva de noche").
- **Qué quiere** y **qué se lo impide**.
- **Dónde**, y si el cuento **se mueve** de sitio.
- **Qué aprende, qué suelta o qué cambia al final.**
- **Edad** (3-5, 5-7, 6-8) y **duración** (3, 5, 8, 12 min).

Ningún elemento entra porque "luego suena bien". Los personajes secundarios se
eligen por lo que necesita la historia. Si el cuento pide un tejón, es un tejón.

### Fase 2 — Estructura

- Reparte en **escenas**: 4-6 para 3-5 min, 7-10 para 8-12 min.
- Cada escena tiene un **sitio**. Si el cuento cambia de sitio, cambia de escena.
- Marca **el giro**: la escena donde cambia lo que el personaje siente. Ahí
  cambiará la música, pero eso se decide en la fase 4.
- Cada escena tiene que **pasar algo**. Esto es cuestión de historia, no de
  sonido: una escena donde no pasa nada sobra aunque tenga un búho.

### Fase 3 — Escritura, en libertad

Escribe el cuento como lo escribirías para leerlo en voz alta a un niño, **sin
pensar en qué palabras van a sonar**.

- Frases para decirlas en voz alta. Que el adulto pueda respirar.
- **Párrafos cortos: de una a tres frases.** Cada línea de diálogo, sola. Nada
  de bloques de doscientas palabras: leyendo cada noche, en un bloque corrido se
  pierde el renglón y no hay donde respirar.
- Pasan cosas. Nada de listas ni descripciones largas.
- Diálogo con raya (—), como se lee en español. **No comillas rectas.**
- Español neutro. Nada de *vos*, *vosotros*, *tenés*, *coge* con doble sentido.
- Longitud orientativa: 3 min ≈ 400 palabras, 5 min ≈ 700, 8 min ≈ 1100,
  12 min ≈ 1600.

**No abras la paleta.** Si te descubres pensando "aquí podría poner algo que
suene", para: estás escribiendo para la paleta.

### Fase 4 — Ambientación: el sonido se adapta al texto

Ahora sí: abre [paleta-sonora.md](paleta-sonora.md). Los identificadores son
vocabularios cerrados; uno inventado no suena y **no da ningún error**.

Lee el cuento terminado y, escena por escena:

1. **`ambient`** — el sitio de la escena. Repite el id si no se ha movido. Si
   ningún ambiente de la paleta se parece al sitio, elige el más cercano por
   sensación.
2. **`music`** — solo en la escena del giro. Y la del cuento entero, para el
   manifiesto.
3. **Palabras mágicas** — busca **en el texto que ya existe** las palabras que
   marcan el momento de la escena y que tienen un sonido en la paleta:
   - ¿Está la palabra en esa escena, **exactamente una vez**?
   - ¿No se ha usado ya en otra escena del cuento?
   - ¿Marca **el momento**, o es decoración?
   - ¿Cae al final de su frase, donde el silencio la deja sonar?

**Si ninguna palabra de la escena tiene un sonido que encaje, esa escena no
tiene palabra mágica. Está bien.** El ambiente sigue sonando debajo. Una escena
sin nada que tocar es mucho mejor que un búho metido a la fuerza.

**Prohibido** cambiar el texto para que quepa un sonido: no se añaden animales,
objetos ni fenómenos. Lo único permitido es mover una palabra que ya está para
que cierre su frase, o elegir entre dos palabras que ya están.

### Fase 5 — Auditoría

**La mecánica**:

```bash
node .claude/skills/cuentos-lumika/auditar.mjs stories/mi-cuento.es.json
```

Comprueba identificadores inexistentes, anclas que no están en el texto, anclas
repetidas, anclas que aparecen varias veces en su escena, escenas sin ambiente,
cuentos sin giro de música y bloques de texto demasiado largos.

**La humana**, leyendo el cuento en voz alta de principio a fin:

- Si quito todos los sonidos, ¿el cuento sigue en pie? (tiene que seguir)
- ¿Hay algún personaje, animal u objeto que esté ahí **solo** porque suena?
  Si lo hay, se quita y se reescribe la escena.
- ¿Se lee bien en voz alta? ¿Hay sitio para respirar?
- ¿El cambio de música cae donde cambia lo que uno siente?

**El script en verde no es aprobar.** Solo dice que no hay nada roto.

---

## Reglas del sonido

### 1. Una palabra mágica suena UNA vez en todo el cuento

La primera vez es magia. La tercera es un juguete roto.

### 2. La palabra mágica aparece una vez en su escena

El lector resalta la primera aparición. Si la palabra sale cuatro veces, el
sonido cae en la primera, que casi nunca es donde querías.

### 3. Cero, una o dos palabras mágicas por escena

**Cero es una respuesta válida.** Treinta sonidos en seis páginas no es un
cuento, es un teclado.

### 4. Toda escena tiene un ambiente

Cuando el cuento cambia de lugar, cambia el ambiente — es lo que hace que el
niño *llegue* a un sitio en vez de que le cuenten que llegó.

### 5. La música cambia cuando cambia el sentimiento

En la escena donde el personaje deja de tener miedo, encuentra lo que buscaba o
entiende algo. No en la mitad por reloj.

---

## Recursos que valen mucho (cuando el texto los pide)

| Escritura | Qué consigue |
|---|---|
| `cue.ambient` en una palabra | El sitio cambia **bajo el dedo del niño**. Toca `lluvia` y empieza a llover. |
| `cue.music` en una palabra | El tono emocional gira en el instante del toque. Para EL momento del cuento, una vez. |
| `cue.delayMs` | El sonido llega un poco después del toque. Un trueno tras el relámpago. |
| `trigger: atSceneEnter` | Suena solo al pasar la página. Para lo inevitable. |
| `trigger: atSceneExit` | Suena al salir de la página. Para dejar algo colgando. |

Solo si el texto ya tiene ese momento. No se escribe un relámpago para poder
usar `delayMs`.

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
      "text": "Primer párrafo.\n\nSegundo párrafo.\n\n—Una línea de diálogo.",
      "ambient": "forest_night",
      "cues": []
    }
  ]
}
```

Los párrafos se separan con **una línea en blanco** (`\n\n`).

**Sube siempre `version`** al editar un cuento publicado. El teléfono solo se
vuelve a bajar el fichero si el número del manifiesto es mayor que el que tiene
guardado.

Al publicar, la entrada del manifiesto **debe llevar `locales`**. Una entrada
sin ese campo dejó la biblioteca vacía en todos los teléfonos una vez.

---

## Reescribir un cuento que ya existe

**Se conserva**: el `id`, el protagonista, la premisa y lo que sale en la
portada. La portada es una ilustración de la historia; si la historia cambia
tanto que la portada ya no la cuenta, la portada miente.

**Se reescribe**: todo lo demás. El texto se escribe de nuevo desde la fase 3,
sin mirar el texto viejo frase a frase ni la paleta. Se quitan los elementos
que estaban ahí solo porque sonaban — el búho de relleno, la rana que no pinta
nada, la estrella que hace *tin*.

Después, fase 4 desde cero sobre el texto nuevo. Y **sube `version`**.

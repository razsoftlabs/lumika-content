# La paleta sonora de Lumika

Vocabularios **cerrados**. Un identificador que no esté aquí no suena: el fichero
no existe y la app se queda muda sin dar ningún error.

---

## Ambientes (11) — el lecho sonoro del sitio

Va en `scene.ambient`. Es un bucle largo y continuo, se queda sonando **entre
páginas** hasta que otra escena lo cambia. Es *dónde* está el cuento.

| id | Qué es | Cuándo |
|---|---|---|
| `forest_birds` | Bosque de día, pájaros | Bosque, campo con árboles, de día |
| `forest_night` | Bosque de noche, grillos | Bosque nocturno, la primera salida de casa |
| `meadow_day` | Prado abierto, insectos | Campo, pradera, camino al sol |
| `meadow_night` | Prado nocturno, grillos lejanos | El final tranquilo, tumbarse a mirar el cielo |
| `ocean_waves` | Olas rompiendo | Playa, orilla, barco |
| `underwater` | Bajo el agua, burbujas | Sumergirse, el fondo del mar |
| `stream_water` | Arroyo corriendo | Río, riachuelo, cruzar el agua |
| `rain` | Lluvia sobre tejado | Tormenta, quedarse dentro, mirar por la ventana |
| `snow_wind` | Viento con nieve | Montaña, invierno, ventisca |
| `fireplace` | Chimenea crepitando | Refugio, casa cálida, después del frío |
| `city_soft` | Ciudad lejana | Casa en la ciudad, el punto de partida |

**No hay ambiente de "habitación", "cueva", "espacio" ni "castillo".** Si el
cuento pasa ahí, elige el más cercano por sensación (`city_soft` para una
habitación de ciudad, `fireplace` para una cueva con fuego) o deja la escena sin
ambiente y que mande la música.

---

## Música (16) — el tono emocional

Va en el manifiesto (`music`, para todo el cuento) y opcionalmente en
`scene.music` para **cambiarla en un giro**. Suena por debajo de la voz.

| id | Carácter | Para |
|---|---|---|
| `lullaby_piano` | Nana, piano lento | Dormir, el final que baja revoluciones |
| `gentle_piano` | Piano suave, neutro | Cuentos calmados de cualquier tema |
| `music_box` | Caja de música | Magia pequeña, juguetes, lo diminuto |
| `celesta_snow` | Celesta cristalina | Nieve, hielo, frío bonito |
| `harp_canon` | Arpa serena | Clásico, princesas, cuentos con moraleja |
| `harp_dreams` | Arpa soñadora | Sueños, nubes, volar |
| `marimba_playful` | Marimba juguetona | Divertido, animales torpes, risas |
| `playful_flute` | Flauta traviesa | Aventura ligera, curiosidad |
| `guitar_clear` | Guitarra limpia | Amistad, día luminoso |
| `guitar_warm` | Guitarra cálida | Familia, hogar, abrazos |
| `guitar_night` | Guitarra nocturna | Noche tranquila, confidencias |
| `guitar_tales` | Guitarra narrativa | Contar una historia, viaje |
| `guitar_windswept` | Guitarra con aire | Campo abierto, viento, camino |
| `strings_hopeful` | Cuerdas esperanzadas | Superar un miedo, el momento en que sale bien |
| `adventure_soft` | Aventura contenida | Explorar sin peligro real |
| `space_dream` | Espacial, flotante | Espacio, cohetes, lo inmenso |

`intro_lumika` es la firma sonora de la app. **No se usa en cuentos.**

---

## Efectos (39) — el golpe puntual

Va en `cue.sfx`. Dura de medio segundo a tres. Es *lo que pasa*, no dónde.

**Animales**
`bark` (perro) · `cat_meow` · `horse_neigh` · `horse_gallop` · `owl_hoot` ·
`frog_croak` · `bee_buzz` · `whale_song` · `seagulls` · `wing_flap` (aleteo) ·
`dino_step` (pisada pesada)

**Cuerpo y voz**
`giggle` (risa de niño) · `whisper` · `sneeze_cute` · `snore_soft` ·
`breathe_in` (respiración honda) · `heartbeat_calm` (latido)

**Movimiento**
`footsteps` · `run_fast` · `jump_hop` · `whoosh` (algo que pasa rápido) ·
`rocket` · `train_soft`

**Naturaleza y clima**
`thunder` · `wind_soft` · `wind_high` · `water_splash` · `bubbles` ·
`leaves_rustle` · `campfire`

**Objetos**
`door_open` · `page_turn` · `bell_soft` (campanilla) · `hammer_tap` ·
`crunch` (algo que se rompe o se muerde) · `thud` (golpe sordo)

**Magia**
`magic_shimmer` (destello largo) · `sparkle` (chispa corta) · `twinkle` (brillo
tintineante)

---

## Lo que el esquema permite y casi nadie usa

| Capacidad | Cómo se escribe | Uso hoy |
|---|---|---|
| Ambiente por escena | `scene.ambient` | 40 de 51 |
| Cambiar de ambiente al avanzar | varios `scene.ambient` distintos | 35 de 51 |
| **Cambiar la música en un giro** | `scene.music` | **0 de 51** |
| **Palabra que cambia el ambiente** | `cue.ambient` | **2 de 51** |
| **Palabra que cambia la música** | `cue.music` | **1 de 51** |
| Palabra con retardo | `cue.delayMs` | poco |
| **Sonido automático al pasar página** | `cue.trigger: atSceneEnter` / `atSceneExit` | **0 de 51** |

Las cuatro en negrita son las que hacen que un cuento suene vivo en vez de
plano. Un cuento revisado debería usar al menos una.

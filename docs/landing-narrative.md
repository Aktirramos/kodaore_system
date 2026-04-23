# Landing Kodaore — Guion narrativo (Fase 0 / §5 del brief)

Fecha: 2026-04-23
Autor provisional: asistente (pendiente de revisión editorial del cliente).
Este documento define **qué dice la landing**, en qué orden y en qué tono. No define cómo se ve. Eso es Fase 1 (`docs/landing-direction.md`).

---

## Principios de redacción

1. **Una idea por sección, una frase por idea.** El silencio tipográfico es parte de la narrativa.
2. **Euskera y castellano son iguales en jerarquía.** No hay locale "secundario". El copy se piensa en los dos a la vez, no se traduce desde uno.
3. **Ni marketing ni frases de brochure.** Nada de "nuestra pasión", "apostamos por", "la experiencia definitiva". Lenguaje del club, el que usan monitores y familias.
4. **Respeto a la disciplina sobre la emoción fácil.** Un judoka debe leer la landing y sentir que quien la escribió sabe qué está diciendo. Si hay duda entre una frase bonita y una correcta, gana la correcta.
5. **Sin japonés.** Sólo "haraigoshi" aparece como nombre del movimiento que se muestra. Las fases se nombran en euskera y castellano con lenguaje natural del club.
6. **Informar antes que persuadir.** La landing responde a preguntas concretas de familias: dónde entrenamos, qué enseñamos, cuándo, quién, cómo me inscribo. Todo lo demás se sostiene sobre eso.

---

## Arco completo (9 secciones)

| # | Sección | Propósito narrativo | Función |
|---|---|---|---|
| 1 | **Apertura** | Situar: quiénes somos, una frase. | SEO / primer impacto |
| 2 | **Lo que enseñamos** | Declaración de principios: técnica, no fuerza. | Posicionamiento |
| 3 | **Momento haraigoshi** | Mostrar, sin decirlo, cómo se entiende el judo en Kodaore. | Ancla editorial |
| 4 | **Método** | Los tres pilares del entrenamiento, sin jerga. | Diferenciación |
| 5 | **Sedes** | Las tres ciudades con entrada a cada una. | Funcional crítica |
| 6 | **Disciplinas y niveles** | Judo + defensa personal, para qué edades. | Funcional crítica |
| 7 | **Primera clase de prueba** | CTA principal. Simple, sin formularios que asusten. | Conversión |
| 8 | **Familias ya inscritas** | Puerta al portal familia sin que se mezcle con la captación. | Funcional recurrente |
| 9 | **Pie** | Contacto, legal, créditos. | Obligaciones |

El **momento haraigoshi** vive en la sección 3: después de que la landing ha dicho *qué es el club* (1) y *qué entendemos por judo* (2), y antes de los contenidos más funcionales (4–9). Es el corazón editorial, no el primer impacto.

---

## Sección 1 · Apertura

**Propósito**. Situar al visitante en menos de 10 segundos: club de judo, tres sedes, atmósfera que prefiere contención a ruido.

**Función**. Title + meta, encabezado semántico `<h1>`. SEO principal.

**Composición propuesta** (para Fase 1). Una sola columna, centrada pero no geométricamente: el bloque de texto respira a la izquierda con margen de la cuartilla de un manual. Tipografía: Shippori Mincho 500, escala `display.2xl` (a añadir al tema, ~72→112 px). Sin imagen de portada. Sin CTA. Solo texto y aire.

**Copy — eu**
> **Kodaore**
>
> Judo kluba Azkoitia, Azpeitia eta Zumaian.
> 2002tik erakusten dugu gorputzak ikasten duela belarriak baino lehen.

**Copy — es**
> **Kodaore**
>
> Club de judo en Azkoitia, Azpeitia y Zumaia.
> Desde 2002 enseñando que el cuerpo aprende antes que la cabeza.

> Nota para el cliente: el año "2002" es provisional — cambiar por el año real de fundación del club. La frase larga es editable; su función es decir "esto va de técnica que se aprende con el cuerpo", sin frase de marketing.

---

## Sección 2 · Lo que enseñamos

**Propósito**. Declarar el principio que sostiene todo lo que viene: en Kodaore se enseña técnica, no fuerza. Preparar la lectura del haraigoshi.

**Función**. Introducción temática. Dos párrafos cortos.

**Composición propuesta**. Dos bloques de texto en columna, separados por un espacio generoso. Sin imagen. Puede introducirse aquí un trazo SVG mínimo (una línea) que responde al scroll como transición al capítulo siguiente.

**Copy — eu**
> **Zer irakasten dugun**
>
> Judoa ez da indarraren kontua. Teknika da, eta pazientzia.
> Orekari eustea, puntu egokian mugitzea, arnasa ez galtzea.
>
> Horregatik ez dugu erakusten nola irabazi.
> Erakusten dugu nola geratzen den zutik dakiena, noiz eta norekin egiten duen lan.

**Copy — es**
> **Lo que enseñamos**
>
> El judo no va de fuerza. Va de técnica y paciencia.
> Sostener el equilibrio, moverse en el momento exacto, no perder la respiración.
>
> Por eso no enseñamos a ganar.
> Enseñamos a quedarse de pie sabiendo con quién se trabaja y cuándo.

---

## Sección 3 · Momento haraigoshi

**Propósito**. Mostrar visualmente, con los 5 frames vectorizados del haraigoshi, lo que acaba de decirse en (2): la técnica se construye en cuatro movimientos precisos. Es el corazón editorial de la landing.

**Función**. Sección pinned (sticky) en la que el scroll avanza una animación interna. Es la única excepción al "no pinning" de `ui-design-direction.md §6.4`, limitada a esta sección.

**Composición propuesta**. Sección a altura completa del viewport. A la izquierda (desktop) o arriba (mobile), el frame SVG actual del haraigoshi. A la derecha/abajo, cuatro tiempos editoriales que se revelan uno a uno mientras scrolleamos:

- El nombre del movimiento escrito una sola vez, arriba, pequeño: **haraigoshi**.
- Debajo, los cuatro momentos aparecen uno a uno, en eu + es, con una línea de aforismo breve.
- El frame cambia según el progreso del scroll: 1–2 = momento 1, 3 = momento 2, 4 = momento 3, 5 = momento 4.

**Copy — eu + es (cuatro momentos)**

| # | Euskera | Castellano | Frames | Aforismo (eu) | Aforismo (es) |
|---|---|---|---|---|---|
| 1 | **oreka hautsi** | **romper el equilibrio** | 01–02 | Mugimendua sortu baino lehen, aurkariak bere oinak ahaztu behar ditu. | El movimiento empieza cuando el otro olvida sus pies. |
| 2 | **sartu** | **entrar** | 03 | Hutsune bat uzten dizun instantean zaude han. | Estar donde él te deja un hueco, en el instante en que te lo deja. |
| 3 | **bota** | **proyectar** | 04 | Ez duzu jaurtitzen: zuk jartzen duzu bidea eta berak jarraitzen du. | No se lanza: se pone el camino y el otro lo sigue. |
| 4 | **ondo erori** | **caer bien** | 05 | Teknika biena da. Ondo erortzen duenak ere lan egiten du. | La técnica es de dos. El que cae bien también hace el trabajo. |

> Notas editoriales:
> - Los cuatro aforismos son provisionales. Están escritos para tener el peso de un manual — cortos, sin adjetivos, sin explicación. Son los que más se benefician de revisión del cliente o de alguien con pluma en euskera.
> - El cuarto tiempo (`ondo erori`) es la clave del respeto a la disciplina: reconocer que el judoka que cae también domina técnica. Este detalle separa una landing-decoración de una landing-que-entiende.
> - "haraigoshi" aparece en minúsculas y sin itálica — no es una palabra extranjera, es el nombre técnico del movimiento que se está mostrando.

**Fallback `prefers-reduced-motion: reduce`**. Los 5 frames se muestran como una cuadrícula estática, como las páginas de un manual abierto en paralelo: dos columnas × tres filas (5 frames + título). Los aforismos todos visibles, sin desvelado. Se percibe como una lámina técnica, no como animación rota.

**Fallback sin JS**. Los 5 SVG aparecen en flujo vertical con sus cuatro aforismos al lado. La landing sigue teniendo sentido narrativo.

---

## Sección 4 · Método

**Propósito**. Después del momento haraigoshi el visitante está predispuesto: quiere saber cómo se concreta esa filosofía. Aquí se responde.

**Función**. Tres pilares. No "nuestros valores" (esa frase no entra aquí), sino tres descripciones funcionales de cómo es entrenar en Kodaore.

**Composición propuesta**. Tres bloques en columna (mobile) o tres en rejilla (desktop). Cada uno: un título corto en mincho + un párrafo breve en Inter. Sin iconos. Sin números.

**Copy — eu**

> **Nola entrenatzen dugun**

> **Maila eta adinaren arabera**
> Talde bakoitza maila zehatz baterako antolatzen da. 5 urteko hasiberriak ez dira 14 urteko aurreratuekin nahasten. Taldez aldatzen da ikaslea prest dagoenean, ez urtea amaitu delako.

> **Teknikatik hasita**
> Ariketa bakoitza teknika batetik abiatzen da. Lehenik oinak, ondoren eskuak, azkenik indarra. Indarra etortzen da teknika ulertu denean, ez lehenago.

> **Errespetuan oinarrituta**
> Tatamira igotzen zaren egunetik ikasten duzu agurtzen, itxaroten, lankidetzan aritzen. Hori da judoaren lehen teknika.

**Copy — es**

> **Cómo entrenamos**

> **Por nivel y edad**
> Cada grupo se organiza para un nivel concreto. Un principiante de 5 años no entrena con un avanzado de 14. El paso al siguiente grupo lo marca la persona, no el calendario.

> **Desde la técnica**
> Cada ejercicio arranca de una técnica. Primero los pies, luego las manos, la fuerza al final. La fuerza llega cuando la técnica se entiende, no antes.

> **Con respeto**
> Desde el primer día sobre tatami se aprende a saludar, esperar, trabajar en pareja. Esa es la primera técnica del judo.

---

## Sección 5 · Sedes

**Propósito**. Responder a la pregunta más frecuente: "¿dónde entrenan?". Y dar entrada a la información detallada de cada sede (`/sedes/[slug]`).

**Función**. Crítica. Tres bloques con información navegable.

**Composición propuesta**. Tres entradas en columna. Cada entrada: ciudad (mincho grande) + dirección (Inter pequeño) + línea de horarios resumen + enlace a la sede. Sin foto del polideportivo en la landing (esas fotos viven en `/sedes/[slug]`). Un filete a línea separando entradas.

**Copy — eu**

> **Non entrenatzen dugun**

> **Azkoitia**
> Izarraitz kiroldegia.
> Astelehenak, asteazkenak, ostiralak — arratsaldeak.
> → Azkoitiko egoitza ikusi

> **Azpeitia**
> Landeta kiroldegia.
> Astearteak, ostegunak, larunbatak — goizak eta arratsaldeak.
> → Azpeitiko egoitza ikusi

> **Zumaia**
> Aita Mari kiroldegia.
> Astelehenak, asteazkenak — arratsaldeak.
> → Zumaiako egoitza ikusi

**Copy — es**

> **Dónde entrenamos**

> **Azkoitia**
> Polideportivo Izarraitz.
> Lunes, miércoles, viernes — tardes.
> → Ver sede de Azkoitia

> **Azpeitia**
> Polideportivo Landeta.
> Martes, jueves, sábados — mañanas y tardes.
> → Ver sede de Azpeitia

> **Zumaia**
> Polideportivo Aita Mari.
> Lunes, miércoles — tardes.
> → Ver sede de Zumaia

> Nota: los nombres de polideportivos y los días son **provisionales y a confirmar por el cliente**. Se han escrito con nombres plausibles de polideportivos municipales reales en cada localidad, pero hay que validarlos antes del commit de Fase 3. Los horarios detallados viven en `/sedes/[slug]`; la landing solo resume.

---

## Sección 6 · Disciplinas y niveles

**Propósito**. Cerrar el bucle informativo: qué se enseña y para quién.

**Función**. Secundaria pero necesaria. Dos disciplinas, rangos de edad.

**Composición propuesta**. Dos bloques pequeños, en la misma rejilla que (4). Sin foto. Tipografía pequeña, densidad editorial.

**Copy — eu**

> **Zer irakasten dugun**

> **Judoa**
> 5 urtetik aurrerakoak. Hasiberriak, tartekoak eta aurreratuak.
> Dan maila lortzeko prestakuntza barne.

> **Defentsa pertsonala**
> 16 urtetik aurrera.
> Emakumeentzako espezializazioa Azkoitian.

**Copy — es**

> **Qué enseñamos**

> **Judo**
> Desde los 5 años. Iniciación, intermedio y avanzado.
> Preparación para grados DAN incluida.

> **Defensa personal**
> Desde los 16 años.
> Especialización para mujeres en Azkoitia.

> Nota: las edades y la especialización en Azkoitia están tomadas de la información de entrenadores en `lib/i18n.ts` (Janire Carmona / Gabriel Carmona mencionan defensa personal y especialización femenina). Si esto cambia, la sección se actualiza.

---

## Sección 7 · Primera clase de prueba

**Propósito**. Única CTA de conversión de la landing. Baja fricción.

**Función**. Acción primaria. Link directo a la sede más cercana o a un contacto sencillo (WhatsApp / email), no formulario largo.

**Composición propuesta**. Bloque editorial único. Frase grande en mincho + dos enlaces discretos. Sin botón de color grande estilo SaaS.

**Copy — eu**

> **Lehen saioa**
>
> Ez dago inskripziorik proba saioa egin aurretik.
> Etorri, begiratu, saiatu. Gero erabakitzen duzu.
>
> [Idatzi Kodaorera] · [WhatsApp bidez deitu]

**Copy — es**

> **Primera clase**
>
> No hay inscripción antes de la clase de prueba.
> Ven, mira, prueba. Luego decides.
>
> [Escribir a Kodaore] · [Llamar por WhatsApp]

> Nota: los destinos concretos (dirección de email, número de WhatsApp) **se confirman con el cliente** antes del commit de Fase 3. En `app/[locale]/(public)/page.tsx` actual aparece `Kodaorejudoelkartea@gmail.com` — úsese ese como provisional.

---

## Sección 8 · Familias ya inscritas

**Propósito**. Dar entrada rápida al portal familia sin mezclarlo con la narrativa de captación. Aparece tarde a propósito.

**Función**. Crítica recurrente (las familias ya inscritas vuelven a esta página a menudo — si tienen que buscar el enlace al portal, la landing ha fallado en lo cotidiano).

**Composición propuesta**. Una línea discreta. Tipografía pequeña. Dos enlaces.

**Copy — eu**

> **Dagoeneko gurekin zaudenentzat**
> Familien gunea: [ordainketak eta jakinarazpenak ikusi](/eu/familien-gunea) · [saio-hasiera](/eu/acceso)

**Copy — es**

> **Si ya estás con nosotros**
> Área de familias: [ver pagos y avisos](/es/area-familias) · [acceso](/es/acceso)

> Nota: las rutas exactas (`/eu/familien-gunea`, `/es/area-familias`) son las que ya existen en la app. Verificar en `app/[locale]/(family-portal)/` antes del commit.

---

## Sección 9 · Pie

**Propósito**. Obligaciones y puntos de contacto. Cierre sobrio.

**Función**. Contacto, legal, créditos. El footer actual del sistema (`components/site-footer.tsx`) cubre la parte legal y las apps; la landing puede reusarlo o tener un cierre propio más editorial. A decidir en Fase 1 (más probable: reusar el footer existente para no duplicar capas).

**Composición propuesta**. Decisión en Fase 1. Por defecto: reusar `<SiteFooter />` del sistema.

---

## Mapa funcional — información crítica presente en la landing

| Pregunta del visitante | Dónde la respondemos |
|---|---|
| ¿Qué es Kodaore? | §1 Apertura + §2 Lo que enseñamos |
| ¿Dónde entrenan? | §5 Sedes |
| ¿Qué edades? | §6 Disciplinas y niveles |
| ¿Cómo me inscribo? | §7 Primera clase |
| ¿Cómo contacto? | §7 + §9 Pie |
| Soy familia, quiero entrar al portal | §8 Familias ya inscritas |
| ¿Qué valores / método tiene el club? | §3 Momento haraigoshi (implícito) + §4 Método (explícito) |
| ¿Quiénes son los monitores? | No en la landing — en `/sedes/[slug]` (los coaches ya están en i18n por sede). Decisión consciente: la landing habla del club, no del staff. |
| Fototeca, ropa | No en la landing. Siguen en su ruta propia (`/erropak`, `/fototeca`). El nav del header ya los expone. Decisión consciente: la landing no es un hub de todo. |

---

## Decisiones editoriales que el cliente debe validar antes de Fase 1

1. **Año de fundación** (2002 es provisional).
2. **Los 4 aforismos del momento haraigoshi** (eu + es). Son lo más delicado del texto — conviene que los revise alguien con sensibilidad al euskera escrito + idealmente un practicante del club que valide que la descripción de cada fase se ajusta a cómo se enseña.
3. **Nombres de los polideportivos y días de entrenamiento** por sede.
4. **Edad mínima de defensa personal** (16 años es supuesto razonable, confirmar).
5. **Email y WhatsApp** de contacto en §7.
6. **Si el footer es el actual `<SiteFooter />` o queremos uno más editorial para la landing.**
7. **Si alguna de las 9 secciones sobra** (podría defenderse una landing de 6–7 secciones fusionando 2+4 o 5+6). Mi criterio: mantener las 9, el ritmo editorial lo aguanta y cada una responde a una pregunta distinta.

---

## Relación con el resto de la app

- Rutas preservadas, no se tocan: `/[locale]/sedes`, `/[locale]/sedes/[slug]`, `/[locale]/erropak`, `/[locale]/fototeca`, `/[locale]/legal/*`, `/[locale]/acceso`, el route group `(family-portal)`.
- La landing sustituye `app/[locale]/(public)/page.tsx` por `app/[locale]/page.tsx` (brief revisado → DECIDIR #6a).
- El nav global (`site-header-nav.tsx`) no se toca. Si en Fase 1 se decide que para la landing quiere un header propio más mínimo, se encapsula sin tocar el compartido.
- Todos los strings de esta narrativa deben caer como claves nuevas en `lib/i18n.ts` bajo `landing.*`, para respetar la regla "toda string nueva existe en eu y es" del CLAUDE.md del proyecto.

---

## Pendiente antes de escribir Fase 1

Cuando tengas comentarios sobre:
- El arco de 9 secciones,
- Los 4 aforismos del haraigoshi,
- El tono general del copy (¿demasiado sobrio? ¿justo? ¿falta calidez?),
- Los datos provisionales marcados arriba,

entonces abro Fase 1 (`docs/landing-direction.md`) y fijo: tipografía final, escala vertical, subconjunto editorial de la paleta, gramática de motion, y librería confirmada.

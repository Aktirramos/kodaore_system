# Inventario de textos de la web

Este documento recoge todos los textos localizados para revisar traducciones (euskera/castellano) y reemplazar datos de ejemplo.

## 1) Diccionario principal (lib/i18n.ts)

Ubicacion: lib/i18n.ts

```text
1:export const supportedLocales = ["eu", "es"] as const;
11:    brand: "Kodaore",
12:    tagline: "Kirola, diziplina eta talde espiritua",
14:      "Azkoitia, Azpeitia eta Zumaia egoitzetan entrenamendu esperientzia bateratua: kalitatea, konfiantza eta motibazioa.",
16:      heroTitle: "Klub bat, hiru egoitza, entrenatzeko gogo handia",
18:        "Kodaore kirol klub bat da: teknikatik harago, diziplina, errespetua eta auto-konfiantza landuz hazteko espazioa.",
19:      quickPanelTitle: "Entrenamendu filosofia",
21:        "Maila eta adin bakoitzerako talde egokiak",
22:        "Teknika eta gorputz-kontrola modu progresiboan",
23:        "Irakasle talde hurbila eta motibatzailea",
25:      factChips: ["Azkoitia", "Azpeitia", "Zumaia"],
27:        { label: "Egoitzak", value: "3" },
28:        { label: "Mailak", value: "Hasiberri-Aurreratu" },
29:        { label: "Giroa", value: "Kirol familiarra" },
31:      showcaseTitle: "Klubaren irudi estiloa",
33:        "Azal garbia, argazki handiak eta bloke bakoitzak bere funtzioa: kirol web baten lehen inpresio sendoa.",
35:        { title: "Entrenamendu saio biziak" },
36:        { title: "Teknika eta talde lana" },
38:          title: "Gure identitatea",
39:          description: "Kodaore: diziplina, errespetua eta giro familiarra hiru egoitzetan.",
44:          title: "Entrenamendu kalitatea",
45:          value: "Saio dinamikoak, helburu argiak eta eboluzio neurgarria ikasturte osoan.",
48:          title: "Balioak eta errespetua",
49:          value: "Indarra eta diziplina lantzen dira, beti errespetuan eta talde lanean oinarrituta.",
52:          title: "Familientzako erraztasuna",
53:          value: "Ordutegi eta egoitza aukerak erraz konbinatzeko antolaketa argia.",
56:      sitesTitle: "Gure egoitzak",
57:      sitesDescription: "Egoitza bakoitzak bere talde teknikoa eta entrenamendu estiloa ditu.",
58:      coachesTitle: "Entrenatzaileak",
61:          slug: "azkoitia",
62:          name: "Azkoitia",
63:          description: "Talde trinkoak eta giro bizia, entrenamenduari erritmo ona emateko.",
66:              name: "Ane Irure",
67:              profile: "Teknika arduraduna",
68:              focus: "Uchi-komi zehaztasuna eta oinarrizko proiekzioak",
69:              experience: "11 urteko esperientzia",
70:              photo: "/media/judo-4.jpg",
73:              name: "Mikel Otamendi",
74:              profile: "Erritmo eta prestaketa fisikoa",
75:              focus: "Saio dinamikoak eta koordinazio lana",
76:              experience: "9 urteko esperientzia",
77:              photo: "/media/judo-5.jpg",
80:              name: "Leire Aranburu",
81:              profile: "Haurren taldeak",
82:              focus: "Konfiantza, diziplina eta lehen teknikak",
83:              experience: "7 urteko esperientzia",
84:              photo: "/media/judo-6.jpg",
89:          slug: "azpeitia",
90:          name: "Azpeitia",
91:          description: "Hasiberritik aurreratura, progresio argiarekin eta motibazio handiarekin.",
94:              name: "Unai Etxeberria",
95:              profile: "Talde aurreratuak",
96:              focus: "Randori kontrolatua eta taktika",
97:              experience: "12 urteko esperientzia",
98:              photo: "/media/judo-5.jpg",
101:              name: "Nerea Lizaso",
102:              profile: "Teknika progresiboa",
103:              focus: "Postura, oreka eta trantsizioak",
104:              experience: "8 urteko esperientzia",
105:              photo: "/media/judo-4.jpg",
108:              name: "Beñat Lasa",
109:              profile: "Prestaketa lehiaketarako",
110:              focus: "Abiadura eta erabaki azkarra",
111:              experience: "10 urteko esperientzia",
112:              photo: "/media/judo-6.jpg",
117:          slug: "zumaia",
118:          name: "Zumaia",
119:          description: "Giro segurua eta energetikoa, ikasteko eta disfrutatzeko espazio ezin hobea.",
122:              name: "Irati Alberdi",
123:              profile: "Hasierako mailak",
124:              focus: "Oinarrizko mugimenduak eta konfiantza",
125:              experience: "6 urteko esperientzia",
126:              photo: "/media/judo-6.jpg",
129:              name: "Jon Ander Salegi",
130:              profile: "Teknika eta indarra",
131:              focus: "Kuzushi eta proiekzio sendoak",
132:              experience: "13 urteko esperientzia",
133:              photo: "/media/judo-4.jpg",
136:              name: "Ainhoa Ormazabal",
137:              profile: "Familia taldeak",
138:              focus: "Giro positiboa eta progresio jarraitua",
139:              experience: "9 urteko esperientzia",
140:              photo: "/media/judo-5.jpg",
145:      photoTitle: "Benetako irudiekin, benetako emozioa",
147:        "Klubeko argazki errealek zure seme-alaben hurrengo kirol etxea dena erakusten dute.",
148:      photoHint: "Lehen saioari buruz galdetzeko: Kodaorejudoelkartea@gmail.com",
151:      discover: "Egoitzak",
152:      access: "Familien gunea",
153:      gallery: "Fototeka",
154:      contact: "Lehen saioa eskatu",
157:      pillars: "Hasierako oinarriak",
158:      status: "Abiapuntua martxan",
161:      sites: "Egoitzak",
162:      paymentModel: "Kuota ereduak",
163:      priorityLang: "Hizkuntza lehentasuna",
164:      roleModel: "Rol eredua",
167:      sites: "Azkoitia, Azpeitia, Zumaia",
168:      paymentModel: "Hilekoa, hiruhilekoa, urtekoa",
169:      priorityLang: "Euskara lehenetsi, gaztelania lagungarri",
170:      roleModel: "6 rol + etiketak irakasleentzat",
174:    brand: "Kodaore",
175:    tagline: "Deporte, disciplina y espiritu de equipo",
177:      "Una experiencia de club unificada en Azkoitia, Azpeitia y Zumaia: entrenamiento de calidad, motivacion y evolucion real.",
179:      heroTitle: "Un club deportivo que engancha desde el primer entrenamiento",
181:        "Kodaore es un club donde se entrena tecnica, disciplina y confianza en equipo, con una experiencia cuidada en las tres sedes.",
182:      quickPanelTitle: "Filosofia de entrenamiento",
184:        "Grupos adaptados por edad y nivel",
185:        "Progresion tecnica y fisica paso a paso",
186:        "Equipo de profesorado cercano y motivador",
188:      factChips: ["Azkoitia", "Azpeitia", "Zumaia"],
190:        { label: "Sedes", value: "3" },
191:        { label: "Niveles", value: "Iniciacion-Avanzado" },
192:        { label: "Ambiente", value: "Club familiar" },
194:      showcaseTitle: "Estilo visual del club",
196:        "Portada limpia con fotografia protagonista y bloques con rol claro, inspirada en una web deportiva real.",
198:        { title: "Sesiones intensas de entrenamiento" },
199:        { title: "Tecnica y trabajo en equipo" },
201:          title: "Nuestra identidad",
202:          description: "Kodaore en tres sedes: disciplina, respeto y ambiente familiar.",
207:          title: "Entrenamiento de calidad",
208:          value: "Sesiones dinamicas con objetivos claros y evolucion constante.",
211:          title: "Valores y respeto",
212:          value: "Fuerza, disciplina y respeto en un entorno sano y de trabajo en equipo.",
215:          title: "Comodidad para familias",
216:          value: "Horarios y sedes presentados de forma clara para decidir rapido.",
219:      sitesTitle: "Nuestras sedes",
220:      sitesDescription: "Cada sede cuenta con su propio equipo tecnico y dinamica de entrenamiento.",
221:      coachesTitle: "Entrenadores",
224:          slug: "azkoitia",
225:          name: "Azkoitia",
226:          description: "Grupos dinamicos y energia de club para entrenar con ritmo.",
229:              name: "Ane Irure",
230:              profile: "Responsable tecnica",
231:              focus: "Precision en uchi-komi y proyecciones base",
232:              experience: "11 anos de experiencia",
233:              photo: "/media/judo-4.jpg",
236:              name: "Mikel Otamendi",
237:              profile: "Ritmo y preparacion fisica",
238:              focus: "Sesiones dinamicas y trabajo de coordinacion",
239:              experience: "9 anos de experiencia",
240:              photo: "/media/judo-5.jpg",
243:              name: "Leire Aranburu",
244:              profile: "Grupos infantiles",
245:              focus: "Confianza, disciplina y primeras tecnicas",
246:              experience: "7 anos de experiencia",
247:              photo: "/media/judo-6.jpg",
252:          slug: "azpeitia",
253:          name: "Azpeitia",
254:          description: "Programas progresivos para avanzar con seguridad y constancia.",
257:              name: "Unai Etxeberria",
258:              profile: "Grupos avanzados",
259:              focus: "Randori controlado y tactica competitiva",
260:              experience: "12 anos de experiencia",
261:              photo: "/media/judo-5.jpg",
264:              name: "Nerea Lizaso",
265:              profile: "Tecnica progresiva",
266:              focus: "Postura, equilibrio y transiciones",
267:              experience: "8 anos de experiencia",
268:              photo: "/media/judo-4.jpg",
271:              name: "Beñat Lasa",
272:              profile: "Preparacion competitiva",
273:              focus: "Velocidad y toma de decision rapida",
274:              experience: "10 anos de experiencia",
275:              photo: "/media/judo-6.jpg",
280:          slug: "zumaia",
281:          name: "Zumaia",
282:          description: "Entorno seguro y motivador para disfrutar entrenando.",
285:              name: "Irati Alberdi",
286:              profile: "Niveles de iniciacion",
287:              focus: "Base tecnica y seguridad en cada sesion",
288:              experience: "6 anos de experiencia",
289:              photo: "/media/judo-6.jpg",
292:              name: "Jon Ander Salegi",
293:              profile: "Tecnica y fuerza",
294:              focus: "Kuzushi y proyecciones con control",
295:              experience: "13 anos de experiencia",
296:              photo: "/media/judo-4.jpg",
299:              name: "Ainhoa Ormazabal",
300:              profile: "Grupos familiares",
301:              focus: "Ambiente positivo y progresion continua",
302:              experience: "9 anos de experiencia",
303:              photo: "/media/judo-5.jpg",
308:      photoTitle: "Con fotos reales, una marca que se siente",
310:        "Con vuestras fotos, la web refleja el caracter deportivo real del club.",
311:      photoHint: "Para una primera clase de prueba: Kodaorejudoelkartea@gmail.com",
314:      discover: "Sedes",
315:      access: "Area familias",
316:      gallery: "Fototeca",
317:      contact: "Pedir primera clase",
320:      pillars: "Pilares iniciales",
321:      status: "Punto de partida activo",
324:      sites: "Sedes",
325:      paymentModel: "Modelo de cuotas",
326:      priorityLang: "Idioma prioritario",
327:      roleModel: "Modelo de roles",
330:      sites: "Azkoitia, Azpeitia, Zumaia",
331:      paymentModel: "Mensual, trimestral, anual",
332:      priorityLang: "Euskera principal, castellano complementario",
333:      roleModel: "6 roles + etiquetas para profesorado",
```

## 2) Textos hardcodeados fuera de i18n (app/** y components/**)

Incluye textos en JSX, placeholders, aria-label y ternarios locale eu/es.

```text
app/[locale]/portal/payments/page.tsx:31:          {isEu ? "Ordainketak" : "Pagos"}
app/[locale]/portal/payments/page.tsx:34:          {isEu ? "Kuoten egoera" : "Estado de cuotas"}
app/[locale]/portal/payments/page.tsx:45:          label={isEu ? "Ordainduta" : "Pagado"}
app/[locale]/portal/payments/page.tsx:49:          label={isEu ? "Ordainketa zainak" : "Pagos pendientes"}
app/[locale]/portal/payments/page.tsx:53:          label={isEu ? "Errezibo kopurua" : "Numero de recibos"}
app/[locale]/portal/payments/page.tsx:60:          {isEu ? "Mugimenduak" : "Movimientos"}
app/[locale]/portal/payments/page.tsx:64:          <p className="mt-4 text-sm text-ink-muted">{isEu ? "Ez dago ordainketa erregistrorik." : "No hay registros de pagos."}</p>
app/[locale]/portal/payments/page.tsx:77:                  <Data label={isEu ? "Zenbatekoa" : "Importe"} value={formatCurrency(receipt.amountCents, locale)} />
app/[locale]/portal/payments/page.tsx:79:                    label={isEu ? "Epea" : "Periodo"}
app/[locale]/portal/payments/page.tsx:83:                    label={isEu ? "Mugimendu berriena" : "Ultimo movimiento"}
app/[locale]/portal/payments/page.tsx:119:  return new Intl.NumberFormat(locale === "eu" ? "eu-ES" : "es-ES", {
app/[locale]/portal/payments/page.tsx:126:  return new Intl.DateTimeFormat(locale === "eu" ? "eu-ES" : "es-ES", {
app/[locale]/portal/profile/page.tsx:31:          {isEu ? "Datu pertsonalak" : "Datos personales"}
app/[locale]/portal/profile/page.tsx:34:          {isEu ? "Familiaren fitxa" : "Ficha familiar"}
app/[locale]/portal/profile/page.tsx:47:              {isEu ? "Harremanetarako datuak" : "Datos de contacto"}
app/[locale]/portal/profile/page.tsx:51:                <dt className="text-ink-muted">Email</dt>
app/[locale]/portal/profile/page.tsx:55:                <dt className="text-ink-muted">{isEu ? "Telefonoa" : "Telefono"}</dt>
app/[locale]/portal/profile/page.tsx:59:                <dt className="text-ink-muted">{isEu ? "Helbidea" : "Direccion"}</dt>
app/[locale]/portal/profile/page.tsx:63:                <dt className="text-ink-muted">{isEu ? "IBAN" : "IBAN"}</dt>
app/[locale]/portal/profile/page.tsx:73:          {isEu ? "Ikasleen informazioa" : "Informacion de alumnos"}
app/[locale]/portal/profile/page.tsx:78:              {isEu ? "Ez dago ikasle aktiborik lotuta." : "No hay alumnos activos vinculados."}
app/[locale]/portal/profile/page.tsx:93:                <DataRow label={isEu ? "Eskola" : "Colegio"} value={student.schoolName ?? "-"} />
app/[locale]/portal/profile/page.tsx:94:                <DataRow label={isEu ? "Maila" : "Curso"} value={student.schoolCourse ?? "-"} />
app/[locale]/portal/profile/page.tsx:95:                <DataRow label={isEu ? "Kodea" : "Codigo"} value={student.internalCode} />
app/[locale]/portal/profile/page.tsx:124:  return new Intl.NumberFormat(locale === "eu" ? "eu-ES" : "es-ES", {
app/[locale]/portal/error.tsx:16:  const locale = isEu ? "eu" : "es";
app/[locale]/portal/error.tsx:37:          {isEu ? "Errorea" : "Error"}
app/[locale]/portal/error.tsx:40:          {isEu ? "Ezin izan dugu ataria kargatu" : "No hemos podido cargar el portal"}
app/[locale]/portal/error.tsx:48:          <p className="mt-3 text-xs text-rose-200/80">ID: {error.digest}</p>
app/[locale]/portal/error.tsx:57:            {isEu ? "Berriro saiatu" : "Reintentar"}
app/[locale]/portal/error.tsx:63:            {isEu ? "Portalera itzuli" : "Volver al portal"}
app/[locale]/portal/messages/page.tsx:31:          {isEu ? "Komunikazioak" : "Comunicaciones"}
app/[locale]/portal/messages/page.tsx:34:          {isEu ? "Egoitzaren mezuak" : "Mensajes de la sede"}
app/[locale]/portal/messages/page.tsx:46:            <p className="text-sm text-ink-muted">{isEu ? "Ez dago komunikazio berririk." : "No hay comunicaciones nuevas."}</p>
app/[locale]/portal/messages/page.tsx:80:  return new Intl.DateTimeFormat(locale === "eu" ? "eu-ES" : "es-ES", {
app/[locale]/portal/messages/page.tsx:91:    return type === "NOTICE" ? "OHARRA" : "POSTA";
app/[locale]/portal/messages/page.tsx:93:  return type === "NOTICE" ? "AVISO" : "EMAIL";
app/[locale]/portal/page.tsx:34:          {isEu ? "Familia eta ikasleen ataria" : "Portal de familias y alumnado"}
app/[locale]/portal/page.tsx:44:            <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">{isEu ? "Kontu aktiboa" : "Cuenta activa"}</p>
app/[locale]/portal/page.tsx:52:          label={isEu ? "Ikasle aktiboak" : "Alumnos activos"}
app/[locale]/portal/page.tsx:57:          label={isEu ? "Ordainketa zainak" : "Pagos pendientes"}
app/[locale]/portal/page.tsx:62:          label={isEu ? "Ordaindutako kuotak" : "Cuotas pagadas"}
app/[locale]/portal/page.tsx:67:          label={isEu ? "Komunikazioak" : "Comunicaciones"}
app/[locale]/portal/page.tsx:76:          title={isEu ? "Datu pertsonalak" : "Datos personales"}
app/[locale]/portal/page.tsx:77:          text={isEu ? "Familiaren fitxa eta ikasleen datuak kontsultatu." : "Consulta ficha familiar y datos del alumnado."}
app/[locale]/portal/page.tsx:78:          cta={isEu ? "Ikusi xehetasuna" : "Ver detalle"}
app/[locale]/portal/page.tsx:82:          title={isEu ? "Ordainketak" : "Pagos"}
app/[locale]/portal/page.tsx:83:          text={isEu ? "Kuoten egoera eta azken mugimenduak ikusi." : "Revisa estado de cuotas y movimientos recientes."}
app/[locale]/portal/page.tsx:84:          cta={isEu ? "Ikusi xehetasuna" : "Ver detalle"}
app/[locale]/portal/page.tsx:88:          title={isEu ? "Komunikazioak" : "Comunicaciones"}
app/[locale]/portal/page.tsx:89:          text={isEu ? "Egoitzako mezuak eta abisuak berrikusi." : "Lee avisos y mensajes de la sede."}
app/[locale]/portal/page.tsx:90:          cta={isEu ? "Ikusi xehetasuna" : "Ver detalle"}
app/[locale]/portal/page.tsx:96:          <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">{isEu ? "Azken ordainketa" : "Ultimo recibo"}</p>
app/[locale]/portal/page.tsx:110:            <p className="mt-2 text-sm text-ink-muted">{isEu ? "Ez dago ordainketa daturik." : "No hay datos de pagos."}</p>
app/[locale]/portal/page.tsx:115:          <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">{isEu ? "Azken komunikazioa" : "Ultima comunicacion"}</p>
app/[locale]/portal/page.tsx:123:            <p className="mt-2 text-sm text-ink-muted">{isEu ? "Ez dago komunikazio berririk." : "No hay comunicaciones nuevas."}</p>
app/[locale]/portal/page.tsx:129:        <h2 className="font-heading text-xl font-semibold text-foreground">{isEu ? "Gogorarazpena" : "Recordatorio"}</h2>
app/[locale]/portal/page.tsx:183:  return new Intl.NumberFormat(locale === "eu" ? "eu-ES" : "es-ES", {
app/[locale]/portal/page.tsx:190:  return new Intl.DateTimeFormat(locale === "eu" ? "eu-ES" : "es-ES", {
app/[locale]/erropak/page.tsx:75:  const heroTag = isEu ? "Kolekzio bisuala" : "Coleccion visual";
app/[locale]/erropak/page.tsx:76:  const heroTitle = isEu ? "Kodaore Erropak" : "Kodaore Erropak";
app/[locale]/erropak/page.tsx:83:      title: isEu ? "Drop berriak" : "Nuevos drops",
app/[locale]/erropak/page.tsx:89:      title: isEu ? "Talde edizioa" : "Edicion equipo",
app/[locale]/erropak/page.tsx:95:      title: isEu ? "Eskaera orientazioa" : "Asesoramiento",
app/[locale]/erropak/page.tsx:102:  const interestCtaLabel = isEu ? "Informazioa eskatu" : "Solicitar informacion";
app/[locale]/erropak/page.tsx:116:                {isEu ? "Sudaderak" : "Sudaderas"}
app/[locale]/erropak/page.tsx:119:                {isEu ? "Kamisetak" : "Camisetas"}
app/[locale]/erropak/page.tsx:122:                {isEu ? "Osagarriak" : "Accesorios"}
app/[locale]/erropak/page.tsx:131:              {isEu ? "Nola funtzionatzen du?" : "Como funciona"}
app/[locale]/erropak/page.tsx:134:              <li>{isEu ? "1. Galerian piezak filtratu eta handitu." : "1. Filtra y amplia prendas en la galeria."}</li>
app/[locale]/erropak/page.tsx:135:              <li>{isEu ? "2. Gustuko konbinazioak aukeratu." : "2. Elige combinaciones que te encajen."}</li>
app/[locale]/erropak/page.tsx:136:              <li>{isEu ? "3. Informazioa eskatu klubari." : "3. Solicita informacion al club."}</li>
app/[locale]/erropak/page.tsx:165:            {isEu ? "Laster gehiago" : "Muy pronto mas"}
app/[locale]/erropak/page.tsx:177:            {isEu ? "Hasierara itzuli" : "Volver al inicio"}
app/[locale]/fototeca/page.tsx:32:                <Image src="/logo-kodaore.png" alt="Kodaore logo" fill sizes="28px" className="object-contain p-1" />
app/[locale]/fototeca/page.tsx:35:                <span className="text-brand-emphasis">Ko</span>
app/[locale]/fototeca/page.tsx:36:                <span className="text-foreground">dao</span>
app/[locale]/fototeca/page.tsx:37:                <span className="text-brand-warm">re</span>
app/[locale]/layout.tsx:39:export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
app/[locale]/layout.tsx:62:      locale: locale === "eu" ? "eu_ES" : "es_ES",
app/[locale]/layout.tsx:82:        {locale === "eu" ? "Joan edukira" : "Saltar al contenido"}
app/[locale]/acceso/page.tsx:32:      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">Acceso</p>
app/[locale]/acceso/page.tsx:34:        {locale === "eu" ? "Saioa hasi" : "Iniciar sesion"}
app/[locale]/acceso/page.tsx:48:          {locale === "eu" ? "Bezero berriak" : "Nuevos clientes"}
app/[locale]/acceso/page.tsx:61:            {locale === "eu" ? "Familia kontua sortu" : "Crear cuenta de familia"}
app/[locale]/acceso/crear-cuenta/page.tsx:19:        {locale === "eu" ? "Alta berria" : "Nueva alta"}
app/[locale]/acceso/crear-cuenta/page.tsx:22:        {locale === "eu" ? "Familia kontua sortu" : "Crear cuenta de familia"}
app/[locale]/sedes/[site]/page.tsx:86:            <p className="relative text-xs font-semibold uppercase tracking-[0.15em] text-brand-emphasis">Kodaore</p>
app/[locale]/sedes/page.tsx:36:            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-emphasis">Kodaore</p>
app/[locale]/page.tsx:31:  const storeTitle = locale === "eu" ? "Kodaore arropa" : "Ropa Kodaore";
app/[locale]/page.tsx:35:  const storeCta = locale === "eu" ? "Erropak ikusi" : "Ver ropa";
app/[locale]/page.tsx:82:                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-emphasis">Kodaore</p>
app/[locale]/page.tsx:104:              {locale === "eu" ? "Galeria" : "Galeria"}
app/[locale]/page.tsx:111:              {locale === "eu" ? "Kolekzio berria" : "Nueva coleccion"}
app/[locale]/page.tsx:122:                {locale === "eu" ? "Sudaderak" : "Sudaderas"}
app/[locale]/page.tsx:125:                {locale === "eu" ? "Kamisetak" : "Camisetas"}
app/[locale]/page.tsx:128:                {locale === "eu" ? "Osagarriak" : "Accesorios"}
app/[locale]/page.tsx:149:              alt="Kodaore photography highlight"
app/[locale]/legal/terms/page.tsx:21:          {isEu ? "Lege informazioa" : "Informacion legal"}
app/[locale]/legal/terms/page.tsx:24:          {isEu ? "Zerbitzuaren baldintzak" : "Terminos del servicio"}
app/[locale]/legal/terms/page.tsx:35:          {isEu ? "1. Erabilera onargarria" : "1. Uso aceptable"}
app/[locale]/legal/terms/page.tsx:44:          {isEu ? "2. Kontuen segurtasuna" : "2. Seguridad de la cuenta"}
app/[locale]/legal/terms/page.tsx:53:          {isEu ? "3. Zerbitzuaren erabilgarritasuna" : "3. Disponibilidad del servicio"}
app/[locale]/legal/terms/page.tsx:62:          {isEu ? "4. Jabetza intelektuala" : "4. Propiedad intelectual"}
app/[locale]/legal/terms/page.tsx:71:          {isEu ? "5. Lege aplikagarria" : "5. Ley aplicable"}
app/[locale]/legal/privacy/page.tsx:21:          {isEu ? "Lege informazioa" : "Informacion legal"}
app/[locale]/legal/privacy/page.tsx:24:          {isEu ? "Pribatutasun politika" : "Politica de privacidad"}
app/[locale]/legal/privacy/page.tsx:35:          {isEu ? "1. Tratamenduaren arduraduna" : "1. Responsable del tratamiento"}
app/[locale]/legal/privacy/page.tsx:44:          {isEu ? "2. Helburua eta legitimazioa" : "2. Finalidad y legitimacion"}
app/[locale]/legal/privacy/page.tsx:53:          {isEu ? "3. Kontserbazio epeak" : "3. Plazos de conservacion"}
app/[locale]/legal/privacy/page.tsx:62:          {isEu ? "4. Eskubideak" : "4. Derechos"}
app/[locale]/legal/privacy/page.tsx:71:          {isEu ? "5. Harremanetarako" : "5. Contacto"}
app/[locale]/admin/billing/page.tsx:31:          {isEu ? "Kudeaketa" : "Gestion"}
app/[locale]/admin/billing/page.tsx:34:          {isEu ? "Kobrantzen administrazioa" : "Administracion de cobros"}
app/[locale]/admin/billing/page.tsx:44:        <StatCard label={isEu ? "Ordainduta" : "Pagado"} value={formatCurrency(data.totals.paidAmountCents, locale)} />
app/[locale]/admin/billing/page.tsx:46:          label={isEu ? "Ordaintzeke" : "Pendiente"}
app/[locale]/admin/billing/page.tsx:50:        <StatCard label={isEu ? "Errezibo ordainduak" : "Recibos pagados"} value={String(data.totals.paidCount)} />
app/[locale]/admin/billing/page.tsx:51:        <StatCard label={isEu ? "Errezibo pendienteak" : "Recibos pendientes"} value={String(data.totals.pendingCount)} tone="warning" />
app/[locale]/admin/billing/page.tsx:58:                {isEu ? "Ez dago kobrantza daturik." : "No hay datos de cobros."}
app/[locale]/admin/billing/page.tsx:70:                    <p>{isEu ? "Egoitza" : "Sede"}: {receipt.siteName}</p>
app/[locale]/admin/billing/page.tsx:71:                    <p>{isEu ? "Zenbatekoa" : "Importe"}: {formatCurrency(receipt.amountCents, locale)}</p>
app/[locale]/admin/billing/page.tsx:72:                    <p>{isEu ? "Epemuga" : "Vencimiento"}: {receipt.dueDate ? formatDate(receipt.dueDate, locale) : "-"}</p>
app/[locale]/admin/billing/page.tsx:74:                      {isEu ? "Azken mugimendua" : "Ultimo movimiento"}: {receipt.latestMovement
app/[locale]/admin/billing/page.tsx:88:                  {isEu ? "Kobrantzen eta erreziboen administrazio taula" : "Tabla de administracion de cobros y recibos"}
app/[locale]/admin/billing/page.tsx:92:                    <th className="px-4 py-3 font-semibold">{isEu ? "Ikaslea" : "Alumno"}</th>
app/[locale]/admin/billing/page.tsx:93:                    <th className="px-4 py-3 font-semibold">{isEu ? "Egoitza" : "Sede"}</th>
app/[locale]/admin/billing/page.tsx:94:                    <th className="px-4 py-3 font-semibold">{isEu ? "Egoera" : "Estado"}</th>
app/[locale]/admin/billing/page.tsx:95:                    <th className="px-4 py-3 font-semibold">{isEu ? "Zenbatekoa" : "Importe"}</th>
app/[locale]/admin/billing/page.tsx:96:                    <th className="px-4 py-3 font-semibold">{isEu ? "Epemuga" : "Vencimiento"}</th>
app/[locale]/admin/billing/page.tsx:97:                    <th className="px-4 py-3 font-semibold">{isEu ? "Azken mugimendua" : "Ultimo movimiento"}</th>
app/[locale]/admin/billing/page.tsx:104:                        {isEu ? "Ez dago kobrantza daturik." : "No hay datos de cobros."}
app/[locale]/admin/billing/page.tsx:145:  const toneClass = tone === "warning" ? "bg-[#2a1b21]" : "bg-surface";
app/[locale]/admin/billing/page.tsx:156:  return new Intl.NumberFormat(locale === "eu" ? "eu-ES" : "es-ES", {
app/[locale]/admin/billing/page.tsx:163:  return new Intl.DateTimeFormat(locale === "eu" ? "eu-ES" : "es-ES", {
app/[locale]/admin/students/page.tsx:30:          {isEu ? "Kudeaketa" : "Gestion"}
app/[locale]/admin/students/page.tsx:33:          {isEu ? "Ikasleen administrazioa" : "Administracion de alumnos"}
app/[locale]/admin/students/page.tsx:43:        <StatCard label={isEu ? "Ikasle aktiboak" : "Alumnos activos"} value={String(data.totals.activeStudents)} />
app/[locale]/admin/students/page.tsx:44:        <StatCard label={isEu ? "Matrikula aktiboak" : "Matriculas activas"} value={String(data.totals.activeEnrollments)} />
app/[locale]/admin/students/page.tsx:45:        <StatCard label={isEu ? "Egoitza aktiboak" : "Sedes representadas"} value={String(data.totals.representedSites)} />
app/[locale]/admin/students/page.tsx:61:                    <p>{isEu ? "Egoitza" : "Sede"}: {student.siteName}</p>
app/[locale]/admin/students/page.tsx:62:                    <p>Email: {student.familyEmail}</p>
app/[locale]/admin/students/page.tsx:63:                    <p>{isEu ? "Ikasturtea" : "Curso"}: {student.schoolCourse ?? "-"}</p>
app/[locale]/admin/students/page.tsx:64:                    <p>{isEu ? "Plana" : "Plan"}: {student.tuitionPlanName ?? "-"}</p>
app/[locale]/admin/students/page.tsx:66:                      {isEu ? "Kuota" : "Cuota"}: {student.tuitionAmountCents !== null ? formatCurrency(student.tuitionAmountCents, locale) : "-"}
app/[locale]/admin/students/page.tsx:78:                  {isEu ? "Ikasleen administrazio taula" : "Tabla de administracion de alumnos"}
app/[locale]/admin/students/page.tsx:82:                    <th className="px-4 py-3 font-semibold">{isEu ? "Ikaslea" : "Alumno"}</th>
app/[locale]/admin/students/page.tsx:83:                    <th className="px-4 py-3 font-semibold">{isEu ? "Egoitza" : "Sede"}</th>
app/[locale]/admin/students/page.tsx:84:                    <th className="px-4 py-3 font-semibold">Email</th>
app/[locale]/admin/students/page.tsx:85:                    <th className="px-4 py-3 font-semibold">{isEu ? "Ikasturtea" : "Curso"}</th>
app/[locale]/admin/students/page.tsx:86:                    <th className="px-4 py-3 font-semibold">{isEu ? "Plana" : "Plan"}</th>
app/[locale]/admin/students/page.tsx:87:                    <th className="px-4 py-3 font-semibold">{isEu ? "Kuota" : "Cuota"}</th>
app/[locale]/admin/students/page.tsx:132:  return new Intl.NumberFormat(locale === "eu" ? "eu-ES" : "es-ES", {
app/[locale]/admin/error.tsx:16:  const locale = isEu ? "eu" : "es";
app/[locale]/admin/error.tsx:37:          {isEu ? "Errorea" : "Error"}
app/[locale]/admin/error.tsx:40:          {isEu ? "Ezin izan dugu admin panela kargatu" : "No hemos podido cargar el panel de admin"}
app/[locale]/admin/error.tsx:48:          <p className="mt-3 text-xs text-rose-200/80">ID: {error.digest}</p>
app/[locale]/admin/error.tsx:57:            {isEu ? "Berriro saiatu" : "Reintentar"}
app/[locale]/admin/error.tsx:63:            {isEu ? "Adminera itzuli" : "Volver a admin"}
app/[locale]/admin/groups/page.tsx:30:          {isEu ? "Kudeaketa" : "Gestion"}
app/[locale]/admin/groups/page.tsx:33:          {isEu ? "Taldeen administrazioa" : "Administracion de grupos"}
app/[locale]/admin/groups/page.tsx:43:        <StatCard label={isEu ? "Talde aktiboak" : "Grupos activos"} value={String(data.totals.activeGroups)} />
app/[locale]/admin/groups/page.tsx:44:        <StatCard label={isEu ? "Edukiera osoa" : "Capacidad total"} value={String(data.totals.totalCapacity)} />
app/[locale]/admin/groups/page.tsx:45:        <StatCard label={isEu ? "7 eguneko saioak" : "Sesiones 7 dias"} value={String(data.totals.next7DaysSessions)} />
app/[locale]/admin/groups/page.tsx:52:              {isEu ? "Ez dago talde aktiborik une honetan." : "No hay grupos activos en este momento."}
app/[locale]/admin/groups/page.tsx:63:                <Info label={isEu ? "Maila" : "Nivel"} value={group.level ?? "-"} />
app/[locale]/admin/groups/page.tsx:64:                <Info label={isEu ? "Edukiera" : "Capacidad"} value={String(group.capacity)} />
app/[locale]/admin/groups/page.tsx:65:                <Info label={isEu ? "Arduraduna" : "Responsable"} value={group.leadTeacherName ?? "-"} />
app/[locale]/admin/groups/page.tsx:67:                  label={isEu ? "Hurrengo saioa" : "Proxima sesion"}
app/[locale]/admin/groups/page.tsx:98:  return new Intl.DateTimeFormat(locale === "eu" ? "eu-ES" : "es-ES", {
app/[locale]/admin/page.tsx:31:        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">Admin Dashboard</p>
app/[locale]/admin/page.tsx:50:          title={isEu ? "Ikasleak" : "Alumnos"}
app/[locale]/admin/page.tsx:56:          cta={isEu ? "Ireki modulua" : "Abrir modulo"}
app/[locale]/admin/page.tsx:60:          title={isEu ? "Taldeak" : "Grupos"}
app/[locale]/admin/page.tsx:66:          cta={isEu ? "Ireki modulua" : "Abrir modulo"}
app/[locale]/admin/page.tsx:70:          title={isEu ? "Kobrantzak" : "Cobros"}
app/[locale]/admin/page.tsx:76:          cta={isEu ? "Ireki modulua" : "Abrir modulo"}
app/[locale]/admin/page.tsx:91:                    <p>Alumnos: {site.activeStudents}</p>
app/[locale]/admin/page.tsx:92:                    <p>Grupos: {site.activeGroups}</p>
app/[locale]/admin/page.tsx:93:                    <p>Cobrados: {site.paidReceipts}</p>
app/[locale]/admin/page.tsx:94:                    <p>Pendientes: {site.pendingReceipts}</p>
app/[locale]/admin/page.tsx:105:                  {isEu ? "Egoitza bakoitzeko kudeaketa laburpena" : "Resumen de gestion por cada sede"}
app/[locale]/admin/page.tsx:109:                    <th className="px-4 py-3 font-semibold">Sede</th>
app/[locale]/admin/page.tsx:110:                    <th className="px-4 py-3 font-semibold">Alumnos</th>
app/[locale]/admin/page.tsx:111:                    <th className="px-4 py-3 font-semibold">Grupos</th>
app/[locale]/admin/page.tsx:112:                    <th className="px-4 py-3 font-semibold">Cobrados</th>
app/[locale]/admin/page.tsx:113:                    <th className="px-4 py-3 font-semibold">Pendientes</th>
app/[locale]/admin/page.tsx:152:  const toneClass = tone === "warning" ? "bg-[#2a1b21]" : "bg-surface";
app/[locale]/not-found.tsx:27:        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">Error 404</p>
app/[locale]/not-found.tsx:29:          {isEu ? "Ez dugu orri hori aurkitu" : "No hemos encontrado esa pagina"}
app/[locale]/not-found.tsx:42:            {isEu ? "Hasierara itzuli" : "Volver al inicio"}
app/[locale]/not-found.tsx:48:            {isEu ? "Sedeak ikusi" : "Ver sedes"}
app/[locale]/not-found.tsx:54:            {isEu ? "Familien sarbidea" : "Acceso familias"}
components/site-footer.tsx:100:  const footerTitle = locale === "eu" ? "Azken kolpea" : "Cierre final";
components/site-footer.tsx:109:  const appsLabel = locale === "eu" ? "Aplikazioak" : "Apps";
components/site-footer.tsx:110:  const legalLabel = locale === "eu" ? "Lege loturak" : "Enlaces legales";
components/site-footer.tsx:111:  const termsLabel = locale === "eu" ? "Baldintzak" : "Terminos";
components/site-footer.tsx:112:  const privacyLabel = locale === "eu" ? "Pribatutasuna" : "Privacidad";
components/site-footer.tsx:113:  const backTopLabel = locale === "eu" ? "Gora" : "Arriba";
components/site-footer.tsx:128:            <div className={revealed ? "fade-rise fade-rise-delay-100" : "opacity-0 translate-y-6"}>
components/site-footer.tsx:136:                <nav className="flex items-center gap-3 md:gap-4" aria-label="Social links">
components/site-footer.tsx:143:                      className={`k-focus-ring inline-flex h-9 w-9 items-center justify-center text-white/85 transition-transform duration-300 hover:scale-110 hover:text-white ${revealed ? "fade-rise" : "opacity-0 translate-y-6"}`}
components/site-footer.tsx:174:                  revealed ? "fade-rise fade-rise-delay-500" : "opacity-0 translate-y-6"
components/site-header-nav.tsx:72:  const publicSiteLabel = locale === "eu" ? "Web nagusia" : "Pagina principal";
components/site-header-nav.tsx:76:      label: locale === "eu" ? "Ikasleak" : "Alumnos",
components/site-header-nav.tsx:81:      label: locale === "eu" ? "Taldeak" : "Grupos",
components/site-header-nav.tsx:86:      label: locale === "eu" ? "Kobrantzak" : "Cobros",
components/site-header-nav.tsx:93:      label: locale === "eu" ? "Datu pertsonalak" : "Datos personales",
components/site-header-nav.tsx:98:      label: locale === "eu" ? "Ordainketak" : "Pagos",
components/site-header-nav.tsx:103:      label: locale === "eu" ? "Komunikazioak" : "Comunicaciones",
components/site-header-nav.tsx:113:  const storeLabel = locale === "eu" ? "Erropak" : "Ropa";
components/site-header-nav.tsx:117:    active ? "border-brand text-foreground" : "border-transparent text-ink-muted hover:text-foreground",
components/site-header-nav.tsx:120:  const revealClass = show ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0";
components/site-header-nav.tsx:125:      label: locale === "eu" ? "Hasiera" : "Inicio",
components/site-header-nav.tsx:182:        style={{ transitionDelay: show ? "0ms" : "0ms" }}
components/site-header-nav.tsx:185:        <span className={clsx("relative overflow-hidden rounded-full transition-all duration-500", compact ? "h-9 w-9" : "h-11 w-11")}>
components/site-header-nav.tsx:186:          <Image src="/logo-kodaore.png" alt="Kodaore logo" fill priority sizes="44px" className="object-contain" />
components/site-header-nav.tsx:191:            compact ? "text-lg md:text-xl" : "text-xl md:text-2xl",
components/site-header-nav.tsx:194:          <span className="text-brand-emphasis">Ko</span>
components/site-header-nav.tsx:195:          <span>dao</span>
components/site-header-nav.tsx:196:          <span className="text-brand-warm">re</span>
components/site-header-nav.tsx:207:                style={{ transitionDelay: show ? "180ms" : "0ms" }}
components/site-header-nav.tsx:224:                style={{ transitionDelay: show ? "520ms" : "0ms" }}
components/site-header-nav.tsx:245:          style={{ transitionDelay: show ? "560ms" : "0ms" }}
components/site-header-nav.tsx:251:          style={{ transitionDelay: show ? "650ms" : "0ms" }}
components/site-header-nav.tsx:255:            className={clsx("k-focus-ring rounded px-1 py-0.5 transition-colors", locale === "eu" ? "text-brand-emphasis" : "text-ink-muted hover:text-foreground")}
components/site-header-nav.tsx:262:            className={clsx("k-focus-ring rounded px-1 py-0.5 transition-colors", locale === "es" ? "text-brand-emphasis" : "text-ink-muted hover:text-foreground")}
components/site-header-nav.tsx:271:            style={{ transitionDelay: show ? "720ms" : "0ms" }}
components/site-header-nav.tsx:284:            aria-label={locale === "eu" ? "Menua" : "Menu"}
components/site-header-nav.tsx:287:            {mobileMenuOpen ? (locale === "eu" ? "Itxi" : "Cerrar") : "Menu"}
components/site-header-nav.tsx:319:                      locale === "eu" ? "text-brand-emphasis" : "text-ink-muted hover:text-foreground",
components/site-header-nav.tsx:330:                      locale === "es" ? "text-brand-emphasis" : "text-ink-muted hover:text-foreground",
components/erropak-gallery.tsx:61:  const allCategoryLabel = isEu ? "Guztiak" : "Todo";
components/erropak-gallery.tsx:234:      transform: hoverPreviewExpanded ? "scale(1)" : "scale(0.96)",
components/erropak-gallery.tsx:314:              hoveredIndex === index ? "border-brand/45" : "border-white/10"
components/erropak-gallery.tsx:350:          aria-label={isEu ? "Irudi ikuslea" : "Visor de imagen"}
components/erropak-gallery.tsx:357:            {isEu ? "Itxi" : "Cerrar"}
components/erropak-gallery.tsx:364:            aria-label={isEu ? "Aurrekoa" : "Anterior"}
components/erropak-gallery.tsx:390:            aria-label={isEu ? "Hurrengoa" : "Siguiente"}
components/smart-image.tsx:45:      setParallaxY((previous) => (Math.abs(previous - next) < 0.2 ? previous : next));
components/smart-image.tsx:106:    <div ref={wrapperRef} className={fill ? "absolute inset-0" : "relative block"}>
components/animated-site-header.tsx:68:        deepScrolled ? "border-white/10 bg-surface/60 backdrop-blur-xl" : "border-transparent bg-surface/70 backdrop-blur-sm",
components/animated-site-header.tsx:69:        show ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-5 opacity-0",
components/animated-site-header.tsx:72:      <div className={clsx("mx-auto w-full max-w-6xl px-5 transition-all duration-[450ms] md:px-8", compact ? "py-1.5" : "py-3")}>
components/animated-site-header.tsx:73:        <div className={clsx("transition-all duration-[450ms]", compact ? "p-2" : "p-3")}>
components/home-hero.tsx:54:        ready ? "opacity-100 fade-rise fade-rise-delay-100" : "opacity-0"
components/home-hero.tsx:65:            alt="Kodaore hero visual"
components/home-hero.tsx:78:              alt="Kodaore side visual"
components/home-hero.tsx:89:              <div className={`relative aspect-square w-full max-w-[82px] overflow-hidden rounded-full md:max-w-[96px] ${ready ? "fade-rise fade-rise-delay-400" : "opacity-0"}`}>
components/home-hero.tsx:92:                  alt="Kodaore logo"
components/home-hero.tsx:102:                <h1 className={`font-heading text-lg leading-tight text-foreground md:text-xl ${ready ? "fade-rise fade-rise-delay-500" : "opacity-0"}`}>
components/initial-loader.tsx:263:      aria-label="Kodaore loading screen"
components/initial-loader.tsx:278:              alt="Kodaore logo"
components/initial-loader.tsx:295:          <span className="kodaore-loader-ko">Ko</span>
components/initial-loader.tsx:296:          <span>dao</span>
components/initial-loader.tsx:297:          <span className="kodaore-loader-re">re</span>
components/fototeca-gallery.tsx:142:                large ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
components/fototeca-gallery.tsx:143:              } ${wide ? "md:col-span-2" : "md:col-span-1"}`}
components/fototeca-gallery.tsx:169:          aria-label={locale === "eu" ? "Argazki ikuslea" : "Visor de fotos"}
components/fototeca-gallery.tsx:176:            {locale === "eu" ? "Itxi" : "Cerrar"}
components/fototeca-gallery.tsx:183:            aria-label={locale === "eu" ? "Aurrekoa" : "Anterior"}
components/fototeca-gallery.tsx:209:            aria-label={locale === "eu" ? "Hurrengoa" : "Siguiente"}
components/fototeca-gallery.tsx:218:            {locale === "eu" ? "Ezkerrera/eskuinera irristatu" : "Desliza izquierda/derecha"}
components/auth-credentials-form.tsx:60:        <span>{locale === "eu" ? "Sarbide-identifikatzailea" : "Identificador de acceso"}</span>
components/auth-credentials-form.tsx:65:          placeholder={locale === "eu" ? "Idatzi zure datua" : "Escribe tu dato de acceso"}
components/auth-credentials-form.tsx:78:        <span>{locale === "eu" ? "Pasahitza" : "Contrasena"}</span>
components/auth-signout-button.tsx:22:      {locale === "eu" ? "Saioa itxi" : "Cerrar sesion"}
components/auth-signup-form.tsx:121:        setError(locale === "eu" ? "Captcha ezin izan da kargatu." : "No se pudo cargar el captcha.");
components/auth-signup-form.tsx:144:      setError(locale === "eu" ? "Telefonoa derrigorrezkoa da." : "El telefono es obligatorio.");
components/auth-signup-form.tsx:149:      setError(locale === "eu" ? "Pasahitzak ez datoz bat." : "Las contrasenas no coinciden.");
components/auth-signup-form.tsx:163:      setError(locale === "eu" ? "Mesedez, osatu captcha." : "Por favor, completa el captcha.");
components/auth-signup-form.tsx:223:          <span>{locale === "eu" ? "Izena" : "Nombre"}</span>
components/auth-signup-form.tsx:235:          <span>{locale === "eu" ? "Abizena" : "Apellidos"}</span>
components/auth-signup-form.tsx:248:        <span>Email</span>
components/auth-signup-form.tsx:260:        <span>{locale === "eu" ? "Telefonoa" : "Telefono"}</span>
components/auth-signup-form.tsx:273:          <span>{locale === "eu" ? "Pasahitza" : "Contrasena"}</span>
components/auth-signup-form.tsx:286:          <span>{locale === "eu" ? "Pasahitza berriro" : "Repite contrasena"}</span>
components/auth-signup-form.tsx:309:            {locale === "eu" ? "Onartzen ditut " : "Acepto los "}
components/auth-signup-form.tsx:311:              {locale === "eu" ? "zerbitzuaren baldintzak" : "terminos del servicio"}
components/auth-signup-form.tsx:326:            {locale === "eu" ? "Onartzen dut " : "Acepto la "}
components/auth-signup-form.tsx:328:              {locale === "eu" ? "pribatutasun politika" : "politica de privacidad"}
components/auth-signup-form.tsx:366:            {locale === "eu" ? "Saioa hasi" : "Ir a acceso"}
```

## 3) Prioridad: datos placeholder a sustituir

- Entrenadores y perfiles de ejemplo en lib/i18n.ts
- Correo de contacto en lib/i18n.ts y paginas legales
- Textos legales placeholder en app/[locale]/legal/privacy/page.tsx y app/[locale]/legal/terms/page.tsx
- Imagenes repetidas /media/judo-4.jpg, /media/judo-5.jpg, /media/judo-6.jpg

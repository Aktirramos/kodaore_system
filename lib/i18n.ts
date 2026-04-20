export const supportedLocales = ["eu", "es"] as const;

export type LocaleCode = (typeof supportedLocales)[number];

export function isLocale(value: string): value is LocaleCode {
  return supportedLocales.includes(value as LocaleCode);
}

const copy = {
  eu: {
    brand: "Kodaore",
    tagline: "Kirola, diziplina eta talde espiritua",
    description:
      "Azkoitia, Azpeitia eta Zumaia egoitzetan entrenamendu esperientzia bateratua: kalitatea, konfiantza eta motibazioa.",
    home: {
      heroTitle: "Klub bat, hiru egoitza, entrenatzeko gogo handia",
      heroDescription:
        "Kodaore kirol klub bat da: teknikatik harago, diziplina, errespetua eta auto-konfiantza landuz hazteko espazioa.",
      quickPanelTitle: "Entrenamendu filosofia",
      quickPanelItems: [
        "Maila eta adin bakoitzerako talde egokiak",
        "Teknika eta gorputz-kontrola modu progresiboan",
        "Irakasle talde hurbila eta motibatzailea",
      ],
      factChips: ["Azkoitia", "Azpeitia", "Zumaia"],
      metrics: [
        { label: "Egoitzak", value: "3" },
        { label: "Mailak", value: "Hasiberri-Aurreratu" },
        { label: "Giroa", value: "Kirol familiarra" },
      ],
      showcaseTitle: "Klubaren irudi estiloa",
      showcaseDescription:
        "Azal garbia, argazki handiak eta bloke bakoitzak bere funtzioa: kirol web baten lehen inpresio sendoa.",
      showcaseCards: [
        { title: "Entrenamendu saio biziak" },
        { title: "Teknika eta talde lana" },
        {
          title: "Gure identitatea",
          description: "Kodaore: diziplina, errespetua eta giro familiarra hiru egoitzetan.",
        },
      ],
      pillars: [
        {
          title: "Entrenamendu kalitatea",
          value: "Saio dinamikoak, helburu argiak eta eboluzio neurgarria ikasturte osoan.",
        },
        {
          title: "Balioak eta errespetua",
          value: "Indarra eta diziplina lantzen dira, beti errespetuan eta talde lanean oinarrituta.",
        },
        {
          title: "Familientzako erraztasuna",
          value: "Ordutegi eta egoitza aukerak erraz konbinatzeko antolaketa argia.",
        },
      ],
      sitesTitle: "Gure egoitzak",
      sitesDescription: "Egoitza bakoitzak bere talde teknikoa eta entrenamendu estiloa ditu.",
      coachesTitle: "Entrenatzaileak",
      sites: [
        {
          slug: "azkoitia",
          name: "Azkoitia",
          description: "Talde trinkoak eta giro bizia, entrenamenduari erritmo ona emateko.",
          coaches: [
            {
              name: "Gabriel Carmona",
              profile: "Lehen irakaslea",
              focus: "2. DANa",
              experience: "Monitore irakaslea",
              disciplines: [
                {
                  name: "Judo",
                  summary: "Irakaskuntza esperientzia",
                  details: ["Irakasten 2022tik."],
                },
                {
                  name: "Defentsa pertsonala",
                  summary: "1. DAN eta emakumeen defentsa pertsonalean espezialista",
                  details: ["Gerriko beltza 1. DAN.", "Emakumeen defentsa pertsonalean espezialista."],
                },
              ],
              photo: "/media/profesores/anonimo.png",
            },
            {
              name: "Janire Carmona",
              profile: "Laguntzailea",
              focus: "1. DANa",
              experience: "Monitore irakaslea",
              disciplines: [
                {
                  name: "Judo",
                  summary: "Teknikari formakuntza",
                  details: ["Judoan 1. mailako kirol teknikaria.", "Irakasten 2025etik."],
                },
                {
                  name: "Defentsa pertsonala",
                  summary: "Teknikari formakuntza",
                  details: ["Defentsa pertsonalean 1. mailako kirol teknikaria.", "Irakasten 2025etik."],
                },
              ],
              photo: "/media/profesores/anonimo.png",
            },
          ],
        },
        {
          slug: "azpeitia",
          name: "Azpeitia",
          description: "Hasiberritik aurreratura, progresio argiarekin eta motibazio handiarekin.",
          coaches: [
            {
              name: "Gorka Arregi",
              profile: "Lehen irakaslea",
              focus: "6. DANa, Maisu entrenatzaile nazionala",
              experience: "Epaile autonomikoa, Kata epaile nazionala (Nage no Kata eta Kime no Kata)",
              disciplines: [
                {
                  name: "Judo",
                  summary: "Ibilbide luzea judoan",
                  details: ["Judoa 1991tik.", "Judoa irakasten 2002tik."],
                },
              ],
              photo: "/media/profesores/anonimo.png",
            },
            {
              name: "Gaizka Larrañaga",
              profile: "Laguntzailea",
              focus: "2. DANa, Mahai epailea",
              experience: "Monitore irakaslea",
              disciplines: [
                {
                  name: "Judo",
                  summary: "Lehiaketako eta irakaskuntzako esperientzia",
                  details: ["2. DANa.", "Mahai epailea.", "Monitore irakaslea."],
                },
              ],
              photo: "/media/profesores/anonimo.png",
            },
            {
              name: "Aner Arregi",
              profile: "Laguntzailea",
              focus: "2. DANa",
              experience: "Monitore irakaslea",
              disciplines: [
                {
                  name: "Judo",
                  summary: "Oinarri sendoa eta irakaskuntza",
                  details: ["Judoa 2010etik.", "Judoa irakasten 2022tik.", "Judoan 1. mailako kirol teknikaria."],
                },
                {
                  name: "Defentsa pertsonala",
                  summary: "Teknikari formakuntza",
                  details: ["Defentsa pertsonalean 1. mailako kirol teknikaria."],
                },
              ],
              photo: "/media/profesores/anonimo.png",
            },
          ],
        },
        {
          slug: "zumaia",
          name: "Zumaia",
          description: "Giro segurua eta energetikoa, ikasteko eta disfrutatzeko espazio ezin hobea.",
          coaches: [
            {
              name: "Juantxo Calero",
              profile: "Lehen irakaslea",
              focus: "3. DANa, Maisu entrenatzaile nazionala",
              experience: "Epaile autonomikoa, Kata epaile nazionala (Nage no Kata eta Katame no Kata)",
              disciplines: [
                {
                  name: "Judo",
                  summary: "Ibilbide historikoa",
                  details: [
                    "1985etik judoan.",
                    "Judoa irakasten 2013tik.",
                    "Kata epailea: Nage No Kata (2018), Katame No Kata (2018), Kime No Kata (2020).",
                  ],
                },
                {
                  name: "Defentsa pertsonala",
                  summary: "Titulazioa eta irakaskuntza",
                  details: ["1. DAN eta monitorea."],
                },
                {
                  name: "Defentsa pertsonal poliziala",
                  summary: "Titulazioa eta irakaskuntza",
                  details: ["1. DAN eta monitorea."],
                },
              ],
              photo: "/media/profesores/anonimo.png",
            },
            {
              name: "Erik Leon",
              profile: "Laguntzailea",
              focus: "3. DANa, Epaile autonomikoa",
              experience: "Monitore irakaslea",
              disciplines: [
                {
                  name: "Judo",
                  summary: "Prestakuntza eta jarraipena",
                  details: ["Judoa 2003tik."],
                },
                {
                  name: "Defentsa pertsonala",
                  summary: "Prestakuntza espezifikoa",
                  details: [
                    "1. DAN.",
                    "Emakumeen defentsa pertsonalean espezialista.",
                    "Irakasten 2020tik.",
                  ],
                },
              ],
              photo: "/media/profesores/anonimo.png",
            },
            {
              name: "Izan Calero",
              profile: "Laguntzailea",
              focus: "2. DANa",
              experience: "Monitore irakaslea",
              disciplines: [
                {
                  name: "Judo",
                  summary: "Teknikari profila",
                  details: ["Judoa 2008tik.", "Judoan 1. mailako kirol teknikaria.", "Irakasten 2020tik."],
                },
                {
                  name: "Defentsa pertsonala",
                  summary: "Teknikari profila",
                  details: ["Defentsa pertsonalean 1. mailako kirol teknikaria.", "Irakasten 2020tik."],
                },
              ],
              photo: "/media/profesores/anonimo.png",
            },
          ],
        },
      ],
      photoTitle: "Benetako irudiekin, benetako emozioa",
      photoDescription:
        "Klubeko argazki errealek zure seme-alaben hurrengo kirol etxea dena erakusten dute.",
      photoHint: "Lehen saioari buruz galdetzeko: Kodaorejudoelkartea@gmail.com",
    },
    ctas: {
      discover: "Egoitzak",
      access: "Familien gunea",
      gallery: "Fototeka",
      contact: "Lehen saioa eskatu",
    },
    sections: {
      pillars: "Hasierako oinarriak",
      status: "Abiapuntua martxan",
    },
    labels: {
      sites: "Egoitzak",
      paymentModel: "Kuota ereduak",
      priorityLang: "Hizkuntza lehentasuna",
      roleModel: "Rol eredua",
    },
    values: {
      sites: "Azkoitia, Azpeitia, Zumaia",
      paymentModel: "Hilekoa, hiruhilekoa, urtekoa",
      priorityLang: "Euskara lehenetsi, gaztelania lagungarri",
      roleModel: "6 rol + etiketak irakasleentzat",
    },
  },
  es: {
    brand: "Kodaore",
    tagline: "Deporte, disciplina y espiritu de equipo",
    description:
      "Una experiencia de club unificada en Azkoitia, Azpeitia y Zumaia: entrenamiento de calidad, motivacion y evolucion real.",
    home: {
      heroTitle: "Un club deportivo que engancha desde el primer entrenamiento",
      heroDescription:
        "Kodaore es un club donde se entrena tecnica, disciplina y confianza en equipo, con una experiencia cuidada en las tres sedes.",
      quickPanelTitle: "Filosofia de entrenamiento",
      quickPanelItems: [
        "Grupos adaptados por edad y nivel",
        "Progresion tecnica y fisica paso a paso",
        "Equipo de profesorado cercano y motivador",
      ],
      factChips: ["Azkoitia", "Azpeitia", "Zumaia"],
      metrics: [
        { label: "Sedes", value: "3" },
        { label: "Niveles", value: "Iniciacion-Avanzado" },
        { label: "Ambiente", value: "Club familiar" },
      ],
      showcaseTitle: "Estilo visual del club",
      showcaseDescription:
        "Portada limpia con fotografia protagonista y bloques con rol claro, inspirada en una web deportiva real.",
      showcaseCards: [
        { title: "Sesiones intensas de entrenamiento" },
        { title: "Tecnica y trabajo en equipo" },
        {
          title: "Nuestra identidad",
          description: "Kodaore en tres sedes: disciplina, respeto y ambiente familiar.",
        },
      ],
      pillars: [
        {
          title: "Entrenamiento de calidad",
          value: "Sesiones dinamicas con objetivos claros y evolucion constante.",
        },
        {
          title: "Valores y respeto",
          value: "Fuerza, disciplina y respeto en un entorno sano y de trabajo en equipo.",
        },
        {
          title: "Comodidad para familias",
          value: "Horarios y sedes presentados de forma clara para decidir rapido.",
        },
      ],
      sitesTitle: "Nuestras sedes",
      sitesDescription: "Cada sede cuenta con su propio equipo tecnico y dinamica de entrenamiento.",
      coachesTitle: "Entrenadores",
      sites: [
        {
          slug: "azkoitia",
          name: "Azkoitia",
          description: "Grupos dinamicos y energia de club para entrenar con ritmo.",
          coaches: [
            {
              name: "Gabriel Carmona",
              profile: "Profesor principal",
              focus: "2.º DAN",
              experience: "Monitor titulado",
              disciplines: [
                {
                  name: "Judo",
                  summary: "Experiencia docente",
                  details: ["Ensenando desde 2022."],
                },
                {
                  name: "Defensa personal",
                  summary: "Cinturon negro 1.º Dan y especialidad",
                  details: ["Cinturon negro 1.º Dan.", "Especialista en defensa personal de la mujer."],
                },
              ],
              photo: "/media/profesores/anonimo.png",
            },
            {
              name: "Janire Carmona",
              profile: "Profesora asistente",
              focus: "1.º DAN",
              experience: "Monitor titulada",
              disciplines: [
                {
                  name: "Judo",
                  summary: "Formacion tecnica",
                  details: ["Tecnico deportivo nivel 1 en judo.", "Ensenando desde 2025."],
                },
                {
                  name: "Defensa personal",
                  summary: "Formacion tecnica",
                  details: ["Tecnico deportivo nivel 1 en defensa personal.", "Ensenando desde 2025."],
                },
              ],
              photo: "/media/profesores/anonimo.png",
            },
          ],
        },
        {
          slug: "azpeitia",
          name: "Azpeitia",
          description: "Programas progresivos para avanzar con seguridad y constancia.",
          coaches: [
            {
              name: "Gorka Arregi",
              profile: "Profesor principal",
              focus: "6.º DAN, Maestro entrenador nacional",
              experience: "Arbitro autonomico, Juez nacional de kata (Nage no Kata y Kime no Kata)",
              disciplines: [
                {
                  name: "Judo",
                  summary: "Trayectoria consolidada",
                  details: ["Judo desde 1991.", "Ensenando judo desde 2002."],
                },
              ],
              photo: "/media/profesores/anonimo.png",
            },
            {
              name: "Gaizka Larrañaga",
              profile: "Profesor asistente",
              focus: "2.º DAN, Juez de mesa",
              experience: "Monitor titulado",
              disciplines: [
                {
                  name: "Judo",
                  summary: "Experiencia competitiva y docente",
                  details: ["2.º DAN.", "Juez de mesa.", "Monitor titulado."],
                },
              ],
              photo: "/media/profesores/anonimo.png",
            },
            {
              name: "Aner Arregi",
              profile: "Profesor asistente",
              focus: "2.º DAN",
              experience: "Monitor titulado",
              disciplines: [
                {
                  name: "Judo",
                  summary: "Base tecnica y docencia",
                  details: ["Judo desde 2010.", "Ensenando desde 2022.", "Tecnico deportivo nivel 1 en judo."],
                },
                {
                  name: "Defensa personal",
                  summary: "Formacion tecnica",
                  details: ["Tecnico deportivo nivel 1 en defensa personal."],
                },
              ],
              photo: "/media/profesores/anonimo.png",
            },
          ],
        },
        {
          slug: "zumaia",
          name: "Zumaia",
          description: "Entorno seguro y motivador para disfrutar entrenando.",
          coaches: [
            {
              name: "Juantxo Calero",
              profile: "Profesor principal",
              focus: "3.º DAN, Maestro entrenador nacional",
              experience: "Arbitro autonomico, Juez nacional de kata (Nage no Kata y Katame no Kata)",
              disciplines: [
                {
                  name: "Judo",
                  summary: "Trayectoria historica",
                  details: [
                    "Desde 1985.",
                    "Ensenando desde 2013.",
                    "Juez de Kata: Nage No Kata (2018), Katame No Kata (2018), Kime No Kata (2020).",
                  ],
                },
                {
                  name: "Defensa personal",
                  summary: "Titulacion y monitor",
                  details: ["1.º Dan y monitor."],
                },
                {
                  name: "Defensa personal policial",
                  summary: "Titulacion y monitor",
                  details: ["1.º Dan y monitor."],
                },
              ],
              photo: "/media/profesores/anonimo.png",
            },
            {
              name: "Erik Leon",
              profile: "Profesor asistente",
              focus: "3.º DAN, Arbitro autonomico",
              experience: "Monitor titulado",
              disciplines: [
                {
                  name: "Judo",
                  summary: "Desarrollo continuado",
                  details: ["Judo desde 2003."],
                },
                {
                  name: "Defensa personal",
                  summary: "Especializacion",
                  details: [
                    "1.º Dan.",
                    "Especialista en defensa personal para la mujer.",
                    "Ensenando desde 2020.",
                  ],
                },
              ],
              photo: "/media/profesores/anonimo.png",
            },
            {
              name: "Izan Calero",
              profile: "Profesor asistente",
              focus: "2.º DAN",
              experience: "Monitor titulado",
              disciplines: [
                {
                  name: "Judo",
                  summary: "Perfil tecnico",
                  details: ["Judo desde 2008.", "Tecnico deportivo nivel 1 en judo.", "Ensenando desde 2020."],
                },
                {
                  name: "Defensa personal",
                  summary: "Perfil tecnico",
                  details: ["Tecnico deportivo nivel 1 en defensa personal.", "Ensenando desde 2020."],
                },
              ],
              photo: "/media/profesores/anonimo.png",
            },
          ],
        },
      ],
      photoTitle: "Con fotos reales, una marca que se siente",
      photoDescription:
        "Con vuestras fotos, la web refleja el caracter deportivo real del club.",
      photoHint: "Para una primera clase de prueba: Kodaorejudoelkartea@gmail.com",
    },
    ctas: {
      discover: "Sedes",
      access: "Area familias",
      gallery: "Fototeca",
      contact: "Pedir primera clase",
    },
    sections: {
      pillars: "Pilares iniciales",
      status: "Punto de partida activo",
    },
    labels: {
      sites: "Sedes",
      paymentModel: "Modelo de cuotas",
      priorityLang: "Idioma prioritario",
      roleModel: "Modelo de roles",
    },
    values: {
      sites: "Azkoitia, Azpeitia, Zumaia",
      paymentModel: "Mensual, trimestral, anual",
      priorityLang: "Euskera principal, castellano complementario",
      roleModel: "6 roles + etiquetas para profesorado",
    },
  },
};

export function getCopy(locale: LocaleCode) {
  return copy[locale];
}

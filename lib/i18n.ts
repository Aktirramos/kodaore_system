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
              focus: "Segundo dan",
              experience: "Monitore irakaslea",
              photo: "/media/judo-4.jpg",
            },
            {
              name: "Janire Carmona",
              profile: "Laguntzailea",
              focus: "Primer dan",
              experience: "Monitore irakaslea",
              photo: "/media/judo-5.jpg",
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
              focus: "Sexto dan, Maisu entrenatzaile nazionala",
              experience: "Epaile autonomikoa, Kata epaile nazionala (Nage no Kata eta Kime no Kata)",
              photo: "/media/judo-5.jpg",
            },
            {
              name: "Gaizka Larrañaga",
              profile: "Laguntzailea",
              focus: "Segundo dan, Mahai epailea",
              experience: "Monitore irakaslea",
              photo: "/media/judo-4.jpg",
            },
            {
              name: "Aner Arregi",
              profile: "Laguntzailea",
              focus: "Segundo dan",
              experience: "Monitore irakaslea",
              photo: "/media/judo-6.jpg",
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
              focus: "Tercer dan, Maisu entrenatzaile nazionala",
              experience: "Epaile autonomikoa, Kata epaile nazionala (Nage no Kata eta Katame no Kata)",
              photo: "/media/judo-6.jpg",
            },
            {
              name: "Erik Leon",
              profile: "Laguntzailea",
              focus: "Tercer dan, Epaile autonomikoa",
              experience: "Monitore irakaslea",
              photo: "/media/judo-4.jpg",
            },
            {
              name: "Izan Calero",
              profile: "Laguntzailea",
              focus: "Segundo dan",
              experience: "Monitore irakaslea",
              photo: "/media/judo-5.jpg",
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
              profile: "Lehen irakaslea",
              focus: "Segundo dan",
              experience: "Monitore irakaslea",
              photo: "/media/judo-4.jpg",
            },
            {
              name: "Janire Carmona",
              profile: "Laguntzailea",
              focus: "Primer dan",
              experience: "Monitore irakaslea",
              photo: "/media/judo-5.jpg",
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
              profile: "Lehen irakaslea",
              focus: "Sexto dan, Maisu entrenatzaile nazionala",
              experience: "Epaile autonomikoa, Kata epaile nazionala (Nage no Kata eta Kime no Kata)",
              photo: "/media/judo-5.jpg",
            },
            {
              name: "Gaizka Larrañaga",
              profile: "Laguntzailea",
              focus: "Segundo dan, Mahai epailea",
              experience: "Monitore irakaslea",
              photo: "/media/judo-4.jpg",
            },
            {
              name: "Aner Arregi",
              profile: "Laguntzailea",
              focus: "Segundo dan",
              experience: "Monitore irakaslea",
              photo: "/media/judo-6.jpg",
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
              profile: "Lehen irakaslea",
              focus: "Tercer dan, Maisu entrenatzaile nazionala",
              experience: "Epaile autonomikoa, Kata epaile nazionala (Nage no Kata eta Katame no Kata)",
              photo: "/media/judo-6.jpg",
            },
            {
              name: "Erik Leon",
              profile: "Laguntzailea",
              focus: "Tercer dan, Epaile autonomikoa",
              experience: "Monitore irakaslea",
              photo: "/media/judo-4.jpg",
            },
            {
              name: "Izan Calero",
              profile: "Laguntzailea",
              focus: "Segundo dan",
              experience: "Monitore irakaslea",
              photo: "/media/judo-5.jpg",
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

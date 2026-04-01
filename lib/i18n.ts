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
              name: "Ane Irure",
              profile: "Teknika arduraduna",
              focus: "Uchi-komi zehaztasuna eta oinarrizko proiekzioak",
              experience: "11 urteko esperientzia",
              photo: "/media/judo-4.jpg",
            },
            {
              name: "Mikel Otamendi",
              profile: "Erritmo eta prestaketa fisikoa",
              focus: "Saio dinamikoak eta koordinazio lana",
              experience: "9 urteko esperientzia",
              photo: "/media/judo-5.jpg",
            },
            {
              name: "Leire Aranburu",
              profile: "Haurren taldeak",
              focus: "Konfiantza, diziplina eta lehen teknikak",
              experience: "7 urteko esperientzia",
              photo: "/media/judo-6.jpg",
            },
          ],
        },
        {
          slug: "azpeitia",
          name: "Azpeitia",
          description: "Hasiberritik aurreratura, progresio argiarekin eta motibazio handiarekin.",
          coaches: [
            {
              name: "Unai Etxeberria",
              profile: "Talde aurreratuak",
              focus: "Randori kontrolatua eta taktika",
              experience: "12 urteko esperientzia",
              photo: "/media/judo-5.jpg",
            },
            {
              name: "Nerea Lizaso",
              profile: "Teknika progresiboa",
              focus: "Postura, oreka eta trantsizioak",
              experience: "8 urteko esperientzia",
              photo: "/media/judo-4.jpg",
            },
            {
              name: "Beñat Lasa",
              profile: "Prestaketa lehiaketarako",
              focus: "Abiadura eta erabaki azkarra",
              experience: "10 urteko esperientzia",
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
              name: "Irati Alberdi",
              profile: "Hasierako mailak",
              focus: "Oinarrizko mugimenduak eta konfiantza",
              experience: "6 urteko esperientzia",
              photo: "/media/judo-6.jpg",
            },
            {
              name: "Jon Ander Salegi",
              profile: "Teknika eta indarra",
              focus: "Kuzushi eta proiekzio sendoak",
              experience: "13 urteko esperientzia",
              photo: "/media/judo-4.jpg",
            },
            {
              name: "Ainhoa Ormazabal",
              profile: "Familia taldeak",
              focus: "Giro positiboa eta progresio jarraitua",
              experience: "9 urteko esperientzia",
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
              name: "Ane Irure",
              profile: "Responsable tecnica",
              focus: "Precision en uchi-komi y proyecciones base",
              experience: "11 anos de experiencia",
              photo: "/media/judo-4.jpg",
            },
            {
              name: "Mikel Otamendi",
              profile: "Ritmo y preparacion fisica",
              focus: "Sesiones dinamicas y trabajo de coordinacion",
              experience: "9 anos de experiencia",
              photo: "/media/judo-5.jpg",
            },
            {
              name: "Leire Aranburu",
              profile: "Grupos infantiles",
              focus: "Confianza, disciplina y primeras tecnicas",
              experience: "7 anos de experiencia",
              photo: "/media/judo-6.jpg",
            },
          ],
        },
        {
          slug: "azpeitia",
          name: "Azpeitia",
          description: "Programas progresivos para avanzar con seguridad y constancia.",
          coaches: [
            {
              name: "Unai Etxeberria",
              profile: "Grupos avanzados",
              focus: "Randori controlado y tactica competitiva",
              experience: "12 anos de experiencia",
              photo: "/media/judo-5.jpg",
            },
            {
              name: "Nerea Lizaso",
              profile: "Tecnica progresiva",
              focus: "Postura, equilibrio y transiciones",
              experience: "8 anos de experiencia",
              photo: "/media/judo-4.jpg",
            },
            {
              name: "Beñat Lasa",
              profile: "Preparacion competitiva",
              focus: "Velocidad y toma de decision rapida",
              experience: "10 anos de experiencia",
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
              name: "Irati Alberdi",
              profile: "Niveles de iniciacion",
              focus: "Base tecnica y seguridad en cada sesion",
              experience: "6 anos de experiencia",
              photo: "/media/judo-6.jpg",
            },
            {
              name: "Jon Ander Salegi",
              profile: "Tecnica y fuerza",
              focus: "Kuzushi y proyecciones con control",
              experience: "13 anos de experiencia",
              photo: "/media/judo-4.jpg",
            },
            {
              name: "Ainhoa Ormazabal",
              profile: "Grupos familiares",
              focus: "Ambiente positivo y progresion continua",
              experience: "9 anos de experiencia",
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

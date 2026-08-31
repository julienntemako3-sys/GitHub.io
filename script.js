/* =========================================================
   WorldArts — script.js
   Complete frontend controller
   Pi SDK 2.0 + i18n + Gallery + Marketplace + UI
   Backend: https://worldarts-backend.onrender.com/api
   ========================================================= */

"use strict";

/* =========================================================
   CONFIGURATION
   ========================================================= */

const API_BASE =
  (window.WORLDARTS_API_BASE || "https://worldarts-backend.onrender.com/api")
    .replace(/\/+$/, "");

const SUPPORTED_LANGUAGES = ["fr", "en", "rn", "sw", "ar", "zh"];
const RTL_LANGUAGES = ["ar"];

const PI_SCOPES = ["username", "payments"];

let currentLanguage = localStorage.getItem("worldarts_language") || "fr";
if (!SUPPORTED_LANGUAGES.includes(currentLanguage)) {
  currentLanguage = "fr";
}

let currentTheme =
  localStorage.getItem("worldarts_theme") ||
  (window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");

let piSdkReady = false;
let piUser = null;
let piAccessToken = null;
let currentPayment = null;
let selectedArtwork = null;
let isAuthenticating = false;
let isLoadingArtworks = false;


/* =========================================================
   TRANSLATIONS
   ========================================================= */

const translations = {
  fr: {
    accessibility: {
      skip: "Aller au contenu principal"
    },
    language: {
      label: "Choisir la langue"
    },
    theme: {
      change: "Changer de thème"
    },
    nav: {
      home: "Accueil",
      gallery: "Galerie",
      artists: "Artistes",
      marketplace: "Marché",
      about: "À propos",
      contact: "Contact",
      connect: "Se connecter avec Pi",
      menu: "Menu"
    },
    hero: {
      eyebrow: "Marché d'art mondial",
      title: "Découvrez, collectionnez et vendez de l'art partout dans le monde",
      subtitle:
        "WorldArts réunit artistes et collectionneurs autour d'œuvres, de musique et de vidéos, avec des paiements en Pi Network et en WART.",
      connect: "Se connecter avec Pi",
      explore: "Explorer la galerie",
      note: "Paiements exclusivement en π (Pi) et WART — aucun dollar, aucun USDT",
      stats: {
        countries: "Pays",
        languages: "Langues",
        payments: "Paiements natifs"
      }
    },
    features: {
      eyebrow: "Ce que vous pouvez faire",
      title: "Une seule application, tout l'art du monde",
      visual: "Visuel",
      audio: "Audio",
      motion: "Vidéo",
      trade: "Commerce",
      art: {
        title: "Découvrir l'art",
        text: "Parcourez des œuvres originales issues d'artistes du monde entier."
      },
      music: {
        title: "Découvrir la musique",
        text: "Écoutez et soutenez des créateurs musicaux indépendants."
      },
      videos: {
        title: "Découvrir les vidéos",
        text: "Explorez des créations vidéo et des performances."
      },
      pi: {
        title: "Acheter & vendre avec Pi",
        text: "Réalisez vos transactions avec Pi Network ou WART."
      },
      gallery: "Galerie",
      marketplace: "Marketplace"
    },
    gallery: {
      eyebrow: "Sélection",
      title: "Le mur de la galerie",
      loading: "Chargement des œuvres...",
      empty: "Aucune œuvre disponible pour le moment.",
      error: "Impossible de charger les œuvres.",
      retry: "Réessayer",
      artist: "Artiste",
      price: "Prix",
      buy: "Acheter avec Pi",
      wart: "Acheter avec WART",
      details: "Voir les détails"
    },
    about: {
      eyebrow: "Notre mission",
      title: "L'art comme langage commun",
      text1:
        "WorldArts réunit les créateurs et les collectionneurs du monde entier dans un même espace.",
      text2:
        "L'application prend en charge six langues et les paiements en Pi Network et WART."
    },
    artists: {
      eyebrow: "Communauté",
      title: "Artistes à l'honneur",
      aline: {
        origin: "Bujumbura, Burundi",
        bio:
          "Artiste peintre utilisant différentes techniques et explorant les traditions de la région des Grands Lacs."
      },
      kenji: {
        origin: "Osaka, Japon",
        bio:
          "Compositeur mélangeant le koto traditionnel et les sonorités électroniques."
      },
      samira: {
        origin: "Le Caire, Égypte",
        bio:
          "Réalisatrice documentant les artisans de la vallée du Nil."
      }
    },
    payment: {
      eyebrow: "Paiements",
      title: "Une monnaie pour un art sans frontières",
      text: "Les paiements WorldArts utilisent Pi Network ou WART.",
      pi: "Pi Network",
      wart: "WorldArts Token",
      noFiat: "Aucun USD · Aucun USDT"
    },
    pi: {
      auth: {
        title: "Authentification Pi",
        text:
          "Connectez votre compte Pi pour effectuer les paiements.",
        connect: "Se connecter avec Pi"
      },
      status: {
        connected: "Connecté",
        disconnected: "Non connecté",
        connecting: "Connexion à Pi...",
        waiting: "— en attente de connexion —",
        error: "Erreur de connexion"
      },
      login: {
        success: "Connexion Pi réussie.",
        cancelled: "Connexion Pi annulée.",
        incomplete: "La connexion Pi n'est pas terminée.",
        unavailable: "Pi SDK n'est pas disponible."
      }
    },
    modal: {
      close: "Fermer",
      login: {
        title: "Connexion Pi",
        text:
          "Authentifiez-vous avec votre compte Pi pour accéder à WorldArts.",
        action: "Continuer avec Pi"
      },
      payment: {
        title: "Confirmer le paiement",
        text:
          "Cette œuvre sera payée directement via le Pi SDK.",
        action: "Payer avec Pi"
      }
    },
    contact: {
      eyebrow: "Nous écrire",
      title: "Une question pour l'équipe WorldArts ?",
      form: {
        name: "Votre nom",
        email: "Votre email",
        message: "Votre message",
        send: "Envoyer le message",
        sent: "Merci, votre message a bien été reçu.",
        error: "Impossible d'envoyer votre message."
      }
    },
    footer: {
      description:
        "Le marché mondial de l'art, de la musique et du cinéma, propulsé par Pi Network.",
      explore: "Explorer",
      company: "Organisation",
      contact: "Contact",
      rights: "© 2026 WorldArts. Tous droits réservés."
    },
    common: {
      close: "Fermer",
      cancel: "Annuler",
      loading: "Chargement...",
      error: "Une erreur est survenue.",
      networkError: "Erreur réseau."
    }
  },

  en: {
    accessibility: {
      skip: "Skip to main content"
    },
    language: {
      label: "Choose language"
    },
    theme: {
      change: "Change theme"
    },
    nav: {
      home: "Home",
      gallery: "Gallery",
      artists: "Artists",
      marketplace: "Marketplace",
      about: "About",
      contact: "Contact",
      connect: "Connect with Pi",
      menu: "Menu"
    },
    hero: {
      eyebrow: "Global art marketplace",
      title: "Discover, collect and sell art everywhere in the world",
      subtitle:
        "WorldArts connects artists and collectors around artwork, music and video, with payments in Pi Network and WART.",
      connect: "Connect with Pi",
      explore: "Explore gallery",
      note: "Payments exclusively in π (Pi) and WART — no dollars, no USDT",
      stats: {
        countries: "Countries",
        languages: "Languages",
        payments: "Native payments"
      }
    },
    features: {
      eyebrow: "What you can do",
      title: "One application, the world's art",
      visual: "Visual",
      audio: "Audio",
      motion: "Video",
      trade: "Commerce",
      art: {
        title: "Discover art",
        text: "Browse original works from artists around the world."
      },
      music: {
        title: "Discover music",
        text: "Listen to and support independent music creators."
      },
      videos: {
        title: "Discover videos",
        text: "Explore video creations and performances."
      },
      pi: {
        title: "Buy & sell with Pi",
        text: "Make transactions with Pi Network or WART."
      },
      gallery: "Gallery",
      marketplace: "Marketplace"
    },
    gallery: {
      eyebrow: "Selection",
      title: "The gallery wall",
      loading: "Loading artworks...",
      empty: "No artworks available yet.",
      error: "Unable to load artworks.",
      retry: "Retry",
      artist: "Artist",
      price: "Price",
      buy: "Buy with Pi",
      wart: "Buy with WART",
      details: "View details"
    },
    about: {
      eyebrow: "Our mission",
      title: "Art as a common language",
      text1:
        "WorldArts brings creators and collectors from around the world together in one place.",
      text2:
        "The application supports six languages and payments in Pi Network and WART."
    },
    artists: {
      eyebrow: "Community",
      title: "Featured artists",
      aline: {
        origin: "Bujumbura, Burundi",
        bio:
          "Painter using different techniques and exploring traditions from the Great Lakes region."
      },
      kenji: {
        origin: "Osaka, Japan",
        bio:
          "Composer combining traditional koto with electronic sounds."
      },
      samira: {
        origin: "Cairo, Egypt",
        bio:
          "Filmmaker documenting artisans of the Nile Valley."
      }
    },
    payment: {
      eyebrow: "Payments",
      title: "One currency for borderless art",
      text: "WorldArts payments use Pi Network or WART.",
      pi: "Pi Network",
      wart: "WorldArts Token",
      noFiat: "No USD · No USDT"
    },
    pi: {
      auth: {
        title: "Pi authentication",
        text: "Connect your Pi account to make payments.",
        connect: "Connect with Pi"
      },
      status: {
        connected: "Connected",
        disconnected: "Not connected",
        connecting: "Connecting to Pi...",
        waiting: "— waiting for connection —",
        error: "Connection error"
      },
      login: {
        success: "Pi connection successful.",
        cancelled: "Pi connection cancelled.",
        incomplete: "Pi connection is incomplete.",
        unavailable: "Pi SDK is not available."
      }
    },
    modal: {
      close: "Close",
      login: {
        title: "Pi connection",
        text:
          "Authenticate with your Pi account to access WorldArts.",
        action: "Continue with Pi"
      },
      payment: {
        title: "Confirm payment",
        text: "This artwork will be paid directly through the Pi SDK.",
        action: "Pay with Pi"
      }
    },
    contact: {
      eyebrow: "Write to us",
      title: "A question for the WorldArts team?",
      form: {
        name: "Your name",
        email: "Your email",
        message: "Your message",
        send: "Send message",
        sent: "Thank you, your message has been received.",
        error: "Unable to send your message."
      }
    },
    footer: {
      description:
        "The global marketplace for art, music and cinema, powered by Pi Network.",
      explore: "Explore",
      company: "Organization",
      contact: "Contact",
      rights: "© 2026 WorldArts. All rights reserved."
    },
    common: {
      close: "Close",
      cancel: "Cancel",
      loading: "Loading...",
      error: "An error occurred.",
      networkError: "Network error."
    }
  },

  rn: {
    accessibility: {
      skip: "Ja ku bikuru"
    },
    language: {
      label: "Hitamwo ururimi"
    },
    theme: {
      change: "Hindura uburyo bw'urumuri"
    },
    nav: {
      home: "Ahabanza",
      gallery: "Galerie",
      artists: "Abahanzi",
      marketplace: "Isoko",
      about: "Ibitwerekeye",
      contact: "Twandikire",
      connect: "Injira ukoresheje Pi",
      menu: "Menu"
    },
    hero: {
      eyebrow: "Isoko ry'ubuhanzi kw'isi",
      title: "Raba, gura kandi ugurishe ubuhanzi kw'isi yose",
      subtitle:
        "WorldArts ihuza abahanzi n'abakunda ubuhanzi, bakoresheje Pi Network na WART.",
      connect: "Injira ukoresheje Pi",
      explore: "Raba Galerie",
      note: "Kwishura bikorwa gusa muri π (Pi) na WART — nta madolari, nta USDT",
      stats: {
        countries: "Ibihugu",
        languages: "Indimi",
        payments: "Uburyo bwo kwishura"
      }
    },
    features: {
      eyebrow: "Ivyo ushobora gukora",
      title: "Application imwe, ubuhanzi bwo kw'isi yose",
      visual: "Amashusho",
      audio: "Umuziki",
      motion: "Video",
      trade: "Ubudandaji",
      art: {
        title: "Raba ubuhanzi",
        text: "Raba ibikorwa vy'abahanzi bo hirya no hino kw'isi."
      },
      music: {
        title: "Raba umuziki",
        text: "Umviriza kandi ushigikire abahanzi b'umuziki."
      },
      videos: {
        title: "Raba video",
        text: "Raba ibikorwa n'ibiteramo vy'amavideo."
      },
      pi: {
        title: "Gura kandi ugurishe ukoresheje Pi",
        text: "Koresha Pi Network canke WART mu bikorwa vyawe."
      },
      gallery: "Galerie",
      marketplace: "Isoko"
    },
    gallery: {
      eyebrow: "Ivyatoranijwe",
      title: "Galerie",
      loading: "Turiko turazana ibikorwa...",
      empty: "Nta bikorwa biraboneka ubu.",
      error: "Ntivyashoboye kuzana ibikorwa.",
      retry: "Subira ugerageze",
      artist: "Umuhanzi",
      price: "Igiciro",
      buy: "Gura ukoresheje Pi",
      wart: "Gura ukoresheje WART",
      details: "Raba birambuye"
    },
    about: {
      eyebrow: "Intumbero yacu",
      title: "Ubuhanzi ni ururimi ruhuza abantu",
      text1:
        "WorldArts ihuza abahanzi n'abakunda ubuhanzi bo kw'isi yose.",
      text2:
        "Application ikoresha indimi zitandatu kandi ikemera Pi Network na WART."
    },
    artists: {
      eyebrow: "Umuryango",
      title: "Abahanzi batoranijwe",
      aline: {
        origin: "Bujumbura, Burundi",
        bio:
          "Umuhanzi akoresha uburyo butandukanye kandi akerekana imico y'akarere k'ibiyaga binini."
      },
      kenji: {
        origin: "Osaka, Japon",
        bio:
          "Umuhimvyi ahuza koto ya kera n'amajwi ya none."
      },
      samira: {
        origin: "Le Caire, Misiri",
        bio:
          "Umuhinguzi wa video yerekana abanyabukorikori bo mu kibaya ca Nil."
      }
    },
    payment: {
      eyebrow: "Kwishura",
      title: "Ifaranga rimwe ku buhanzi butagira imbibe",
      text: "WorldArts ikoresha Pi Network canke WART.",
      pi: "Pi Network",
      wart: "WorldArts Token",
      noFiat: "Nta USD · Nta USDT"
    },
    pi: {
      auth: {
        title: "Kwinjira muri Pi",
        text: "Huza konti ya Pi kugira ukore amahera.",
        connect: "Injira ukoresheje Pi"
      },
      status: {
        connected: "Wamaze kwinjira",
        disconnected: "Nturarinjira",
        connecting: "Turiko turahuza na Pi...",
        waiting: "— turindiriye ukwihuza —",
        error: "Habaye ikibazo mu kwinjira"
      },
      login: {
        success: "Winjiye muri Pi neza.",
        cancelled: "Ukwinjira muri Pi kwahagaritswe.",
        incomplete: "Ukwinjira muri Pi ntikwuzuye.",
        unavailable: "Pi SDK ntibonetse."
      }
    },
    modal: {
      close: "Funga",
      login: {
        title: "Kwinjira muri Pi",
        text: "Injira ukoresheje konti ya Pi kugira ukoreshe WorldArts.",
        action: "Bandanya na Pi"
      },
      payment: {
        title: "Emeza ukwishura",
        text: "Iki gikorwa kizokwishurwa biciye muri Pi SDK.",
        action: "Ishura ukoresheje Pi"
      }
    },
    contact: {
      eyebrow: "Twandikire",
      title: "Ufise ikibazo ushaka kubaza WorldArts?",
      form: {
        name: "Amazina yawe",
        email: "Email yawe",
        message: "Ubutumwa bwawe",
        send: "Rungika ubutumwa",
        sent: "Murakoze, ubutumwa bwanyu bwakiriwe.",
        error: "Ntivyakunze kurungika ubutumwa."
      }
    },
    footer: {
      description:
        "Isoko mpuzamakungu ry'ubuhanzi, umuziki na cinema, rishigikiwe na Pi Network.",
      explore: "Raba",
      company: "Ivyerekeye",
      contact: "Twandikire",
      rights: "© 2026 WorldArts. Uburenganzira bwose burakingiwe."
    },
    common: {
      close: "Funga",
      cancel: "Hagarika",
      loading: "Turiko turategura...",
      error: "Habaye ikibazo.",
      networkError: "Habaye ikibazo ca réseau."
    }
  },

  sw: {
    accessibility: { skip: "Nenda kwenye maudhui makuu" },
    language: { label: "Chagua lugha" },
    theme: { change: "Badilisha mandhari" },
    nav: {
      home: "Mwanzo",
      gallery: "Galeria",
      artists: "Wasanii",
      marketplace: "Soko",
      about: "Kuhusu",
      contact: "Mawasiliano",
      connect: "Unganisha na Pi",
      menu: "Menyu"
    },
    hero: {
      eyebrow: "Soko la sanaa duniani",
      title: "Gundua, kusanya na uza sanaa duniani kote",
      subtitle:
        "WorldArts inaunganisha wasanii na wakusanyaji wa sanaa kwa kutumia Pi Network na WART.",
      connect: "Unganisha na Pi",
      explore: "Gundua galeria",
      note: "Malipo ni kwa π (Pi) na WART pekee — hakuna dola, hakuna USDT",
      stats: {
        countries: "Nchi",
        languages: "Lugha",
        payments: "Malipo"
      }
    },
    features: {
      eyebrow: "Unachoweza kufanya",
      title: "Programu moja, sanaa ya dunia",
      visual: "Picha",
      audio: "Sauti",
      motion: "Video",
      trade: "Biashara",
      art: {
        title: "Gundua sanaa",
        text: "Tazama kazi za wasanii kutoka duniani kote."
      },
      music: {
        title: "Gundua muziki",
        text: "Sikiliza na uwaunge mkono waundaji wa muziki."
      },
      videos: {
        title: "Gundua video",
        text: "Chunguza video na maonyesho."
      },
      pi: {
        title: "Nunua na uza kwa Pi",
        text: "Fanya miamala kwa Pi Network au WART."
      },
      gallery: "Galeria",
      marketplace: "Soko"
    },
    gallery: {
      eyebrow: "Uteuzi",
      title: "Ukuta wa galeria",
      loading: "Inapakia kazi...",
      empty: "Hakuna kazi kwa sasa.",
      error: "Imeshindwa kupakia kazi.",
      retry: "Jaribu tena",
      artist: "Msanii",
      price: "Bei",
      buy: "Nunua kwa Pi",
      wart: "Nunua kwa WART",
      details: "Angalia maelezo"
    },
    about: {
      eyebrow: "Dhamira yetu",
      title: "Sanaa ni lugha ya pamoja",
      text1:
        "WorldArts inaunganisha wasanii na wakusanyaji kutoka duniani kote.",
      text2:
        "Programu inasaidia lugha sita na malipo ya Pi Network na WART."
    },
    artists: {
      eyebrow: "Jumuiya",
      title: "Wasanii wanaoangaziwa",
      aline: {
        origin: "Bujumbura, Burundi",
        bio:
          "Msanii anayechanganya mbinu mbalimbali na mila za eneo la Maziwa Makuu."
      },
      kenji: {
        origin: "Osaka, Japan",
        bio:
          "Mtunzi anayechanganya koto ya jadi na sauti za elektroniki."
      },
      samira: {
        origin: "Cairo, Misri",
        bio:
          "Mtayarishaji wa filamu anayeandika kuhusu mafundi wa Bonde la Nile."
      }
    },
    payment: {
      eyebrow: "Malipo",
      title: "Sarafu moja kwa sanaa isiyo na mipaka",
      text: "WorldArts hutumia Pi Network au WART.",
      pi: "Pi Network",
      wart: "WorldArts Token",
      noFiat: "Hakuna USD · Hakuna USDT"
    },
    pi: {
      auth: {
        title: "Uthibitishaji wa Pi",
        text: "Unganisha akaunti yako ya Pi kufanya malipo.",
        connect: "Unganisha na Pi"
      },
      status: {
        connected: "Imeunganishwa",
        disconnected: "Haijaunganishwa",
        connecting: "Inaunganisha na Pi...",
        waiting: "— inasubiri muunganisho —",
        error: "Hitilafu ya muunganisho"
      },
      login: {
        success: "Muunganisho wa Pi umefanikiwa.",
        cancelled: "Muunganisho wa Pi umeghairiwa.",
        incomplete: "Muunganisho wa Pi haujakamilika.",
        unavailable: "Pi SDK haipatikani."
      }
    },
    modal: {
      close: "Funga",
      login: {
        title: "Muunganisho wa Pi",
        text: "Thibitisha akaunti yako ya Pi kutumia WorldArts.",
        action: "Endelea na Pi"
      },
      payment: {
        title: "Thibitisha malipo",
        text: "Kazi hii italipwa moja kwa moja kupitia Pi SDK.",
        action: "Lipa kwa Pi"
      }
    },
    contact: {
      eyebrow: "Wasiliana nasi",
      title: "Swali kwa timu ya WorldArts?",
      form: {
        name: "Jina lako",
        email: "Barua pepe yako",
        message: "Ujumbe wako",
        send: "Tuma ujumbe",
        sent: "Asante, ujumbe wako umepokelewa.",
        error: "Imeshindwa kutuma ujumbe."
      }
    },
    footer: {
      description:
        "Soko la sanaa, muziki na sinema duniani, linalotumia Pi Network.",
      explore: "Chunguza",
      company: "Shirika",
      contact: "Mawasiliano",
      rights: "© 2026 WorldArts. Haki zote zimehifadhiwa."
    },
    common: {
      close: "Funga",
      cancel: "Ghairi",
      loading: "Inapakia...",
      error: "Hitilafu imetokea.",
      networkError: "Hitilafu ya mtandao."
    }
  },

  ar: {
    accessibility: { skip: "انتقل إلى المحتوى الرئيسي" },
    language: { label: "اختر اللغة" },
    theme: { change: "تغيير المظهر" },
    nav: {
      home: "الرئيسية",
      gallery: "المعرض",
      artists: "الفنانون",
      marketplace: "السوق",
      about: "من نحن",
      contact: "اتصل بنا",
      connect: "الاتصال عبر Pi",
      menu: "القائمة"
    },
    hero: {
      eyebrow: "سوق الفن العالمي",
      title: "اكتشف واجمع وبع الفن في جميع أنحاء العالم",
      subtitle:
        "تجمع WorldArts الفنانين وهواة الجمع حول الأعمال الفنية والموسيقى والفيديو باستخدام Pi Network وWART.",
      connect: "الاتصال عبر Pi",
      explore: "استكشف المعرض",
      note: "الدفع حصريًا عبر π (Pi) وWART — بدون دولار وبدون USDT",
      stats: {
        countries: "دول",
        languages: "لغات",
        payments: "الدفع"
      }
    },
    features: {
      eyebrow: "ما يمكنك فعله",
      title: "تطبيق واحد، وفن من جميع أنحاء العالم",
      visual: "مرئي",
      audio: "صوت",
      motion: "فيديو",
      trade: "تجارة",
      art: {
        title: "اكتشف الفن",
        text: "تصفح أعمالًا أصلية لفنانين من جميع أنحاء العالم."
      },
      music: {
        title: "اكتشف الموسيقى",
        text: "استمع إلى المبدعين الموسيقيين المستقلين وادعمهم."
      },
      videos: {
        title: "اكتشف الفيديو",
        text: "استكشف الأعمال والعروض المرئية."
      },
      pi: {
        title: "اشتر وبع باستخدام Pi",
        text: "نفّذ معاملاتك باستخدام Pi Network أو WART."
      },
      gallery: "المعرض",
      marketplace: "السوق"
    },
    gallery: {
      eyebrow: "مختارات",
      title: "جدار المعرض",
      loading: "جارٍ تحميل الأعمال...",
      empty: "لا توجد أعمال متاحة حاليًا.",
      error: "تعذر تحميل الأعمال.",
      retry: "إعادة المحاولة",
      artist: "الفنان",
      price: "السعر",
      buy: "اشترِ باستخدام Pi",
      wart: "اشترِ باستخدام WART",
      details: "عرض التفاصيل"
    },
    about: {
      eyebrow: "مهمتنا",
      title: "الفن لغة مشتركة",
      text1:
        "تجمع WorldArts المبدعين وهواة الجمع من جميع أنحاء العالم في مكان واحد.",
      text2:
        "يدعم التطبيق ست لغات والدفع عبر Pi Network وWART."
    },
    artists: {
      eyebrow: "المجتمع",
      title: "فنانون مميزون",
      aline: {
        origin: "بوجومبورا، بوروندي",
        bio:
          "فنانة تستخدم تقنيات مختلفة وتستكشف تقاليد منطقة البحيرات العظمى."
      },
      kenji: {
        origin: "أوساكا، اليابان",
        bio:
          "ملحن يمزج بين آلة الكوتو التقليدية والأصوات الإلكترونية."
      },
      samira: {
        origin: "القاهرة، مصر",
        bio:
          "مخرجة توثق الحرفيين في وادي النيل."
      }
    },
    payment: {
      eyebrow: "الدفع",
      title: "عملة واحدة لفن بلا حدود",
      text: "تستخدم WorldArts شبكة Pi أو WART للمدفوعات.",
      pi: "Pi Network",
      wart: "WorldArts Token",
      noFiat: "بدون USD · بدون USDT"
    },
    pi: {
      auth: {
        title: "مصادقة Pi",
        text: "اربط حساب Pi الخاص بك لإجراء المدفوعات.",
        connect: "الاتصال عبر Pi"
      },
      status: {
        connected: "متصل",
        disconnected: "غير متصل",
        connecting: "جارٍ الاتصال بـ Pi...",
        waiting: "— في انتظار الاتصال —",
        error: "خطأ في الاتصال"
      },
      login: {
        success: "تم الاتصال بـ Pi بنجاح.",
        cancelled: "تم إلغاء اتصال Pi.",
        incomplete: "لم يكتمل اتصال Pi.",
        unavailable: "Pi SDK غير متاح."
      }
    },
    modal: {
      close: "إغلاق",
      login: {
        title: "الاتصال بـ Pi",
        text: "قم بالمصادقة باستخدام حساب Pi للوصول إلى WorldArts.",
        action: "المتابعة مع Pi"
      },
      payment: {
        title: "تأكيد الدفع",
        text: "سيتم دفع ثمن هذا العمل مباشرة عبر Pi SDK.",
        action: "الدفع باستخدام Pi"
      }
    },
    contact: {
      eyebrow: "اكتب لنا",
      title: "هل لديك سؤال لفريق WorldArts؟",
      form: {
        name: "اسمك",
        email: "بريدك الإلكتروني",
        message: "رسالتك",
        send: "إرسال الرسالة",
        sent: "شكرًا، تم استلام رسالتك.",
        error: "تعذر إرسال الرسالة."
      }
    },
    footer: {
      description:
        "السوق العالمي للفن والموسيقى والسينما، بدعم من Pi Network.",
      explore: "استكشف",
      company: "المؤسسة",
      contact: "اتصل بنا",
      rights: "© 2026 WorldArts. جميع الحقوق محفوظة."
    },
    common: {
      close: "إغلاق",
      cancel: "إلغاء",
      loading: "جارٍ التحميل...",
      error: "حدث خطأ.",
      networkError: "خطأ في الشبكة."
    }
  },

  zh: {
    accessibility: { skip: "跳转到主要内容" },
    language: { label: "选择语言" },
    theme: { change: "切换主题" },
    nav: {
      home: "首页",
      gallery: "画廊",
      artists: "艺术家",
      marketplace: "市场",
      about: "关于",
      contact: "联系我们",
      connect: "使用 Pi 登录",
      menu: "菜单"
    },
    hero: {
      eyebrow: "全球艺术市场",
      title: "在世界各地发现、收藏和出售艺术",
      subtitle:
        "WorldArts 将全球艺术家与收藏家连接起来，并支持 Pi Network 和 WART 支付。",
      connect: "使用 Pi 登录",
      explore: "探索画廊",
      note: "仅支持 π (Pi) 和 WART 支付 — 不支持美元和 USDT",
      stats: {
        countries: "国家",
        languages: "语言",
        payments: "原生支付"
      }
    },
    features: {
      eyebrow: "你可以做什么",
      title: "一个应用，汇聚世界艺术",
      visual: "视觉",
      audio: "音频",
      motion: "视频",
      trade: "交易",
      art: {
        title: "发现艺术",
        text: "浏览来自世界各地艺术家的原创作品。"
      },
      music: {
        title: "发现音乐",
        text: "聆听并支持独立音乐创作者。"
      },
      videos: {
        title: "发现视频",
        text: "探索视频作品和表演。"
      },
      pi: {
        title: "使用 Pi 买卖",
        text: "使用 Pi Network 或 WART 完成交易。"
      },
      gallery: "画廊",
      marketplace: "市场"
    },
    gallery: {
      eyebrow: "精选",
      title: "画廊墙",
      loading: "正在加载作品...",
      empty: "目前没有可用作品。",
      error: "无法加载作品。",
      retry: "重试",
      artist: "艺术家",
      price: "价格",
      buy: "使用 Pi 购买",
      wart: "使用 WART 购买",
      details: "查看详情"
    },
    about: {
      eyebrow: "我们的使命",
      title: "艺术是一种共同语言",
      text1:
        "WorldArts 将来自世界各地的创作者和收藏家聚集在一起。",
      text2:
        "应用支持六种语言以及 Pi Network 和 WART 支付。"
    },
    artists: {
      eyebrow: "社区",
      title: "精选艺术家",
      aline: {
        origin: "布琼布拉，布隆迪",
        bio: "使用多种技法探索大湖地区传统的画家。"
      },
      kenji: {
        origin: "大阪，日本",
        bio: "将传统尺八与电子声音结合的作曲家。"
      },
      samira: {
        origin: "开罗，埃及",
        bio: "记录尼罗河谷工匠的纪录片导演。"
      }
    },
    payment: {
      eyebrow: "支付",
      title: "让艺术无国界",
      text: "WorldArts 使用 Pi Network 或 WART 进行支付。",
      pi: "Pi Network",
      wart: "WorldArts Token",
      noFiat: "无 USD · 无 USDT"
    },
    pi: {
      auth: {
        title: "Pi 身份验证",
        text: "连接您的 Pi 账户以进行支付。",
        connect: "使用 Pi 登录"
      },
      status: {
        connected: "已连接",
        disconnected: "未连接",
        connecting: "正在连接 Pi...",
        waiting: "— 等待连接 —",
        error: "连接错误"
      },
      login: {
        success: "Pi 连接成功。",
        cancelled: "Pi 连接已取消。",
        incomplete: "Pi 连接未完成。",
        unavailable: "Pi SDK 不可用。"
      }
    },
    modal: {
      close: "关闭",
      login: {
        title: "Pi 登录",
        text: "使用 Pi 账户验证身份以访问 WorldArts。",
        action: "继续使用 Pi"
      },
      payment: {
        title: "确认付款",
        text: "该作品将通过 Pi SDK 直接支付。",
        action: "使用 Pi 支付"
      }
    },
    contact: {
      eyebrow: "联系我们",
      title: "有问题想问 WorldArts 团队？",
      form: {
        name: "您的姓名",
        email: "您的邮箱",
        message: "您的留言",
        send: "发送留言",
        sent: "谢谢，您的留言已收到。",
        error: "无法发送留言。"
      }
    },
    footer: {
      description:
        "由 Pi Network 驱动的全球艺术、音乐和电影市场。",
      explore: "探索",
      company: "组织",
      contact: "联系",
      rights: "© 2026 WorldArts. 版权所有。"
    },
    common: {
      close: "关闭",
      cancel: "取消",
      loading: "加载中...",
      error: "发生错误。",
      networkError: "网络错误。"
    }
  }
};


/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

function getTranslation(key) {
  const parts = key.split(".");
  let value = translations[currentLanguage];

  for (const part of parts) {
    if (value && Object.prototype.hasOwnProperty.call(value, part)) {
      value = value[part];
    } else {
      return getFallbackTranslation(key);
    }
  }

  return typeof value === "string" ? value : key;
}

function getFallbackTranslation(key) {
  const parts = key.split(".");
  let value = translations.fr;

  for (const part of parts) {
    if (value && Object.prototype.hasOwnProperty.call(value, part)) {
      value = value[part];
    } else {
      return key;
    }
  }

  return typeof value === "string" ? value : key;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================================
   I18N
   ========================================================= */

function applyTranslations() {
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = RTL_LANGUAGES.includes(currentLanguage)
    ? "rtl"
    : "ltr";

  $$("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const text = getTranslation(key);

    if (element.children.length === 0) {
      element.textContent = text;
    } else {
      const textNode = Array.from(element.childNodes).find(
        (node) => node.nodeType === Node.TEXT_NODE
      );

      if (textNode) {
        textNode.nodeValue = text;
      }
    }
  });

  $$("[data-i18n-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    element.placeholder = getTranslation(key);
  });

  $$("[data-i18n-aria]").forEach((element) => {
    const key = element.getAttribute("data-i18n-aria");
    element.setAttribute("aria-label", getTranslation(key));
  });

  updateDynamicUITranslations();
}

function updateDynamicUITranslations() {
  const statusText = $("#piStatusText");

  if (statusText && !piUser) {
    statusText.textContent = getTranslation("pi.status.disconnected");
  }

  const langSelect = $("#langSelect");
  if (langSelect) {
    langSelect.value = currentLanguage;
  }
}

function setLanguage(language) {
  if (!SUPPORTED_LANGUAGES.includes(language)) return;

  currentLanguage = language;
  localStorage.setItem("worldarts_language", language);

  applyTranslations();

  if (selectedArtwork) {
    updatePaymentModal();
  }

  renderArtworks(window.__worldartsArtworks || []);
}


/* =========================================================
   THEME
   ========================================================= */

function applyTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme);
  document.body.setAttribute("data-theme", currentTheme);

  localStorage.setItem("worldarts_theme", currentTheme);

  const icon = $("#themeIcon");

  if (icon) {
    if (currentTheme === "dark") {
      icon.innerHTML = `
        <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4
                 A8.8 8.8 0 1 0 20 15.2Z"/>
      `;
    } else {
      icon.innerHTML = `
        <circle cx="12" cy="12" r="4.5"/>
        <path d="M12 2.5v2.4M12 19.1v2.4"/>
        <path d="M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7"/>
        <path d="M2.5 12h2.4M19.1 12h2.4"/>
        <path d="M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/>
      `;
    }
  }
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme();
}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function setMobileMenu(open) {
  const navLinks = $("#navLinks");
  const burger = $("#navBurger");

  if (!navLinks || !burger) return;

  navLinks.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));

  document.body.classList.toggle("menu-open", open);
}

function toggleMobileMenu() {
  const navLinks = $("#navLinks");
  if (!navLinks) return;

  setMobileMenu(!navLinks.classList.contains("open"));
}


/* =========================================================
   NAVIGATION SCROLL
   ========================================================= */

function updateNavigationOnScroll() {
  const nav = $("#siteNav");

  if (!nav) return;

  nav.classList.toggle("is-scrolled", window.scrollY > 12);

  const sections = $$("main section[id]");
  const links = $$("#navLinks a[href^='#']");

  let currentSection = "home";

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= 140 && rect.bottom >= 140) {
      currentSection = section.id;
    }
  });

  links.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${currentSection}`);
  });
}

function closeMenuAfterNavigation() {
  $$("#navLinks a").forEach((link) => {
    link.addEventListener("click", () => setMobileMenu(false));
  });
}


/* =========================================================
   API
   ========================================================= */

async function apiRequest(path, options = {}) {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `HTTP ${response.status}`;

    throw new Error(message);
  }

  return data;
}


/* =========================================================
   PI SDK
   ========================================================= */

function isPiAvailable() {
  return typeof window.Pi !== "undefined";
}

async function initPiSDK() {
  if (!isPiAvailable()) {
    console.warn("WorldArts: Pi SDK not available.");
    setPiStatus("error");
    writePiLog(getTranslation("pi.login.unavailable"));
    return false;
  }

  try {
    window.Pi.init({
      version: "2.0",
      sandbox: false
    });

    piSdkReady = true;

    console.info("WorldArts: Pi SDK initialized.");
    return true;
  } catch (error) {
    console.error("WorldArts: Pi SDK initialization failed:", error);

    piSdkReady = false;
    setPiStatus("error");
    writePiLog(error.message || getTranslation("common.error"));

    return false;
  }
}


/* =========================================================
   PI STATUS
   ========================================================= */

function setPiStatus(state, customText = "") {
  const status = $("#piStatus");
  const statusText = $("#piStatusText");

  if (!status || !statusText) return;

  status.classList.remove("connected");

  if (state === "connected") {
    status.classList.add("connected");
    statusText.textContent =
      customText || getTranslation("pi.status.connected");
  } else if (state === "connecting") {
    statusText.textContent =
      customText || getTranslation("pi.status.connecting");
  } else if (state === "error") {
    statusText.textContent =
      customText || getTranslation("pi.status.error");
  } else {
    statusText.textContent =
      customText || getTranslation("pi.status.disconnected");
  }
}

function writePiLog(message) {
  const log = $("#piLog");

  if (!log) return;

  log.textContent = message;
}


/* =========================================================
   PI AUTHENTICATION
   ========================================================= */

async function authenticateWithPi() {
  if (isAuthenticating) return;

  if (!isPiAvailable()) {
    await initPiSDK();
  }

  if (!piSdkReady || !isPiAvailable()) {
    openModal("loginModal");
    setPiStatus("error");
    writePiLog(getTranslation("pi.login.unavailable"));
    return;
  }

  isAuthenticating = true;

  setPiStatus("connecting");
  writePiLog(getTranslation("pi.status.connecting"));

  setConnectButtonsLoading(true);

  try {
    const authResult = await window.Pi.authenticate(
      PI_SCOPES,
      onIncompletePaymentFound
    );

    if (!authResult) {
      throw new Error(getTranslation("pi.login.incomplete"));
    }

    piUser = authResult.user || null;
    piAccessToken = authResult.accessToken || null;

    if (!piUser) {
      throw new Error(getTranslation("pi.login.incomplete"));
    }

    /*
     * Send the Pi authentication result to the Render backend.
     * The backend must validate the Pi access token/server-side.
     */
    let backendAuth = null;

    try {
      backendAuth = await apiRequest("/auth", {
        method: "POST",
        body: JSON.stringify({
          uid: piUser.uid,
          username: piUser.username,
          accessToken: piAccessToken,
          authResult
        })
      });
    } catch (backendError) {
      console.warn(
        "WorldArts: backend authentication returned an error:",
        backendError
      );

      /*
       * Pi authentication itself succeeded.
       * We keep the Pi session active, but clearly report
       * that backend authentication did not complete.
       */
    }

    if (backendAuth?.token) {
      localStorage.setItem("worldarts_token", backendAuth.token);
    }

    localStorage.setItem(
      "worldarts_pi_user",
      JSON.stringify({
        uid: piUser.uid,
        username: piUser.username
      })
    );

    setPiStatus(
      "connected",
      piUser.username
        ? `@${piUser.username}`
        : getTranslation("pi.status.connected")
    );

    writePiLog(
      `${getTranslation("pi.login.success")}${
        piUser.username ? ` @${piUser.username}` : ""
      }`
    );

    updateConnectButtons();

    closeModal("loginModal");

    await loadArtworks();

  } catch (error) {
    console.error("WorldArts Pi authentication error:", error);

    setPiStatus("error");
    writePiLog(error?.message || getTranslation("common.error"));

    if (
      error?.message &&
      /cancel|reject|abort/i.test(error.message)
    ) {
      writePiLog(getTranslation("pi.login.cancelled"));
    }

  } finally {
    isAuthenticating = false;
    setConnectButtonsLoading(false);
  }
}


/* =========================================================
   INCOMPLETE PI PAYMENT
   ========================================================= */

async function onIncompletePaymentFound(payment) {
  console.warn("WorldArts: incomplete Pi payment:", payment);

  if (!payment) return;

  try {
    await apiRequest("/payments/incomplete", {
      method: "POST",
      body: JSON.stringify({
        payment
      })
    });
  } catch (error) {
    console.warn(
      "WorldArts: unable to notify backend about incomplete payment:",
      error
    );
  }
}


/* =========================================================
   CONNECT BUTTONS
   ========================================================= */

function setConnectButtonsLoading(loading) {
  const buttons = [
    $("#piConnectBtn"),
    $("#heroConnectBtn"),
    $("#piPanelConnectBtn"),
    $("#modalConnectBtn")
  ].filter(Boolean);

  buttons.forEach((button) => {
    button.disabled = loading;

    if (loading) {
      button.dataset.originalText = button.textContent;
      button.textContent = getTranslation("pi.status.connecting");
    } else if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
      delete button.dataset.originalText;
    }
  });
}

function updateConnectButtons() {
  const buttons = [
    $("#piConnectBtn"),
    $("#heroConnectBtn"),
    $("#piPanelConnectBtn"),
    $("#modalConnectBtn")
  ].filter(Boolean);

  buttons.forEach((button) => {
    if (!button) return;

    if (piUser) {
      button.textContent = piUser.username
        ? `@${piUser.username}`
        : getTranslation("pi.status.connected");

      button.classList.add("is-connected");
    } else {
      button.classList.remove("is-connected");
    }
  });
}


/* =========================================================
   RESTORE LOCAL SESSION
   ========================================================= */

function restorePiSession() {
  try {
    const saved = localStorage.getItem("worldarts_pi_user");

    if (!saved) return;

    const user = JSON.parse(saved);

    if (user?.uid) {
      piUser = user;

      setPiStatus(
        "connected",
        user.username
          ? `@${user.username}`
          : getTranslation("pi.status.connected")
      );

      updateConnectButtons();
    }
  } catch (error) {
    console.warn("WorldArts: invalid saved Pi session.", error);

    localStorage.removeItem("worldarts_pi_user");
  }
}


/* =========================================================
   ARTWORKS
   ========================================================= */

function normalizeArtwork(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  return {
    id:
      item.id ??
      item._id ??
      item.artwork_id ??
      item.uuid ??
      null,

    title:
      item.title ??
      item.name ??
      "WorldArts",

    artist:
      item.artist_name ??
      item.artistName ??
      item.artist?.name ??
      item.artist ??
      "WorldArts Artist",

    description:
      item.description ??
      item.bio ??
      "",

    image:
      item.image_url ??
      item.imageUrl ??
      item.image ??
      item.cover_url ??
      item.coverUrl ??
      "assets/logo.svg",

    price:
      item.price ??
      item.amount ??
      item.pi_price ??
      item.piPrice ??
      0,

    currency:
      item.currency ??
      item.token ??
      item.payment_currency ??
      "PI",

    wartPrice:
      item.wart_price ??
      item.wartPrice ??
      null,

    type:
      item.type ??
      item.category ??
      "art",

    raw: item
  };
}

async function loadArtworks() {
  if (isLoadingArtworks) return;

  const container =
    document.querySelector("[data-artworks]") ||
    document.querySelector(".gallery-grid") ||
    document.querySelector(".artwork-grid");

  if (!container) return;

  isLoadingArtworks = true;

  container.innerHTML = `
    <p class="loading-state">
      ${escapeHTML(getTranslation("gallery.loading"))}
    </p>
  `;

  try {
    const data = await apiRequest("/artworks", {
      method: "GET"
    });

    let items = [];

    if (Array.isArray(data)) {
      items = data;
    } else if (Array.isArray(data?.artworks)) {
      items = data.artworks;
    } else if (Array.isArray(data?.data)) {
      items = data.data;
    } else if (Array.isArray(data?.results)) {
      items = data.results;
    }

    const artworks = items
      .map(normalizeArtwork)
      .filter((item) => item && item.id !== null);

    window.__worldartsArtworks = artworks;

    renderArtworks(artworks);

  } catch (error) {
    console.error("WorldArts: artworks loading failed:", error);

    window.__worldartsArtworks = [];

    container.innerHTML = `
      <div class="empty-state">
        <p>${escapeHTML(getTranslation("gallery.error"))}</p>
        <button
          type="button"
          class="btn btn-ghost"
          data-retry-artworks
        >
          ${escapeHTML(getTranslation("gallery.retry"))}
        </button>
      </div>
    `;

    const retry = container.querySelector("[data-retry-artworks]");

    if (retry) {
      retry.addEventListener("click", loadArtworks);
    }

  } finally {
    isLoadingArtworks = false;
  }
}


/* =========================================================
   RENDER ARTWORKS
   ========================================================= */

function renderArtworks(artworks) {
  const container =
    document.querySelector("[data-artworks]") ||
    document.querySelector(".gallery-grid") ||
    document.querySelector(".artwork-grid");

  if (!container) return;

  if (!Array.isArray(artworks) || artworks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        ${escapeHTML(getTranslation("gallery.empty"))}
      </div>
    `;
    return;
  }

  container.innerHTML = artworks
    .map(createArtworkCard)
    .join("");

  attachArtworkEvents();
}

function createArtworkCard(artwork) {
  const price = Number(artwork.price || 0);

  const formattedPrice =
    Number.isFinite(price) && price > 0
      ? price.toString()
      : "—";

  const currency =
    String(artwork.currency || "PI").toUpperCase() === "WART"
      ? "WART"
      : "π";

  const wartButton =
    artwork.wartPrice !== null &&
    artwork.wartPrice !== undefined
      ? `
        <button
          type="button"
          class="btn btn-ghost artwork-buy-wart"
          data-buy-wart="${escapeHTML(artwork.id)}"
        >
          ${escapeHTML(getTranslation("gallery.wart"))}
        </button>
      `
      : "";

  return `
    <article
      class="artwork-card"
      data-artwork-id="${escapeHTML(artwork.id)}"
    >
      <img
        src="${escapeHTML(artwork.image)}"
        alt="${escapeHTML(artwork.title)}"
        loading="lazy"
        onerror="this.src='assets/logo.svg'"
      >

      <div class="artwork-info">

        <h3>${escapeHTML(artwork.title)}</h3>

        <p>
          ${escapeHTML(getTranslation("gallery.artist"))}:
          ${escapeHTML(artwork.artist)}
        </p>

        ${
          artwork.description
            ? `
              <p class="artwork-description">
                ${escapeHTML(artwork.description)}
              </p>
            `
            : ""
        }

        <div class="artwork-price">
          ${escapeHTML(formattedPrice)} ${escapeHTML(currency)}
        </div>

        <div class="artwork-actions">

          <button
            type="button"
            class="btn btn-primary artwork-buy"
            data-buy-pi="${escapeHTML(artwork.id)}"
          >
            ${escapeHTML(getTranslation("gallery.buy"))}
          </button>

          ${wartButton}

        </div>
      </div>
    </article>
  `;
}

function attachArtworkEvents() {
  $$("[data-buy-pi]").forEach((button) => {
    button.addEventListener("click", () => {
      const artworkId = button.getAttribute("data-buy-pi");

      const artwork = (window.__worldartsArtworks || []).find(
        (item) => String(item.id) === String(artworkId)
      );

      if (artwork) {
        beginArtworkPurchase(artwork);
      }
    });
  });

  $$("[data-buy-wart]").forEach((button) => {
    button.addEventListener("click", () => {
      const artworkId = button.getAttribute("data-buy-wart");

      const artwork = (window.__worldartsArtworks || []).find(
        (item) => String(item.id) === String(artworkId)
      );

      if (artwork) {
        beginWartPurchase(artwork);
      }
    });
  });
}


/* =========================================================
   PI PURCHASE
   ========================================================= */

async function beginArtworkPurchase(artwork) {
  if (!artwork) return;

  selectedArtwork = artwork;

  if (!piUser) {
    openModal("loginModal");
    return;
  }

  if (!piSdkReady || !isPiAvailable()) {
    await initPiSDK();
  }

  if (!piSdkReady) {
    alert(getTranslation("pi.login.unavailable"));
    return;
  }

  updatePaymentModal();
  openModal("paymentModal");
}

function updatePaymentModal() {
  if (!selectedArtwork) return;

  const title = $("#paymentModalTitle");
  const text = $("#paymentModal .payment-description");
  const confirmBox =
    $("#paymentModal .payment-confirm-box");

  if (title) {
    title.textContent =
      getTranslation("modal.payment.title");
  }

  if (text) {
    text.textContent =
      getTranslation("modal.payment.text");
  }

  if (confirmBox) {
    confirmBox.innerHTML = `
      <strong>
        ${escapeHTML(selectedArtwork.price)} π
      </strong>
      <span>
        ${escapeHTML(selectedArtwork.title)}
      </span>
    `;
  }
}


/* =========================================================
   PI PAYMENT
   ========================================================= */

async function createPiPayment() {
  if (!selectedArtwork) return;

  if (!piUser) {
    closeModal("paymentModal");
    openModal("loginModal");
    return;
  }

  if (!piSdkReady || !isPiAvailable()) {
    const ready = await initPiSDK();

    if (!ready) {
      return;
    }
  }

  const amount = Number(selectedArtwork.price);

  if (!Number.isFinite(amount) || amount <= 0) {
    alert("Invalid Pi price.");
    return;
  }

  const payButton = $("#modalPayBtn");

  if (payButton) {
    payButton.disabled = true;
    payButton.textContent = getTranslation("common.loading");
  }

  try {
    currentPayment = await window.Pi.createPayment(
      {
        amount,
        memo: `WorldArts — ${selectedArtwork.title}`,
        metadata: {
          artworkId: selectedArtwork.id,
          artworkTitle: selectedArtwork.title,
          artist: selectedArtwork.artist,
          source: "worldarts"
        }
      },
      {
        onReadyForServerApproval: handlePaymentApproval,
        onReadyForServerCompletion: handlePaymentCompletion,
        onCancel: handlePaymentCancel,
        onError: handlePaymentError
      }
    );

    console.info(
      "WorldArts: Pi payment created:",
      currentPayment
    );

  } catch (error) {
    console.error("WorldArts: createPayment failed:", error);
    alert(error?.message || getTranslation("common.error"));

  } finally {
    if (payButton) {
      payButton.disabled = false;
      payButton.textContent =
        getTranslation("modal.payment.action");
    }
  }
}


/* =========================================================
   PI PAYMENT APPROVAL
   ========================================================= */

async function handlePaymentApproval(paymentId) {
  if (!paymentId) {
    throw new Error("Missing Pi payment ID.");
  }

  try {
    await apiRequest("/payments/approve", {
      method: "POST",
      body: JSON.stringify({
        paymentId,
        payment_id: paymentId,
        uid: piUser?.uid || null,
        username: piUser?.username || null,
        artworkId: selectedArtwork?.id || null
      })
    });

    console.info(
      "WorldArts: payment approved:",
      paymentId
    );

  } catch (error) {
    console.error(
      "WorldArts: payment approval failed:",
      error
    );

    throw error;
  }
}


/* =========================================================
   PI PAYMENT COMPLETION
   ========================================================= */

async function handlePaymentCompletion(
  paymentId,
  txid
) {
  if (!paymentId) {
    throw new Error("Missing Pi payment ID.");
  }

  try {
    const result = await apiRequest("/payments/complete", {
      method: "POST",
      body: JSON.stringify({
        paymentId,
        payment_id: paymentId,
        txid: txid || null,
        transactionId: txid || null,
        uid: piUser?.uid || null,
        username: piUser?.username || null,
        artworkId: selectedArtwork?.id || null
      })
    });

    console.info(
      "WorldArts: payment completed:",
      result
    );

    closeModal("paymentModal");

    alert(
      result?.message ||
      "Pi payment completed successfully."
    );

    currentPayment = null;
    selectedArtwork = null;

    await loadArtworks();

  } catch (error) {
    console.error(
      "WorldArts: payment completion failed:",
      error
    );

    alert(
      error?.message ||
      getTranslation("common.error")
    );
  }
}


/* =========================================================
   PI PAYMENT CANCEL / ERROR
   ========================================================= */

function handlePaymentCancel(paymentId) {
  console.warn(
    "WorldArts: payment cancelled:",
    paymentId
  );

  currentPayment = null;

  writePiLog(
    `Payment cancelled${paymentId ? `: ${paymentId}` : ""}`
  );
}

function handlePaymentError(error, payment) {
  console.error(
    "WorldArts: Pi payment error:",
    error,
    payment
  );

  currentPayment = null;

  writePiLog(
    error?.message ||
    getTranslation("common.error")
  );
}


/* =========================================================
   WART
   ========================================================= */

async function beginWartPurchase(artwork) {
  /*
   * Pi SDK itself handles Pi payments.
   * WART is therefore kept separate from Pi.createPayment.
   *
   * We do not pretend that Pi SDK can transfer WART.
   * If/when the WorldArts backend exposes a WART payment
   * endpoint, this function can use it safely.
   */

  if (!piUser) {
    openModal("loginModal");
    return;
  }

  console.info(
    "WorldArts WART purchase requested:",
    artwork
  );

  alert(
    "WART payment requires the WorldArts WART payment service to be enabled on the backend."
  );
}


/* =========================================================
   MODALS
   ========================================================= */

function openModal(id) {
  const modal = document.getElementById(id);

  if (!modal) return;

  modal.classList.add("open");
  document.body.classList.add("modal-open");

  const firstFocusable = modal.querySelector(
    "button, input, textarea, select, a[href]"
  );

  if (firstFocusable) {
    setTimeout(() => firstFocusable.focus(), 20);
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);

  if (!modal) return;

  modal.classList.remove("open");

  if (!document.querySelector(".modal-overlay.open")) {
    document.body.classList.remove("modal-open");
  }
}

function closeAllModals() {
  $$(".modal-overlay.open").forEach((modal) => {
    modal.classList.remove("open");
  });

  document.body.classList.remove("modal-open");
}

function setupModals() {
  $$("[data-close]").forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(button.getAttribute("data-close"));
    });
  });

  $$(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();
      setMobileMenu(false);
    }
  });
}


/* =========================================================
   CONTACT
   ========================================================= */

async function submitContactForm(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const status = $("#contactStatus");

  if (!form) return;

  const name = $("#contactName")?.value.trim();
  const email = $("#contactEmail")?.value.trim();
  const message = $("#contactMessage")?.value.trim();

  if (!name || !email || !message) {
    if (status) {
      status.style.display = "block";
      status.textContent =
        getTranslation("contact.form.error");
    }
    return;
  }

  const submitButton =
    form.querySelector('button[type="submit"]');

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent =
      getTranslation("common.loading");
  }

  try {
    await apiRequest("/contact", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        message
      })
    });

    form.reset();

    if (status) {
      status.style.display = "block";
      status.textContent =
        getTranslation("contact.form.sent");
    }

  } catch (error) {
    console.error(
      "WorldArts: contact submission failed:",
      error
    );

    if (status) {
      status.style.display = "block";
      status.textContent =
        error?.message ||
        getTranslation("contact.form.error");
    }

  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent =
        getTranslation("contact.form.send");
    }
  }
}


/* =========================================================
   IMAGE FALLBACK
   ========================================================= */

function setupImageFallbacks() {
  document.addEventListener(
    "error",
    (event) => {
      const image = event.target;

      if (
        image &&
        image.tagName === "IMG" &&
        !image.dataset.fallback
      ) {
        image.dataset.fallback = "true";
        image.src = "assets/logo.svg";
      }
    },
    true
  );
}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

function setupEventListeners() {
  $("#themeToggle")?.addEventListener(
    "click",
    toggleTheme
  );

  $("#langSelect")?.addEventListener(
    "change",
    (event) => {
      setLanguage(event.target.value);
    }
  );

  $("#navBurger")?.addEventListener(
    "click",
    toggleMobileMenu
  );

  $("#piConnectBtn")?.addEventListener(
    "click",
    () => {
      if (piUser) {
        document
          .getElementById("marketplace")
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        authenticateWithPi();
      }
    }
  );

  $("#heroConnectBtn")?.addEventListener(
    "click",
    authenticateWithPi
  );

  $("#piPanelConnectBtn")?.addEventListener(
    "click",
    authenticateWithPi
  );

  $("#modalConnectBtn")?.addEventListener(
    "click",
    authenticateWithPi
  );

  $("#modalPayBtn")?.addEventListener(
    "click",
    createPiPayment
  );

  $("#contactForm")?.addEventListener(
    "submit",
    submitContactForm
  );

  closeMenuAfterNavigation();

  window.addEventListener(
    "scroll",
    updateNavigationOnScroll,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth > 760) {
        setMobileMenu(false);
      }
    },
    { passive: true }
  );
}


/* =========================================================
   STARTUP
   ========================================================= */

async function initializeWorldArts() {
  try {
    applyTheme();
    applyTranslations();

    setupEventListeners();
    setupModals();
    setupImageFallbacks();

    updateNavigationOnScroll();
    restorePiSession();

    /*
     * The SDK script is loaded before script.js in index.html,
     * therefore Pi can be initialized here.
     */
    await initPiSDK();

    await loadArtworks();

  } catch (error) {
    console.error(
      "WorldArts initialization error:",
      error
    );
  }
}


/* =========================================================
   GLOBAL EXPORT
   Useful for debugging / future modules.
   ========================================================= */

window.WorldArts = {
  API_BASE,

  get user() {
    return piUser;
  },

  get payment() {
    return currentPayment;
  },

  get language() {
    return currentLanguage;
  },

  get theme() {
    return currentTheme;
  },

  login: authenticateWithPi,
  loadArtworks,
  setLanguage,
  toggleTheme,
  openModal,
  closeModal
};


/* =========================================================
   BOOT
   ========================================================= */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeWorldArts,
    { once: true }
  );
} else {
  initializeWorldArts();
}

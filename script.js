/* =========================================================
   WorldArts — script.js
   Version finale — compatible avec index.html actuel
   i18n 6 langues · thème · menu · Pi SDK · galerie
   Pi Login · Pi Payment · contact · modals · navigation
   ========================================================= */

(function () {
  "use strict";

  /* =======================================================
     CONFIGURATION
     ======================================================= */

  const API_BASE = String(
    window.WORLDARTS_API_BASE ||
    "https://worldarts-backend.onrender.com/api"
  ).replace(/\/$/, "");

  const PI_SANDBOX = false;

  let piUser = null;
  let currentPayment = null;
  let piInitialized = false;


  /* =======================================================
     TRADUCTIONS
     ======================================================= */

  const translations = {

    fr: {
      "accessibility.skip": "Aller au contenu principal",
      "language.label": "Choisir la langue",
      "theme.change": "Changer de thème",
      "nav.menu": "Menu",

      "nav.home": "Accueil",
      "nav.gallery": "Galerie",
      "nav.artists": "Artistes",
      "nav.marketplace": "Marché",
      "nav.about": "À propos",
      "nav.contact": "Contact",
      "nav.connect": "Se connecter avec Pi",

      "hero.eyebrow": "Marché d'art mondial",
      "hero.title": "Découvrez, collectionnez et vendez de l'art <em>partout dans le monde</em>",
      "hero.subtitle": "WorldArts réunit artistes et collectionneurs autour d'œuvres, de musique et de vidéos, avec des paiements en Pi Network et en WART.",
      "hero.connect": "Se connecter avec Pi",
      "hero.explore": "Explorer la galerie",
      "hero.stats.countries": "Pays",
      "hero.stats.languages": "Langues",
      "hero.stats.payments": "Paiements natifs",
      "hero.note": "Paiements exclusivement en π (Pi) et WART — aucun dollar, aucun USDT",

      "features.eyebrow": "Ce que vous pouvez faire",
      "features.title": "Une seule application, tout l'art du monde",
      "features.visual": "Visuel",
      "features.audio": "Audio",
      "features.motion": "Vidéo",
      "features.trade": "Commerce",
      "features.art.title": "Découvrir l'art",
      "features.art.text": "Parcourez des œuvres originales issues d'artistes du monde entier.",
      "features.gallery": "Galerie",
      "features.music.title": "Découvrir la musique",
      "features.music.text": "Écoutez et soutenez des créateurs musicaux indépendants.",
      "features.videos.title": "Découvrir les vidéos",
      "features.videos.text": "Explorez des créations vidéo et des performances.",
      "features.pi.title": "Acheter & vendre avec Pi",
      "features.pi.text": "Réalisez vos transactions avec Pi Network ou WART.",
      "features.marketplace": "Marketplace",

      "gallery.eyebrow": "Sélection",
      "gallery.title": "Le mur de la galerie",
      "gallery.loading": "Chargement des œuvres...",
      "gallery.empty": "Aucune œuvre disponible pour le moment.",
      "gallery.error": "Impossible de charger la galerie pour le moment.",
      "gallery.buyPi": "Acheter avec Pi",
      "gallery.buyWart": "Acheter avec WART",

      "artists.eyebrow": "Communauté",
      "artists.title": "Artistes à l'honneur",
      "artists.aline.origin": "Bujumbura, Burundi",
      "artists.aline.bio": "Artiste peintre utilisant différentes techniques et explorant les traditions de la région des Grands Lacs.",
      "artists.kenji.origin": "Osaka, Japon",
      "artists.kenji.bio": "Compositeur mélangeant le koto traditionnel et les sonorités électroniques.",
      "artists.samira.origin": "Le Caire, Égypte",
      "artists.samira.bio": "Réalisatrice documentant les artisans de la vallée du Nil.",

      "about.eyebrow": "Notre mission",
      "about.title": "L'art comme langage commun",
      "about.text1": "WorldArts réunit les créateurs et les collectionneurs du monde entier dans un même espace.",
      "about.text2": "L'application prend en charge six langues et les paiements en Pi Network et WART.",

      "payment.eyebrow": "Paiements",
      "payment.title": "Une monnaie pour un art sans frontières",
      "payment.text": "Les paiements WorldArts utilisent Pi Network ou WART.",
      "payment.pi": "Pi Network",
      "payment.wart": "WorldArts Token",
      "payment.noFiat": "Aucun USD · Aucun USDT",

      "pi.auth.title": "Authentification Pi",
      "pi.auth.text": "Connectez votre compte Pi pour effectuer les paiements.",
      "pi.auth.connect": "Se connecter avec Pi",
      "pi.status.disconnected": "Non connecté",
      "pi.status.connecting": "Connexion à Pi...",
      "pi.status.connected": "Connecté à Pi",
      "pi.status.waiting": "— en attente de connexion —",

      "contact.eyebrow": "Nous écrire",
      "contact.title": "Une question pour l'équipe WorldArts ?",
      "contact.form.name": "Votre nom",
      "contact.form.email": "Votre email",
      "contact.form.message": "Votre message",
      "contact.form.send": "Envoyer le message",
      "contact.form.sent": "Merci, votre message a bien été reçu.",

      "modal.close": "Fermer",
      "modal.login.title": "Connexion Pi",
      "modal.login.text": "Authentifiez-vous avec votre compte Pi pour accéder à WorldArts.",
      "modal.login.action": "Continuer avec Pi",
      "modal.payment.title": "Confirmer le paiement",
      "modal.payment.text": "Cette œuvre sera payée directement via le Pi SDK.",
      "modal.payment.action": "Payer avec Pi",

      "footer.description": "Le marché mondial de l'art, de la musique et du cinéma, propulsé par Pi Network.",
      "footer.explore": "Explorer",
      "footer.company": "Organisation",
      "footer.contact": "Contact",
      "footer.rights": "© 2026 WorldArts. Tous droits réservés."
    },

    en: {
      "accessibility.skip": "Skip to main content",
      "language.label": "Choose language",
      "theme.change": "Change theme",
      "nav.menu": "Menu",

      "nav.home": "Home",
      "nav.gallery": "Gallery",
      "nav.artists": "Artists",
      "nav.marketplace": "Marketplace",
      "nav.about": "About",
      "nav.contact": "Contact",
      "nav.connect": "Connect with Pi",

      "hero.eyebrow": "Global art marketplace",
      "hero.title": "Discover, collect and sell art <em>anywhere in the world</em>",
      "hero.subtitle": "WorldArts brings artists and collectors together around art, music and video, with Pi Network and WART payments.",
      "hero.connect": "Connect with Pi",
      "hero.explore": "Explore the gallery",
      "hero.stats.countries": "Countries",
      "hero.stats.languages": "Languages",
      "hero.stats.payments": "Native payments",
      "hero.note": "Payments exclusively in π (Pi) and WART — no dollars, no USDT",

      "features.eyebrow": "What you can do",
      "features.title": "One app, all the world's art",
      "features.visual": "Visual",
      "features.audio": "Audio",
      "features.motion": "Video",
      "features.trade": "Commerce",
      "features.art.title": "Discover art",
      "features.art.text": "Browse original artworks from artists worldwide.",
      "features.gallery": "Gallery",
      "features.music.title": "Discover music",
      "features.music.text": "Listen to and support independent creators.",
      "features.videos.title": "Discover videos",
      "features.videos.text": "Explore video works and performances.",
      "features.pi.title": "Buy & sell with Pi",
      "features.pi.text": "Complete transactions with Pi Network or WART.",
      "features.marketplace": "Marketplace",

      "gallery.eyebrow": "Selection",
      "gallery.title": "The gallery wall",
      "gallery.loading": "Loading artworks...",
      "gallery.empty": "No artworks are available at the moment.",
      "gallery.error": "Unable to load the gallery at the moment.",
      "gallery.buyPi": "Buy with Pi",
      "gallery.buyWart": "Buy with WART",

      "artists.eyebrow": "Community",
      "artists.title": "Featured artists",
      "artists.aline.origin": "Bujumbura, Burundi",
      "artists.aline.bio": "Painter exploring different techniques and traditions of the Great Lakes region.",
      "artists.kenji.origin": "Osaka, Japan",
      "artists.kenji.bio": "Composer blending traditional koto with electronic sounds.",
      "artists.samira.origin": "Cairo, Egypt",
      "artists.samira.bio": "Filmmaker documenting artisans of the Nile Valley.",

      "about.eyebrow": "Our mission",
      "about.title": "Art as a common language",
      "about.text1": "WorldArts brings creators and collectors from around the world together in one space.",
      "about.text2": "The application supports six languages and payments in Pi Network and WART.",

      "payment.eyebrow": "Payments",
      "payment.title": "One currency for borderless art",
      "payment.text": "WorldArts payments use Pi Network or WART.",
      "payment.pi": "Pi Network",
      "payment.wart": "WorldArts Token",
      "payment.noFiat": "No USD · No USDT",

      "pi.auth.title": "Pi Authentication",
      "pi.auth.text": "Connect your Pi account to make payments.",
      "pi.auth.connect": "Connect with Pi",
      "pi.status.disconnected": "Not connected",
      "pi.status.connecting": "Connecting to Pi...",
      "pi.status.connected": "Connected to Pi",
      "pi.status.waiting": "— waiting for connection —",

      "contact.eyebrow": "Get in touch",
      "contact.title": "A question for the WorldArts team?",
      "contact.form.name": "Your name",
      "contact.form.email": "Your email",
      "contact.form.message": "Your message",
      "contact.form.send": "Send message",
      "contact.form.sent": "Thanks, your message was received.",

      "modal.close": "Close",
      "modal.login.title": "Pi Login",
      "modal.login.text": "Authenticate with your Pi account to access WorldArts.",
      "modal.login.action": "Continue with Pi",
      "modal.payment.title": "Confirm payment",
      "modal.payment.text": "This artwork will be paid directly through the Pi SDK.",
      "modal.payment.action": "Pay with Pi",

      "footer.description": "The global marketplace for art, music and cinema, powered by Pi Network.",
      "footer.explore": "Explore",
      "footer.company": "Organization",
      "footer.contact": "Contact",
      "footer.rights": "© 2026 WorldArts. All rights reserved."
    },

    rn: {
      "accessibility.skip": "Ja ku biri ku vy'ingenzi",
      "language.label": "Hitamwo ururimi",
      "theme.change": "Hindura uburyo bw'ibara",
      "nav.menu": "Ibikubiyemwo",

      "nav.home": "Ku ntango",
      "nav.gallery": "Ikaze ry'ubuhanzi",
      "nav.artists": "Abahanzi",
      "nav.marketplace": "Isoko",
      "nav.about": "Ivyerekeye",
      "nav.contact": "Twandikire",
      "nav.connect": "Injira na Pi",

      "hero.eyebrow": "Isoko mpuzamakungu ry'ubuhanzi",
      "hero.title": "Rondera, egeranya kandi ugurishe ubuhanzi <em>hose kw'isi</em>",
      "hero.subtitle": "WorldArts ihuza abahanzi n'abakusanya ibihangano, umuziki n'amashusho, bishurwa muri Pi Network na WART.",
      "hero.connect": "Injira na Pi",
      "hero.explore": "Raba ikaze ry'ubuhanzi",
      "hero.stats.countries": "Ibihugu",
      "hero.stats.languages": "Indimi",
      "hero.stats.payments": "Kwishura",
      "hero.note": "Kwishura gusa muri π (Pi) na WART — nta dolari canke USDT",

      "features.eyebrow": "Ivyo ushobora gukora",
      "features.title": "Porogarama imwe, ubuhanzi bwose bw'isi",
      "features.visual": "Ibishushanyo",
      "features.audio": "Umuziki",
      "features.motion": "Amashusho",
      "features.trade": "Ubudandaji",
      "features.art.title": "Rondera ubuhanzi",
      "features.art.text": "Raba ibihangano biva ku bahanzi bo hirya no hino kw'isi.",
      "features.gallery": "Ikaze ry'ubuhanzi",
      "features.music.title": "Rondera umuziki",
      "features.music.text": "Umva kandi ushigikire abahanzi b'umuziki.",
      "features.videos.title": "Rondera amashusho",
      "features.videos.text": "Raba ibihangano vy'amashusho.",
      "features.pi.title": "Gura no kugurisha na Pi",
      "features.pi.text": "Kora ibikorwa vyawe ukoresheje Pi Network canke WART.",
      "features.marketplace": "Isoko",

      "gallery.eyebrow": "Amatora",
      "gallery.title": "Uruzitiro rw'ikaze",
      "gallery.loading": "Ibihangano biriko birapakururwa...",
      "gallery.empty": "Nta gihangano kiraboneka ubu.",
      "gallery.error": "Ntitwashoboye gupakurura ikaze ubu.",
      "gallery.buyPi": "Gura na Pi",
      "gallery.buyWart": "Gura na WART",

      "artists.eyebrow": "Umuryango",
      "artists.title": "Abahanzi bahawe icubahiro",
      "artists.aline.origin": "Bujumbura, Burundi",
      "artists.aline.bio": "Umuhanzi w'amashusho akoresha uburyo butandukanye kandi agashakashaka imigenzo y'akarere k'Ibiyaga Binini.",
      "artists.kenji.origin": "Osaka, Ubuyapani",
      "artists.kenji.bio": "Umuhimbyi avanga koto gakondo n'amajwi ya none.",
      "artists.samira.origin": "Cairo, Misiri",
      "artists.samira.bio": "Umuhinguzi w'amafilime yerekana abanyabukorikori bo mu kiyaya ca Nili.",

      "about.eyebrow": "Intumbero yacu",
      "about.title": "Ubuhanzi nk'ururimi rusanzwe",
      "about.text1": "WorldArts ihuza abahanzi n'abakusanya ibihangano bo kw'isi yose.",
      "about.text2": "Porogarama ishigikira indimi zitandatu hamwe no kwishura muri Pi Network na WART.",

      "payment.eyebrow": "Kwishura",
      "payment.title": "Ifaranga rimwe ku buhanzi butagira imbibe",
      "payment.text": "Kwishura muri WorldArts bikorwa muri Pi Network canke WART.",
      "payment.pi": "Pi Network",
      "payment.wart": "WorldArts Token",
      "payment.noFiat": "Nta USD · Nta USDT",

      "pi.auth.title": "Kwemeza konti ya Pi",
      "pi.auth.text": "Huza konti yawe ya Pi kugira ngo ushobore kwishura.",
      "pi.auth.connect": "Injira na Pi",
      "pi.status.disconnected": "Ntaco irahuza",
      "pi.status.connecting": "Pi iriko irahuza...",
      "pi.status.connected": "Yahujwe na Pi",
      "pi.status.waiting": "— turindiriye ukwinjira —",

      "contact.eyebrow": "Twandikire",
      "contact.title": "Ikibazo ku bakozi ba WorldArts?",
      "contact.form.name": "Izina ryawe",
      "contact.form.email": "Imeyili yawe",
      "contact.form.message": "Ubutumwa bwawe",
      "contact.form.send": "Rungika ubutumwa",
      "contact.form.sent": "Urakoze, ubutumwa bwawe bwakiriwe.",

      "modal.close": "Funga",
      "modal.login.title": "Kwinjira na Pi",
      "modal.login.text": "Wiyemeze ukoresheje konti yawe ya Pi kugira ngo ukoreshe WorldArts.",
      "modal.login.action": "Komeza na Pi",
      "modal.payment.title": "Emeza kwishura",
      "modal.payment.text": "Iki gihangano kizishurwa biciye muri Pi SDK.",
      "modal.payment.action": "Ishura na Pi",

      "footer.description": "Isoko mpuzamakungu ry'ubuhanzi, umuziki n'amafilime, rikoreshwa na Pi Network.",
      "footer.explore": "Raba",
      "footer.company": "Ishirahamwe",
      "footer.contact": "Twandikire",
      "footer.rights": "© 2026 WorldArts. Uburenganzira bwose burabitswe."
    },

    sw: {
      "accessibility.skip": "Nenda kwenye maudhui makuu",
      "language.label": "Chagua lugha",
      "theme.change": "Badilisha mandhari",
      "nav.menu": "Menyu",

      "nav.home": "Nyumbani",
      "nav.gallery": "Ghala la Sanaa",
      "nav.artists": "Wasanii",
      "nav.marketplace": "Soko",
      "nav.about": "Kuhusu",
      "nav.contact": "Wasiliana",
      "nav.connect": "Ungana na Pi",

      "hero.eyebrow": "Soko la sanaa la kimataifa",
      "hero.title": "Gundua, kusanya na uuze sanaa <em>popote duniani</em>",
      "hero.subtitle": "WorldArts inaunganisha wasanii na wakusanyaji kwa Pi Network na WART.",
      "hero.connect": "Ungana na Pi",
      "hero.explore": "Chunguza ghala",
      "hero.stats.countries": "Nchi",
      "hero.stats.languages": "Lugha",
      "hero.stats.payments": "Malipo",
      "hero.note": "Malipo pekee kwa π (Pi) na WART — hakuna dola wala USDT",

      "features.eyebrow": "Unachoweza kufanya",
      "features.title": "Programu moja, sanaa yote ya dunia",
      "features.visual": "Picha",
      "features.audio": "Sauti",
      "features.motion": "Video",
      "features.trade": "Biashara",
      "features.art.title": "Gundua sanaa",
      "features.art.text": "Vinjari kazi za wasanii duniani kote.",
      "features.gallery": "Ghala",
      "features.music.title": "Gundua muziki",
      "features.music.text": "Sikiliza na uwaunge mkono wasanii.",
      "features.videos.title": "Gundua video",
      "features.videos.text": "Chunguza kazi za video.",
      "features.pi.title": "Nunua na uuze kwa Pi",
      "features.pi.text": "Kamilisha miamala kwa Pi Network au WART.",
      "features.marketplace": "Soko",

      "gallery.eyebrow": "Uteuzi",
      "gallery.title": "Ukuta wa ghala",
      "gallery.loading": "Inapakia kazi...",
      "gallery.empty": "Hakuna kazi inayopatikana kwa sasa.",
      "gallery.error": "Haiwezekani kupakia ghala kwa sasa.",
      "gallery.buyPi": "Nunua kwa Pi",
      "gallery.buyWart": "Nunua kwa WART",

      "artists.eyebrow": "Jamii",
      "artists.title": "Wasanii wanaoangaziwa",
      "artists.aline.origin": "Bujumbura, Burundi",
      "artists.aline.bio": "Msanii anayechunguza mbinu mbalimbali na mila za eneo la Maziwa Makuu.",
      "artists.kenji.origin": "Osaka, Japani",
      "artists.kenji.bio": "Mtunzi anayechanganya koto ya jadi na sauti za kielektroniki.",
      "artists.samira.origin": "Cairo, Misri",
      "artists.samira.bio": "Mtengenezaji wa filamu anayerekodi mafundi wa Bonde la Nile.",

      "about.eyebrow": "Dhamira yetu",
      "about.title": "Sanaa kama lugha ya pamoja",
      "about.text1": "WorldArts inaunganisha waundaji na wakusanyaji kutoka duniani kote.",
      "about.text2": "Programu inaunga mkono lugha sita na malipo kwa Pi Network na WART.",

      "payment.eyebrow": "Malipo",
      "payment.title": "Sarafu moja kwa sanaa isiyo na mipaka",
      "payment.text": "Malipo ya WorldArts hutumia Pi Network au WART.",
      "payment.pi": "Pi Network",
      "payment.wart": "WorldArts Token",
      "payment.noFiat": "Hakuna USD · Hakuna USDT",

      "pi.auth.title": "Uthibitishaji wa Pi",
      "pi.auth.text": "Unganisha akaunti yako ya Pi ili kufanya malipo.",
      "pi.auth.connect": "Ungana na Pi",
      "pi.status.disconnected": "Haijaunganishwa",
      "pi.status.connecting": "Inaunganisha Pi...",
      "pi.status.connected": "Imeunganishwa na Pi",
      "pi.status.waiting": "— inasubiri muunganisho —",

      "contact.eyebrow": "Wasiliana nasi",
      "contact.title": "Una swali kwa timu ya WorldArts?",
      "contact.form.name": "Jina lako",
      "contact.form.email": "Barua pepe yako",
      "contact.form.message": "Ujumbe wako",
      "contact.form.send": "Tuma ujumbe",
      "contact.form.sent": "Asante, ujumbe wako umepokelewa.",

      "modal.close": "Funga",
      "modal.login.title": "Kuingia kwa Pi",
      "modal.login.text": "Thibitisha akaunti yako ya Pi.",
      "modal.login.action": "Endelea na Pi",
      "modal.payment.title": "Thibitisha malipo",
      "modal.payment.text": "Kazi hii italipwa kupitia Pi SDK.",
      "modal.payment.action": "Lipa kwa Pi",

      "footer.description": "Soko la kimataifa la sanaa, muziki na filamu, likitumia Pi Network.",
      "footer.explore": "Chunguza",
      "footer.company": "Shirika",
      "footer.contact": "Wasiliana",
      "footer.rights": "© 2026 WorldArts. Haki zote zimehifadhiwa."
    },

    ar: {
      "accessibility.skip": "انتقل إلى المحتوى الرئيسي",
      "language.label": "اختر اللغة",
      "theme.change": "تغيير المظهر",
      "nav.menu": "القائمة",

      "nav.home": "الرئيسية",
      "nav.gallery": "المعرض",
      "nav.artists": "الفنانون",
      "nav.marketplace": "السوق",
      "nav.about": "من نحن",
      "nav.contact": "تواصل معنا",
      "nav.connect": "الاتصال عبر Pi",

      "hero.eyebrow": "سوق الفن العالمي",
      "hero.title": "اكتشف واقتنِ وبِع الفن <em>في أي مكان بالعالم</em>",
      "hero.subtitle": "تجمع WorldArts بين الفنانين وجامعي الأعمال مع الدفع عبر Pi Network وWART.",
      "hero.connect": "الاتصال عبر Pi",
      "hero.explore": "استكشف المعرض",
      "hero.stats.countries": "الدول",
      "hero.stats.languages": "اللغات",
      "hero.stats.payments": "المدفوعات",
      "hero.note": "الدفع حصريًا بعملة Pi وWART — لا دولار ولا USDT",

      "features.eyebrow": "ما يمكنك فعله",
      "features.title": "تطبيق واحد، كل فن العالم",
      "features.visual": "مرئي",
      "features.audio": "صوت",
      "features.motion": "فيديو",
      "features.trade": "تجارة",
      "features.art.title": "اكتشف الفن",
      "features.art.text": "تصفح أعمال الفنانين حول العالم.",
      "features.gallery": "المعرض",
      "features.music.title": "اكتشف الموسيقى",
      "features.music.text": "استمع وادعم المبدعين.",
      "features.videos.title": "اكتشف الفيديوهات",
      "features.videos.text": "استكشف أعمال الفيديو.",
      "features.pi.title": "الشراء والبيع عبر Pi",
      "features.pi.text": "أتمم المعاملات عبر Pi أو WART.",
      "features.marketplace": "السوق",

      "gallery.eyebrow": "مختارات",
      "gallery.title": "جدار المعرض",
      "gallery.loading": "جار تحميل الأعمال...",
      "gallery.empty": "لا توجد أعمال متاحة حاليًا.",
      "gallery.error": "تعذر تحميل المعرض حاليًا.",
      "gallery.buyPi": "الشراء عبر Pi",
      "gallery.buyWart": "الشراء عبر WART",

      "artists.eyebrow": "المجتمع",
      "artists.title": "فنانون مميزون",
      "artists.aline.origin": "بوجومبورا، بوروندي",
      "artists.aline.bio": "فنانة تستكشف تقنيات مختلفة وتقاليد منطقة البحيرات العظمى.",
      "artists.kenji.origin": "أوساكا، اليابان",
      "artists.kenji.bio": "ملحن يمزج الكوتو التقليدي مع الأصوات الإلكترونية.",
      "artists.samira.origin": "القاهرة، مصر",
      "artists.samira.bio": "مخرجة توثق الحرفيين في وادي النيل.",

      "about.eyebrow": "مهمتنا",
      "about.title": "الفن كلغة مشتركة",
      "about.text1": "تجمع WorldArts بين المبدعين وجامعي الأعمال من جميع أنحاء العالم.",
      "about.text2": "يدعم التطبيق ست لغات والمدفوعات عبر Pi Network وWART.",

      "payment.eyebrow": "المدفوعات",
      "payment.title": "عملة واحدة لفن بلا حدود",
      "payment.text": "مدفوعات WorldArts عبر Pi Network أو WART.",
      "payment.pi": "Pi Network",
      "payment.wart": "WorldArts Token",
      "payment.noFiat": "لا USD · لا USDT",

      "pi.auth.title": "مصادقة Pi",
      "pi.auth.text": "اربط حساب Pi الخاص بك لإجراء المدفوعات.",
      "pi.auth.connect": "الاتصال عبر Pi",
      "pi.status.disconnected": "غير متصل",
      "pi.status.connecting": "جار الاتصال بـ Pi...",
      "pi.status.connected": "متصل بـ Pi",
      "pi.status.waiting": "— في انتظار الاتصال —",

      "contact.eyebrow": "راسلنا",
      "contact.title": "سؤال لفريق WorldArts؟",
      "contact.form.name": "اسمك",
      "contact.form.email": "بريدك الإلكتروني",
      "contact.form.message": "رسالتك",
      "contact.form.send": "إرسال الرسالة",
      "contact.form.sent": "شكرًا، تم استلام رسالتك.",

      "modal.close": "إغلاق",
      "modal.login.title": "تسجيل الدخول عبر Pi",
      "modal.login.text": "وثّق حسابك عبر Pi.",
      "modal.login.action": "المتابعة عبر Pi",
      "modal.payment.title": "تأكيد الدفع",
      "modal.payment.text": "سيُدفع ثمن هذا العمل عبر Pi SDK.",
      "modal.payment.action": "الدفع عبر Pi",

      "footer.description": "السوق العالمي للفن والموسيقى والسينما، مدعومًا بواسطة Pi Network.",
      "footer.explore": "استكشف",
      "footer.company": "المنظمة",
      "footer.contact": "تواصل",
      "footer.rights": "© 2026 WorldArts. جميع الحقوق محفوظة."
    },

    zh: {
      "accessibility.skip": "跳转到主要内容",
      "language.label": "选择语言",
      "theme.change": "切换主题",
      "nav.menu": "菜单",

      "nav.home": "首页",
      "nav.gallery": "画廊",
      "nav.artists": "艺术家",
      "nav.marketplace": "市场",
      "nav.about": "关于我们",
      "nav.contact": "联系我们",
      "nav.connect": "使用 Pi 连接",

      "hero.eyebrow": "全球艺术市场",
      "hero.title": "在<em>世界任何角落</em>发现、收藏与出售艺术品",
      "hero.subtitle": "WorldArts 连接艺术家与收藏家，支持 Pi Network 和 WART 支付。",
      "hero.connect": "使用 Pi 连接",
      "hero.explore": "浏览画廊",
      "hero.stats.countries": "国家",
      "hero.stats.languages": "语言",
      "hero.stats.payments": "支付",
      "hero.note": "仅支持 Pi 与 WART — 不支持美元或 USDT",

      "features.eyebrow": "您可以做什么",
      "features.title": "一个应用，汇聚世界艺术",
      "features.visual": "视觉",
      "features.audio": "音频",
      "features.motion": "视频",
      "features.trade": "交易",
      "features.art.title": "发现艺术",
      "features.art.text": "浏览来自全球艺术家的作品。",
      "features.gallery": "画廊",
      "features.music.title": "发现音乐",
      "features.music.text": "聆听并支持创作者。",
      "features.videos.title": "发现视频",
      "features.videos.text": "探索视频作品。",
      "features.pi.title": "使用 Pi 买卖",
      "features.pi.text": "通过 Pi 或 WART 完成交易。",
      "features.marketplace": "市场",

      "gallery.eyebrow": "精选",
      "gallery.title": "画廊墙",
      "gallery.loading": "正在加载作品...",
      "gallery.empty": "目前没有可用作品。",
      "gallery.error": "目前无法加载画廊。",
      "gallery.buyPi": "使用 Pi 购买",
      "gallery.buyWart": "使用 WART 购买",

      "artists.eyebrow": "社区",
      "artists.title": "精选艺术家",
      "artists.aline.origin": "布琼布拉，布隆迪",
      "artists.aline.bio": "探索不同艺术技巧以及大湖地区传统的画家。",
      "artists.kenji.origin": "大阪，日本",
      "artists.kenji.bio": "将传统琴和电子声音融合的作曲家。",
      "artists.samira.origin": "开罗，埃及",
      "artists.samira.bio": "记录尼罗河谷工匠的电影导演。",

      "about.eyebrow": "我们的使命",
      "about.title": "艺术作为共同语言",
      "about.text1": "WorldArts 将来自世界各地的创作者和收藏家汇聚在一起。",
      "about.text2": "应用支持六种语言以及 Pi Network 和 WART 支付。",

      "payment.eyebrow": "支付",
      "payment.title": "无国界艺术的统一货币",
      "payment.text": "WorldArts 使用 Pi Network 或 WART 支付。",
      "payment.pi": "Pi Network",
      "payment.wart": "WorldArts Token",
      "payment.noFiat": "不支持 USD · 不支持 USDT",

      "pi.auth.title": "Pi 身份验证",
      "pi.auth.text": "连接您的 Pi 账户以进行支付。",
      "pi.auth.connect": "使用 Pi 连接",
      "pi.status.disconnected": "未连接",
      "pi.status.connecting": "正在连接 Pi...",
      "pi.status.connected": "已连接 Pi",
      "pi.status.waiting": "— 等待连接 —",

      "contact.eyebrow": "联系我们",
      "contact.title": "有问题想问 WorldArts 团队？",
      "contact.form.name": "您的姓名",
      "contact.form.email": "您的邮箱",
      "contact.form.message": "您的留言",
      "contact.form.send": "发送消息",
      "contact.form.sent": "感谢，您的消息已收到。",

      "modal.close": "关闭",
      "modal.login.title": "Pi 登录",
      "modal.login.text": "使用您的 Pi 账户认证。",
      "modal.login.action": "使用 Pi 继续",
      "modal.payment.title": "确认付款",
      "modal.payment.text": "该作品将通过 Pi SDK 支付。",
      "modal.payment.action": "使用 Pi 付款",

      "footer.description": "全球艺术、音乐和电影市场，由 Pi Network 提供支持。",
      "footer.explore": "探索",
      "footer.company": "组织",
      "footer.contact": "联系我们",
      "footer.rights": "© 2026 WorldArts. 版权所有。"
    }
  };


  /* =======================================================
     UTILITAIRES
     ======================================================= */

  const $ = (id) => document.getElementById(id);

  function currentLanguage() {
    return localStorage.getItem("worldarts_lang") || "fr";
  }

  function t(key) {
    const lang = currentLanguage();
    return (
      translations[lang]?.[key] ??
      translations.fr[key] ??
      key
    );
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }


  /* =======================================================
     INTERNATIONALISATION
     ======================================================= */

  function applyLanguage(lang) {
    if (!translations[lang]) {
      lang = "fr";
    }

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const value = translations[lang][key];

      if (value !== undefined) {
        element.innerHTML = value;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      const value = translations[lang][key];

      if (value !== undefined) {
        element.setAttribute("placeholder", value);
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      const key = element.getAttribute("data-i18n-aria");
      const value = translations[lang][key];

      if (value !== undefined) {
        element.setAttribute("aria-label", value);
      }
    });

    const langSelect = $("langSelect");

    if (langSelect) {
      langSelect.value = lang;
    }

    localStorage.setItem("worldarts_lang", lang);
  }


  /* =======================================================
     THEME
     ======================================================= */

  function applyTheme(theme) {
    const safeTheme = theme === "dark" ? "dark" : "light";

    document.documentElement.setAttribute(
      "data-theme",
      safeTheme
    );

    document.body.setAttribute(
      "data-theme",
      safeTheme
    );

    localStorage.setItem(
      "worldarts_theme",
      safeTheme
    );

    const button = $("themeToggle");

    if (button) {
      button.setAttribute(
        "aria-pressed",
        safeTheme === "dark" ? "true" : "false"
      );
    }
  }


  /* =======================================================
     MODALS
     ======================================================= */

  function openModal(id) {
    const modal = $(id);

    if (!modal) return;

    modal.classList.add("open");
    document.body.classList.add("modal-open");

    const firstButton = modal.querySelector(
      "button, input, textarea"
    );

    setTimeout(() => {
      firstButton?.focus();
    }, 50);
  }

  function closeModal(id) {
    const modal = $(id);

    if (!modal) return;

    modal.classList.remove("open");

    if (!document.querySelector(".modal-overlay.open")) {
      document.body.classList.remove("modal-open");
    }
  }


  /* =======================================================
     NOTIFICATION
     ======================================================= */

  function notify(message, type = "info") {
    let toast = $("worldartsToast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "worldartsToast";

      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");

      toast.style.cssText = `
        position:fixed;
        left:50%;
        bottom:24px;
        transform:translateX(-50%);
        z-index:99999;
        padding:13px 18px;
        border-radius:12px;
        background:#171717;
        color:#fff;
        max-width:90%;
        text-align:center;
        box-shadow:0 10px 35px rgba(0,0,0,.28);
        font:500 14px/1.4 system-ui,sans-serif;
      `;

      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.display = "block";

    if (type === "error") {
      toast.style.border = "1px solid rgba(220,80,80,.5)";
    } else {
      toast.style.border = "1px solid rgba(255,255,255,.15)";
    }

    clearTimeout(toast._timer);

    toast._timer = setTimeout(() => {
      toast.style.display = "none";
    }, type === "error" ? 5000 : 3000);
  }


  /* =======================================================
     NAVIGATION MOBILE
     ======================================================= */

  function closeMobileMenu() {
    const navLinks = $("navLinks");
    const burger = $("navBurger");

    navLinks?.classList.remove("open");

    burger?.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  function initMobileMenu() {
    const burger = $("navBurger");
    const navLinks = $("navLinks");

    if (!burger || !navLinks) return;

    burger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      burger.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        !navLinks.contains(event.target) &&
        !burger.contains(event.target)
      ) {
        closeMobileMenu();
      }
    });
  }


  /* =======================================================
     NAVIGATION ACTIVE + SCROLL
     ======================================================= */

  function initNavigationObserver() {
    const nav = $("siteNav");
    const sections = document.querySelectorAll(
      "main section[id]"
    );

    const links = document.querySelectorAll(
      ".nav-links a[href^='#']"
    );

    window.addEventListener(
      "scroll",
      () => {
        if (!nav) return;

        nav.classList.toggle(
          "is-scrolled",
          window.scrollY > 20
        );
      },
      { passive: true }
    );

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.id;

          links.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });
  }


  /* =======================================================
     PI SDK
     ======================================================= */

  function initPiSdk() {
    if (typeof window.Pi === "undefined") {
      piInitialized = false;

      console.warn(
        "WorldArts: Pi SDK non disponible. Utilisez Pi Browser."
      );

      return false;
    }

    try {
      window.Pi.init({
        version: "2.0",
        sandbox: PI_SANDBOX
      });

      piInitialized = true;

      return true;

    } catch (error) {
      piInitialized = false;

      console.error(
        "WorldArts Pi.init:",
        error
      );

      return false;
    }
  }


  /* =======================================================
     PI STATUS
     ======================================================= */

  function updatePiStatus(connected, connecting = false) {
    const status = $("piStatus");
    const statusText = $("piStatusText");

    if (!status || !statusText) return;

    status.classList.toggle(
      "connected",
      Boolean(connected)
    );

    if (connecting) {
      statusText.textContent = t(
        "pi.status.connecting"
      );
      return;
    }

    if (connected) {
      statusText.textContent =
        "@" + (piUser?.username || "Pi");
    } else {
      statusText.textContent =
        t("pi.status.disconnected");
    }
  }


  /* =======================================================
     PI BUTTONS
     ======================================================= */

  function updatePiButtons() {
    const buttons = [
      $("piConnectBtn"),
      $("heroConnectBtn"),
      $("piPanelConnectBtn"),
      $("modalConnectBtn")
    ].filter(Boolean);

    buttons.forEach((button) => {
      if (piUser) {
        button.textContent =
          "@" + (piUser.username || "Pi");

        button.dataset.connected = "true";

      } else {
        button.textContent =
          t("nav.connect");

        button.dataset.connected = "false";
      }
    });
  }


  /* =======================================================
     PI INCOMPLETE PAYMENT
     ======================================================= */

  function onIncompletePaymentFound(payment) {
    console.warn(
      "WorldArts: paiement Pi incomplet:",
      payment
    );

    if (
      API_BASE &&
      payment &&
      payment.identifier
    ) {
      fetch(
        API_BASE + "/payments/incomplete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            paymentId: payment.identifier,
            payment
          })
        }
      ).catch((error) => {
        console.warn(
          "Impossible d'enregistrer le paiement incomplet:",
          error
        );
      });
    }
  }


  /* =======================================================
     CONNEXION PI
     ======================================================= */

  async function connectWithPi() {

    if (piUser) {
      notify(
        "@" + (piUser.username || "Pi")
      );
      return piUser;
    }

    if (!initPiSdk()) {
      notify(
        "Le Pi SDK est disponible dans Pi Browser.",
        "error"
      );

      return null;
    }

    updatePiStatus(
      false,
      true
    );

    const buttons = [
      $("piConnectBtn"),
      $("heroConnectBtn"),
      $("piPanelConnectBtn"),
      $("modalConnectBtn")
    ].filter(Boolean);

    buttons.forEach((button) => {
      button.disabled = true;
    });

    try {

      const auth = await window.Pi.authenticate(
        [
          "username",
          "payments"
        ],
        onIncompletePaymentFound
      );

      if (
        !auth ||
        !auth.user
      ) {
        throw new Error(
          "Pi authentication returned no user."
        );
      }

      piUser = auth.user;

      updatePiStatus(true);
      updatePiButtons();

      closeModal("loginModal");

      notify(
        "Connexion Pi réussie."
      );

      return piUser;

    } catch (error) {

      console.error(
        "WorldArts Pi authentication:",
        error
      );

      piUser = null;

      updatePiStatus(false);
      updatePiButtons();

      notify(
        "Connexion Pi annulée ou impossible.",
        "error"
      );

      return null;

    } finally {

      buttons.forEach((button) => {
        button.disabled = false;
      });
    }
  }


  /* =======================================================
     BACKEND PAYMENT — APPROVAL
     ======================================================= */

  async function approvePaymentOnServer(
    paymentId
  ) {

    if (!API_BASE) {
      throw new Error(
        "Backend WorldArts non configuré."
      );
    }

    const response = await fetch(
      API_BASE + "/payments/approve",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          paymentId
        })
      }
    );

    if (!response.ok) {

      let details = "";

      try {
        details = await response.text();
      } catch (_) {}

      throw new Error(
        `Server approval failed (${response.status}) ${details}`
      );
    }

    return response.json().catch(
      () => ({ success: true })
    );
  }


  /* =======================================================
     BACKEND PAYMENT — COMPLETION
     ======================================================= */

  async function completePaymentOnServer(
    paymentId,
    txid
  ) {

    if (!API_BASE) {
      throw new Error(
        "Backend WorldArts non configuré."
      );
    }

    const response = await fetch(
      API_BASE + "/payments/complete",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          paymentId,
          txid
        })
      }
    );

    if (!response.ok) {

      let details = "";

      try {
        details = await response.text();
      } catch (_) {}

      throw new Error(
        `Server completion failed (${response.status}) ${details}`
      );
    }

    return response.json().catch(
      () => ({ success: true })
    );
  }


  /* =======================================================
     PI PAYMENT
     ======================================================= */

  async function payWithPi(
    amount,
    memo,
    metadata = {}
  ) {

    const numericAmount =
      Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      notify(
        "Montant Pi invalide.",
        "error"
      );

      return false;
    }

    if (!initPiSdk()) {
      notify(
        "Le paiement Pi nécessite Pi Browser.",
        "error"
      );

      return false;
    }

    if (!piUser) {

      closeModal("paymentModal");
      openModal("loginModal");

      notify(
        "Connectez-vous d'abord avec Pi.",
        "error"
      );

      return false;
    }

    currentPayment = {
      amount: numericAmount,
      memo: memo || "WorldArts",
      metadata
    };

    try {

      window.Pi.createPayment(
        {
          amount: numericAmount,

          memo:
            memo ||
            "WorldArts",

          metadata: Object.assign(
            {
              app: "WorldArts",
              username:
                piUser.username || ""
            },
            metadata
          )
        },

        {

          /* -----------------------------------------------
             Pi demande au serveur d'approuver
             ----------------------------------------------- */

          onReadyForServerApproval:
            async function (paymentId) {

              console.log(
                "Pi payment approval:",
                paymentId
              );

              try {

                await approvePaymentOnServer(
                  paymentId
                );

                notify(
                  "Paiement Pi approuvé par WorldArts."
                );

              } catch (error) {

                console.error(
                  "Pi approval error:",
                  error
                );

                notify(
                  "Le serveur n'a pas pu approuver le paiement Pi.",
                  "error"
                );
              }
            },


          /* -----------------------------------------------
             Pi demande au serveur de compléter
             ----------------------------------------------- */

          onReadyForServerCompletion:
            async function (
              paymentId,
              txid
            ) {

              console.log(
                "Pi payment completion:",
                paymentId,
                txid
              );

              try {

                await completePaymentOnServer(
                  paymentId,
                  txid
                );

                notify(
                  "Paiement Pi terminé avec succès."
                );

                currentPayment = null;

              } catch (error) {

                console.error(
                  "Pi completion error:",
                  error
                );

                notify(
                  "Paiement effectué, mais confirmation serveur impossible.",
                  "error"
                );
              }
            },


          /* -----------------------------------------------
             Paiement annulé
             ----------------------------------------------- */

          onCancel:
            function (paymentId) {

              console.log(
                "Paiement Pi annulé:",
                paymentId
              );

              notify(
                "Paiement Pi annulé."
              );
            },


          /* -----------------------------------------------
             Erreur Pi
             ----------------------------------------------- */

          onError:
            function (
              error,
              payment
            ) {

              console.error(
                "Pi payment error:",
                error,
                payment
              );

              notify(
                "Une erreur est survenue pendant le paiement Pi.",
                "error"
              );
            }
        }
      );

      return true;

    } catch (error) {

      console.error(
        "Pi.createPayment:",
        error
      );

      notify(
        "Impossible de lancer le paiement Pi.",
        "error"
      );

      return false;
    }
  }


  /* =======================================================
     GALERIE
     ======================================================= */

  function getArtworkImage(artwork) {
    return (
      artwork.imageUrl ||
      artwork.image ||
      artwork.image_url ||
      artwork.cover ||
      ""
    );
  }

  function getArtworkArtist(artwork) {
    return (
      artwork.artist ||
      artwork.artistName ||
      artwork.artist_name ||
      "WorldArts"
    );
  }

  function getArtworkCurrency(artwork) {
    return String(
      artwork.currency ||
      artwork.token ||
      "Pi"
    );
  }

  function getArtworkPrice(artwork) {
    const value =
      artwork.price ??
      artwork.amount ??
      "";

    return value;
  }


  function renderArtworks(
    artworks,
    container
  ) {

    if (!container) return;

    if (!Array.isArray(artworks) ||
        artworks.length === 0) {

      container.innerHTML = `
        <p class="empty-state">
          ${escapeHtml(
            t("gallery.empty")
          )}
        </p>
      `;

      return;
    }

    container.innerHTML =
      artworks.map((artwork) => {

        const title =
          escapeHtml(
            artwork.title ||
            artwork.name ||
            "WorldArts"
          );

        const artist =
          escapeHtml(
            getArtworkArtist(artwork)
          );

        const description =
          escapeHtml(
            artwork.description || ""
          );

        const image =
          escapeHtml(
            getArtworkImage(artwork)
          );

        const currency =
          escapeHtml(
            getArtworkCurrency(artwork)
          );

        const price =
          getArtworkPrice(artwork);

        const numericPrice =
          Number(price);

        const hasPrice =
          Number.isFinite(numericPrice) &&
          numericPrice > 0;

        const safeId =
          escapeHtml(
            artwork.id ||
            artwork._id ||
            artwork.identifier ||
            ""
          );

        return `
          <article
            class="artwork-card reveal"
            data-artwork-id="${safeId}"
          >

            ${
              image
                ? `
                  <img
                    src="${image}"
                    alt="${title}"
                    loading="lazy"
                  >
                `
                : ""
            }

            <div class="artwork-info">

              <h3>${title}</h3>

              <p>
                ${artist}
              </p>

              ${
                description
                  ? `
                    <p class="artwork-description">
                      ${description}
                    </p>
                  `
                  : ""
              }

              ${
                hasPrice
                  ? `
                    <div class="artwork-price">
                      ${escapeHtml(
                        String(price)
                      )} ${currency}
                    </div>
                  `
                  : ""
              }

              ${
                hasPrice &&
                String(
                  getArtworkCurrency(artwork)
                ).toLowerCase() === "pi"
                  ? `
                    <div class="artwork-actions">

                      <button
                        type="button"
                        class="btn btn-primary artwork-buy"
                        data-price="${escapeHtml(
                          String(price)
                        )}"
                        data-title="${title}"
                        data-artwork-id="${safeId}"
                      >
                        ${escapeHtml(
                          t("gallery.buyPi")
                        )}
                      </button>

                    </div>
                  `
                  : ""
              }

            </div>

          </article>
        `;

      }).join("");

    bindArtworkButtons(container);
    initRevealObserver();
  }


  function bindArtworkButtons(
    container
  ) {

    container
      .querySelectorAll(".artwork-buy")
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            const price =
              Number(
                button.dataset.price
              );

            const title =
              button.dataset.title ||
              "WorldArts";

            currentPayment = {
              amount: price,

              memo:
                "WorldArts — " +
                title,

              metadata: {
                artworkId:
                  button.dataset.artworkId ||
                  "",
                artworkTitle:
                  title
              }
            };

            const paymentText =
              document.querySelector(
                "#paymentModal p"
              );

            if (paymentText) {
              paymentText.textContent =
                `${title} — ${price} Pi`;
            }

            openModal(
              "paymentModal"
            );
          }
        );
      });
  }


  async function loadArtworks() {

    const container =
      document.querySelector(
        "[data-artworks]"
      );

    if (!container) return;

    container.innerHTML = `
      <p class="loading-state">
        ${escapeHtml(
          t("gallery.loading")
        )}
      </p>
    `;

    try {

      const response =
        await fetch(
          API_BASE + "/artworks",
          {
            method: "GET",
            headers: {
              "Accept":
                "application/json"
            }
          }
        );

      if (!response.ok) {
        throw new Error(
          `Artwork API ${response.status}`
        );
      }

      const data =
        await response.json();

      let artworks = [];

      if (Array.isArray(data)) {
        artworks = data;

      } else if (
        data &&
        Array.isArray(data.artworks)
      ) {
        artworks = data.artworks;

      } else if (
        data &&
        Array.isArray(data.data)
      ) {
        artworks = data.data;
      }

      renderArtworks(
        artworks,
        container
      );

    } catch (error) {

      console.warn(
        "WorldArts artworks:",
        error
      );

      container.innerHTML = `
        <p class="empty-state">
          ${escapeHtml(
            t("gallery.error")
          )}
        </p>
      `;
    }
  }


  /* =======================================================
     CONTACT
     ======================================================= */

  async function submitContactForm(
    form
  ) {

    const status =
      $("contactStatus");

    const submitButton =
      form.querySelector(
        'button[type="submit"]'
      );

    const name =
      form.querySelector(
        '[name="name"]'
      )?.value.trim() || "";

    const email =
      form.querySelector(
        '[name="email"]'
      )?.value.trim() || "";

    const message =
      form.querySelector(
        '[name="message"]'
      )?.value.trim() || "";

    if (
      !name ||
      !email ||
      !message
    ) {

      notify(
        "Veuillez remplir tous les champs.",
        "error"
      );

      return;
    }

    const emailValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

    if (!emailValid) {

      notify(
        "Veuillez entrer une adresse email valide.",
        "error"
      );

      return;
    }

    try {

      if (submitButton) {
        submitButton.disabled = true;
      }

      const response =
        await fetch(
          API_BASE + "/contact",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
              "Accept":
                "application/json"
            },

            body: JSON.stringify({
              name,
              email,
              message
            })
          }
        );

      if (!response.ok) {

        throw new Error(
          `Contact API ${response.status}`
        );
      }

      if (status) {
        status.style.display =
          "block";

        status.textContent =
          t("contact.form.sent");
      }

      form.reset();

      notify(
        t("contact.form.sent")
      );

    } catch (error) {

      console.error(
        "WorldArts contact:",
        error
      );

      notify(
        "Impossible d'envoyer le message pour le moment.",
        "error"
      );

    } finally {

      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  }


  /* =======================================================
     MODAL EVENTS
     ======================================================= */

  function initModals() {

    document
      .querySelectorAll(
        "[data-close]"
      )
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            closeModal(
              button.getAttribute(
                "data-close"
              )
            );
          }
        );
      });


    document
      .querySelectorAll(
        ".modal-overlay"
      )
      .forEach((overlay) => {

        overlay.addEventListener(
          "click",
          (event) => {

            if (
              event.target === overlay
            ) {
              overlay.classList.remove(
                "open"
              );

              if (
                !document.querySelector(
                  ".modal-overlay.open"
                )
              ) {
                document.body.classList.remove(
                  "modal-open"
                );
              }
            }
          }
        );
      });


    document.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Escape"
        ) {

          document
            .querySelectorAll(
              ".modal-overlay.open"
            )
            .forEach((modal) => {
              modal.classList.remove(
                "open"
              );
            });

          document.body.classList.remove(
            "modal-open"
          );
        }
      }
    );
  }


  /* =======================================================
     PI BUTTON EVENTS
     ======================================================= */

  function initPiButtons() {

    const connectButtons = [
      $("piConnectBtn"),
      $("heroConnectBtn"),
      $("piPanelConnectBtn"),
      $("modalConnectBtn")
    ].filter(Boolean);

    connectButtons.forEach(
      (button) => {

        button.addEventListener(
          "click",
          async () => {

            if (piUser) {

              notify(
                "@" +
                (piUser.username || "Pi")
              );

              return;
            }

            await connectWithPi();
          }
        );
      }
    );


    const payButton =
      $("modalPayBtn");

    if (payButton) {

      payButton.addEventListener(
        "click",
        async () => {

          if (!currentPayment) {

            notify(
              "Aucun paiement sélectionné.",
              "error"
            );

            return;
          }

          const payment =
            currentPayment;

          payButton.disabled =
            true;

          try {

            closeModal(
              "paymentModal"
            );

            await payWithPi(
              payment.amount,
              payment.memo,
              payment.metadata
            );

          } finally {

            payButton.disabled =
              false;
          }
        }
      );
    }
  }


  /* =======================================================
     LANGUAGE
     ======================================================= */

  function initLanguage() {

    const select =
      $("langSelect");

    const saved =
      localStorage.getItem(
        "worldarts_lang"
      ) || "fr";

    applyLanguage(
      translations[saved]
        ? saved
        : "fr"
    );

    if (!select) return;

    select.addEventListener(
      "change",
      (event) => {

        applyLanguage(
          event.target.value
        );

        updatePiButtons();
        updatePiStatus(
          Boolean(piUser)
        );

        loadArtworks();
      }
    );
  }


  /* =======================================================
     THEME
     ======================================================= */

  function initTheme() {

    const saved =
      localStorage.getItem(
        "worldarts_theme"
      );

    if (
      saved === "dark" ||
      saved === "light"
    ) {

      applyTheme(saved);

    } else {

      const prefersDark =
        window.matchMedia &&
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

      applyTheme(
        prefersDark
          ? "dark"
          : "light"
      );
    }

    const toggle =
      $("themeToggle");

    if (!toggle) return;

    toggle.addEventListener(
      "click",
      () => {

        const current =
          document.body.getAttribute(
            "data-theme"
          );

        applyTheme(
          current === "dark"
            ? "light"
            : "dark"
        );
      }
    );
  }


  /* =======================================================
     CONTACT INITIALISATION
     ======================================================= */

  function initContact() {

    const form =
      $("contactForm");

    if (!form) return;

    form.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();

        submitContactForm(
          form
        );
      }
    );
  }


  /* =======================================================
     REVEAL ANIMATION
     ======================================================= */

  function initRevealObserver() {

    const elements =
      document.querySelectorAll(
        ".reveal"
      );

    if (
      !elements.length ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach(
        (element) =>
          element.classList.add("in")
      );

      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }

              entry.target.classList.add(
                "in"
              );

              observer.unobserve(
                entry.target
              );
            }
          );
        },
        {
          threshold: 0.12
        }
      );

    elements.forEach(
      (element) =>
        observer.observe(element)
    );
  }


  /* =======================================================
     INITIALISATION
     ======================================================= */

  async function init() {

    console.log(
      "WorldArts: initialisation..."
    );

    initTheme();

    initLanguage();

    initMobileMenu();

    initNavigationObserver();

    initModals();

    initPiButtons();

    initContact();

    initRevealObserver();

    initPiSdk();

    updatePiStatus(
      false
    );

    updatePiButtons();

    await loadArtworks();

    console.log(
      "WorldArts: application initialisée."
    );
  }


  /* =======================================================
     API PUBLIQUE
     ======================================================= */

  window.WorldArts = {

    connectWithPi,

    payWithPi,

    applyLanguage,

    applyTheme,

    loadArtworks,

    openModal,

    closeModal,

    getCurrentUser: () =>
      piUser,

    getCurrentPayment: () =>
      currentPayment
  };


  /* =======================================================
     START
     ======================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();
  }

})();

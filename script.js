
/* ============================================================
   WorldArts — script.js
   Gère : thème clair/sombre, langue (i18n), menu mobile,
   connexion Pi (Pi SDK), paiements Pi, modales, formulaire
   de contact, animations au scroll.
   ============================================================ */

/* ---------------------------------------------------------
   1. CONFIGURATION
   --------------------------------------------------------- */

// ⚠️ Remplace par l'URL réelle de ton backend une fois déployé sur Render
const API_URL = "https://worldarts-backend.onrender.com";

// ⚠️ Passe à false uniquement après validation par le Pi Core Team (mainnet)
const PI_SANDBOX = true;

let piUser = null;
let currentLang = localStorage.getItem("worldarts_lang") || "fr";

/* ---------------------------------------------------------
   2. TRADUCTIONS (FR / EN / RN / SW / AR / ZH)
   --------------------------------------------------------- */

const translations = {
  fr: {
    "nav.home": "Accueil", "nav.gallery": "Galerie", "nav.artists": "Artistes",
    "nav.marketplace": "Marché", "nav.about": "À propos", "nav.contact": "Contact",
    "nav.connect": "Se connecter avec Pi",
    "hero.eyebrow": "Marché d'art mondial",
    "hero.title": "Découvrez, collectionnez et vendez de l'art <em>partout dans le monde</em>",
    "hero.subtitle": "WorldArts réunit artistes et collectionneurs autour d'œuvres, de musique et de vidéos, avec des paiements en Pi Network et en jeton WART.",
    "hero.connect": "Se connecter avec Pi", "hero.explore": "Explorer la galerie",
    "hero.note": "Paiements exclusivement en π (Pi) et WART — aucun dollar, aucun USDT",
    "features.eyebrow": "Ce que vous pouvez faire", "features.title": "Une seule application, tout l'art du monde",
    "features.art.title": "Découvrir l'art", "features.art.text": "Parcourez des œuvres originales issues d'artistes émergents et confirmés du monde entier.",
    "features.music.title": "Découvrir la musique", "features.music.text": "Écoutez et soutenez des créateurs musicaux indépendants directement depuis la plateforme.",
    "features.videos.title": "Découvrir les vidéos", "features.videos.text": "Explorez des créations vidéo et des performances filmées par des artistes du monde entier.",
    "features.pi.title": "Acheter & vendre avec Pi", "features.pi.text": "Réalisez chaque transaction en toute sécurité avec Pi Network ou le jeton WART.",
    "steps.eyebrow": "Étapes", "steps.title": "Comment fonctionne WorldArts",
    "steps.one.title": "Créer un profil", "steps.one.text": "Inscrivez-vous en tant qu'artiste ou collectionneur en quelques secondes.",
    "steps.two.title": "Connecter son portefeuille Pi", "steps.two.text": "Authentifiez-vous avec le Pi SDK pour activer les paiements.",
    "steps.three.title": "Publier ou parcourir", "steps.three.text": "Mettez une œuvre en vente ou parcourez la galerie mondiale.",
    "steps.four.title": "Payer en Pi ou WART", "steps.four.text": "Concluez la transaction en toute sécurité, sans dollar ni USDT.",
    "gallery.eyebrow": "Sélection", "gallery.title": "Le mur de la galerie",
    "artists.eyebrow": "Communauté", "artists.title": "Artistes à l'honneur",
    "artists.role.painter": "Peintre", "artists.role.musician": "Musicien",
    "artists.role.filmmaker": "Cinéaste", "artists.role.sculptor": "Sculpteur",
    "testimonials.eyebrow": "Témoignages", "testimonials.title": "Ce qu'en disent les artistes",
    "testimonials.one.text": "« J'ai vendu ma première toile en Pi le jour même de mon inscription. »", "testimonials.one.name": "Amara K., peintre",
    "testimonials.two.text": "« WorldArts m'a permis de toucher des collectionneurs sur trois continents. »", "testimonials.two.name": "Chen Wei, musicien",
    "testimonials.three.text": "« Le paiement en WART est instantané, sans frais bancaires. »", "testimonials.three.name": "Fatima Z., cinéaste",
    "payment.eyebrow": "Paiements", "payment.title": "Une monnaie pour un art sans frontières",
    "payment.text": "Toutes les transactions WorldArts passent uniquement par Pi Network ou le jeton WART — aucun dollar, aucun USDT.",
    "payment.pi.desc": "paiement natif via le Pi SDK", "payment.wart.desc": "jeton officiel de la place de marché WorldArts",
    "payment.card.eyebrow": "Exemple d'œuvre", "payment.card.title": "Aube sur le lac Tanganyika",
    "payment.card.artist": "par Amara K.", "payment.card.buy": "Acheter avec Pi",
    "about.eyebrow": "Notre mission", "about.title": "L'art comme langage commun",
    "about.text": "WorldArts connecte artistes et collectionneurs de toutes origines, en Kirundi, Français, Anglais, Kiswahili, Arabe et Chinois, pour que l'art voyage sans barrière de langue ni de devise.",
    "faq.eyebrow": "Questions", "faq.title": "Foire aux questions",
    "faq.q1.q": "Quelles devises sont acceptées ?", "faq.q1.a": "Uniquement Pi Network et le jeton WART. WorldArts n'accepte ni dollars ni USDT.",
    "faq.q2.q": "Comment vendre une œuvre ?", "faq.q2.a": "Créez un profil artiste, connectez votre portefeuille Pi, puis publiez votre œuvre avec son prix.",
    "faq.q3.q": "L'application fonctionne-t-elle dans le Pi Browser ?", "faq.q3.a": "Oui, WorldArts est optimisée pour le Pi Browser et conforme aux exigences du Pi Developer Portal.",
    "faq.q4.q": "Mes données sont-elles protégées ?", "faq.q4.a": "Oui, l'authentification passe par le Pi SDK et aucune donnée bancaire n'est stockée par WorldArts.",
    "contact.eyebrow": "Nous écrire", "contact.title": "Une question pour l'équipe WorldArts ?",
    "contact.form.name": "Votre nom", "contact.form.email": "Votre email", "contact.form.message": "Votre message",
    "contact.form.send": "Envoyer le message", "contact.form.sent": "Merci, votre message a bien été noté.",
    "footer.tagline": "Le marché mondial de l'art, en Pi et en WART.", "footer.explore": "Explorer",
    "footer.company": "WorldArts", "footer.legal": "Légal", "footer.terms": "Conditions", "footer.privacy": "Confidentialité",
    "footer.rights": "Tous droits réservés.", "footer.built": "Propulsé par Pi Network",
    "modal.login.title": "Connexion Pi", "modal.login.text": "Authentifiez-vous avec votre compte Pi pour accéder à votre profil WorldArts.", "modal.login.action": "Continuer avec Pi",
    "modal.payment.title": "Confirmer le paiement", "modal.payment.text": "Cette œuvre sera payée directement via le Pi SDK. Aucune autre devise n'est acceptée.", "modal.payment.action": "Payer avec Pi"
  },
  en: {
    "nav.home": "Home", "nav.gallery": "Gallery", "nav.artists": "Artists",
    "nav.marketplace": "Marketplace", "nav.about": "About", "nav.contact": "Contact",
    "nav.connect": "Connect with Pi",
    "hero.eyebrow": "The world art marketplace",
    "hero.title": "Discover, collect and sell art <em>from anywhere in the world</em>",
    "hero.subtitle": "WorldArts brings artists and collectors together around artwork, music and videos, with payments in Pi Network and the WART token.",
    "hero.connect": "Connect with Pi", "hero.explore": "Explore the gallery",
    "hero.note": "Payments exclusively in π (Pi) and WART — no dollars, no USDT",
    "features.eyebrow": "What you can do", "features.title": "One app, all the world's art",
    "features.art.title": "Discover art", "features.art.text": "Browse original artwork from emerging and established artists worldwide.",
    "features.music.title": "Discover music", "features.music.text": "Listen to and support independent musicians directly on the platform.",
    "features.videos.title": "Discover videos", "features.videos.text": "Explore video creations and filmed performances from artists around the world.",
    "features.pi.title": "Buy & sell with Pi", "features.pi.text": "Complete every transaction securely with Pi Network or the WART token.",
    "steps.eyebrow": "Steps", "steps.title": "How WorldArts works",
    "steps.one.title": "Create a profile", "steps.one.text": "Sign up as an artist or collector in seconds.",
    "steps.two.title": "Connect your Pi wallet", "steps.two.text": "Authenticate with the Pi SDK to enable payments.",
    "steps.three.title": "Publish or browse", "steps.three.text": "List an artwork for sale or browse the global gallery.",
    "steps.four.title": "Pay in Pi or WART", "steps.four.text": "Complete the transaction securely, with no dollars or USDT.",
    "gallery.eyebrow": "Selection", "gallery.title": "The gallery wall",
    "artists.eyebrow": "Community", "artists.title": "Featured artists",
    "artists.role.painter": "Painter", "artists.role.musician": "Musician",
    "artists.role.filmmaker": "Filmmaker", "artists.role.sculptor": "Sculptor",
    "testimonials.eyebrow": "Testimonials", "testimonials.title": "What artists say",
    "testimonials.one.text": "\"I sold my first painting in Pi the very day I signed up.\"", "testimonials.one.name": "Amara K., painter",
    "testimonials.two.text": "\"WorldArts let me reach collectors on three continents.\"", "testimonials.two.name": "Chen Wei, musician",
    "testimonials.three.text": "\"Paying in WART is instant, with no bank fees.\"", "testimonials.three.name": "Fatima Z., filmmaker",
    "payment.eyebrow": "Payments", "payment.title": "One currency for borderless art",
    "payment.text": "Every WorldArts transaction goes through Pi Network or the WART token only — no dollars, no USDT.",
    "payment.pi.desc": "native payment via the Pi SDK", "payment.wart.desc": "official token of the WorldArts marketplace",
    "payment.card.eyebrow": "Sample artwork", "payment.card.title": "Dawn over Lake Tanganyika",
    "payment.card.artist": "by Amara K.", "payment.card.buy": "Buy with Pi",
    "about.eyebrow": "Our mission", "about.title": "Art as a common language",
    "about.text": "WorldArts connects artists and collectors from every background, in Kirundi, French, English, Swahili, Arabic and Chinese, so art can travel without language or currency barriers.",
    "faq.eyebrow": "Questions", "faq.title": "Frequently asked questions",
    "faq.q1.q": "Which currencies are accepted?", "faq.q1.a": "Only Pi Network and the WART token. WorldArts accepts neither dollars nor USDT.",
    "faq.q2.q": "How do I sell an artwork?", "faq.q2.a": "Create an artist profile, connect your Pi wallet, then publish your artwork with its price.",
    "faq.q3.q": "Does the app work in the Pi Browser?", "faq.q3.a": "Yes, WorldArts is optimized for the Pi Browser and complies with Pi Developer Portal requirements.",
    "faq.q4.q": "Is my data protected?", "faq.q4.a": "Yes, authentication goes through the Pi SDK and WorldArts never stores banking data.",
    "contact.eyebrow": "Write to us", "contact.title": "A question for the WorldArts team?",
    "contact.form.name": "Your name", "contact.form.email": "Your email", "contact.form.message": "Your message",
    "contact.form.send": "Send message", "contact.form.sent": "Thank you, your message has been received.",
    "footer.tagline": "The world's art marketplace, in Pi and WART.", "footer.explore": "Explore",
    "footer.company": "WorldArts", "footer.legal": "Legal", "footer.terms": "Terms", "footer.privacy": "Privacy",
    "footer.rights": "All rights reserved.", "footer.built": "Powered by Pi Network",
    "modal.login.title": "Pi Login", "modal.login.text": "Authenticate with your Pi account to access your WorldArts profile.", "modal.login.action": "Continue with Pi",
    "modal.payment.title": "Confirm payment", "modal.payment.text": "This artwork will be paid for directly via the Pi SDK. No other currency is accepted.", "modal.payment.action": "Pay with Pi"
  },
  rn: {
    "nav.home": "Ahabanza", "nav.gallery": "Ivyerekanwa", "nav.artists": "Abahanzi",
    "nav.marketplace": "Isoko", "nav.about": "Ivyerekeye", "nav.contact": "Twandikire",
    "nav.connect": "Kwinjira na Pi",
    "hero.eyebrow": "Isoko ry'ubuhanzi ku isi yose",
    "hero.title": "Rondera, tora kandi ugurishe ubuhanzi <em>ahantu hose kw'isi</em>",
    "hero.subtitle": "WorldArts ihuza abahanzi n'abatora ivyerekanwa, indirimbo n'amashusho, hakoreshwa Pi Network na WART.",
    "hero.connect": "Kwinjira na Pi", "hero.explore": "Raba ivyerekanwa",
    "hero.note": "Kwishura gukorwa gusa muri π (Pi) na WART — nta madolari, nta USDT",
    "features.eyebrow": "Ivyo ushobora gukora", "features.title": "Application imwe, ubuhanzi bwose bw'isi",
    "features.art.title": "Rondera ubuhanzi", "features.art.text": "Raba ivyerekanwa bishasha biva ku bahanzi bo kw'isi yose.",
    "features.music.title": "Rondera indirimbo", "features.music.text": "Umviriza kandi ushigikire abahanzi b'indirimbo bigenga ukoresheje application.",
    "features.videos.title": "Rondera amashusho", "features.videos.text": "Raba amashusho n'ibikorwa vyafashwe n'abahanzi bo kw'isi yose.",
    "features.pi.title": "Gura & Gurisha na Pi", "features.pi.text": "Kora ivyo wagurishije canke wagurishijwe mu mutekano wose ukoresheje Pi Network canke WART.",
    "steps.eyebrow": "Intambwe", "steps.title": "Ingene WorldArts ikora",
    "steps.one.title": "Kurema umwidondoro", "steps.one.text": "Iyandikishe nk'umuhanzi canke nk'umuguzi mu masegonda make.",
    "steps.two.title": "Kwinjira mu mufuko wa Pi", "steps.two.text": "Wemeze uwo uri we ukoresheje Pi SDK kugira ureke kwishura bikore.",
    "steps.three.title": "Shira canke rondera", "steps.three.text": "Shira igikorwa cawe ku isoko canke urondere mu vyerekanwa vy'isi.",
    "steps.four.title": "Ishura na Pi canke WART", "steps.four.text": "Rangiza igikorwa mu mutekano wose, nta madolari canke USDT.",
    "gallery.eyebrow": "Amahitamwo", "gallery.title": "Uruzitiro rw'ivyerekanwa",
    "artists.eyebrow": "Umuryango", "artists.title": "Abahanzi bashimwa",
    "artists.role.painter": "Umwuzuzi", "artists.role.musician": "Umuhanzi w'indirimbo",
    "artists.role.filmmaker": "Umukozi w'amashusho", "artists.role.sculptor": "Umucanyi",
    "testimonials.eyebrow": "Ivyavuzwe", "testimonials.title": "Ivyo abahanzi bavuga",
    "testimonials.one.text": "« Naragurishije igishushanyo canje ca mbere muri Pi ku musi nyene naryandikishije. »", "testimonials.one.name": "Amara K., umwuzuzi",
    "testimonials.two.text": "« WorldArts yaramfashije gushikira abaguzi ku migabane itatu. »", "testimonials.two.name": "Chen Wei, umuhanzi w'indirimbo",
    "testimonials.three.text": "« Kwishura muri WART biraba ako kanya, nta mafaranga y'ibanki. »", "testimonials.three.name": "Fatima Z., umukozi w'amashusho",
    "payment.eyebrow": "Kwishura", "payment.title": "Ifaranga rimwe ku buhanzi bata mbibe",
    "payment.text": "Ivyishurwa vyose vya WorldArts binyura gusa muri Pi Network canke WART — nta madolari, nta USDT.",
    "payment.pi.desc": "kwishura kw'umwimbu binyuze muri Pi SDK", "payment.wart.desc": "ikaramu nyeshuri y'isoko rya WorldArts",
    "payment.card.eyebrow": "Akarorero k'igikorwa", "payment.card.title": "Umuseke ku kiyaga Tanganyika",
    "payment.card.artist": "na Amara K.", "payment.card.buy": "Gura na Pi",
    "about.eyebrow": "Intumbero yacu", "about.title": "Ubuhanzi nk'ururimi rusanzwe",
    "about.text": "WorldArts ihuza abahanzi n'abaguzi bo mu miryango yose, mu Kirundi, Igifaransa, Icongereza, Igiswahiri, Igiarabu n'Igishinwa, kugira ubuhanzi bugende ata gikingira c'ururimi canke c'ifaranga.",
    "faq.eyebrow": "Ibibazo", "faq.title": "Ibibazo bikunze kubazwa",
    "faq.q1.q": "Ni ifaranga irihe ryemewe?", "faq.q1.a": "Pi Network na WART gusa. WorldArts ntiyemera amadolari canke USDT.",
    "faq.q2.q": "Ingene wogurisha igikorwa?", "faq.q2.a": "Kurema umwidondoro w'umuhanzi, winjire mu mufuko wa Pi, hanyuma ushire igikorwa cawe hamwe n'igiciro caco.",
    "faq.q3.q": "Application ikora muri Pi Browser?", "faq.q3.a": "Ego, WorldArts yateguriwe Pi Browser kandi ikurikiza ivyo Pi Developer Portal isaba.",
    "faq.q4.q": "Amakuru yanje ararinzwe?", "faq.q4.a": "Ego, kwemeza uwo uri we bica kuri Pi SDK, kandi nta makuru y'ibanki WorldArts ibika.",
    "contact.eyebrow": "Twandikire", "contact.title": "Ikibazo ku bagize itsinda rya WorldArts?",
    "contact.form.name": "Izina ryawe", "contact.form.email": "Email yawe", "contact.form.message": "Ubutumwa bwawe",
    "contact.form.send": "Rungika ubutumwa", "contact.form.sent": "Urakoze, ubutumwa bwawe bwakiriwe.",
    "footer.tagline": "Isoko ry'ubuhanzi ku isi yose, muri Pi na WART.", "footer.explore": "Rondera",
    "footer.company": "WorldArts", "footer.legal": "Amategeko", "footer.terms": "Amasezerano", "footer.privacy": "Ibanga",
    "footer.rights": "Uburenganzira bwose burazigamiwe.", "footer.built": "Ikorwa na Pi Network",
    "modal.login.title": "Kwinjira na Pi", "modal.login.text": "Wemeze uwo uri we ukoresheje konte yawe ya Pi kugira ushikire umwidondoro wawe wa WorldArts.", "modal.login.action": "Komeza na Pi",
    "modal.payment.title": "Emeza ivyishurwa", "modal.payment.text": "Iki gikorwa kizishurwa ata gukeka biciye muri Pi SDK. Nta yindi mafaranga yemewe.", "modal.payment.action": "Ishura na Pi"
  },
  sw: {
    "nav.home": "Nyumbani", "nav.gallery": "Ghala", "nav.artists": "Wasanii",
    "nav.marketplace": "Soko", "nav.about": "Kuhusu", "nav.contact": "Wasiliana",
    "nav.connect": "Ungana na Pi",
    "hero.eyebrow": "Soko la sanaa la dunia",
    "hero.title": "Gundua, kusanya na uuze sanaa <em>kutoka popote duniani</em>",
    "hero.subtitle": "WorldArts inaunganisha wasanii na wakusanyaji kupitia kazi za sanaa, muziki na video, kwa malipo ya Pi Network na tokeni ya WART.",
    "hero.connect": "Ungana na Pi", "hero.explore": "Chunguza ghala",
    "hero.note": "Malipo kwa π (Pi) na WART pekee — hakuna dola, hakuna USDT",
    "features.eyebrow": "Unachoweza kufanya", "features.title": "Programu moja, sanaa yote ya dunia",
    "features.art.title": "Gundua sanaa", "features.art.text": "Vinjari kazi za sanaa halisi kutoka kwa wasanii wapya na waliobobea duniani kote.",
    "features.music.title": "Gundua muziki", "features.music.text": "Sikiliza na uwaunge mkono wasanii wa muziki huru moja kwa moja kwenye jukwaa.",
    "features.videos.title": "Gundua video", "features.videos.text": "Chunguza kazi za video na maonyesho yaliyorekodiwa na wasanii duniani kote.",
    "features.pi.title": "Nunua na uuze kwa Pi", "features.pi.text": "Kamilisha kila muamala kwa usalama kwa Pi Network au tokeni ya WART.",
    "steps.eyebrow": "Hatua", "steps.title": "Jinsi WorldArts inavyofanya kazi",
    "steps.one.title": "Unda wasifu", "steps.one.text": "Jisajili kama msanii au mkusanyaji kwa sekunde chache.",
    "steps.two.title": "Unganisha pochi lako la Pi", "steps.two.text": "Thibitisha kwa Pi SDK ili kuwezesha malipo.",
    "steps.three.title": "Chapisha au vinjari", "steps.three.text": "Weka kazi ya sanaa kuuzwa au vinjari ghala la dunia.",
    "steps.four.title": "Lipa kwa Pi au WART", "steps.four.text": "Kamilisha muamala kwa usalama, bila dola wala USDT.",
    "gallery.eyebrow": "Uteuzi", "gallery.title": "Ukuta wa ghala",
    "artists.eyebrow": "Jamii", "artists.title": "Wasanii maalum",
    "artists.role.painter": "Mchoraji", "artists.role.musician": "Msanii wa muziki",
    "artists.role.filmmaker": "Mtengenezaji filamu", "artists.role.sculptor": "Mchongaji",
    "testimonials.eyebrow": "Ushuhuda", "testimonials.title": "Wasanii wanasema nini",
    "testimonials.one.text": "\"Niliuza mchoro wangu wa kwanza kwa Pi siku niliyojisajili.\"", "testimonials.one.name": "Amara K., mchoraji",
    "testimonials.two.text": "\"WorldArts iliniwezesha kufikia wakusanyaji katika mabara matatu.\"", "testimonials.two.name": "Chen Wei, msanii wa muziki",
    "testimonials.three.text": "\"Kulipa kwa WART ni papo hapo, bila ada za benki.\"", "testimonials.three.name": "Fatima Z., mtengenezaji filamu",
    "payment.eyebrow": "Malipo", "payment.title": "Sarafu moja kwa sanaa isiyo na mipaka",
    "payment.text": "Miamala yote ya WorldArts hupitia Pi Network au tokeni ya WART pekee — hakuna dola, hakuna USDT.",
    "payment.pi.desc": "malipo asilia kupitia Pi SDK", "payment.wart.desc": "tokeni rasmi ya soko la WorldArts",
    "payment.card.eyebrow": "Mfano wa kazi", "payment.card.title": "Alfajiri juu ya Ziwa Tanganyika",
    "payment.card.artist": "na Amara K.", "payment.card.buy": "Nunua kwa Pi",
    "about.eyebrow": "Dhamira yetu", "about.title": "Sanaa kama lugha ya pamoja",
    "about.text": "WorldArts inaunganisha wasanii na wakusanyaji wa asili zote, kwa Kirundi, Kifaransa, Kiingereza, Kiswahili, Kiarabu na Kichina, ili sanaa isafiri bila kizuizi cha lugha au sarafu.",
    "faq.eyebrow": "Maswali", "faq.title": "Maswali yanayoulizwa mara kwa mara",
    "faq.q1.q": "Ni sarafu zipi zinazokubalika?", "faq.q1.a": "Pi Network na tokeni ya WART pekee. WorldArts haikubali dola wala USDT.",
    "faq.q2.q": "Ninawezaje kuuza kazi ya sanaa?", "faq.q2.a": "Unda wasifu wa msanii, unganisha pochi lako la Pi, kisha chapisha kazi yako pamoja na bei yake.",
    "faq.q3.q": "Programu inafanya kazi kwenye Pi Browser?", "faq.q3.a": "Ndiyo, WorldArts imeboreshwa kwa Pi Browser na inazingatia mahitaji ya Pi Developer Portal.",
    "faq.q4.q": "Data yangu inalindwa?", "faq.q4.a": "Ndiyo, uthibitishaji hupitia Pi SDK na WorldArts haihifadhi data ya benki kamwe.",
    "contact.eyebrow": "Tuandikie", "contact.title": "Una swali kwa timu ya WorldArts?",
    "contact.form.name": "Jina lako", "contact.form.email": "Barua pepe yako", "contact.form.message": "Ujumbe wako",
    "contact.form.send": "Tuma ujumbe", "contact.form.sent": "Asante, ujumbe wako umepokelewa.",
    "footer.tagline": "Soko la sanaa la dunia, kwa Pi na WART.", "footer.explore": "Chunguza",
    "footer.company": "WorldArts", "footer.legal": "Kisheria", "footer.terms": "Masharti", "footer.privacy": "Faragha",
    "footer.rights": "Haki zote zimehifadhiwa.", "footer.built": "Inaendeshwa na Pi Network",
    "modal.login.title": "Kuingia kwa Pi", "modal.login.text": "Thibitisha kwa akaunti yako ya Pi ili kufikia wasifu wako wa WorldArts.", "modal.login.action": "Endelea na Pi",
    "modal.payment.title": "Thibitisha malipo", "modal.payment.text": "Kazi hii italipwa moja kwa moja kupitia Pi SDK. Hakuna sarafu nyingine inayokubalika.", "modal.payment.action": "Lipa kwa Pi"
  },
  ar: {
    "nav.home": "الرئيسية", "nav.gallery": "المعرض", "nav.artists": "الفنانون",
    "nav.marketplace": "السوق", "nav.about": "من نحن", "nav.contact": "اتصل بنا",
    "nav.connect": "تسجيل الدخول عبر Pi",
    "hero.eyebrow": "سوق الفن العالمي",
    "hero.title": "اكتشف واجمع وبِع الفن <em>من أي مكان في العالم</em>",
    "hero.subtitle": "يجمع WorldArts الفنانين وهواة الجمع حول الأعمال الفنية والموسيقى والفيديوهات، بمدفوعات عبر Pi Network وعملة WART.",
    "hero.connect": "تسجيل الدخول عبر Pi", "hero.explore": "استكشف المعرض",
    "hero.note": "المدفوعات حصراً بعملة π (Pi) و WART — لا دولار ولا USDT",
    "features.eyebrow": "ما يمكنك فعله", "features.title": "تطبيق واحد، كل فن العالم",
    "features.art.title": "اكتشف الفن", "features.art.text": "تصفح أعمالاً فنية أصلية من فنانين ناشئين ومعروفين حول العالم.",
    "features.music.title": "اكتشف الموسيقى", "features.music.text": "استمع وادعم موسيقيين مستقلين مباشرة عبر المنصة.",
    "features.videos.title": "اكتشف الفيديوهات", "features.videos.text": "استكشف أعمال فيديو وعروضاً مصوَّرة من فنانين حول العالم.",
    "features.pi.title": "اشترِ وبِع عبر Pi", "features.pi.text": "أتمم كل معاملة بأمان عبر Pi Network أو عملة WART.",
    "steps.eyebrow": "الخطوات", "steps.title": "كيف يعمل WorldArts",
    "steps.one.title": "أنشئ ملفك الشخصي", "steps.one.text": "سجّل كفنان أو هاوٍ للجمع في ثوانٍ.",
    "steps.two.title": "اربط محفظة Pi", "steps.two.text": "وثّق هويتك عبر Pi SDK لتفعيل المدفوعات.",
    "steps.three.title": "انشر أو تصفح", "steps.three.text": "اعرض عملاً فنياً للبيع أو تصفح المعرض العالمي.",
    "steps.four.title": "ادفع بـ Pi أو WART", "steps.four.text": "أتمم المعاملة بأمان، دون دولار أو USDT.",
    "gallery.eyebrow": "مختارات", "gallery.title": "جدار المعرض",
    "artists.eyebrow": "المجتمع", "artists.title": "فنانون مميزون",
    "artists.role.painter": "رسام", "artists.role.musician": "موسيقي",
    "artists.role.filmmaker": "صانع أفلام", "artists.role.sculptor": "نحّات",
    "testimonials.eyebrow": "الشهادات", "testimonials.title": "ماذا يقول الفنانون",
    "testimonials.one.text": "«بعتُ لوحتي الأولى بعملة Pi في نفس يوم تسجيلي.»", "testimonials.one.name": "أمارا ك.، رسامة",
    "testimonials.two.text": "«مكنني WorldArts من الوصول إلى هواة جمع في ثلاث قارات.»", "testimonials.two.name": "تشن وي، موسيقي",
    "testimonials.three.text": "«الدفع بعملة WART فوري، دون رسوم بنكية.»", "testimonials.three.name": "فاطمة ز.، صانعة أفلام",
    "payment.eyebrow": "المدفوعات", "payment.title": "عملة واحدة لفن بلا حدود",
    "payment.text": "تمر جميع معاملات WorldArts حصراً عبر Pi Network أو عملة WART — لا دولار ولا USDT.",
    "payment.pi.desc": "دفع أصلي عبر Pi SDK", "payment.wart.desc": "العملة الرسمية لسوق WorldArts",
    "payment.card.eyebrow": "نموذج عمل فني", "payment.card.title": "الفجر فوق بحيرة تنجانيقا",
    "payment.card.artist": "بواسطة أمارا ك.", "payment.card.buy": "اشترِ عبر Pi",
    "about.eyebrow": "مهمتنا", "about.title": "الفن كلغة مشتركة",
    "about.text": "يربط WorldArts فنانين وهواة جمع من كل الخلفيات، بالكيروندية والفرنسية والإنجليزية والسواحلية والعربية والصينية، ليسافر الفن دون حواجز لغوية أو نقدية.",
    "faq.eyebrow": "الأسئلة", "faq.title": "الأسئلة الشائعة",
    "faq.q1.q": "ما هي العملات المقبولة؟", "faq.q1.a": "فقط Pi Network وعملة WART. لا يقبل WorldArts الدولار ولا USDT.",
    "faq.q2.q": "كيف أبيع عملاً فنياً؟", "faq.q2.a": "أنشئ ملف فنان، اربط محفظة Pi الخاصة بك، ثم انشر عملك مع سعره.",
    "faq.q3.q": "هل يعمل التطبيق داخل Pi Browser؟", "faq.q3.a": "نعم، WorldArts مُحسَّن لمتصفح Pi Browser ويتوافق مع متطلبات Pi Developer Portal.",
    "faq.q4.q": "هل بياناتي محمية؟", "faq.q4.a": "نعم، تتم المصادقة عبر Pi SDK ولا يخزّن WorldArts أي بيانات مصرفية.",
    "contact.eyebrow": "راسلنا", "contact.title": "لديك سؤال لفريق WorldArts؟",
    "contact.form.name": "اسمك", "contact.form.email": "بريدك الإلكتروني", "contact.form.message": "رسالتك",
    "contact.form.send": "إرسال الرسالة", "contact.form.sent": "شكراً، تم استلام رسالتك.",
    "footer.tagline": "سوق الفن العالمي، بعملتي Pi و WART.", "footer.explore": "استكشف",
    "footer.company": "WorldArts", "footer.legal": "قانوني", "footer.terms": "الشروط", "footer.privacy": "الخصوصية",
    "footer.rights": "جميع الحقوق محفوظة.", "footer.built": "مدعوم من Pi Network",
    "modal.login.title": "تسجيل الدخول عبر Pi", "modal.login.text": "وثّق هويتك عبر حساب Pi للوصول إلى ملفك في WorldArts.", "modal.login.action": "المتابعة عبر Pi",
    "modal.payment.title": "تأكيد الدفع", "modal.payment.text": "سيُدفع ثمن هذا العمل مباشرة عبر Pi SDK. لا تُقبل أي عملة أخرى.", "modal.payment.action": "ادفع عبر Pi"
  },
  zh: {
    "nav.home": "首页", "nav.gallery": "画廊", "nav.artists": "艺术家",
    "nav.marketplace": "市场", "nav.about": "关于我们", "nav.contact": "联系我们",
    "nav.connect": "使用 Pi 登录",
    "hero.eyebrow": "全球艺术市场",
    "hero.title": "发现、收藏并出售来自<em>世界各地</em>的艺术品",
    "hero.subtitle": "WorldArts 将艺术家与收藏家聚集在一起，围绕艺术品、音乐和视频，使用 Pi Network 和 WART 代币进行支付。",
    "hero.connect": "使用 Pi 登录", "hero.explore": "探索画廊",
    "hero.note": "仅支持 π（Pi）和 WART 支付 —— 不支持美元，不支持 USDT",
    "features.eyebrow": "您可以做什么", "features.title": "一个应用，汇集世界艺术",
    "features.art.title": "发现艺术", "features.art.text": "浏览来自全球新兴及知名艺术家的原创作品。",
    "features.music.title": "发现音乐", "features.music.text": "在平台上直接聆听并支持独立音乐创作者。",
    "features.videos.title": "发现视频", "features.videos.text": "探索来自全球艺术家的视频创作和表演录像。",
    "features.pi.title": "使用 Pi 买卖", "features.pi.text": "通过 Pi Network 或 WART 代币安全完成每笔交易。",
    "steps.eyebrow": "步骤", "steps.title": "WorldArts 如何运作",
    "steps.one.title": "创建资料", "steps.one.text": "几秒钟内以艺术家或收藏家身份注册。",
    "steps.two.title": "连接您的 Pi 钱包", "steps.two.text": "通过 Pi SDK 进行身份验证以启用支付功能。",
    "steps.three.title": "发布或浏览", "steps.three.text": "上架出售一件作品，或浏览全球画廊。",
    "steps.four.title": "使用 Pi 或 WART 支付", "steps.four.text": "安全完成交易，无需美元或 USDT。",
    "gallery.eyebrow": "精选", "gallery.title": "画廊墙",
    "artists.eyebrow": "社区", "artists.title": "精选艺术家",
    "artists.role.painter": "画家", "artists.role.musician": "音乐家",
    "artists.role.filmmaker": "电影制作人", "artists.role.sculptor": "雕塑家",
    "testimonials.eyebrow": "用户评价", "testimonials.title": "艺术家怎么说",
    "testimonials.one.text": "「注册当天我就用 Pi 卖出了我的第一幅画。」", "testimonials.one.name": "Amara K.，画家",
    "testimonials.two.text": "「WorldArts 让我接触到三大洲的收藏家。」", "testimonials.two.name": "Chen Wei，音乐家",
    "testimonials.three.text": "「用 WART 支付即时到账，无银行手续费。」", "testimonials.three.name": "Fatima Z.，电影制作人",
    "payment.eyebrow": "支付方式", "payment.title": "无国界艺术的统一货币",
    "payment.text": "所有 WorldArts 交易仅通过 Pi Network 或 WART 代币进行 —— 不支持美元，不支持 USDT。",
    "payment.pi.desc": "通过 Pi SDK 原生支付", "payment.wart.desc": "WorldArts 市场的官方代币",
    "payment.card.eyebrow": "作品示例", "payment.card.title": "坦噶尼喀湖的黎明",
    "payment.card.artist": "作者：Amara K.", "payment.card.buy": "使用 Pi 购买",
    "about.eyebrow": "我们的使命", "about.title": "艺术作为共同语言",
    "about.text": "WorldArts 连接来自各种背景的艺术家和收藏家，支持基隆迪语、法语、英语、斯瓦希里语、阿拉伯语和中文，让艺术跨越语言和货币的壁垒。",
    "faq.eyebrow": "常见问题", "faq.title": "常见问题解答",
    "faq.q1.q": "接受哪些货币？", "faq.q1.a": "仅限 Pi Network 和 WART 代币。WorldArts 不接受美元或 USDT。",
    "faq.q2.q": "如何出售作品？", "faq.q2.a": "创建艺术家资料，连接您的 Pi 钱包，然后发布您的作品并标注价格。",
    "faq.q3.q": "该应用能在 Pi Browser 中运行吗？", "faq.q3.a": "可以，WorldArts 已针对 Pi Browser 进行优化，并符合 Pi Developer Portal 的要求。",
    "faq.q4.q": "我的数据受保护吗？", "faq.q4.a": "是的，身份验证通过 Pi SDK 完成，WorldArts 从不存储任何银行数据。",
    "contact.eyebrow": "给我们留言", "contact.title": "对 WorldArts 团队有疑问？",
    "contact.form.name": "您的姓名", "contact.form.email": "您的邮箱", "contact.form.message": "您的留言",
    "contact.form.send": "发送留言", "contact.form.sent": "谢谢，我们已收到您的留言。",
    "footer.tagline": "全球艺术市场，支持 Pi 与 WART。", "footer.explore": "探索",
    "footer.company": "WorldArts", "footer.legal": "法律", "footer.terms": "条款", "footer.privacy": "隐私",
    "footer.rights": "版权所有。", "footer.built": "由 Pi Network 提供支持",
    "modal.login.title": "Pi 登录", "modal.login.text": "使用您的 Pi 账户进行身份验证以访问您的 WorldArts 资料。", "modal.login.action": "使用 Pi 继续",
    "modal.payment.title": "确认支付", "modal.payment.text": "此作品将直接通过 Pi SDK 支付。不接受任何其他货币。", "modal.payment.action": "使用 Pi 支付"
  }
};

/* ---------------------------------------------------------
   3. INITIALISATION GÉNÉRALE
   --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLanguage();
  initMenu();
  initModals();
  initButtons();
  initContactForm();
  initScrollReveal();
  initNavHighlight();
  restoreSession();
  initPiSdk();
});

/* ---------------------------------------------------------
   4. THÈME CLAIR / SOMBRE
   --------------------------------------------------------- */

function initTheme() {
  const saved = localStorage.getItem("worldarts_theme");
  const theme = saved || "light";
  document.body.setAttribute("data-theme", theme);

  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.body.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.body.setAttribute("data-theme", next);
      localStorage.setItem("worldarts_theme", next);
    });
  }
}

/* ---------------------------------------------------------
   5. LANGUE / I18N
   --------------------------------------------------------- */

function applyTranslations(lang) {
  const dict = translations[lang] || translations.fr;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) {
      el.setAttribute("placeholder", dict[key]);
    }
  });

  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute(
    "dir",
    lang === "ar" ? "rtl" : "ltr"
  );

  currentLang = lang;
  localStorage.setItem("worldarts_lang", lang);
}

function initLanguage() {
  const select = document.getElementById("langSelect");
  if (select) {
    select.value = currentLang;
    select.addEventListener("change", (e) => {
      applyTranslations(e.target.value);
    });
  }
  applyTranslations(currentLang);
}

/* ---------------------------------------------------------
   6. MENU MOBILE
   --------------------------------------------------------- */

function initMenu() {
  const menuBtn = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
      });
    });
  }
}

/* ---------------------------------------------------------
   7. MISE EN AVANT DU LIEN DE NAVIGATION ACTIF
   --------------------------------------------------------- */

function initNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-links a");

  if (!sections.length || !navItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navItems.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + id
            );
          });
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------------------------------------------------------
   8. ANIMATIONS AU SCROLL (.reveal)
   --------------------------------------------------------- */

function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------------------------------------------------------
   9. MODALES
   --------------------------------------------------------- */

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("open");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("open");
}

function initModals() {
  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal(btn.getAttribute("data-close"));
    });
  });

  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("open");
      }
    });
  });
}

/* ---------------------------------------------------------
   10. BOUTONS PRINCIPAUX
   --------------------------------------------------------- */

function initButtons() {
  const openLogin = () => {
    if (piUser) return; // déjà connecté
    openModal("loginModal");
  };

  const piConnectBtn = document.getElementById("piConnectBtn");
  const heroConnectBtn = document.getElementById("heroConnectBtn");
  const modalConnectBtn = document.getElementById("modalConnectBtn");

  if (piConnectBtn) piConnectBtn.addEventListener("click", openLogin);
  if (heroConnectBtn) heroConnectBtn.addEventListener("click", openLogin);
  if (modalConnectBtn) modalConnectBtn.addEventListener("click", connectWithPi);

  const payBtn = document.getElementById("payBtn");
  const modalPayBtn = document.getElementById("modalPayBtn");

  if (payBtn) {
    payBtn.addEventListener("click", () => {
      if (!piUser) {
        openModal("loginModal");
        return;
      }
      openModal("paymentModal");
    });
  }

  if (modalPayBtn) {
    modalPayBtn.addEventListener("click", () => {
      payWithPi({
        amount: 1,
        memo: "Aube sur le lac Tanganyika — WorldArts",
        artworkId: "demo-artwork-01"
      });
    });
  }
}

/* ---------------------------------------------------------
   11. PI SDK — INITIALISATION
   --------------------------------------------------------- */

function initPiSdk() {
  if (typeof Pi === "undefined") {
    console.warn("Pi SDK non détecté. Ouvre WorldArts dans le Pi Browser pour l'utiliser pleinement.");
    return;
  }
  Pi.init({ version: "2.0", sandbox: PI_SANDBOX });
}

/* ---------------------------------------------------------
   12. CONNEXION PI (LOGIN)
   --------------------------------------------------------- */

async function connectWithPi() {
  if (typeof Pi === "undefined") {
    alert("Ouvrez WorldArts dans le Pi Browser.");
    return;
  }

  try {
    const scopes = ["username", "payments"];
    const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);

    if (!auth || !auth.user || !auth.accessToken) {
      throw new Error("Pi authentication data incomplete.");
    }

    console.log("Pi authentication successful:", auth.user);

    const response = await fetch(API_URL + "/api/auth/pi-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: auth.accessToken })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "WorldArts authentication failed.");
    }

    piUser = data.user;

    localStorage.setItem("worldarts_token", data.token);
    localStorage.setItem("worldarts_user", JSON.stringify(data.user));

    const button = document.getElementById("piConnectBtn");
    if (button) button.textContent = "@" + piUser.username;

    closeModal("loginModal");

    alert("Bienvenue @" + piUser.username + " sur WorldArts !");

    console.log("WorldArts authentication successful:", data.user);
  } catch (error) {
    console.error("Pi authentication error:", error);
    alert("Connexion Pi impossible : " + (error.message || "Erreur inconnue."));
  }
}

/* ---------------------------------------------------------
   13. PAIEMENT PI
   --------------------------------------------------------- */

async function payWithPi({ amount, memo, artworkId }) {
  if (typeof Pi === "undefined") {
    alert("Ouvrez WorldArts dans le Pi Browser pour effectuer un paiement.");
    return;
  }

  if (!piUser) {
    alert("Connectez-vous d'abord avec Pi.");
    openModal("loginModal");
    return;
  }

  const token = localStorage.getItem("worldarts_token");

  try {
    await Pi.createPayment(
      {
        amount: amount,
        memo: memo,
        metadata: { artworkId: artworkId }
      },
      {
        onReadyForServerApproval: async (paymentId) => {
          await fetch(API_URL + "/api/payments/approve", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token
            },
            body: JSON.stringify({ paymentId })
          });
        },

        onReadyForServerCompletion: async (paymentId, txid) => {
          await fetch(API_URL + "/api/payments/complete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token
            },
            body: JSON.stringify({ paymentId, txid })
          });

          closeModal("paymentModal");
          alert("Paiement effectué avec succès. Merci pour votre achat !");
        },

        onCancel: (paymentId) => {
          console.log("Paiement annulé :", paymentId);
          closeModal("paymentModal");
        },

        onError: (error, payment) => {
          console.error("Erreur de paiement Pi :", error, payment);
          alert("Une erreur est survenue pendant le paiement.");
        }
      }
    );
  } catch (error) {
    console.error("Payment initiation error:", error);
    alert("Impossible de lancer le paiement : " + (error.message || "Erreur inconnue."));
  }
}

/* ---------------------------------------------------------
   14. PAIEMENT INCOMPLET (EXIGÉ PAR LE PI SDK)
   --------------------------------------------------------- */

function onIncompletePaymentFound(payment) {
  console.log("Paiement incomplet détecté :", payment);

  const token = localStorage.getItem("worldarts_token");

  fetch(API_URL + "/api/payments/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      paymentId: payment.identifier,
      txid: payment.transaction ? payment.transaction.txid : null
    })
  }).catch((err) => {
    console.error("Erreur lors de la finalisation du paiement incomplet :", err);
  });
}

/* ---------------------------------------------------------
   15. RESTAURATION DE SESSION
   --------------------------------------------------------- */

function restoreSession() {
  const savedUser = localStorage.getItem("worldarts_user");
  const savedToken = localStorage.getItem("worldarts_token");

  if (savedUser && savedToken) {
    try {
      piUser = JSON.parse(savedUser);
      const button = document.getElementById("piConnectBtn");
      if (button && piUser && piUser.username) {
        button.textContent = "@" + piUser.username;
      }
    } catch (e) {
      console.warn("Impossible de restaurer la session WorldArts.", e);
    }
  }
}

/* ---------------------------------------------------------
   16. FORMULAIRE DE CONTACT
   --------------------------------------------------------- */

function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactStatus");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message")
    };

    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.disabled = true;

    try {
      const response = await fetch(API_URL + "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Envoi impossible.");

      form.reset();
      if (status) status.style.display = "block";
    } catch (error) {
      console.error("Contact form error:", error);
      if (status) {
        status.style.display = "block";
        status.textContent = "Erreur : votre message n'a pas pu être envoyé. Réessayez plus tard.";
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
Mpp  });
}
0

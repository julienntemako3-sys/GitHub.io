/* ==========================================================================
   WorldArts — script.js
   i18n (6 langues) · thème clair/sombre · menu mobile
   Pi SDK (connexion + paiement) · formulaire de contact · reveal au scroll
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* 1. Dictionnaires de traduction                                      */
  /* ------------------------------------------------------------------ */
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
      "footer.company": "WorldArts", "footer.legal": "Légal", "footer.terms": "Conditions",
      "footer.privacy": "Confidentialité", "footer.rights": "Tous droits réservés.", "footer.built": "Propulsé par Pi Network",
      "modal.login.title": "Connexion Pi", "modal.login.text": "Authentifiez-vous avec votre compte Pi pour accéder à votre profil WorldArts.",
      "modal.login.action": "Continuer avec Pi", "modal.payment.title": "Confirmer le paiement",
      "modal.payment.text": "Cette œuvre sera payée directement via le Pi SDK. Aucune autre devise n'est acceptée.",
      "modal.payment.action": "Payer avec Pi"
    },
    en: {
      "nav.home": "Home", "nav.gallery": "Gallery", "nav.artists": "Artists",
      "nav.marketplace": "Marketplace", "nav.about": "About", "nav.contact": "Contact",
      "nav.connect": "Connect with Pi",
      "hero.eyebrow": "Global art marketplace",
      "hero.title": "Discover, collect and sell art <em>anywhere in the world</em>",
      "hero.subtitle": "WorldArts brings artists and collectors together around artworks, music and videos, paid with Pi Network and the WART token.",
      "hero.connect": "Connect with Pi", "hero.explore": "Explore the gallery",
      "hero.note": "Payments exclusively in π (Pi) and WART — no dollars, no USDT",
      "features.eyebrow": "What you can do", "features.title": "One app, all the world's art",
      "features.art.title": "Discover art", "features.art.text": "Browse original artworks from emerging and established artists worldwide.",
      "features.music.title": "Discover music", "features.music.text": "Listen to and support independent musicians directly on the platform.",
      "features.videos.title": "Discover videos", "features.videos.text": "Explore video works and filmed performances by artists around the world.",
      "features.pi.title": "Buy & sell with Pi", "features.pi.text": "Complete every transaction safely with Pi Network or the WART token.",
      "steps.eyebrow": "Steps", "steps.title": "How WorldArts works",
      "steps.one.title": "Create a profile", "steps.one.text": "Sign up as an artist or collector in seconds.",
      "steps.two.title": "Connect your Pi wallet", "steps.two.text": "Authenticate with the Pi SDK to enable payments.",
      "steps.three.title": "List or browse", "steps.three.text": "List an artwork for sale or browse the global gallery.",
      "steps.four.title": "Pay in Pi or WART", "steps.four.text": "Close the deal safely, with no dollars or USDT involved.",
      "gallery.eyebrow": "Selection", "gallery.title": "The gallery wall",
      "artists.eyebrow": "Community", "artists.title": "Featured artists",
      "artists.role.painter": "Painter", "artists.role.musician": "Musician",
      "artists.role.filmmaker": "Filmmaker", "artists.role.sculptor": "Sculptor",
      "testimonials.eyebrow": "Testimonials", "testimonials.title": "What artists are saying",
      "testimonials.one.text": "\"I sold my first canvas in Pi the very day I signed up.\"", "testimonials.one.name": "Amara K., painter",
      "testimonials.two.text": "\"WorldArts let me reach collectors on three continents.\"", "testimonials.two.name": "Chen Wei, musician",
      "testimonials.three.text": "\"Payment in WART is instant, with no bank fees.\"", "testimonials.three.name": "Fatima Z., filmmaker",
      "payment.eyebrow": "Payments", "payment.title": "One currency for borderless art",
      "payment.text": "Every WorldArts transaction runs only through Pi Network or the WART token — no dollars, no USDT.",
      "payment.pi.desc": "native payment via the Pi SDK", "payment.wart.desc": "WorldArts marketplace's official token",
      "payment.card.eyebrow": "Sample artwork", "payment.card.title": "Dawn over Lake Tanganyika",
      "payment.card.artist": "by Amara K.", "payment.card.buy": "Buy with Pi",
      "about.eyebrow": "Our mission", "about.title": "Art as a common language",
      "about.text": "WorldArts connects artists and collectors of every background, in Kirundi, French, English, Kiswahili, Arabic and Chinese, so art can travel without language or currency barriers.",
      "faq.eyebrow": "Questions", "faq.title": "Frequently asked questions",
      "faq.q1.q": "Which currencies are accepted?", "faq.q1.a": "Only Pi Network and the WART token. WorldArts accepts neither dollars nor USDT.",
      "faq.q2.q": "How do I sell an artwork?", "faq.q2.a": "Create an artist profile, connect your Pi wallet, then list your artwork with its price.",
      "faq.q3.q": "Does the app work inside the Pi Browser?", "faq.q3.a": "Yes, WorldArts is optimized for the Pi Browser and complies with Pi Developer Portal requirements.",
      "faq.q4.q": "Is my data protected?", "faq.q4.a": "Yes, authentication runs through the Pi SDK and WorldArts never stores banking data.",
      "contact.eyebrow": "Get in touch", "contact.title": "A question for the WorldArts team?",
      "contact.form.name": "Your name", "contact.form.email": "Your email", "contact.form.message": "Your message",
      "contact.form.send": "Send message", "contact.form.sent": "Thanks, your message has been noted.",
      "footer.tagline": "The global art marketplace, in Pi and WART.", "footer.explore": "Explore",
      "footer.company": "WorldArts", "footer.legal": "Legal", "footer.terms": "Terms",
      "footer.privacy": "Privacy", "footer.rights": "All rights reserved.", "footer.built": "Powered by Pi Network",
      "modal.login.title": "Pi login", "modal.login.text": "Authenticate with your Pi account to access your WorldArts profile.",
      "modal.login.action": "Continue with Pi", "modal.payment.title": "Confirm payment",
      "modal.payment.text": "This artwork will be paid for directly via the Pi SDK. No other currency is accepted.",
      "modal.payment.action": "Pay with Pi"
    },
    rn: {
      "nav.home": "Ku ntango", "nav.gallery": "Ikaze ry'ubuhanzi", "nav.artists": "Abahanzi",
      "nav.marketplace": "Isoko", "nav.about": "Ivyerekeye", "nav.contact": "Twandikire",
      "nav.connect": "Injira na Pi",
      "hero.eyebrow": "Isoko mpuzamakungu ry'ubuhanzi",
      "hero.title": "Rondera, egeranya kandi ugurishe ubuhanzi <em>hose kw'isi</em>",
      "hero.subtitle": "WorldArts ihuza abahanzi n'abakusanya ibihangano, umuziki n'amashusho, ivyishurwa mu Pi Network no mu kadari WART.",
      "hero.connect": "Injira na Pi", "hero.explore": "Raba ikaze ry'ubuhanzi",
      "hero.note": "Kwishura gukorwa gusa muri π (Pi) na WART — nta dolari canke USDT",
      "features.eyebrow": "Ivyo ushobora gukora", "features.title": "Porogaramu imwe, ubuhanzi bwose bw'isi",
      "features.art.title": "Rondera ubuhanzi", "features.art.text": "Raba ibihangano nyakuri biva ku bahanzi bo hirya no hino kw'isi.",
      "features.music.title": "Rondera umuziki", "features.music.text": "Umva kandi ushigikire abahanzi b'umuziki mu buryo butaziguye.",
      "features.videos.title": "Rondera amashusho", "features.videos.text": "Raba ibihangano vy'amashusho biva ku bahanzi bo kw'isi yose.",
      "features.pi.title": "Gura no kugurisha na Pi", "features.pi.text": "Rangiza igikorwa cose mu mutekano ukoresheje Pi Network canke WART.",
      "steps.eyebrow": "Intambwe", "steps.title": "Ingene WorldArts ikora",
      "steps.one.title": "Rema umwidondoro", "steps.one.text": "Iyandikishe nk'umuhanzi canke umukusanya mu kanya gato.",
      "steps.two.title": "Huza umufuko wawe wa Pi", "steps.two.text": "Wiyemeze ukoresheje Pi SDK kugira ngo ushobore kwishura.",
      "steps.three.title": "Shira canke urabe", "steps.three.text": "Shira igihangano ku isoko canke urabe ikaze ry'isi.",
      "steps.four.title": "Ishura muri Pi canke WART", "steps.four.text": "Rangiza igikorwa mu mutekano, nta dolari canke USDT.",
      "gallery.eyebrow": "Amatora", "gallery.title": "Uruzitiro rw'ikaze",
      "artists.eyebrow": "Umuryango", "artists.title": "Abahanzi bahawe icubahiro",
      "artists.role.painter": "Umuhanzi w'amashusho", "artists.role.musician": "Umuhanzi w'umuziki",
      "artists.role.filmmaker": "Umukozi wa filime", "artists.role.sculptor": "Umubaji w'ibishushanyo",
      "testimonials.eyebrow": "Ivyavuzwe", "testimonials.title": "Ivyo abahanzi bavuga",
      "testimonials.one.text": "« Naragurishije igishushanyo canje ca mbere muri Pi umusi nyene wo kwiyandikisha. »", "testimonials.one.name": "Amara K., umuhanzi",
      "testimonials.two.text": "« WorldArts yarandeye abakusanya bo mu bihugu bitatu. »", "testimonials.two.name": "Chen Wei, umuhanzi w'umuziki",
      "testimonials.three.text": "« Kwishura muri WART birihuta, nta mahera y'ibanki. »", "testimonials.three.name": "Fatima Z., umukozi wa filime",
      "payment.eyebrow": "Kwishura", "payment.title": "Ifaranga rimwe ku buhanzi butagira imbibe",
      "payment.text": "Ibikorwa vyose vya WorldArts binyura gusa muri Pi Network canke WART — nta dolari canke USDT.",
      "payment.pi.desc": "kwishura biciye muri Pi SDK", "payment.wart.desc": "akadari nyakuri k'isoko WorldArts",
      "payment.card.eyebrow": "Akarorero k'igihangano", "payment.card.title": "Umuseke ku kiyaga Tanganyika",
      "payment.card.artist": "na Amara K.", "payment.card.buy": "Gura na Pi",
      "about.eyebrow": "Intumbero yacu", "about.title": "Ubuhanzi nk'ururimi rusanzwe",
      "about.text": "WorldArts ihuza abahanzi n'abakusanya bo mu moko yose, mu Kirundi, Igifaransa, Icongereza, Igiswahiri, Icarabu n'Igishinwa, kugira ngo ubuhanzi bugende hatariho imbibe z'ururimi canke z'ifaranga.",
      "faq.eyebrow": "Ibibazo", "faq.title": "Ibibazo bikunda kubazwa",
      "faq.q1.q": "Ni ifaranga irihe ryemewe?", "faq.q1.a": "Ni Pi Network na WART gusa. WorldArts ntiyemera dolari canke USDT.",
      "faq.q2.q": "Ni gute nogurisha igihangano?", "faq.q2.a": "Rema umwidondoro w'umuhanzi, uhuze umufuko wa Pi, hanyuma ushire igihangano hamwe n'igiciro.",
      "faq.q3.q": "Porogaramu ikora muri Pi Browser?", "faq.q3.a": "Ego, WorldArts yateguriwe Pi Browser kandi ikurikiza ibisabwa na Pi Developer Portal.",
      "faq.q4.q": "Amakuru yanje arinzwe?", "faq.q4.a": "Ego, kwiyemeza binyura muri Pi SDK kandi WorldArts ntibika amakuru y'ibanki.",
      "contact.eyebrow": "Twandikire", "contact.title": "Ikibazo ku bakozi ba WorldArts?",
      "contact.form.name": "Izina ryawe", "contact.form.email": "Imeyili yawe", "contact.form.message": "Ubutumwa bwawe",
      "contact.form.send": "Rungika ubutumwa", "contact.form.sent": "Urakoze, ubutumwa bwawe bwaboneste.",
      "footer.tagline": "Isoko mpuzamakungu ry'ubuhanzi, muri Pi na WART.", "footer.explore": "Rondera",
      "footer.company": "WorldArts", "footer.legal": "Amategeko", "footer.terms": "Amasezerano",
      "footer.privacy": "Ubwigenge", "footer.rights": "Uburenganzira bwose burafitwe.", "footer.built": "Ikorwa na Pi Network",
      "modal.login.title": "Kwinjira na Pi", "modal.login.text": "Wiyemeze ukoresheje konti yawe ya Pi kugira ngo winjire mu mwidondoro wawe.",
      "modal.login.action": "Komeza na Pi", "modal.payment.title": "Emeza kwishura",
      "modal.payment.text": "Iki gihangano kizoishurwa gusa biciye muri Pi SDK. Nta yindi mafaranga yemewe.",
      "modal.payment.action": "Ishura na Pi"
    },
    sw: {
      "nav.home": "Nyumbani", "nav.gallery": "Ghala la Sanaa", "nav.artists": "Wasanii",
      "nav.marketplace": "Soko", "nav.about": "Kuhusu", "nav.contact": "Wasiliana",
      "nav.connect": "Ungana na Pi",
      "hero.eyebrow": "Soko la sanaa la kimataifa",
      "hero.title": "Gundua, kusanya na uuze sanaa <em>popote duniani</em>",
      "hero.subtitle": "WorldArts inaunganisha wasanii na wakusanyaji kuzunguka kazi za sanaa, muziki na video, zinazolipwa kwa Pi Network na tokeni ya WART.",
      "hero.connect": "Ungana na Pi", "hero.explore": "Chunguza ghala",
      "hero.note": "Malipo pekee kwa π (Pi) na WART — hakuna dola wala USDT",
      "features.eyebrow": "Unachoweza kufanya", "features.title": "Programu moja, sanaa yote ya dunia",
      "features.art.title": "Gundua sanaa", "features.art.text": "Vinjari kazi asili kutoka kwa wasanii wapya na maarufu duniani kote.",
      "features.music.title": "Gundua muziki", "features.music.text": "Sikiliza na uwaunge mkono wasanii wa muziki huru moja kwa moja kwenye jukwaa.",
      "features.videos.title": "Gundua video", "features.videos.text": "Chunguza kazi za video na maonyesho yaliyorekodiwa na wasanii duniani kote.",
      "features.pi.title": "Nunua na uuze kwa Pi", "features.pi.text": "Kamilisha kila muamala kwa usalama kwa Pi Network au tokeni ya WART.",
      "steps.eyebrow": "Hatua", "steps.title": "Jinsi WorldArts inavyofanya kazi",
      "steps.one.title": "Unda wasifu", "steps.one.text": "Jisajili kama msanii au mkusanyaji kwa sekunde chache.",
      "steps.two.title": "Unganisha pochi ya Pi", "steps.two.text": "Thibitisha kwa Pi SDK ili kuwezesha malipo.",
      "steps.three.title": "Orodhesha au vinjari", "steps.three.text": "Weka kazi ya sanaa kwa mauzo au vinjari ghala la kimataifa.",
      "steps.four.title": "Lipa kwa Pi au WART", "steps.four.text": "Kamilisha muamala kwa usalama, bila dola wala USDT.",
      "gallery.eyebrow": "Uteuzi", "gallery.title": "Ukuta wa ghala",
      "artists.eyebrow": "Jamii", "artists.title": "Wasanii wanaoangaziwa",
      "artists.role.painter": "Mchoraji", "artists.role.musician": "Msanii wa muziki",
      "artists.role.filmmaker": "Mtengenezaji filamu", "artists.role.sculptor": "Mchongaji",
      "testimonials.eyebrow": "Ushuhuda", "testimonials.title": "Wasanii wanasema nini",
      "testimonials.one.text": "\"Niliuza turubai yangu ya kwanza kwa Pi siku ile ile nilipojisajili.\"", "testimonials.one.name": "Amara K., mchoraji",
      "testimonials.two.text": "\"WorldArts iliniwezesha kufikia wakusanyaji katika mabara matatu.\"", "testimonials.two.name": "Chen Wei, msanii wa muziki",
      "testimonials.three.text": "\"Malipo kwa WART ni ya papo hapo, bila ada za benki.\"", "testimonials.three.name": "Fatima Z., mtengenezaji filamu",
      "payment.eyebrow": "Malipo", "payment.title": "Sarafu moja kwa sanaa isiyo na mipaka",
      "payment.text": "Miamala yote ya WorldArts hupitia Pi Network au tokeni ya WART pekee — hakuna dola wala USDT.",
      "payment.pi.desc": "malipo asili kupitia Pi SDK", "payment.wart.desc": "tokeni rasmi ya soko la WorldArts",
      "payment.card.eyebrow": "Mfano wa kazi", "payment.card.title": "Alfajiri juu ya Ziwa Tanganyika",
      "payment.card.artist": "na Amara K.", "payment.card.buy": "Nunua kwa Pi",
      "about.eyebrow": "Dhamira yetu", "about.title": "Sanaa kama lugha ya pamoja",
      "about.text": "WorldArts inaunganisha wasanii na wakusanyaji wa asili zote, kwa Kirundi, Kifaransa, Kiingereza, Kiswahili, Kiarabu na Kichina, ili sanaa isafiri bila vizuizi vya lugha au sarafu.",
      "faq.eyebrow": "Maswali", "faq.title": "Maswali yanayoulizwa mara kwa mara",
      "faq.q1.q": "Sarafu zipi zinakubalika?", "faq.q1.a": "Pi Network na tokeni ya WART pekee. WorldArts haikubali dola wala USDT.",
      "faq.q2.q": "Nauzaje kazi ya sanaa?", "faq.q2.a": "Unda wasifu wa msanii, unganisha pochi yako ya Pi, kisha orodhesha kazi yako na bei yake.",
      "faq.q3.q": "Programu inafanya kazi ndani ya Pi Browser?", "faq.q3.a": "Ndiyo, WorldArts imeboreshwa kwa Pi Browser na inazingatia matakwa ya Pi Developer Portal.",
      "faq.q4.q": "Data yangu inalindwa?", "faq.q4.a": "Ndiyo, uthibitishaji hupitia Pi SDK na WorldArts haihifadhi data ya benki.",
      "contact.eyebrow": "Wasiliana nasi", "contact.title": "Una swali kwa timu ya WorldArts?",
      "contact.form.name": "Jina lako", "contact.form.email": "Barua pepe yako", "contact.form.message": "Ujumbe wako",
      "contact.form.send": "Tuma ujumbe", "contact.form.sent": "Asante, ujumbe wako umepokelewa.",
      "footer.tagline": "Soko la sanaa la kimataifa, kwa Pi na WART.", "footer.explore": "Chunguza",
      "footer.company": "WorldArts", "footer.legal": "Kisheria", "footer.terms": "Masharti",
      "footer.privacy": "Faragha", "footer.rights": "Haki zote zimehifadhiwa.", "footer.built": "Inaendeshwa na Pi Network",
      "modal.login.title": "Kuingia na Pi", "modal.login.text": "Thibitisha kwa akaunti yako ya Pi ili kufikia wasifu wako wa WorldArts.",
      "modal.login.action": "Endelea na Pi", "modal.payment.title": "Thibitisha malipo",
      "modal.payment.text": "Kazi hii italipwa moja kwa moja kupitia Pi SDK. Hakuna sarafu nyingine inayokubalika.",
      "modal.payment.action": "Lipa kwa Pi"
    },
    ar: {
      "nav.home": "الرئيسية", "nav.gallery": "المعرض", "nav.artists": "الفنانون",
      "nav.marketplace": "السوق", "nav.about": "من نحن", "nav.contact": "تواصل معنا",
      "nav.connect": "الاتصال عبر Pi",
      "hero.eyebrow": "سوق الفن العالمي",
      "hero.title": "اكتشف واقتنِ وبِع الفن <em>في أي مكان بالعالم</em>",
      "hero.subtitle": "تجمع WorldArts بين الفنانين وجامعي الأعمال حول اللوحات والموسيقى والفيديوهات، بمدفوعات عبر Pi Network وعملة WART.",
      "hero.connect": "الاتصال عبر Pi", "hero.explore": "استكشف المعرض",
      "hero.note": "الدفع حصريًا بعملة π (Pi) و WART — لا دولار ولا USDT",
      "features.eyebrow": "ما يمكنك فعله", "features.title": "تطبيق واحد، كل فن العالم",
      "features.art.title": "اكتشف الفن", "features.art.text": "تصفح أعمالًا أصلية من فنانين ناشئين وراسخين حول العالم.",
      "features.music.title": "اكتشف الموسيقى", "features.music.text": "استمع وادعم فنانين مستقلين مباشرة عبر المنصة.",
      "features.videos.title": "اكتشف الفيديوهات", "features.videos.text": "استكشف أعمال فيديو وعروضًا مصورة لفنانين حول العالم.",
      "features.pi.title": "الشراء والبيع عبر Pi", "features.pi.text": "أتمم كل معاملة بأمان عبر Pi Network أو عملة WART.",
      "steps.eyebrow": "الخطوات", "steps.title": "كيف تعمل WorldArts",
      "steps.one.title": "إنشاء ملف شخصي", "steps.one.text": "سجّل كفنان أو جامع أعمال خلال ثوانٍ.",
      "steps.two.title": "ربط محفظة Pi", "steps.two.text": "وثّق حسابك عبر Pi SDK لتفعيل المدفوعات.",
      "steps.three.title": "النشر أو التصفح", "steps.three.text": "اعرض عملاً للبيع أو تصفح المعرض العالمي.",
      "steps.four.title": "الدفع بـ Pi أو WART", "steps.four.text": "أتمم الصفقة بأمان، دون دولار أو USDT.",
      "gallery.eyebrow": "مختارات", "gallery.title": "جدار المعرض",
      "artists.eyebrow": "المجتمع", "artists.title": "فنانون مميزون",
      "artists.role.painter": "رسّام", "artists.role.musician": "موسيقي",
      "artists.role.filmmaker": "مخرج", "artists.role.sculptor": "نحّات",
      "testimonials.eyebrow": "الشهادات", "testimonials.title": "ماذا يقول الفنانون",
      "testimonials.one.text": "«بعت لوحتي الأولى بعملة Pi في اليوم نفسه الذي سجّلت فيه.»", "testimonials.one.name": "أمارا ك.، رسّامة",
      "testimonials.two.text": "«مكنتني WorldArts من الوصول إلى جامعي أعمال في ثلاث قارات.»", "testimonials.two.name": "تشين واي، موسيقي",
      "testimonials.three.text": "«الدفع بـ WART فوري ودون رسوم بنكية.»", "testimonials.three.name": "فاطمة ز.، مخرجة",
      "payment.eyebrow": "المدفوعات", "payment.title": "عملة واحدة لفن بلا حدود",
      "payment.text": "تمر جميع معاملات WorldArts حصريًا عبر Pi Network أو عملة WART — لا دولار ولا USDT.",
      "payment.pi.desc": "دفع أصلي عبر Pi SDK", "payment.wart.desc": "العملة الرسمية لسوق WorldArts",
      "payment.card.eyebrow": "نموذج عمل", "payment.card.title": "فجر على بحيرة تنجانيقا",
      "payment.card.artist": "بواسطة أمارا ك.", "payment.card.buy": "الشراء عبر Pi",
      "about.eyebrow": "مهمتنا", "about.title": "الفن كلغة مشتركة",
      "about.text": "تربط WorldArts بين فنانين وجامعي أعمال من كل الخلفيات، بالكيروندية والفرنسية والإنجليزية والسواحيلية والعربية والصينية، ليسافر الفن دون حواجز لغوية أو نقدية.",
      "faq.eyebrow": "الأسئلة", "faq.title": "الأسئلة الشائعة",
      "faq.q1.q": "ما العملات المقبولة؟", "faq.q1.a": "فقط Pi Network وعملة WART. لا تقبل WorldArts الدولار ولا USDT.",
      "faq.q2.q": "كيف أبيع عملاً فنيًا؟", "faq.q2.a": "أنشئ ملف فنان، اربط محفظة Pi، ثم اعرض عملك مع سعره.",
      "faq.q3.q": "هل يعمل التطبيق داخل متصفح Pi؟", "faq.q3.a": "نعم، WorldArts مُحسّن لمتصفح Pi ومتوافق مع متطلبات Pi Developer Portal.",
      "faq.q4.q": "هل بياناتي محمية؟", "faq.q4.a": "نعم، تتم المصادقة عبر Pi SDK ولا تُخزّن WorldArts أي بيانات مصرفية.",
      "contact.eyebrow": "راسلنا", "contact.title": "سؤال لفريق WorldArts؟",
      "contact.form.name": "اسمك", "contact.form.email": "بريدك الإلكتروني", "contact.form.message": "رسالتك",
      "contact.form.send": "إرسال الرسالة", "contact.form.sent": "شكرًا، تم استلام رسالتك.",
      "footer.tagline": "سوق الفن العالمي، بعملتي Pi و WART.", "footer.explore": "استكشاف",
      "footer.company": "WorldArts", "footer.legal": "قانوني", "footer.terms": "الشروط",
      "footer.privacy": "الخصوصية", "footer.rights": "جميع الحقوق محفوظة.", "footer.built": "بدعم من Pi Network",
      "modal.login.title": "تسجيل الدخول عبر Pi", "modal.login.text": "وثّق حسابك عبر Pi للوصول إلى ملفك في WorldArts.",
      "modal.login.action": "المتابعة عبر Pi", "modal.payment.title": "تأكيد الدفع",
      "modal.payment.text": "سيُدفع ثمن هذا العمل مباشرة عبر Pi SDK. لا تُقبل أي عملة أخرى.",
      "modal.payment.action": "الدفع عبر Pi"
    },
    zh: {
      "nav.home": "首页", "nav.gallery": "画廊", "nav.artists": "艺术家",
      "nav.marketplace": "市场", "nav.about": "关于我们", "nav.contact": "联系我们",
      "nav.connect": "使用 Pi 连接",
      "hero.eyebrow": "全球艺术市场",
      "hero.title": "在<em>世界任何角落</em>发现、收藏与出售艺术品",
      "hero.subtitle": "WorldArts 将艺术家与收藏家聚集在一起，围绕画作、音乐与视频，使用 Pi Network 与 WART 代币支付。",
      "hero.connect": "使用 Pi 连接", "hero.explore": "浏览画廊",
      "hero.note": "仅支持 π（Pi）与 WART 支付 — 不支持美元或 USDT",
      "features.eyebrow": "您可以做什么", "features.title": "一个应用，汇聚世界艺术",
      "features.art.title": "发现艺术", "features.art.text": "浏览来自全球新锐与知名艺术家的原创作品。",
      "features.music.title": "发现音乐", "features.music.text": "直接在平台上聆听并支持独立音乐创作者。",
      "features.videos.title": "发现视频", "features.videos.text": "探索来自全球艺术家的视频作品与影像表演。",
      "features.pi.title": "使用 Pi 买卖", "features.pi.text": "通过 Pi Network 或 WART 代币安全完成每一笔交易。",
      "steps.eyebrow": "步骤", "steps.title": "WorldArts 如何运作",
      "steps.one.title": "创建个人资料", "steps.one.text": "几秒钟内注册为艺术家或收藏家。",
      "steps.two.title": "连接您的 Pi 钱包", "steps.two.text": "通过 Pi SDK 完成认证以启用支付。",
      "steps.three.title": "上架或浏览", "steps.three.text": "上架作品出售，或浏览全球画廊。",
      "steps.four.title": "使用 Pi 或 WART 支付", "steps.four.text": "安全完成交易，无需美元或 USDT。",
      "gallery.eyebrow": "精选", "gallery.title": "画廊墙",
      "artists.eyebrow": "社区", "artists.title": "精选艺术家",
      "artists.role.painter": "画家", "artists.role.musician": "音乐人",
      "artists.role.filmmaker": "影像创作者", "artists.role.sculptor": "雕塑家",
      "testimonials.eyebrow": "用户评价", "testimonials.title": "艺术家怎么说",
      "testimonials.one.text": "“我注册当天就用 Pi 卖出了第一幅画。”", "testimonials.one.name": "Amara K.，画家",
      "testimonials.two.text": "“WorldArts 让我接触到三大洲的收藏家。”", "testimonials.two.name": "Chen Wei，音乐人",
      "testimonials.three.text": "“用 WART 付款即时到账，没有银行手续费。”", "testimonials.three.name": "Fatima Z.，影像创作者",
      "payment.eyebrow": "支付", "payment.title": "无国界艺术的统一货币",
      "payment.text": "WorldArts 的所有交易仅通过 Pi Network 或 WART 代币完成 — 不支持美元或 USDT。",
      "payment.pi.desc": "通过 Pi SDK 原生支付", "payment.wart.desc": "WorldArts 市场官方代币",
      "payment.card.eyebrow": "作品示例", "payment.card.title": "坦噶尼喀湖的黎明",
      "payment.card.artist": "作者：Amara K.", "payment.card.buy": "使用 Pi 购买",
      "about.eyebrow": "我们的使命", "about.title": "艺术作为共同语言",
      "about.text": "WorldArts 连接来自各地的艺术家与收藏家，支持基隆迪语、法语、英语、斯瓦希里语、阿拉伯语与中文，让艺术跨越语言与货币的界限。",
      "faq.eyebrow": "常见问题", "faq.title": "常见问题解答",
      "faq.q1.q": "接受哪些货币？", "faq.q1.a": "仅接受 Pi Network 与 WART 代币，WorldArts 不接受美元或 USDT。",
      "faq.q2.q": "如何出售作品？", "faq.q2.a": "创建艺术家资料，连接您的 Pi 钱包，然后上架作品并设定价格。",
      "faq.q3.q": "该应用能在 Pi 浏览器中使用吗？", "faq.q3.a": "可以，WorldArts 已针对 Pi 浏览器进行优化，并符合 Pi Developer Portal 的要求。",
      "faq.q4.q": "我的数据受保护吗？", "faq.q4.a": "是的，认证通过 Pi SDK 完成，WorldArts 不存储任何银行数据。",
      "contact.eyebrow": "联系我们", "contact.title": "有问题想问 WorldArts 团队？",
      "contact.form.name": "您的姓名", "contact.form.email": "您的邮箱", "contact.form.message": "您的留言",
      "contact.form.send": "发送消息", "contact.form.sent": "感谢，您的消息已收到。",
      "footer.tagline": "全球艺术市场，支持 Pi 与 WART。", "footer.explore": "探索",
      "footer.company": "WorldArts", "footer.legal": "法律", "footer.terms": "条款",
      "footer.privacy": "隐私", "footer.rights": "版权所有。", "footer.built": "由 Pi Network 提供支持",
      "modal.login.title": "Pi 登录", "modal.login.text": "使用您的 Pi 账户进行认证以访问您的 WorldArts 资料。",
      "modal.login.action": "使用 Pi 继续", "modal.payment.title": "确认付款",
      "modal.payment.text": "此作品将直接通过 Pi SDK 支付，不接受其他货币。",
      "modal.payment.action": "使用 Pi 付款"
    }
  };

  const RTL_LANGS = ["ar"];

  /* ------------------------------------------------------------------ */
  /* 2. Application des traductions                                      */
  /* ------------------------------------------------------------------ */
  function applyLanguage(lang) {
    const dict = translations[lang] || translations.fr;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.innerHTML = dict[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key]) el.setAttribute("placeholder", dict[key]);
    });
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";
    localStorage.setItem("worldarts_lang", lang);
  }

  /* ------------------------------------------------------------------ */
  /* 3. Thème clair / sombre                                             */
  /* ------------------------------------------------------------------ */
  function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("worldarts_theme", theme);
  }

  /* ------------------------------------------------------------------ */
  /* 4. Intégration Pi SDK                                                */
  /* ------------------------------------------------------------------ */
  let piUser = null;

  function initPiSdk() {
    if (typeof Pi === "undefined") {
      console.warn("Pi SDK non chargé — ouvrez cette page dans le Pi Browser pour l'authentification réelle.");
      return;
    }
    Pi.init({ version: "2.0", sandbox: true });
  }

  function onIncompletePaymentFound(payment) {
    console.log("Paiement incomplet trouvé :", payment);
  }

  async function connectWithPi() {
    if (typeof Pi === "undefined") {
      alert("Le Pi SDK n'est disponible que dans le Pi Browser.");
      return;
    }
    try {
      const scopes = ["username", "payments"];
      const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
      piUser = auth.user;
      document.getElementById("piConnectBtn").textContent = "@" + piUser.username;
      closeModal("loginModal");
    } catch (err) {
      console.error("Échec de l'authentification Pi :", err);
    }
  }

  function payWithPi(amount, memo) {
    if (typeof Pi === "undefined") {
      alert("Le Pi SDK n'est disponible que dans le Pi Browser.");
      return;
    }
    Pi.createPayment(
      { amount: amount, memo: memo, metadata: { app: "WorldArts" } },
      {
        onReadyForServerApproval: (paymentId) => console.log("Prêt pour approbation serveur :", paymentId),
        onReadyForServerCompletion: (paymentId, txid) => console.log("Prêt pour complétion serveur :", paymentId, txid),
        onCancel: (paymentId) => console.log("Paiement annulé :", paymentId),
        onError: (error, payment) => console.error("Erreur de paiement :", error, payment)
      }
    );
  }

  /* ------------------------------------------------------------------ */
  /* 5. Modales                                                          */
  /* ------------------------------------------------------------------ */
  function openModal(id) { document.getElementById(id).classList.add("open"); }
  function closeModal(id) { document.getElementById(id).classList.remove("open"); }

  /* ------------------------------------------------------------------ */
  /* 6. Initialisation générale                                          */
  /* ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    // Thème
    const savedTheme = localStorage.getItem("worldarts_theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(savedTheme);
    document.getElementById("themeToggle").addEventListener("click", () => {
      const current = document.body.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });

    // Langue
    const savedLang = localStorage.getItem("worldarts_lang") || "fr";
    const langSelect = document.getElementById("langSelect");
    langSelect.value = savedLang;
    applyLanguage(savedLang);
    langSelect.addEventListener("change", (e) => applyLanguage(e.target.value));

    // Menu mobile
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => navLinks.classList.remove("open"))
    );

    // Pi SDK
    initPiSdk();
    document.getElementById("piConnectBtn").addEventListener("click", () => openModal("loginModal"));
    document.getElementById("heroConnectBtn").addEventListener("click", () => openModal("loginModal"));
    document.getElementById("modalConnectBtn").addEventListener("click", connectWithPi);
    document.getElementById("payBtn").addEventListener("click", () => openModal("paymentModal"));
    document.getElementById("modalPayBtn").addEventListener("click", () => {
      payWithPi(1, "Achat WorldArts — Aube sur le lac Tanganyika");
      closeModal("paymentModal");
    });

    // Fermeture des modales
    document.querySelectorAll("[data-close]").forEach((btn) =>
      btn.addEventListener("click", () => closeModal(btn.getAttribute("data-close")))
    );
    document.querySelectorAll(".modal-overlay").forEach((overlay) =>
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.classList.remove("open");
      })
    );

    // Formulaire de contact (démonstration — sans backend connecté)
    const contactForm = document.getElementById("contactForm");
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      document.getElementById("contactStatus").style.display = "block";
      contactForm.reset();
    });

    // Lien de navigation actif au défilement
    const sections = document.querySelectorAll("section[id]");
    const navAnchors = document.querySelectorAll(".nav-links a");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navAnchors.forEach((a) => a.classList.remove("active"));
            const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (active) active.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));

    // Révélation au défilement
    const revealItems = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  });
})();

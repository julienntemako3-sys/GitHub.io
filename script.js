/* ============================================================
   WorldArts — script.js
   Version corrigée et sécurisée
   Gère :
   - thème clair/sombre
   - langues FR / EN / RN / SW / AR / ZH
   - menu mobile
   - connexion Pi SDK
   - authentification backend
   - paiements Pi
   - paiements incomplets
   - modales
   - formulaire de contact
   - animations au scroll
   - restauration de session
   ============================================================ */

(function () {
  "use strict";

  /* ==========================================================
     1. CONFIGURATION
     ========================================================== */

  const API_URL = "https://worldarts-backend.onrender.com";

  /*
   * IMPORTANT :
   * true  = Pi Sandbox / test
   * false = Pi Mainnet
   *
   * Ne pas passer à false tant que l'application n'est pas
   * prête et autorisée pour Mainnet.
   */
  const PI_SANDBOX = true;

  let piUser = null;
  let currentLang =
    localStorage.getItem("worldarts_lang") || "fr";


  /* ==========================================================
     2. TRADUCTIONS
     ========================================================== */

  const translations = {

    fr: {
      "nav.home": "Accueil",
      "nav.gallery": "Galerie",
      "nav.artists": "Artistes",
      "nav.marketplace": "Marché",
      "nav.about": "À propos",
      "nav.contact": "Contact",
      "nav.connect": "Se connecter avec Pi",

      "hero.eyebrow": "Marché d'art mondial",
      "hero.title":
        "Découvrez, collectionnez et vendez de l'art <em>partout dans le monde</em>",
      "hero.subtitle":
        "WorldArts réunit artistes et collectionneurs autour d'œuvres, de musique et de vidéos, avec des paiements en Pi Network et en jeton WART.",
      "hero.connect": "Se connecter avec Pi",
      "hero.explore": "Explorer la galerie",
      "hero.note":
        "Paiements exclusivement en π (Pi) et WART — aucun dollar, aucun USDT",

      "features.eyebrow": "Ce que vous pouvez faire",
      "features.title":
        "Une seule application, tout l'art du monde",
      "features.art.title": "Découvrir l'art",
      "features.art.text":
        "Parcourez des œuvres originales issues d'artistes émergents et confirmés du monde entier.",
      "features.music.title": "Découvrir la musique",
      "features.music.text":
        "Écoutez et soutenez des créateurs musicaux indépendants directement depuis la plateforme.",
      "features.videos.title": "Découvrir les vidéos",
      "features.videos.text":
        "Explorez des créations vidéo et des performances filmées par des artistes du monde entier.",
      "features.pi.title": "Acheter & vendre avec Pi",
      "features.pi.text":
        "Réalisez chaque transaction en toute sécurité avec Pi Network ou le jeton WART.",

      "steps.eyebrow": "Étapes",
      "steps.title": "Comment fonctionne WorldArts",
      "steps.one.title": "Créer un profil",
      "steps.one.text":
        "Inscrivez-vous en tant qu'artiste ou collectionneur en quelques secondes.",
      "steps.two.title": "Connecter son portefeuille Pi",
      "steps.two.text":
        "Authentifiez-vous avec le Pi SDK pour activer les paiements.",
      "steps.three.title": "Publier ou parcourir",
      "steps.three.text":
        "Mettez une œuvre en vente ou parcourez la galerie mondiale.",
      "steps.four.title": "Payer en Pi ou WART",
      "steps.four.text":
        "Concluez la transaction en toute sécurité, sans dollar ni USDT.",

      "gallery.eyebrow": "Sélection",
      "gallery.title": "Le mur de la galerie",

      "artists.eyebrow": "Communauté",
      "artists.title": "Artistes à l'honneur",
      "artists.role.painter": "Peintre",
      "artists.role.musician": "Musicien",
      "artists.role.filmmaker": "Cinéaste",
      "artists.role.sculptor": "Sculpteur",

      "testimonials.eyebrow": "Témoignages",
      "testimonials.title": "Ce qu'en disent les artistes",

      "payment.eyebrow": "Paiements",
      "payment.title":
        "Une monnaie pour un art sans frontières",
      "payment.text":
        "Toutes les transactions WorldArts passent uniquement par Pi Network ou le jeton WART — aucun dollar, aucun USDT.",
      "payment.pi.desc":
        "paiement natif via le Pi SDK",
      "payment.wart.desc":
        "jeton officiel de la place de marché WorldArts",

      "payment.card.eyebrow": "Exemple d'œuvre",
      "payment.card.title":
        "Aube sur le lac Tanganyika",
      "payment.card.artist": "par Amara K.",
      "payment.card.buy": "Acheter avec Pi",

      "about.eyebrow": "Notre mission",
      "about.title": "L'art comme langage commun",

      "faq.eyebrow": "Questions",
      "faq.title": "Foire aux questions",

      "contact.eyebrow": "Nous écrire",
      "contact.title":
        "Une question pour l'équipe WorldArts ?",
      "contact.form.name": "Votre nom",
      "contact.form.email": "Votre email",
      "contact.form.message": "Votre message",
      "contact.form.send": "Envoyer le message",
      "contact.form.sent":
        "Merci, votre message a bien été noté.",

      "footer.tagline":
        "Le marché mondial de l'art, en Pi et en WART.",
      "footer.explore": "Explorer",
      "footer.company": "WorldArts",
      "footer.legal": "Légal",
      "footer.terms": "Conditions",
      "footer.privacy": "Confidentialité",
      "footer.rights": "Tous droits réservés.",
      "footer.built": "Propulsé par Pi Network",

      "modal.login.title": "Connexion Pi",
      "modal.login.text":
        "Authentifiez-vous avec votre compte Pi pour accéder à votre profil WorldArts.",
      "modal.login.action": "Continuer avec Pi",

      "modal.payment.title": "Confirmer le paiement",
      "modal.payment.text":
        "Cette œuvre sera payée directement via le Pi SDK. Aucune autre devise n'est acceptée.",
      "modal.payment.action": "Payer avec Pi"
    },

    en: {
      "nav.home": "Home",
      "nav.gallery": "Gallery",
      "nav.artists": "Artists",
      "nav.marketplace": "Marketplace",
      "nav.about": "About",
      "nav.contact": "Contact",
      "nav.connect": "Connect with Pi",

      "hero.eyebrow": "The world art marketplace",
      "hero.title":
        "Discover, collect and sell art <em>from anywhere in the world</em>",
      "hero.subtitle":
        "WorldArts brings artists and collectors together around artwork, music and videos, with payments in Pi Network and the WART token.",
      "hero.connect": "Connect with Pi",
      "hero.explore": "Explore the gallery",
      "hero.note":
        "Payments exclusively in π (Pi) and WART — no dollars, no USDT",

      "features.eyebrow": "What you can do",
      "features.title":
        "One app, all the world's art",
      "features.art.title": "Discover art",
      "features.art.text":
        "Browse original artwork from emerging and established artists worldwide.",
      "features.music.title": "Discover music",
      "features.music.text":
        "Listen to and support independent musicians directly on the platform.",
      "features.videos.title": "Discover videos",
      "features.videos.text":
        "Explore video creations and filmed performances from artists around the world.",
      "features.pi.title": "Buy & sell with Pi",
      "features.pi.text":
        "Complete every transaction securely with Pi Network or the WART token.",

      "steps.eyebrow": "Steps",
      "steps.title": "How WorldArts works",

      "gallery.eyebrow": "Selection",
      "gallery.title": "The gallery wall",

      "artists.eyebrow": "Community",
      "artists.title": "Featured artists",

      "payment.eyebrow": "Payments",
      "payment.title":
        "One currency for borderless art",
      "payment.text":
        "Every WorldArts transaction goes through Pi Network or the WART token only — no dollars, no USDT.",
      "payment.pi.desc":
        "native payment via the Pi SDK",
      "payment.wart.desc":
        "official token of the WorldArts marketplace",

      "payment.card.eyebrow": "Sample artwork",
      "payment.card.title":
        "Dawn over Lake Tanganyika",
      "payment.card.artist": "by Amara K.",
      "payment.card.buy": "Buy with Pi",

      "about.eyebrow": "Our mission",
      "about.title": "Art as a common language",

      "faq.eyebrow": "Questions",
      "faq.title": "Frequently asked questions",

      "contact.eyebrow": "Write to us",
      "contact.title":
        "A question for the WorldArts team?",
      "contact.form.name": "Your name",
      "contact.form.email": "Your email",
      "contact.form.message": "Your message",
      "contact.form.send": "Send message",
      "contact.form.sent":
        "Thank you, your message has been received.",

      "footer.tagline":
        "The world's art marketplace, in Pi and WART.",
      "footer.explore": "Explore",
      "footer.company": "WorldArts",
      "footer.legal": "Legal",
      "footer.terms": "Terms",
      "footer.privacy": "Privacy",
      "footer.rights": "All rights reserved.",
      "footer.built": "Powered by Pi Network",

      "modal.login.title": "Pi Login",
      "modal.login.text":
        "Authenticate with your Pi account to access your WorldArts profile.",
      "modal.login.action": "Continue with Pi",

      "modal.payment.title": "Confirm payment",
      "modal.payment.text":
        "This artwork will be paid for directly via the Pi SDK. No other currency is accepted.",
      "modal.payment.action": "Pay with Pi"
    },

    rn: {
      "nav.home": "Ahabanza",
      "nav.gallery": "Ivyerekanwa",
      "nav.artists": "Abahanzi",
      "nav.marketplace": "Isoko",
      "nav.about": "Ivyerekeye",
      "nav.contact": "Twandikire",
      "nav.connect": "Kwinjira na Pi",

      "hero.eyebrow":
        "Isoko ry'ubuhanzi ku isi yose",
      "hero.title":
        "Rondera, tora kandi ugurishe ubuhanzi <em>ahantu hose kw'isi</em>",
      "hero.subtitle":
        "WorldArts ihuza abahanzi n'abatora ivyerekanwa, indirimbo n'amashusho, hakoreshwa Pi Network na WART.",
      "hero.connect": "Kwinjira na Pi",
      "hero.explore": "Raba ivyerekanwa",
      "hero.note":
        "Kwishura gukorwa gusa muri π (Pi) na WART — nta madolari, nta USDT",

      "features.eyebrow":
        "Ivyo ushobora gukora",
      "features.title":
        "Application imwe, ubuhanzi bwose bw'isi",

      "features.art.title":
        "Rondera ubuhanzi",
      "features.art.text":
        "Raba ivyerekanwa bishasha biva ku bahanzi bo kw'isi yose.",

      "features.music.title":
        "Rondera indirimbo",
      "features.music.text":
        "Umviriza kandi ushigikire abahanzi b'indirimbo bigenga ukoresheje application.",

      "features.videos.title":
        "Rondera amashusho",
      "features.videos.text":
        "Raba amashusho n'ibikorwa vyafashwe n'abahanzi bo kw'isi yose.",

      "features.pi.title":
        "Gura & Gurisha na Pi",
      "features.pi.text":
        "Kora ivyo wagurishije canke wagurishijwe mu mutekano wose ukoresheje Pi Network canke WART.",

      "steps.eyebrow": "Intambwe",
      "steps.title": "Ingene WorldArts ikora",

      "steps.one.title":
        "Kurema umwidondoro",
      "steps.one.text":
        "Iyandikishe nk'umuhanzi canke nk'umuguzi mu masegonda make.",

      "steps.two.title":
        "Kwinjira mu mufuko wa Pi",
      "steps.two.text":
        "Wemeze uwo uri we ukoresheje Pi SDK kugira ureke kwishura bikore.",

      "steps.three.title":
        "Shira canke rondera",
      "steps.three.text":
        "Shira igikorwa cawe ku isoko canke urondere mu vyerekanwa vy'isi.",

      "steps.four.title":
        "Ishura na Pi canke WART",
      "steps.four.text":
        "Rangiza igikorwa mu mutekano wose, nta madolari canke USDT.",

      "gallery.eyebrow": "Amahitamwo",
      "gallery.title":
        "Uruzitiro rw'ivyerekanwa",

      "artists.eyebrow": "Umuryango",
      "artists.title":
        "Abahanzi bashimwa",

      "payment.eyebrow": "Kwishura",
      "payment.title":
        "Ifaranga rimwe ku buhanzi bata mbibe",

      "payment.text":
        "Ivyishurwa vyose vya WorldArts binyura gusa muri Pi Network canke WART — nta madolari, nta USDT.",

      "payment.pi.desc":
        "kwishura kw'umwimbu binyuze muri Pi SDK",

      "payment.wart.desc":
        "ikaramu nyeshuri y'isoko rya WorldArts",

      "payment.card.eyebrow":
        "Akarorero k'igikorwa",

      "payment.card.title":
        "Umuseke ku kiyaga Tanganyika",

      "payment.card.artist":
        "na Amara K.",

      "payment.card.buy":
        "Gura na Pi",

      "about.eyebrow":
        "Intumbero yacu",

      "about.title":
        "Ubuhanzi nk'ururimi rusanzwe",

      "faq.eyebrow":
        "Ibibazo",

      "faq.title":
        "Ibibazo bikunze kubazwa",

      "contact.eyebrow":
        "Twandikire",

      "contact.title":
        "Ikibazo ku bagize itsinda rya WorldArts?",

      "contact.form.name":
        "Izina ryawe",

      "contact.form.email":
        "Email yawe",

      "contact.form.message":
        "Ubutumwa bwawe",

      "contact.form.send":
        "Rungika ubutumwa",

      "contact.form.sent":
        "Urakoze, ubutumwa bwawe bwakiriwe.",

      "footer.tagline":
        "Isoko ry'ubuhanzi ku isi yose, muri Pi na WART.",

      "footer.explore":
        "Rondera",

      "footer.company":
        "WorldArts",

      "footer.legal":
        "Amategeko",

      "footer.terms":
        "Amasezerano",

      "footer.privacy":
        "Ibanga",

      "footer.rights":
        "Uburenganzira bwose burazigamiwe.",

      "footer.built":
        "Ikorwa na Pi Network",

      "modal.login.title":
        "Kwinjira na Pi",

      "modal.login.text":
        "Wemeze uwo uri we ukoresheje konte yawe ya Pi kugira ushikire umwidondoro wawe wa WorldArts.",

      "modal.login.action":
        "Komeza na Pi",

      "modal.payment.title":
        "Emeza ivyishurwa",

      "modal.payment.text":
        "Iki gikorwa kizishurwa biciye muri Pi SDK. Nta yindi mafaranga yemewe.",

      "modal.payment.action":
        "Ishura na Pi"
    },

    sw: {
      "nav.home": "Nyumbani",
      "nav.gallery": "Ghala",
      "nav.artists": "Wasanii",
      "nav.marketplace": "Soko",
      "nav.about": "Kuhusu",
      "nav.contact": "Wasiliana",
      "nav.connect": "Ungana na Pi",

      "hero.eyebrow":
        "Soko la sanaa la dunia",

      "hero.title":
        "Gundua, kusanya na uuze sanaa <em>kutoka popote duniani</em>",

      "hero.subtitle":
        "WorldArts inaunganisha wasanii na wakusanyaji kupitia kazi za sanaa, muziki na video, kwa malipo ya Pi Network na tokeni ya WART.",

      "hero.connect":
        "Ungana na Pi",

      "hero.explore":
        "Chunguza ghala",

      "hero.note":
        "Malipo kwa π (Pi) na WART pekee — hakuna dola, hakuna USDT",

      "features.eyebrow":
        "Unachoweza kufanya",

      "features.title":
        "Programu moja, sanaa yote ya dunia",

      "features.art.title":
        "Gundua sanaa",

      "features.art.text":
        "Vinjari kazi za sanaa halisi kutoka kwa wasanii wapya na waliobobea duniani kote.",

      "features.music.title":
        "Gundua muziki",

      "features.music.text":
        "Sikiliza na uwaunge mkono wasanii wa muziki huru moja kwa moja kwenye jukwaa.",

      "features.videos.title":
        "Gundua video",

      "features.videos.text":
        "Chunguza kazi za video na maonyesho yaliyorekodiwa na wasanii duniani kote.",

      "features.pi.title":
        "Nunua na uuze kwa Pi",

      "features.pi.text":
        "Kamilisha kila muamala kwa usalama kwa Pi Network au tokeni ya WART.",

      "steps.eyebrow":
        "Hatua",

      "steps.title":
        "Jinsi WorldArts inavyofanya kazi",

      "gallery.eyebrow":
        "Uteuzi",

      "gallery.title":
        "Ukuta wa ghala",

      "artists.eyebrow":
        "Jamii",

      "artists.title":
        "Wasanii maalum",

      "payment.eyebrow":
        "Malipo",

      "payment.title":
        "Sarafu moja kwa sanaa isiyo na mipaka",

      "payment.text":
        "Miamala yote ya WorldArts hupitia Pi Network au tokeni ya WART pekee — hakuna dola, hakuna USDT.",

      "payment.pi.desc":
        "malipo asilia kupitia Pi SDK",

      "payment.wart.desc":
        "tokeni rasmi ya soko la WorldArts",

      "payment.card.eyebrow":
        "Mfano wa kazi",

      "payment.card.title":
        "Alfajiri juu ya Ziwa Tanganyika",

      "payment.card.artist":
        "na Amara K.",

      "payment.card.buy":
        "Nunua kwa Pi",

      "about.eyebrow":
        "Dhamira yetu",

      "about.title":
        "Sanaa kama lugha ya pamoja",

      "faq.eyebrow":
        "Maswali",

      "faq.title":
        "Maswali yanayoulizwa mara kwa mara",

      "contact.eyebrow":
        "Tuandikie",

      "contact.title":
        "Una swali kwa timu ya WorldArts?",

      "contact.form.name":
        "Jina lako",

      "contact.form.email":
        "Barua pepe yako",

      "contact.form.message":
        "Ujumbe wako",

      "contact.form.send":
        "Tuma ujumbe",

      "contact.form.sent":
        "Asante, ujumbe wako umepokelewa.",

      "footer.tagline":
        "Soko la sanaa la dunia, kwa Pi na WART.",

      "footer.explore":
        "Chunguza",

      "footer.company":
        "WorldArts",

      "footer.legal":
        "Kisheria",

      "footer.terms":
        "Masharti",

      "footer.privacy":
        "Faragha",

      "footer.rights":
        "Haki zote zimehifadhiwa.",

      "footer.built":
        "Inaendeshwa na Pi Network",

      "modal.login.title":
        "Kuingia kwa Pi",

      "modal.login.text":
        "Thibitisha kwa akaunti yako ya Pi ili kufikia wasifu wako wa WorldArts.",

      "modal.login.action":
        "Endelea na Pi",

      "modal.payment.title":
        "Thibitisha malipo",

      "modal.payment.text":
        "Kazi hii italipwa moja kwa moja kupitia Pi SDK. Hakuna sarafu nyingine inayokubalika.",

      "modal.payment.action":
        "Lipa kwa Pi"
    },

    ar: {
      "nav.home": "الرئيسية",
      "nav.gallery": "المعرض",
      "nav.artists": "الفنانون",
      "nav.marketplace": "السوق",
      "nav.about": "من نحن",
      "nav.contact": "اتصل بنا",
      "nav.connect": "تسجيل الدخول عبر Pi",

      "hero.eyebrow":
        "سوق الفن العالمي",

      "hero.title":
        "اكتشف واجمع وبِع الفن <em>من أي مكان في العالم</em>",

      "hero.subtitle":
        "يجمع WorldArts الفنانين وهواة الجمع حول الأعمال الفنية والموسيقى والفيديوهات، بمدفوعات عبر Pi Network وعملة WART.",

      "hero.connect":
        "تسجيل الدخول عبر Pi",

      "hero.explore":
        "استكشف المعرض",

      "hero.note":
        "المدفوعات حصراً بعملة π (Pi) و WART — لا دولار ولا USDT",

      "features.eyebrow":
        "ما يمكنك فعله",

      "features.title":
        "تطبيق واحد، كل فن العالم",

      "features.art.title":
        "اكتشف الفن",

      "features.art.text":
        "تصفح أعمالاً فنية أصلية من فنانين ناشئين ومعروفين حول العالم.",

      "features.music.title":
        "اكتشف الموسيقى",

      "features.music.text":
        "استمع وادعم موسيقيين مستقلين مباشرة عبر المنصة.",

      "features.videos.title":
        "اكتشف الفيديوهات",

      "features.videos.text":
        "استكشف أعمال فيديو وعروضاً مصوَّرة من فنانين حول العالم.",

      "features.pi.title":
        "اشترِ وبِع عبر Pi",

      "features.pi.text":
        "أتمم كل معاملة بأمان عبر Pi Network أو عملة WART.",

      "steps.eyebrow":
        "الخطوات",

      "steps.title":
        "كيف يعمل WorldArts",

      "gallery.eyebrow":
        "مختارات",

      "gallery.title":
        "جدار المعرض",

      "artists.eyebrow":
        "المجتمع",

      "artists.title":
        "فنانون مميزون",

      "payment.eyebrow":
        "المدفوعات",

      "payment.title":
        "عملة واحدة لفن بلا حدود",

      "payment.text":
        "تمر جميع معاملات WorldArts حصراً عبر Pi Network أو عملة WART — لا دولار ولا USDT.",

      "payment.pi.desc":
        "دفع أصلي عبر Pi SDK",

      "payment.wart.desc":
        "العملة الرسمية لسوق WorldArts",

      "payment.card.eyebrow":
        "نموذج عمل فني",

      "payment.card.title":
        "الفجر فوق بحيرة تنجانيقا",

      "payment.card.artist":
        "بواسطة أمارا ك.",

      "payment.card.buy":
        "اشترِ عبر Pi",

      "about.eyebrow":
        "مهمتنا",

      "about.title":
        "الفن كلغة مشتركة",

      "faq.eyebrow":
        "الأسئلة",

      "faq.title":
        "الأسئلة الشائعة",

      "contact.eyebrow":
        "راسلنا",

      "contact.title":
        "لديك سؤال لفريق WorldArts؟",

      "contact.form.name":
        "اسمك",

      "contact.form.email":
        "بريدك الإلكتروني",

      "contact.form.message":
        "رسالتك",

      "contact.form.send":
        "إرسال الرسالة",

      "contact.form.sent":
        "شكراً، تم استلام رسالتك.",

      "footer.tagline":
        "سوق الفن العالمي، بعملتي Pi و WART.",

      "footer.explore":
        "استكشف",

      "footer.company":
        "WorldArts",

      "footer.legal":
        "قانوني",

      "footer.terms":
        "الشروط",

      "footer.privacy":
        "الخصوصية",

      "footer.rights":
        "جميع الحقوق محفوظة.",

      "footer.built":
        "مدعوم من Pi Network",

      "modal.login.title":
        "تسجيل الدخول عبر Pi",

      "modal.login.text":
        "وثّق هويتك عبر حساب Pi للوصول إلى ملفك في WorldArts.",

      "modal.login.action":
        "المتابعة عبر Pi",

      "modal.payment.title":
        "تأكيد الدفع",

      "modal.payment.text":
        "سيُدفع ثمن هذا العمل مباشرة عبر Pi SDK. لا تُقبل أي عملة أخرى.",

      "modal.payment.action":
        "ادفع عبر Pi"
    },

    zh: {
      "nav.home": "首页",
      "nav.gallery": "画廊",
      "nav.artists": "艺术家",
      "nav.marketplace": "市场",
      "nav.about": "关于我们",
      "nav.contact": "联系我们",
      "nav.connect": "使用 Pi 登录",

      "hero.eyebrow":
        "全球艺术市场",

      "hero.title":
        "发现、收藏并出售来自<em>世界各地</em>的艺术品",

      "hero.subtitle":
        "WorldArts 将艺术家与收藏家聚集在一起，围绕艺术品、音乐和视频，使用 Pi Network 和 WART 代币进行支付。",

      "hero.connect":
        "使用 Pi 登录",

      "hero.explore":
        "探索画廊",

      "hero.note":
        "仅支持 π（Pi）和 WART 支付 —— 不支持美元，不支持 USDT",

      "features.eyebrow":
        "您可以做什么",

      "features.title":
        "一个应用，汇集世界艺术",

      "features.art.title":
        "发现艺术",

      "features.art.text":
        "浏览来自全球新兴及知名艺术家的原创作品。",

      "features.music.title":
        "发现音乐",

      "features.music.text":
        "在平台上直接聆听并支持独立音乐创作者。",

      "features.videos.title":
        "发现视频",

      "features.videos.text":
        "探索来自全球艺术家的视频创作和表演录像。",

      "features.pi.title":
        "使用 Pi 买卖",

      "features.pi.text":
        "通过 Pi Network 或 WART 代币安全完成每笔交易。",

      "steps.eyebrow":
        "步骤",

      "steps.title":
        "WorldArts 如何运作",

      "gallery.eyebrow":
        "精选",

      "gallery.title":
        "画廊墙",

      "artists.eyebrow":
        "社区",

      "artists.title":
        "精选艺术家",

      "payment.eyebrow":
        "支付方式",

      "payment.title":
        "无国界艺术的统一货币",

      "payment.text":
        "所有 WorldArts 交易仅通过 Pi Network 或 WART 代币进行 —— 不支持美元，不支持 USDT。",

      "payment.pi.desc":
        "通过 Pi SDK 原生支付",

      "payment.wart.desc":
        "WorldArts 市场的官方代币",

      "payment.card.eyebrow":
        "作品示例",

      "payment.card.title":
        "坦噶尼喀湖的黎明",

      "payment.card.artist":
        "作者：Amara K.",

      "payment.card.buy":
        "使用 Pi 购买",

      "about.eyebrow":
        "我们的使命",

      "about.title":
        "艺术作为共同语言",

      "faq.eyebrow":
        "常见问题",

      "faq.title":
        "常见问题解答",

      "contact.eyebrow":
        "给我们留言",

      "contact.title":
        "对 WorldArts 团队有疑问？",

      "contact.form.name":
        "您的姓名",

      "contact.form.email":
        "您的邮箱",

      "contact.form.message":
        "您的留言",

      "contact.form.send":
        "发送留言",

      "contact.form.sent":
        "谢谢，我们已收到您的留言。",

      "footer.tagline":
        "全球艺术市场，支持 Pi 与 WART。",

      "footer.explore":
        "探索",

      "footer.company":
        "WorldArts",

      "footer.legal":
        "法律",

      "footer.terms":
        "条款",

      "footer.privacy":
        "隐私",

      "footer.rights":
        "版权所有。",

      "footer.built":
        "由 Pi Network 提供支持",

      "modal.login.title":
        "Pi 登录",

      "modal.login.text":
        "使用您的 Pi 账户进行身份验证以访问您的 WorldArts 资料。",

      "modal.login.action":
        "使用 Pi 继续",

      "modal.payment.title":
        "确认支付",

      "modal.payment.text":
        "此作品将直接通过 Pi SDK 支付。不接受任何其他货币。",

      "modal.payment.action":
        "使用 Pi 支付"
    }
  };


  /* ==========================================================
     3. INITIALISATION
     ========================================================== */

  document.addEventListener("DOMContentLoaded", function () {

    try {
      initTheme();
    } catch (error) {
      console.error("Theme initialization error:", error);
    }

    try {
      initLanguage();
    } catch (error) {
      console.error("Language initialization error:", error);
    }

    try {
      initMenu();
    } catch (error) {
      console.error("Menu initialization error:", error);
    }

    try {
      initModals();
    } catch (error) {
      console.error("Modal initialization error:", error);
    }

    try {
      initButtons();
    } catch (error) {
      console.error("Button initialization error:", error);
    }

    try {
      initContactForm();
    } catch (error) {
      console.error("Contact initialization error:", error);
    }

    try {
      initScrollReveal();
    } catch (error) {
      console.error("Reveal initialization error:", error);
    }

    try {
      initNavHighlight();
    } catch (error) {
      console.error("Navigation initialization error:", error);
    }

    try {
      restoreSession();
    } catch (error) {
      console.error("Session restoration error:", error);
    }

    /*
     * Pi SDK doit être initialisé après le chargement de la page.
     */
    try {
      initPiSdk();
    } catch (error) {
      console.error("Pi SDK initialization error:", error);
    }

  });


  /* ==========================================================
     4. THÈME
     ========================================================== */

  function initTheme() {

    const saved =
      localStorage.getItem("worldarts_theme") || "light";

    document.body.setAttribute(
      "data-theme",
      saved === "dark" ? "dark" : "light"
    );

    const themeBtn =
      document.getElementById("themeToggle");

    if (!themeBtn) return;

    themeBtn.addEventListener("click", function () {

      const current =
        document.body.getAttribute("data-theme");

      const next =
        current === "dark" ? "light" : "dark";

      document.body.setAttribute(
        "data-theme",
        next
      );

      localStorage.setItem(
        "worldarts_theme",
        next
      );

    });
  }


  /* ==========================================================
     5. LANGUE
     ========================================================== */

  function applyTranslations(lang) {

    const dict =
      translations[lang] || translations.fr;

    document
      .querySelectorAll("[data-i18n]")
      .forEach(function (element) {

        const key =
          element.getAttribute("data-i18n");

        if (
          Object.prototype.hasOwnProperty.call(
            dict,
            key
          )
        ) {
          element.innerHTML = dict[key];
        }

      });

    document
      .querySelectorAll("[data-i18n-placeholder]")
      .forEach(function (element) {

        const key =
          element.getAttribute(
            "data-i18n-placeholder"
          );

        if (
          Object.prototype.hasOwnProperty.call(
            dict,
            key
          )
        ) {
          element.setAttribute(
            "placeholder",
            dict[key]
          );
        }

      });

    document.documentElement.setAttribute(
      "lang",
      lang
    );

    document.documentElement.setAttribute(
      "dir",
      lang === "ar" ? "rtl" : "ltr"
    );

    currentLang = lang;

    localStorage.setItem(
      "worldarts_lang",
      lang
    );
  }


  function initLanguage() {

    const select =
      document.getElementById("langSelect");

    if (select) {

      if (
        translations[currentLang]
      ) {
        select.value = currentLang;
      } else {
        currentLang = "fr";
        select.value = "fr";
      }

      select.addEventListener(
        "change",
        function (event) {

          applyTranslations(
            event.target.value
          );

        }
      );
    }

    applyTranslations(currentLang);
  }


  /* ==========================================================
     6. MENU MOBILE
     ========================================================== */

  function initMenu() {

    const menuBtn =
      document.getElementById("menuToggle");

    const navLinks =
      document.getElementById("navLinks");

    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener(
      "click",
      function () {

        navLinks.classList.toggle("open");

      }
    );

    navLinks
      .querySelectorAll("a")
      .forEach(function (link) {

        link.addEventListener(
          "click",
          function () {

            navLinks.classList.remove(
              "open"
            );

          }
        );

      });
  }


  /* ==========================================================
     7. NAVIGATION ACTIVE
     ========================================================== */

  function initNavHighlight() {

    const sections =
      document.querySelectorAll(
        "section[id]"
      );

    const navItems =
      document.querySelectorAll(
        ".nav-links a"
      );

    if (
      !sections.length ||
      !navItems.length ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const observer =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(
            function (entry) {

              if (!entry.isIntersecting) {
                return;
              }

              const id =
                entry.target.getAttribute(
                  "id"
                );

              navItems.forEach(
                function (link) {

                  link.classList.toggle(
                    "active",
                    link.getAttribute(
                      "href"
                    ) === "#" + id
                  );

                }
              );

            }
          );

        },
        {
          rootMargin:
            "-40% 0px -50% 0px"
        }
      );

    sections.forEach(
      function (section) {
        observer.observe(section);
      }
    );
  }


  /* ==========================================================
     8. REVEAL
     ========================================================== */

  function initScrollReveal() {

    const items =
      document.querySelectorAll(
        ".reveal"
      );

    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {

      items.forEach(
        function (item) {
          item.classList.add(
            "visible"
          );
        }
      );

      return;
    }

    const observer =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(
            function (entry) {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "visible"
                );

                observer.unobserve(
                  entry.target
                );
              }

            }
          );

        },
        {
          threshold: 0.15
        }
      );

    items.forEach(
      function (item) {
        observer.observe(item);
      }
    );
  }


  /* ==========================================================
     9. MODALES
     ========================================================== */

  function openModal(id) {

    const modal =
      document.getElementById(id);

    if (!modal) return;

    modal.classList.add("open");

  }


  function closeModal(id) {

    const modal =
      document.getElementById(id);

    if (!modal) return;

    modal.classList.remove("open");

  }


  function initModals() {

    document
      .querySelectorAll("[data-close]")
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            closeModal(
              button.getAttribute(
                "data-close"
              )
            );

          }
        );

      });

    document
      .querySelectorAll(".modal-overlay")
      .forEach(function (overlay) {

        overlay.addEventListener(
          "click",
          function (event) {

            if (
              event.target === overlay
            ) {
              overlay.classList.remove(
                "open"
              );
            }

          }
        );

      });
  }


  /* ==========================================================
     10. BOUTONS
     ========================================================== */

  function initButtons() {

    const openLogin =
      function () {

        if (piUser) {
          return;
        }

        openModal("loginModal");

      };


    const piConnectBtn =
      document.getElementById(
        "piConnectBtn"
      );

    const heroConnectBtn =
      document.getElementById(
        "heroConnectBtn"
      );

    const modalConnectBtn =
      document.getElementById(
        "modalConnectBtn"
      );


    if (piConnectBtn) {
      piConnectBtn.addEventListener(
        "click",
        openLogin
      );
    }


    if (heroConnectBtn) {
      heroConnectBtn.addEventListener(
        "click",
        openLogin
      );
    }


    if (modalConnectBtn) {
      modalConnectBtn.addEventListener(
        "click",
        connectWithPi
      );
    }


    const payBtn =
      document.getElementById(
        "payBtn"
      );

    const modalPayBtn =
      document.getElementById(
        "modalPayBtn"
      );


    if (payBtn) {

      payBtn.addEventListener(
        "click",
        function () {

          if (!piUser) {

            openModal("loginModal");

            return;
          }

          openModal("paymentModal");

        }
      );
    }


    if (modalPayBtn) {

      modalPayBtn.addEventListener(
        "click",
        function () {

          payWithPi({
            amount: 1,
            memo:
              "Aube sur le lac Tanganyika — WorldArts",
            artworkId:
              "demo-artwork-01"
          });

        }
      );
    }
  }


  /* ==========================================================
     11. PI SDK
     ========================================================== */

  function initPiSdk() {

    if (typeof window.Pi === "undefined") {

      console.warn(
        "Pi SDK non détecté. Ouvrez WorldArts dans Pi Browser."
      );

      return false;
    }


    try {

      window.Pi.init({
        version: "2.0",
        sandbox: PI_SANDBOX
      });

      console.log(
        "Pi SDK initialisé.",
        {
          sandbox: PI_SANDBOX
        }
      );

      return true;

    } catch (error) {

      console.error(
        "Pi.init() failed:",
        error
      );

      return false;
    }
  }


  /* ==========================================================
     12. PI LOGIN
     ========================================================== */

  async function connectWithPi() {

    const button =
      document.getElementById(
        "modalConnectBtn"
      );


    if (typeof window.Pi === "undefined") {

      alert(
        "Ouvrez WorldArts dans le Pi Browser pour vous connecter avec Pi."
      );

      return;
    }


    if (button) {
      button.disabled = true;
      button.textContent =
        "Connexion à Pi...";
    }


    try {

      /*
       * On initialise Pi avant authenticate().
       */
      initPiSdk();


      const scopes = [
        "username",
        "payments"
      ];


      const auth =
        await window.Pi.authenticate(
          scopes,
          onIncompletePaymentFound
        );


      if (
        !auth ||
        !auth.user ||
        !auth.accessToken
      ) {

        throw new Error(
          "Les données d'authentification Pi sont incomplètes."
        );
      }


      console.log(
        "Pi authentication successful:",
        auth.user
      );


      /*
       * Envoi du accessToken au backend Render.
       */
      const response =
        await fetch(
          API_URL +
            "/api/auth/pi-login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              accessToken:
                auth.accessToken
            })
          }
        );


      let data = null;


      try {
        data =
          await response.json();
      } catch (jsonError) {

        throw new Error(
          "Le serveur WorldArts a retourné une réponse invalide."
        );
      }


      if (!response.ok) {

        throw new Error(
          data &&
          data.error
            ? data.error
            : "Échec de l'authentification WorldArts."
        );
      }


      if (
        !data.token ||
        !data.user
      ) {

        throw new Error(
          "Le backend WorldArts n'a pas retourné de session valide."
        );
      }


      /*
       * Session WorldArts.
       */
      piUser = data.user;


      localStorage.setItem(
        "worldarts_token",
        data.token
      );


      localStorage.setItem(
        "worldarts_user",
        JSON.stringify(data.user)
      );


      updateLoginButton();


      closeModal("loginModal");


      alert(
        "Bienvenue @" +
          (piUser.username || "Pi User") +
          " sur WorldArts !"
      );


      console.log(
        "WorldArts authentication successful:",
        data.user
      );


    } catch (error) {

      console.error(
        "Pi authentication error:",
        error
      );


      alert(
        "Connexion Pi impossible : " +
          (
            error &&
            error.message
              ? error.message
              : "Erreur inconnue."
          )
      );


    } finally {

      if (button) {

        button.disabled = false;

        const dict =
          translations[currentLang] ||
          translations.fr;

        button.textContent =
          dict["modal.login.action"] ||
          "Continuer avec Pi";
      }
    }
  }


  /* ==========================================================
     13. MISE À JOUR DU BOUTON LOGIN
     ========================================================== */

  function updateLoginButton() {

    const button =
      document.getElementById(
        "piConnectBtn"
      );

    if (!button) return;


    if (
      piUser &&
      piUser.username
    ) {

      button.textContent =
        "@" + piUser.username;

      button.classList.add(
        "connected"
      );

    } else {

      button.classList.remove(
        "connected"
      );

    }
  }


  /* ==========================================================
     14. PAIEMENT PI
     ========================================================== */

  async function payWithPi({
    amount,
    memo,
    artworkId
  }) {

    if (
      typeof window.Pi === "undefined"
    ) {

      alert(
        "Ouvrez WorldArts dans le Pi Browser pour effectuer un paiement."
      );

      return;
    }


    if (!piUser) {

      alert(
        "Connectez-vous d'abord avec Pi."
      );

      openModal("loginModal");

      return;
    }


    const token =
      localStorage.getItem(
        "worldarts_token"
      );


    if (!token) {

      alert(
        "Votre session WorldArts est expirée. Reconnectez-vous avec Pi."
      );

      piUser = null;

      localStorage.removeItem(
        "worldarts_user"
      );

      localStorage.removeItem(
        "worldarts_token"
      );

      updateLoginButton();

      openModal("loginModal");

      return;
    }


    try {

      initPiSdk();


      await window.Pi.createPayment(
        {
          amount: amount,

          memo: memo,

          metadata: {
            artworkId: artworkId
          }
        },

        {

          onReadyForServerApproval:
            async function (paymentId) {

              console.log(
                "Payment ready for approval:",
                paymentId
              );


              const response =
                await fetch(
                  API_URL +
                    "/api/payments/approve",
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",

                      Authorization:
                        "Bearer " + token
                    },

                    body: JSON.stringify({
                      paymentId:
                        paymentId
                    })
                  }
                );


              if (!response.ok) {

                let errorData = {};

                try {
                  errorData =
                    await response.json();
                } catch (_) {}

                throw new Error(
                  errorData.error ||
                    "Le backend n'a pas approuvé le paiement."
                );
              }


              console.log(
                "Payment approved:",
                paymentId
              );
            },


          onReadyForServerCompletion:
            async function (
              paymentId,
              txid
            ) {

              console.log(
                "Payment ready for completion:",
                paymentId,
                txid
              );


              const response =
                await fetch(
                  API_URL +
                    "/api/payments/complete",
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",

                      Authorization:
                        "Bearer " + token
                    },

                    body: JSON.stringify({
                      paymentId:
                        paymentId,

                      txid:
                        txid
                    })
                  }
                );


              if (!response.ok) {

                let errorData = {};

                try {
                  errorData =
                    await response.json();
                } catch (_) {}

                throw new Error(
                  errorData.error ||
                    "Le backend n'a pas finalisé le paiement."
                );
              }


              closeModal(
                "paymentModal"
              );


              alert(
                "Paiement effectué avec succès. Merci pour votre achat !"
              );


              console.log(
                "Payment completed:",
                paymentId,
                txid
              );
            },


          onCancel:
            function (paymentId) {

              console.log(
                "Paiement annulé :",
                paymentId
              );

              closeModal(
                "paymentModal"
              );
            },


          onError:
            function (
              error,
              payment
            ) {

              console.error(
                "Erreur de paiement Pi :",
                error,
                payment
              );


              alert(
                "Une erreur est survenue pendant le paiement Pi."
              );
            }
        }
      );


    } catch (error) {

      console.error(
        "Payment initiation error:",
        error
      );


      alert(
        "Impossible de lancer le paiement : " +
          (
            error &&
            error.message
              ? error.message
              : "Erreur inconnue."
          )
      );
    }
  }


  /* ==========================================================
     15. PAIEMENT INCOMPLET
     ========================================================== */

  async function onIncompletePaymentFound(
    payment
  ) {

    console.log(
      "Paiement incomplet détecté :",
      payment
    );


    const token =
      localStorage.getItem(
        "worldarts_token"
      );


    if (!token) {

      console.warn(
        "Paiement incomplet trouvé mais aucune session WorldArts."
      );

      return;
    }


    if (
      !payment ||
      !payment.identifier
    ) {

      console.warn(
        "Paiement incomplet invalide."
      );

      return;
    }


    try {

      const response =
        await fetch(
          API_URL +
            "/api/payments/complete",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                "Bearer " + token
            },

            body: JSON.stringify({

              paymentId:
                payment.identifier,

              txid:
                payment.transaction &&
                payment.transaction.txid
                  ? payment.transaction.txid
                  : null

            })
          }
        );


      if (!response.ok) {

        console.error(
          "Impossible de finaliser le paiement incomplet."
        );

        return;
      }


      console.log(
        "Paiement incomplet finalisé."
      );


    } catch (error) {

      console.error(
        "Erreur paiement incomplet:",
        error
      );
    }
  }


  /* ==========================================================
     16. RESTAURATION DE SESSION
     ========================================================== */

  function restoreSession() {

    const savedUser =
      localStorage.getItem(
        "worldarts_user"
      );

    const savedToken =
      localStorage.getItem(
        "worldarts_token"
      );


    if (
      !savedUser ||
      !savedToken
    ) {

      piUser = null;

      return;
    }


    try {

      const user =
        JSON.parse(savedUser);


      if (
        !user ||
        typeof user !== "object"
      ) {

        throw new Error(
          "Session utilisateur invalide."
        );
      }


      piUser = user;


      updateLoginButton();


      console.log(
        "WorldArts session restored:",
        piUser
      );


    } catch (error) {

      console.warn(
        "Impossible de restaurer la session WorldArts.",
        error
      );


      piUser = null;


      localStorage.removeItem(
        "worldarts_user"
      );

      localStorage.removeItem(
        "worldarts_token"
      );
    }
  }


  /* ==========================================================
     17. FORMULAIRE DE CONTACT
     ========================================================== */

  function initContactForm() {

    const form =
      document.getElementById(
        "contactForm"
      );

    const status =
      document.getElementById(
        "contactStatus"
      );


    if (!form) return;


    form.addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();


        const formData =
          new FormData(form);


        const payload = {

          name:
            formData.get("name"),

          email:
            formData.get("email"),

          message:
            formData.get("message")
        };


        const submitBtn =
          form.querySelector(
            "button[type='submit']"
          );


        if (submitBtn) {

          submitBtn.disabled = true;

        }


        try {

          const response =
            await fetch(
              API_URL +
                "/api/contact",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json"
                },

                body:
                  JSON.stringify(
                    payload
                  )
              }
            );


          if (!response.ok) {

            throw new Error(
              "Envoi impossible."
            );
          }


          form.reset();


          if (status) {

            status.style.display =
              "block";

            status.textContent =
              (
                translations[
                  currentLang
                ] ||
                translations.fr
              )["contact.form.sent"] ||
              "Message envoyé.";

          }


        } catch (error) {

          console.error(
            "Contact form error:",
            error
          );


          if (status) {

            status.style.display =
              "block";

            status.textContent =
              "Erreur : votre message n'a pas pu être envoyé. Réessayez plus tard.";
          }


        } finally {

          if (submitBtn) {

            submitBtn.disabled = false;

          }
        }

      }
    );
  }

})();

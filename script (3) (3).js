/* ==========================================================
   WorldArts — script.js
   Thème clair/sombre, i18n, menu mobile, intégration Pi SDK
   ========================================================== */

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------------------------------------------------------
   1. Thème clair / sombre
   --------------------------------------------------------- */
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("worldarts-theme", theme);
}

(function initTheme() {
  const saved = localStorage.getItem("worldarts-theme");
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }
})();

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

/* ---------------------------------------------------------
   2. Menu mobile
   --------------------------------------------------------- */
const navBurger = document.getElementById("navBurger");
const mainNav = document.querySelector(".main-nav");

navBurger.addEventListener("click", () => {
  const expanded = navBurger.getAttribute("aria-expanded") === "true";
  navBurger.setAttribute("aria-expanded", String(!expanded));
  mainNav.classList.toggle("open");
});

/* ---------------------------------------------------------
   3. Internationalisation (Kirundi, Français, English,
      Kiswahili, العربية, 中文)
   --------------------------------------------------------- */
const translations = {
  fr: {
    "nav.home": "Accueil", "nav.gallery": "Galerie", "nav.artists": "Artistes",
    "nav.marketplace": "Marché", "nav.about": "À propos", "nav.contact": "Contact",
    "nav.connectPi": "Connexion avec Pi",
    "hero.eyebrow": "Marché d'art mondial · Pi & WART",
    "hero.title": "L'art du monde,<br>une monnaie pour tous.",
    "hero.desc": "WorldArts réunit artistes et collectionneurs de tous les continents autour d'une seule galerie. Découvrez des œuvres uniques, échangez en toute confiance, et payez exclusivement en Pi ou en jeton WART.",
    "hero.ctaPrimary": "Connect with Pi", "hero.ctaSecondary": "Explorer la galerie",
    "features.eyebrow": "Quatre portes d'entrée dans WorldArts",
    "features.title": "Une seule galerie, tout un monde",
    "features.art.title": "Discover Art", "features.art.desc": "Peintures, sculptures et arts visuels d'artistes indépendants sur les six continents.",
    "features.music.title": "Discover Music", "features.music.desc": "Compositions originales et enregistrements exclusifs, directement soutenus par leurs auteurs.",
    "features.video.title": "Discover Videos", "features.video.desc": "Films courts, performances et documentaires d'art à la découverte de nouvelles voix.",
    "features.buy.title": "Buy & Sell with Pi", "features.buy.desc": "Achetez et vendez en toute sécurité, réglé uniquement en Pi Network ou en jeton WART.",
    "about.eyebrow": "Artistes vérifiés",
    "about.title": "Chaque œuvre a un visage, chaque artiste a une voix.",
    "about.desc": "WorldArts vérifie chaque profil d'artiste pour garantir l'authenticité des œuvres et la confiance des collectionneurs, du premier échange jusqu'au paiement final.",
    "about.cta": "Voir le marché",
    "about.stat1": "pays représentés", "about.stat2": "langues disponibles", "about.stat3": "monnaies acceptées",
    "cta.title": "Prêt à échanger en Pi ?",
    "cta.desc": "Connectez votre portefeuille Pi Network pour publier, acheter ou vendre une œuvre dès aujourd'hui.",
    "footer.tagline": "Le marché mondial de l'art, payé en Pi et WART.",
    "footer.explore": "Explorer", "footer.contact": "Contact", "footer.currencies": "Paiements",
    "footer.rights": "Tous droits réservés."
  },
  en: {
    "nav.home": "Home", "nav.gallery": "Gallery", "nav.artists": "Artists",
    "nav.marketplace": "Marketplace", "nav.about": "About", "nav.contact": "Contact",
    "nav.connectPi": "Connect with Pi",
    "hero.eyebrow": "The world's art market · Pi & WART",
    "hero.title": "Art from every nation,<br>one currency for all.",
    "hero.desc": "WorldArts brings artists and collectors from every continent into a single gallery. Discover one-of-a-kind pieces, trade with confidence, and pay exclusively in Pi or WART tokens.",
    "hero.ctaPrimary": "Connect with Pi", "hero.ctaSecondary": "Explore the gallery",
    "features.eyebrow": "Four doorways into WorldArts",
    "features.title": "One gallery, a whole world",
    "features.art.title": "Discover Art", "features.art.desc": "Paintings, sculpture and visual art from independent artists across six continents.",
    "features.music.title": "Discover Music", "features.music.desc": "Original compositions and exclusive recordings, backed directly by their creators.",
    "features.video.title": "Discover Videos", "features.video.desc": "Short films, performances and art documentaries spotlighting new voices.",
    "features.buy.title": "Buy & Sell with Pi", "features.buy.desc": "Buy and sell with confidence, settled only in Pi Network or WART tokens.",
    "about.eyebrow": "Verified artists",
    "about.title": "Every piece has a face, every artist has a voice.",
    "about.desc": "WorldArts verifies every artist profile to guarantee authenticity and collector trust, from first contact through final payment.",
    "about.cta": "View the marketplace",
    "about.stat1": "countries represented", "about.stat2": "languages available", "about.stat3": "currencies accepted",
    "cta.title": "Ready to trade in Pi?",
    "cta.desc": "Connect your Pi Network wallet to list, buy or sell artwork today.",
    "footer.tagline": "The world's art market, paid in Pi and WART.",
    "footer.explore": "Explore", "footer.contact": "Contact", "footer.currencies": "Payments",
    "footer.rights": "All rights reserved."
  },
  sw: {
    "nav.home": "Nyumbani", "nav.gallery": "Ghala la Sanaa", "nav.artists": "Wasanii",
    "nav.marketplace": "Soko", "nav.about": "Kuhusu", "nav.contact": "Wasiliana",
    "nav.connectPi": "Ungana na Pi",
    "hero.eyebrow": "Soko la sanaa la dunia · Pi na WART",
    "hero.title": "Sanaa ya dunia nzima,<br>sarafu moja kwa wote.",
    "hero.desc": "WorldArts inaunganisha wasanii na wakusanyaji kutoka mabara yote katika ghala moja. Gundua kazi za kipekee, fanya biashara kwa uhakika, na lipa kwa Pi au WART pekee.",
    "hero.ctaPrimary": "Connect with Pi", "hero.ctaSecondary": "Chunguza ghala",
    "features.eyebrow": "Njia nne za kuingia WorldArts",
    "features.title": "Ghala moja, dunia nzima",
    "features.art.title": "Discover Art", "features.art.desc": "Michoro, sanamu na sanaa za kuona kutoka kwa wasanii huru katika mabara sita.",
    "features.music.title": "Discover Music", "features.music.desc": "Tungo asili na rekodi za kipekee, zinazoungwa mkono moja kwa moja na watunzi wao.",
    "features.video.title": "Discover Videos", "features.video.desc": "Filamu fupi, maonyesho na hali halisi za sanaa zinazoangazia sauti mpya.",
    "features.buy.title": "Buy & Sell with Pi", "features.buy.desc": "Nunua na uuze kwa uhakika, malipo kwa Pi Network au WART pekee.",
    "about.eyebrow": "Wasanii waliothibitishwa",
    "about.title": "Kila kazi ina uso, kila msanii ana sauti.",
    "about.desc": "WorldArts inathibitisha kila wasifu wa msanii ili kuhakikisha uhalisi wa kazi na imani ya wakusanyaji, tangu mawasiliano ya kwanza hadi malipo ya mwisho.",
    "about.cta": "Tazama soko",
    "about.stat1": "nchi zinazowakilishwa", "about.stat2": "lugha zinazopatikana", "about.stat3": "sarafu zinazokubaliwa",
    "cta.title": "Uko tayari kufanya biashara kwa Pi?",
    "cta.desc": "Unganisha mkoba wako wa Pi Network kuorodhesha, kununua au kuuza kazi ya sanaa leo.",
    "footer.tagline": "Soko la sanaa la dunia, linalolipwa kwa Pi na WART.",
    "footer.explore": "Chunguza", "footer.contact": "Wasiliana", "footer.currencies": "Malipo",
    "footer.rights": "Haki zote zimehifadhiwa."
  },
  rn: {
    "nav.home": "Ahabanza", "nav.gallery": "Ingoro y'Ubuhanzi", "nav.artists": "Abahanzi",
    "nav.marketplace": "Isoko", "nav.about": "Ivyerekeye", "nav.contact": "Twandikire",
    "nav.connectPi": "Wifatanye na Pi",
    "hero.eyebrow": "Isoko ry'ubuhanzi mpuzamakungu · Pi na WART",
    "hero.title": "Ubuhanzi bw'isi yose,<br>ifaranga rimwe kuri bose.",
    "hero.desc": "WorldArts ihuza abahanzi n'abakusanya ibihangano bo mu mugabane wose mu ngoro imwe. Rondera ibihangano bidasanzwe, ukorane mu bwizigirwa, wishure gusa muri Pi cyangwa WART.",
    "hero.ctaPrimary": "Connect with Pi", "hero.ctaSecondary": "Reba ingoro",
    "features.eyebrow": "Inzira zine zo kwinjira muri WorldArts",
    "features.title": "Ingoro imwe, isi yose",
    "features.art.title": "Discover Art", "features.art.desc": "Amashusho, ibishushanyo n'ubuhanzi bugaragara bw'abahanzi baserukira mu mugabane batandatu.",
    "features.music.title": "Discover Music", "features.music.desc": "Indirimbo nshasha n'ibirimbuzo bidasanzwe, bishigikiwe n'abavyanditse ubwabo.",
    "features.video.title": "Discover Videos", "features.video.desc": "Amashusho magufi, imikino n'ivyanditswe by'ubuhanzi bigaragaza amajwi mashasha.",
    "features.buy.title": "Buy & Sell with Pi", "features.buy.desc": "Gura kandi ugurishe mu bwizigirwa, wishure gusa muri Pi Network cyangwa WART.",
    "about.eyebrow": "Abahanzi bemejwe",
    "about.title": "Igihangano cose kirafise mu maso, umuhanzi wese afise ijwi.",
    "about.desc": "WorldArts irakwega umwidondoro wa buri muhanzi kugira ngo yemeze ukuri kw'ibihangano n'ikizigira c'abakusanya, guhera ku mubano wa mbere kugeza ku kwishura kwa nyuma.",
    "about.cta": "Reba isoko",
    "about.stat1": "ibihugu birepresenta", "about.stat2": "indimi zihari", "about.stat3": "amafaranga yemewe",
    "cta.title": "Witeguriye gukorana muri Pi?",
    "cta.desc": "Fatanya n'umufuka wawe wa Pi Network kugira ngo washire, ugure canke ugurishe igihangano uyu munsi.",
    "footer.tagline": "Isoko ry'ubuhanzi mpuzamakungu, ryishurwa muri Pi na WART.",
    "footer.explore": "Reba", "footer.contact": "Twandikire", "footer.currencies": "Kwishura",
    "footer.rights": "Uburenganzira bwose burarinzwe."
  },
  ar: {
    "nav.home": "الرئيسية", "nav.gallery": "المعرض", "nav.artists": "الفنانون",
    "nav.marketplace": "السوق", "nav.about": "حول", "nav.contact": "تواصل",
    "nav.connectPi": "الاتصال عبر Pi",
    "hero.eyebrow": "سوق الفن العالمي · Pi و WART",
    "hero.title": "فن من كل العالم،<br>عملة واحدة للجميع.",
    "hero.desc": "يجمع WorldArts الفنانين وهواة الاقتناء من كل القارات في معرض واحد. اكتشف أعمالاً فريدة، تبادل بثقة، وادفع حصراً بعملة Pi أو رمز WART.",
    "hero.ctaPrimary": "Connect with Pi", "hero.ctaSecondary": "استكشف المعرض",
    "features.eyebrow": "أربعة أبواب لدخول WorldArts",
    "features.title": "معرض واحد، عالم بأكمله",
    "features.art.title": "Discover Art", "features.art.desc": "لوحات ومنحوتات وفنون بصرية من فنانين مستقلين حول القارات الست.",
    "features.music.title": "Discover Music", "features.music.desc": "مؤلفات أصلية وتسجيلات حصرية، مدعومة مباشرة من مبدعيها.",
    "features.video.title": "Discover Videos", "features.video.desc": "أفلام قصيرة وعروض ووثائقيات فنية تسلط الضوء على أصوات جديدة.",
    "features.buy.title": "Buy & Sell with Pi", "features.buy.desc": "اشترِ وبِع بثقة، مع تسوية حصرية عبر Pi Network أو رمز WART.",
    "about.eyebrow": "فنانون موثّقون",
    "about.title": "لكل عمل وجه، ولكل فنان صوت.",
    "about.desc": "يتحقق WorldArts من كل ملف فنان لضمان أصالة الأعمال وثقة هواة الاقتناء، من أول تواصل حتى الدفع النهائي.",
    "about.cta": "عرض السوق",
    "about.stat1": "دولة ممثَّلة", "about.stat2": "لغات متاحة", "about.stat3": "عملات مقبولة",
    "cta.title": "مستعد للتداول بعملة Pi؟",
    "cta.desc": "اربط محفظة Pi Network الخاصة بك لعرض أو شراء أو بيع عمل فني اليوم.",
    "footer.tagline": "سوق الفن العالمي، يُدفع بعملة Pi و WART.",
    "footer.explore": "استكشف", "footer.contact": "تواصل", "footer.currencies": "الدفع",
    "footer.rights": "جميع الحقوق محفوظة."
  },
  zh: {
    "nav.home": "首页", "nav.gallery": "画廊", "nav.artists": "艺术家",
    "nav.marketplace": "市场", "nav.about": "关于", "nav.contact": "联系",
    "nav.connectPi": "连接 Pi",
    "hero.eyebrow": "全球艺术市场 · Pi 与 WART",
    "hero.title": "世界的艺术，<br>人人共用的货币。",
    "hero.desc": "WorldArts 将来自各大洲的艺术家与收藏家汇聚于同一画廊。发现独一无二的作品，安心交易，仅以 Pi 或 WART 代币支付。",
    "hero.ctaPrimary": "Connect with Pi", "hero.ctaSecondary": "探索画廊",
    "features.eyebrow": "进入 WorldArts 的四扇门",
    "features.title": "一间画廊，一个世界",
    "features.art.title": "Discover Art", "features.art.desc": "来自六大洲独立艺术家的绘画、雕塑与视觉艺术。",
    "features.music.title": "Discover Music", "features.music.desc": "原创作品与独家录音，由创作者本人直接支持。",
    "features.video.title": "Discover Videos", "features.video.desc": "短片、表演与艺术纪录片，展现新兴声音。",
    "features.buy.title": "Buy & Sell with Pi", "features.buy.desc": "安心买卖，仅通过 Pi Network 或 WART 代币结算。",
    "about.eyebrow": "已验证艺术家",
    "about.title": "每件作品都有面孔，每位艺术家都有声音。",
    "about.desc": "WorldArts 对每位艺术家的资料进行核实，从首次接触到最终付款，全程保障作品的真实性与收藏家的信任。",
    "about.cta": "查看市场",
    "about.stat1": "个代表国家", "about.stat2": "种可用语言", "about.stat3": "种可用货币",
    "cta.title": "准备好用 Pi 交易了吗？",
    "cta.desc": "立即连接您的 Pi Network 钱包，发布、购买或出售艺术作品。",
    "footer.tagline": "全球艺术市场，以 Pi 与 WART 支付。",
    "footer.explore": "探索", "footer.contact": "联系", "footer.currencies": "支付方式",
    "footer.rights": "版权所有。"
  }
};

const rtlLangs = ["ar"];
const langSelect = document.getElementById("langSelect");

function applyLanguage(lang) {
  const dict = translations[lang] || translations.fr;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.innerHTML = dict[key];
  });
  document.documentElement.lang = lang;
  document.documentElement.dir = rtlLangs.includes(lang) ? "rtl" : "ltr";
  localStorage.setItem("worldarts-lang", lang);
}

(function initLanguage() {
  const saved = localStorage.getItem("worldarts-lang") || "fr";
  langSelect.value = saved;
  applyLanguage(saved);
})();

langSelect.addEventListener("change", e => applyLanguage(e.target.value));

/* ---------------------------------------------------------
   4. Intégration Pi Network SDK
   --------------------------------------------------------- */
const PI_SANDBOX = false; // passer à true pendant les tests Pi Developer Portal
let piUser = null;

function initPiSdk() {
  if (typeof Pi === "undefined") {
    console.warn("Pi SDK indisponible — ouvrez cette page dans le Pi Browser.");
    return false;
  }
  Pi.init({ version: "2.0", sandbox: PI_SANDBOX });
  return true;
}

function onIncompletePaymentFound(payment) {
  console.log("Paiement Pi incomplet détecté :", payment);
  // TODO: transmettre ce paiement au backend (/payments/complete)
}

async function connectWithPi() {
  if (!initPiSdk()) {
    alert("Ouvrez WorldArts dans le Pi Browser pour vous connecter avec Pi.");
    return;
  }
  try {
    const scopes = ["username", "payments", "wallet_address"];
    const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
    piUser = auth.user;
    document.querySelectorAll("#piConnectBtn span, #heroConnectPi, #ctaConnectPi")
      .forEach(el => { el.textContent = `@${piUser.username}`; });
    console.log("Connecté à Pi Network :", piUser);
  } catch (err) {
    console.error("Échec de la connexion Pi :", err);
    alert("La connexion avec Pi a échoué. Réessayez depuis le Pi Browser.");
  }
}

/**
 * Crée un paiement Pi pour une œuvre du marché.
 * amount en Pi, memo = description courte, metadata = données internes (ex. id de l'œuvre).
 */
function createPiPayment(amount, memo, metadata) {
  if (typeof Pi === "undefined") {
    alert("Le paiement Pi requiert le Pi Browser.");
    return;
  }
  Pi.createPayment(
    { amount, memo, metadata },
    {
      onReadyForServerApproval: paymentId => {
        // TODO: POST /payments/approve { paymentId } vers le backend
        console.log("Prêt pour approbation serveur :", paymentId);
      },
      onReadyForServerCompletion: (paymentId, txid) => {
        // TODO: POST /payments/complete { paymentId, txid } vers le backend
        console.log("Prêt pour complétion serveur :", paymentId, txid);
      },
      onCancel: paymentId => console.log("Paiement annulé :", paymentId),
      onError: (error, payment) => console.error("Erreur de paiement Pi :", error, payment)
    }
  );
}

["piConnectBtn", "heroConnectPi", "ctaConnectPi"].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", connectWithPi);
});

// Initialise le SDK dès que possible (silencieux si hors Pi Browser)
window.addEventListener("load", initPiSdk);

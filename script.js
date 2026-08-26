/* ==========================================================================
   WorldArts — script.js
   Version améliorée
   i18n (6 langues) · thème · menu mobile · Pi SDK · galerie · contact
   Paiement Pi prêt pour backend · gestion d'erreurs · reveal au scroll
   ========================================================================== */

(function () {
  "use strict";

  const API_BASE = String(
    window.WORLDARTS_API_BASE || "https://worldarts-backend.onrender.com/api"
  ).replace(/\/$/, "");

  const translations = {
    fr: {
      "nav.home":"Accueil","nav.gallery":"Galerie","nav.artists":"Artistes","nav.marketplace":"Marché","nav.about":"À propos","nav.contact":"Contact","nav.connect":"Se connecter avec Pi",
      "hero.eyebrow":"Marché d'art mondial","hero.title":"Découvrez, collectionnez et vendez de l'art <em>partout dans le monde</em>","hero.subtitle":"WorldArts réunit artistes et collectionneurs autour d'œuvres, de musique et de vidéos, avec des paiements en Pi Network et en WART.","hero.connect":"Se connecter avec Pi","hero.explore":"Explorer la galerie","hero.note":"Paiements exclusivement en π (Pi) et WART — aucun dollar, aucun USDT",
      "features.eyebrow":"Ce que vous pouvez faire","features.title":"Une seule application, tout l'art du monde","features.art.title":"Découvrir l'art","features.art.text":"Parcourez des œuvres originales issues d'artistes du monde entier.","features.music.title":"Découvrir la musique","features.music.text":"Écoutez et soutenez des créateurs musicaux indépendants.","features.videos.title":"Découvrir les vidéos","features.videos.text":"Explorez des créations vidéo et des performances.","features.pi.title":"Acheter & vendre avec Pi","features.pi.text":"Réalisez vos transactions avec Pi Network ou WART.",
      "steps.eyebrow":"Étapes","steps.title":"Comment fonctionne WorldArts","steps.one.title":"Créer un profil","steps.one.text":"Inscrivez-vous comme artiste ou collectionneur.","steps.two.title":"Connecter son portefeuille Pi","steps.two.text":"Authentifiez-vous avec le Pi SDK.","steps.three.title":"Publier ou parcourir","steps.three.text":"Mettez une œuvre en vente ou parcourez la galerie.","steps.four.title":"Payer en Pi ou WART","steps.four.text":"Concluez la transaction en toute sécurité.",
      "gallery.eyebrow":"Sélection","gallery.title":"Le mur de la galerie","artists.eyebrow":"Communauté","artists.title":"Artistes à l'honneur",
      "payment.eyebrow":"Paiements","payment.title":"Une monnaie pour un art sans frontières","payment.text":"Les paiements WorldArts utilisent Pi Network ou WART.","payment.pi.desc":"paiement natif via le Pi SDK","payment.wart.desc":"jeton de la place de marché","payment.card.eyebrow":"Exemple d'œuvre","payment.card.title":"Aube sur le lac Tanganyika","payment.card.artist":"par Amara K.","payment.card.buy":"Acheter avec Pi",
      "about.eyebrow":"Notre mission","about.title":"L'art comme langage commun","contact.eyebrow":"Nous écrire","contact.title":"Une question pour l'équipe WorldArts ?","contact.form.name":"Votre nom","contact.form.email":"Votre email","contact.form.message":"Votre message","contact.form.send":"Envoyer le message","contact.form.sent":"Merci, votre message a bien été reçu.",
      "modal.login.title":"Connexion Pi","modal.login.text":"Authentifiez-vous avec votre compte Pi pour accéder à WorldArts.","modal.login.action":"Continuer avec Pi","modal.payment.title":"Confirmer le paiement","modal.payment.text":"Cette œuvre sera payée directement via le Pi SDK.","modal.payment.action":"Payer avec Pi"
    },

    en: {
      "nav.home":"Home","nav.gallery":"Gallery","nav.artists":"Artists","nav.marketplace":"Marketplace","nav.about":"About","nav.contact":"Contact","nav.connect":"Connect with Pi",
      "hero.eyebrow":"Global art marketplace","hero.title":"Discover, collect and sell art <em>anywhere in the world</em>","hero.subtitle":"WorldArts brings artists and collectors together around art, music and video, with Pi Network and WART payments.","hero.connect":"Connect with Pi","hero.explore":"Explore the gallery","hero.note":"Payments exclusively in π (Pi) and WART — no dollars, no USDT",
      "features.eyebrow":"What you can do","features.title":"One app, all the world's art","features.art.title":"Discover art","features.art.text":"Browse original artworks from artists worldwide.","features.music.title":"Discover music","features.music.text":"Listen to and support independent creators.","features.videos.title":"Discover videos","features.videos.text":"Explore video works and performances.","features.pi.title":"Buy & sell with Pi","features.pi.text":"Complete transactions with Pi Network or WART.",
      "steps.eyebrow":"Steps","steps.title":"How WorldArts works","steps.one.title":"Create a profile","steps.one.text":"Sign up as an artist or collector.","steps.two.title":"Connect your Pi wallet","steps.two.text":"Authenticate with the Pi SDK.","steps.three.title":"List or browse","steps.three.text":"List an artwork or browse the gallery.","steps.four.title":"Pay in Pi or WART","steps.four.text":"Complete the transaction safely.",
      "gallery.eyebrow":"Selection","gallery.title":"The gallery wall","artists.eyebrow":"Community","artists.title":"Featured artists",
      "payment.eyebrow":"Payments","payment.title":"One currency for borderless art","payment.text":"WorldArts payments use Pi Network or WART.","payment.pi.desc":"native payment via the Pi SDK","payment.wart.desc":"marketplace token","payment.card.eyebrow":"Sample artwork","payment.card.title":"Dawn over Lake Tanganyika","payment.card.artist":"by Amara K.","payment.card.buy":"Buy with Pi",
      "about.eyebrow":"Our mission","about.title":"Art as a common language","contact.eyebrow":"Get in touch","contact.title":"A question for the WorldArts team?","contact.form.name":"Your name","contact.form.email":"Your email","contact.form.message":"Your message","contact.form.send":"Send message","contact.form.sent":"Thanks, your message was received.",
      "modal.login.title":"Pi login","modal.login.text":"Authenticate with your Pi account to access WorldArts.","modal.login.action":"Continue with Pi","modal.payment.title":"Confirm payment","modal.payment.text":"This artwork will be paid directly through the Pi SDK.","modal.payment.action":"Pay with Pi"
    },

    rn: {
      "nav.home":"Ku ntango","nav.gallery":"Ikaze ry'ubuhanzi","nav.artists":"Abahanzi","nav.marketplace":"Isoko","nav.about":"Ivyerekeye","nav.contact":"Twandikire","nav.connect":"Injira na Pi",
      "hero.eyebrow":"Isoko mpuzamakungu ry'ubuhanzi","hero.title":"Rondera, egeranya kandi ugurishe ubuhanzi <em>hose kw'isi</em>","hero.subtitle":"WorldArts ihuza abahanzi n'abakusanya ibihangano, umuziki n'amashusho, bishurwa muri Pi Network na WART.","hero.connect":"Injira na Pi","hero.explore":"Raba ikaze ry'ubuhanzi","hero.note":"Kwishura gusa muri π (Pi) na WART — nta dolari canke USDT",
      "features.eyebrow":"Ivyo ushobora gukora","features.title":"Porogarama imwe, ubuhanzi bwose bw'isi","features.art.title":"Rondera ubuhanzi","features.art.text":"Raba ibihangano biva ku bahanzi bo hirya no hino kw'isi.","features.music.title":"Rondera umuziki","features.music.text":"Umva kandi ushigikire abahanzi b'umuziki.","features.videos.title":"Rondera amashusho","features.videos.text":"Raba ibihangano vy'amashusho.","features.pi.title":"Gura no kugurisha na Pi","features.pi.text":"Kora ibikorwa vyawe ukoresheje Pi Network canke WART.",
      "steps.eyebrow":"Intambwe","steps.title":"Ingene WorldArts ikora","steps.one.title":"Rema umwidondoro","steps.one.text":"Iyandikishe nk'umuhanzi canke umukusanya.","steps.two.title":"Huza umufuko wa Pi","steps.two.text":"Wiyemeze ukoresheje Pi SDK.","steps.three.title":"Shira canke urabe","steps.three.text":"Shira igihangano canke urabe ikaze.","steps.four.title":"Ishura muri Pi canke WART","steps.four.text":"Rangiza igikorwa mu mutekano.",
      "gallery.eyebrow":"Amatora","gallery.title":"Uruzitiro rw'ikaze","artists.eyebrow":"Umuryango","artists.title":"Abahanzi bahawe icubahiro",
      "payment.eyebrow":"Kwishura","payment.title":"Ifaranga rimwe ku buhanzi butagira imbibe","payment.text":"Kwishura muri WorldArts bikorwa muri Pi Network canke WART.","payment.pi.desc":"kwishura biciye muri Pi SDK","payment.wart.desc":"tokeni y'isoko","payment.card.eyebrow":"Akarorero k'igihangano","payment.card.title":"Umuseke ku kiyaga Tanganyika","payment.card.artist":"na Amara K.","payment.card.buy":"Gura na Pi",
      "about.eyebrow":"Intumbero yacu","about.title":"Ubuhanzi nk'ururimi rusanzwe","contact.eyebrow":"Twandikire","contact.title":"Ikibazo ku bakozi ba WorldArts?","contact.form.name":"Izina ryawe","contact.form.email":"Imeyili yawe","contact.form.message":"Ubutumwa bwawe","contact.form.send":"Rungika ubutumwa","contact.form.sent":"Urakoze, ubutumwa bwawe bwakiriwe.",
      "modal.login.title":"Kwinjira na Pi","modal.login.text":"Wiyemeze ukoresheje konti yawe ya Pi kugira ngo ukoreshe WorldArts.","modal.login.action":"Komeza na Pi","modal.payment.title":"Emeza kwishura","modal.payment.text":"Iki gihangano kizishurwa biciye muri Pi SDK.","modal.payment.action":"Ishura na Pi"
    },

    sw: {
      "nav.home":"Nyumbani","nav.gallery":"Ghala la Sanaa","nav.artists":"Wasanii","nav.marketplace":"Soko","nav.about":"Kuhusu","nav.contact":"Wasiliana","nav.connect":"Ungana na Pi",
      "hero.eyebrow":"Soko la sanaa la kimataifa","hero.title":"Gundua, kusanya na uuze sanaa <em>popote duniani</em>","hero.subtitle":"WorldArts inaunganisha wasanii na wakusanyaji kwa Pi Network na WART.","hero.connect":"Ungana na Pi","hero.explore":"Chunguza ghala","hero.note":"Malipo pekee kwa π (Pi) na WART — hakuna dola wala USDT",
      "features.eyebrow":"Unachoweza kufanya","features.title":"Programu moja, sanaa yote ya dunia","features.art.title":"Gundua sanaa","features.art.text":"Vinjari kazi za wasanii duniani kote.","features.music.title":"Gundua muziki","features.music.text":"Sikiliza na uwaunge mkono wasanii.","features.videos.title":"Gundua video","features.videos.text":"Chunguza kazi za video.","features.pi.title":"Nunua na uuze kwa Pi","features.pi.text":"Kamilisha miamala kwa Pi Network au WART.",
      "steps.eyebrow":"Hatua","steps.title":"Jinsi WorldArts inavyofanya kazi","steps.one.title":"Unda wasifu","steps.one.text":"Jisajili kama msanii au mkusanyaji.","steps.two.title":"Unganisha pochi ya Pi","steps.two.text":"Thibitisha kwa Pi SDK.","steps.three.title":"Orodhesha au vinjari","steps.three.text":"Weka kazi kwa mauzo au vinjari.","steps.four.title":"Lipa kwa Pi au WART","steps.four.text":"Kamilisha muamala kwa usalama.",
      "gallery.eyebrow":"Uteuzi","gallery.title":"Ukuta wa ghala","artists.eyebrow":"Jamii","artists.title":"Wasanii wanaoangaziwa",
      "payment.eyebrow":"Malipo","payment.title":"Sarafu moja kwa sanaa isiyo na mipaka","payment.text":"Malipo ya WorldArts hutumia Pi Network au WART.","payment.pi.desc":"malipo kupitia Pi SDK","payment.wart.desc":"tokeni ya soko","payment.card.eyebrow":"Mfano wa kazi","payment.card.title":"Alfajiri juu ya Ziwa Tanganyika","payment.card.artist":"na Amara K.","payment.card.buy":"Nunua kwa Pi",
      "about.eyebrow":"Dhamira yetu","about.title":"Sanaa kama lugha ya pamoja","contact.eyebrow":"Wasiliana nasi","contact.title":"Una swali kwa timu ya WorldArts?","contact.form.name":"Jina lako","contact.form.email":"Barua pepe yako","contact.form.message":"Ujumbe wako","contact.form.send":"Tuma ujumbe","contact.form.sent":"Asante, ujumbe wako umepokelewa.",
      "modal.login.title":"Kuingia na Pi","modal.login.text":"Thibitisha kwa akaunti yako ya Pi.","modal.login.action":"Endelea na Pi","modal.payment.title":"Thibitisha malipo","modal.payment.text":"Kazi hii italipwa kupitia Pi SDK.","modal.payment.action":"Lipa kwa Pi"
    },

    ar: {
      "nav.home":"الرئيسية","nav.gallery":"المعرض","nav.artists":"الفنانون","nav.marketplace":"السوق","nav.about":"من نحن","nav.contact":"تواصل معنا","nav.connect":"الاتصال عبر Pi",
      "hero.eyebrow":"سوق الفن العالمي","hero.title":"اكتشف واقتنِ وبِع الفن <em>في أي مكان بالعالم</em>","hero.subtitle":"تجمع WorldArts بين الفنانين وجامعي الأعمال مع الدفع عبر Pi Network وWART.","hero.connect":"الاتصال عبر Pi","hero.explore":"استكشف المعرض","hero.note":"الدفع حصريًا بعملة Pi وWART — لا دولار ولا USDT",
      "features.eyebrow":"ما يمكنك فعله","features.title":"تطبيق واحد، كل فن العالم","features.art.title":"اكتشف الفن","features.art.text":"تصفح أعمال الفنانين حول العالم.","features.music.title":"اكتشف الموسيقى","features.music.text":"استمع وادعم المبدعين.","features.videos.title":"اكتشف الفيديوهات","features.videos.text":"استكشف أعمال الفيديو.","features.pi.title":"الشراء والبيع عبر Pi","features.pi.text":"أتمم المعاملات عبر Pi أو WART.",
      "steps.eyebrow":"الخطوات","steps.title":"كيف تعمل WorldArts","steps.one.title":"إنشاء ملف شخصي","steps.one.text":"سجّل كفنان أو جامع أعمال.","steps.two.title":"ربط محفظة Pi","steps.two.text":"وثّق حسابك عبر Pi SDK.","steps.three.title":"النشر أو التصفح","steps.three.text":"اعرض عملاً للبيع أو تصفح المعرض.","steps.four.title":"الدفع بـ Pi أو WART","steps.four.text":"أتمم الصفقة بأمان.",
      "gallery.eyebrow":"مختارات","gallery.title":"جدار المعرض","artists.eyebrow":"المجتمع","artists.title":"فنانون مميزون",
      "payment.eyebrow":"المدفوعات","payment.title":"عملة واحدة لفن بلا حدود","payment.text":"مدفوعات WorldArts عبر Pi Network أو WART.","payment.pi.desc":"دفع عبر Pi SDK","payment.wart.desc":"عملة السوق","payment.card.eyebrow":"نموذج عمل","payment.card.title":"فجر على بحيرة تنجانيقا","payment.card.artist":"بواسطة أمارا ك.","payment.card.buy":"الشراء عبر Pi",
      "about.eyebrow":"مهمتنا","about.title":"الفن كلغة مشتركة","contact.eyebrow":"راسلنا","contact.title":"سؤال لفريق WorldArts؟","contact.form.name":"اسمك","contact.form.email":"بريدك الإلكتروني","contact.form.message":"رسالتك","contact.form.send":"إرسال الرسالة","contact.form.sent":"شكرًا، تم استلام رسالتك.",
      "modal.login.title":"تسجيل الدخول عبر Pi","modal.login.text":"وثّق حسابك عبر Pi.","modal.login.action":"المتابعة عبر Pi","modal.payment.title":"تأكيد الدفع","modal.payment.text":"سيُدفع ثمن هذا العمل عبر Pi SDK.","modal.payment.action":"الدفع عبر Pi"
    },

    zh: {
      "nav.home":"首页","nav.gallery":"画廊","nav.artists":"艺术家","nav.marketplace":"市场","nav.about":"关于我们","nav.contact":"联系我们","nav.connect":"使用 Pi 连接",
      "hero.eyebrow":"全球艺术市场","hero.title":"在<em>世界任何角落</em>发现、收藏与出售艺术品","hero.subtitle":"WorldArts 连接艺术家与收藏家，支持 Pi Network 和 WART 支付。","hero.connect":"使用 Pi 连接","hero.explore":"浏览画廊","hero.note":"仅支持 Pi 与 WART — 不支持美元或 USDT",
      "features.eyebrow":"您可以做什么","features.title":"一个应用，汇聚世界艺术","features.art.title":"发现艺术","features.art.text":"浏览来自全球艺术家的作品。","features.music.title":"发现音乐","features.music.text":"聆听并支持创作者。","features.videos.title":"发现视频","features.videos.text":"探索视频作品。","features.pi.title":"使用 Pi 买卖","features.pi.text":"通过 Pi 或 WART 完成交易。",
      "steps.eyebrow":"步骤","steps.title":"WorldArts 如何运作","steps.one.title":"创建个人资料","steps.one.text":"注册为艺术家或收藏家。","steps.two.title":"连接 Pi 钱包","steps.two.text":"通过 Pi SDK 完成认证。","steps.three.title":"上架或浏览","steps.three.text":"上架作品或浏览画廊。","steps.four.title":"使用 Pi 或 WART 支付","steps.four.text":"安全完成交易。",
      "gallery.eyebrow":"精选","gallery.title":"画廊墙","artists.eyebrow":"社区","artists.title":"精选艺术家",
      "payment.eyebrow":"支付","payment.title":"无国界艺术的统一货币","payment.text":"WorldArts 使用 Pi Network 或 WART 支付。","payment.pi.desc":"通过 Pi SDK 支付","payment.wart.desc":"市场代币","payment.card.eyebrow":"作品示例","payment.card.title":"坦噶尼喀湖的黎明","payment.card.artist":"作者：Amara K.","payment.card.buy":"使用 Pi 购买",
      "about.eyebrow":"我们的使命","about.title":"艺术作为共同语言","contact.eyebrow":"联系我们","contact.title":"有问题想问 WorldArts 团队？","contact.form.name":"您的姓名","contact.form.email":"您的邮箱","contact.form.message":"您的留言","contact.form.send":"发送消息","contact.form.sent":"感谢，您的消息已收到。",
      "modal.login.title":"Pi 登录","modal.login.text":"使用您的 Pi 账户认证。","modal.login.action":"使用 Pi 继续","modal.payment.title":"确认付款","modal.payment.text":"该作品将通过 Pi SDK 支付。","modal.payment.action":"使用 Pi 付款"
    }
  };

  const RTL_LANGS = ["ar"];
  let piUser = null;
  let currentPayment = null;
  let piSdkReady = false;

  function $(id) {
    return document.getElementById(id);
  }

  function applyLanguage(lang) {
    const safeLang = translations[lang] ? lang : "fr";
    const dict = translations[safeLang];

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) el.placeholder = dict[key];
    });

    document.documentElement.lang = safeLang;
    document.documentElement.dir = RTL_LANGS.includes(safeLang) ? "rtl" : "ltr";
    localStorage.setItem("worldarts_lang", safeLang);
  }

  function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("worldarts_theme", theme);
  }

  function openModal(id) {
    const el = $(id);
    if (el) el.classList.add("open");
  }

  function closeModal(id) {
    const el = $(id);
    if (el) el.classList.remove("open");
  }

  function notify(message, type) {
    let box = $("worldartsToast");

    if (!box) {
      box = document.createElement("div");
      box.id = "worldartsToast";
      box.setAttribute("role", "status");
      box.style.cssText =
        "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99999;padding:12px 18px;border-radius:10px;background:#171717;color:#fff;max-width:90%;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.25);";
      document.body.appendChild(box);
    }

    box.textContent = message;
    box.style.display = "block";
    clearTimeout(box._timer);
    box._timer = setTimeout(
      () => box.style.display = "none",
      type === "error" ? 5000 : 3000
    );
  }

  function initPiSdk() {
    if (typeof Pi === "undefined") {
      piSdkReady = false;
      console.warn("Pi SDK non chargé. Ouvrez WorldArts dans Pi Browser.");
      return false;
    }

    try {
      Pi.init({
        version: "2.0",
        sandbox: false
      });

      piSdkReady = true;
      return true;
    } catch (e) {
      piSdkReady = false;
      console.error("Pi.init:", e);
      return false;
    }
  }

  function onIncompletePaymentFound(payment) {
    console.warn("Paiement Pi incomplet détecté:", payment);

    notify(
      "Un paiement Pi incomplet a été détecté. Veuillez contacter WorldArts.",
      "error"
    );

    if (API_BASE && payment && payment.identifier) {
      fetch(API_BASE + "/payments/incomplete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          paymentId: payment.identifier,
          payment
        })
      }).catch(() => {});
    }
  }

  async function connectWithPi() {
    if (!piSdkReady && !initPiSdk()) {
      notify("Le Pi SDK est disponible dans Pi Browser.", "error");
      return;
    }

    try {
      const auth = await Pi.authenticate(
        ["username", "payments"],
        onIncompletePaymentFound
      );

      if (!auth || !auth.user) {
        throw new Error("Pi authentication returned no user");
      }

      piUser = auth.user;

      const buttons = [
        $("piConnectBtn"),
        $("heroConnectBtn")
      ].filter(Boolean);

      buttons.forEach(btn => {
        btn.textContent = "@" + (piUser.username || "Pi");
        btn.dataset.connected = "true";
      });

      closeModal("loginModal");
      notify("Connexion Pi réussie.");
    } catch (error) {
      console.error("Échec authentification Pi:", error);
      notify("Connexion Pi annulée ou impossible.", "error");
    }
  }

  async function approvePaymentOnServer(paymentId) {
    if (!API_BASE) {
      throw new Error("Backend WorldArts non configuré");
    }

    const response = await fetch(API_BASE + "/payments/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        paymentId
      })
    });

    if (!response.ok) {
      throw new Error("Server approval failed");
    }

    return true;
  }

  async function completePaymentOnServer(paymentId, txid) {
    if (!API_BASE) {
      throw new Error("Backend WorldArts non configuré");
    }

    const response = await fetch(API_BASE + "/payments/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        paymentId,
        txid
      })
    });

    if (!response.ok) {
      throw new Error("Server completion failed");
    }

    return true;
  }

  function payWithPi(amount, memo, metadata) {
    if (!piSdkReady && !initPiSdk()) {
      notify("Le paiement Pi nécessite Pi Browser.", "error");
      return;
    }

    if (!piUser) {
      closeModal("paymentModal");
      openModal("loginModal");
      notify("Connectez-vous d'abord avec Pi.", "error");
      return;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      notify("Montant Pi invalide.", "error");
      return;
    }

    const cleanMemo = String(memo || "WorldArts")
      .trim()
      .slice(0, 250);

    currentPayment = {
      amount: numericAmount,
      memo: cleanMemo,
      metadata: metadata || {}
    };

    try {
      Pi.createPayment(
        {
          amount: numericAmount,
          memo: cleanMemo,
          metadata: Object.assign(
            {
              app: "WorldArts"
            },
            metadata || {}
          )
        },
        {
          onReadyForServerApproval: async function (paymentId) {
            try {
              await approvePaymentOnServer(paymentId);
            } catch (error) {
              console.error("Approval error:", error);
              notify(
                "Le serveur n'a pas pu approuver le paiement.",
                "error"
              );
            }
          },

          onReadyForServerCompletion: async function (paymentId, txid) {
            try {
              await completePaymentOnServer(paymentId, txid);

              notify("Paiement Pi terminé avec succès.");
            } catch (error) {
              console.error("Completion error:", error);

              notify(
                "Paiement effectué mais confirmation serveur impossible.",
                "error"
              );
            }
          },

          onCancel: function (paymentId) {
            console.log("Paiement annulé:", paymentId);
            notify("Paiement annulé.");
          },

          onError: function (error, payment) {
            console.error("Erreur Pi:", error, payment);

            notify(
              "Une erreur est survenue pendant le paiement Pi.",
              "error"
            );
          }
        }
      );
    } catch (error) {
      console.error("Pi.createPayment:", error);
      notify("Impossible de lancer le paiement Pi.", "error");
    }
  }

  function getCurrentDictionary() {
    const lang = document.documentElement.lang || "fr";
    return translations[lang] || translations.fr;
  }

  async function loadArtworks() {
    if (!API_BASE) return;

    const container =
      document.querySelector("[data-artworks]") ||
      document.querySelector(".gallery-grid") ||
      document.querySelector(".art-grid");

    if (!container) return;

    try {
      const response = await fetch(API_BASE + "/artworks");

      if (!response.ok) {
        throw new Error("Artwork API error");
      }

      const data = await response.json();

      const artworks = Array.isArray(data)
        ? data
        : (Array.isArray(data.artworks) ? data.artworks : []);

      if (!artworks.length) {
        container.innerHTML =
          "<p class=\"empty-state\">Aucune œuvre disponible pour le moment.</p>";
        return;
      }

      container.innerHTML = artworks.map((art) => {
        const title = escapeHtml(
          art.title || "WorldArts"
        );

        const artist = escapeHtml(
          art.artist || art.artistName || ""
        );

        const price = escapeHtml(
          String(art.price ?? "")
        );

        const currencyRaw = String(
          art.currency || "Pi"
        ).trim();

        const currency = escapeHtml(
          currencyRaw
        );

        const image = escapeHtml(
          art.imageUrl || art.image || ""
        );

        const buyButton =
          price &&
          currencyRaw.toLowerCase() === "pi"
            ? `<button type="button" class="btn btn-primary artwork-buy" data-price="${escapeHtml(price)}" data-title="${title}">Buy with Pi</button>`
            : "";

        return `
          <article class="artwork-card reveal">
            ${
              image
                ? `<img src="${image}" alt="${title}" loading="lazy" onerror="this.style.display='none'">`
                : ""
            }

            <div class="artwork-info">
              <h3>${title}</h3>

              ${
                artist
                  ? `<p>${artist}</p>`
                  : ""
              }

              ${
                price
                  ? `<strong>${price} ${currency}</strong>`
                  : ""
              }

              ${buyButton}
            </div>
          </article>
        `;
      }).join("");

      const dict = getCurrentDictionary();

      container
        .querySelectorAll(".artwork-buy")
        .forEach(btn => {
          btn.textContent =
            dict["payment.card.buy"] ||
            dict["modal.payment.action"] ||
            "Buy with Pi";

          btn.addEventListener("click", () => {
            currentPayment = {
              amount: Number(btn.dataset.price),
              memo: "WorldArts — " + btn.dataset.title
            };

            openModal("paymentModal");
          });
        });

    } catch (error) {
      console.warn(
        "Impossible de charger les artworks:",
        error
      );

      container.innerHTML =
        "<p class=\"empty-state\">La galerie est temporairement indisponible. Réessayez plus tard.</p>";
    }
  }

  function payloadFromForm(form) {
    return {
      name:
        form.querySelector('[name="name"]')?.value.trim() || "",

      email:
        form.querySelector('[name="email"]')?.value.trim() || "",

      message:
        form.querySelector('[name="message"]')?.value.trim() || ""
    };
  }

  function escapeHtml(value) {
    return String(value).replace(
      /[&<>"']/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char])
    );
  }

  async function submitContactForm(form) {
    const status = $("contactStatus");

    const submitBtn =
      form.querySelector(
        'button[type="submit"], input[type="submit"]'
      );

    if (!API_BASE) {
      const localMessages = JSON.parse(
        localStorage.getItem(
          "worldarts_contact_messages"
        ) || "[]"
      );

      localMessages.push({
        ...payloadFromForm(form),
        createdAt: new Date().toISOString()
      });

      localStorage.setItem(
        "worldarts_contact_messages",
        JSON.stringify(localMessages)
      );

      if (status) {
        status.style.display = "block";
      }

      form.reset();

      notify(
        "Votre message a été enregistré sur cet appareil."
      );

      return;
    }

    const payload = payloadFromForm(form);

    if (
      !payload.name ||
      !payload.email ||
      !payload.message
    ) {
      notify(
        "Veuillez remplir tous les champs.",
        "error"
      );

      return;
    }

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
      }

      const response = await fetch(
        API_BASE + "/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error(
          "Contact request failed"
        );
      }

      if (status) {
        status.style.display = "block";
      }

      form.reset();

      notify("Message envoyé.");

    } catch (error) {
      console.error(
        "Contact:",
        error
      );

      notify(
        "Impossible d'envoyer le message pour le moment.",
        "error"
      );

    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  }

  let initialized = false;

  function init() {
    if (initialized) return;

    initialized = true;

    const savedTheme =
      localStorage.getItem(
        "worldarts_theme"
      ) ||
      (
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
          ? "dark"
          : "light"
      );

    applyTheme(savedTheme);

    $("themeToggle")?.addEventListener(
      "click",
      () => {
        applyTheme(
          document.body.getAttribute(
            "data-theme"
          ) === "dark"
            ? "light"
            : "dark"
        );
      }
    );

    const savedLang =
      translations[
        localStorage.getItem(
          "worldarts_lang"
        )
      ]
        ? localStorage.getItem(
            "worldarts_lang"
          )
        : "fr";

    const langSelect =
      $("langSelect");

    if (langSelect) {
      langSelect.value = savedLang;

      applyLanguage(
        savedLang
      );

      langSelect.addEventListener(
        "change",
        e =>
          applyLanguage(
            e.target.value
          )
      );

    } else {
      applyLanguage(
        savedLang
      );
    }

    const menuToggle =
      $("menuToggle") ||
      $("navBurger");

    const navLinks =
      $("navLinks");

    menuToggle?.addEventListener(
      "click",
      () => {
        navLinks?.classList.toggle(
          "open"
        );

        menuToggle.setAttribute(
          "aria-expanded",
          navLinks?.classList.contains(
            "open"
          )
            ? "true"
            : "false"
        );
      }
    );

    navLinks
      ?.querySelectorAll("a")
      .forEach(link =>
        link.addEventListener(
          "click",
          () =>
            navLinks.classList.remove(
              "open"
            )
        )
      );

    initPiSdk();

    $("piConnectBtn")?.addEventListener(
      "click",
      () => {
        if (!piUser) {
          connectWithPi();
        }
      }
    );

    $("heroConnectBtn")?.addEventListener(
      "click",
      () => {
        if (!piUser) {
          connectWithPi();
        }
      }
    );

    $("modalConnectBtn")?.addEventListener(
      "click",
      connectWithPi
    );

    $("payBtn")?.addEventListener(
      "click",
      () => {
        currentPayment = {
          amount: 0.001,
          memo:
            "WorldArts — Aube sur le lac Tanganyika"
        };

        openModal(
          "paymentModal"
        );
      }
    );

    $("modalPayBtn")?.addEventListener(
      "click",
      () => {
        const payment =
          currentPayment || {
            amount: 0.001,
            memo:
              "WorldArts — Aube sur le lac Tanganyika"
          };

        closeModal(
          "paymentModal"
        );

        payWithPi(
          payment.amount,
          payment.memo,
          payment.metadata
        );
      }
    );

    document
      .querySelectorAll("[data-close]")
      .forEach(btn =>
        btn.addEventListener(
          "click",
          () =>
            closeModal(
              btn.getAttribute(
                "data-close"
              )
            )
        )
      );

    document
      .querySelectorAll(".modal-overlay")
      .forEach(overlay =>
        overlay.addEventListener(
          "click",
          e => {
            if (
              e.target === overlay
            ) {
              overlay.classList.remove(
                "open"
              );
            }
          }
        )
      );

    document.addEventListener(
      "keydown",
      e => {
        if (e.key === "Escape") {
          document
            .querySelectorAll(
              ".modal-overlay.open"
            )
            .forEach(el =>
              el.classList.remove(
                "open"
              )
            );
        }
      }
    );

    const contactForm =
      $("contactForm");

    contactForm?.addEventListener(
      "submit",
      e => {
        e.preventDefault();
        submitContactForm(
          contactForm
        );
      }
    );

    const sections =
      document.querySelectorAll(
        "section[id]"
      );

    const navAnchors =
      document.querySelectorAll(
        ".nav-links a"
      );

    if (
      "IntersectionObserver" in window
    ) {
      const observer =
        new IntersectionObserver(
          entries => {
            entries.forEach(
              entry => {
                if (
                  !entry.isIntersecting
                ) {
                  return;
                }

                navAnchors.forEach(
                  a =>
                    a.classList.remove(
                      "active"
                    )
                );

                const active =
                  document.querySelector(
                    `.nav-links a[href="#${entry.target.id}"]`
                  );

                active?.classList.add(
                  "active"
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
        section =>
          observer.observe(
            section
          )
      );

      const revealItems =
        document.querySelectorAll(
          ".reveal"
        );

      const revealObserver =
        new IntersectionObserver(
          entries => {
            entries.forEach(
              entry => {
                if (
                  entry.isIntersecting
                ) {
                  entry.target.classList.add(
                    "in"
                  );

                  revealObserver.unobserve(
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

      revealItems.forEach(
        item =>
          revealObserver.observe(
            item
          )
      );
    }

    loadArtworks();
  }

  window.WorldArts = {
    connectWithPi,
    payWithPi,
    applyLanguage,
    applyTheme,
    loadArtworks,
    openModal,
    closeModal
  };

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
Ubu ushobora gukanda

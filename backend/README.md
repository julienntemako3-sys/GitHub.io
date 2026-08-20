
WorldArts
WorldArts est le marché mondial de l'art : une application web où l'on découvre, achète et vend des œuvres, de la musique et des vidéos, avec des paiements exclusivement en Pi Network (π) et en jeton WART — aucun dollar, aucun USDT.
Ce dépôt contient le frontend statique de l'application (HTML/CSS/JS pur, sans framework), prêt à être publié sur GitHub Pages et à être connecté au Pi Developer Portal.
Aperçu
Design premium, disponible en mode clair et mode sombre
Interface multilingue : Kirundi (rn), Français (fr), English (en), Kiswahili (sw), العربية (ar), 中文 (zh)
Intégration du Pi SDK : connexion (Pi.authenticate) et paiement (Pi.createPayment)
Sections : Accueil, Fonctionnalités, Comment ça marche, Galerie, Artistes, Témoignages, Marché/Paiement, À propos, FAQ, Contact
100 % HTML/CSS/JS statique — aucune dépendance de build
Structure du projet
worldarts/
├── index.html          # Page principale (structure + contenu + data-i18n)
├── style.css            # Feuille de style (thème clair/sombre, mise en page, responsive)
├── script.js             # Traductions, thème, menu mobile, Pi SDK, formulaire, animations
├── assets/
│   ├── logo.svg          # Logo WorldArts
│   └── favicon.svg       # Favicon
├── .nojekyll              # Empêche GitHub Pages de traiter le site avec Jekyll
└── README.md
Lancer le projet en local
Aucune installation n'est nécessaire. Deux options :
Ouvrir directement index.html dans un navigateur.
Servir le dossier (recommandé, pour éviter les restrictions de certains navigateurs) :
npx serve worldarts
# ou
python3 -m http.server --directory worldarts 8080
Déploiement sur GitHub Pages
Créez un dépôt GitHub (ex. worldarts) et poussez-y le contenu de ce dossier à la racine :
git init
git add .
git commit -m "WorldArts frontend"
git branch -M main
git remote add origin https://github.com/<votre-utilisateur>/worldarts.git
git push -u origin main
Dans Settings → Pages, choisissez la branche main et le dossier / (root).
Le fichier .nojekyll est déjà présent : il empêche GitHub Pages d'ignorer les fichiers commençant par _ et de passer le site par le moteur Jekyll, ce qui est important pour un site statique pur.
Votre site sera publié à l'adresse https://<votre-utilisateur>.github.io/worldarts/.
Connexion au Pi Developer Portal
Enregistrez votre application sur le Pi Developer Portal.
Renseignez l'URL de votre site GitHub Pages comme App URL.
Dans script.js, la fonction initPiSdk() appelle :
Pi.init({ version: "2.0", sandbox: true });
Passez sandbox à false une fois l'application validée par le Pi Core Team, pour passer en environnement de production.
Le bouton « Se connecter avec Pi » déclenche Pi.authenticate(["username", "payments"], onIncompletePaymentFound).
Le bouton « Acheter avec Pi » déclenche Pi.createPayment(...) avec les callbacks onReadyForServerApproval, onReadyForServerCompletion, onCancel et onError, à connecter à votre backend (validation des paiements, complétion) une fois celui-ci en place.
Le jeton WART est présenté dans l'interface comme second moyen de paiement officiel de la place de marché ; son intégration technique (contrat, wallet) se fait au niveau du backend.
Internationalisation (i18n)
Toutes les chaînes visibles sont marquées avec data-i18n="clé" (texte) ou data-i18n-placeholder="clé" (champs de formulaire) dans index.html. Les traductions vivent dans l'objet translations en tête de script.js, avec une clé par langue : fr, en, rn, sw, ar, zh. L'arabe bascule automatiquement l'affichage en RTL. La langue et le thème choisis sont mémorisés dans le navigateur (localStorage).
Prochaines étapes possibles
Connecter le backend Node.js/Express (routes /auth, /payments, /artworks, /artists) pour remplacer les données de démonstration par de vraies œuvres et artistes.
Brancher le formulaire de contact sur un service d'envoi d'e-mails ou une route backend.
Ajouter la validation serveur des paiements Pi (/payments/approve et /payments/complete) avant la mise en production.

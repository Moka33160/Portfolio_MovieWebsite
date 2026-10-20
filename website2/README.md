# Portfolio de Mathis Gesson

Portfolio React/Vite en cinq langues, présentant les projets de Mathis, ses expériences à INRAE et sa recherche de stage en informatique de 12 à 16 semaines.

## Installation et développement

Utiliser Node.js 22.12 ou plus récent.

```sh
npm ci
npm run dev
```

## Vérification et production

```sh
npm run lint
npm run build
npm run preview
```

Le dossier `dist/` est autonome et peut être publié sur un hébergement statique. Il contient les images optimisées, le code compilé et le rapport de stage. Publier le contenu de ce dossier, sans `node_modules`, les sources ou `.env`. Aucun serveur applicatif n’est nécessaire.

La démonstration Movie Explorer utilise `?demo=movie`, donc aucune règle de réécriture de routes n’est nécessaire. Pour un hébergement sous un sous-dossier, définir également `base` dans `vite.config.js` et adapter les chemins absolus des ressources de la démonstration.

## Configuration facultative de Movie Explorer

Le portfolio fonctionne sans configuration externe. La démonstration de films nécessite une clé d’accès TMDB. Copier `.env.example` vers `.env` et renseigner `VITE_TMDB_API_KEY`, puis reconstruire le site.

Les variables Appwrite sont des identifiants publics de projet, base et collection. Elles sont facultatives. La collection doit exposer les champs `searchTerm` (chaîne), `count` (entier), `movie_id` (entier) et `poster` (chaîne), avec les autorisations et l’index de recherche adaptés. Une panne Appwrite ne bloque pas les résultats TMDB. Ne jamais mettre de clé secrète serveur dans une variable `VITE_*`, car ces variables sont incluses dans le navigateur.

## Modifier le contenu

- `src/App.jsx` : navigation, projets, expériences et contact.
- `src/translations.json` : textes des cinq langues. Conserver les mêmes clés dans chaque langue.
- `src/language.jsx` et `src/useLanguage.js` : langue active, métadonnées et préférence locale.
- `src/App.css` : responsive, animations et interactions.
- `src/assets/*.webp` : portrait et visuels optimisés ; les PNG sources sont conservés.
- `src/MovieExplorer.jsx` : démonstration, recherche avec temporisation et annulation des requêtes obsolètes.
- `public/documents/rapport-stage-mathis-gesson-inrae-2026.pdf` : rapport original, sans modification.

Le sélecteur propose français, anglais, espagnol, allemand et néerlandais. Le français est la langue par défaut ; le navigateur conserve le choix si le stockage local est disponible. Le PDF reste en français.

Les images des projets sont des illustrations fournies par Mathis, pas des captures des applications. Concordia est présenté comme un projet collectif. Les fiches des dépôts décrivent leurs fonctionnalités sans attribuer à Mathis seul le travail du groupe.

## Accessibilité et vérifications

Navigation clavier, lien d’accès direct au contenu, textes alternatifs, sélecteur utilisable au clavier, fermeture des menus avec Échap, et animations désactivées avec `prefers-reduced-motion`. Les polices disposent de solutions de repli système. Les images du portfolio sont en WebP avec chargement différé hors portrait.

Vérifier avant une publication sur une nouvelle adresse : les cinq langues, le menu mobile, les liens GitHub, l’e-mail, le téléphone, le téléchargement du rapport et la démo si TMDB est configuré. La recherche de films et les ressources externes dépendent de leurs services respectifs.

## Informations éditoriales

Le CV fourni est disponible depuis l’accueil et la section contact, dans `public/documents/cv-mathis-gesson.pdf`, sans modification. LinkedIn et GitHub figurent dans la section contact. Les dates exactes du futur stage pourront être ajoutées lorsqu’elles seront fournies. Le début du stage INRAE affiché (6 avril 2026) suit la demande de Mathis ; la couverture du rapport indique le 7 avril. Le rapport est laissé inchangé.

## Anicard dans le portfolio

Anicard est présenté en tête des projets avec une capture réelle, une vidéo d’ouverture de booster et un bouton vers `?demo=anicard`. Le lanceur macOS `public/documents/Lancer Anime Card.command` est proposé au téléchargement depuis la fiche. La présentation est disponible dans les cinq langues ; l’interface du jeu reste en anglais. Le projet Morpion & Minimax inclut aussi une vidéo de démonstration.

Pour tester Anicard en local, cloner le [dépôt Anicard](https://github.com/Moka33160/Anicard), installer ses prérequis comme indiqué dans son README, puis lancer le fichier `.command` depuis la racine du dépôt. Le script applique les migrations, initialise la base locale SQLite, puis démarre l’API FastAPI, le worker d’import et le site Vite. Il faut laisser la fenêtre Terminal ouverte pendant le test ; `Ctrl+C` arrête les services. PostgreSQL n’est pas lancé par ce script et doit être démarré séparément si cette base est utilisée.

Les vidéos d’origine sont conservées dans `public/videos/` au format QuickTime `.mov`.

`public/demos/anicard/` contient une version compilée de l’interface actuelle, avec navigation par hash pour fonctionner sur un hébergement statique. Aucun compte, mot de passe, fichier `.env` ou base de données du projet d’origine n’est copié. Le projet source demeure inchangé.

Pour actualiser cet aperçu à partir du projet local, avec ses dépendances frontend déjà installées :

```sh
npm run sync:anicard
# Autre emplacement du frontend :
node scripts/sync-anicard.mjs /chemin/vers/Anicard/frontend
npm run build
```

La compilation normale du portfolio utilise l’aperçu déjà fourni et ne nécessite pas le dépôt Anicard. Le script de synchronisation doit seulement être relancé lorsqu’on souhaite présenter une version plus récente du projet.

### Données et fonctionnalités du jeu

L’interface Anicard est intégrée au site ; son API FastAPI et sa base ne font pas partie d’un hébergement statique. En développement et avec `npm run preview`, Vite transmet `/api` au serveur Anicard existant sur `http://127.0.0.1:8000`. Démarrer le backend depuis son propre projet selon sa documentation, sans exposer sa base de développement publiquement.

Sur un site publié, configurer `/api` vers une instance Anicard déployée et adaptée à cet usage pour disposer des données et des actions de jeu. Sans API, l’interface et sa navigation restent accessibles, avec les états d’indisponibilité réels. L’aperçu ne simule pas de comptes ni de résultats d’ouverture. Aucun déploiement du backend n’a été effectué par cette intégration.

## Publication sur GitHub Pages

Le workflow `.github/workflows/pages.yml` installe les dépendances, vérifie le code, compile le portfolio et le déploie à chaque mise à jour de `main`. Dans les paramètres du dépôt, **Settings > Pages > Source** doit être réglé sur **GitHub Actions**.

L’adresse du site est fournie par le déploiement Pages. Le chemin de base est automatiquement déduit par `actions/configure-pages` et transmis au build via `PAGES_BASE_PATH`. Les liens vers les images, les documents et l’interface Anicard fonctionnent sous le sous-dossier du dépôt.

Aucun fichier `.env` local n’est nécessaire à la publication. Le workflow peut lire la variable publique de dépôt `VITE_TMDB_API_KEY` pour activer les appels TMDB. Toutes les variables `VITE_*` sont visibles dans le navigateur : ne pas y placer de clé secrète serveur. Sans cette configuration, le portfolio reste consultable et la démo indique son indisponibilité.

Le CV, le rapport, les images et les coordonnées sont rendus publics avec le portfolio. GitHub Pages héberge l’interface d’Anicard ; son API et sa base de données nécessitent un hébergement distinct pour les actions de jeu.

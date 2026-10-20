ANICARD — LANCEURS WINDOWS ET LINUX

1. Recuperer le projet : https://github.com/Moka33160/Anicard
   git clone https://github.com/Moka33160/Anicard.git
2. Extraire TOUS les fichiers de cette archive a la racine du projet Anicard,
   a cote des dossiers backend et frontend. Le lanceur seul ne contient pas le jeu.
3. Installer Python 3.11 ou plus recent et Node.js 22.12 ou plus recent.
   Consulter aussi le README du projet pour les prerequis a jour.
4. Installer les dependances depuis la racine du projet :

   Windows (Invite de commandes) :
     py -3 -m venv backend\.venv
     backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
     npm --prefix frontend ci

   Linux :
     python3 -m venv backend/.venv
     backend/.venv/bin/python -m pip install -r backend/requirements.txt
     npm --prefix frontend ci
   Le paquet python3-venv de votre distribution peut etre necessaire.

5. Windows : double-cliquer sur Lancer Anicard.cmd.
   Linux : ouvrir un terminal dans le projet et lancer :
     bash lancer-anicard.sh
6. Ouvrir http://127.0.0.1:5173 dans le navigateur.
   Garder le terminal ouvert ; Ctrl+C arrete les services demarres par le lanceur.

Le lanceur applique les migrations, initialise les donnees locales, puis lance
l'API FastAPI, le worker d'import et le site Vite, uniquement en local.
SQLite (backend/preview.db) est utilise par defaut. Les donnees locales existantes
restent utilisees. Si DATABASE_URL est deja definie, elle est conservee.
PostgreSQL doit etre demarre et configure separement si vous souhaitez l'utiliser.
Les dependances ne sont pas installees automatiquement.
Ne pas lancer deux instances : les ports 8000 et 5173 doivent etre libres.
Le lanceur n'heberge pas le backend sur GitHub Pages.

Verification des chemins et des ports, sans migration ni demarrage :
  Windows : Lancer Anicard.cmd --check
  Linux : bash lancer-anicard.sh --check

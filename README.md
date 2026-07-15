# Mayes Smei — Physique · Chimie · SVT — 2ème année

Site de révision pour la 2ème année secondaire en Tunisie : cours de Physique, Chimie et SVT basés sur le programme officiel, avec un assistant IA, des schémas 3D interactifs et des séances de révision par chapitre.

- **Interface et contenu** : entièrement en français (comme au lycée)
- **Bouton "Explication simplifiée"** : ouvre une version simplifiée du cours sous chaque section, sans effacer le texte original
- **Assistant IA** : répond aux questions en français, propulsé par l'API Claude d'Anthropic

## Aperçu rapide

```
mayes-smei/
├── src/
│   ├── App.jsx        → toute l'interface (composants, styles, logique)
│   ├── data.js         → contenu des cours par matière/chapitre
│   └── main.jsx        → point d'entrée React
├── api/
│   └── chat.js         → fonction serverless (utilisée par Vercel en production)
├── server/
│   └── index.js        → petit serveur Express (utilisé en développement local)
├── index.html
├── package.json
├── vite.config.js
├── vercel.json          → configuration de déploiement Vercel
├── .env.example         → modèle pour ta clé API (à copier en .env)
└── .gitignore
```

## 1. Installation

Il te faut [Node.js](https://nodejs.org) (version 18 ou plus) installé sur ta machine.

```bash
git clone https://github.com/<ton-utilisateur>/mayes-smei.git
cd mayes-smei
npm install
```

## 2. Configurer l'assistant IA (clé API)

L'assistant IA appelle l'API Claude d'Anthropic. Pour que ça fonctionne en dehors de claude.ai, il faut ta propre clé API et un petit serveur qui la garde secrète (jamais exposée dans le navigateur).

1. Crée un compte sur [console.anthropic.com](https://console.anthropic.com) et génère une clé API.
2. Copie `.env.example` en `.env` :
   ```bash
   cp .env.example .env
   ```
3. Ouvre `.env` et colle ta clé :
   ```
   ANTHROPIC_API_KEY=sk-ant-ta-cle-ici
   ```

⚠️ **Ne partage jamais ce fichier `.env` et ne le mets jamais sur GitHub** — il est déjà exclu par `.gitignore`.

## 3. Lancer le site en local

Il faut lancer **deux choses en parallèle**, dans deux terminaux différents :

**Terminal 1 — le serveur du chat IA :**
```bash
npm run server
```
Tu dois voir : `✅ Serveur du chat IA démarré sur http://localhost:3001`

**Terminal 2 — le site lui-même :**
```bash
npm run dev
```
Tu dois voir une adresse du type `http://localhost:5173` — ouvre-la dans ton navigateur.

Le site fonctionne même sans le serveur IA (terminal 1) ; seul le chat assistant ne répondra pas.

## 4. Modifier le contenu des cours

Tout le contenu (titres, texte français, explication arabe) est dans **`src/data.js`**. Chaque chapitre a cette forme :

```js
{
  h: "Titre de la section (français)",
  hAr: "عنوان القسم (عربي)",
  body: "Texte du cours en français...",
  bodyAr: "الشرح بالعربية..."
}
```

Pour ajouter un chapitre, ajoute un objet dans la liste `chapters` de la matière concernée, en respectant la même structure.

## 5. Mettre le projet sur GitHub

```bash
git init
git add .
git commit -m "Premier envoi — site Madar"
git branch -M main
git remote add origin https://github.com/<ton-utilisateur>/mayes-smei.git
git push -u origin main
```

## 6. Publier le site en ligne (lien accessible partout — Vercel)

Pour avoir un lien qui fonctionne sur n'importe quel téléphone ou ordinateur (pas seulement le tien), avec le chat IA qui répond, la solution la plus simple et gratuite est **Vercel**.

### Étapes

1. Mets d'abord ton projet sur GitHub (voir étape 5 ci-dessus).
2. Va sur [vercel.com](https://vercel.com) et crée un compte (tu peux te connecter directement avec GitHub).
3. Clique sur **"Add New" → "Project"**.
4. Choisis ton dépôt `mayes-smei` dans la liste.
5. Vercel détecte automatiquement Vite — ne change rien aux réglages proposés.
6. Avant de cliquer sur "Deploy", ouvre la section **"Environment Variables"** et ajoute :
   - **Name** : `ANTHROPIC_API_KEY`
   - **Value** : ta clé API (celle que tu as mise dans `.env`)
7. Clique sur **Deploy**. Après 1-2 minutes, Vercel te donne un lien du type :
   ```
   https://mayes-smei.vercel.app
   ```

Ce lien fonctionne sur n'importe quel téléphone, tablette ou ordinateur, et le chat IA répond directement (la clé API reste secrète côté serveur Vercel, jamais visible dans le navigateur). Tu peux l'envoyer à qui tu veux.

### Mettre à jour le site après un changement

Après avoir modifié le contenu (`src/data.js`) ou le code, il suffit de :
```bash
git add .
git commit -m "Mise à jour du contenu"
git push
```
Vercel republie automatiquement le site en 1-2 minutes à chaque `push`.

---

## 7. Autres options d'hébergement (alternative à Vercel)

### Option A — GitHub Pages (sans assistant IA en ligne)

GitHub Pages n'héberge que des fichiers statiques (pas de fonctions serverless), donc le chat IA ne fonctionnera pas avec cette option — mais tout le reste (cours, schémas 3D, navigation) fonctionne très bien.

```bash
npm install --save-dev gh-pages
```

Dans `vite.config.js`, mets `base: "/mayes-smei/"` (remplace par le nom exact de ton dépôt GitHub).

```bash
npm run build
npm run deploy
```

### Option B — Render / Railway (pour le serveur Express classique)

Si tu préfères garder `server/index.js` tel quel (au lieu des fonctions serverless `api/chat.js`), héberge-le sur [Render](https://render.com) ou [Railway](https://railway.app) (plans gratuits disponibles), ajoute `ANTHROPIC_API_KEY` dans leurs variables d'environnement, puis remplace `API_BASE_URL` dans `src/App.jsx` par l'adresse de ce serveur.

## Programme couvert

- **Physique** : Circuits électriques · Forces, mouvements et pression · Énergie et contrôle · Lumière · Terre et Univers
- **Chimie** : La matière (structure de l'atome) · Les solutions · Chimie organique
- **SVT** : Structure et fonction de la cellule · Nutrition humaine

Source : programme officiel du Ministère de l'Éducation tunisien (edunet.tn).

## Technologies utilisées

- [React](https://react.dev) + [Vite](https://vitejs.dev)
- [Three.js](https://threejs.org) pour les schémas 3D interactifs
- [Lucide](https://lucide.dev) pour les icônes
- [Express](https://expressjs.com) pour le serveur du chat IA
- [API Claude](https://www.anthropic.com) (Anthropic) pour l'assistant

---

*Projet éducatif, non affilié au Ministère de l'Éducation tunisien.*

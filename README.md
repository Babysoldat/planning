# Planning BabySoldat

## Déploiement en 5 étapes

### 1. Installe Node.js (si pas déjà fait)
Va sur https://nodejs.org et télécharge la version LTS.

### 2. Crée un repo GitHub
- Va sur https://github.com/new
- Nom du repo : `planning`
- Laisse en Public
- Clique "Create repository"

### 3. Push le code
Ouvre le terminal sur ton Mac et tape ces commandes une par une :

```bash
cd ~/Downloads/planning-app
npm install
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/planning.git
git push -u origin main
```

⚠️ Remplace `TON-USERNAME` par ton nom d'utilisateur GitHub.

### 4. Déploie sur Vercel
- Va sur https://vercel.com
- Connecte-toi avec GitHub
- Clique "Add New Project"
- Sélectionne le repo `planning`
- Clique "Deploy"
- Attends 1-2 min, Vercel te donne un lien genre `planning-xxx.vercel.app`

### 5. Installe sur iPhone
- Ouvre le lien Vercel dans Safari
- Clique le bouton Partager (carré avec flèche)
- "Sur l'écran d'accueil"
- Donne-lui un nom, "OK"

C'est terminé ! L'app est sur ton iPhone et ton ordi, synchronisée en temps réel via Supabase.

# Plateforme Locale pour la Gestion des Achats de GCT

Une application web full-stack construite avec un frontend React (Vite) et un backend Node.js/Express pour la gestion des achats de la GCT.

## 🚀 Démarrage Rapide

### Prérequis

Assurez-vous d'avoir installé les éléments suivants sur votre machine :
- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Installation et Configuration

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/derdebej/stage_gct
   cd "stage gct"
   ```

2. **Installer les dépendances pour le frontend et le backend**
   
   Installer les dépendances du backend :
   ```bash
   cd Backend
   npm install
   ```
   
   Installer les dépendances du frontend :
   ```bash
   cd ../react
   npm install
   ```

3. **Configuration de l'environnement**
   
   Modifier le fichier `.env` dans le dossier `Backend` avec les variables adéquates :
   ```env
   # Configuration de l'URL de base pour les PDF
   BASE_PDF_PATH=C:\Users\nader\Desktop\stage gct\fichiers

   # Identifiants de la base de données
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=690913121978asg
   DB_NAME=G.C.T
   ```
   
   Modifier le fichier `.env` dans le dossier `react` avec les variables adéquates :
   ```env
   # URL de base pour l'API frontend
   VITE_API_BASE_URL=http://localhost:3001
   ```
   
   **Note :** Assurez-vous de remplacer les valeurs par vos véritables identifiants et configuration de base de données selon votre environnement.

## 🏃‍♂️ Lancement du Projet

### Mode Développement

Vous devez exécuter simultanément les serveurs frontend et backend.

#### Exécution dans des terminaux séparés

**Terminal 1 - Démarrer le serveur Backend :**
```bash
cd Backend
node server
```

**Terminal 2 - Démarrer le serveur de développement Frontend :**
```bash
cd react
npm run dev
```

## 📁 Structure du Projet

```
stage gct/
├── react/                 # Frontend (Vite + React)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── .env              # Variables d'environnement frontend
│   └── vite.config.js
├── Backend/               # Backend (Node.js + Express)
│   ├── server.js         # Fichier serveur principal
│   ├── package.json
│   └── .env              # Variables d'environnement backend
├── fichiers/
├── Base de données/              # Conception + fichier SQL
└── README.md
```

## 🌐 URLs par Défaut

- **Frontend (Développement) :** http://localhost:5173 (défaut Vite)
- **API Backend :** http://localhost:3001

## 🔧 Scripts Disponibles

### Frontend (dossier react)
- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Construire pour la production
- `npm run preview` - Prévisualiser la version de production localement
- `npm run lint` - Exécuter ESLint

### Backend (dossier Backend)
- `npm start` - Démarrer le serveur
- `npm run dev` - Démarrer avec nodemon (si configuré)
- `npm test` - Exécuter les tests (si configurés)

## ⚙️ Variables d'Environnement

### Backend (`Backend/.env`)

Les variables d'environnement suivantes doivent être configurées dans le fichier `Backend/.env` :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `BASE_PDF_PATH` | Chemin vers le dossier des fichiers PDF | `C:\Users\nader\Desktop\stage gct\fichiers` |
| `DB_HOST` | Hôte de la base de données | `localhost` |
| `DB_PORT` | Port de la base de données | `5432` |
| `DB_NAME` | Nom de la base de données | `G.C.T` |
| `DB_USER` | Nom d'utilisateur de la base de données | `postgres` |
| `DB_PASSWORD` | Mot de passe de la base de données | `690913121978asg` |

### Frontend (`react/.env`)

Les variables d'environnement suivantes doivent être configurées dans le fichier `react/.env` :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL de base pour les requêtes API depuis le frontend | `http://localhost:3001` |

**Important :** Ne commitez jamais vos fichiers `.env` dans le contrôle de version. Assurez-vous qu'ils soient inclus dans votre fichier `.gitignore`.

## 🔍 Dépannage

### Problèmes Courants

1. **Port déjà utilisé**
   - Changez le port dans la configuration de votre serveur backend
   - Ou tuez le processus utilisant le port : `netstat -ano | findstr :3001` puis `taskkill /PID <PID> /F` (Windows)

2. **Problèmes de connexion à la base de données**
   - Vérifiez vos identifiants de base de données dans le fichier `Backend/.env`
   - Assurez-vous que PostgreSQL est installé et fonctionne
   - Vérifiez que la base de données `G.C.T` existe
   - Vérifiez les paramètres du pare-feu

3. **Problèmes de chemin des fichiers PDF**
   - Vérifiez que le dossier `fichiers` existe à l'emplacement spécifié dans `BASE_PDF_PATH`
   - Assurez-vous que les permissions d'accès au dossier sont correctes

4. **Erreurs CORS**
   - Assurez-vous que votre backend est configuré pour accepter les requêtes depuis l'URL de votre frontend
   - Vérifiez la configuration CORS dans votre serveur Express

5. **Erreurs d'installation npm (Conflits de dépendances)**
   - **Problème courant avec react-pdf** : La bibliothèque react-pdf peut causer des conflits de dépendances
   - **Solution rapide** : Utilisez l'option `--force` lors de l'installation
   ```bash
   # Dans le dossier react
   npm install --force
   ```
   - **Alternative** : Utilisez `--legacy-peer-deps` si `--force` ne fonctionne pas
   ```bash
   npm install --legacy-peer-deps
   ```
   - **Solution complète** : Supprimez `node_modules` et `package-lock.json`, puis réinstallez avec force
   ```bash
   rm -rf node_modules package-lock.json
   npm install --force
   ```

6. **Erreurs de modules introuvables**
   - Exécutez `npm install` dans les répertoires `react` et `Backend`
   - Supprimez `node_modules` et `package-lock.json`, puis réinstallez
   

### Besoin d'Aide ?

Si vous rencontrez des problèmes, veuillez vérifier les points suivants :
- Assurez-vous que toutes les dépendances sont installées
- Vérifiez que les variables d'environnement sont correctement définies
- Vérifiez que les deux serveurs fonctionnent
- Examinez les journaux de la console pour les messages d'erreur

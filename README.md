# 📌 Projet CODEPREZ

Bienvenue dans le projet **CODEPREZ** !  
Cette application desktop permet de créer et d'afficher des présentations de type **PowerPoint** ou **Keynote**, dont le contenu est défini via un fichier **Markdown** et un fichier **CSS**.  
Elle propose des fonctionnalités avancées pensées pour les développeurs : affichage de code, exécution de commandes, et un **mode présentation** multi-écran.

---

## 👥 Membres du projet

- Evan **FERRON**
- Kevin **CHAFFAUX**
- Matias **BELLAUD**

## 🎯 Fonctionnalités principales

- 📦 Création d’archives `.codeprez` contenant :
  - `presentation.md`, `style.css`, `config.json`, `assets/`, `env/`
- 📂 Ouverture et lecture de fichiers `.codeprez`
- 🖥️ Découpage automatique du Markdown en diapositives HTML
- 💻 Affichage de blocs de code avec surlignage syntaxique
- 🧪 Exécution de commandes shell depuis les diapositives
- 🧭 Mode présentation double écran

---

## 🔧 Installation

### 1️⃣ Prérequis

- Node.js (>= 18)
- npm ou yarn
- Git

### 2️⃣ Cloner le projet

```bash
git clone https://github.com/tonrepo/codeprez.git
cd codeprez/codeprez
```

### 3️⃣ Installation des dépendances
```bash
npm install
```

### 4️⃣ Démarrer le projet
```bash
npm run start
```

### packaging 

en se metttant bien dans le dossier codeprez

```bash
npm run build:win
```
```bash
npm run build:mac
```
```bash
npm run build:linux
```

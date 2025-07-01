# Projet CodePrez

## Application de Présentation avec Electron

**Développé par :** Chaffaux Kévin, Bellaud Matias, Ferron Evan
**Durée :** 15 minutes

---

### Sommaire

1. Projet CodePrez
2. Objectifs du Projet
3. Architecture Technique
4. Format .codeprez
5. Fonctionnalités Développées
6. Démonstration - Affichage de Code
7. Défis Techniques Relevés
8. main
9. preload
10. render
11. Fonctionnalités Bonus
12. Architecture du Code
13. Démonstration
14. Conclusion
15. Questions & Réponses

---

## Objectifs du Projet

### Créer une application de présentation moderne

- Alternative à PowerPoint/Keynote
- Contenu défini en **Markdown** et **CSS**
- Fonctionnalités spéciales pour développeurs

### Fonctionnalités clés

- 📦 Création d’archives `.codeprez` contenant :
- 📂 Ouverture et lecture de fichiers `.codeprez`
- 💻 Affichage de blocs de code avec surlignage syntaxique
- 🧪 Exécution de commandes shell depuis les diapositives
- 🧭 Mode présentation double écran

---

## Architecture Technique

### Technologies utilisées

- **Electron** - Framework desktop ![Une image](./assets/logo_electron.png)
- **ReactJs** - Framework front ![Une image](./assets/react.png)
- **Node.js** - Backend et manipulation système ![Une image](./assets/nodeJs.jpg)
- **Markdown-it** - Parsing du contenu ![Une image](./assets/md.png)
- **Highlight.js** - Coloration syntaxique

---

## Format .codeprez

### Structure de l'archive

```tree
presentation.codeprez (zip renommé)
├── presentation.md
├── style.css
├── config.json
├── assets/
│   ├── images/
│   └── code-files/
└── env/
    └── script.js
```

---

## Fonctionnalités Développées

### ✅ Création d'archives .codeprez

- Interface de sélection de fichiers
- Compression automatique
- Validation des fichiers requis
- Personalisation de la configuration (le conf.json)

### ✅ Ouverture et affichage

- Désarchivage temporaire
- Analyse et affichage du Markdown avec du css
- Affichage plein écran de la présentation
- Affichage présentateur avec chrono

---

### Exécution de commande bash

## Commandes exécutables

```bash
echo hello
```

## Exécution d'un script

```bash
node index.js
```

---

## Démonstration - Affichage de Code

### Code importé

[Code](./assets/preload.js#1-15)

### Code scrollable intégré

```javascript
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  
  mainWindow.loadFile('index.html');
}
```

---

## Défis Techniques Relevés

### Communication Inter-Process

- **ContextBridge** pour la sécurité
- **IPC** pour les échanges Main ↔ Renderer
- Gestion asynchrone des opérations

### Gestion Multi-plateforme

- Chemins de fichiers adaptés
- Associations de types de fichiers
- Packaging spécifique par OS

---

## main

La création de nos fenêtre :

[Code](./assets/main.js#1-166)

---

## preload

La définition du context bridge :

[Code](./assets/preload.js#1-61)

---

## render

Le front :

[Code](./assets/HomePage.jsx#1-198)

---

## Fonctionnalités Bonus

### Mode Présentation

- Écran présentateur avec chronomètre
- Aperçu de la diapositive suivante
- Affichage plein écran sur écran principal

### Autres améliorations

- Gestion des erreurs robuste
- Raccourcis clavier

---

## Architecture du Code

### Structure des fichiers

```tree
src
  ├── main
  │  ├── index.js
  │  └── utils
  │    ├── eventHandler.js
  │    ├── markdown.js
  │    └── zip.js
  ├── preload
  │  └── index.js
  └── renderer
    ├── index.html
    └── src
      ├── assets
      │  ├── base.css
      │  ├── electron.svg
      │  └── wavy-lines.svg
      ├── main.jsx
      ├── pages
      │  ├── ErrorPage.jsx
      │  ├── HomePage.jsx
      │  ├── ProjectPage.jsx
      │  └── SubProjectPage.jsx
      └── styles
        ├── home.css
        ├── ProjectPage.css
        └── SubProjectPage.css
```

---

## Démonstration

---

## Conclusion

### Compétences acquises

- Maîtrise d'Electron et son process model
- Manipulation du système avec Node.js
- Création d'interfaces desktop natives

### Application fonctionnelle

Une alternative viable aux outils de présentation traditionnels, optimisée pour les développeurs

### Prêt pour la production

Packaging multi-plateforme et association de fichiers

---

## Questions & Réponses

Merci pour votre attention !

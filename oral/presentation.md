## Sommaire

1. Objectifs du Projet
2. Architecture Technique
3. Format .codeprez
4. Fonctionnalités Développées
5. Démonstration - Affichage de Code
6. Défis Techniques Relevés
7. Main, Preload, Render
8. Fonctionnalités Bonus
9. Architecture du Code
10. Démonstration
11. Conclusion
12. Questions & Réponses

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

## Exécution de commande bash

### Commandes exécutables

```bash
echo hello
```

### Exécution d'un script

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

- **ContextBridge** pour la sécurité (preload script)
- **IPC** pour les échanges Main ↔ Renderer
- Utilisation de send et invoke

### Gestion de fichier

- Lecture de fichier
- Création de zip

---

## Main

La création de nos fenêtre :

[Code](./assets/main.js#1-166)

---

## Preload

La définition du context bridge :

[Code](./assets/preload.js#1-61)

---

## Render

Le front :

[Code](./assets/HomePage.jsx#1-198)

---

## Zip

La gestion des fichiers :

[Code](./assets/zip.js#1-84)

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
  │    └── ...
  ├── preload
  │  └── index.js
  └── renderer
    ├── index.html
    └── src
      ├── assets
      │  └── ...
      ├── main.jsx
      ├── pages
      │  └── ...
      └── styles
        └── ...
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

- Une alternative viable aux outils de présentation traditionnels, optimisée pour les développeurs

### Prêt pour la production

- Packaging multi-plateforme et association de fichiers

---

## Questions & Réponses

Merci pour votre attention !

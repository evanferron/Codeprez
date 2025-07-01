# Projet CodePrez
## Application de Présentation avec Electron

**Développé par :** Chaffaux Kévin, Bellaud Matias, Ferron Evan
**Durée :** 15 minutes

---

## Objectifs du Projet

### Créer une application de présentation moderne
- Alternative à PowerPoint/Keynote
- Contenu défini en **Markdown** et **CSS**
- Fonctionnalités spéciales pour développeurs

### Fonctionnalités clés
- Affichage de code scrollable
- Exécution de commandes depuis les diapositives
- Interface desktop avec Electron

---

## Architecture Technique

### Technologies utilisées
- **Electron** - Framework desktop
- **Node.js** - Backend et manipulation système
- **Markdown-it** - Parsing du contenu
- **Highlight.js** - Coloration syntaxique

### Process Model d'Electron
- Main Process pour la gestion système
- Renderer Process pour l'interface
- Communication sécurisée via IPC

---

## Format .codeprez

### Structure de l'archive
```
presentation.codeprez (zip renommé)
├── presentation.md
├── style.css
├── config.json
├── assets/
│   ├── images/
│   └── code-files/
└── env/
    └── working-directory/
```

### Avantages
- Portabilité complète
- Assets intégrés
- Environnement d'exécution inclus

---

## Fonctionnalités Développées

### ✅ Création d'archives .codeprez
- Interface de sélection de fichiers
- Compression automatique
- Validation des fichiers requis

### ✅ Ouverture et affichage
- Désarchivage temporaire
- Analyse du Markdown
- Rendu en plein écran

---

# Une image

J'espère que votre application supporte l'ajout d'image et qu'elles ne dépasseront pas du cadre! 😉

![Une image](./assets/image.jpg)

---

### Inclusion de code externe
[Code](./assets/main.js#5-20)

### Commandes exécutables
```bash
npm install
```

---

## Démonstration - Affichage de Code

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

## Démonstration - Exécution de Commandes

### Installation des dépendances
```bash
node index.js
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

## Fonctionnalités Bonus

### Mode Présentation (si implémenté)
- Écran présentateur avec chronomètre
- Aperçu de la diapositive suivante
- Affichage plein écran sur écran principal

### Autres améliorations
- Gestion des erreurs robuste
- Interface utilisateur intuitive
- Raccourcis clavier

---

## Architecture du Code

### Structure des fichiers
```
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

## Défis et Solutions

### Défi 1: Parsing Markdown complexe
**Solution:** Expressions régulières pour identifier les blocs spéciaux

### Défi 2: Exécution sécurisée de commandes
**Solution:** Isolation dans le dossier `env` avec `child_process`

### Défi 3: Communication sécurisée
**Solution:** ContextBridge et désactivation de nodeIntegration

---

## Résultats et Accomplissements

### ✅ Fonctionnalités core implémentées
- Création/ouverture de .codeprez
- Navigation entre diapositives
- Affichage de code avec coloration

### ✅ Fonctionnalités avancées
- Exécution de commandes
- Inclusion de fichiers externes
- Interface native

---

## Démonstration Live

### Test de l'application
Ouverture de cette présentation dans notre application CodePrez

### Points clés à montrer
1. Interface de création
2. Navigation fluide
3. Exécution de commandes
4. Affichage de code

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

**Démonstration interactive disponible**
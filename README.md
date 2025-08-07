# AI Translator - Extension Firefox

Extension Firefox privée pour la traduction de texte utilisant l'API Anthropic Claude.

> ⚠️ **Note importante** : L'installation permanente via le script de build n'est pas disponible actuellement en raison de problèmes de corruption d'archive. Utilisez l'installation temporaire pour le moment.

## Fonctionnalités

- **Popup de traduction** : Cliquez sur l'icône de l'extension pour ouvrir une popup avec :
  - Zone de texte source
  - Sélecteur de langue cible
  - Zone de traduction (redimensionnable)
  - Boutons de traduction et d'effacement

- **Traduction contextuelle** : Sélectionnez du texte sur n'importe quelle page web pour voir apparaître une icône de traduction près de votre curseur après 500ms. Cliquez dessus pour sauvegarder le texte, puis cliquez sur l'icône de l'extension pour traduire.

## Installation

### 🔧 Installation temporaire (actuellement seule option disponible)

1. **Configuration** :
   - Créez un fichier `config.js` basé sur `config.example.js`
   - Remplacez la clé API par votre vraie clé Anthropic

2. **Installation dans Firefox** :
   - Ouvrez Firefox
   - Allez dans `about:debugging`
   - Cliquez sur "This Firefox"
   - Cliquez sur "Load Temporary Add-on..."
   - Sélectionnez le fichier `manifest.json`

### 🚀 Installation permanente (en cours de développement)

L'installation permanente via fichier `.xpi` rencontre actuellement des problèmes techniques. Les scripts de build sont disponibles mais génèrent des archives corrompues. Cette fonctionnalité sera corrigée dans une future version.

## Configuration

Votre clé API Anthropic doit être configurée dans le fichier `config.js` :
```javascript
const config = {
    ANTHROPIC_API_KEY: 'votre-clé-api-ici',
    MODEL: 'claude-sonnet-4-20250514',
    MAX_TOKENS: 1000
};
```
Ce fichier est automatiquement exclu de Git pour la sécurité.

## Utilisation

### Via la popup
1. Cliquez sur l'icône de l'extension dans la barre d'outils
2. Sélectionnez les langues source et cible
3. Saisissez le texte à traduire
4. Cliquez sur "Traduire"

### Via la sélection de texte
1. Sélectionnez du texte sur n'importe quelle page web
2. Une icône 🌐 apparaît près de votre curseur après 500ms
3. Cliquez sur cette icône pour sauvegarder le texte
4. Cliquez ensuite sur l'icône de l'extension pour traduire

### Raccourcis
- `Ctrl + Entrée` dans la zone de texte source pour traduire rapidement

## Langues supportées

- Français
- Anglais
- Espagnol
- Italien
- Allemand
- Portugais
- Russe
- Chinois
- Japonais
- Coréen
- Arabe
- Détection automatique (pour la langue source)

## Sécurité

- Configuration séparée du code avec `config.js` (exclu de Git)
- API key stockée localement, jamais committée
- Communication directe avec l'API Anthropic uniquement
- Aucun serveur intermédiaire

## Structure du projet

```
firefox-ai-translator/
├── manifest.json          # Configuration de l'extension (persistent: true)
├── config.js             # Configuration (API key) - exclu de Git
├── config.example.js     # Exemple de configuration
├── build.sh              # Script de build pour créer le .xpi
├── popup.html            # Interface de la popup
├── popup.css             # Styles de la popup
├── popup.js              # Logique de la popup (sans commentaires)
├── content.js            # Script de contenu (sans commentaires)
├── content.css           # Styles du script de contenu
├── background.js         # Script de background (sans commentaires)
├── icons/               # Icônes de l'extension
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
│   ├── icon-128.png
│   └── icon.svg
├── test.js              # Code de test original (exclu de Git)
└── README.md            # Cette documentation
```

## Développement

Cette extension utilise Manifest V2 pour la compatibilité avec Firefox. 

### Caractéristiques techniques :
- Background script persistant (`persistent: true`)
- Code JavaScript minifié (sans commentaires)  
- Configuration externalisée pour la sécurité
- Délai de 500ms avant l'affichage de l'icône de sélection
- Architecture modulaire (background, content, popup)
- Script de build automatisé (`build.sh`)

## Build et déploiement

Le script `build.sh` automatise la création du package :
- Nettoie les builds précédents
- Copie uniquement les fichiers nécessaires
- Utilise `config.example.js` comme template
- Crée un fichier `.xpi` prêt à installer
- Gestion d'erreurs et vérification d'intégrité

## Notes

- Extension développée pour un usage personnel
- Utilise l'API Anthropic Claude Sonnet 4
- Compatible Firefox uniquement
- Configuration sécurisée avec `.gitignore`
- Installation permanente possible via fichier `.xpi`
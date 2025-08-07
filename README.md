# AI Translator - Extension Firefox

Extension Firefox privée pour la traduction de texte utilisant l'API Anthropic Claude.

## Fonctionnalités

- **Popup de traduction** : Cliquez sur l'icône de l'extension pour ouvrir une popup avec :
  - Zone de texte source
  - Sélecteur de langue cible
  - Zone de traduction (redimensionnable)
  - Boutons de traduction et d'effacement

- **Traduction contextuelle** : Sélectionnez du texte sur n'importe quelle page web pour voir apparaître une icône de traduction près de votre curseur après 500ms. Cliquez dessus pour sauvegarder le texte, puis cliquez sur l'icône de l'extension pour traduire.

## Installation

1. **Configuration** :
   - Créez un fichier `config.js` basé sur `config.example.js`
   - Remplacez la clé API par votre vraie clé Anthropic
   - Le fichier `config.js` est automatiquement exclu de Git pour la sécurité

2. **Installation dans Firefox** :
   - Ouvrez Firefox
   - Allez dans `about:debugging`
   - Cliquez sur "This Firefox"
   - Cliquez sur "Load Temporary Add-on..."
   - Sélectionnez le fichier `manifest.json`

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
├── manifest.json          # Configuration de l'extension
├── config.js             # Configuration (API key) - exclu de Git
├── config.example.js     # Exemple de configuration
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
├── test.js              # Code de test original
└── README.md            # Cette documentation
```

## Développement

Cette extension utilise Manifest V2 pour la compatibilité avec Firefox. 

### Caractéristiques techniques :
- Code JavaScript minifié (sans commentaires)
- Configuration externalisée pour la sécurité
- Délai de 500ms avant l'affichage de l'icône de sélection
- Architecture modulaire (background, content, popup)

## Notes

- Extension développée pour un usage personnel
- Utilise l'API Anthropic Claude Sonnet 4
- Compatible Firefox uniquement
- Configuration sécurisée avec `.gitignore`
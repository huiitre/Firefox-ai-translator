// Exemple de fichier de configuration
// Copiez ce fichier vers 'config.js' et remplacez par vos vraies valeurs

const config = {
    // Votre clé API Anthropic
    ANTHROPIC_API_KEY: 'sk-ant-api03-VOTRE_CLE_ICI',
    
    // Modèle à utiliser
    MODEL: 'claude-sonnet-4-20250514',
    
    // Nombre maximum de tokens pour les réponses
    MAX_TOKENS: 1000
};

// Export pour utilisation dans l'extension
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else if (typeof window !== 'undefined') {
    window.config = config;
}
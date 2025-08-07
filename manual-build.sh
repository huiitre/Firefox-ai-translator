#!/bin/bash

echo "=== Build manuel pour test ==="

rm -f *.xpi

zip -0 -j ai-translator-manual.xpi manifest.json
zip -0 -j ai-translator-manual.xpi config.example.js -O config.js  
zip -0 -j ai-translator-manual.xpi popup.html popup.css popup.js
zip -0 -j ai-translator-manual.xpi content.js content.css background.js
zip -0 -r ai-translator-manual.xpi icons/

echo "Fichier créé: ai-translator-manual.xpi"
echo "Test d'intégrité:"
unzip -t ai-translator-manual.xpi

echo ""
echo "Contenu de l'archive:"
unzip -l ai-translator-manual.xpi
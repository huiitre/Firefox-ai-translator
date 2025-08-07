#!/bin/bash

echo "================================="
echo "   AI Translator - Build Script"
echo "================================="

BUILD_DIR="build"
EXTENSION_NAME="ai-translator"
VERSION="1.0"
OUTPUT_FILE="${EXTENSION_NAME}-${VERSION}.xpi"

echo "Nettoyage des fichiers de build précédents..."
rm -rf "$BUILD_DIR"
rm -f *.xpi

echo "Création du répertoire de build..."
mkdir -p "$BUILD_DIR"

echo "Copie des fichiers nécessaires..."
cp manifest.json "$BUILD_DIR/"
cp config.example.js "$BUILD_DIR/config.js"
cp popup.html "$BUILD_DIR/"
cp popup.css "$BUILD_DIR/"
cp popup.js "$BUILD_DIR/"
cp content.js "$BUILD_DIR/"
cp content.css "$BUILD_DIR/"
cp background.js "$BUILD_DIR/"
cp -r icons "$BUILD_DIR/"

echo "Création du fichier .xpi..."
cd "$BUILD_DIR"

if [ ! -f "manifest.json" ]; then
    echo "ERREUR: manifest.json manquant dans le build"
    BUILD_SUCCESS=false
    cd ..
elif ! python3 -m json.tool manifest.json > /dev/null 2>&1; then
    echo "ERREUR: manifest.json invalide"
    BUILD_SUCCESS=false
    cd ..
else
    if command -v zip > /dev/null 2>&1; then
        zip -0 -r "../$OUTPUT_FILE" * 2>/dev/null
        if [ $? -eq 0 ]; then
            BUILD_SUCCESS=true
        else
            echo "ERREUR: Échec de la création du zip"
            BUILD_SUCCESS=false
        fi
    elif command -v python3 > /dev/null 2>&1; then
        python3 -c "
import zipfile
import os
with zipfile.ZipFile('../$OUTPUT_FILE', 'w', zipfile.ZIP_STORED) as zf:
    for root, dirs, files in os.walk('.'):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, '.')
            zf.write(file_path, arcname)
print('Archive créée avec Python')
"
        if [ $? -eq 0 ]; then
            BUILD_SUCCESS=true
        else
            BUILD_SUCCESS=false
        fi
    else
        echo "ERREUR: Aucun outil de compression trouvé (zip, python3)"
        BUILD_SUCCESS=false
    fi
    cd ..
fi

echo "Nettoyage..."
rm -rf "$BUILD_DIR"

if [ "$BUILD_SUCCESS" = true ] && [ -f "$OUTPUT_FILE" ]; then
    echo "================================="
    echo "Build terminé avec succès !"
    echo "Fichier créé: $OUTPUT_FILE"
    echo "================================="
else
    echo "================================="
    echo "ERREUR: Build échoué !"
    echo "Le fichier $OUTPUT_FILE n'a pas été créé."
    echo "================================="
    exit 1
fi
echo
echo "Pour installer:"
echo "1. Allez dans about:config"
echo "2. Mettez xpinstall.signatures.required = false"
echo "3. Allez dans about:addons"
echo "4. Cliquez sur la roue dentée > \"Install Add-on From File\""
echo "5. Sélectionnez le fichier $OUTPUT_FILE"
echo
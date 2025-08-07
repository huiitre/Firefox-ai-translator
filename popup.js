document.addEventListener('DOMContentLoaded', function() {
    const sourceText = document.getElementById('sourceText');
    const targetText = document.getElementById('targetText');
    const targetLang = document.getElementById('targetLang');
    const translateButton = document.getElementById('translateBtn');
    const clearButton = document.getElementById('clearBtn');
    const loading = document.getElementById('loading');

    browser.storage.local.get(['targetLang', 'selectedText']).then(function(data) {
        if (data.targetLang) {
            targetLang.value = data.targetLang;
        }
        if (data.selectedText) {
            sourceText.value = data.selectedText;
            browser.storage.local.remove('selectedText');
        }
    });

    targetLang.addEventListener('change', function() {
        browser.storage.local.set({ targetLang: targetLang.value });
    });

    translateButton.addEventListener('click', async function() {
        const text = sourceText.value.trim();
        if (!text) {
            return;
        }

        translateButton.disabled = true;
        loading.classList.remove('hidden');
        targetText.value = '';

        try {
            const response = await browser.runtime.sendMessage({
                action: 'translate',
                text: text,
                targetLanguage: targetLang.value
            });
            
            if (response && response.success) {
                targetText.value = response.translation;
            } else {
                targetText.value = 'Erreur lors de la traduction: ' + (response?.error || 'Erreur inconnue');
            }
        } catch (error) {
            console.error('Erreur:', error);
            targetText.value = 'Erreur lors de la traduction';
        } finally {
            translateButton.disabled = false;
            loading.classList.add('hidden');
        }
    });

    clearButton.addEventListener('click', function() {
        sourceText.value = '';
        targetText.value = '';
        sourceText.focus();
    });

    sourceText.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            translateButton.click();
        }
    });

    sourceText.focus();
});
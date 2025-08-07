browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
    if (message.action === 'saveSelectedText') {
        browser.storage.local.set({ 
            selectedText: message.text 
        }).then(() => {
            sendResponse({success: true});
        });
        return true;
    }
    
    if (message.action === 'openPopup') {
        browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
            if (tabs[0]) {
                browser.tabs.sendMessage(tabs[0].id, {
                    action: 'hideTranslateIcon'
                }).catch(err => {
                    console.log('Content script not ready yet');
                });
            }
        });
        sendResponse({success: true});
    }
    
    if (message.action === 'translate') {
        translateWithClaude(message.text, message.targetLanguage)
            .then(result => {
                sendResponse({success: true, translation: result});
            })
            .catch(error => {
                console.error('Erreur traduction background:', error);
                sendResponse({success: false, error: error.message});
            });
        return true;
    }
    
    return false;
});

async function translateWithClaude(text, targetLanguage) {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: config.MODEL,
                max_tokens: config.MAX_TOKENS,
                messages: [{
                    role: 'user',
                    content: `Traduis ce texte en ${targetLanguage}. Réponds UNIQUEMENT avec la traduction, sans explication :\n\n${text}`
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.content && result.content[0] && result.content[0].text) {
            return result.content[0].text.trim();
        } else {
            throw new Error('Format de réponse inattendu');
        }
    } catch (error) {
        console.error('Erreur fetch:', error);
        throw error;
    }
}

browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('AI Translator extension installée');
    }
});

browser.browserAction.onClicked.addListener((tab) => {
    console.log('Browser action clicked');
});
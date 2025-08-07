browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    
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
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://api.anthropic.com/v1/messages', true);
        
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('x-api-key', config.ANTHROPIC_API_KEY);
        xhr.setRequestHeader('anthropic-version', '2023-06-01');
        xhr.setRequestHeader('anthropic-dangerous-direct-browser-access', 'true');
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log('XHR Status:', xhr.status);
                console.log('XHR Response:', xhr.responseText);
                
                if (xhr.status === 200) {
                    try {
                        const result = JSON.parse(xhr.responseText);
                        if (result.content && result.content[0] && result.content[0].text) {
                            resolve(result.content[0].text.trim());
                        } else {
                            reject(new Error('Format de réponse inattendu'));
                        }
                    } catch (error) {
                        reject(new Error('Erreur parsing JSON: ' + error.message));
                    }
                } else {
                    reject(new Error(`Erreur HTTP: ${xhr.status} - ${xhr.responseText}`));
                }
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('Erreur réseau'));
        };
        
        const payload = JSON.stringify({
            model: config.MODEL,
            max_tokens: config.MAX_TOKENS,
            messages: [{
                role: 'user',
                content: `Traduis ce texte en ${targetLanguage}. Réponds UNIQUEMENT avec la traduction, sans explication :\n\n${text}`
            }]
        });
        
        xhr.send(payload);
    });
}

browser.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install') {
        console.log('AI Translator extension installée');
    }
});

browser.browserAction.onClicked.addListener(function(tab) {
    console.log('Browser action clicked');
});
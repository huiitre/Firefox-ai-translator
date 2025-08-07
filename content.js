let translateIcon = null;
let selectionTimeout = null;

function createTranslateIcon() {
    if (translateIcon) {
        return translateIcon;
    }

    translateIcon = document.createElement('div');
    translateIcon.id = 'ai-translate-icon';
    translateIcon.innerHTML = '🌐';
    translateIcon.title = 'Traduire avec AI Translator';
    
    Object.assign(translateIcon.style, {
        position: 'fixed',
        zIndex: '999999',
        width: '20px',
        height: '20px',
        backgroundColor: '#3498db',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        border: '2px solid white',
        transition: 'all 0.2s ease',
        opacity: '0',
        transform: 'scale(0.8)',
        pointerEvents: 'none'
    });

    translateIcon.addEventListener('mouseenter', function() {
        translateIcon.style.transform = 'scale(1.1)';
        translateIcon.style.backgroundColor = '#2980b9';
    });

    translateIcon.addEventListener('mouseleave', function() {
        translateIcon.style.transform = 'scale(1)';
        translateIcon.style.backgroundColor = '#3498db';
    });

    translateIcon.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const selectedText = getSelectedText();
        if (selectedText) {
            browser.runtime.sendMessage({
                action: 'saveSelectedText',
                text: selectedText
            }).then(() => {
                showClickMessage();
            });
        }
        
        hideTranslateIcon();
    });

    document.body.appendChild(translateIcon);
    return translateIcon;
}

function getSelectedText() {
    const selection = window.getSelection();
    return selection.toString().trim();
}

function showTranslateIcon(x, y) {
    if (!translateIcon) {
        createTranslateIcon();
    }

    translateIcon.style.left = (x + 10) + 'px';
    translateIcon.style.top = (y + 10) + 'px';
    translateIcon.style.opacity = '1';
    translateIcon.style.transform = 'scale(1)';
    translateIcon.style.pointerEvents = 'auto';
}

function showClickMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 12px 16px;
        border-radius: 6px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    message.textContent = 'Texte sauvegardé ! Cliquez sur l\'icône AI Translator dans la barre d\'outils';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 1500);
}

function hideTranslateIcon() {
    if (translateIcon) {
        translateIcon.style.opacity = '0';
        translateIcon.style.transform = 'scale(0.8)';
        translateIcon.style.pointerEvents = 'none';
    }
}

function handleTextSelection(e) {
    if (selectionTimeout) {
        clearTimeout(selectionTimeout);
    }

    selectionTimeout = setTimeout(() => {
        const selectedText = getSelectedText();
        
        if (selectedText && selectedText.length > 0) {
            const x = e.clientX || e.pageX;
            const y = e.clientY || e.pageY;
            
            showTranslateIcon(x, y);
        } else {
            hideTranslateIcon();
        }
    }, 500);
}

function handleClickOutside(e) {
    if (translateIcon && e.target !== translateIcon) {
        const selectedText = getSelectedText();
        if (!selectedText) {
            hideTranslateIcon();
        }
    }
}

document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('keyup', function(e) {
    if (e.shiftKey || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
        e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
        (e.ctrlKey && e.key === 'a')) {
        handleTextSelection(e);
    }
});

document.addEventListener('click', handleClickOutside);

document.addEventListener('scroll', hideTranslateIcon);

browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'hideTranslateIcon') {
        hideTranslateIcon();
        sendResponse({success: true});
    }
});

window.addEventListener('beforeunload', function() {
    if (translateIcon && translateIcon.parentNode) {
        translateIcon.parentNode.removeChild(translateIcon);
    }
});
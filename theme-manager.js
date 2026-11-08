// theme-manager.js - Central Theme Manager (Day / Dark / Reading Mode)
// Controls are located on index.html, while all course chapters seamlessly listen and apply the theme.
(function () {
    let currentTheme = localStorage.getItem('site-theme') || 'normal';

    function applyTheme() {
        const existing = document.getElementById('dynamic-theme-style');
        if (existing) existing.remove();

        if (currentTheme !== 'normal') {
            const style = document.createElement('style');
            style.id = 'dynamic-theme-style';
            let css = '';

            if (currentTheme === 'dark') {
                // High-performance dark inversion mode with slate undertones
                css = `
                    html {
                        filter: invert(0.9) hue-rotate(180deg);
                    }
                    /* Prevent inversion of media, code blocks, dark accents, canvases and specific elements */
                    img, video, iframe, pre, code, canvas, svg, .bg-slate-900, .bg-slate-800, .bg-darker, .bg-dark, .no-invert, #bg-image-layer {
                        filter: invert(1) hue-rotate(180deg);
                    }
                `;
            } else if (currentTheme === 'reading') {
                // Warm sepia reading mode with soft contrast
                css = `
                    html {
                        filter: sepia(0.5) brightness(0.95);
                    }
                `;
            }

            style.textContent = css;
            document.head.appendChild(style);
        }
        updateThemeIcon();
    }

    function updateThemeIcon() {
        const btn = document.getElementById('theme-toggle-btn');
        if (!btn) return;
        
        let iconHtml = '';
        if (currentTheme === 'normal') {
            iconHtml = '☀️';
            btn.setAttribute('title', 'מצב נוכחי: יום (לחץ למעבר למצב לילה)');
        } else if (currentTheme === 'dark') {
            iconHtml = '🌙';
            btn.setAttribute('title', 'מצב נוכחי: לילה (לחץ למעבר למצב קריאה)');
        } else {
            iconHtml = '📖';
            btn.setAttribute('title', 'מצב נוכחי: קריאה (לחץ למעבר למצב יום)');
        }
        btn.innerHTML = iconHtml;
    }

    // Global toggle function (called from index.html button)
    window.toggleTheme = function() {
        if (currentTheme === 'normal') {
            currentTheme = 'dark';
        } else if (currentTheme === 'dark') {
            currentTheme = 'reading';
        } else {
            currentTheme = 'normal';
        }
        localStorage.setItem('site-theme', currentTheme);
        applyTheme();
    };

    // Apply immediately to prevent Flash of Unstyled Content (FOUC)
    applyTheme();

    // Update icon when DOM is ready
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', updateThemeIcon);
    } else {
        updateThemeIcon();
    }

    // Listen to storage events so changes in index.html instantly update any open chapter tabs
    window.addEventListener('storage', function (e) {
        if (e.key === 'site-theme') {
            currentTheme = e.newValue || 'normal';
            applyTheme();
        }
    });
})();

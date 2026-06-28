document.addEventListener('DOMContentLoaded', () => {
    // State management
    const state = {
        animal: 'fox',
        accentColor: '#a855f7',
        strokeWidth: 12,
        badgeStyle: 'outline', // 'outline' | 'solid'
        glowEnabled: true,
        canvasTheme: 'dark' // 'dark' | 'light'
    };

    // DOM Elements
    const silhouetteButtons = document.querySelectorAll('.silhouette-btn');
    const colorDots = document.querySelectorAll('.color-dot');
    const customColorPicker = document.getElementById('customColorPicker');
    const colorHexLabel = document.getElementById('colorHex');
    const strokeRange = document.getElementById('strokeRange');
    const strokeValLabel = document.getElementById('strokeValLabel');
    const styleToggleButtons = document.querySelectorAll('.style-toggle-btn');
    const glowToggle = document.getElementById('glowOptionToggle');
    const canvasThemeButtons = document.querySelectorAll('.canvas-theme-btn');
    const logoCanvas = document.getElementById('logoCanvas');
    const canvasGlow = document.getElementById('canvasGlow');
    
    // Export actions
    const downloadLogoBtn = document.getElementById('downloadLogoBtn');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const toast = document.getElementById('toastNotification');
    const quickThemeToggle = document.getElementById('quickThemeToggle');

    // SVGs / Paths
    const sandboxLogo = document.getElementById('sandboxLogo');
    const svgGlowCircle = document.getElementById('svgGlowCircle');
    const sandboxAccentRing = document.getElementById('sandboxAccentRing');
    const sandboxBaseRing = document.getElementById('sandboxBaseRing');

    // Animal Path groups
    const animalPaths = {
        fox: document.getElementById('pathFox'),
        owl: document.getElementById('pathOwl'),
        wolf: document.getElementById('pathWolf'),
        cat: document.getElementById('pathCat')
    };

    // Mockup containers
    const phoneIconContainer = document.getElementById('phoneIcon');
    const tshirtGraphicContainer = document.getElementById('tshirtGraphic');
    const cardLogoContainer = document.getElementById('cardLogo');

    // Initialize
    function init() {
        updateCustomizer();
        updateMockups();
    }

    // Main Update Function
    function updateCustomizer() {
        // 1. Update Colors
        document.documentElement.style.setProperty('--accent-color', state.accentColor);
        colorHexLabel.textContent = state.accentColor.toUpperCase();

        // Sync color dots active state
        colorDots.forEach(dot => {
            if (dot.getAttribute('data-color') === state.accentColor) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // 2. Update Stroke Width
        strokeValLabel.textContent = `${state.strokeWidth}px`;
        sandboxAccentRing.setAttribute('stroke-width', state.strokeWidth);
        sandboxBaseRing.setAttribute('stroke-width', state.strokeWidth);

        // Adjust interior silhouette stroke width proportionally
        const innerStroke = Math.max(4, Math.round(state.strokeWidth * 0.6));
        Object.values(animalPaths).forEach(group => {
            group.setAttribute('stroke-width', innerStroke);
        });

        // 3. Update Animal Selection
        Object.entries(animalPaths).forEach(([key, element]) => {
            if (key === state.animal) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });

        // 4. Update Fill Badge Style
        if (state.badgeStyle === 'solid') {
            // solid glass badge look: Fill the accent ring and base ring area
            sandboxAccentRing.setAttribute('fill', state.accentColor);
            sandboxAccentRing.setAttribute('fill-opacity', '0.15');
            sandboxBaseRing.setAttribute('fill', 'var(--base-stroke-color)');
            sandboxBaseRing.setAttribute('fill-opacity', '0.05');
        } else {
            sandboxAccentRing.setAttribute('fill', 'none');
            sandboxBaseRing.setAttribute('fill', 'none');
        }

        // 5. Update Glow toggle
        if (state.glowEnabled) {
            svgGlowCircle.style.display = 'block';
            canvasGlow.style.opacity = '0.2';
        } else {
            svgGlowCircle.style.display = 'none';
            canvasGlow.style.opacity = '0';
        }

        // 6. Update Canvas Contrast Theme
        if (state.canvasTheme === 'light') {
            logoCanvas.classList.add('light-canvas');
            document.documentElement.style.setProperty('--base-stroke-color', '#0f172a');
        } else {
            logoCanvas.classList.remove('light-canvas');
            document.documentElement.style.setProperty('--base-stroke-color', '#ffffff');
        }
    }

    // Synchronize modifications to all interactive mockups
    function updateMockups() {
        // Clone the configured SVG
        const logoSVG = sandboxLogo.cloneNode(true);
        logoSVG.removeAttribute('id');
        logoSVG.style.width = '100%';
        logoSVG.style.height = '100%';
        
        // Resolve inline variables for the mockups to ensure exact presentation
        const isLight = document.body.classList.contains('light-theme');
        const computedStyles = getComputedStyle(document.documentElement);
        const baseColorValue = isLight ? '#0f172a' : '#ffffff';
        
        logoSVG.style.setProperty('--accent-color', state.accentColor);
        logoSVG.style.setProperty('--base-stroke-color', baseColorValue);

        // Render in phone mockup
        phoneIconContainer.innerHTML = '';
        phoneIconContainer.appendChild(logoSVG.cloneNode(true));

        // Render in T-shirt mockup (we make it slightly transparent or stylized)
        tshirtGraphicContainer.innerHTML = '';
        const tshirtSVG = logoSVG.cloneNode(true);
        tshirtGraphicContainer.appendChild(tshirtSVG);

        // Render on business card
        cardLogoContainer.innerHTML = '';
        const cardSVG = logoSVG.cloneNode(true);
        // Business card styling specific overrides
        cardSVG.style.setProperty('--base-stroke-color', '#ffffff'); // Always white on dark card
        cardLogoContainer.appendChild(cardSVG);
    }

    // EVENT LISTENERS

    // 1. Animal selection
    silhouetteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            silhouetteButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.animal = btn.getAttribute('data-animal');
            updateCustomizer();
            updateMockups();
        });
    });

    // 2. Preset Colors
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            state.accentColor = dot.getAttribute('data-color');
            customColorPicker.value = state.accentColor;
            updateCustomizer();
            updateMockups();
        });
    });

    // Custom Color Picker
    customColorPicker.addEventListener('input', (e) => {
        state.accentColor = e.target.value;
        updateCustomizer();
        updateMockups();
    });

    // 3. Stroke slider
    strokeRange.addEventListener('input', (e) => {
        state.strokeWidth = parseInt(e.target.value);
        updateCustomizer();
        updateMockups();
    });

    // 4. Style Mode (Solid vs Outline)
    styleToggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            styleToggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.badgeStyle = btn.getAttribute('data-style');
            updateCustomizer();
            updateMockups();
        });
    });

    // 5. Glow toggle
    glowToggle.addEventListener('change', (e) => {
        state.glowEnabled = e.target.checked;
        updateCustomizer();
        updateMockups();
    });

    // 6. Canvas Contrast theme selector
    canvasThemeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            canvasThemeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.canvasTheme = btn.getAttribute('data-theme');
            updateCustomizer();
            updateMockups();
        });
    });

    // 7. Global Header theme toggle (light / dark)
    quickThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        updateCustomizer();
        updateMockups();
    });

    // 8. Copy SVG Code Action
    copyCodeBtn.addEventListener('click', () => {
        const svgClone = sandboxLogo.cloneNode(true);
        resolveSVGColors(svgClone);
        
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svgClone);

        navigator.clipboard.writeText(svgStr).then(() => {
            showToast();
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });

    // 9. Download SVG Action
    downloadLogoBtn.addEventListener('click', () => {
        const svgClone = sandboxLogo.cloneNode(true);
        resolveSVGColors(svgClone);

        const serializer = new XMLSerializer();
        let svgStr = serializer.serializeToString(svgClone);
        
        // Add default dark styling background to download target for stand-alone correctness
        svgStr = svgStr.replace('viewBox="0 0 200 200"', 'viewBox="0 0 200 200" style="background:#0f0f13;"');

        const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `aerofox_${state.animal}_logo.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Helpers
    function resolveSVGColors(svgElement) {
        // Replaces variables with hardcoded hexes so the SVG displays perfectly on any external viewer
        const isLight = document.body.classList.contains('light-theme');
        const baseColorValue = isLight && state.canvasTheme === 'light' ? '#0f172a' : '#ffffff';
        
        svgElement.style.setProperty('--accent-color', state.accentColor);
        svgElement.style.setProperty('--base-stroke-color', baseColorValue);
    }

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // Trigger Initial Setup
    init();
});

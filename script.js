document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const colorDots = document.querySelectorAll('.color-dot');
    const strokeWidthInput = document.getElementById('strokeWidth');
    const strokeValLabel = document.getElementById('strokeVal');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const glowToggle = document.getElementById('glowToggle');
    const downloadBtn = document.getElementById('downloadSVG');
    const interactiveLogo = document.getElementById('interactiveLogo');
    const accentRing = document.getElementById('accentRing');
    const baseRing = document.getElementById('baseRing');
    const foxHead = document.getElementById('foxHead');
    const svgGlow = document.querySelector('.svg-glow');

    // 1. Accent Color Switcher
    colorDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            // Remove active class from all
            colorDots.forEach(d => d.classList.remove('active'));
            // Add to clicked
            dot.classList.add('active');
            
            const color = dot.getAttribute('data-color');
            document.documentElement.style.setProperty('--accent-color', color);
            
            // Also update the nav logo color dynamically
            const navLogoAccent = document.querySelector('.nav-logo circle');
            if (navLogoAccent) {
                navLogoAccent.setAttribute('stroke', color);
            }
            
            // Also update any other instances (e.g. app icon inside mockups)
            const mockupAccentPaths = document.querySelectorAll('.app-icon svg path:first-child, .tshirt-graphic svg path:first-child');
            mockupAccentPaths.forEach(path => {
                path.setAttribute('stroke', color);
            });
        });
    });

    // 2. Stroke Width Slider
    strokeWidthInput.addEventListener('input', (e) => {
        const val = e.target.value;
        strokeValLabel.textContent = `${val}px`;
        
        // Update SVG strokes
        accentRing.setAttribute('stroke-width', val);
        baseRing.setAttribute('stroke-width', val);
        
        // Slightly scale the inner fox line-art stroke for proportion
        const innerStroke = Math.max(4, Math.round(val * 0.66));
        foxHead.setAttribute('stroke-width', innerStroke);
    });

    // 3. Theme Toggle
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            themeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const theme = btn.getAttribute('data-theme');
            if (theme === 'light') {
                document.body.classList.add('light-theme');
            } else {
                document.body.classList.remove('light-theme');
            }
        });
    });

    // 4. Glow Toggle
    glowToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            svgGlow.style.opacity = '0.05';
        } else {
            svgGlow.style.opacity = '0';
        }
    });

    // 5. SVG Export / Download
    downloadBtn.addEventListener('click', () => {
        // Clone the SVG element
        const svgClone = interactiveLogo.cloneNode(true);
        
        // Resolve CSS variables for the downloaded file so it works standalone
        const computedStyles = getComputedStyle(document.documentElement);
        const accentColor = computedStyles.getPropertyValue('--accent-color').trim();
        const baseColor = document.body.classList.contains('light-theme') ? '#0f172a' : '#ffffff';
        
        svgClone.style.setProperty('--accent-color', accentColor);
        svgClone.style.setProperty('--base-stroke-color', baseColor);
        
        // Serialise SVG to string
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgClone);
        
        // Inject a styled background into the exported file if it needs to look exactly like the canvas
        // (Default logo is transparent)
        svgString = svgString.replace('viewBox="0 0 200 200"', 'viewBox="0 0 200 200" style="background:#0f0f13;"');
        
        // Create Blob and download
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = 'aerofox_logo.svg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
});

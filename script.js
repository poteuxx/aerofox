document.addEventListener('DOMContentLoaded', () => {
    // Application States
    const state = {
        animal: 'fox',
        accentColor: '#a855f7',
        strokeWidth: 12,
        badgeStyle: 'outline',
        glowEnabled: true,
        canvasTheme: 'dark',
        isInjected: false,
        isInjecting: false
    };

    // Tab Files Content Database
    const tabFiles = {
        main: `local AeroFox = "Ready!"\nprint(AeroFox)\n-- Loaded integrated Cloud Script Hub\nloadstring(game:HttpGet("https://api.aerofox.xyz/hub"))()\nfireclickdetector(workspace.MainPart.ClickDetector)\nsetfpscap(240)`,
        esp: `-- Advanced ESP Configuration\nlocal ESP = loadstring(game:HttpGet("https://api.aerofox.xyz/esp"))()\nESP.Boxes = true\nESP.Tracers = true\nESP.Names = true\nprint("AeroFox ESP Loaded")`,
        fly: `-- Fly Hack Tool\nlocal Players = game:GetService("Players")\nlocal LocalPlayer = Players.LocalPlayer\nlocal Character = LocalPlayer.Character\nprint("Fly bypass activated. Speed = 50")`
    };
    let activeTabId = 'main';
    let tabCounter = 1;

    // DOM Elements - Theme Builder
    const silhouetteButtons = document.querySelectorAll('.silhouette-btn');
    const colorDots = document.querySelectorAll('.color-dot');
    const customColorPicker = document.getElementById('customColorPicker');
    const colorHexLabel = document.getElementById('colorHex');
    const strokeRange = document.getElementById('strokeRange');
    const strokeValLabel = document.getElementById('strokeValLabel');
    const styleToggleButtons = document.querySelectorAll('.style-toggle-btn');
    const downloadLogoBtn = document.getElementById('downloadLogoBtn');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const toast = document.getElementById('toastNotification');
    const quickThemeToggle = document.getElementById('quickThemeToggle');

    // SVGs / Paths
    const sandboxLogo = document.getElementById('sandboxLogo');
    const svgGlowCircle = document.getElementById('svgGlowCircle');
    const sandboxAccentRing = document.getElementById('sandboxAccentRing');
    const sandboxBaseRing = document.getElementById('sandboxBaseRing');

    const animalPaths = {
        fox: document.getElementById('pathFox'),
        owl: document.getElementById('pathOwl'),
        wolf: document.getElementById('pathWolf'),
        cat: document.getElementById('pathCat')
    };

    // DOM Elements - Simulated IDE & Console
    const simExecute = document.getElementById('simExecute');
    const simClear = document.getElementById('simClear');
    const simInject = document.getElementById('simInject');
    const injectStateDot = document.getElementById('injectStateDot');
    const injectStateText = document.getElementById('injectStateText');
    const consoleLogs = document.getElementById('consoleLogs');
    const clearConsole = document.getElementById('clearConsole');
    const downloadTrigger = document.getElementById('downloadTrigger');
    const editorCode = document.getElementById('editorCode');
    const editorLineNumbers = document.getElementById('editorLineNumbers');
    const ideTabsList = document.getElementById('ideTabsList');
    const addNewTabBtn = document.getElementById('addNewTabBtn');
    const sidebarScriptList = document.getElementById('sidebarScriptList');

    // DOM Elements - Script Hub
    const searchScripts = document.getElementById('searchScripts');
    const categoryFilter = document.getElementById('categoryFilter');
    const scriptGrid = document.getElementById('scriptGrid');
    
    // Custom Script Form
    const customScriptName = document.getElementById('customScriptName');
    const customScriptDesc = document.getElementById('customScriptDesc');
    const customScriptCategory = document.getElementById('customScriptCategory');
    const customScriptCode = document.getElementById('customScriptCode');
    const addCustomScriptBtn = document.getElementById('addCustomScriptBtn');

    // 1. Synth Audio Generation (Web Audio API)
    function playTone(freq, duration, type = "sine", volume = 0.08) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            
            gain.gain.setValueAtTime(volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Audio context not allowed or supported
        }
    }

    function sweepTone(startFreq, endFreq, duration, volume = 0.08) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
            
            gain.gain.setValueAtTime(volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Audio context not allowed
        }
    }

    // 2. Initial Setup
    function init() {
        updateCustomizer();
        setupScriptHubHandlers();
        updateLineNumbers();
        setupEditorListeners();
    }

    // Main Customizer Update
    function updateCustomizer() {
        document.documentElement.style.setProperty('--accent-color', state.accentColor);
        colorHexLabel.textContent = state.accentColor.toUpperCase();

        colorDots.forEach(dot => {
            if (dot.getAttribute('data-color') === state.accentColor) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        strokeValLabel.textContent = `${state.strokeWidth}px`;
        sandboxAccentRing.setAttribute('stroke-width', state.strokeWidth);
        sandboxBaseRing.setAttribute('stroke-width', state.strokeWidth);

        const innerStroke = Math.max(4, Math.round(state.strokeWidth * 0.6));
        Object.values(animalPaths).forEach(group => {
            if (group) group.setAttribute('stroke-width', innerStroke);
        });

        Object.entries(animalPaths).forEach(([key, element]) => {
            if (element) {
                element.style.display = key === state.animal ? 'block' : 'none';
            }
        });

        if (state.badgeStyle === 'solid') {
            sandboxAccentRing.setAttribute('fill', state.accentColor);
            sandboxAccentRing.setAttribute('fill-opacity', '0.15');
            sandboxBaseRing.setAttribute('fill', 'var(--base-stroke-color)');
            sandboxBaseRing.setAttribute('fill-opacity', '0.05');
        } else {
            sandboxAccentRing.setAttribute('fill', 'none');
            sandboxBaseRing.setAttribute('fill', 'none');
        }

        if (state.glowEnabled) {
            svgGlowCircle.style.display = 'block';
        } else {
            svgGlowCircle.style.display = 'none';
        }
    }

    // 3. Monaco IDE Live Editor Line Numbers
    function updateLineNumbers() {
        const text = editorCode.innerText || editorCode.textContent;
        const linesCount = text.split('\n').length;
        
        let numberHTML = '';
        for (let i = 1; i <= linesCount; i++) {
            numberHTML += `<span>${i}</span>`;
        }
        editorLineNumbers.innerHTML = numberHTML;
    }

    function setupEditorListeners() {
        editorCode.addEventListener('input', () => {
            updateLineNumbers();
            // Save active tab code state
            tabFiles[activeTabId] = editorCode.innerText;
        });

        // Setup IDE Tab clicks
        ideTabsList.addEventListener('click', (e) => {
            const tab = e.target.closest('.executor-tab');
            if (tab) {
                switchTab(tab.getAttribute('data-tab'));
            }
        });

        // Setup Sidebar File list click
        sidebarScriptList.addEventListener('click', (e) => {
            const item = e.target.closest('li');
            if (item) {
                switchTab(item.getAttribute('data-target-tab'));
            }
        });

        // Add New Tab Click
        addNewTabBtn.addEventListener('click', () => {
            const newTabId = `custom_script_${tabCounter++}`;
            tabFiles[newTabId] = `-- Custom Script Tab\nprint("Script ${newTabId} executed!")`;
            
            // Create DOM elements for Tab Bar
            const tabSpan = document.createElement('span');
            tabSpan.className = 'executor-tab';
            tabSpan.setAttribute('data-tab', newTabId);
            tabSpan.style.cursor = 'pointer';
            tabSpan.textContent = `script_${tabCounter - 1}.lua`;
            ideTabsList.insertBefore(tabSpan, addNewTabBtn);

            // Create DOM element for Sidebar File List
            const sidebarItem = document.createElement('li');
            sidebarItem.setAttribute('data-target-tab', newTabId);
            sidebarItem.textContent = `script_${tabCounter - 1}.lua`;
            sidebarScriptList.appendChild(sidebarItem);

            switchTab(newTabId);
            playTone(900, 0.08);
        });
    }

    function switchTab(tabId) {
        if (!tabId || !tabFiles.hasOwnProperty(tabId)) return;
        
        // Save current code
        tabFiles[activeTabId] = editorCode.innerText;
        
        // Update active tab ID
        activeTabId = tabId;

        // Sync Tab UI active classes
        document.querySelectorAll('.executor-tab').forEach(tab => {
            if (tab.getAttribute('data-tab') === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Sync Sidebar File active classes
        document.querySelectorAll('#sidebarScriptList li').forEach(li => {
            if (li.getAttribute('data-target-tab') === tabId) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });

        // Load new code
        editorCode.innerText = tabFiles[tabId];
        updateLineNumbers();
        playTone(600, 0.05);
    }

    // 4. DLL Injection
    simInject.addEventListener('click', () => {
        if (state.isInjected || state.isInjecting) return;

        state.isInjecting = true;
        injectStateText.textContent = "Injecting...";
        injectStateDot.style.background = "#f59e0b"; // Yellow
        
        appendLog("[System] AeroFox Injector initiated...", "system");
        sweepTone(300, 900, 0.8);
        
        const injectionSteps = [
            { text: "[System] Locating Roblox target window handles...", delay: 600 },
            { text: "[System] Hooking memory offsets. Bypassing Roblox anti-cheat...", delay: 1300 },
            { text: "[System] Preparing scheduler environment...", delay: 2000 },
            { text: "[System] AeroFox DLL Injected successfully!", delay: 2700 }
        ];

        injectionSteps.forEach(step => {
            setTimeout(() => {
                appendLog(step.text, step.text.includes("successfully") ? "success" : "system");
                if (step.text.includes("successfully")) {
                    state.isInjected = true;
                    state.isInjecting = false;
                    injectStateText.textContent = "Injected";
                    injectStateDot.style.background = "#10b981"; // Green
                    playTone(880, 0.15);
                    setTimeout(() => playTone(1200, 0.2), 60);
                } else {
                    playTone(400, 0.05);
                }
            }, step.delay);
        });
    });

    // 5. Code Parser Engine
    simExecute.addEventListener('click', () => {
        if (!state.isInjected) {
            appendLog("[Error] Execution failed. You must Inject DLL before executing code!", "error");
            showToast("Please Inject DLL first!", "#ef4444");
            playTone(180, 0.35, "sawtooth");
            return;
        }

        const rawCode = editorCode.innerText;
        appendLog("[Executor] Transpiling Lua bytecode...", "system");
        playTone(880, 0.1);
        setTimeout(() => playTone(1200, 0.15), 60);

        setTimeout(() => {
            parseAndSimulateLua(rawCode);
        }, 350);
    });

    // Simple Lua syntax regex statement logger
    function parseAndSimulateLua(code) {
        const lines = code.split('\n');
        let matchedOutputs = 0;

        lines.forEach(line => {
            const trimLine = line.trim();
            if (trimLine.startsWith('--') || trimLine === '') return; // Skip comments and empty lines

            // 1. Matches print(...) statements
            const printMatch = trimLine.match(/print\s*\(\s*["'](.*?)["']\s*\)/) || trimLine.match(/print\s*\(\s*(.*?)\s*\)/);
            if (printMatch) {
                appendLog(`[Console] ${printMatch[1]}`, "success");
                matchedOutputs++;
            }

            // 2. Matches warn(...) statements
            const warnMatch = trimLine.match(/warn\s*\(\s*["'](.*?)["']\s*\)/);
            if (warnMatch) {
                appendLog(`[Warning] ${warnMatch[1]}`, "system");
                matchedOutputs++;
            }

            // 3. Matches error(...) statements
            const errorMatch = trimLine.match(/error\s*\(\s*["'](.*?)["']\s*\)/);
            if (errorMatch) {
                appendLog(`[Error] ${errorMatch[1]}`, "error");
                matchedOutputs++;
            }

            // 4. Matches loadstring HTTP requests
            if (trimLine.includes("loadstring") && trimLine.includes("HttpGet")) {
                appendLog("[Executor] Pulling script source from Cloud Hub API...", "system");
                matchedOutputs++;
            }
        });

        if (matchedOutputs === 0) {
            appendLog("[Executor] Script executed successfully with 0 output log streams.", "success");
        }
    }

    simClear.addEventListener('click', () => {
        editorCode.innerText = '';
        tabFiles[activeTabId] = '';
        updateLineNumbers();
        appendLog("[Executor] Monaco editor cleared.", "system");
        playTone(600, 0.05);
        setTimeout(() => playTone(600, 0.05), 60);
    });

    // Console logging helpers
    function appendLog(message, type = "log") {
        const line = document.createElement('span');
        line.className = `log-line ${type}`;
        line.textContent = message;
        consoleLogs.appendChild(line);
        consoleLogs.scrollTop = consoleLogs.scrollHeight;
    }

    clearConsole.addEventListener('click', () => {
        consoleLogs.innerHTML = '<span class="log-line system">[System] Execution logs cleared.</span>';
        playTone(500, 0.08);
    });

    // 6. Script Hub Handlers
    function setupScriptHubHandlers() {
        searchScripts.addEventListener('input', filterScripts);
        categoryFilter.addEventListener('change', filterScripts);
        bindCardActions(document.querySelectorAll('.script-card'));
    }

    function filterScripts() {
        const searchVal = searchScripts.value.toLowerCase();
        const categoryVal = categoryFilter.value;
        const cards = scriptGrid.querySelectorAll('.script-card');

        cards.forEach(card => {
            const name = card.getAttribute('data-name').toLowerCase();
            const category = card.getAttribute('data-category');
            
            const matchSearch = name.includes(searchVal);
            const matchCategory = categoryVal === 'all' || category === categoryVal;

            if (matchSearch && matchCategory) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function bindCardActions(cards) {
        cards.forEach(card => {
            const copyBtn = card.querySelector('.copy-script-btn');
            const testBtn = card.querySelector('.test-script-btn');
            const name = card.querySelector('h3').textContent;

            copyBtn.addEventListener('click', () => {
                const code = copyBtn.getAttribute('data-script');
                navigator.clipboard.writeText(code).then(() => {
                    showToast(`Copied ${name} code!`);
                    playTone(900, 0.1);
                });
            });

            testBtn.addEventListener('click', () => {
                if (!state.isInjected) {
                    appendLog(`[Error] Failed to run ${name}: Inject DLL first!`, "error");
                    showToast("Please Inject DLL first!", "#ef4444");
                    playTone(180, 0.35, "sawtooth");
                    return;
                }
                const resultMessage = testBtn.getAttribute('data-script');
                appendLog(`[Executor] Fetching source code for ${name}...`, "system");
                playTone(800, 0.05);
                setTimeout(() => {
                    appendLog(`[Executor] Executing: loadstring(...)()`, "system");
                    appendLog(`[Console] [${name}]: ${resultMessage}`, "success");
                    playTone(1000, 0.1);
                }, 400);
            });
        });
    }

    // Publish Custom Scripts to Hub
    addCustomScriptBtn.addEventListener('click', () => {
        const name = customScriptName.value.trim();
        const desc = customScriptDesc.value.trim();
        const cat = customScriptCategory.value;
        const code = customScriptCode.value.trim();

        if (!name || !desc || !code) {
            showToast("Please fill in all script fields!", "#ef4444");
            playTone(180, 0.35, "sawtooth");
            return;
        }

        const card = document.createElement('div');
        card.className = "glass-card script-card";
        card.setAttribute('data-category', cat);
        card.setAttribute('data-name', name.toLowerCase());

        card.innerHTML = `
            <div class="script-meta-top">
                <span class="script-tag">${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                <span class="script-downloads">⚡ Local Hub</span>
            </div>
            <h3>${name}</h3>
            <p>${desc}</p>
            <div class="script-card-actions">
                <button class="btn btn-secondary btn-sm copy-script-btn" data-script="${code}">Copy Script</button>
                <button class="btn btn-primary btn-sm test-script-btn" data-script="Custom code executed: ${name}">Test Run</button>
            </div>
        `;

        scriptGrid.appendChild(card);
        bindCardActions([card]);

        customScriptName.value = '';
        customScriptDesc.value = '';
        customScriptCode.value = '';
        
        showToast(`Successfully published ${name}!`);
        playTone(880, 0.1);
        setTimeout(() => playTone(1200, 0.15), 60);
        filterScripts();
    });

    // Theme Builder Listeners
    silhouetteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            silhouetteButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.animal = btn.getAttribute('data-animal');
            updateCustomizer();
            playTone(700, 0.08);
        });
    });

    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            state.accentColor = dot.getAttribute('data-color');
            customColorPicker.value = state.accentColor;
            updateCustomizer();
            playTone(700, 0.08);
        });
    });

    customColorPicker.addEventListener('input', (e) => {
        state.accentColor = e.target.value;
        updateCustomizer();
    });

    strokeRange.addEventListener('input', (e) => {
        state.strokeWidth = parseInt(e.target.value);
        updateCustomizer();
    });

    styleToggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            styleToggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.badgeStyle = btn.getAttribute('data-style');
            updateCustomizer();
            playTone(700, 0.08);
        });
    });

    quickThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        updateCustomizer();
        playTone(600, 0.1);
    });

    copyCodeBtn.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');
        const themeVars = `/* AeroFox Custom Theme Variables */
:root {
    --accent-color: ${state.accentColor};
    --border-weight: ${state.strokeWidth}px;
    --branding-icon: "${state.animal}";
    --frosted-badge: ${state.badgeStyle === 'solid' ? 'true' : 'false'};
    --client-theme: "${isLight ? 'light' : 'dark'}";
}`;

        navigator.clipboard.writeText(themeVars).then(() => {
            showToast("Theme variables copied to clipboard!");
            playTone(900, 0.1);
        });
    });

    downloadLogoBtn.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');
        const configData = {
            themeName: "AeroFox Custom",
            accentColor: state.accentColor,
            borderWeight: state.strokeWidth,
            logoIcon: state.animal,
            badgeStyle: state.badgeStyle,
            isLightTheme: isLight
        };

        const configString = JSON.stringify(configData, null, 4);
        const blob = new Blob([configString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "aerofox_theme_config.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        playTone(1000, 0.1);
    });

    function showToast(message, bgColor = "#10b981") {
        toast.textContent = message;
        toast.style.background = bgColor;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    downloadTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        showToast("Starting AeroFox Bootstrapper.exe download...");
        playTone(1000, 0.15);
    });

    init();
});

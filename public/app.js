const app = {
    currentGame: null,
    
    // UI Management
    ui: {
        updateScore: (s) => document.getElementById('score').innerText = s,
        showConfig: (hasBot, hasPvp) => {
            let html = '';
            if(hasBot) html += `<label>Difficulty: <select id="g-diff"><option value="easy">Easy</option><option value="medium" selected>Medium</option><option value="hard">Hard</option></select></label>`;
            if(hasPvp) html += `<label>Mode: <select id="g-mode"><option value="bot">vs Bot</option><option value="pvp">2 Player</option></select></label>`;
            html += `<button class="primary" onclick="app.launchGame()">Start Game</button>`;
            document.getElementById('game-config').innerHTML = html;
        }
    },

    // Router & SEO
    router: {
        go: (route) => {
            window.location.hash = route;
            app.router.handle();
        },
        handle: () => {
            const hash = window.location.hash.replace('#', '');
            const main = document.getElementById('main-content');
            
            // Stop any running game
            if(app.currentGame && Games[app.currentGame].cleanup) Games[app.currentGame].cleanup();
            
            if(!hash) {
                // HOME VIEW
                document.title = "GameHub - 10 Free Online Games";
                main.innerHTML = `
                    <div class="text-center">
                        <h1 style="color:#2563eb; margin-bottom:0.5rem;">GameHub Arcade</h1>
                        <p style="color:#6b7280; margin-bottom:2rem;">Select a game to start playing instantly. No ads, no lag.</p>
                    </div>
                    <div class="game-grid">
                        ${Object.keys(Games).map(k => `
                            <div class="game-card" onclick="app.router.go('${k}')">
                                <div class="game-icon"><i class="fas fa-gamepad"></i></div>
                                <h3 style="text-transform:capitalize;">${k}</h3>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                // GAME VIEW
                app.currentGame = hash;
                document.title = `Play ${hash.toUpperCase()} - GameHub`;
                
                const gData = Games[hash];
                const hasBot = ['tictactoe', 'pong', 'connect4', 'rps'].includes(hash);
                const hasPvp = ['tictactoe', 'pong', 'connect4'].includes(hash);

                main.innerHTML = `
                    <div id="game-ui">
                        <div class="controls">
                            <button onclick="app.router.go('')"><i class="fas fa-arrow-left"></i> Back</button>
                            <span>Score: <b id="score" style="color:#2563eb;">0</b></span>
                            <div id="game-config" style="display:flex; gap:10px; align-items:center;"></div>
                        </div>
                        <div id="game-stage">
                            <div style="padding:50px; text-align:center; color:#6b7280;">Configuring Game...</div>
                        </div>
                    </div>
                `;
                
                // Show Config controls or auto-start
                if(hasBot || hasPvp) {
                    app.ui.showConfig(hasBot, hasPvp);
                } else {
                    document.getElementById('game-config').innerHTML = `<button class="primary" onclick="app.launchGame()">Start</button>`;
                    app.launchGame();
                }
            }
        }
    },

    launchGame: () => {
        const stage = document.getElementById('game-stage');
        const diffEl = document.getElementById('g-diff');
        const modeEl = document.getElementById('g-mode');
        
        const config = {
            difficulty: diffEl ? diffEl.value : 'medium',
            mode: modeEl ? modeEl.value : 'bot'
        };
        
        // Initialize the specific game logic
        Games[app.currentGame].init(stage, config);
    },

    gameOver: (msg) => {
        alert(msg); // Simple alert for "simple message chat form" request simplicity, can be styled modal
        app.router.go(''); // Return home
    }
};

// Start
window.addEventListener('hashchange', app.router.handle);
window.onload = app.router.handle;

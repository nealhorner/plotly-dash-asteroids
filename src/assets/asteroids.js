// Asteroids Game JavaScript

const GAME_CANVAS = "game-canvas";
const GAME_STATE_STORE = "game-state-store"
const GAME_START_STOP_BUTTON = "game-start-stop-button"
const GAME_RESET_BUTTON = "game-reset-button"
const GAME_SPEED_SLIDER = "game-speed-slider"
const GAME_ASTEROID_SLIDER = "game-asteroid-slider"
const GAME_SCORE = "game-score"
const GAME_LIVES = "game-lives"
const GAME_LEVEL = "game-level"
const DUMMY_OUTPUT = "dummy-output"

let gameStateHasChangedFlag = false;

function updateLocalStorageObject(key, updatedFields) {
    let existing = localStorage.getItem(key);
    let data = {};
    if (existing) {
        try {
            data = JSON.parse(existing);
        } catch (e) {
            data = {};
        }
    }
    Object.assign(data, updatedFields);
    localStorage.setItem(key, JSON.stringify(data));
    gameStateHasChangedFlag = true;
}

function getLocalStorageObject(key) {
    let existing = localStorage.getItem(key);
    let data = {};
    if (existing) {
        data = JSON.parse(existing);
    }
    return data;
}

function getLocalStorageFieldValue(key, field) {
    let existing = localStorage.getItem(key);
    let data = {};
    if (existing) {
        data = JSON.parse(existing);
    }
    return data[field];
}


// Audio Manager
class AudioManager {
    constructor() {
        this.sounds = {};
        this.initialized = false;
        this.audioContext = null;
    }
    
    async initialize() {
        if (this.initialized) return;
        
        try {
            // Create audio context (required for modern browsers)
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Define all sound files
            const soundFiles = {
                fire: '/assets/audio/fire.wav',
                thrust: '/assets/audio/thrust.wav',
                bangLarge: '/assets/audio/bangLarge.wav',
                bangMedium: '/assets/audio/bangMedium.wav',
                bangSmall: '/assets/audio/bangSmall.wav',
                beat1: '/assets/audio/beat1.wav',
                beat2: '/assets/audio/beat2.wav',
                extraShip: '/assets/audio/extraShip.wav',
                saucerBig: '/assets/audio/saucerBig.wav',
                saucerSmall: '/assets/audio/saucerSmall.wav'
            };
            
            // Preload all sounds
            for (const [name, path] of Object.entries(soundFiles)) {
                const audio = new Audio(path);
                audio.preload = 'auto';
                // Load the audio
                await audio.load();
                this.sounds[name] = audio;
            }
            
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize audio:', error);
        }
    }
    
    play(soundName, volume = 0.5) {
        if (!this.initialized) {
            console.warn('Audio not initialized yet. Call initialize() first from a user interaction.');
            return;
        }
        
        const sound = this.sounds[soundName];
        if (sound) {
            // Clone the audio node to allow overlapping sounds
            const clone = sound.cloneNode();
            clone.volume = 0.5; // Adjust volume as needed
            clone.play().catch(error => {
                console.error(`Error playing sound ${soundName}:`, error);
            });
        } else {
            console.warn(`Sound ${soundName} not found`);
        }
    }
    
    playLooping(soundName) {
        if (!this.initialized) return;
        
        const sound = this.sounds[soundName];
        if (sound) {
            sound.loop = true;
            sound.volume = 0.3;
            sound.play().catch(error => {
                console.error(`Error playing looping sound ${soundName}:`, error);
            });
        }
    }
    
    stop(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }
}


class AsteroidsGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Initialize audio manager
        this.audioManager = new AudioManager();
        
        // Game state
        // TODO lock in speed and count.
        this.gameData = {
            asteroids: [],
            bullets: [],
            keys: {}  
        };
        
        this.init();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'ArrowUp') {
                this.gameData.keys[e.code] = true;
            } else if (e.code === 'Space' && !this.gameData.keys['Space']) {
                console.log(this.gameData.keys['Space'])
                this.gameData.keys[e.code] = true;
            }
            e.preventDefault();
        });
        
        document.addEventListener('keyup', (e) => {
            this.gameData.keys[e.code] = false;
            e.preventDefault();
        });
    }
    
    init() {
        this.resetShip();
        this.setupEventListeners()
        this.createAsteroids();
    }

    triggerDashCallback() {
        // Trigger the Dash callback to update the game info display and real-time charts
        if (gameStateHasChangedFlag) {
            document.getElementById(DUMMY_OUTPUT).click();
        }
    }
    
    createAsteroid(x, y, size) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        return {
            x: x,
            y: y,
            size: size,
            angle: angle,
            velocityX: Math.cos(angle) * speed,
            velocityY: Math.sin(angle) * speed
        };
    }
    
    createAsteroids() {
        const count = 5 + getLocalStorageFieldValue(GAME_STATE_STORE, 'level') - 1;

        for (let i = 0; i < count; i++) {
            let x, y;
            do {
                x = Math.random() * this.width;
                y = Math.random() * this.height;
            } while (Math.sqrt((x - this.gameData.spaceship.x)**2 + (y - this.gameData.spaceship.y)**2) < 100);
            
            this.gameData.asteroids.push(this.createAsteroid(x, y, Math.random() * 30 + 20));
        }
    }
    
    updateSpaceship() {
        const ship = this.gameData.spaceship;
        const rotationSpeed = 0.1;
        const acceleration = 0.3;
        const maxSpeed = 5;
        
        if (this.gameData.keys['ArrowLeft']) {
            ship.angle -= rotationSpeed;
        }
        if (this.gameData.keys['ArrowRight']) {
            ship.angle += rotationSpeed;
        }
        if (this.gameData.keys['ArrowUp']) {
            ship.velocityX += Math.cos(ship.angle) * acceleration;
            ship.velocityY += Math.sin(ship.angle) * acceleration;
            this.audioManager.play('thrust');
        }
        if (this.gameData.keys['Space']) {
            this.fireBullet();
            this.gameData.keys['Space'] = false;
        }
        
        // Apply friction
        ship.velocityX *= 0.98;
        ship.velocityY *= 0.98;
        
        // Limit speed
        const speed = Math.sqrt(ship.velocityX**2 + ship.velocityY**2);
        if (speed > maxSpeed) {
            ship.velocityX = (ship.velocityX / speed) * maxSpeed;
            ship.velocityY = (ship.velocityY / speed) * maxSpeed;
        }
        
        // Update position
        ship.x += ship.velocityX;
        ship.y += ship.velocityY;
        
        // Wrap around screen
        if (ship.x < 0) ship.x = this.width;
        if (ship.x > this.width) ship.x = 0;
        if (ship.y < 0) ship.y = this.height;
        if (ship.y > this.height) ship.y = 0;
    }
    
    fireBullet() {
        const ship = this.gameData.spaceship;
        const bulletSpeed = 8;
        this.gameData.bullets.push({
            x: ship.x,
            y: ship.y,
            velocityX: Math.cos(ship.angle) * bulletSpeed,
            velocityY: Math.sin(ship.angle) * bulletSpeed,
            life: 60
        });
        
        // Play fire sound
        this.audioManager.play('fire');
    }
    
    updateAsteroids() {
        this.gameData.asteroids.forEach(asteroid => {
            asteroid.x += asteroid.velocityX;
            asteroid.y += asteroid.velocityY;
            
            // Wrap around screen
            if (asteroid.x < 0) asteroid.x = this.width;
            if (asteroid.x > this.width) asteroid.x = 0;
            if (asteroid.y < 0) asteroid.y = this.height;
            if (asteroid.y > this.height) asteroid.y = 0;
        });
    }
    
    updateBullets() {
        this.gameData.bullets = this.gameData.bullets.filter(bullet => {
            bullet.x += bullet.velocityX;
            bullet.y += bullet.velocityY;
            bullet.life--;
            
            return bullet.life > 0 && bullet.x > 0 && bullet.x < this.width && 
                   bullet.y > 0 && bullet.y < this.height;
        });
    }
    
    checkCollisions() {
        const ship = this.gameData.spaceship;
        
        // Check ship-asteroid collisions

        for (const asteroid of this.gameData.asteroids) {
            const distance = Math.sqrt((ship.x - asteroid.x)**2 + (ship.y - asteroid.y)**2);
            if (distance < 20 + asteroid.size) {
                let lives = getLocalStorageFieldValue(GAME_STATE_STORE, 'lives');
                lives = Math.max(lives - 1, 0);
                updateLocalStorageObject(GAME_STATE_STORE, { lives: lives });
                this.resetShip();
                this.audioManager.play('bangLarge');
                this.gameData.asteroids = [];
                this.gameData.bullets = [];
                this.createAsteroids();
                break;
            }
        }
    
        // Check bullet-asteroid collisions
        this.gameData.bullets.forEach((bullet, bulletIndex) => {
            this.gameData.asteroids.forEach((asteroid, asteroidIndex) => {
                const distance = Math.sqrt((bullet.x - asteroid.x)**2 + (bullet.y - asteroid.y)**2);
                if (distance < asteroid.size) {
                    let score = getLocalStorageFieldValue(GAME_STATE_STORE, 'score');
                    score += 100;
                    updateLocalStorageObject(GAME_STATE_STORE, { score: score });
                    this.gameData.bullets.splice(bulletIndex, 1);
                    this.gameData.asteroids.splice(asteroidIndex, 1);
                    
                    // Play appropriate explosion sound based on size
                    if (asteroid.size > 30) {
                        this.audioManager.play('bangLarge');
                        // Create smaller asteroids
                        for (let i = 0; i < 2; i++) {
                            this.gameData.asteroids.push(this.createAsteroid(
                                asteroid.x, asteroid.y, asteroid.size / 2
                            ));
                        }
                    } else if (asteroid.size > 15) {
                        this.audioManager.play('bangMedium');
                    } else {
                        this.audioManager.play('bangSmall');
                    }
                }
            });
        });
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw spaceship
        const ship = this.gameData.spaceship;
        this.ctx.save();
        this.ctx.translate(ship.x, ship.y);
        this.ctx.rotate(ship.angle);
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(20, 0);
        this.ctx.lineTo(-10, -10);
        this.ctx.lineTo(-5, 0);
        this.ctx.lineTo(-10, 10);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
        
        // Draw asteroids
        this.ctx.strokeStyle = '#FFFFFF';
        this.gameData.asteroids.forEach(asteroid => {
            this.ctx.beginPath();
            this.ctx.arc(asteroid.x, asteroid.y, asteroid.size, 0, Math.PI * 2);
            this.ctx.stroke();
        });
        
        // Draw bullets
        this.ctx.fillStyle = '#FFFFFF';
        this.gameData.bullets.forEach(bullet => {
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw UI
        this.ctx.fillStyle = '#00FF00';
        
        if (getLocalStorageFieldValue(GAME_STATE_STORE, 'game_over')) {
            this.ctx.fillStyle = '#FF0000';
            this.ctx.font = '40px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2);
            this.ctx.textAlign = 'left';
        }
    }
    
    gameLoop() {
        if (!getLocalStorageFieldValue(GAME_STATE_STORE, 'game_over') && getLocalStorageFieldValue(GAME_STATE_STORE, 'game_running')) {
            this.updateSpaceship();
            this.updateAsteroids();
            this.updateBullets();
            this.checkCollisions();
            
            // Check game over
            if (getLocalStorageFieldValue(GAME_STATE_STORE, 'lives') <= 0) {
                updateLocalStorageObject(GAME_STATE_STORE, { game_over: true, game_running: false });
            }
            
            // Check level complete
            if (this.gameData.asteroids.length === 0) {
                let level = getLocalStorageFieldValue(GAME_STATE_STORE, 'level');
                updateLocalStorageObject(GAME_STATE_STORE, { level: level + 1 });
                this.createAsteroids();
                this.resetShip();
                this.gameData.bullets = [];
                this.gameData.keys = {};
            }

            this.draw();    
            this.triggerDashCallback();

            requestAnimationFrame(() => this.gameLoop());
        }
        this.draw();
        this.triggerDashCallback();
    }
    
    start() {
        // Start the game
        updateLocalStorageObject(GAME_STATE_STORE, {
            game_over: false,
            game_running: true,
        });
        this.gameLoop();
    }

    resetShip() {
        this.gameData.spaceship = {
            x: this.width / 2,
            y: this.height / 2,
            angle: 0,
            velocityX: 0,
            velocityY: 0
        };
    }
    
    reset() {
        updateLocalStorageObject(GAME_STATE_STORE, {
            game_over: false,
            game_running: false,
            score: 0,
            lives: 3,
            level: 1,
        });
        this.gameData.asteroids = [];
        this.gameData.bullets = [];
        this.resetShip();
        this.createAsteroids();
        this.draw();
        this.triggerDashCallback();
    }
}


function initializeGame() {
    // Initialize the game if it is not already initialized
    if (!window.asteroidsGame) {
        window.asteroidsGame = new AsteroidsGame(GAME_CANVAS);
    }
}


window.dash_clientside = Object.assign({}, window.dash_clientside, {
    clientside: {
        handle_start_stop_button_click: async function(gameStateStore, _n_clicks) {

            if (gameStateStore.game_running) {
                return dash_clientside.no_update
            }

            initializeGame();
            
            // Initialize audio on first interaction
            if (window.asteroidsGame && !window.asteroidsGame.audioManager.initialized) {
                await window.asteroidsGame.audioManager.initialize();
            }
            
            if (gameStateStore && !gameStateStore.game_over) {
                if (gameStateStore.game_running) {
                    window.asteroidsGame.pause();
                } else {
                    window.asteroidsGame.start();
                }
            }
            return dash_clientside.no_update
        },
        handle_reset_button_click: function(_n_clicks, disabled) {

            if (disabled) {
                return dash_clientside.no_update
            }

            // Initialize the game if it is not already initialized
            initializeGame();

            updateLocalStorageObject(GAME_STATE_STORE, {
                game_over: false,
                game_running: false,
                score: 0,
                lives: 3,
                level: 1,
            });
            
            window.asteroidsGame.reset();
            return getLocalStorageObject(GAME_STATE_STORE);
        },
        trigger_game_display_update: function(n_clicks) {
            // Notify Dash that the game state has been updated by returning the local storage game state.
            // Updating the local storage object alone is not enough for Dash to realize the game state has been updated.
            if (!gameStateHasChangedFlag) {
                return dash_clientside.no_update
            }
            gameStateHasChangedFlag = false;
            return getLocalStorageObject(GAME_STATE_STORE)
        }
    }
});
// rmc88 - Remote Control Client

class RMCRemoteClient {
    constructor() {
        this.connected = false;
        this.connectionCheckInterval = null;
        
        // Load saved settings
        this.settings = this.loadSettings();
        
        // Touch tracking
        this.lastTouchX = 0;
        this.lastTouchY = 0;
        this.isTouching = false;
        this.touchStartTime = 0;
        this.isTwoFingerScroll = false;
        this.lastPinchDistance = 0;
        this.lastScrollY = 0;
        this.moveThrottle = 10; // ms between mouse move commands
        this.lastMoveTime = 0;
        this.pendingMove = null;
        
        // Debounce timer for commands
        this.commandQueue = [];
        this.commandInProgress = false;
        
        this.initElements();
        this.initEventListeners();
        this.applySettings();
    }
    
    initElements() {
        this.touchpad = document.getElementById('touchpad');
        this.keyboardSection = document.getElementById('keyboardSection');
        this.settingsModal = document.getElementById('settingsModal');
        this.connectionStatus = document.getElementById('connectionStatus');
        this.statusDot = document.querySelector('.status-dot');
        this.statusText = document.querySelector('.status-text');
        
        // Settings elements
        this.serverIpInput = document.getElementById('serverIp');
        this.serverPortInput = document.getElementById('serverPort');
        this.sensitivityInput = document.getElementById('sensitivity');
        this.sensitivityValue = document.getElementById('sensitivityValue');
        
        // Buttons
        this.settingsBtn = document.getElementById('settingsBtn');
        this.connectBtn = document.getElementById('connectBtn');
        this.testConnectionBtn = document.getElementById('testConnectionBtn');
        this.closeSettingsBtn = document.getElementById('closeSettings');
        this.keyboardToggleBtn = document.getElementById('keyboardToggleBtn');
        this.leftClickBtn = document.getElementById('leftClickBtn');
        this.rightClickBtn = document.getElementById('rightClickBtn');
        this.scrollUpBtn = document.getElementById('scrollUpBtn');
        this.scrollDownBtn = document.getElementById('scrollDownBtn');
        this.releaseAllBtn = document.getElementById('releaseAllBtn');
    }
    
    initEventListeners() {
        // Settings modal
        this.settingsBtn.addEventListener('click', () => this.toggleSettings(true));
        this.closeSettingsBtn.addEventListener('click', () => this.toggleSettings(false));
        this.connectBtn.addEventListener('click', () => this.connect());
        this.testConnectionBtn.addEventListener('click', () => this.testConnection());
        
        // Connection status click to reconnect
        this.connectionStatus.addEventListener('click', () => this.toggleSettings(true));
        
        // Sensitivity
        this.sensitivityInput.addEventListener('input', () => {
            this.sensitivityValue.textContent = `${this.sensitivityInput.value}x`;
            this.settings.sensitivity = parseFloat(this.sensitivityInput.value);
            this.saveSettings();
        });
        
        // Touchpad events
        this.initTouchpadEvents();
        
        // Quick actions
        this.leftClickBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.sendCommand({action: 'mouse_click', button: 'left'});
        });
        
        this.rightClickBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.sendCommand({action: 'mouse_click', button: 'right'});
        });
        
        this.scrollUpBtn.addEventListener('click', () => {
            this.sendCommand({action: 'scroll', amount: 3});
        });
        
        this.scrollDownBtn.addEventListener('click', () => {
            this.sendCommand({action: 'scroll', amount: -3});
        });
        
        this.keyboardToggleBtn.addEventListener('click', () => {
            this.keyboardSection.classList.toggle('active');
        });
        
        this.releaseAllBtn.addEventListener('click', () => {
            this.sendCommand({action: 'release_all'});
            this.showNotification('All keys released!', 'success');
        });
        
        // Shortcut buttons
        document.querySelectorAll('.shortcut-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const hotkey = btn.dataset.hotkey;
                const keys = hotkey.split('+');
                this.sendCommand({action: 'hotkey', keys: keys});
            });
        });
        
        // Keyboard events
        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleKeyPress(key, true);
            });
            
            key.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleKeyPress(key, false);
            });
            
            key.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.handleKeyPress(key, true);
            });
            
            key.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.handleKeyPress(key, false);
            });
        });
        
        // Save settings on page unload
        window.addEventListener('beforeunload', () => {
            this.saveSettings();
        });
    }
    
    initTouchpadEvents() {
        // Mouse events (for desktop testing)
        this.touchpad.addEventListener('mousedown', (e) => {
            this.isTouching = true;
            this.lastTouchX = e.clientX;
            this.lastTouchY = e.clientY;
            this.touchStartTime = Date.now();
        });
        
        this.touchpad.addEventListener('mousemove', (e) => {
            if (!this.isTouching) return;
            
            const now = Date.now();
            if (now - this.lastMoveTime >= this.moveThrottle) {
                const dx = (e.clientX - this.lastTouchX) * this.settings.sensitivity;
                const dy = (e.clientY - this.lastTouchY) * this.settings.sensitivity;
                
                this.sendCommand({
                    action: 'mouse_move',
                    dx: dx,
                    dy: dy
                });
                
                this.lastMoveTime = now;
                this.lastTouchX = e.clientX;
                this.lastTouchY = e.clientY;
            }
        });
        
        this.touchpad.addEventListener('mouseup', (e) => {
            this.isTouching = false;
            
            if (Date.now() - this.touchStartTime < 200) {
                this.sendCommand({action: 'mouse_click', button: 'left'});
            }
        });
        
        // Touch events (for mobile)
        this.touchpad.addEventListener('touchstart', (e) => {
            e.preventDefault();
            
            if (e.touches.length === 1) {
                this.isTouching = true;
                this.isTwoFingerScroll = false;
                this.lastTouchX = e.touches[0].clientX;
                this.lastTouchY = e.touches[0].clientY;
                this.touchStartTime = Date.now();
                this.lastMoveTime = Date.now();
            } else if (e.touches.length === 2) {
                // Two finger scroll
                this.isTwoFingerScroll = true;
                this.isTouching = false;
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                this.lastPinchDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
                this.lastScrollY = (touch1.clientY + touch2.clientY) / 2;
            }
        }, {passive: false});
        
        this.touchpad.addEventListener('touchmove', (e) => {
            e.preventDefault();
            
            const now = Date.now();
            
            if (this.isTouching && e.touches.length === 1) {
                // Throttle mouse movement commands
                if (now - this.lastMoveTime >= this.moveThrottle) {
                    const dx = (e.touches[0].clientX - this.lastTouchX) * this.settings.sensitivity;
                    const dy = (e.touches[0].clientY - this.lastTouchY) * this.settings.sensitivity;
                    
                    this.sendCommand({
                        action: 'mouse_move',
                        dx: dx,
                        dy: dy
                    });
                    
                    this.lastMoveTime = now;
                    this.lastTouchX = e.touches[0].clientX;
                    this.lastTouchY = e.touches[0].clientY;
                }
            } else if (this.isTwoFingerScroll && e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentY = (touch1.clientY + touch2.clientY) / 2;
                const dy = this.lastScrollY - currentY;
                
                if (Math.abs(dy) > 3) {
                    this.sendCommand({
                        action: 'scroll',
                        amount: dy * 0.15
                    });
                    this.lastScrollY = currentY;
                }
            }
        }, {passive: false});
        
        this.touchpad.addEventListener('touchend', (e) => {
            e.preventDefault();
            
            if (e.touches.length === 0) {
                if (this.isTouching && Date.now() - this.touchStartTime < 200) {
                    this.sendCommand({action: 'mouse_click', button: 'left'});
                }
                this.isTouching = false;
                this.isTwoFingerScroll = false;
            }
        }, {passive: false});
    }
    
    handleKeyPress(keyElement, isPressed) {
        const key = keyElement.dataset.key;
        
        if (!key) return;
        
        // Visual feedback
        if (isPressed) {
            keyElement.classList.add('pressed');
        } else {
            keyElement.classList.remove('pressed');
        }
        
        // Map special keys
        const keyMap = {
            'escape': 'esc',
            'backspace': 'backspace',
            'capslock': 'capslock',
            'enter': 'enter',
            'shift': 'shift',
            'ctrl': 'ctrl',
            'win': 'win',
            'alt': 'alt',
            'space': 'space',
            'left': 'left',
            'right': 'right',
            'up': 'up',
            'down': 'down',
            'tab': 'tab'
        };
        
        const mappedKey = keyMap[key] || key;
        
        if (isPressed) {
            // For special keys, use keyDown
            if (['shift', 'ctrl', 'alt', 'win', 'capslock'].includes(mappedKey)) {
                this.sendCommand({action: 'key_down', key: mappedKey});
            } else {
                // For normal keys, just press
                this.sendCommand({action: 'key_press', key: mappedKey});
            }
        } else {
            // Release special keys
            if (['shift', 'ctrl', 'alt', 'win', 'capslock'].includes(mappedKey)) {
                this.sendCommand({action: 'key_up', key: mappedKey});
            }
        }
    }
    
    async connect() {
        const ip = this.serverIpInput.value.trim();
        const port = parseInt(this.serverPortInput.value);
        const sensitivity = parseFloat(this.sensitivityInput.value);
        
        if (!ip || !port) {
            alert('Please enter valid IP address and port');
            return;
        }
        
        // Save settings
        this.settings.ip = ip;
        this.settings.port = port;
        this.settings.sensitivity = sensitivity;
        this.saveSettings();
        
        // Test connection
        this.setConnectionStatus('connecting');
        
        try {
            const response = await fetch(this.getServerUrl('/ping'));
            const data = await response.json();
            
            if (data.status === 'ok') {
                this.setConnectionStatus('connected');
                this.toggleSettings(false);
                this.showNotification('Connected successfully!', 'success');
                this.startConnectionCheck();
            } else {
                this.setConnectionStatus('disconnected');
                this.showNotification('Connection failed', 'error');
            }
        } catch (error) {
            this.setConnectionStatus('disconnected');
            this.showNotification('Cannot reach server. Check IP and port.', 'error');
            console.error('Connection error:', error);
        }
    }
    
    async testConnection() {
        const ip = this.serverIpInput.value.trim();
        const port = parseInt(this.serverPortInput.value);
        
        if (!ip || !port) {
            alert('Please enter valid IP address and port');
            return;
        }
        
        this.setConnectionStatus('connecting');
        
        try {
            const tempUrl = `http://${ip}:${port}`;
            const response = await fetch(`${tempUrl}/ping`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });
            
            if (response.ok) {
                const data = await response.json();
                this.showNotification(`Server found! Screen: ${data.screen.width}x${data.screen.height}`, 'success');
                this.setConnectionStatus('connected');
            } else {
                throw new Error('Server not responding');
            }
        } catch (error) {
            this.setConnectionStatus('disconnected');
            this.showNotification('Cannot reach server', 'error');
        }
    }
    
    async sendCommand(command) {
        if (!this.settings.ip || !this.settings.port) {
            console.warn('Not connected to server');
            return;
        }
        
        try {
            const response = await fetch(this.getServerUrl('/command'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(command),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === 'error') {
                console.error('Server error:', data.message);
            }
            
        } catch (error) {
            console.error('Error sending command:', error);
            this.setConnectionStatus('disconnected');
        }
    }
    
    getServerUrl(path) {
        return `http://${this.settings.ip}:${this.settings.port}${path}`;
    }
    
    setConnectionStatus(status) {
        this.connected = status === 'connected';
        this.statusDot.className = 'status-dot';
        
        switch(status) {
            case 'connected':
                this.statusDot.classList.add('connected');
                this.statusText.textContent = 'Connected';
                break;
            case 'connecting':
                this.statusDot.classList.add('connecting');
                this.statusText.textContent = 'Connecting...';
                break;
            case 'disconnected':
            default:
                this.statusText.textContent = 'Disconnected';
        }
    }
    
    startConnectionCheck() {
        // Clear existing interval
        if (this.connectionCheckInterval) {
            clearInterval(this.connectionCheckInterval);
        }
        
        // Check connection every 5 seconds
        this.connectionCheckInterval = setInterval(async () => {
            try {
                const response = await fetch(this.getServerUrl('/ping'), {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                });
                
                if (response.ok) {
                    this.setConnectionStatus('connected');
                } else {
                    this.setConnectionStatus('disconnected');
                }
            } catch (error) {
                this.setConnectionStatus('disconnected');
            }
        }, 5000);
    }
    
    toggleSettings(show) {
        if (show) {
            this.settingsModal.classList.add('active');
        } else {
            this.settingsModal.classList.remove('active');
        }
    }
    
    loadSettings() {
        const saved = localStorage.getItem('rmc88_settings');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Error parsing settings:', e);
            }
        }
        
        return {
            ip: '',
            port: 5555,
            sensitivity: 1.5
        };
    }
    
    saveSettings() {
        localStorage.setItem('rmc88_settings', JSON.stringify(this.settings));
    }
    
    applySettings() {
        if (this.settings.ip) {
            this.serverIpInput.value = this.settings.ip;
        }
        this.serverPortInput.value = this.settings.port;
        this.sensitivityInput.value = this.settings.sensitivity;
        this.sensitivityValue.textContent = `${this.settings.sensitivity}x`;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(59, 130, 246, 0.9)'};
            color: white;
            border-radius: 10px;
            font-size: 0.9rem;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the client
document.addEventListener('DOMContentLoaded', () => {
    window.rmc88 = new RMCRemoteClient();
});

class VoiceBot {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.voiceSettings = {
            rate: 0.9,
            pitch: 1,
            volume: 1,
            voice: null
        };
        
        this.initElements();
        this.initSpeechRecognition();
        this.initEventListeners();
        this.initVoiceControls();
        
        this.addMessage('Hello! I\'m your personal voice bot. You can ask me questions by speaking or typing. Try one of the sample questions below!', 'bot');
    }

    initElements() {
        this.chatMessages = document.getElementById('chatMessages');
        this.startBtn = document.getElementById('startListening');
        this.stopBtn = document.getElementById('stopListening');
        this.textInput = document.getElementById('textInput');
        this.sendBtn = document.getElementById('sendText');
        this.status = document.getElementById('status');
        this.sampleBtns = document.querySelectorAll('.sample-btn');
        
        // Voice control elements
        this.voiceSelect = document.getElementById('voiceSelect');
        this.rateSlider = document.getElementById('rateSlider');
        this.pitchSlider = document.getElementById('pitchSlider');
        this.rateValue = document.getElementById('rateValue');
        this.pitchValue = document.getElementById('pitchValue');
    }

    initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            this.recognition = new SpeechRecognition();
        }

        if (this.recognition) {
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateUI();
                this.updateStatus('Listening... Speak now!');
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.addMessage(transcript, 'user');
                this.sendToBot(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.updateStatus(`Error: ${event.error}`);
                this.isListening = false;
                this.updateUI();
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateUI();
                this.updateStatus('Ready to listen...');
            };
        } else {
            this.updateStatus('Speech recognition not supported in this browser');
            this.startBtn.disabled = true;
        }
    }

    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.startListening());
        this.stopBtn.addEventListener('click', () => this.stopListening());
        this.sendBtn.addEventListener('click', () => this.sendTextMessage());
        
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendTextMessage();
            }
        });

        this.sampleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                this.addMessage(question, 'user');
                this.sendToBot(question);
            });
        });
    }

    initVoiceControls() {
        // Populate voice dropdown
        const populateVoices = () => {
            const voices = this.synthesis.getVoices();
            this.voiceSelect.innerHTML = '<option value="">Default Voice</option>';
            
            voices.forEach((voice, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${voice.name} (${voice.lang})`;
                if (voice.name.includes('Natural') || voice.name.includes('Enhanced')) {
                    option.textContent += ' ⭐';
                }
                this.voiceSelect.appendChild(option);
            });
        };

        // Load voices (they load asynchronously)
        if (this.synthesis.getVoices().length === 0) {
            this.synthesis.addEventListener('voiceschanged', populateVoices);
        } else {
            populateVoices();
        }

        // Voice selection handler
        this.voiceSelect.addEventListener('change', (e) => {
            const voiceIndex = e.target.value;
            if (voiceIndex === '') {
                this.voiceSettings.voice = null;
            } else {
                this.voiceSettings.voice = this.synthesis.getVoices()[voiceIndex];
            }
        });

        // Rate slider handler
        this.rateSlider.addEventListener('input', (e) => {
            this.voiceSettings.rate = parseFloat(e.target.value);
            this.rateValue.textContent = this.voiceSettings.rate;
        });

        // Pitch slider handler
        this.pitchSlider.addEventListener('input', (e) => {
            this.voiceSettings.pitch = parseFloat(e.target.value);
            this.pitchValue.textContent = this.voiceSettings.pitch;
        });
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    sendTextMessage() {
        const message = this.textInput.value.trim();
        if (message) {
            this.addMessage(message, 'user');
            this.sendToBot(message);
            this.textInput.value = '';
        }
    }

    async sendToBot(message) {
        try {
            // Add loading message
            const loadingId = this.addMessage('Thinking...', 'bot', true);
            
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            
            // Remove loading message
            this.removeMessage(loadingId);

            if (data.error) {
                this.addMessage(`Sorry, I encountered an error: ${data.error}`, 'bot');
            } else {
                this.addMessage(data.response, 'bot');
                this.speakResponse(data.response);
            }
        } catch (error) {
            console.error('Error:', error);
            this.addMessage('Sorry, I\'m having trouble connecting. Please try again.', 'bot');
        }
    }

    speakResponse(text) {
        if (this.synthesis) {
            // Cancel any ongoing speech
            this.synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = this.voiceSettings.rate;
            utterance.pitch = this.voiceSettings.pitch;
            utterance.volume = this.voiceSettings.volume;
            
            // Use selected voice or fallback to natural voice
            if (this.voiceSettings.voice) {
                utterance.voice = this.voiceSettings.voice;
            } else {
                const voices = this.synthesis.getVoices();
                const preferredVoice = voices.find(voice => 
                    voice.name.includes('Natural') || 
                    voice.name.includes('Enhanced') ||
                    voice.localService === true
                );
                if (preferredVoice) {
                    utterance.voice = preferredVoice;
                }
            }
            
            this.synthesis.speak(utterance);
        }
    }

    addMessage(text, sender, isLoading = false) {
        const messageDiv = document.createElement('div');
        const messageId = Date.now() + Math.random();
        messageDiv.id = `message-${messageId}`;
        messageDiv.className = `message ${sender}-message`;
        
        if (isLoading) {
            messageDiv.innerHTML = `<span class="loading">${text}</span>`;
        } else {
            messageDiv.textContent = text;
        }
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        return messageId;
    }

    removeMessage(messageId) {
        const messageElement = document.getElementById(`message-${messageId}`);
        if (messageElement) {
            messageElement.remove();
        }
    }

    updateUI() {
        this.startBtn.disabled = this.isListening;
        this.stopBtn.disabled = !this.isListening;
        
        if (this.isListening) {
            this.startBtn.classList.add('listening');
        } else {
            this.startBtn.classList.remove('listening');
        }
    }

    updateStatus(text) {
        this.status.textContent = text;
    }
}

// Initialize the voice bot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VoiceBot();
}); 
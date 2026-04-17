/* ===================================
   Student Habit Tracker - Focus Mode Module
   Handle Pomodoro timer and study mode
   =================================== */

const FocusMode = {
    isRunning: false,
    isPaused: false,
    timeLeft: 25 * 60,
    totalTime: 25 * 60,
    currentMode: 'work',
    sessionsCompleted: 0,
    interval: null,
    sessionStartTime: null,

    init() {
        this.loadSettings();
        this.bindEvents();
        this.updateDisplay();
        this.renderStats();
    },

    loadSettings() {
        const settings = Storage.getSettings();
        this.totalTime = settings.pomodoroWork * 60;
        this.timeLeft = this.totalTime;
        
        const workBtn = document.getElementById('workSetting');
        const breakBtn = document.getElementById('breakSetting');
        if (workBtn) workBtn.innerHTML = `<i class="bi bi-book me-2"></i>Fokus (${settings.pomodoroWork}m)`;
        if (breakBtn) breakBtn.innerHTML = `<i class="bi bi-cup-hot me-2"></i>Istirahat (${settings.pomodoroBreak}m)`;
    },

    bindEvents() {
        const playBtn = document.getElementById('focusPlayBtn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.toggleTimer());
        }

        const resetBtn = document.getElementById('focusResetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetTimer());
        }

        const skipBtn = document.getElementById('focusSkipBtn');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.skipSession());
        }

        const workBtn = document.getElementById('workSetting');
        if (workBtn) {
            workBtn.addEventListener('click', () => this.setMode('work'));
        }

        const breakBtn = document.getElementById('breakSetting');
        if (breakBtn) {
            breakBtn.addEventListener('click', () => this.setMode('break'));
        }

        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                this.toggleTimer();
            }
            if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) {
                this.resetTimer();
            }
            if (e.code === 'Escape') {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            }
        });
    },

    toggleTimer() {
        if (this.isRunning && !this.isPaused) {
            this.pause();
        } else {
            this.start();
        }
    },

    start() {
        if (this.isRunning && !this.isPaused) return;

        this.isRunning = true;
        this.isPaused = false;
        this.sessionStartTime = dayjs().format('YYYY-MM-DD HH:mm:ss');

        this.updatePlayButton();

        this.interval = setInterval(() => {
            this.tick();
        }, 1000);
    },

    pause() {
        this.isPaused = true;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.updatePlayButton();
    },

    stop() {
        this.isRunning = false;
        this.isPaused = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.updatePlayButton();
    },

    tick() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
        } else {
            this.completeSession();
        }
    },

    completeSession() {
        this.stop();
        
        if (this.currentMode === 'work') {
            this.saveSession();
            Storage.addXP(15);
            UI.showToast('+15 XP! Sesi fokus selesai!', 'success', 'bi-star-fill');

            this.sessionsCompleted++;
            
            const settings = Storage.getSettings();
            if (this.sessionsCompleted % 4 === 0) {
                this.currentMode = 'longBreak';
                this.totalTime = settings.pomodoroLongBreak * 60;
            } else {
                this.currentMode = 'break';
                this.totalTime = settings.pomodoroBreak * 60;
            }

            this.playNotificationSound();
        } else {
            this.currentMode = 'work';
            const settings = Storage.getSettings();
            this.totalTime = settings.pomodoroWork * 60;
        }

        this.timeLeft = this.totalTime;
        this.updateDisplay();
        this.updateModeIndicator();
        this.renderStats();
    },

    saveSession() {
        const duration = Math.round((this.totalTime - this.timeLeft) / 60);
        if (duration > 0) {
            Storage.addFocusSession({
                duration: duration,
                mode: this.currentMode,
                startTime: this.sessionStartTime,
                endTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
            });
        }
    },

    resetTimer() {
        this.stop();
        const settings = Storage.getSettings();
        
        if (this.currentMode === 'work') {
            this.totalTime = settings.pomodoroWork * 60;
        } else if (this.currentMode === 'break') {
            this.totalTime = settings.pomodoroBreak * 60;
        } else {
            this.totalTime = settings.pomodoroLongBreak * 60;
        }
        
        this.timeLeft = this.totalTime;
        this.updateDisplay();
    },

    skipSession() {
        this.stop();
        
        const settings = Storage.getSettings();
        if (this.currentMode === 'work') {
            this.currentMode = 'break';
            this.totalTime = settings.pomodoroBreak * 60;
        } else {
            this.currentMode = 'work';
            this.totalTime = settings.pomodoroWork * 60;
        }
        
        this.timeLeft = this.totalTime;
        this.updateDisplay();
        this.updateModeIndicator();
    },

    setMode(mode) {
        this.stop();
        const settings = Storage.getSettings();
        
        this.currentMode = mode;
        
        if (mode === 'work') {
            this.totalTime = settings.pomodoroWork * 60;
        } else if (mode === 'break') {
            this.totalTime = settings.pomodoroBreak * 60;
        } else {
            this.totalTime = settings.pomodoroLongBreak * 60;
        }
        
        this.timeLeft = this.totalTime;
        this.updateDisplay();
        this.updateModeIndicator();
        
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${mode}Setting`)?.classList.add('active');
    },

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const timerEl = document.getElementById('focusTimer');
        if (timerEl) {
            timerEl.textContent = timeString;
        }

        document.title = `${timeString} - Mode Fokus`;
    },

    updatePlayButton() {
        const btn = document.getElementById('focusPlayBtn');
        if (!btn) return;

        if (this.isRunning && !this.isPaused) {
            btn.innerHTML = '<i class="bi bi-pause-fill"></i>';
            btn.classList.remove('focus-btn-control', 'primary');
            btn.classList.add('focus-btn-control', 'secondary');
        } else {
            btn.innerHTML = '<i class="bi bi-play-fill"></i>';
            btn.classList.remove('focus-btn-control', 'secondary');
            btn.classList.add('focus-btn-control', 'primary');
        }
    },

    updateModeIndicator() {
        const labelEl = document.getElementById('focusLabel');
        if (labelEl) {
            if (this.currentMode === 'work') {
                labelEl.textContent = 'Mode Fokus - Konsentrasi Penuh!';
            } else if (this.currentMode === 'break') {
                labelEl.textContent = 'Istirahat Singkat - Rileks!';
            } else {
                labelEl.textContent = 'Istirahat Panjang - Recharge!';
            }
        }

        const sessionEl = document.getElementById('sessionCounter');
        if (sessionEl) {
            sessionEl.textContent = `Sesi: ${this.sessionsCompleted}`;
        }
    },

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    },

    playNotificationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            const playNote = (freq, startTime, duration) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.1, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
            };

            const now = audioContext.currentTime;
            playNote(523.25, now, 0.2);
            playNote(659.25, now + 0.2, 0.2);
            playNote(783.99, now + 0.4, 0.3);
        } catch (e) {
            // Audio not supported
        }
    },

    renderStats() {
        UI.renderFocusStats();
    },

    getTodaySessions() {
        const sessions = Storage.getFocusSessions();
        const today = dayjs().format('YYYY-MM-DD');
        return sessions.filter(s => s.date === today && s.mode === 'work').length;
    },

    getTodayMinutes() {
        return Storage.getTodayFocusTime();
    },

    getWeeklyFocusData() {
        const sessions = Storage.getFocusSessions();
        const weeklyData = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
            const daySessions = sessions.filter(s => s.date === date && s.mode === 'work');
            const totalMinutes = daySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
            
            weeklyData.push({
                date: dayjs(date).format('ddd'),
                minutes: totalMinutes
            });
        }
        
        return weeklyData;
    }
};
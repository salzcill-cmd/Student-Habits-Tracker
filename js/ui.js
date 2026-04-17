/* ===================================
   Student Habit Tracker - UI Module
   Handle all UI rendering and interactions
   =================================== */

const UI = {
    quotes: [
        "Pendidikan adalah senjata paling ampuh yang bisa kamu gunakan untuk mengubah dunia. - Nelson Mandela",
        "Belajar tidak tahu waktu dan usia. - Artemus Ward",
        "Ilmu adalah kunci untuk membuka pintu-pintu kehidupan. - Apollos",
        "Satu hari dengan belajar di waktu muda lebih baik dari seribu hari dengan waktu luang. - Pepatah Jepang",
        "Jangan belajar untuk sekolah, tapi belajar untuk kehidupan. - Ralph Waldo Emerson",
        "Pendidikan adalah ticket untuk masa depan. - Malala Yousafzai",
        "Kegagalan adalah guru terbaik dalam kehidupan. - Albert Einstein",
        "Jika kamu tidak bisa melakukannya dengan hebat, lakukan dengan hebat dengan cara berbeda. - Steve Jobs",
        "Kesuksesan adalah 1% inspirasi dan 99% kerja keras. - Thomas Edison",
        "Mimpi tidak akan berhasil jika kamu tidak melakukannya. - Les Brown",
        "Hari ini kamu harus melakukan apa yang orang lain tidak lakukan, agar besok kamu bisa memiliki apa yang orang lain tidak punya.",
        "Waktu yang hilang tidak akan pernah ditemukan lagi. - Benjamin Franklin",
        "Jangan takut melambat, takutlah jika kamu berhenti.",
        "Setiap expert awalnya adalah beginner. - Helen Hayes",
        "Pengetahuan berbicara, kebijaksanaan mendengarkan. - Jim Holloway"
    ],

    categoryIcons: {
        belajar: 'bi-book',
        olahraga: 'bi-person-arms-up',
        membaca: 'bi-book-half',
        tugas: 'bi-pen',
        pengembangan: 'bi-lightbulb'
    },

    init() {
        this.initDarkMode();
        this.initTheme();
        this.initTooltips();
        this.initToastContainer();
    },

    initDarkMode() {
        const settings = Storage.getSettings();
        if (settings.darkMode) {
            document.body.classList.add('dark-mode');
        }

        const toggle = document.getElementById('darkModeToggle');
        if (toggle) {
            toggle.checked = settings.darkMode;
            toggle.addEventListener('change', (e) => {
                document.body.classList.toggle('dark-mode', e.target.checked);
                Storage.updateSettings({ darkMode: e.target.checked });
            });
        }
    },

    initTheme() {
        const settings = Storage.getSettings();
        if (settings.theme) {
            document.documentElement.setAttribute('data-theme', settings.theme);
        }
    },

    initTooltips() {
        setTimeout(() => {
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
                [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
            }
        }, 100);
    },

    initToastContainer() {
        if (!document.querySelector('.toast-container')) {
            const container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    },

    showQuote() {
        const quoteEl = document.getElementById('motivationalQuote');
        if (quoteEl) {
            const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
            quoteEl.textContent = `"${randomQuote}"`;
            return randomQuote;
        }
        return '';
    },

    showToast(message, type = 'success', icon = 'bi-check-circle') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = this.createToastContainer();
        }
        
        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.innerHTML = `
            <i class="bi ${icon} text-${type}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);

        if (type === 'success' && Storage.getSettings().soundEnabled) {
            this.playSound('success');
        }

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 300);
        }, 3000);
    },

    createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    },

    playSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            if (type === 'success') {
                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                gainNode.gain.value = 0.1;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
                
                setTimeout(() => {
                    const osc2 = audioContext.createOscillator();
                    const gain2 = audioContext.createGain();
                    osc2.connect(gain2);
                    gain2.connect(audioContext.destination);
                    osc2.frequency.value = 1000;
                    osc2.type = 'sine';
                    gain2.gain.value = 0.1;
                    osc2.start();
                    osc2.stop(audioContext.currentTime + 0.15);
                }, 100);
            }
        } catch (e) {
            // Audio not supported
        }
    },

    renderUserProfile(containerId = 'userProfile') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const user = Storage.getUser();
        const xpPercentage = user.xpToNextLevel > 0 ? (user.xp / user.xpToNextLevel) * 100 : 0;

        container.innerHTML = `
            <div class="text-center">
                <div class="mb-3">
                    <i class="bi bi-person-circle display-1 text-primary"></i>
                </div>
                <h4>${this.escapeHtml(user.name)}</h4>
                <span class="badge bg-primary mb-2">Level ${user.level}</span>
                <div class="xp-container">
                    <div class="xp-bar">
                        <div class="xp-fill" style="width: ${xpPercentage}%"></div>
                    </div>
                    <small class="text-muted">${user.xp} / ${user.xpToNextLevel} XP</small>
                </div>
            </div>
        `;
    },

    renderStreak(containerId = 'streakBadge') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const user = Storage.getUser();
        container.innerHTML = `
            <span class="streak-badge">
                <i class="bi bi-fire"></i>
                ${user.streak} Hari Streak!
            </span>
        `;
    },

    renderTodaySchedule(containerId = 'todaySchedule') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const habits = Storage.getHabits().filter(h => h.frequency === 'harian');
        const today = dayjs().format('YYYY-MM-DD');
        const completions = Storage.getCompletions(today);

        if (habits.length === 0) {
            container.innerHTML = `
                <div class="text-center py-3">
                    <i class="bi bi-calendar-x text-muted" style="font-size: 2rem;"></i>
                    <p class="text-muted small mb-0">Belum ada kebiasaan harian</p>
                </div>
            `;
            return;
        }

        container.innerHTML = habits.slice(0, 5).map(habit => {
            const isCompleted = !!completions[habit.id];
            const icon = this.categoryIcons[habit.category] || 'bi-check-circle';
            
            return `
                <a href="habits.html" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2">
                    <span class="small">
                        <i class="bi ${icon} me-2" style="color: ${habit.color}"></i>
                        ${this.escapeHtml(habit.name)}
                    </span>
                    <i class="bi ${isCompleted ? 'bi-check-circle-fill text-success' : 'bi-circle'}"></i>
                </a>
            `;
        }).join('');
    },

    renderBadges(containerId = 'badgesContainer') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const user = Storage.getUser();
        const allBadges = [
            { id: 'beginner', name: 'Pemula', icon: 'bi-star', color: '#f6c23e' },
            { id: 'consistent', name: 'Konsisten', icon: 'bi-calendar-check', color: '#1cc88a' },
            { id: 'dedicated', name: 'Berdedikasi', icon: 'bi-heart', color: '#e74a3b' },
            { id: 'scholar', name: 'Scholar', icon: 'bi-mortarboard', color: '#4e73df' },
            { id: 'master', name: 'Master', icon: 'bi-award', color: '#9b59b6' },
            { id: 'legend', name: 'Legend', icon: 'bi-gem', color: '#e67e22' }
        ];

        container.innerHTML = allBadges.map(badge => {
            const isEarned = user.badges && user.badges.some(b => b.id === badge.id);
            return `
                <div class="badge-custom ${isEarned ? '' : 'opacity-50'}" 
                     style="background: ${isEarned ? badge.color + '20' : 'var(--bs-secondary-bg, #f8f9fa)'}; 
                            color: ${isEarned ? badge.color : 'var(--bs-secondary-color, #6c757d)'}">
                    <i class="bi ${badge.icon}"></i>
                    <span>${badge.name}</span>
                </div>
            `;
        }).join('');
    },

    renderHabitsList(containerId = 'habitsList', habits = null, completions = null, isDraggable = true) {
        const container = document.getElementById(containerId);
        if (!container) return;

        habits = habits || Storage.getHabits();
        const today = dayjs().format('YYYY-MM-DD');
        completions = completions || Storage.getCompletions(today);

        if (habits.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-clipboard-plus display-1 text-muted"></i>
                    <h5 class="mt-3">Belum Ada Kebiasaan</h5>
                    <p class="text-muted">Tambahkan kebiasaan pertamamu!</p>
                    <button class="btn btn-primary" onclick="if(document.getElementById('addHabitBtn'))document.getElementById('addHabitBtn').click()">
                        <i class="bi bi-plus-lg me-2"></i>Tambah Kebiasaan
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = habits.map(habit => {
            const isCompleted = !!completions[habit.id];
            const icon = this.categoryIcons[habit.category] || 'bi-check-circle';
            const categoryLabels = {
                belajar: 'Belajar',
                olahraga: 'Olahraga',
                membaca: 'Membaca',
                tugas: 'Tugas',
                pengembangan: 'Pengembangan'
            };

            return `
                <div class="list-group-item habit-item ${isCompleted ? 'completed' : ''}" 
                     data-id="${habit.id}"
                     style="border-left: 4px solid ${habit.color}">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-3 flex-grow-1">
                            ${isDraggable ? '<i class="bi bi-grip-vertical handle text-muted" style="cursor: grab;"></i>' : ''}
                            <div class="habit-icon" style="background: ${habit.color}20; color: ${habit.color}">
                                <i class="bi ${habit.icon || icon}"></i>
                            </div>
                            <div class="flex-grow-1">
                                <div class="habit-name">${this.escapeHtml(habit.name)}</div>
                                <div class="habit-meta">
                                    <span class="habit-category category-${habit.category}">${categoryLabels[habit.category] || habit.category}</span>
                                    <span class="ms-2">Target: ${habit.target}x/${habit.frequency}</span>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-sm btn-outline-success rounded-circle" onclick="Habits.toggleCompletion('${habit.id}')">
                                <i class="bi ${isCompleted ? 'bi-check-lg' : 'bi-plus'}"></i>
                            </button>
                            <div class="dropdown">
                                <button class="btn btn-sm btn-outline-secondary rounded-circle" data-bs-toggle="dropdown">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li><a class="dropdown-item" href="#" onclick="Habits.editHabit('${habit.id}'); return false;">
                                        <i class="bi bi-pencil me-2"></i>Edit
                                    </a></li>
                                    <li><a class="dropdown-item text-danger" href="#" onclick="Habits.deleteHabit('${habit.id}'); return false;">
                                        <i class="bi bi-trash me-2"></i>Hapus
                                    </a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        if (isDraggable && typeof Sortable !== 'undefined') {
            this.initSortable(containerId);
        }
    },

    initSortable(containerId) {
        const container = document.getElementById(containerId);
        if (!container || container.sortableInitialized) return;

        container.sortableInitialized = true;
        
        new Sortable(container, {
            animation: 200,
            handle: '.handle',
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            onEnd: (evt) => {
                const habits = Storage.getHabits();
                const [moved] = habits.splice(evt.oldIndex, 1);
                habits.splice(evt.newIndex, 0, moved);
                Storage.reorderHabits(habits);
            }
        });
    },

    renderCalendar(containerId = 'calendarGrid', year = null, month = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        year = year || dayjs().year();
        month = month !== null ? month : dayjs().month();

        const firstDay = dayjs().year(year).month(month).startOf('month');
        const daysInMonth = firstDay.daysInMonth();
        const startDay = firstDay.day();

        const completions = Storage.getCompletions();
        const dailyHabits = Storage.getHabits().filter(h => h.frequency === 'harian').length;

        let html = '';

        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        days.forEach(day => {
            html += `<div class="text-center text-muted fw-bold py-2 small">${day}</div>`;
        });

        for (let i = 0; i < startDay; i++) {
            html += `<div class="calendar-day"></div>`;
        }

        const today = dayjs().format('YYYY-MM-DD');
        
        for (let day = 1; day <= daysInMonth; day++) {
            const monthStr = (month + 1).toString().padStart(2, '0');
            const dayStr = day.toString().padStart(2, '0');
            const dateStr = `${year}-${monthStr}-${dayStr}`;
            const dayCompletions = completions[dateStr] ? Object.keys(completions[dateStr]).length : 0;
            const isProductive = dailyHabits > 0 && dayCompletions >= dailyHabits * 0.8;
            const isToday = dateStr === today;

            html += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${isProductive ? 'productive' : ''} ${dayCompletions > 0 ? 'has-tasks' : ''}"
                     data-date="${dateStr}"
                     onclick="UI.selectDate('${dateStr}')"
                     style="cursor: pointer;">
                    ${day}
                </div>
            `;
        }

        container.innerHTML = html;
    },

    selectDate(date) {
        document.querySelectorAll('.calendar-day.selected').forEach(el => {
            el.classList.remove('selected');
        });

        const dayEl = document.querySelector(`.calendar-day[data-date="${date}"]`);
        if (dayEl) {
            dayEl.classList.add('selected');
        }

        this.showDateDetails(date);
    },

    showDateDetails(date) {
        const container = document.getElementById('dateDetails');
        if (!container) return;

        const completions = Storage.getCompletions(date);
        const habits = Storage.getHabits();
        const dayCompletions = Object.keys(completions).length;

        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0"><i class="bi bi-calendar-event me-2"></i>${dayjs(date).format('dddd, DD MMMM YYYY')}</h5>
                </div>
                <div class="card-body">
                    <h6 class="mb-3">Kebiasaan Selesai: ${dayCompletions}</h6>
                    <div class="list-group">
                        ${habits.length === 0 ? '<p class="text-muted">Belum ada kebiasaan</p>' : habits.map(habit => {
                            const isCompleted = !!completions[habit.id];
                            const icon = this.categoryIcons[habit.category] || 'bi-check-circle';
                            return `
                                <div class="list-group-item d-flex justify-content-between align-items-center">
                                    <span>
                                        <i class="bi ${habit.icon || icon} me-2" style="color: ${habit.color}"></i>
                                        ${this.escapeHtml(habit.name)}
                                    </span>
                                    <i class="bi ${isCompleted ? 'bi-check-circle-fill text-success' : 'bi-x-circle text-muted'}"></i>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    renderStatsCards() {
        const stats = Storage.getOverallStats();

        const elements = {
            'totalHabits': stats.totalHabits,
            'dailyHabits': stats.dailyHabits,
            'streak': stats.streak,
            'productiveDays': stats.productiveDays,
            'totalCompletions': stats.totalCompletions,
            'level': stats.level,
            'badges': stats.badges,
            'longestStreak': stats.longestStreak
        };

        Object.keys(elements).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = elements[id];
        });

        const levelEl = document.getElementById('level');
        if (levelEl) levelEl.textContent = 'Level ' + stats.level;

        const xpFill = document.getElementById('xpFill');
        const xpText = document.getElementById('xpText');
        if (xpFill && stats.xpToNextLevel > 0) {
            xpFill.style.width = `${(stats.xp / stats.xpToNextLevel) * 100}%`;
        }
        if (xpText) {
            xpText.textContent = `${stats.xp} / ${stats.xpToNextLevel} XP`;
        }
    },

    renderHabitStats() {
        const container = document.getElementById('habitStatsList');
        if (!container) return;

        const habits = Storage.getHabits();
        
        if (habits.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-clipboard-plus display-1 text-muted"></i>
                    <h5 class="mt-3">Belum Ada Data</h5>
                    <p class="text-muted">Tambahkan kebiasaan untuk melihat statistik!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = habits.map(habit => {
            const stats = Storage.getHabitStats(habit.id);
            const icon = this.categoryIcons[habit.category] || 'bi-check-circle';

            return `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between mb-2">
                            <div class="d-flex align-items-center gap-2">
                                <div class="habit-icon" style="background: ${habit.color}20; color: ${habit.color}">
                                    <i class="bi ${habit.icon || icon}"></i>
                                </div>
                                <span class="fw-bold">${this.escapeHtml(habit.name)}</span>
                            </div>
                            <span class="badge bg-primary">${stats.consistency}%</span>
                        </div>
                        <div class="progress" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="width: ${stats.consistency}%; background: ${habit.color}"></div>
                        </div>
                        <small class="text-muted mt-2 d-block">
                            ${stats.completedDays} dari ${stats.totalDays} hari selesai
                        </small>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderFocusStats() {
        const sessions = Storage.getFocusSessions();
        const today = dayjs().format('YYYY-MM-DD');
        const todaySessions = sessions.filter(s => s.date === today);
        const todayMinutes = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0);

        const totalSessions = sessions.length;
        const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

        const totalEl = document.getElementById('totalFocusSessions');
        const totalMinEl = document.getElementById('totalFocusMinutes');
        const todayMinEl = document.getElementById('todayFocusMinutes');

        if (totalEl) totalEl.textContent = totalSessions;
        if (totalMinEl) totalMinEl.textContent = Math.round(totalMinutes);
        if (todayMinEl) todayMinEl.textContent = todayMinutes;
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Add toast animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
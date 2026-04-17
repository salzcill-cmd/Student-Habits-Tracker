/* ===================================
   Student Habit Tracker - Main App
   Controller for all pages
   =================================== */

const App = {
    currentPage: '',

    init() {
        this.detectPage();
        this.initUI();
        this.initModules();
        this.initEventListeners();
    },

    detectPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        if (filename.includes('habits')) {
            this.currentPage = 'habits';
        } else if (filename.includes('statistik')) {
            this.currentPage = 'statistik';
        } else if (filename.includes('kalender')) {
            this.currentPage = 'kalender';
        } else if (filename.includes('fokus')) {
            this.currentPage = 'fokus';
        } else {
            this.currentPage = 'dashboard';
        }
    },

    initUI() {
        UI.init();
        
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50
            });
        }
    },

    initModules() {
        switch (this.currentPage) {
            case 'dashboard':
                this.initDashboard();
                break;
            case 'habits':
                Habits.init();
                this.initHabitsPage();
                break;
            case 'statistik':
                this.initStatistik();
                break;
            case 'kalender':
                this.initKalender();
                break;
            case 'fokus':
                FocusMode.init();
                break;
        }
    },

    initDashboard() {
        UI.showQuote();
        UI.renderUserProfile();
        UI.renderStreak();
        UI.renderTodaySchedule();
        UI.renderBadges();
        ChartManager.init();
        this.initDashboardData();
    },

    initDashboardData() {
        const progress = Storage.getTodayProgress();
        const user = Storage.getUser();
        
        const completedEl = document.getElementById('completedCount');
        const totalEl = document.getElementById('totalCount');
        const percentEl = document.getElementById('progressPercent');
        
        if (completedEl) completedEl.textContent = progress.completed;
        if (totalEl) totalEl.textContent = progress.total;
        if (percentEl) percentEl.textContent = progress.percentage + '%';
        
        const progressRing = document.getElementById('progressRing');
        if (progressRing) {
            const circumference = 2 * Math.PI * 54;
            const offset = circumference - (progress.percentage / 100) * circumference;
            progressRing.style.strokeDashoffset = offset;
        }
        
        const longestStreakEl = document.getElementById('longestStreak');
        if (longestStreakEl) longestStreakEl.textContent = user.longestStreak;
        
        const weekAvgEl = document.getElementById('weekAvg');
        if (weekAvgEl) {
            const weeklyData = Storage.getWeeklyData();
            const avg = weeklyData.length > 0 ? Math.round(weeklyData.reduce((sum, d) => sum + d.percentage, 0) / weeklyData.length) : 0;
            weekAvgEl.textContent = 'Rata-rata: ' + avg + '%';
        }
    },

    initHabitsPage() {
        // Initialize today's checklist
        if (typeof window.renderTodayChecklist === 'function') {
            window.renderTodayChecklist();
        }
        
        // Update today's date display
        const todayDateEl = document.getElementById('todayDate');
        if (todayDateEl) {
            todayDateEl.textContent = dayjs().format('DD MMMM YYYY');
        }
        
        // Setup filter listeners
        this.setupFilterListeners();
    },

    setupFilterListeners() {
        const categoryFilter = document.getElementById('categoryFilter');
        const frequencyFilter = document.getElementById('frequencyFilter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                const habits = Storage.getHabits();
                const filtered = e.target.value ? habits.filter(h => h.category === e.target.value) : habits;
                const today = dayjs().format('YYYY-MM-DD');
                const completions = Storage.getCompletions(today);
                UI.renderHabitsList('habitsList', filtered, completions);
            });
        }
        
        if (frequencyFilter) {
            frequencyFilter.addEventListener('change', (e) => {
                const habits = Storage.getHabits();
                const filtered = e.target.value ? habits.filter(h => h.frequency === e.target.value) : habits;
                const today = dayjs().format('YYYY-MM-DD');
                const completions = Storage.getCompletions(today);
                UI.renderHabitsList('habitsList', filtered, completions);
            });
        }
    },

    initStatistik() {
        ChartManager.init();
        ChartManager.renderStatsCharts();
        UI.renderStatsCards();
        UI.renderHabitStats();
        
        // Set stats page specific data
        this.initStatistikData();
    },

    initStatistikData() {
        const trendEl = document.getElementById('productivityTrend');
        if (trendEl) {
            const trend = ChartManager.getProductivityTrend();
            trendEl.innerHTML = `
                <i class="bi bi-${trend === 'improving' ? 'arrow-up' : trend === 'declining' ? 'arrow-down' : 'minus'}-circle me-1"></i>
                ${trend === 'improving' ? 'Meningkat' : trend === 'declining' ? 'Menurun' : 'Stabil'}
            `;
        }
        
        const bestDayEl = document.getElementById('bestDay');
        if (bestDayEl) bestDayEl.textContent = ChartManager.getBestDay();
        
        const worstDayEl = document.getElementById('worstDay');
        if (worstDayEl) worstDayEl.textContent = ChartManager.getWorstDay();
    },

    initKalender() {
        this.initKalenderData();
        UI.renderCalendar();
        
        // Select today by default
        setTimeout(() => {
            const today = dayjs().format('YYYY-MM-DD');
            UI.selectDate(today);
        }, 500);
    },

    initKalenderData() {
        const monthEl = document.getElementById('currentMonth');
        const yearEl = document.getElementById('currentYear');
        const monthNameEl = document.getElementById('monthName');
        
        const currentMonth = dayjs().month();
        
        if (monthEl) monthEl.dataset.month = currentMonth;
        if (monthNameEl) monthNameEl.textContent = dayjs().month(currentMonth).format('MMMM');
        if (yearEl) yearEl.textContent = dayjs().year();
        
        // Calculate monthly summary
        const monthlyData = Storage.getMonthlyData();
        const productiveDays = monthlyData.filter(d => d.isProductive).length;
        const totalCompleted = monthlyData.reduce((sum, d) => sum + d.completed, 0);
        const activeDays = monthlyData.filter(d => d.completed > 0).length;
        const dailyHabits = Storage.getHabits().filter(h => h.frequency === 'harian').length;
        
        const prodEl = document.getElementById('monthProductiveDays');
        const compEl = document.getElementById('monthTotalCompleted');
        const activeEl = document.getElementById('monthActiveDays');
        const rateEl = document.getElementById('monthCompletionRate');
        
        if (prodEl) prodEl.textContent = productiveDays;
        if (compEl) compEl.textContent = totalCompleted;
        if (activeEl) activeEl.textContent = activeDays;
        if (rateEl) rateEl.textContent = dailyHabits > 0 ? Math.round((totalCompleted / (dailyHabits * monthlyData.length)) * 100) + '%' : '0%';
    },

    initEventListeners() {
        // Export data button
        const exportBtn = document.getElementById('exportDataBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        // Import data button
        const importBtn = document.getElementById('importDataBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.importData());
        }

        // Clear data button
        const clearBtn = document.getElementById('clearDataBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAllData());
        }

        // Theme selector
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeTheme(e.target.dataset.theme));
        });

        // Sound toggle
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            const settings = Storage.getSettings();
            soundToggle.checked = settings.soundEnabled;
            
            soundToggle.addEventListener('change', (e) => {
                Storage.updateSettings({ soundEnabled: e.target.checked });
            });
        }

        // Add sample habits button
        const sampleBtn = document.getElementById('addSampleHabitsBtn');
        if (sampleBtn) {
            sampleBtn.addEventListener('click', () => this.addSampleHabits());
        }

        // Month navigation
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');
        
        if (prevMonth) {
            prevMonth.addEventListener('click', () => this.changeMonth(-1));
        }
        if (nextMonth) {
            nextMonth.addEventListener('click', () => this.changeMonth(1));
        }

        // Setup midnight reset
        this.setupMidnightCheck();
    },

    exportData() {
        const data = Storage.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `student-habit-tracker-backup-${dayjs().format('YYYY-MM-DD')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        UI.showToast('Data berhasil diexport!', 'success');
    },

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const result = Storage.importData(event.target.result);
                if (result) {
                    UI.showToast('Data berhasil diimport!', 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Import',
                        text: 'Format file tidak valid!'
                    });
                }
            };
            reader.readAsText(file);
        });
        
        input.click();
    },

    clearAllData() {
        Swal.fire({
            title: 'Hapus Semua Data?',
            text: 'Tindakan ini tidak dapat dibatalkan.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e74a3b',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                Storage.clearAllData();
                UI.showToast('Semua data berhasil dihapus!', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        });
    },

    changeTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        Storage.updateSettings({ theme });
        
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });

        UI.showToast(`Tema "${theme}" diterapkan!`, 'success');
    },

    addSampleHabits() {
        Habits.addSampleHabits();
        UI.showToast('Sample habits berhasil ditambahkan!', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    },

    changeMonth(delta) {
        const monthEl = document.getElementById('currentMonth');
        const yearEl = document.getElementById('currentYear');
        const monthNameEl = document.getElementById('monthName');
        
        if (monthEl && yearEl && monthNameEl) {
            let month = parseInt(monthEl.dataset.month);
            let year = parseInt(yearEl.textContent);
            
            month += delta;
            if (month < 0) {
                month = 11;
                year--;
            } else if (month > 11) {
                month = 0;
                year++;
            }
            
            monthEl.dataset.month = month;
            monthNameEl.textContent = dayjs().month(month).format('MMMM');
            yearEl.textContent = year;
            
            UI.renderCalendar('calendarGrid', year, month);
            
            // Update monthly stats
            this.initKalenderData();
        }
    },

    setupMidnightCheck() {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setDate(midnight.getDate() + 1);
        midnight.setHours(0, 0, 0, 0);
        
        const msUntilMidnight = midnight - now;
        
        if (msUntilMidnight > 0 && msUntilMidnight < 86400000) {
            setTimeout(() => {
                window.location.reload();
            }, msUntilMidnight);
        }
    },

    updateDashboard() {
        if (this.currentPage === 'dashboard') {
            this.initDashboardData();
            UI.renderProgress();
            UI.renderStreak();
            UI.renderUserProfile();
            UI.renderTodaySchedule();
            UI.renderBadges();
            ChartManager.updateWeeklyChart();
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
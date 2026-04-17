/* ===================================
   Student Habit Tracker - Storage Module
   Handle all localStorage operations
   =================================== */

const Storage = {
    KEYS: {
        HABITS: 'student_habit_tracker_habits',
        COMPLETIONS: 'student_habit_tracker_completions',
        USER: 'student_habit_tracker_user',
        SETTINGS: 'student_habit_tracker_settings',
        FOCUS_SESSIONS: 'student_habit_tracker_focus_sessions',
        LAST_LOGIN: 'student_habit_tracker_last_login'
    },

    defaultUser: {
        name: 'Pelajar',
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        streak: 0,
        longestStreak: 0,
        totalCompleted: 0,
        badges: [],
        createdAt: null
    },

    defaultSettings: {
        darkMode: false,
        theme: 'blue',
        soundEnabled: true,
        pomodoroWork: 25,
        pomodoroBreak: 5,
        pomodoroLongBreak: 15
    },

    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting data:', key, error);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error setting data:', key, error);
            return false;
        }
    },

    init() {
        if (!this.get(this.KEYS.USER)) {
            const user = { ...this.defaultUser, createdAt: dayjs().format('YYYY-MM-DD') };
            this.set(this.KEYS.USER, user);
        }

        if (!this.get(this.KEYS.SETTINGS)) {
            this.set(this.KEYS.SETTINGS, this.defaultSettings);
        }

        if (!this.get(this.KEYS.HABITS)) {
            this.set(this.KEYS.HABITS, []);
        }

        if (!this.get(this.KEYS.COMPLETIONS)) {
            this.set(this.KEYS.COMPLETIONS, {});
        }

        if (!this.get(this.KEYS.FOCUS_SESSIONS)) {
            this.set(this.KEYS.FOCUS_SESSIONS, []);
        }

        this.checkDailyReset();
    },

    checkDailyReset() {
        const lastLogin = this.get(this.KEYS.LAST_LOGIN);
        const today = dayjs().format('YYYY-MM-DD');

        if (lastLogin && lastLogin !== today) {
            this.updateStreak(lastLogin, today);
        }

        this.set(this.KEYS.LAST_LOGIN, today);
    },

    updateStreak(lastDate, currentDate) {
        const user = this.getUser();
        const completions = this.get(this.KEYS.COMPLETIONS) || {};
        
        const yesterday = dayjs(lastDate).subtract(1, 'day').format('YYYY-MM-DD');
        const yesterdayCompletions = completions[yesterday];
        
        const todayCompletions = completions[currentDate];
        const hasActivityToday = todayCompletions && Object.keys(todayCompletions).length > 0;
        
        if (yesterdayCompletions && Object.keys(yesterdayCompletions).length > 0) {
            user.streak += 1;
            if (user.streak > user.longestStreak) {
                user.longestStreak = user.streak;
            }
        } else if (!hasActivityToday) {
            user.streak = 0;
        }

        this.set(this.KEYS.USER, user);
    },

    // HABITS OPERATIONS
    getHabits() {
        return this.get(this.KEYS.HABITS) || [];
    },

    addHabit(habit) {
        const habits = this.getHabits();
        const newHabit = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            ...habit,
            order: habits.length,
            createdAt: dayjs().format('YYYY-MM-DD'),
            updatedAt: dayjs().format('YYYY-MM-DD')
        };
        habits.push(newHabit);
        this.set(this.KEYS.HABITS, habits);
        return newHabit;
    },

    updateHabit(id, updates) {
        const habits = this.getHabits();
        const index = habits.findIndex(h => h.id === id);
        if (index !== -1) {
            habits[index] = {
                ...habits[index],
                ...updates,
                updatedAt: dayjs().format('YYYY-MM-DD')
            };
            this.set(this.KEYS.HABITS, habits);
            return habits[index];
        }
        return null;
    },

    deleteHabit(id) {
        const habits = this.getHabits();
        const filtered = habits.filter(h => h.id !== id);
        this.set(this.KEYS.HABITS, filtered);
        return true;
    },

    reorderHabits(newOrder) {
        this.set(this.KEYS.HABITS, newOrder);
    },

    // COMPLETIONS OPERATIONS
    getCompletions(date = null) {
        const completions = this.get(this.KEYS.COMPLETIONS) || {};
        if (date) {
            return completions[date] || {};
        }
        return completions;
    },

    toggleCompletion(habitId, date = null) {
        if (!date) date = dayjs().format('YYYY-MM-DD');
        
        const completions = this.get(this.KEYS.COMPLETIONS) || {};
        if (!completions[date]) {
            completions[date] = {};
        }

        if (completions[date][habitId]) {
            delete completions[date][habitId];
        } else {
            completions[date][habitId] = {
                completed: true,
                completedAt: dayjs().format('HH:mm:ss')
            };
        }

        this.set(this.KEYS.COMPLETIONS, completions);
        return completions[date][habitId] || null;
    },

    getTodayProgress() {
        const habits = this.getHabits().filter(h => h.frequency === 'harian');
        if (habits.length === 0) {
            return { total: 0, completed: 0, percentage: 0 };
        }
        
        const completions = this.getCompletions();
        const today = dayjs().format('YYYY-MM-DD');
        const todayCompletions = completions[today] || {};
        
        const completed = habits.filter(h => todayCompletions[h.id]).length;
        
        return {
            total: habits.length,
            completed: completed,
            percentage: Math.round((completed / habits.length) * 100)
        };
    },

    // USER OPERATIONS
    getUser() {
        return this.get(this.KEYS.USER) || { ...this.defaultUser, createdAt: dayjs().format('YYYY-MM-DD') };
    },

    updateUser(updates) {
        const user = this.getUser();
        const updated = { ...user, ...updates };
        this.set(this.KEYS.USER, updated);
        return updated;
    },

    addXP(amount) {
        const user = this.getUser();
        user.xp += amount;
        
        while (user.xp >= user.xpToNextLevel) {
            user.xp -= user.xpToNextLevel;
            user.level += 1;
            user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.5);
            this.checkBadges(user.level);
        }

        this.set(this.KEYS.USER, user);
        return user;
    },

    checkBadges(level) {
        const user = this.getUser();
        const badges = [
            { id: 'beginner', name: 'Pemula', level: 1, icon: 'bi-star' },
            { id: 'consistent', name: 'Konsisten', level: 3, icon: 'bi-calendar-check' },
            { id: 'dedicated', name: 'Berdedikasi', level: 5, icon: 'bi-heart' },
            { id: 'scholar', name: 'Scholar', level: 10, icon: 'bi-mortarboard' },
            { id: 'master', name: 'Master', level: 15, icon: 'bi-award' },
            { id: 'legend', name: 'Legend', level: 20, icon: 'bi-gem' }
        ];

        badges.forEach(badge => {
            if (level >= badge.level && !user.badges.some(b => b.id === badge.id)) {
                user.badges.push(badge);
            }
        });

        this.set(this.KEYS.USER, user);
    },

    // SETTINGS OPERATIONS
    getSettings() {
        return this.get(this.KEYS.SETTINGS) || this.defaultSettings;
    },

    updateSettings(updates) {
        const settings = this.getSettings();
        const updated = { ...settings, ...updates };
        this.set(this.KEYS.SETTINGS, updated);
        return updated;
    },

    // FOCUS SESSION OPERATIONS
    getFocusSessions() {
        return this.get(this.KEYS.FOCUS_SESSIONS) || [];
    },

    addFocusSession(session) {
        const sessions = this.getFocusSessions();
        const newSession = {
            id: Date.now().toString(),
            ...session,
            date: dayjs().format('YYYY-MM-DD'),
            createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
        sessions.push(newSession);
        this.set(this.KEYS.FOCUS_SESSIONS, sessions);
        return newSession;
    },

    getTodayFocusTime() {
        const sessions = this.getFocusSessions();
        const today = dayjs().format('YYYY-MM-DD');
        const todaySessions = sessions.filter(s => s.date === today);
        return todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    },

    // DATA EXPORT/IMPORT
    exportData() {
        const data = {
            habits: this.getHabits(),
            completions: this.get(this.KEYS.COMPLETIONS),
            user: this.getUser(),
            settings: this.getSettings(),
            focusSessions: this.getFocusSessions(),
            exportedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
        return JSON.stringify(data, null, 2);
    },

    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.habits) this.set(this.KEYS.HABITS, data.habits);
            if (data.completions) this.set(this.KEYS.COMPLETIONS, data.completions);
            if (data.user) this.set(this.KEYS.USER, data.user);
            if (data.settings) this.set(this.KEYS.SETTINGS, data.settings);
            if (data.focusSessions) this.set(this.KEYS.FOCUS_SESSIONS, data.focusSessions);
            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    },

    clearAllData() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        this.init();
    },

    // STATISTICS
    getWeeklyData() {
        const completions = this.get(this.KEYS.COMPLETIONS) || {};
        const habits = this.getHabits().filter(h => h.frequency === 'harian');
        const totalHabits = habits.length;
        const weeklyData = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
            const dayCompletions = completions[date] || {};
            const completedCount = Object.keys(dayCompletions).filter(id => 
                habits.some(h => h.id === id)
            ).length;
            
            weeklyData.push({
                date: dayjs(date).format('ddd'),
                fullDate: date,
                completed: completedCount,
                total: totalHabits,
                percentage: totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0
            });
        }
        
        return weeklyData;
    },

    getMonthlyData() {
        const completions = this.get(this.KEYS.COMPLETIONS) || {};
        const habits = this.getHabits().filter(h => h.frequency === 'harian');
        const totalHabits = habits.length;
        
        const daysInMonth = dayjs().daysInMonth();
        const currentMonth = dayjs().format('YYYY-MM');
        const monthlyData = [];
        
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${currentMonth}-${i.toString().padStart(2, '0')}`;
            const dayCompletions = completions[dateStr] || {};
            const completedCount = Object.keys(dayCompletions).filter(id => 
                habits.some(h => h.id === id)
            ).length;
            
            monthlyData.push({
                date: i,
                completed: completedCount,
                total: totalHabits,
                percentage: totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0,
                isProductive: totalHabits > 0 && completedCount >= totalHabits * 0.8
            });
        }
        
        return monthlyData;
    },

    getHabitStats(habitId) {
        const completions = this.get(this.KEYS.COMPLETIONS) || {};
        const habit = this.getHabits().find(h => h.id === habitId);
        
        if (!habit) return { totalDays: 0, completedDays: 0, consistency: 0 };
        
        let completedDays = 0;
        let totalDays = 0;
        
        Object.keys(completions).forEach(date => {
            if (habit.frequency === 'harian' && completions[date][habitId]) {
                totalDays++;
                completedDays++;
            } else if (habit.frequency === 'harian') {
                totalDays++;
            }
        });

        return {
            totalDays,
            completedDays,
            consistency: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0
        };
    },

    getOverallStats() {
        const user = this.getUser();
        const habits = this.getHabits();
        const completions = this.get(this.KEYS.COMPLETIONS) || {};
        
        let totalCompletions = 0;
        let productiveDays = 0;
        
        const dailyHabits = habits.filter(h => h.frequency === 'harian').length;
        
        Object.keys(completions).forEach(date => {
            const count = Object.keys(completions[date]).length;
            totalCompletions += count;
            if (dailyHabits > 0 && count >= dailyHabits * 0.8) {
                productiveDays++;
            }
        });

        return {
            totalHabits: habits.length,
            dailyHabits,
            totalCompletions,
            productiveDays,
            streak: user.streak,
            longestStreak: user.longestStreak,
            level: user.level,
            xp: user.xp,
            xpToNextLevel: user.xpToNextLevel,
            badges: user.badges.length
        };
    }
};

// Initialize storage
Storage.init();
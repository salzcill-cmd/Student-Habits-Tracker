/* ===================================
   Student Habit Tracker - Habits Module
   Handle all habit-related operations
   =================================== */

const Habits = {
    editingId: null,

    init() {
        this.bindEvents();
        this.render();
    },

    bindEvents() {
        const addBtn = document.getElementById('addHabitBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openModal());
        }

        const saveBtn = document.getElementById('saveHabitBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveHabit());
        }

        const searchInput = document.getElementById('habitSearch');
        if (searchInput) {
            searchInput.addEventListener('input', UI.debounce((e) => this.searchHabits(e.target.value), 300));
        }

        const modal = document.getElementById('habitModal');
        if (modal) {
            modal.addEventListener('hidden.bs.modal', () => this.resetForm());
        }
    },

    render() {
        const habits = Storage.getHabits();
        const today = dayjs().format('YYYY-MM-DD');
        const completions = Storage.getCompletions(today);
        UI.renderHabitsList('habitsList', habits, completions);
        
        // Update stats
        this.updateStats();
    },

    updateStats() {
        const habits = Storage.getHabits();
        const progress = Storage.getTodayProgress();
        const user = Storage.getUser();
        
        const totalEl = document.getElementById('totalHabitsCount');
        const completedEl = document.getElementById('completedTodayCount');
        const streakEl = document.getElementById('streakCount');
        const rateEl = document.getElementById('completionRate');
        
        if (totalEl) totalEl.textContent = habits.length;
        if (completedEl) completedEl.textContent = progress.completed;
        if (streakEl) streakEl.textContent = user.streak;
        if (rateEl) rateEl.textContent = progress.percentage + '%';
    },

    openModal(habitId = null) {
        this.editingId = habitId;
        const modalEl = document.getElementById('habitModal');
        if (!modalEl) return;
        
        const modal = new bootstrap.Modal(modalEl);
        const modalLabel = document.getElementById('habitModalLabel');

        if (habitId) {
            const habit = Storage.getHabits().find(h => h.id === habitId);
            if (habit) {
                modalLabel.textContent = 'Edit Kebiasaan';
                document.getElementById('habitName').value = habit.name;
                document.getElementById('habitCategory').value = habit.category;
                document.getElementById('habitIcon').value = habit.icon || 'bi-book';
                document.getElementById('habitColor').value = habit.color;
                document.getElementById('habitTarget').value = habit.target;
                document.getElementById('habitFrequency').value = habit.frequency;
                document.getElementById('habitDescription').value = habit.description || '';
            }
        } else {
            modalLabel.textContent = 'Tambah Kebiasaan Baru';
            this.resetForm();
        }

        modal.show();
    },

    saveHabit() {
        const name = document.getElementById('habitName').value.trim();
        const category = document.getElementById('habitCategory').value;
        const icon = document.getElementById('habitIcon').value.trim() || 'bi-book';
        const color = document.getElementById('habitColor').value;
        const target = parseInt(document.getElementById('habitTarget').value) || 1;
        const frequency = document.getElementById('habitFrequency').value;
        const description = document.getElementById('habitDescription').value.trim();

        if (!name) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Nama kebiasaan harus diisi!'
            });
            return;
        }

        if (!category) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Pilih kategori kebiasaan!'
            });
            return;
        }

        const habitData = {
            name,
            category,
            icon,
            color,
            target,
            frequency,
            description
        };

        if (this.editingId) {
            Storage.updateHabit(this.editingId, habitData);
            UI.showToast('Kebiasaan berhasil diperbarui!', 'success');
        } else {
            Storage.addHabit(habitData);
            UI.showToast('Kebiasaan baru berhasil ditambahkan!', 'success');
        }

        const modalEl = document.getElementById('habitModal');
        if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }

        this.render();

        if (typeof App !== 'undefined' && App.updateDashboard) {
            App.updateDashboard();
        }
    },

    resetForm() {
        const form = document.getElementById('habitForm');
        if (form) form.reset();
        
        const colorInput = document.getElementById('habitColor');
        if (colorInput) colorInput.value = '#4e73df';
        
        const iconInput = document.getElementById('habitIcon');
        if (iconInput) iconInput.value = 'bi-book';
        
        const targetInput = document.getElementById('habitTarget');
        if (targetInput) targetInput.value = '1';
        
        this.editingId = null;
    },

    editHabit(habitId) {
        this.openModal(habitId);
    },

    deleteHabit(habitId) {
        const habit = Storage.getHabits().find(h => h.id === habitId);
        
        Swal.fire({
            title: 'Hapus Kebiasaan?',
            text: `Apakah kamu yakin ingin menghapus "${habit ? habit.name : ''}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e74a3b',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                Storage.deleteHabit(habitId);
                UI.showToast('Kebiasaan berhasil dihapus!', 'success');
                this.render();
                
                if (typeof App !== 'undefined' && App.updateDashboard) {
                    App.updateDashboard();
                }
            }
        });
    },

    toggleCompletion(habitId) {
        const result = Storage.toggleCompletion(habitId);
        const habit = Storage.getHabits().find(h => h.id === habitId);
        
        // Update UI immediately
        const habitItem = document.querySelector(`.habit-item[data-id="${habitId}"]`);
        if (habitItem) {
            habitItem.classList.toggle('completed', !!result);
            const icon = habitItem.querySelector('.btn-outline-success i');
            if (icon) {
                icon.className = result ? 'bi bi-check-lg' : 'bi bi-plus';
            }
        }

        // Update XP if completed
        if (result) {
            Storage.addXP(10);
            UI.showToast(`+10 XP! "${habit ? habit.name : ''}" selesai!`, 'success', 'bi-star-fill');
            
            // Check for level up
            const user = Storage.getUser();
            if (user.xp === 0 && user.level > 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'Level Up!',
                    text: `Selamat! Kamu naik ke Level ${user.level}!`,
                    confirmButtonColor: '#4e73df'
                });
            }
        }

        // Update all UI elements
        this.updateStats();
        UI.renderProgress();
        UI.renderStreak();
        UI.renderUserProfile();

        // Update charts if on dashboard
        if (typeof ChartManager !== 'undefined' && ChartManager.weeklyChart) {
            ChartManager.updateWeeklyChart();
        }

        // Update checklist if exists
        const checklistContainer = document.getElementById('todayChecklist');
        if (checklistContainer && typeof window.renderTodayChecklist === 'function') {
            window.renderTodayChecklist();
        }

        // Update calendar if on calendar page
        const calendarGrid = document.getElementById('calendarGrid');
        if (calendarGrid) {
            const monthEl = document.getElementById('currentMonth');
            if (monthEl) {
                UI.renderCalendar('calendarGrid', parseInt(document.getElementById('currentYear').textContent), parseInt(monthEl.dataset.month));
            }
        }
    },

    searchHabits(query) {
        const habits = Storage.getHabits();
        const filtered = habits.filter(h => 
            h.name.toLowerCase().includes(query.toLowerCase()) ||
            h.category.toLowerCase().includes(query.toLowerCase())
        );
        
        const today = dayjs().format('YYYY-MM-DD');
        const completions = Storage.getCompletions(today);
        UI.renderHabitsList('habitsList', filtered, completions);
    },

    filterByCategory(category) {
        const habits = Storage.getHabits();
        const filtered = category ? habits.filter(h => h.category === category) : habits;
        
        const today = dayjs().format('YYYY-MM-DD');
        const completions = Storage.getCompletions(today);
        UI.renderHabitsList('habitsList', filtered, completions);
    },

    addSampleHabits() {
        const sampleHabits = [
            { name: 'Baca Buku 30 Menit', category: 'membaca', icon: 'bi-book-half', color: '#9b59b6', target: 1, frequency: 'harian', description: 'Luangkan waktu untuk membaca buku setiap hari' },
            { name: 'Kerjakan PR Matematika', category: 'tugas', icon: 'bi-calculator', color: '#f6c23e', target: 1, frequency: 'harian', description: 'Selesaikan tugas matematika harian' },
            { name: 'Jogging Pagi', category: 'olahraga', icon: 'bi-person-arms-up', color: '#1cc88a', target: 1, frequency: 'harian', description: 'Olahraga ringan setiap pagi' },
            { name: 'Belajar Bahasa Inggris', category: 'belajar', icon: 'bi-translate', color: '#4e73df', target: 1, frequency: 'harian', description: 'Latihan vocabulary dan grammar' },
            { name: 'Tulis Jurnal Harian', category: 'pengembangan', icon: 'bi-pen', color: '#36b9cc', target: 1, frequency: 'harian', description: 'Refleksi kegiatan sehari-hari' }
        ];

        sampleHabits.forEach(habit => {
            Storage.addHabit(habit);
        });
    }
};

// Render today's checklist function
window.renderTodayChecklist = function() {
    const container = document.getElementById('todayChecklist');
    if (!container) return;
    
    const habits = Storage.getHabits().filter(h => h.frequency === 'harian');
    const today = dayjs().format('YYYY-MM-DD');
    const completions = Storage.getCompletions(today);

    if (habits.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-clipboard-plus display-1 text-muted"></i>
                <p class="text-muted mt-3">Belum ada kebiasaan harian. Tambahkan kebiasaan baru!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = habits.map(habit => {
        const isCompleted = !!completions[habit.id];
        const icon = UI.categoryIcons[habit.category] || 'bi-check-circle';

        return `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 border-0 shadow-sm ${isCompleted ? 'bg-success bg-opacity-10' : ''}"
                     style="border-left: 4px solid ${habit.color} !important;">
                    <div class="card-body d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-3">
                            <div class="habit-icon" style="background: ${habit.color}20; color: ${habit.color}">
                                <i class="bi ${habit.icon || icon}"></i>
                            </div>
                            <div>
                                <h6 class="mb-0 ${isCompleted ? 'text-decoration-line-through text-muted' : ''}">${UI.escapeHtml(habit.name)}</h6>
                                <small class="text-muted">${habit.target}x per hari</small>
                            </div>
                        </div>
                        <button class="btn btn-lg ${isCompleted ? 'btn-success' : 'btn-outline-success'} rounded-circle"
                                onclick="Habits.toggleCompletion('${habit.id}')">
                            <i class="bi ${isCompleted ? 'bi-check-lg' : 'bi-plus'}"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
};
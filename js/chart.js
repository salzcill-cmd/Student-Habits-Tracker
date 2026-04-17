/* ===================================
   Student Habit Tracker - Chart Module
   Handle all Chart.js operations
   =================================== */

const ChartManager = {
    weeklyChart: null,
    monthlyChart: null,
    categoryChart: null,
    completionChart: null,

    colors: {
        primary: '#4e73df',
        secondary: '#9b59b6',
        success: '#1cc88a',
        warning: '#f6c23e',
        danger: '#e74a3b',
        info: '#36b9cc',
        categories: {
            belajar: '#4e73df',
            olahraga: '#1cc88a',
            membaca: '#9b59b6',
            tugas: '#f6c23e',
            pengembangan: '#36b9cc'
        }
    },

    init() {
        this.initWeeklyChart();
        
        // Only init other charts if elements exist
        setTimeout(() => {
            if (document.getElementById('categoryChart')) {
                this.initCategoryChart();
            }
            if (document.getElementById('completionChart')) {
                this.initCompletionChart();
            }
        }, 100);
    },

    initWeeklyChart() {
        const ctx = document.getElementById('weeklyChart');
        if (!ctx) return;

        const weeklyData = Storage.getWeeklyData();

        if (this.weeklyChart) {
            this.weeklyChart.destroy();
        }

        this.weeklyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: weeklyData.map(d => d.date),
                datasets: [{
                    label: 'Tingkat Penyelesaian (%)',
                    data: weeklyData.map(d => d.percentage),
                    backgroundColor: 'rgba(78, 115, 223, 0.8)',
                    borderColor: '#4e73df',
                    borderWidth: 2,
                    borderRadius: 8,
                    hoverBackgroundColor: '#4e73df'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: (context) => `${context.raw}% selesai`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: (value) => `${value}%`,
                            font: { size: 11 }
                        },
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    },
                    x: {
                        ticks: { font: { size: 11 } },
                        grid: { display: false }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    },

    updateWeeklyChart() {
        if (this.weeklyChart) {
            const weeklyData = Storage.getWeeklyData();
            this.weeklyChart.data.labels = weeklyData.map(d => d.date);
            this.weeklyChart.data.datasets[0].data = weeklyData.map(d => d.percentage);
            this.weeklyChart.update();
        }
    },

    initCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        const habits = Storage.getHabits();
        const categoryCount = {
            belajar: 0,
            olahraga: 0,
            membaca: 0,
            tugas: 0,
            pengembangan: 0
        };

        habits.forEach(h => {
            if (categoryCount.hasOwnProperty(h.category)) {
                categoryCount[h.category]++;
            }
        });

        const total = Object.values(categoryCount).reduce((a, b) => a + b, 0);
        
        if (total === 0) {
            ctx.parentElement.innerHTML = '<div class="text-center text-muted py-5">Belum ada kebiasaan</div>';
            return;
        }

        if (this.categoryChart) {
            this.categoryChart.destroy();
        }

        this.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Belajar', 'Olahraga', 'Membaca', 'Tugas', 'Pengembangan'],
                datasets: [{
                    data: [
                        categoryCount.belajar,
                        categoryCount.olahraga,
                        categoryCount.membaca,
                        categoryCount.tugas,
                        categoryCount.pengembangan
                    ],
                    backgroundColor: [
                        this.colors.categories.belajar,
                        this.colors.categories.olahraga,
                        this.colors.categories.membaca,
                        this.colors.categories.tugas,
                        this.colors.categories.pengembangan
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12
                    }
                },
                cutout: '60%',
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        });
    },

    initCompletionChart() {
        const ctx = document.getElementById('completionChart');
        if (!ctx) return;

        const weeklyData = Storage.getWeeklyData();

        if (this.completionChart) {
            this.completionChart.destroy();
        }

        this.completionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: weeklyData.map(d => d.date),
                datasets: [{
                    label: 'Jumlah Selesai',
                    data: weeklyData.map(d => d.completed),
                    borderColor: this.colors.success,
                    backgroundColor: 'rgba(28, 200, 138, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: this.colors.success,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: (context) => `${context.raw} kebiasaan selesai`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            font: { size: 11 }
                        },
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    },
                    x: {
                        ticks: { font: { size: 11 } },
                        grid: { display: false }
                    }
                },
                animation: {
                    duration: 1500
                }
            }
        });
    },

    renderStatsCharts() {
        setTimeout(() => {
            this.initCategoryChart();
            this.initCompletionChart();
        }, 100);
    },

    getProductivityTrend() {
        const weeklyData = Storage.getWeeklyData();
        if (weeklyData.length < 2) return 'stable';

        const recent = weeklyData.slice(-3).reduce((a, b) => a + b.percentage, 0) / 3;
        const previous = weeklyData.slice(0, 3).reduce((a, b) => a + b.percentage, 0) / 3;

        if (recent > previous + 10) return 'improving';
        if (recent < previous - 10) return 'declining';
        return 'stable';
    },

    getBestDay() {
        const weeklyData = Storage.getWeeklyData();
        if (weeklyData.length === 0) return '-';
        const best = weeklyData.reduce((a, b) => a.percentage > b.percentage ? a : b);
        return best.percentage > 0 ? best.date : '-';
    },

    getWorstDay() {
        const weeklyData = Storage.getWeeklyData();
        if (weeklyData.length === 0) return '-';
        const worst = weeklyData.reduce((a, b) => a.percentage < b.percentage ? a : b);
        return worst.percentage < 100 ? worst.date : '-';
    },

    destroyAll() {
        if (this.weeklyChart) { this.weeklyChart.destroy(); this.weeklyChart = null; }
        if (this.monthlyChart) { this.monthlyChart.destroy(); this.monthlyChart = null; }
        if (this.categoryChart) { this.categoryChart.destroy(); this.categoryChart = null; }
        if (this.completionChart) { this.completionChart.destroy(); this.completionChart = null; }
    }
};
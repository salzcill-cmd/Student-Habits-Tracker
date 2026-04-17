# 🎓 Student Habit Tracker

<p align="center">
  <img src="https://img.shields.io/badge/Version-2.0.0-blue?style=for-the-badge&logo=version" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Last%20Updated-April%202026-orange?style=for-the-badge" alt="Updated">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status">
</p>

> Aplikasi pelacak kebiasaan belajar yang dirancang khusus untuk pelajar Indonesia. Tingkatkan produktivitas belajarmu dengan melacak kebiasaan sehari-hari, streak belajar, dan target harian.

## ✨ Fitur Utama

### 📊 Dashboard
- **Salam Personal** - Salam otomatis berdasarkan waktu (Pagi/Siang/Sore/Malam)
- **Streak Belajar** - Lacak hari berturut-turut kamu konsisten belajar
- **Progress Harian** - Visualisasi progress persentase kebiasaan harian
- **Produktivitas Mingguan** - Grafik Chart.js interaktif untuk melihat performa mingguan
- **Badge Pencapaian** - Koleksi badge motiviasi untuk achievements
- **Quote Motivasi** - Quotes inspirasi yang berganti secara acak

### ✅ Habits Management
- **Kelola Kebiasaan** - Tambah,/edit, hapus kebiasaan belajar
- **Kategori** - Kategori: Belajar, Olahraga, Membaca, Tugas, Pengembangan Diri
- **Prioritas** - Tandai kebiasaan prioritas tinggi
- **Repeatable** - Pengaturan habit harian/mingguan
- **Drag & Drop** - Urutkan habits dengan fitur drag & drop

### 📈 Statistik
- **Statistik Lengkap** - Total habits, completed, completion rate
- **Streak Stats** - Streak maksimal dan rata-rata
- **Kategori Breakdown** - Visualisasi berdasarkan kategori
- **Monthly Progress** - Progress bulanan terintegrasi

### 📅 Kalender
- **Kalender Interaktif** - Navigasi bulan dengan kalender penuh
- **Daily View** - Klik tanggal untuk melihat detail
- **Productivity Indicator** - Indikator hari produktif

### ⏱️ Mode Fokus (Pomodoro)
- **Timer Fokus** - Timer countdown untuk fokus Belajar
- **Pomodoro Built-in** - Técnica Pomodoro (25 min work, 5 min break)
- **Sound Effects** - Notifikasi suara saat timer selesai
- **Session Tracking** - Lacak jumlah sesi fokus

### ⚙️ Pengaturan
- **Dark Mode** - Mode gelap untuk kenyamanan mata
- **4 Tema Warna** - Blue Dream, Emerald, Sunset, Ocean
- **Ekspor/Impor Data** - Backup dan restore data (JSON)
- **Suara** - Toggle efek suara
- **Sample Habits** - Generator habits contoh

## 🚀 Teknologi

| Teknologi | Deskripsi |
|-----------|-----------|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) | HTML5 |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) | CSS3 (Custom Properties) |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) | JavaScript (ES6+) |
| ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=white) | Bootstrap 5.3 |
| ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?logo=chart.js&logoColor=white) | Chart.js |
| ![Day.js](https://img.shields.io/badge/Day.js-ELF?logo=day.js&logoColor=black) | Day.js |
| ![AOS](https://img.shields.io/badge/AOS-F06292?logo=aos&logoColor=white) | AOS Animation |
| ![SweetAlert2](https://img.shields.io/badge/SweetAlert2-FDF0?logo=sweetalert&logoColor=black) | SweetAlert2 |

## 📁 Struktur Proyek

```
news/
├── index.html          # Halaman Dashboard
├── habits.html        # Halaman Kelola Habits
├── statistik.html    # Halaman Statistik
├── kalender.html    # Halaman Kalender
├── fokus.html       # Halaman Mode Fokus
├── css/
│   └── style.css     # Styling utama
├── js/
│   ├── app.js      # Main Controller
│   ├── ui.js       # UI Utilities
│   ├── habits.js   # Habits Module
│   ├── chart.js    # Chart Manager
│   ├── focus.js    # Focus Mode
│   └── storage.js   # LocalStorage Handler
└── README.md       # Dokumentasi
```

## 🔧 Instalasi

### Clone Repository
```bash
git clone https://github.com/salzcill-cmd/Student-Habits-Tracker.git
cd student-habit-tracker
```

### Atau Download Manual
1. Download file ZIP dari repository
2. Ekstrak ke folder yang diinginkan
3. Buka `index.html` di browser

### Menjalankan
```bash
# Menggunakan live server (direkomendasikan)
npx serve .

# Atau langsung buka file
open index.html
# file:///path/to/news/index.html
```

> **Catatan:** Aplikasi ini berjalan sepenuhnya di browser tanpa perlu server. Namun, untuk fitur optimal, disarankan menggunakan local server.

## 💡 Cara Penggunaan

### 1. Setup Awal
- Buka aplikasi di browser
- Klik tombol ⚙️ (settings) di navbar
- Pilih nama kamu di profil
- Tambahkan sample habits atau buat sendiri

### 2. Menggunakan Dashboard
- Lihat progress harian di circle progress
- Cek streak belajar saat ini
- View produktivitas mingguan di grafik
- Klaim badge dengan menyelesaikan habits

### 3. Mengelola Habits
- Pindah ke halaman **Habits**
- Klik **+ Tambah Habit** untuk habit baru
- Isi nama, kategori, dan jadwal
- Centang habit saat sudah selesai

### 4. Mode Fokus
- Pindah ke halaman **Fokus**
- Klik ▶️ untuk memulai timer
- Timer 25 menit (Pomodoro)
- Istirahat 5 menit antar sesi

### 5. Backup Data
- Buka Settings → Manajemen Data
- Klik **Export** untuk download JSON
- Klik **Import** untuk restore data

## 🎮 Shortcut & Tips

| Aksi | Cara |
|------|------|
| Toggle Dark Mode | Klik switch di navbar |
| Refresh Quote | Klik tombol "Quote Lain" |
| Quick Add Habit | Dari Dashboard → Aksi Cepat |
| Export Data | Settings → Export |
| Reset | Settings → Clear |

## 🔐 Kompatibilitas

| Browser | Status |
|---------|--------|
| ✅ Chrome 90+ | Full Support |
| ✅ Firefox 88+ | Full Support |
| ✅ Safari 14+ | Full Support |
| ✅ Edge 90+ | Full Support |

> **Catatan:** Memerlukan JavaScript enabled dan LocalStorage tersedia.

## 📝 Lisensi

Distributed under the MIT License.

```
MIT License

Copyright (c) 2024 Student Habit Tracker

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👤 Kontak

- **Author:** Student Habit Tracker Team
- **Email:** hello@studenthabittracker.id
- **Website:** https://studenthabittracker.id
- **GitHub:** https://github.com/salzcill-cmd/

---

<p align="center">
  ❤️ Dibuat dengan cinta untuk kemajuan belajar pelajar Indonesia
  
  <sub>Terus belajar, terus berkembang!</sub>
</p>

---

<div align="center">

<a href="#-student-habit-tracker"><img src="https://img.shields.io/badge/⬆️_BACK_TO_TOP-ffffff?style=for-the-badge" alt="Back to Top"></a>

</div>
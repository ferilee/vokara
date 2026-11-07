# Gambaran produk

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Sumber awal:** `docs/konsep.md`  
**Terakhir diperbarui:** 2026-10-13

## Ringkasan

Vokara adalah platform laboratorium media pembelajaran matematika untuk SMK. Platform ini membantu guru mengajar melalui IFP dan memungkinkan siswa bergabung melalui HP masing-masing.

Produk dirancang sebagai satu aplikasi dengan media pembelajaran yang modular. Guru dapat memilih dan menjalankan aktivitas, sementara siswa dapat mengikuti aktivitas, mengirim jawaban, dan menerima umpan balik.

## Masalah yang ingin diselesaikan

Guru membutuhkan media pembelajaran matematika yang dapat digunakan langsung di kelas dengan perangkat yang berbeda. Media harus mendukung presentasi di layar besar, interaksi melalui sentuhan, serta respons siswa melalui perangkat pribadi.

Koneksi internet juga tidak selalu dapat diandalkan. Karena itu, kegiatan belajar harus tetap dapat berjalan ketika internet terputus, baik secara individual maupun melalui jaringan lokal sekolah.

## Tujuan produk

- Menyediakan pengalaman mengajar yang nyaman pada IFP.
- Menyediakan aktivitas yang dapat diikuti siswa melalui HP.
- Memungkinkan media baru ditambahkan secara modular.
- Menyimpan progres dan jawaban ketika perangkat sedang offline.
- Mendukung sesi kelas melalui internet maupun server lokal.
- Membantu guru melihat rekap hasil kerja siswa.

## Prinsip produk

### Touch-first

Fungsi penting harus dapat digunakan melalui sentuhan atau stylus. Produk tidak boleh bergantung pada hover atau interaksi yang hanya nyaman menggunakan mouse.

### Offline-first

Koneksi internet diperlakukan sebagai kondisi yang dapat berubah. Aktivitas yang sudah disiapkan harus dapat tetap digunakan sesuai kemampuan perangkat dan skenario deployment.

### Modular

Aktivitas baru mengikuti kontrak bersama sehingga katalog media dapat berkembang tanpa membangun ulang dashboard, sesi kelas, dan mekanisme offline.

### Berorientasi kelas

Platform mendukung alur nyata di kelas: guru membuka aktivitas, siswa bergabung, siswa mengerjakan, guru memantau, lalu hasil dirangkum.

### Bertahap dan dapat diuji

Fitur dikembangkan berdasarkan hasil yang dapat diuji langsung pada IFP dan HP. Kompleksitas layanan cloud dan sinkronisasi tidak ditambahkan sebelum kebutuhan dasarnya terbukti.

## Pengguna utama

| Pengguna | Kebutuhan utama |
| --- | --- |
| Guru | Menyiapkan dan menjalankan aktivitas, memandu kelas, memantau respons, serta melihat hasil. |
| Siswa | Bergabung dengan mudah, mengerjakan aktivitas melalui HP, dan menerima umpan balik. |

## Pengalaman inti

```text
Guru memilih aktivitas
        ↓
Guru membuka sesi kelas
        ↓
Siswa bergabung melalui kode atau QR
        ↓
Guru memandu aktivitas di IFP
        ↓
Siswa mengirim respons dari HP
        ↓
Guru melihat umpan balik dan rekap
```

Alur ini harus dapat berjalan melalui internet. Pada tahap berikutnya, alur yang sama ditargetkan berjalan melalui server lokal ketika internet tidak tersedia.

## Batas produk awal

Produk awal berfokus pada media pembelajaran matematika SMK, kelas interaktif sederhana, pengalaman sentuh, penyimpanan lokal, dan tiga aktivitas percontohan. Fitur seperti marketplace konten, multi-sekolah berskala besar, analitik pembelajaran lanjutan, dan sistem authoring lengkap belum menjadi fokus MVP.

## Ukuran keberhasilan tingkat produk

Produk dianggap memiliki arah yang benar jika:

- guru dapat menjalankan aktivitas di IFP tanpa bergantung pada hover;
- siswa dapat bergabung dan merespons melalui HP;
- tiga aktivitas percontohan memberikan nilai pembelajaran nyata;
- aktivitas yang sudah disiapkan tetap dapat digunakan ketika internet terputus;
- jawaban offline tidak hilang dan tidak tercatat ganda setelah sinkronisasi;
- guru dapat memahami hasil kelas tanpa proses manual yang rumit.

## Pertanyaan terbuka

- Nama produk final apakah tetap Vokara atau menggunakan nama lain?
- Mata pelajaran dan jenjang SMK mana yang diprioritaskan pada pilot pertama?
- Apakah siswa menggunakan akun tetap atau identitas sementara per sesi?
- Bagaimana guru menyiapkan aktivitas sebelum kelas offline?

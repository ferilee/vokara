# Proses authoring konten

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-13

Dokumen ini menjelaskan cara aktivitas dan materi disiapkan sebelum digunakan guru. Pada MVP, authoring dapat dilakukan melalui berkas terstruktur dan proses review yang sederhana. Editor visual lengkap belum termasuk ruang lingkup awal.

## Tujuan proses authoring

- Menjaga kualitas matematika dan kualitas pengalaman belajar.
- Membuat struktur konten yang konsisten.
- Memastikan aktivitas dapat dijalankan pada perangkat target.
- Memastikan aset dan konfigurasi dapat digunakan offline sesuai klaimnya.
- Memisahkan isi pembelajaran dari kode platform.
- Membuat perubahan konten dapat ditelusuri melalui versi.

## Peran authoring

| Peran | Tanggung jawab |
| --- | --- |
| Penulis konten | Menyusun tujuan, instruksi, soal, konfigurasi, dan aset. |
| Reviewer pembelajaran | Memeriksa ketepatan konsep, kesesuaian tujuan, bahasa, dan umpan balik. |
| Reviewer teknis | Memeriksa kontrak aktivitas, konfigurasi, aset, offline readiness, dan perangkat. |
| Guru pilot | Mencoba aktivitas dalam konteks kelas dan memberi masukan penggunaan. |
| Pengelola rilis | Menetapkan status publikasi dan versi yang tersedia. |

Satu orang dapat memegang lebih dari satu peran pada tahap awal, tetapi pemeriksaan pembelajaran dan teknis tetap harus dilakukan secara sadar.

## Alur authoring

```text
Ide konten
   ↓
Tujuan dan rancangan aktivitas
   ↓
Draft metadata, konfigurasi, dan aset
   ↓
Validasi struktur dan teknis
   ↓
Review pembelajaran
   ↓
Uji pada IFP dan HP
   ↓
Pilot terbatas
   ↓
Publikasi versi
```

Aktivitas dapat kembali ke tahap sebelumnya jika ditemukan masalah isi, teknis, atau pengalaman pengguna. Publikasi tidak menghapus versi sebelumnya yang masih dibutuhkan oleh sesi yang sudah berjalan.

## Isi minimum paket aktivitas

Setiap aktivitas setidaknya perlu menyediakan:

- identitas stabil;
- judul, deskripsi, dan instruksi;
- area dan subtopik matematika;
- tujuan belajar;
- target pengguna atau tingkat kelas;
- mode aktivitas;
- konfigurasi awal yang valid;
- entry point;
- daftar aset dan dependensi;
- versi;
- status kesiapan offline;
- aturan interaksi dan submission;
- informasi lisensi atau sumber konten jika diperlukan.

## Prinsip struktur konten

- Definisi aktivitas dan aset diletakkan terpisah dari kode backend.
- Konfigurasi yang berbeda untuk satu jenis aktivitas tidak boleh menggandakan implementasi.
- Data soal atau dataset harus dapat diperbarui melalui versi konten yang jelas.
- Nama dan ID harus stabil setelah aktivitas digunakan dalam sesi.
- Aset yang dibutuhkan aktivitas harus dapat ditemukan dan divalidasi secara otomatis.
- Konten yang belum lolos review tidak boleh muncul sebagai pilihan umum guru.

## Kriteria review pembelajaran

Reviewer memeriksa:

- tujuan belajar dapat diamati;
- instruksi sesuai usia dan konteks siswa SMK;
- istilah dan notasi matematika benar;
- tingkat kesulitan sesuai target;
- contoh dan distractor tidak menimbulkan miskonsepsi;
- umpan balik membantu siswa memperbaiki pemahaman;
- durasi aktivitas masuk akal untuk waktu kelas;
- aktivitas memiliki hubungan yang jelas dengan materi atau konteks SMK.

## Kriteria review teknis

Reviewer teknis memeriksa:

- metadata dan konfigurasi lolos validasi;
- semua aset tersedia dan memiliki versi;
- aktivitas tidak memakai dependensi yang tidak diizinkan;
- layout dapat digunakan dengan sentuhan;
- aktivitas tidak bergantung pada hover;
- status offline sesuai dengan perilaku sebenarnya;
- progres dan submission mengikuti kontrak;
- versi aktivitas dapat dipulihkan untuk sesi lama;
- aktivitas dapat dibuka pada browser dan perangkat yang didukung.

## Kesiapan offline

Sebelum aktivitas diberi status siap offline individual, pastikan:

- shell dan aset aktivitas sudah tersedia pada perangkat;
- aktivitas tidak memerlukan request jaringan saat alur utama berjalan;
- konfigurasi yang dibutuhkan tersimpan secara lokal;
- progres dapat dipulihkan setelah browser ditutup;
- submission dapat masuk antrean ketika koneksi terputus;
- status lokal dan status server ditampilkan secara jelas;
- aktivitas dapat diuji pada kondisi koneksi normal lalu terputus.

Kesiapan server lokal adalah kemampuan terpisah. Aktivitas yang siap offline individual belum tentu siap digunakan dalam sesi kelas melalui server lokal.

## Versi dan perubahan

Gunakan versi baru jika perubahan memengaruhi:

- tujuan belajar;
- alur atau aturan interaksi;
- format submission;
- penilaian atau interpretasi jawaban;
- kebutuhan aset atau dependensi;
- dukungan perangkat atau offline.

Perubahan teks kecil dapat tetap dicatat pada riwayat konten tanpa mengubah versi aktivitas jika kompatibilitasnya sudah ditentukan. Aturan rinci kompatibilitas perlu diputuskan bersama Activity SDK.

## Checklist sebelum publikasi

- [ ] Tujuan belajar dan target kelas sudah ditulis.
- [ ] Instruksi sudah ditinjau.
- [ ] Metadata dan konfigurasi valid.
- [ ] Semua aset terdaftar dan dapat dimuat.
- [ ] Interaksi sentuh sudah dicoba.
- [ ] Aktivitas diuji pada IFP dan HP target.
- [ ] Perilaku saat koneksi terputus sudah diperiksa.
- [ ] Progres dan submission dapat dipulihkan.
- [ ] Versi dan status publikasi sudah ditetapkan.
- [ ] Reviewer pembelajaran dan teknis sudah memberi persetujuan.

## Hal yang belum ditetapkan

- Format final paket aktivitas di repository.
- Apakah authoring akan selalu berbasis berkas atau kelak memiliki editor web.
- Alur review dan publikasi untuk banyak sekolah.
- Lisensi konten buatan guru atau komunitas.
- Aturan penerjemahan dan variasi bahasa.
- Mekanisme migrasi konfigurasi saat Activity SDK berubah.

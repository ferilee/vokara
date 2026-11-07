# Pengguna dan persona

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-13

Dokumen ini menjelaskan pengguna utama dan kebutuhan mereka. Persona digunakan untuk menjaga keputusan produk tetap dekat dengan situasi penggunaan nyata, terutama pada perangkat IFP dan HP.

## Persona 1: Guru pengajar

### Profil

Guru matematika SMK yang menggunakan IFP untuk menjelaskan konsep, memandu diskusi, dan memeriksa pemahaman siswa di kelas.

### Tujuan

- Menjelaskan konsep matematika secara visual dan interaktif.
- Mengurangi waktu menyiapkan alat atau media tambahan.
- Melibatkan siswa dalam aktivitas kelas.
- Melihat pemahaman siswa selama pembelajaran berlangsung.
- Tetap dapat mengajar ketika koneksi internet bermasalah.

### Hambatan

- Waktu persiapan kelas terbatas.
- Kemampuan dan kebiasaan menggunakan perangkat digital berbeda-beda.
- IFP harus nyaman digunakan dengan jari atau stylus.
- Koneksi sekolah mungkin tidak stabil.
- Media pembelajaran sering terpisah-pisah dan sulit digunakan kembali.

### Kebutuhan produk

- Katalog aktivitas yang mudah dijelajahi.
- Tampilan IFP dengan kontrol besar dan mudah disentuh.
- Cara cepat memulai sesi kelas.
- Kode atau QR yang mudah dibagikan kepada siswa.
- Status koneksi dan status penyimpanan yang jelas.
- Rekap jawaban yang mudah dibaca.
- Kemampuan melanjutkan pekerjaan setelah browser ditutup atau koneksi terputus.

### Indikator pengalaman berhasil

Guru dapat membuka aktivitas, menjalankannya di IFP, mengundang siswa, dan melihat respons tanpa perlu memahami detail teknis server, cache, atau sinkronisasi.

## Persona 2: Siswa

### Profil

Siswa SMK yang mengikuti pembelajaran menggunakan HP pribadi melalui sesi yang dibuka guru.

### Tujuan

- Bergabung ke kelas dengan cepat.
- Memahami instruksi aktivitas.
- Menjawab atau memanipulasi objek matematika melalui layar sentuh.
- Mengetahui apakah jawaban sudah diterima.
- Mendapatkan umpan balik yang membantu memahami kesalahan.

### Hambatan

- Ukuran layar, kemampuan perangkat, dan kualitas koneksi berbeda-beda.
- Tidak semua siswa memiliki pengalaman yang sama dengan aplikasi pembelajaran.
- Proses bergabung yang panjang dapat mengganggu waktu belajar.
- Siswa perlu mengetahui apakah data sudah terkirim atau masih menunggu koneksi.

### Kebutuhan produk

- Bergabung dengan kode atau QR yang sederhana.
- Tampilan mobile yang jelas dan responsif.
- Kontrol sentuh yang cukup besar.
- Instruksi singkat dan mudah dipahami.
- Umpan balik setelah pengiriman jawaban.
- Penyimpanan lokal ketika koneksi terputus.
- Indikator yang membedakan jawaban tersimpan di perangkat dan jawaban sudah diterima server.

### Indikator pengalaman berhasil

Siswa dapat bergabung, memahami tugas, mengerjakan aktivitas, dan mengetahui status jawabannya tanpa bantuan teknis dari guru.

## Persona sekunder: Pengelola atau penulis konten

### Profil

Orang yang menyiapkan aktivitas, konfigurasi, aset, atau materi matematika untuk digunakan oleh guru.

### Tujuan

- Menambahkan media baru tanpa mengubah dashboard atau mekanisme sesi.
- Mengelola versi aktivitas dan konfigurasi dengan jelas.
- Menyediakan konten yang dapat digunakan online maupun offline.

### Kebutuhan produk

- Kontrak Activity SDK yang jelas.
- Validasi konfigurasi sebelum aktivitas dipublikasikan.
- Struktur folder konten yang konsisten.
- Informasi versi dan kompatibilitas yang terlihat.
- Cara menguji aset dan aktivitas pada IFP serta HP.

Persona ini belum menjadi alur pengguna utama pada MVP dan detail perannya perlu ditetapkan pada dokumentasi content dan access.

## Skenario penggunaan prioritas

| Prioritas | Skenario | Pengguna utama |
| --- | --- | --- |
| P0 | Guru menjalankan aktivitas pada IFP secara individual. | Guru |
| P0 | Siswa mengikuti aktivitas melalui HP. | Siswa |
| P0 | Aktivitas yang sudah disiapkan tetap berjalan tanpa internet. | Guru, siswa |
| P1 | Guru membuka sesi dan siswa bergabung dengan kode atau QR. | Guru, siswa |
| P1 | Guru melihat respons dan rekap jawaban. | Guru |
| P1 | Sesi kelas berjalan melalui server lokal dan Wi-Fi sekolah. | Guru, siswa |
| P2 | Penulis konten menambahkan dan memperbarui aktivitas. | Penulis konten |

## Prinsip pengalaman pengguna

- Tampilkan tindakan utama sesuai konteks pengguna.
- Kurangi jumlah langkah untuk memulai aktivitas dan bergabung ke sesi.
- Beri umpan balik yang jelas setelah tindakan penting.
- Bedakan status lokal, terkirim, dan gagal dengan bahasa yang mudah dipahami.
- Rancang untuk jari dan stylus, lalu pastikan tetap nyaman dengan mouse dan keyboard.
- Perlakukan gangguan koneksi sebagai kondisi yang dapat dipulihkan.

# Strategi offline

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-17

## Tujuan

Vokara harus tetap membantu proses belajar ketika koneksi internet tidak stabil atau tidak tersedia. Dukungan offline dibangun dalam beberapa tingkat karena kebutuhan penggunaan individual berbeda dari kebutuhan kelas yang saling berinteraksi.

## Tiga mode penggunaan

| Mode | Kondisi | Kemampuan utama |
| --- | --- | --- |
| Online | IFP dan HP terhubung ke server daring. | Katalog, sesi kelas, submission, dan rekap melalui server pusat. |
| Offline individual | Internet dan server kelas tidak tersedia, tetapi aktivitas sudah disiapkan pada perangkat. | Aktivitas dan progres lokal tetap dapat digunakan pada perangkat masing-masing. |
| Offline kelas | Internet tidak tersedia, tetapi server lokal dan Wi-Fi sekolah aktif. | Guru dan siswa menjalankan sesi kuis melalui jaringan lokal. |

Ketiga aktivitas percontohan wajib siap offline individual. Untuk offline kelas pada pilot, hanya kuis yang dijamin berjalan bersama melalui server lokal. Mode harus terlihat jelas pada antarmuka; pengguna tidak boleh menganggap respons pada offline individual sudah terlihat oleh guru atau siswa lain.

## Lapisan teknis

### PWA dan Service Worker

Digunakan untuk menyimpan shell aplikasi, JavaScript, CSS, ikon, dan aset terpilih. Service Worker membantu membuka kembali aplikasi ketika koneksi tidak tersedia.

Kemampuan ini bergantung pada secure context. Deployment cloud menggunakan HTTPS untuk persiapan offline individual. Server lokal pilot melayani sesi kelas melalui HTTP lokal bila itu yang didukung jaringan dan browser; alur kelas lokal tidak bergantung pada Service Worker.

### Cache API

Digunakan untuk aset yang dapat diambil kembali secara lokal, seperti berkas aktivitas, gambar, dan data statis yang sudah disiapkan. Cache harus memiliki aturan versi dan invalidasi agar aset lama tidak dipakai tanpa sengaja.

### IndexedDB

Digunakan untuk data yang harus bertahan pada perangkat, termasuk:

- konfigurasi aktivitas yang sudah disiapkan;
- progres lokal;
- jawaban atau submission yang belum terkirim;
- antrean sinkronisasi;
- identitas sesi dan status pengiriman;
- metadata versi aktivitas.

IndexedDB bersifat lokal pada satu browser dan perangkat. Ia bukan pengganti database bersama atau server lokal.

### Server lokal

Server lokal menyediakan koordinasi untuk offline kelas. Ia menjalankan API, menyimpan sesi dan submission bersama, serta melayani perangkat pada jaringan Wi-Fi lokal.

## Skenario perilaku

| Situasi | Perilaku yang diharapkan |
| --- | --- |
| Internet normal | Aplikasi menggunakan server daring dan dapat mengirim data langsung. |
| Koneksi hilang saat aktivitas berjalan | Aktivitas tetap berjalan jika sudah siap offline; perubahan penting disimpan lokal. |
| Submission dibuat saat offline | Data masuk ke outbox dan status menunggu pengiriman ditampilkan. |
| Koneksi kembali | Klien mencoba mengirim outbox secara aman dan memperbarui status setiap item. |
| Browser ditutup saat ada outbox | Data tetap tersedia setelah aplikasi dibuka kembali. |
| Tidak ada server lokal | Perangkat tetap dapat memakai aktivitas individual yang sudah disiapkan. |
| Server lokal tersedia tanpa internet | Guru dan siswa dapat menjalankan sesi kelas melalui Wi-Fi lokal. |

## Tingkat jaminan

### Yang ditargetkan

- Aktivitas yang sudah disiapkan dapat dibuka kembali tanpa internet.
- Progres dan submission lokal tidak hilang hanya karena koneksi terputus.
- Pengiriman ulang tidak menggandakan submission.
- Status data dapat dipahami guru dan siswa.
- Data dapat dipulihkan setelah browser ditutup atau perangkat dimulai ulang.

### Yang memerlukan batasan jelas

- Data pada perangkat dapat hilang jika browser storage dibersihkan atau perangkat rusak.
- Offline individual tidak menyediakan tampilan real-time antarpengguna.
- Aktivitas yang membutuhkan layanan jaringan tidak otomatis menjadi offline-ready.
- Server lokal tidak otomatis tersinkron ke cloud tanpa mekanisme khusus.
- Service Worker tidak boleh dianggap tersedia pada semua alamat IP dan konfigurasi HTTP.

## Status koneksi dan data

Antarmuka perlu membedakan setidaknya status berikut:

- **Terhubung:** komunikasi dengan server berhasil.
- **Offline:** tidak ada koneksi yang dapat digunakan.
- **Tersimpan di perangkat:** data aman secara lokal, belum diterima server.
- **Menunggu pengiriman:** data berada di outbox.
- **Terkirim:** server mengakui penerimaan.
- **Gagal dan perlu perhatian:** pengiriman tidak berhasil setelah aturan retry atau memerlukan tindakan pengguna.

Status teknis harus diterjemahkan menjadi pesan yang dapat dipahami pengguna kelas.

## Kebijakan cache dan data lokal

- Hanya aset yang diperlukan atau dipilih pengguna yang disimpan offline.
- Setiap aset harus dapat dikaitkan dengan versi aktivitas.
- Data lokal yang sensitif tidak boleh disimpan lebih lama dari kebutuhan produk.
- Penghapusan cache tidak boleh menghapus outbox tanpa peringatan atau aturan pemulihan.
- Aplikasi harus dapat mendeteksi bahwa aktivitas lokal sudah tidak kompatibel dengan versi platform yang digunakan.

## Urutan prioritas implementasi

1. Indikator koneksi dan status penyimpanan.
2. Penyimpanan progres aktivitas.
3. Outbox submission pada IndexedDB.
4. Cache aset aktivitas yang dipilih.
5. Pemulihan setelah browser ditutup.
6. Server lokal untuk sesi kelas.
7. Sinkronisasi server lokal dengan cloud.

## Kriteria penerimaan

- Aktivitas yang sudah disiapkan dapat dibuka saat internet diputus.
- Progres tetap tersedia setelah refresh dan browser dibuka kembali.
- Submission offline masuk ke antrean yang dapat dilihat statusnya.
- Koneksi pulih tanpa membuat submission ganda.
- Pengguna dapat membedakan offline individual dari offline kelas.
- Aplikasi memberikan pesan yang dapat ditindaklanjuti ketika storage atau sinkronisasi bermasalah.
- Perilaku diuji pada IFP Merah Putih dan beberapa HP yang mewakili kondisi siswa.

## Pertanyaan terbuka

- Apakah aktivitas dipilih satu per satu untuk offline atau tersedia dalam paket materi?
- Berapa besar penyimpanan lokal minimum yang harus didukung?
- Bagaimana pengguna menghapus aktivitas dan aset offline dengan aman?
- Apakah aplikasi memerlukan halaman khusus untuk mengelola unduhan offline?
- Strategi HTTPS apa yang digunakan pada server lokal?

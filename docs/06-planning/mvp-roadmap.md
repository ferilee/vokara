# Roadmap MVP

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-13

## Tujuan roadmap

Roadmap ini mengurutkan pekerjaan berdasarkan risiko dan hasil yang dapat diuji. Setiap tahap harus menghasilkan kemampuan yang dapat dicoba pada perangkat target sebelum tahap berikutnya diperluas.

## Urutan tahap

| Tahap | Fokus | Hasil yang dapat diamati |
| --- | --- | --- |
| 01 | Fondasi dan perangkat | Aplikasi dasar dapat dibuka pada IFP dan HP serta digunakan melalui sentuhan. |
| 02 | Activity SDK dan katalog | Aktivitas memiliki kontrak, metadata, konfigurasi, dan dapat muncul di katalog. |
| 03 | Media percontohan | Papan tulis, grafik fungsi, dan kuis dapat digunakan untuk pembelajaran nyata. |
| 04 | PWA dan penyimpanan lokal | Aktivitas yang disiapkan dapat berjalan offline individual dengan progres tersimpan. |
| 05 | Kelas interaktif | Guru dapat membuat sesi, siswa bergabung, dan guru melihat hasil. |
| 06 | Server lokal dan sinkronisasi | Kelas dapat berjalan melalui Wi-Fi lokal tanpa internet dan data dapat disinkronkan ketika koneksi pulih. |

## Tahap 01 — Fondasi dan perangkat

### Fokus

- menyiapkan struktur aplikasi;
- menetapkan layout IFP dan mobile;
- menguji browser, sistem operasi, resolusi, sentuhan, stylus, dan storage pada perangkat nyata;
- menetapkan batas dukungan perangkat.

### Gate kelulusan

- IFP dapat membuka aplikasi dasar.
- HP yang mewakili siswa dapat membuka tampilan mobile.
- Tindakan utama dapat dilakukan tanpa hover.
- Temuan kompatibilitas perangkat sudah dicatat.
- Keputusan dukungan minimum sudah dibuat atau ditandai sebagai risiko.

## Tahap 02 — Activity SDK dan katalog

### Fokus

- menetapkan kontrak aktivitas minimum;
- membuat katalog dan halaman detail;
- memuat metadata, konfigurasi, versi, dan aset;
- memvalidasi aktivitas sebelum digunakan.

### Gate kelulusan

- Aktivitas contoh dapat ditambahkan melalui kontrak bersama.
- Katalog dapat menampilkan status dan kebutuhan aktivitas.
- Aktivitas yang tidak valid ditolak dengan pesan yang dapat dipahami.
- Dashboard dan mekanisme katalog tidak perlu diubah untuk setiap aktivitas baru.

## Tahap 03 — Media percontohan

### Fokus

- papan tulis matematika;
- eksplorasi grafik fungsi;
- kuis interaktif;
- uji tujuan belajar, instruksi, umpan balik, dan pengalaman sentuh.

### Gate kelulusan

- Ketiga aktivitas dapat digunakan pada alur pembelajaran yang nyata.
- Setiap aktivitas memiliki tujuan, versi, konfigurasi, dan status offline yang jelas.
- Guru pilot dapat menjalankan aktivitas tanpa bantuan teknis berlebihan.
- Temuan pembelajaran dan teknis dicatat untuk perbaikan.

## Tahap 04 — PWA dan penyimpanan lokal

### Fokus

- cache shell dan aset terpilih;
- IndexedDB untuk progres dan submission;
- status koneksi;
- outbox dan pemulihan setelah browser ditutup;
- sinkronisasi perangkat ke server.

### Gate kelulusan

- Aktivitas yang disiapkan dapat dibuka tanpa internet.
- Progres dan submission tetap ada setelah refresh atau restart browser.
- Data offline dapat dikirim ketika koneksi pulih.
- Pengiriman ulang tidak membuat data ganda.
- Batasan Service Worker pada deployment target sudah diketahui.

## Tahap 05 — Kelas interaktif

### Fokus

- kelas dan keanggotaan;
- pembuatan sesi;
- kode atau QR untuk join;
- submission siswa;
- rekap guru;
- WebSocket untuk event yang benar-benar membutuhkan real-time.

### Gate kelulusan

- Guru dapat membuat dan membuka sesi.
- Siswa dapat bergabung melalui HP.
- Guru dapat melihat peserta dan hasil.
- Akses siswa terbatas pada sesi yang diikuti.
- Sesi dan submission memiliki status serta histori yang jelas.

## Tahap 06 — Server lokal dan sinkronisasi

### Fokus

- deployment Bun + Hono + SQLite pada server lokal;
- akses IFP dan HP melalui Wi-Fi lokal;
- backup dan restore database lokal;
- sinkronisasi server lokal ke cloud;
- pemulihan ketika server atau jaringan berhenti.

### Gate kelulusan

- Sesi kelas berjalan tanpa internet selama server dan Wi-Fi lokal tersedia.
- Data tetap aman setelah server dimulai kembali.
- Backup dapat dipulihkan pada perangkat yang sama atau pengganti.
- Sinkronisasi ke cloud tidak menggandakan atau menimpa data secara diam-diam.
- Operator dapat mengikuti prosedur deployment dan pemulihan.

## Prioritas keputusan

Keputusan berikut perlu dibuat sebelum tahap terkait dimulai:

| Keputusan | Batas waktu keputusan |
| --- | --- |
| Perangkat dan browser minimum | Sebelum tahap 01 selesai |
| Kontrak Activity SDK | Sebelum tahap 02 selesai |
| Format submission dan penilaian | Sebelum tahap 03 selesai |
| Strategi cache dan storage | Sebelum tahap 04 selesai |
| Identitas siswa dan kode join | Selesai pada issue 000; issue 005 mengimplementasikan hasilnya |
| Strategi HTTPS server lokal | Sebelum tahap 06 diuji |
| Pemetaan ID lokal ke cloud | Sebelum sinkronisasi server lokal dibuat |

## Definisi MVP selesai

MVP dapat dinyatakan selesai setelah semua kriteria produk, akses, konten, offline, arsitektur, dan perangkat pada dokumentasi sebelumnya terpenuhi serta diuji pada perangkat IFP yang sebenarnya.

Roadmap tidak mengharuskan semua ide jangka panjang selesai. Fitur di luar ruang lingkup tetap dicatat sebagai pekerjaan lanjutan atau pertanyaan terbuka.

## Risiko roadmap

- Keterbatasan IFP dapat memaksa perubahan desain frontend atau strategi offline.
- Detail identitas siswa dapat memengaruhi model data dan alur join.
- Service Worker pada server lokal dapat memengaruhi definisi offline kelas.
- Sinkronisasi server lokal ke cloud dapat membutuhkan keputusan produk tambahan.
- Aktivitas percontohan dapat menemukan kebutuhan SDK yang belum terlihat dari kontrak awal.

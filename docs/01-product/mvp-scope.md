# Ruang lingkup MVP

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Sumber awal:** `docs/konsep.md`  
**Terakhir diperbarui:** 2026-10-13

## Tujuan MVP

MVP harus membuktikan bahwa Vokara dapat digunakan untuk pembelajaran matematika SMK pada IFP dan HP, dengan media yang modular dan dukungan offline individual yang dapat diandalkan.

MVP tidak harus menyelesaikan seluruh kebutuhan platform jangka panjang. Fokusnya adalah membuktikan alur belajar inti dan menguji kebutuhan nyata di perangkat target.

## Pengguna dan konteks yang termasuk

MVP mencakup:

- satu guru yang menjalankan pembelajaran;
- siswa yang mengikuti aktivitas melalui HP;
- penggunaan pada IFP Merah Putih sebagai perangkat guru;
- penggunaan melalui internet ketika tersedia;
- penggunaan offline individual setelah aktivitas disiapkan;
- kelas interaktif dasar setelah fondasi sesi selesai.

## Kemampuan yang termasuk

### Fondasi aplikasi

- Frontend React + Vite + TypeScript.
- Backend Bun + Hono.
- Struktur monorepo dan paket bersama sesuai kebutuhan.
- Layout yang dapat digunakan pada IFP dan HP.
- Dasar akses pengguna dan navigasi produk.

### Katalog dan aktivitas

- Kontrak dasar Activity SDK.
- Katalog aktivitas.
- Halaman detail atau persiapan aktivitas.
- Metadata, konfigurasi, versi, dan entry point aktivitas.
- Mekanisme pemuatan media secara modular.

### Tiga aktivitas percontohan

- Papan tulis matematika.
- Eksplorasi grafik fungsi.
- Kuis interaktif.

Ketiga aktivitas dipilih karena mewakili pola interaksi berbeda: manipulasi bebas, eksplorasi visual, dan pengumpulan jawaban terstruktur.

### Offline individual

- Cache shell aplikasi dan aset yang diperlukan.
- Penyimpanan lokal menggunakan IndexedDB.
- Penyimpanan progres dan jawaban yang belum terkirim.
- Indikator status koneksi dan status pengiriman.
- Antrean sinkronisasi ketika koneksi kembali.
- Pengiriman idempotent agar jawaban tidak terduplikasi.

### Kelas interaktif dasar

- Pembuatan sesi pembelajaran.
- Kode atau QR untuk bergabung.
- Pengiriman jawaban siswa.
- Rekap hasil untuk guru.
- WebSocket untuk interaksi yang memang membutuhkan pembaruan langsung.

### Keandalan data

- Backup dan pemulihan data MVP.
- Penyimpanan waktu pencatatan asli dan waktu penerimaan server.
- Pemulihan setelah browser ditutup atau perangkat dimulai ulang.

## Urutan implementasi yang disarankan

| Tahap | Hasil yang harus dapat diamati |
| --- | --- |
| 1. Fondasi dan perangkat | Aplikasi dasar berjalan pada IFP dan HP dengan interaksi sentuh yang layak. |
| 2. Activity SDK dan katalog | Aktivitas dapat ditambahkan melalui kontrak bersama dan muncul di katalog. |
| 3. Media percontohan | Papan tulis, grafik fungsi, dan kuis dapat digunakan untuk pembelajaran nyata. |
| 4. Penyimpanan lokal | Aktivitas yang telah disiapkan tetap berjalan tanpa koneksi internet. |
| 5. Kelas interaktif | Siswa dapat bergabung dan guru dapat melihat jawaban atau rekap. |
| 6. Server lokal dan sinkronisasi | Skenario kelas melalui Wi-Fi lokal dapat diuji tanpa internet. |

Tahap 6 menjadi sasaran MVP secara keseluruhan, tetapi pengembangannya dilakukan setelah offline individual dan alur kelas dasar terbukti.

## Kriteria penerimaan MVP

MVP dianggap berhasil jika:

- antarmuka nyaman digunakan pada IFP dan HP;
- fungsi penting dapat diakses melalui sentuhan;
- tiga aktivitas percontohan dapat digunakan tanpa koneksi internet setelah disiapkan;
- siswa dapat bergabung melalui kode atau QR ketika jaringan tersedia;
- jawaban tetap tersimpan ketika koneksi terputus;
- sinkronisasi ulang tidak menggandakan jawaban;
- guru dapat melihat rekap jawaban;
- aplikasi pulih setelah browser ditutup atau perangkat dimulai ulang;
- data dan konfigurasi dapat dicadangkan serta dipulihkan;
- pengujian dilakukan pada IFP Merah Putih dan HP yang mewakili kondisi siswa.

## Di luar ruang lingkup MVP

Fitur berikut belum menjadi bagian dari MVP kecuali hasil validasi menunjukkan kebutuhan mendesak:

- migrasi atau penggunaan MariaDB secara bersamaan dengan SQLite;
- layanan multi-sekolah berskala besar;
- marketplace atau distribusi konten publik;
- editor aktivitas visual lengkap untuk penulis nonteknis;
- analitik pembelajaran lanjutan dan dashboard statistik kompleks;
- sistem gamifikasi lintas aktivitas;
- dukungan semua jenis browser, sistem operasi, dan perangkat;
- sinkronisasi konflik kompleks antara banyak server lokal;
- game 2D kompleks yang memerlukan Phaser.

## Risiko dan asumsi

| Risiko atau asumsi | Dampak terhadap MVP |
| --- | --- |
| Kemampuan browser dan sistem operasi IFP belum dipastikan. | Pengujian perangkat harus dilakukan sejak tahap fondasi. |
| Service Worker memiliki batasan pada deployment HTTP berbasis IP lokal. | Strategi deployment lokal perlu diputuskan dan diuji sebelum menjanjikan PWA penuh. |
| Ukuran dan kualitas HP siswa beragam. | Aktivitas harus diuji pada ukuran layar dan kemampuan perangkat yang beragam. |
| Identitas siswa belum ditetapkan. | Alur join dan penyimpanan submission masih memerlukan keputusan produk. |
| Server lokal menambah kebutuhan operasional di kelas. | Offline kelas dibangun setelah manfaat dan kebutuhan dasarnya terbukti. |

## Pertanyaan yang harus dijawab sebelum MVP dianggap final

- Perangkat dan browser minimum apa yang didukung?
- Apakah sesi kelas dapat dibuat tanpa akun siswa?
- Bagaimana guru menyiapkan aset agar tersedia offline?
- Apakah server lokal termasuk distribusi MVP pertama atau fase validasi berikutnya?
- Format backup dan proses pemulihan apa yang dapat dilakukan guru?
- Berapa banyak siswa yang harus dapat dilayani oleh satu sesi lokal?

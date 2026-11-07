# Pertanyaan terbuka

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-17

Dokumen ini mengumpulkan hal yang belum diputuskan dan dapat memengaruhi produk, arsitektur, data, atau urutan MVP. Pertanyaan di sini bukan spesifikasi final. Setelah diputuskan, jawabannya dipindahkan ke dokumen domain yang relevan dan, jika berdampak besar, dicatat sebagai decision record.

## Prioritas

- **P0:** harus diputuskan sebelum alur MVP terkait dapat dibangun atau diuji.
- **P1:** perlu diputuskan sebelum pilot atau deployment awal.
- **P2:** dapat ditunda sampai kebutuhan penggunaan lebih luas terbukti.

## P0 yang sudah diputuskan pada issue 000

Keputusan berikut berlaku untuk pilot MVP dan dicatat pada [DR-007](../00-governance/decision-records.md):

- siswa memakai identitas sementara berbasis sesi;
- data minimum siswa adalah participant ID, nama tampilan, konteks sesi, waktu join, status, dan submission;
- submission final setelah diterima server dan retry memakai ID yang sama;
- Activity SDK MVP memakai mode `quiz`, `explore`, dan `whiteboard`;
- state, progres, event, dan submission memiliki arti yang berbeda;
- ketiga aktivitas percontohan wajib siap offline individual;
- server lokal pilot menjamin kelas kuis melalui Wi-Fi lokal dan tidak bergantung pada Service Worker;
- kode join memiliki enam karakter uppercase tanpa karakter ambigu dan berlaku sampai sesi ditutup;
- dukungan perangkat pilot ditentukan dari IFP aktual dan HP Android Chromium yang diuji.

## Produk

| Prioritas | Pertanyaan | Dampak |
| --- | --- | --- |
| P1 | Nama produk final apakah Vokara atau nama lain? | Identitas produk, UI, dan dokumentasi publik. |
| P1 | Materi dan jenjang SMK apa yang diprioritaskan pada pilot pertama? | Peta konten dan aktivitas percontohan. |
| P1 | Durasi ideal satu aktivitas dalam kelas? | Desain aktivitas dan alur guru. |
| P2 | Apakah platform akan mendukung mata pelajaran selain matematika? | Batas Activity SDK dan model konten jangka panjang. |

## Pengguna dan akses

| Prioritas | Pertanyaan | Dampak |
| --- | --- | --- |
| Selesai — DR-007 | Apakah siswa menggunakan akun permanen atau identitas sementara per sesi? | Model data, join, privasi, dan pemulihan perangkat. |
| P1 | Bagaimana akun guru dibuat dan dipulihkan? | Autentikasi dan operasional deployment. |
| P1 | Apakah satu siswa boleh memakai dua perangkat dalam sesi yang sama? | Identitas submission dan aturan konflik. |
| P1 | Siapa yang boleh melihat hasil siswa dan berapa lama? | Otorisasi, privasi, dan retensi. |
| P2 | Apakah administrator sekolah diperlukan pada deployment pertama? | Peran, izin, dan pengelolaan tenant. |

## Konten dan Activity SDK

| Prioritas | Pertanyaan | Dampak |
| --- | --- | --- |
| Selesai — DR-007 | Format final definition dan konfigurasi aktivitas? | Kontrak SDK, validasi, dan katalog. |
| Selesai — DR-007 | Batas antara state, event, progres, dan submission? | Offline, API, rekap, dan sinkronisasi. |
| Selesai — DR-007 | Apakah kuis menjadi mode atau capability tersendiri? | Kontrak aktivitas dan implementasi katalog. |
| P1 | Bagaimana penilaian aktivitas eksploratif atau papan tulis? | Model hasil belajar dan rekap. |
| P1 | Siapa yang menyetujui konten sebelum dipublikasikan? | Workflow authoring dan status aktivitas. |
| P2 | Apakah authoring kelak membutuhkan editor web? | Investasi tool dan model konten. |

## Offline dan server lokal

| Prioritas | Pertanyaan | Dampak |
| --- | --- | --- |
| Selesai — DR-007 | Apakah offline individual menjadi target pilot pertama? | Urutan implementasi dan kriteria MVP. |
| Selesai — DR-007 | Strategi HTTPS atau batasan Service Worker pada server lokal? | Penyajian PWA dan pengalaman offline kelas. |
| P1 | Perangkat apa yang menjadi standar server lokal? | Packaging, performa, backup, dan operasional. |
| P1 | Bagaimana perangkat siswa menemukan server lokal? | Join, QR, alamat lokal, dan instruksi kelas. |
| P1 | Berapa jumlah siswa per sesi lokal? | Kapasitas hardware dan desain real-time. |
| P2 | Apakah server lokal harus berfungsi sepenuhnya tanpa cloud untuk jangka panjang? | Sinkronisasi dan model deployment. |

## Sinkronisasi dan data

| Prioritas | Pertanyaan | Dampak |
| --- | --- | --- |
| Selesai — DR-007 | Submission dapat diedit setelah dibuat atau bersifat final? | Idempotensi, konflik, dan rekap. |
| Selesai — DR-007 | Berapa lama item outbox dipertahankan? | Storage, pemulihan, dan retensi. |
| P1 | Bagaimana ID lokal dipetakan ke ID cloud? | Sinkronisasi server lokal dan backup. |
| P1 | Siapa yang menyelesaikan konflik data? | Operasional dan UI pemulihan. |
| P1 | Apakah event sesi disimpan seluruhnya atau diringkas? | Ukuran database dan audit. |
| P2 | Kapan MariaDB atau database pusat diperlukan? | Migrasi dan skala layanan. |

## Perangkat dan deployment

| Prioritas | Pertanyaan | Dampak |
| --- | --- | --- |
| Selesai — DR-007 | Model IFP Merah Putih, browser, dan sistem operasi apa yang didukung? | Layout, touch, Service Worker, dan testing. |
| P1 | HP minimum apa yang mewakili siswa? | Performa dan batas antarmuka mobile. |
| P1 | Hosting cloud apa yang mendukung Bun secara terus-menerus? | Deployment cloud dan biaya operasional. |
| P1 | Siapa operator pemasangan, backup, dan update server lokal? | Prosedur deployment dan dukungan. |
| P2 | Bagaimana update server lokal dilakukan tanpa internet? | Distribusi paket dan release process. |

## Keamanan dan privasi

| Prioritas | Pertanyaan | Dampak |
| --- | --- | --- |
| Selesai — DR-007 | Data siswa minimum apa yang harus dikumpulkan? | Model data dan privasi. |
| P1 | Berapa lama data kelas dan submission disimpan? | Retensi, backup, dan penghapusan. |
| P1 | Bagaimana secrets server lokal dibuat dan dirotasi? | Operasional dan keamanan deployment. |
| P1 | Apakah diperlukan audit log yang dapat dilihat administrator? | Model data dan monitoring. |
| P2 | Apakah ada kebutuhan kebijakan khusus dari sekolah atau yayasan? | Deployment dan proses operasional. |

## Cara menyelesaikan pertanyaan

Untuk setiap pertanyaan yang akan diputuskan:

1. Tentukan konteks dan batas waktu.
2. Catat pilihan yang tersedia.
3. Periksa dampak pada dokumen terkait.
4. Pilih keputusan dan alasan.
5. Buat atau perbarui decision record jika berdampak lintas domain.
6. Perbarui status pertanyaan dan tautkan ke keputusan.

## Aturan pemeliharaan

- Pertanyaan yang sudah dijawab tidak dihapus; tandai sebagai selesai dan tautkan jawabannya.
- Pertanyaan baru ditambahkan ketika ditemukan melalui validasi, bukan sebagai tempat menampung semua ide.
- P0 harus terlihat sebelum tahap roadmap yang terdampak dimulai.
- Jika satu pertanyaan mengubah kontrak atau batas arsitektur, dokumentasi domain terkait harus diperbarui.

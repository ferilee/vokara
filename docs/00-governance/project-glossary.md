# Glosarium proyek

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-17

Dokumen ini menetapkan istilah yang digunakan dalam dokumentasi produk dan arsitektur. Istilah baru ditambahkan ketika sudah diperlukan oleh lebih dari satu domain atau berpotensi menimbulkan tafsir berbeda.

| Istilah | Definisi |
| --- | --- |
| **Vokara** | Nama proyek pada repository ini. Nama produk pembelajaran masih dapat ditetapkan kemudian. |
| **MathLab SMK** | Nama kerja produk pada `docs/konsep.md`. Statusnya masih sementara. |
| **IFP** | Perangkat atau layar interaktif yang digunakan guru untuk mengajar di kelas. |
| **Guru** | Pengguna yang mengelola kelas, memilih aktivitas, menjalankan sesi, dan melihat hasil belajar. |
| **Siswa** | Pengguna yang bergabung ke sesi kelas melalui perangkat pribadi dan mengerjakan aktivitas. |
| **Aktivitas** | Unit media pembelajaran yang dapat dijalankan melalui platform, misalnya kuis, papan tulis, atau eksplorasi grafik. |
| **Media pembelajaran** | Istilah umum untuk aktivitas beserta konfigurasi dan aset yang diperlukan untuk pembelajaran. |
| **Activity SDK** | Kontrak, tipe, validasi, dan mekanisme integrasi yang harus diikuti oleh aktivitas. |
| **Definisi aktivitas** | Metadata dan konfigurasi yang menjelaskan identitas, mode, versi, entry point, dan kesiapan offline sebuah aktivitas. |
| **Aset konten** | Berkas pendukung seperti gambar, ikon, audio, animasi, atau data yang digunakan oleh aktivitas. |
| **Katalog media** | Daftar aktivitas yang tersedia beserta metadata yang dapat ditampilkan kepada pengguna. |
| **Kelas** | Kelompok siswa yang dikelola guru di dalam platform. |
| **Sesi kelas** | Pelaksanaan aktivitas tertentu dalam konteks kelas pada waktu tertentu. |
| **Kode kelas** | Kode yang digunakan siswa untuk menemukan atau bergabung ke sesi kelas. |
| **Sesi daring** | Sesi yang berkomunikasi melalui server dengan koneksi jaringan yang diperlukan. |
| **Sesi offline** | Sesi yang tetap dapat berjalan ketika koneksi internet tidak tersedia, sesuai dukungan perangkat dan server lokal. |
| **Offline individual** | Penggunaan media dan penyimpanan progres pada satu perangkat tanpa interaksi langsung dengan perangkat lain. |
| **Offline kelas** | Sesi kelas melalui server lokal dan Wi-Fi lokal meskipun internet tidak tersedia. |
| **Server lokal** | Komputer guru atau mini-PC yang menjalankan aplikasi di jaringan sekolah. |
| **Cloud** | Server pusat yang dapat diakses melalui jaringan internet. |
| **IndexedDB** | Penyimpanan data pada browser perangkat, misalnya progres dan jawaban yang belum terkirim. |
| **SQLite** | Database lokal pada server aplikasi, terutama untuk tahap MVP. |
| **Outbox sinkronisasi** | Antrean data lokal yang menunggu dikirim ke server ketika koneksi tersedia. |
| **Sinkronisasi** | Proses pengiriman data yang tersimpan lokal ke server tujuan setelah koneksi tersedia. |
| **Idempotent** | Sifat operasi yang aman dijalankan berulang kali tanpa membuat data yang sama tercatat lebih dari sekali. |
| **WebSocket** | Kanal komunikasi dua arah untuk interaksi sesi yang perlu diperbarui secara langsung. |
| **PWA** | Aplikasi web yang dapat dipasang dan menggunakan kemampuan browser seperti cache serta service worker. |
| **Mode aktivitas** | Pola penggunaan aktivitas, misalnya `quiz`, `explore`, atau `whiteboard`. Mode `game` belum termasuk MVP. |
| **IFP Merah Putih** | Perangkat target yang menjadi acuan utama untuk pengujian pengalaman guru. Detail model dan kemampuan perangkat perlu dicatat setelah tersedia. |

## Aturan penggunaan istilah

- Gunakan **aktivitas** untuk unit media yang memiliki kontrak dan dapat dimuat oleh platform.
- Gunakan **sesi kelas** untuk pelaksanaan aktivitas bersama; jangan gunakan “kelas” untuk menyebut satu pelaksanaan.
- Gunakan **offline individual** dan **offline kelas** secara spesifik karena keduanya memiliki kebutuhan teknis berbeda.
- Gunakan **server lokal** untuk perangkat yang melayani jaringan sekolah. Jangan menyebut penyimpanan browser sebagai server lokal.
- Gunakan **cloud** untuk layanan pusat dan **server lokal** untuk layanan yang berjalan di lingkungan sekolah.

## Istilah yang masih perlu ditetapkan

- Nama produk final.
- Arti resmi singkatan IFP dalam konteks perangkat sekolah.
- Istilah yang akan digunakan pengguna untuk “aktivitas”, “media”, dan “materi” pada antarmuka.
- Identitas dan aturan akses siswa yang belum memiliki akun.

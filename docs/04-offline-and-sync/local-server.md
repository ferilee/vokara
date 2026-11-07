# Server lokal

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-17

## Tujuan

Server lokal menyediakan jalur pembelajaran kelas ketika internet sekolah tidak tersedia. Komputer guru atau mini-PC menjalankan aplikasi Vokara dan dapat diakses oleh IFP serta HP siswa melalui jaringan Wi-Fi lokal.

Server lokal bukan sekadar cache aplikasi. Ia menjadi koordinator sesi kuis pilot, penyimpanan bersama, dan API yang digunakan perangkat di kelas.

## Topologi awal

```text
                 Wi-Fi lokal
       ┌─────────────┼─────────────┐
       │             │             │
     IFP          HP siswa      HP siswa
       │             │             │
       └─────────────┴─────────────┘
                     │
          Komputer guru atau mini-PC
             Bun + Hono + SQLite
```

Router atau access point menyediakan jaringan lokal. Internet tidak diperlukan selama perangkat tetap terhubung ke jaringan dan server lokal berjalan.

## Tanggung jawab server lokal

- menyajikan frontend atau endpoint yang diperlukan perangkat;
- menyediakan API aktivitas dan sesi;
- membuat dan mengelola sesi kelas;
- menerima peserta melalui kode atau QR;
- menerima submission siswa;
- menyimpan data kelas pada SQLite lokal;
- menyediakan rekap untuk guru;
- mencatat data yang perlu disinkronkan ke cloud pada tahap lanjutan.

## Data yang disimpan lokal

Data lokal dapat mencakup:

- konfigurasi deployment sekolah;
- aktivitas dan versi yang tersedia;
- kelas dan peserta yang diperlukan sesi;
- sesi dan statusnya;
- kejadian sesi;
- submission;
- antrean sinkronisasi ke cloud, jika fitur tersebut sudah tersedia;
- log operasional minimum untuk pemulihan masalah.

Data yang tidak diperlukan untuk kelas offline sebaiknya tidak disalin ke server lokal.

## Siklus penggunaan di kelas

### Persiapan

- Komputer guru atau mini-PC tersedia dan memiliki daya.
- Aplikasi server lokal sudah dipasang dan diperiksa.
- Router atau access point menyediakan jaringan lokal.
- IFP dan HP siswa dapat terhubung ke jaringan.
- Aktivitas serta aset yang dibutuhkan sudah tersedia lokal.
- Guru mengetahui alamat akses atau cara menemukan server.

### Pelaksanaan

- Guru membuka aplikasi melalui server lokal.
- Guru membuat sesi dan menampilkan kode atau QR.
- Siswa bergabung dari jaringan lokal.
- Aktivitas berjalan dan submission disimpan pada server lokal.
- Guru melihat status dan rekap melalui IFP.

### Penutupan

- Guru menutup sesi.
- Server menyelesaikan penulisan data yang tertunda.
- Data lokal dicadangkan sesuai prosedur.
- Jika sinkronisasi cloud tersedia, data ditandai untuk dikirim ketika internet pulih.

## Persyaratan operasional awal

Persyaratan final harus diuji pada lingkungan sekolah, tetapi deployment perlu mempertimbangkan:

- perangkat yang dapat menjalankan Bun dan SQLite secara stabil;
- penyimpanan yang cukup untuk database dan aset;
- alamat jaringan lokal yang dapat dijangkau IFP dan HP;
- daya yang tetap tersedia selama sesi;
- kemampuan restart setelah listrik atau proses terputus;
- backup database yang dapat dilakukan oleh operator;
- jumlah peserta yang harus dilayani secara bersamaan.

## Alamat dan penemuan server

Siswa memerlukan cara sederhana untuk menemukan server lokal. Pilihan yang perlu dibandingkan:

- alamat IP lokal yang ditampilkan guru;
- nama host lokal;
- QR yang memuat alamat server dan kode sesi;
- halaman pembuka router atau portal lokal;
- mekanisme discovery yang didukung browser dan jaringan sekolah.

Pilihan akhir harus mempertimbangkan variasi perangkat siswa dan kemampuan jaringan sekolah. QR untuk bergabung ke sesi tidak boleh mengasumsikan internet tersedia.

## HTTPS dan Service Worker

PWA dan Service Worker umumnya memerlukan secure context. Untuk MVP, persiapan offline individual dilakukan melalui deployment cloud HTTPS sebelum kelas. Server lokal digunakan sebagai aplikasi jaringan untuk sesi kuis dan tidak menjanjikan PWA penuh pada alamat HTTP lokal. Aktivitas kelas lokal tidak boleh membutuhkan Service Worker agar dapat berjalan.

Jika kelak PWA penuh pada server lokal diperlukan, pendekatan berikut perlu menjadi decision record baru:

- menggunakan HTTPS lokal dengan sertifikat yang dapat diterima perangkat;
- memasang shell aplikasi lebih dahulu pada perangkat lalu memakai server lokal untuk data kelas;
- menggunakan konfigurasi deployment yang didukung browser target.

Keputusan baru tersebut harus didasarkan pada pengujian IFP dan HP yang sebenarnya.

## Kegagalan dan pemulihan

| Kegagalan | Respons yang diharapkan |
| --- | --- |
| Server berhenti | Perangkat menampilkan status tidak terhubung dan mempertahankan data lokal yang belum terkirim. |
| Router mati | Sesi lokal tidak dapat diakses; data pada perangkat tetap dipertahankan jika sudah disimpan lokal. |
| Listrik terputus | Server dapat dimulai kembali dan database dipulihkan tanpa transaksi setengah selesai. |
| Storage hampir penuh | Operator mendapat peringatan dan sistem mencegah kerusakan data. |
| Database rusak | Operator dapat memulihkan backup terakhir dan mengetahui data yang mungkin hilang. |
| Perangkat server diganti | Backup dan paket deployment dapat dipasang pada perangkat pengganti. |

## Keamanan operasional

- Server lokal hanya dapat diakses dari jaringan yang memang digunakan kelas.
- Endpoint administrasi tidak boleh terbuka tanpa perlindungan yang sesuai.
- Data dan backup tidak boleh menyimpan kredensial dalam bentuk terbuka.
- Akses fisik ke komputer atau mini-PC harus dipertimbangkan sebagai bagian dari keamanan.
- Guru atau operator perlu mengetahui cara menutup sesi dan mematikan server dengan aman.
- Log harus cukup untuk diagnosis tanpa menyimpan data pribadi secara berlebihan.

## Backup dan pemulihan

Backup minimum harus mencakup database SQLite dan konfigurasi yang diperlukan untuk membuka kembali sesi. Prosedur harus menjelaskan:

- kapan backup dibuat;
- di mana backup disimpan;
- siapa yang bertanggung jawab;
- cara menguji backup;
- cara memulihkan ke perangkat yang sama atau pengganti;
- bagaimana menangani data yang dibuat setelah backup terakhir.

## Kriteria penerimaan server lokal

- IFP dan HP dapat mengakses server melalui Wi-Fi lokal.
- Guru dapat membuat sesi tanpa internet.
- Siswa dapat bergabung menggunakan kode atau QR lokal.
- Submission tersimpan dan dapat dilihat dalam rekap lokal.
- Sesi dapat dipulihkan setelah server dimulai kembali.
- Backup dapat dibuat dan diuji pemulihannya.
- Kegagalan koneksi lokal tidak menghapus data yang sudah tersimpan di perangkat.

## Pertanyaan terbuka

- Perangkat apa yang akan menjadi standar server lokal?
- Siapa operator yang memasang, memperbarui, dan mencadangkan server?
- Berapa jumlah peserta dan sesi yang harus didukung?
- Apakah frontend disajikan server lokal atau dipasang terlebih dahulu pada perangkat?
- Bagaimana perangkat siswa menemukan alamat server tanpa instruksi teknis panjang?
- Apakah server lokal membutuhkan autentikasi khusus di luar kode sesi?

# Pengujian perangkat

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-17

Lembar pencatatan untuk issue 001 tersedia di `device-testing-record.md`.

## Tujuan

Pengujian perangkat memastikan Vokara benar-benar dapat digunakan pada IFP Merah Putih dan HP yang dipakai siswa. Browser desktop modern atau emulator saja tidak cukup untuk memvalidasi pengalaman sentuh, storage, performa, dan jaringan lokal.

## Kelompok perangkat

### Perangkat guru

- IFP Merah Putih yang akan digunakan di kelas;
- stylus jika tersedia;
- keyboard atau mouse sebagai alat alternatif;
- komputer atau mini-PC yang menjadi kandidat server lokal.

### Perangkat siswa

- HP dengan layar kecil;
- HP dengan layar menengah;
- perangkat dengan storage terbatas;
- perangkat dengan performa rendah;
- perangkat dengan browser dan sistem operasi berbeda;
- setidaknya satu perangkat yang memiliki kondisi jaringan kurang stabil.

Model, sistem operasi, browser, resolusi, ukuran layar, RAM, storage kosong, dan kemampuan sentuh setiap perangkat perlu dicatat saat pengujian.

## Catatan lingkungan pengujian

Setiap hasil pengujian harus mencatat:

- ID atau nama perangkat;
- model dan ukuran layar;
- sistem operasi dan versinya;
- browser dan versinya;
- jenis koneksi;
- server yang digunakan: cloud atau lokal;
- versi aplikasi dan aktivitas;
- tanggal dan penguji;
- hasil dan bukti masalah.

## Matriks skenario

| Area | Skenario |
| --- | --- |
| Pembukaan | Membuka aplikasi dari kondisi baru dan dari cache. |
| Sentuhan IFP | Menekan kontrol, menggambar, menggeser objek, dan menggunakan stylus. |
| Mobile | Bergabung, membaca instruksi, mengisi jawaban, dan melihat umpan balik. |
| Resize | Mengubah orientasi atau ukuran viewport jika perangkat mendukung. |
| Offline | Memutus internet sebelum aktivitas dimulai dan ketika aktivitas berlangsung. |
| Storage | Menutup browser, membuka kembali, refresh, dan memeriksa pemulihan progres. |
| Submission | Mengirim jawaban normal, offline, retry, dan duplicate request. |
| Sesi | Membuat sesi, join dengan kode atau QR, melihat peserta, dan menutup sesi. |
| Real-time | Menguji event guru ke siswa dan respons siswa ke IFP. |
| Lokal | Mengakses server lokal melalui Wi-Fi tanpa internet. |
| Recovery | Memulai ulang browser, server, router, atau perangkat sesuai skenario. |

## Pengujian touch-first

Periksa bahwa:

- target kontrol cukup besar untuk jari;
- tidak ada tindakan penting yang hanya dapat dilakukan melalui hover;
- drag dan manipulasi objek tetap stabil;
- sentuhan tidak salah dianggap sebagai scroll atau klik elemen lain;
- stylus dapat digunakan jika menjadi bagian dari alur mengajar;
- gesture memiliki alternatif ketika perangkat tidak mendukungnya;
- keyboard dan mouse dapat membantu akses tanpa merusak alur utama.

## Pengujian offline individual

1. Siapkan aktivitas dan aset saat online.
2. Pastikan status persiapan terlihat.
3. Putuskan koneksi.
4. Buka kembali aktivitas.
5. Kerjakan sebagian aktivitas.
6. Tutup dan buka browser kembali.
7. Periksa progres lokal.
8. Buat submission atau jawaban.
9. Pulihkan koneksi.
10. Periksa status outbox dan hasil server.
11. Pastikan tidak ada submission ganda.

## Pengujian offline kelas

1. Siapkan komputer guru atau mini-PC sebagai server lokal.
2. Hubungkan IFP dan HP ke Wi-Fi lokal.
3. Pastikan internet tidak tersedia.
4. Guru membuat sesi lokal.
5. Siswa bergabung melalui kode atau QR.
6. Jalankan aktivitas dan kirim respons.
7. Hentikan sementara atau mulai ulang server sesuai skenario.
8. Pulihkan server dan periksa sesi serta submission.
9. Pulihkan internet jika sinkronisasi cloud tersedia.
10. Periksa bahwa data tidak terduplikasi atau tertukar antar sesi.

## Pengujian browser storage

Periksa perilaku ketika:

- storage masih cukup;
- storage hampir penuh;
- browser ditutup normal;
- browser dihentikan paksa;
- tab dibuka ulang;
- cache diperbarui;
- pengguna menghapus cache;
- perangkat dimulai ulang;
- lebih dari satu tab membuka sesi yang sama.

Hasil pengujian harus menyatakan data apa yang dipertahankan, data apa yang perlu diunduh ulang, dan data apa yang tidak dapat dipulihkan.

## Pengujian jaringan

Skenario jaringan minimum:

- koneksi stabil;
- latensi tinggi;
- bandwidth rendah;
- koneksi terputus saat request berlangsung;
- koneksi terputus setelah server menerima data tetapi sebelum acknowledgment;
- berpindah antara jaringan Wi-Fi dan data seluler;
- internet mati tetapi Wi-Fi lokal tetap aktif;
- server lokal aktif tetapi tidak dapat dijangkau dari satu perangkat.

## Kriteria hasil

Setiap skenario diberi salah satu hasil:

- **Lulus:** perilaku sesuai dokumentasi dan dapat digunakan.
- **Lulus dengan batasan:** dapat digunakan dengan batasan yang harus diketahui pengguna.
- **Gagal:** menghambat tujuan utama atau berisiko kehilangan data.
- **Belum diuji:** belum ada bukti yang cukup.

Masalah gagal harus memiliki langkah reproduksi, perangkat, versi, bukti, dampak, dan usulan tindak lanjut.

## Kriteria perangkat target

Perangkat dapat dinyatakan didukung jika:

- alur utama guru atau siswa selesai tanpa error penghambat;
- kontrol sentuh dapat digunakan;
- aktivitas percontohan berjalan sesuai capability-nya;
- progres dan submission mengikuti status yang benar;
- pemulihan setelah koneksi putus memenuhi aturan offline;
- performa masih dapat diterima dalam konteks kelas;
- tidak ada kehilangan data pada skenario pemulihan yang dijanjikan.

## Pertanyaan terbuka

- Model IFP Merah Putih dan browser bawaannya.
- Daftar minimum HP yang mewakili siswa.
- Batas performa dan waktu buka yang dapat diterima.
- Apakah pengujian multi-touch diperlukan untuk aktivitas pertama.
- Perangkat server lokal yang akan digunakan dalam pilot.
- Cara menyimpan bukti pengujian dan riwayat regresi.

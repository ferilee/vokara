# Sinkronisasi

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-17

## Tujuan

Sinkronisasi memindahkan data yang dibuat saat perangkat atau server lokal tidak terhubung ke server tujuan ketika koneksi tersedia. Proses ini harus dapat dilanjutkan, aman terhadap pengiriman ulang, dan dapat ditelusuri ketika terjadi kegagalan.

## Jenis sinkronisasi

### Sinkronisasi perangkat ke server

Perangkat mengirim progres atau submission dari IndexedDB ke server daring atau server lokal. Ini adalah kebutuhan utama MVP offline individual.

### Sinkronisasi server lokal ke cloud

Server lokal mengirim data kelas ke server pusat ketika internet kembali. Ini merupakan tahap lanjutan karena memerlukan pemetaan identitas, aturan konflik, dan pemulihan yang lebih kompleks.

Kedua jenis sinkronisasi tidak boleh dianggap memiliki masalah yang sama. Dokumentasi dan implementasinya perlu memiliki batas tanggung jawab yang jelas.

## Data yang perlu disinkronkan

Data yang mungkin masuk antrean:

- submission siswa;
- progres aktivitas jika diperlukan untuk melanjutkan sesi;
- kejadian sesi yang menjadi bagian dari histori;
- perubahan konfigurasi yang dibuat secara offline jika fitur tersebut diizinkan;
- metadata perangkat atau sesi yang diperlukan untuk pemulihan.

Data cache statis biasanya tidak perlu dikirim balik ke server. Ia hanya perlu memiliki versi yang dapat dibandingkan dengan sumbernya.

## Outbox

Setiap item outbox perlu memiliki informasi minimum:

- ID sinkronisasi yang unik;
- tipe data dan identitas entitas;
- identitas aktivitas dan versi;
- identitas sesi jika terkait sesi kelas;
- identitas pengguna atau identitas sesi siswa;
- waktu pencatatan asli pada perangkat atau server lokal;
- urutan lokal jika urutan kejadian penting;
- payload yang tervalidasi;
- jumlah percobaan dan status terakhir;
- waktu pengiriman terakhir;
- alasan kegagalan jika ada.

Outbox harus tetap tersedia setelah refresh, browser ditutup, atau aplikasi dibuka kembali.

## Alur sinkronisasi

```text
Data dibuat
   ↓
Validasi lokal
   ↓
Simpan data dan item outbox secara atomik
   ↓
Tunggu koneksi
   ↓
Kirim dengan ID unik
   ↓
Server memeriksa dan menerima atau menolak
   ↓
Klien menyimpan acknowledgment
   ↓
Item ditandai selesai atau dijadwalkan retry
```

Penyimpanan data lokal dan pembuatan outbox harus dilakukan dalam satu transaksi lokal jika teknologi penyimpanan memungkinkan. Tujuannya agar data tidak ada tanpa antrean, atau antrean ada tanpa data yang dapat dipulihkan.

## Idempotensi

Server harus menerima pengiriman berulang dengan aman. Jika item dengan ID sinkronisasi yang sama sudah diterima, server mengembalikan hasil penerimaan sebelumnya atau status setara tanpa membuat record baru.

Idempotensi perlu diterapkan pada batas server, bukan hanya dengan mengandalkan klien untuk tidak mengirim ulang. Retry dapat terjadi karena timeout meskipun server sebenarnya sudah memproses data.

## Waktu dan urutan

Data perlu menyimpan sekurangnya:

- waktu pencatatan asli pada perangkat atau server lokal;
- waktu pengiriman;
- waktu penerimaan server;
- waktu pemrosesan jika dibutuhkan untuk diagnosis.

Waktu server menjadi acuan untuk penerimaan, sedangkan waktu pencatatan asli dipertahankan untuk memahami urutan pembelajaran. Perbedaan jam perangkat perlu dipertimbangkan ketika urutan kejadian menentukan hasil.

## Retry dan kegagalan

Retry harus memiliki aturan yang dapat diprediksi:

- hanya ulangi otomatis untuk kegagalan sementara;
- gunakan jeda yang meningkat untuk menghindari beban berulang;
- jangan menghapus item hanya karena beberapa percobaan gagal;
- simpan alasan kegagalan yang dapat ditampilkan atau didiagnosis;
- sediakan cara untuk mencoba ulang setelah pengguna memperbaiki kondisi;
- pisahkan payload tidak valid dari masalah jaringan.

Jika server menolak data karena versi aktivitas atau izin sudah tidak sesuai, pengiriman tidak boleh terus diulang tanpa perubahan.

## Acknowledgment

Server perlu memberikan acknowledgment yang memungkinkan klien membedakan:

- data baru berhasil diterima;
- data sebelumnya sudah pernah diterima;
- data ditolak karena tidak valid;
- data ditolak karena tidak berwenang;
- data tidak dapat diproses sementara.

Klien hanya boleh menghapus atau menandai item selesai setelah menerima acknowledgment yang sesuai. Timeout tanpa acknowledgment harus diperlakukan sebagai kondisi yang mungkin memerlukan pengiriman ulang.

## Konflik data

Konflik dapat terjadi jika satu submission atau sesi diubah dari lebih dari satu perangkat. Untuk MVP, aturan yang disarankan:

- submission memiliki ID unik dan tidak diubah menjadi record baru saat retry;
- submission final tidak ditimpa secara diam-diam;
- pembaruan yang diizinkan harus memiliki nomor versi atau aturan urutan yang jelas;
- konflik yang tidak dapat diputuskan otomatis dicatat untuk ditangani secara eksplisit;
- sinkronisasi server lokal ke cloud tidak dimulai sebelum identitas dan kepemilikan data ditetapkan.

Strategi seperti last-write-wins hanya boleh dipakai setelah jenis data dan dampaknya dipahami. Strategi tersebut tidak cocok secara otomatis untuk semua hasil belajar.

## Sinkronisasi server lokal ke cloud

Tahap lanjutan perlu memetakan:

- identitas sekolah dan server lokal;
- identitas guru, kelas, sesi, dan peserta;
- identitas aktivitas dan versi;
- ID lokal ke ID cloud;
- status sesi lokal dan cloud;
- submission yang sudah dikirim;
- data yang harus tetap lokal karena kebijakan sekolah.

Setiap server lokal memerlukan identitas yang stabil agar pengiriman ulang setelah restart tidak dianggap berasal dari sumber baru.

## Privasi dan retensi

- Outbox dapat berisi data siswa sehingga harus mengikuti aturan akses yang sama dengan submission.
- Payload tidak boleh memuat data yang tidak diperlukan untuk tujuan sinkronisasi.
- Data yang sudah dikonfirmasi diterima dapat dihapus dari outbox, tetapi histori penerimaan minimum perlu dipertahankan sesuai kebutuhan audit dan diagnosis.
- Pembersihan data lokal harus memiliki aturan yang dapat dipahami operator.
- Backup dan log sinkronisasi perlu diperlakukan sebagai data yang mungkin memuat informasi pembelajaran.

Untuk pilot, data session participant dan submission dipertahankan 90 hari setelah sesi ditutup. Item outbox pending dipertahankan sampai menerima acknowledgment final. Item permanent failure dipertahankan 30 hari setelah ditandai gagal; penghapusan memerlukan export atau keputusan operator. Retensi outbox tidak boleh menyebabkan data yang belum terkirim hilang diam-diam.

## Kriteria penerimaan sinkronisasi

- Submission offline tetap tersedia setelah aplikasi dibuka kembali.
- Item outbox dapat dikirim ketika koneksi pulih.
- Timeout dan retry tidak membuat submission duplikat.
- Server membedakan data baru, data yang sudah diterima, dan data tidak valid.
- Waktu pencatatan asli tidak hilang ketika data diterima server.
- Kegagalan permanen tidak berputar dalam retry tanpa batas.
- Guru atau operator dapat mengetahui data yang masih menunggu atau gagal.
- Skenario pengiriman perangkat ke server diuji sebelum sinkronisasi server lokal ke cloud.

## Pertanyaan terbuka

- Apakah guru dapat memaksa sinkronisasi atau mengunduh laporan lokal?
- Bagaimana sistem menangani perubahan versi aktivitas saat outbox lama dikirim?
- Siapa yang menyelesaikan konflik antara server lokal dan cloud?
- Data apa yang wajib disimpan untuk audit tanpa menyimpan terlalu banyak data pribadi?

# Arsitektur backend

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-13

## Tujuan

Backend menyediakan API dan layanan aplikasi untuk katalog, kelas, aktivitas, sesi, submission, sinkronisasi, dan komunikasi real-time. Backend harus dapat dijalankan pada cloud maupun server lokal menggunakan batas domain yang sama.

## Lapisan backend

```text
HTTP / WebSocket adapters
          ↓
Routes dan middleware
          ↓
Application services
          ↓
Domain rules dan validators
          ↓
Repositories
          ↓
SQLite + Drizzle atau storage yang disetujui
```

### Routes dan adapter

Mengubah request jaringan menjadi input aplikasi dan response menjadi format transport. Route tidak menjadi tempat utama untuk aturan bisnis.

### Middleware

Menangani kebutuhan lintas domain seperti correlation ID, parsing, autentikasi, otorisasi, batas ukuran request, dan penanganan error.

### Application services

Mengorkestrasi use case seperti membuat sesi, join sesi, menerima submission, mengambil hasil, dan memproses sinkronisasi.

### Domain rules dan validators

Memastikan status, kepemilikan, versi, konfigurasi, dan payload memenuhi aturan yang berlaku.

### Repositories

Menyediakan akses data tanpa membuat service bergantung pada detail query atau driver database. Repository dapat memiliki implementasi yang sesuai untuk SQLite lokal dan penyimpanan pusat jika kelak diperlukan.

## Domain backend

| Domain | Tanggung jawab |
| --- | --- |
| Identity and access | Identitas, peran, izin, dan konteks akses. |
| Content | Aktivitas, versi, konfigurasi, dan aset. |
| Classroom | Kelas dan keanggotaan. |
| Session | Siklus hidup sesi dan peserta. |
| Submission | Respons, validasi, dan hasil. |
| Synchronization | Outbox, acknowledgment, retry, dan idempotensi. |
| Realtime | Koneksi, channel, dan event sesi. |

Domain boleh berkomunikasi melalui service atau kontrak yang jelas. Akses langsung ke tabel domain lain perlu dihindari agar batas tetap dapat dipelihara.

## Alur request

1. Adapter menerima request.
2. Middleware memberi konteks request dan memeriksa akses dasar.
3. Validator memeriksa struktur input.
4. Service memeriksa aturan domain dan menjalankan use case.
5. Repository membaca atau menulis data dalam transaksi yang diperlukan.
6. Service membentuk hasil aplikasi.
7. Adapter mengembalikan response dan error terstruktur.

## Transaksi dan konsistensi

Transaksi diperlukan ketika beberapa perubahan harus dianggap satu operasi, misalnya:

- membuat sesi dan kode akses;
- menerima submission dan mencatat statusnya;
- menerima item sinkronisasi dan acknowledgment;
- menutup sesi dan mencatat event penutupan.

Aturan transaksi harus ditulis bersama use case, bukan diserahkan pada kebetulan urutan pemanggilan repository.

## Validasi dan error

Backend memisahkan:

- input tidak valid;
- pengguna tidak berwenang;
- entitas tidak ditemukan;
- status domain tidak mengizinkan operasi;
- konflik versi atau idempotensi;
- kegagalan sementara;
- kegagalan internal.

Error transport harus stabil dan cukup informatif untuk frontend, tetapi tidak membocorkan stack trace, rahasia, atau detail internal database.

## Konfigurasi runtime

Konfigurasi seperti alamat database, mode deployment, origin, port, logging, dan kunci rahasia disediakan melalui mekanisme konfigurasi deployment. Nilai konfigurasi tidak ditanamkan ke dalam kode atau dokumentasi publik.

## Cloud dan server lokal

Kode domain sebaiknya sama pada dua deployment. Perbedaan yang diisolasi:

- sumber konfigurasi;
- alamat dan discovery jaringan;
- penyimpanan aset;
- ukuran dan kebijakan database;
- proses backup;
- koneksi sinkronisasi ke cloud.

Server lokal tidak boleh diam-diam mengasumsikan internet tersedia.

## Observability minimum

Backend perlu menyediakan informasi yang membantu diagnosis:

- ID request atau correlation ID;
- operasi dan status hasil;
- durasi request;
- identitas deployment atau server lokal;
- jumlah retry sinkronisasi;
- error yang dapat dikelompokkan.

Log tidak boleh menyimpan payload siswa atau rahasia lebih banyak dari yang diperlukan.

## Pertanyaan terbuka

- Mekanisme dependency injection atau wiring service yang digunakan.
- Strategi migrasi database pada cloud dan server lokal.
- Batas ukuran payload aktivitas dan submission.
- Bentuk health check dan readiness check.
- Apakah service background diperlukan untuk retry sinkronisasi.

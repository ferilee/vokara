# Akses kelas dan sesi

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-17

Dokumen ini menjelaskan cara guru membuka sesi dan cara siswa bergabung. Sesi kelas harus mudah dimulai pada kondisi normal dan memiliki status yang jelas ketika koneksi atau server berubah.

## Konsep akses

Kelas adalah kelompok yang dikelola guru. Sesi adalah pelaksanaan aktivitas tertentu untuk kelas pada waktu tertentu. Kode atau QR digunakan untuk memberi siswa akses ke satu sesi, bukan untuk memberikan akses umum ke seluruh kelas.

```text
Kelas
  └── Sesi pembelajaran
        ├── Aktivitas yang dipilih
        ├── Kode atau QR
        ├── Peserta
        ├── Kejadian sesi
        └── Submission
```

## Alur guru

1. Guru masuk atau mengidentifikasi dirinya sesuai mekanisme akses yang ditetapkan.
2. Guru memilih kelas.
3. Guru memilih aktivitas dan menyiapkan konfigurasi yang diperlukan.
4. Guru membuat sesi.
5. Sistem menghasilkan kode dan QR untuk sesi tersebut.
6. Guru menampilkan kode atau QR pada IFP.
7. Guru melihat peserta yang bergabung.
8. Guru memulai aktivitas ketika peserta siap.
9. Guru memantau status dan respons sesuai kemampuan aktivitas.
10. Guru menutup sesi dan membuka rekap hasil.

Guru harus dapat mengetahui apakah sesi berjalan melalui internet, server lokal, atau mode individual. Perbedaan teknis tersebut perlu disampaikan dengan bahasa yang dapat digunakan untuk mengambil keputusan di kelas.

## Alur siswa

1. Siswa membuka aplikasi pada HP.
2. Siswa memindai QR atau memasukkan kode sesi.
3. Sistem memeriksa bahwa kode masih berlaku dan sesi dapat menerima peserta.
4. Siswa memasukkan nama tampilan atau identitas yang diminta.
5. Siswa melihat konfirmasi bahwa ia sudah bergabung.
6. Siswa menunggu guru memulai aktivitas atau langsung mengikuti aktivitas yang tersedia.
7. Siswa mengerjakan dan mengirim respons.
8. Sistem menampilkan status respons: tersimpan di perangkat, menunggu pengiriman, diterima, atau gagal.

## Siklus hidup sesi

| Status | Arti | Akses siswa |
| --- | --- | --- |
| `draft` | Sesi sedang disiapkan dan belum dibagikan. | Tidak dapat bergabung. |
| `open` | Sesi menerima peserta. | Dapat bergabung dengan kode atau QR yang valid. |
| `active` | Aktivitas sedang dijalankan. | Dapat mengerjakan dan mengirim respons sesuai aturan aktivitas. |
| `paused` | Sesi dihentikan sementara oleh guru. | Dapat melihat status; pengiriman mengikuti aturan aktivitas. |
| `closed` | Sesi selesai dan tidak menerima respons baru. | Tidak dapat mengirim respons baru. |
| `archived` | Sesi disimpan untuk riwayat dan tidak aktif. | Hanya dapat dilihat sesuai izin rekap. |

Transisi status harus tercatat sebagai kejadian sesi agar histori dan pemulihan dapat dipahami.

## Aturan kode dan QR

Kode atau QR sesi harus:

- terkait dengan satu sesi tertentu;
- cukup mudah dibaca dan dimasukkan di kelas;
- memiliki masa berlaku atau dapat dinonaktifkan guru;
- tidak memberikan akses ke kelas lain atau data sesi lain;
- dapat dibuat ulang jika terungkap atau tidak dapat digunakan;
- tetap dapat digunakan pada jaringan lokal ketika sesi berjalan melalui server lokal.

Untuk pilot, kode terdiri dari enam karakter alfanumerik uppercase tanpa karakter ambigu seperti `0/O` dan `1/I`. Kode berlaku sampai sesi ditutup, dapat dicabut atau dibuat ulang oleh guru, dan QR memuat alamat deployment serta kode sesi. Kode hanya membuka satu sesi dan tidak memberikan akses administratif.

## Akses melalui internet

Pada kondisi normal, IFP dan HP mengakses server daring. Guru membuka sesi pada server tersebut, lalu siswa bergabung menggunakan kode atau QR.

Submission dikirim ke server dan status penerimaan ditampilkan pada perangkat siswa. Jika koneksi terputus, respons harus dapat disimpan lokal dan masuk ke antrean sinkronisasi.

## Akses melalui server lokal

Pada kondisi internet tidak tersedia tetapi Wi-Fi lokal dan server lokal aktif:

- IFP dan HP mengakses alamat server lokal;
- sesi dibuat dan disimpan pada server lokal;
- siswa bergabung melalui kode atau QR lokal;
- respons diproses oleh server lokal;
- hasil tetap dapat dilihat oleh guru selama server dan jaringan lokal aktif.

Sinkronisasi server lokal dengan cloud adalah bagian dari tahap lanjutan. Aturan identitas sesi, pemetaan data, dan penanganan konflik harus ditetapkan sebelum fitur tersebut digunakan dalam produksi.

## Akses offline individual

Jika server lokal tidak tersedia, aktivitas yang sudah disiapkan dapat digunakan pada perangkat masing-masing. Dalam mode ini:

- siswa tidak otomatis menjadi peserta sesi bersama;
- progres dan respons disimpan di perangkat;
- status pengiriman bergantung pada koneksi yang tersedia;
- guru tidak dapat melihat respons secara langsung sampai data berhasil dikirim.

Antarmuka harus membedakan mode ini dari sesi kelas agar siswa dan guru tidak mengira bahwa respons sudah terlihat oleh peserta lain.

## Penanganan kondisi umum

| Kondisi | Perilaku yang diharapkan |
| --- | --- |
| Kode tidak ditemukan | Tampilkan pesan yang jelas dan minta kode diperiksa kembali. |
| Sesi sudah ditutup | Tolak join dan tampilkan bahwa sesi tidak lagi menerima peserta. |
| Siswa mengirim ulang respons | Gunakan identitas respons agar pengiriman ulang tidak menggandakan data. |
| Browser ditutup | Pulihkan identitas dan progres sesuai kemampuan perangkat dan aturan sesi. |
| Koneksi terputus setelah join | Pertahankan status lokal dan tampilkan antrean pengiriman. |
| Server lokal berhenti | Tampilkan status bahwa sesi tidak dapat dihubungi dan pertahankan data lokal yang belum dikirim. |
| Guru membuka ulang sesi | Terapkan aturan eksplisit tentang peserta lama, peserta baru, dan respons lanjutan. |

## Privasi dan tampilan peserta

MVP menggunakan data minimum untuk menghubungkan siswa dengan sesi. Siswa memasukkan nama tampilan, sedangkan sistem membuat `session_participant_id`. Nama lengkap, nomor induk, email, dan nomor telepon tidak diperlukan. Nama tampilan siswa hanya ditampilkan kepada pihak dan konteks yang diperlukan untuk pembelajaran.

Data sesi dan submission pilot disimpan 90 hari setelah sesi ditutup, lalu dihapus atau dianonimkan sesuai prosedur retensi. Akun permanen siswa dan akses wali atau administrator belum termasuk MVP.

## Kriteria penerimaan akses kelas

- Guru dapat membuat sesi dari aktivitas yang dipilih.
- Kode atau QR dapat ditampilkan di IFP.
- Siswa dapat bergabung dari HP dengan langkah yang singkat.
- Siswa menerima konfirmasi bahwa ia berhasil bergabung.
- Guru dapat melihat peserta yang telah bergabung.
- Sesi tidak menerima akses setelah ditutup.
- Respons siswa memiliki status penyimpanan dan pengiriman yang dapat dipahami.
- Pengiriman ulang tidak membuat respons duplikat.
- Alur internet, server lokal, dan offline individual tidak tercampur dalam tampilan status.

## Pertanyaan terbuka

- Bagaimana guru mengeluarkan siswa yang salah bergabung?
- Apakah satu siswa boleh bergabung dari dua perangkat setelah pilot?
- Bagaimana sesi lokal dipasangkan dengan identitas sesi cloud pada issue sinkronisasi?

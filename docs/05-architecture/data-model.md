# Model data

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-17

## Tujuan

Model data menyimpan identitas, konten, kelas, sesi, event, submission, aset, dan antrean sinkronisasi. MVP menggunakan SQLite dengan Drizzle ORM pada server aplikasi.

## Entitas inti

| Entitas | Fungsi |
| --- | --- |
| `users` | Identitas guru dan peran pendukung. Siswa pilot tidak memerlukan record global. |
| `classes` | Kelas yang dikelola guru. |
| `class_members` | Hubungan pengguna dengan kelas. |
| `activities` | Identitas dan metadata aktivitas. |
| `activity_versions` | Versi, konfigurasi, dan kompatibilitas aktivitas. |
| `content_assets` | Metadata aset yang dipakai aktivitas. |
| `sessions` | Pelaksanaan aktivitas pada kelas atau konteks tertentu. |
| `session_participants` | Identitas sementara siswa dalam satu sesi. |
| `session_events` | Perubahan dan event dalam sesi. |
| `submissions` | Respons atau hasil kerja siswa. |
| `sync_outbox` | Data yang menunggu dikirim dari sumber lokal. |

## Hubungan konseptual

```text
User ──< ClassMember >── Class ──< Session ──< SessionParticipant
                                │
Activity ──< ActivityVersion ───┘
                                │
                            SessionEvent
                                │
                            Submission

ActivityVersion ──< ContentAsset
SessionParticipant ──< Submission
Submission / Event ──< SyncOutbox (jika dibuat lokal)
```

Pada MVP, `session_participants` memiliki ID stabil dalam satu sesi, nama tampilan, status, waktu join, dan waktu terakhir terlihat. Satu participant tidak boleh mengirim submission untuk sesi yang tidak diikutinya.

Relasi final, cardinality, dan constraint perlu ditetapkan pada migration design sebelum implementasi database.

## Identitas

Setiap entitas yang dapat dikirim ulang atau dirujuk lintas perangkat harus memiliki ID stabil. Submission dan item outbox memerlukan ID unik yang dibuat sebelum pengiriman agar retry idempotent.

ID lokal dan ID cloud perlu dapat dibedakan jika sinkronisasi server lokal ke cloud digunakan. Pemetaan ID tidak boleh bergantung pada urutan insert.

## Metadata waktu

Entitas yang relevan perlu membedakan:

- waktu dibuat;
- waktu diperbarui;
- waktu kejadian asli pada perangkat atau server lokal;
- waktu dikirim;
- waktu diterima server;
- waktu diproses.

Tidak semua entitas memerlukan seluruh waktu tersebut. Kebutuhan harus ditentukan berdasarkan audit, rekap, dan sinkronisasi.

## Data relasional dan JSON

Gunakan kolom relasional untuk:

- identitas;
- relasi;
- status;
- versi;
- waktu;
- pencarian dan filter yang sering dilakukan;
- constraint integritas.

Gunakan JSON tervalidasi untuk:

- konfigurasi spesifik aktivitas;
- payload event yang memang bervariasi;
- payload submission sesuai kontrak aktivitas;
- metadata yang belum membutuhkan query relasional.

JSON tetap harus memiliki schema, versi, dan batas ukuran. JSON bukan alasan untuk mengabaikan validasi atau model domain.

## Invariant awal

- Satu session mengacu pada satu versi aktivitas yang jelas.
- Session yang ditutup tidak menerima submission baru tanpa transisi eksplisit.
- Submission terkait dengan satu session dan identitas peserta.
- `session_participant_id` unik hanya dalam konteks sesi dan tidak menjadi akun global.
- Keanggotaan kelas tidak otomatis berarti keanggotaan semua sesi lama.
- Item outbox memiliki ID yang dapat dipakai untuk idempotensi.
- Aset dapat ditelusuri ke aktivitas dan versi yang menggunakannya.
- Penghapusan data tidak memutus histori yang harus dipertahankan tanpa aturan migrasi.
- Submission kuis final setelah diterima; retry memakai ID submission yang sama.

## Status data

Status aktivitas, sesi, submission, dan outbox harus memiliki daftar nilai yang terbatas dan transisi yang dapat diperiksa. Status tidak boleh hanya berupa teks bebas jika digunakan untuk aturan bisnis.

## Browser storage dan database server

IndexedDB menyimpan state dan antrean pada perangkat. SQLite menyimpan data bersama pada server. Data yang sama dapat muncul pada kedua tempat, tetapi memiliki peran berbeda:

- perangkat menyimpan data sebelum diterima server;
- server menyimpan data yang menjadi acuan bersama;
- sinkronisasi menghubungkan keduanya melalui ID dan acknowledgment.

## Retensi dan penghapusan

Untuk pilot, session participant dan submission disimpan selama 90 hari setelah sesi ditutup. Setelah itu data dihapus atau dianonimkan sesuai prosedur. Setiap jenis data tetap perlu memiliki keputusan tentang:

- berapa lama disimpan;
- siapa yang boleh menghapus;
- apakah penghapusan bersifat fisik atau ditandai;
- dampak penghapusan terhadap rekap dan sinkronisasi;
- backup yang mungkin masih mengandung data tersebut.

## Backup dan migrasi

Skema database harus memiliki migrasi yang dapat dijalankan pada SQLite lokal dan lingkungan pusat yang sesuai. Backup perlu menyertakan informasi versi skema agar dapat dipulihkan secara konsisten.

Migrasi database tidak boleh diasumsikan aman hanya karena tabel memiliki nama yang sama. Perubahan schema harus diuji pada salinan data yang mewakili kondisi nyata.

## Pertanyaan terbuka

- Kolom mana yang perlu diindeks untuk katalog, sesi, dan rekap?
- Apakah event disimpan tanpa batas atau diringkas setelah sesi selesai?
- Bagaimana data lokal dipetakan ke data cloud?
- Bagaimana token pemulihan participant dilindungi dan dicabut?

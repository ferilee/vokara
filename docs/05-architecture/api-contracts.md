# Kontrak API

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-17

Dokumen ini menetapkan aturan awal untuk API HTTP. Endpoint dan payload final perlu diturunkan dari model domain, aturan akses, dan kebutuhan frontend.

## Prinsip API

- API dikelompokkan berdasarkan domain.
- Request dan response memiliki schema yang tervalidasi.
- Endpoint HTTP digunakan untuk operasi yang tidak memerlukan aliran event langsung.
- WebSocket digunakan hanya untuk interaksi real-time yang relevan.
- Error memiliki bentuk yang konsisten.
- Operasi sinkronisasi aman terhadap pengiriman ulang.
- API cloud dan server lokal mengikuti kontrak yang sama sejauh kemampuan deployment memungkinkan.

## Endpoint awal

| Method dan endpoint | Tujuan |
| --- | --- |
| `GET /api/activities` | Mengambil katalog aktivitas dengan filter yang diperlukan. |
| `GET /api/activities/:id` | Mengambil metadata dan versi aktivitas. |
| `GET /api/classes/:id` | Mengambil informasi kelas yang boleh diakses. |
| `POST /api/sessions` | Membuat sesi pembelajaran. |
| `POST /api/sessions/:id/join` | Memasukkan siswa ke sesi dengan kode atau token yang valid. |
| `POST /api/sessions/:id/submissions` | Menerima submission siswa. |
| `GET /api/sessions/:id/results` | Mengambil rekap hasil sesuai izin. |
| `POST /api/sync` | Menerima batch item outbox. |

Endpoint ini adalah rancangan awal. Nama, parameter, payload, status response, pagination, dan filter belum menjadi kontrak final.

## Konvensi response

Response sukses perlu menyediakan data yang cukup untuk melanjutkan alur pengguna dan, jika relevan, metadata seperti versi, status, dan waktu server.

Response error perlu membedakan setidaknya:

- kode error stabil;
- pesan untuk pengguna atau klien;
- detail validasi yang aman;
- correlation ID untuk diagnosis;
- indikasi apakah operasi dapat dicoba ulang.

Detail internal seperti stack trace, query, dan secret tidak boleh dikirim ke klien.

## Validasi request

Validasi dilakukan pada boundary API sebelum service dipanggil. Validasi meliputi:

- tipe dan bentuk data;
- field wajib dan field yang diizinkan;
- ukuran payload;
- versi aktivitas;
- status sesi;
- hubungan entitas;
- izin pengguna;
- ID sinkronisasi dan idempotency key.

Validasi frontend membantu pengalaman pengguna, tetapi backend tetap menjadi pemeriksa utama.

## Akses dan otorisasi

Setiap operasi harus memeriksa:

- siapa pemanggilnya atau konteks identitas sesi;
- peran pemanggil;
- kepemilikan kelas atau sesi;
- hubungan peserta dengan sesi;
- status data yang diakses;
- apakah operasi tersedia pada deployment lokal atau cloud.

Kode join tidak boleh dianggap setara dengan izin administratif guru.

## Submission dan idempotensi

Submission atau item sinkronisasi harus membawa ID unik yang dibuat sebelum pengiriman. Jika request dikirim ulang dengan ID yang sama, API mengembalikan hasil penerimaan sebelumnya atau status idempotent yang setara.

Pada MVP, submission kuis bersifat final setelah diterima. Client boleh mengulangi request dengan submission ID yang sama setelah timeout, tetapi tidak boleh membuat submission ID baru untuk mengganti jawaban yang sudah diterima.

Timeout tidak boleh langsung ditafsirkan sebagai penolakan. Klien perlu dapat mencoba ulang tanpa membuat submission baru.

## Batch sinkronisasi

`POST /api/sync` perlu mempertimbangkan:

- batas jumlah item per batch;
- hasil per item, bukan hanya satu hasil untuk seluruh batch;
- item berhasil, sudah pernah diterima, ditolak, atau dapat dicoba ulang;
- ukuran payload dan timeout;
- urutan jika beberapa item saling bergantung;
- acknowledgment yang dapat disimpan klien.

## Versioning API

Perubahan yang memutus kompatibilitas harus memiliki versi atau strategi transisi yang jelas. Versi API, versi Activity SDK, dan versi aktivitas adalah tiga hal berbeda dan tidak boleh dicampur.

## HTTP dan WebSocket

HTTP digunakan untuk:

- katalog dan konfigurasi;
- pembuatan atau perubahan resource;
- join dan submission;
- rekap;
- sinkronisasi.

WebSocket digunakan untuk:

- status sesi yang perlu diperbarui langsung;
- pertanyaan atau aktivitas yang sedang dipresentasikan;
- indikasi respons baru pada layar guru;
- event kelas lain yang memang memerlukan latensi rendah.

Koneksi WebSocket tidak boleh menjadi satu-satunya tempat data penting disimpan. Event penting harus memiliki jalur persistensi atau pemulihan melalui HTTP.

## Batas request dan retry

API perlu menetapkan batas ukuran, timeout, dan aturan retry. Klien hanya melakukan retry otomatis untuk kegagalan sementara dan operasi yang aman diulang.

## Pertanyaan terbuka

- Format response standar dan kode error final.
- Mekanisme autentikasi dan token.
- Batas pagination katalog dan hasil.
- Nama field untuk waktu pencatatan, penerimaan, dan pemrosesan.
- Format batch sinkronisasi dan acknowledgment per item.
- Apakah endpoint memerlukan prefix versi seperti `/api/v1`.

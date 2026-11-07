# Catatan arsitektur awal

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Sumber:** `docs/konsep.md`  
**Terakhir diperbarui:** 2026-10-17

Dokumen ini merangkum arah arsitektur awal yang sudah disepakati sebagai dasar dokumentasi berikutnya. Detail kontrak, skema, dan deployment akan dijabarkan di folder arsitektur setelah keputusan MVP dipertegas.

## Tujuan arsitektur

Platform harus mendukung pembelajaran matematika SMK melalui dua konteks utama:

1. guru mengajar melalui IFP;
2. siswa bergabung dan merespons melalui HP masing-masing.

Platform perlu tetap berguna ketika internet tidak tersedia. Dukungan offline dibangun bertahap agar media individual dapat berjalan lebih dulu, lalu sesi kelas dapat memakai server lokal.

## Gambaran komponen

```text
Guru / IFP ─┐
            ├── Frontend React + Vite + TypeScript
Siswa / HP ─┘          │
                       ├── PWA, Cache API, IndexedDB
                       │
                       └── HTTP API / WebSocket
                                   │
                          Backend Bun + Hono
                                   │
                             SQLite + Drizzle
```

Pada deployment cloud, frontend dan backend dapat ditempatkan pada layanan pusat berbasis HTTPS. Pada deployment lokal, backend dan database berjalan pada komputer guru atau mini-PC di jaringan Wi-Fi sekolah.

## Batas tanggung jawab komponen

| Komponen | Tanggung jawab awal |
| --- | --- |
| Frontend | Navigasi, layout IFP dan HP, katalog aktivitas, sesi pengguna, umpan balik, dan status koneksi. |
| PWA dan Cache API | Menyimpan shell aplikasi serta aset yang dipilih agar media yang telah disiapkan dapat dibuka kembali. |
| IndexedDB | Menyimpan konfigurasi lokal, progres, jawaban, dan antrean sinkronisasi pada perangkat. |
| Activity SDK | Menetapkan kontrak metadata, konfigurasi, entry point, versi, dan kesiapan offline aktivitas. |
| Backend Bun + Hono | API domain, autentikasi dan otorisasi yang akan ditentukan, sesi, submission, sinkronisasi, serta koneksi real-time. |
| WebSocket | Pertukaran kejadian sesi yang perlu diterima secara langsung oleh guru atau siswa. |
| SQLite | Penyimpanan bersama pada server aplikasi untuk data MVP. |
| Drizzle ORM | Skema, migrasi, dan akses terstruktur ke SQLite. |
| `content/` | Definisi aktivitas dan aset pembelajaran yang tidak perlu dimasukkan sebagai kode backend. |

## Struktur domain awal

Domain utama yang perlu memiliki batas jelas:

- **Produk:** tujuan platform, pengguna, dan ruang lingkup MVP.
- **Akses:** identitas, peran, kelas, dan cara siswa bergabung.
- **Konten:** aktivitas, versi aktivitas, konfigurasi, dan aset.
- **Sesi:** pembukaan aktivitas, anggota, kejadian, submission, dan hasil.
- **Offline dan sinkronisasi:** cache, penyimpanan lokal, outbox, retry, dan idempotensi.
- **Deployment:** cloud HTTPS dan server lokal sekolah.

## Model data awal

Entitas yang direncanakan untuk MVP:

| Entitas | Fungsi |
| --- | --- |
| `users` | Akun guru dan siswa. |
| `classes` | Kelas yang dikelola guru. |
| `class_members` | Keanggotaan pengguna dalam kelas. |
| `activities` | Metadata aktivitas. |
| `activity_versions` | Versi media dan konfigurasi. |
| `sessions` | Sesi pembelajaran yang sedang atau sudah berlangsung. |
| `session_events` | Peristiwa dan interaksi dalam sesi. |
| `submissions` | Jawaban atau hasil kerja siswa. |
| `sync_outbox` | Data lokal yang menunggu sinkronisasi. |
| `content_assets` | Metadata aset aktivitas. |

Definisi aktivitas dan aset statis dapat disimpan sebagai JSON tervalidasi serta berkas terpisah. Media besar, animasi, atau kode aktivitas tidak perlu dimasukkan langsung ke database.

Pada pilot MVP, siswa menggunakan identitas sementara pada `session_participants`; record `users` global digunakan untuk guru dan peran pendukung.

## Prinsip offline

- Cache browser menyimpan shell aplikasi dan aset terpilih.
- IndexedDB menyimpan data yang harus bertahan pada perangkat.
- Server lokal menyediakan koordinasi kelas melalui jaringan lokal.
- Setiap jawaban memiliki ID unik dan waktu pencatatan asli.
- Pengiriman ulang harus aman sehingga jawaban tidak tercatat dua kali.
- Waktu pencatatan asli dan waktu penerimaan server disimpan terpisah.
- Deployment lokal perlu memperhitungkan batasan Service Worker pada alamat IP dan HTTP.

## Antarmuka awal yang direncanakan

Endpoint awal yang perlu dirinci pada dokumen API:

| Endpoint | Fungsi |
| --- | --- |
| `GET /api/activities` | Mengambil katalog media. |
| `GET /api/activities/:id` | Mengambil konfigurasi aktivitas. |
| `GET /api/classes/:id` | Mengambil informasi kelas. |
| `POST /api/sessions` | Membuat sesi pembelajaran. |
| `POST /api/sessions/:id/join` | Memasukkan siswa ke sesi. |
| `POST /api/sessions/:id/submissions` | Mengirim jawaban. |
| `GET /api/sessions/:id/results` | Mengambil rekap jawaban. |
| `POST /api/sync` | Mengirim antrean offline. |

Daftar ini adalah rancangan awal, bukan kontrak API final. Format request, response, autentikasi, otorisasi, validasi, dan penanganan konflik harus ditetapkan pada dokumentasi arsitektur berikutnya.

## Tahapan arsitektur MVP

1. Fondasi monorepo dan pengujian perangkat IFP.
2. Activity SDK dan katalog media.
3. Tiga media percontohan: papan tulis, grafik fungsi, dan kuis.
4. PWA, penyimpanan lokal, dan status koneksi.
5. Kelas interaktif dengan kode atau QR dan rekap jawaban.
6. Server lokal dan sinkronisasi.

## Hal yang belum diputuskan

- Nama produk final dan identitas visual.
- Detail self-service dan pemulihan akun guru setelah pilot.
- Apakah siswa akan memiliki akun permanen setelah pilot.
- Versi browser dan sistem operasi minimum pada IFP.
- Cara distribusi aset aktivitas pada cloud dan server lokal.
- Bentuk final kontrak Activity SDK.
- Aturan konflik jika satu data dikirim dari lebih dari satu perangkat.
- Mekanisme backup dan pemulihan SQLite.
- Detail HTTPS pada deployment server lokal.

# 001 — Fondasi, cloud baseline, dan perangkat

**Status:** in progress  
**Prioritas:** P0  
**Owner:** Agent utama

**Status implementasi:** in progress

## User story

Sebagai guru pilot, saya dapat membuka aplikasi yang berjalan pada deployment cloud dasar melalui IFP dan HP sehingga alur berikutnya dapat diuji pada perangkat nyata.

## Scope

- Menyiapkan aplikasi web dan API minimum yang dapat dijalankan bersama.
- Menetapkan konfigurasi environment cloud dasar, health check, dan penanganan error minimum.
- Menyediakan SQLite, migration awal, dan prosedur backup/restore untuk data pilot.
- Menyediakan layout dasar IFP dan mobile beserta navigasi minimum.
- Mencatat baseline IFP, browser, HP, sentuhan, stylus, resolusi, dan storage.

## Non-goals

- Belum membuat katalog aktivitas, sesi kelas, autentikasi penuh, atau offline.
- Belum mendukung server lokal.

## Acceptance criteria

- [ ] Web app dan API dapat dibuka pada environment pilot berbasis HTTPS.
- [x] Health check membuktikan API dan database dapat diakses.
- [x] Migration pertama dapat dijalankan pada database kosong dan backup dapat dipulihkan pada salinan environment.
- [x] Layout dasar IFP dan mobile dapat dibuka tanpa fungsi yang bergantung pada hover.
- [x] Error jaringan dan API dasar ditampilkan secara aman serta dapat dipahami.
- [ ] IFP target dan minimal dua kategori HP diuji; hasilnya dicatat sesuai `device-testing.md`.
- [ ] Ada pengujian otomatis atau integrasi untuk startup, health check, dan migration dasar.

## Blocked by

- [x] Issue 000 — Keputusan pilot P0

## Referensi

- `docs/05-architecture/deployment.md`
- `docs/05-architecture/data-model.md`
- `docs/06-planning/device-testing.md`
- `docs/06-planning/pilot-deployment-runbook.md`
- `docs/06-planning/device-testing-record.md`
- `deploy/README.md`

## Progress implementasi

- [x] Monorepo Bun workspace dengan `apps/web`, `apps/api`, dan `packages/database`.
- [x] Web app React + Vite + TypeScript dengan layout IFP/mobile dan halaman device baseline.
- [x] API Bun + Hono dengan endpoint `/health`, CORS development, dan error response dasar.
- [x] SQLite dengan migration `0000_initial` dan mode WAL.
- [x] Command backup dan restore database dengan proteksi overwrite.
- [x] Typecheck workspace dan production build web berhasil.
- [x] Smoke check runtime `/health` mengembalikan `status: ok` dan `database: ok`.
- [x] Smoke check backup dan restore berhasil pada dua file SQLite terisolasi.
- [x] Contoh konfigurasi environment tersedia untuk API dan web.
- [x] Runbook deployment pilot dan lembar baseline perangkat tersedia.
- [x] Command `start` API dan `build` root tersedia untuk rilis dasar.
- [x] Dockerfile API, Dockerfile web, dan Compose dengan external network `ferileenet` tersedia.
- [x] Compose berhasil dirender dan image API/web berhasil dibangun.
- [x] Smoke check image API pada container mengembalikan `status: ok` dan `database: ok`.
- [x] Workflow GitHub Actions untuk publish image API/web ke GHCR tersedia.
- [x] Compose runtime sudah menggunakan image GHCR sehingga VPS tidak membutuhkan source repository.
- [x] Namespace GHCR pilot ditetapkan ke `ferilee` untuk repository `ferilee/vokara`.
- [ ] Inventaris dan uji manual pada IFP Merah Putih aktual.
- [ ] Uji manual pada minimal dua kategori HP.
- [x] Uji restore backup pada salinan environment yang terisolasi.
- [ ] Pengujian otomatis atau integrasi untuk startup, health check, dan migration dasar.

## Bukti dan pekerjaan tersisa

Pemeriksaan yang dapat dilakukan dari workspace sudah selesai: dependency terpasang, migration berjalan, typecheck berhasil, production build berhasil, `/health` mengembalikan status database sehat, dan backup dapat dipulihkan ke file SQLite terpisah.

Issue tetap `in progress` karena empat acceptance criterion masih membutuhkan pekerjaan lanjutan:

- deployment pilot berbasis HTTPS;
- perangkat IFP Merah Putih aktual;
- minimal dua kategori HP aktual;
- pengujian otomatis atau integrasi untuk startup, health check, dan migration.

Pengujian otomatis atau integrasi belum ditambahkan karena tahap ini masih mengikuti validasi manual fondasi. Semua criterion tersebut perlu ditutup pada iterasi validasi berikutnya bersama environment pilot.

## Cara menjalankan fondasi

```bash
bun install
bun run dev:api
bun run dev:web
```

Backup dan restore dijalankan dari folder API:

```bash
bun --cwd apps/api db:backup backups/pilot.sqlite
ALLOW_OVERWRITE=true bun --cwd apps/api db:restore backups/pilot.sqlite data/restored.sqlite
```

Server API menerima `PORT`, `DATABASE_URL`, `CORS_ORIGIN`, dan `NODE_ENV` melalui environment.

## Implementation packet

### Kontrak yang terdampak

- Konfigurasi runtime: mode deployment, origin publik, lokasi database, logging, dan health check.
- Data: versi schema awal, migration, metadata backup, serta status health API.
- UI: shell aplikasi dengan layout IFP dan mobile tanpa domain aktivitas atau sesi.

### Failure case yang wajib diuji

- Database tidak tersedia saat aplikasi dimulai.
- Migration gagal di tengah proses dan aplikasi tidak boleh memakai schema setengah jadi.
- API mengembalikan error dan UI tidak membocorkan detail internal.
- IFP atau HP tidak mendukung kemampuan browser yang diperlukan.

### Bukti selesai

- Catatan perangkat berisi model, browser, resolusi, sentuhan, stylus, dan storage.
- Hasil health check, migration database kosong, serta restore backup pada salinan environment.
- Bukti pengujian startup dan error path otomatis atau integrasi.

### Definition of done dan rollback

- Dokumentasi deployment dan baseline perangkat diperbarui.
- Rilis awal dapat dikembalikan ke artefak serta backup database sebelumnya jika migration atau startup gagal.

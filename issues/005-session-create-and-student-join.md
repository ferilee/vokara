# 005 — Membuat sesi dan join siswa

**Status:** proposed  
**Prioritas:** P0  
**Owner:** Agent kelas/offline

## User story

Sebagai guru, saya dapat memilih kuis, membuka sesi, menampilkan kode atau QR, lalu melihat siswa berhasil bergabung dari HP menggunakan identitas sesi yang disetujui.

## Scope

- Membuat session dari aktivitas dan versi yang dipilih.
- Menerapkan state `draft`, `open`, `active`, `paused`, dan `closed` yang relevan pada alur join.
- Membuat kode serta QR sesi dengan masa berlaku yang telah diputuskan.
- Mengizinkan siswa bergabung dengan identitas sesi dan menampilkan konfirmasi join.
- Menampilkan daftar peserta kepada guru.
- Memeriksa ownership guru dan isolasi antar sesi pada backend.

## Non-goals

- Belum menerima jawaban siswa, menampilkan rekap, atau memerlukan WebSocket.
- Belum mendukung siswa berpindah perangkat kecuali diputuskan pada issue `000`.

## Acceptance criteria

- [ ] Guru hanya dapat membuat dan mengelola sesi untuk aktivitas serta kelas yang diizinkan.
- [ ] Kode dan QR hanya membuka satu sesi yang sedang menerima peserta.
- [ ] Siswa memperoleh konfirmasi join dan tidak dapat bergabung ketika sesi tertutup atau kode kedaluwarsa.
- [ ] Guru melihat daftar peserta yang berhasil bergabung tanpa memaparkan data siswa dari sesi lain.
- [ ] Perubahan URL atau ID pada request tidak memberi akses pada sesi lain.
- [ ] Lifecycle sesi dan join memiliki pengujian API/integrasi termasuk kode salah, kode kedaluwarsa, dan sesi tertutup.
- [ ] Alur guru serta siswa diuji pada IFP dan HP.

## Blocked by

- [ ] Issue 000 — Keputusan pilot P0
- [ ] Issue 002 — Katalog aktivitas dan kuis tracer

## Referensi

- `docs/02-access/classroom-access.md`
- `docs/02-access/roles-and-permissions.md`
- `docs/05-architecture/api-contracts.md`

## Implementation packet

### Keputusan yang terkunci

- Identitas siswa, format nama tampilan, format kode join, masa berlaku, dan aturan join ulang berasal dari issue `000`.
- Hanya transisi sesi yang terdokumentasi yang diizinkan: `draft → open → active/paused → closed`.
- Kode join tidak memberi hak guru, akses lintas sesi, atau akses riwayat kelas.

### Kontrak yang terdampak

- Session: ID, class, activity version, status, waktu buka/tutup, dan pemilik guru.
- Join: kode atau QR, identitas sesi siswa, masa berlaku, serta hasil join.
- API: pembuatan sesi, join, daftar peserta, dan error akses.

### Failure case yang wajib diuji

- Kode salah, kedaluwarsa, sudah dicabut, atau dipakai setelah sesi ditutup.
- Nama tampilan kosong, melampaui batas, atau duplikat dalam satu sesi.
- Siswa mencoba bergabung ke sesi lain dengan mengganti ID atau token.
- Guru mencoba mengelola sesi milik guru lain.

### Bukti selesai dan definition of done

- Matriks state session dan aturan join tersedia.
- Uji API membuktikan isolasi sesi; uji perangkat membuktikan QR dan input kode dapat digunakan pada IFP serta HP.

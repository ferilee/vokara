# 009 — Server lokal untuk kelas offline

**Status:** proposed  
**Prioritas:** P0  
**Owner:** Agent kelas/offline

## User story

Sebagai guru di sekolah tanpa internet, saya dapat menjalankan Vokara pada komputer guru atau mini-PC, membuka sesi melalui IFP, dan menerima jawaban siswa melalui Wi-Fi lokal.

## Scope

- Menjalankan paket aplikasi, database SQLite, aktivitas, dan aset pada server lokal.
- Membuat sesi lokal, join siswa dengan kode atau QR lokal, submission, dan rekap lokal.
- Menentukan cara perangkat menemukan server lokal pada jaringan pilot.
- Menyediakan start, stop, health check, backup, restore, dan pemulihan setelah server restart.
- Menampilkan perbedaan status Wi-Fi lokal, internet, dan sinkronisasi cloud.

## Non-goals

- Belum menyinkronkan data server lokal ke cloud.
- Belum menjanjikan Service Worker penuh apabila HTTPS lokal belum layak pada perangkat target.
- Belum mendukung beberapa server lokal dalam satu sekolah.

## Acceptance criteria

- [ ] IFP dan HP target dapat menemukan serta membuka server lokal pada Wi-Fi pilot tanpa internet.
- [ ] Guru dapat membuat sesi lokal; siswa dapat join, mengirim kuis, dan guru melihat rekap lokal.
- [ ] Restart server tidak merusak sesi atau submission yang sudah disimpan.
- [ ] Backup dapat dibuat dan dipulihkan pada perangkat yang sama atau perangkat pengganti.
- [ ] Kegagalan router atau server mempertahankan data perangkat yang belum terkirim sesuai kemampuan offline individual.
- [ ] Operator dapat menjalankan prosedur start, health check, backup, dan restore dari dokumentasi.
- [ ] Uji dilakukan pada IFP dan minimal dua HP melalui jaringan lokal nyata.

## Blocked by

- [ ] Issue 006 — Submission dan rekap sesi
- [ ] Issue 007 — Persiapan offline dan pemulihan progres

## Referensi

- `docs/04-offline-and-sync/local-server.md`
- `docs/05-architecture/deployment.md`
- `docs/05-architecture/security-and-secrets.md`

## Implementation packet

### Topologi dan operasional pilot

- Tentukan perangkat server lokal, sistem operasi, kapasitas storage, sumber daya listrik, dan operator sekolah.
- Tentukan satu cara discovery yang dipakai pilot: QR berisi alamat lokal dan kode sesi, nama host lokal, atau alamat IP yang ditampilkan guru.
- Tentukan apakah frontend dilayani server lokal atau sudah dipasang pada perangkat; keputusan HTTPS dan Service Worker mengikuti issue `000`.
- Runbook harus mencakup start, stop, health check, backup, restore, update, dan tindakan ketika router atau server berhenti.

### Failure case yang wajib diuji

- Router mati saat ada submission lokal.
- Server restart saat sesi aktif atau setelah database ditulis.
- Storage server penuh atau database tidak dapat dibuka.
- HP dapat terhubung Wi-Fi tetapi tidak dapat menjangkau server.
- Perangkat server diganti dan backup harus dipulihkan.

### Bukti selesai

- Diagram jaringan pilot dan daftar perangkat yang dipakai.
- Rekaman hasil uji tanpa internet dengan satu IFP dan minimal dua HP.
- Bukti backup/restore pada perangkat pengganti atau environment yang setara.

### Definition of done

- Operator non-pengembang dapat mengikuti runbook untuk membuka sesi dan memulihkan backup.
- Status jaringan lokal, internet, dan cloud tidak tertukar pada tampilan pengguna.

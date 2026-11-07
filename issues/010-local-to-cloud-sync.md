# 010 — Sinkronisasi server lokal ke cloud

**Status:** proposed  
**Prioritas:** P0  
**Owner:** Agent kelas/offline

## User story

Sebagai guru yang menjalankan kelas melalui server lokal, saya dapat mengirim data sesi ke cloud setelah internet pulih tanpa menggandakan, menimpa, atau mencampur data dari kelas lain.

## Scope

- Memberi server lokal identitas stabil dan mencatat asal setiap data yang disinkronkan.
- Mengirim sesi, peserta, event yang diperlukan, dan submission dari server lokal ke cloud.
- Memetakan ID lokal ke cloud tanpa bergantung pada urutan insert.
- Menyediakan acknowledgement, retry, observability, dan status sinkronisasi untuk operator.
- Mendefinisikan penanganan konflik untuk kasus yang benar-benar didukung pilot.

## Non-goals

- Belum mendukung edit paralel pada server lokal dan cloud.
- Belum menyinkronkan semua cache aset atau seluruh log event berfrekuensi tinggi.
- Belum mendukung federation antarsekolah.

## Acceptance criteria

- [ ] Server lokal yang sama dapat restart lalu melanjutkan sinkronisasi tanpa identitas baru.
- [ ] Data sinkronisasi dapat ditelusuri ke server lokal, sesi, aktivitas versi, dan waktu kejadian asli.
- [ ] Pengiriman ulang batch tidak menduplikasi session, submission, atau hasil.
- [ ] Konflik yang didukung memiliki aturan deterministik dan konflik di luar scope terlihat oleh operator.
- [ ] Cloud dapat membedakan data diterima baru, sudah diterima, ditolak, atau menunggu retry.
- [ ] Operator dapat melihat jumlah data tertunda, terakhir sinkron, dan kegagalan permanen.
- [ ] Pengujian integrasi mencakup internet putus, server restart, pengiriman ulang, batch parsial, dan konflik yang didukung.

## Blocked by

- [ ] Issue 008 — Outbox dan sinkronisasi idempotent
- [ ] Issue 009 — Server lokal untuk kelas offline

## Referensi

- `docs/04-offline-and-sync/synchronization.md`
- `docs/05-architecture/data-model.md`
- `docs/05-architecture/deployment.md`

## Implementation packet

### Kontrak identitas dan konflik

- Setiap server lokal memiliki server ID stabil; setiap data membawa source ID dan local ID sebelum menerima cloud ID.
- Urutan sinkronisasi minimum: aktivitas versi yang dibutuhkan, sesi, peserta, lalu submission dan event yang dipilih.
- Konflik yang didukung pilot dibatasi pada pengiriman ulang data sama; edit paralel tidak didukung dan harus terlihat sebagai conflict manual.
- Log sinkronisasi mencatat batch ID, server ID, waktu mulai/selesai, hasil per item, dan alasan kegagalan.

### Failure case yang wajib diuji

- Internet putus di tengah batch dan pulih setelah server lokal restart.
- Cloud sudah menerima sebagian batch sebelum timeout.
- Local ID sama dari server yang berbeda.
- Cloud menolak activity version atau participant yang belum tersedia.
- Operator mencoba sync ulang batch yang sudah selesai.

### Bukti selesai

- Matriks pemetaan ID lokal-ke-cloud dan matriks konflik tersedia.
- Uji integrasi mencakup partial batch, retry, restart lokal, duplicate delivery, dan permanent rejection.
- Operator dapat melihat status terakhir, jumlah item tertunda, dan tindakan untuk kegagalan permanen.

### Definition of done dan rollback

- Semua data yang diterima cloud dapat ditelusuri ke sumber lokalnya.
- Jika sinkronisasi baru dihentikan, server lokal tetap menyimpan outbox dan kelas lokal tetap dapat digunakan tanpa cloud.

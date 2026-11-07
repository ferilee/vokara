# 008 — Outbox dan sinkronisasi idempotent

**Status:** proposed  
**Prioritas:** P0  
**Owner:** Agent kelas/offline

## User story

Sebagai siswa yang mengirim jawaban saat offline, saya mengetahui jawaban tersimpan di perangkat dan jawaban tersebut diterima satu kali oleh server ketika koneksi pulih.

## Scope

- Menyimpan submission offline dan item outbox secara atomik pada perangkat.
- Memberi setiap submission dan item sinkronisasi ID unik sebelum dikirim.
- Menyediakan endpoint batch sinkronisasi dengan hasil per item.
- Menangani acknowledgement, retry sementara, penolakan permanen, dan status UI.
- Menyimpan waktu pencatatan asli serta waktu penerimaan server.

## Non-goals

- Belum menyinkronkan server lokal ke cloud.
- Belum menyelesaikan konflik perubahan multi-perangkat selain retry submission yang sama.

## Acceptance criteria

- [ ] Submission saat offline tetap ada setelah refresh dan browser restart.
- [ ] Satu transaksi lokal tidak dapat menyimpan submission tanpa item outbox atau sebaliknya.
- [ ] Saat koneksi pulih, klien menerima hasil per item: baru diterima, sudah diterima, ditolak permanen, atau dapat dicoba ulang.
- [ ] Timeout setelah server menerima data tidak membuat submission kedua saat retry.
- [ ] Item tidak dihapus sebelum acknowledgement yang sesuai diterima.
- [ ] Error permanen berhenti di-retry dan dapat dilihat pengguna atau operator.
- [ ] Pengujian integrasi mencakup retry, server menerima dua kali, batch campuran, payload invalid, dan restart browser.

## Blocked by

- [ ] Issue 006 — Submission dan rekap sesi
- [ ] Issue 007 — Persiapan offline dan pemulihan progres

## Referensi

- `docs/04-offline-and-sync/synchronization.md`
- `docs/05-architecture/api-contracts.md`

## Implementation packet

### Protokol outbox

- Satu item memuat sync ID, submission ID, payload tervalidasi, activity version, session context, waktu asli, jumlah retry, dan status terakhir.
- Acknowledgement per item menggunakan status: `accepted`, `already_accepted`, `rejected`, atau `retryable`.
- Batas ukuran batch, maksimum retry otomatis, jeda retry, dan kondisi retry manual harus didokumentasikan sebelum implementasi.
- Item hanya selesai setelah acknowledgement `accepted` atau `already_accepted` diterima dan disimpan lokal.

### Failure case yang wajib diuji

- Timeout setelah server menulis data namun sebelum client menerima response.
- Batch berisi kombinasi item valid, sudah diterima, invalid, dan sementara gagal.
- Aplikasi atau browser berhenti di antara penyimpanan submission dan pembentukan outbox.
- Jam perangkat berbeda dengan jam server.
- User kembali online berkali-kali sehingga retry berjalan bersamaan.

### Bukti selesai

- Contract test API batch dan acknowledgement per item.
- Test end-to-end offline submission, restart browser, reconnect, dan verifikasi satu submission di rekap guru.
- Log atau layar operator menunjukkan alasan item permanent failure.

### Definition of done dan rollback

- Format item dan rules idempotensi terdokumentasi pada API serta sinkronisasi.
- Jika rilis sinkronisasi bermasalah, client mempertahankan outbox lama dan server tetap menerima format sebelumnya selama masa transisi yang diputuskan.

# 006 — Submission dan rekap sesi

**Status:** proposed  
**Prioritas:** P0  
**Owner:** Agent kelas/offline

## User story

Sebagai siswa yang sudah bergabung ke sesi, saya dapat mengirim jawaban kuis; sebagai guru, saya dapat melihat status respons dan rekap hasil sesi secara langsung tanpa refresh manual.

## Scope

- Menerima submission kuis dari peserta sesi yang sah.
- Menyimpan ID submission, identitas peserta, aktivitas dan versi, waktu pencatatan, serta hasil penilaian.
- Menampilkan status penerimaan kepada siswa dan rekap teragregasi kepada guru.
- Menyiarkan event minimum ketika respons baru tersedia atau status sesi berubah.
- Memastikan data penting dapat dibaca kembali melalui HTTP.

## Non-goals

- Belum mendukung pengiriman offline, batch sinkronisasi, revisi jawaban setelah final, atau event papan tulis.
- Belum menjadi dashboard analitik lintas kelas.

## Acceptance criteria

- [ ] Hanya peserta dari sesi aktif yang dapat mengirim submission.
- [ ] Server memvalidasi payload kuis, versi aktivitas, dan status sesi.
- [ ] Siswa menerima status diterima atau ditolak yang dapat dipahami.
- [ ] Guru melihat jumlah respons, jawaban benar/salah, dan daftar hasil sesuai izin.
- [ ] Notifikasi real-time tidak menjadi satu-satunya sumber data; refresh halaman tetap memulihkan rekap yang sama.
- [ ] Request yang sama tidak mencatat submission kedua pada alur online.
- [ ] Pengujian mencakup izin, sesi tertutup, payload tidak valid, pengiriman ulang, rekap, dan reconnect WebSocket.

## Blocked by

- [ ] Issue 005 — Membuat sesi dan join siswa

## Referensi

- `docs/05-architecture/realtime-communication.md`
- `docs/05-architecture/data-model.md`
- `docs/04-offline-and-sync/synchronization.md`

## Implementation packet

### Kontrak submission dan rekap

- Submission memuat ID unik, session ID, participant ID, activity ID dan version, waktu pencatatan, jawaban, hasil penilaian, serta status penerimaan.
- Rekap guru minimal menampilkan jumlah peserta, jumlah submission, benar, salah, dan belum merespons.
- Event real-time hanya memberi notifikasi perubahan; HTTP tetap menjadi sumber pemulihan rekap.

### Failure case yang wajib diuji

- Submission dari peserta yang belum join, sudah dikeluarkan, atau sesi telah ditutup.
- Payload menggunakan activity version yang tidak sama dengan sesi.
- Request terulang setelah timeout atau pengguna menekan submit berulang.
- Koneksi WebSocket putus sebelum atau sesudah server menyimpan submission.
- Guru tanpa ownership mencoba meminta rekap sesi.

### Bukti selesai

- Contract test untuk payload valid dan invalid, authorization test, serta test duplikasi request.
- Uji integrasi dua HP siswa dan satu IFP guru untuk notifikasi serta refresh rekap.

### Definition of done

- Schema submission, event, dan rekap terdokumentasi pada API serta model data.
- Tidak ada jalur UI yang menandai jawaban diterima sebelum server memberi acknowledgement.

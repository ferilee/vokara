# 011 — Kesiapan pilot MVP

**Status:** proposed  
**Prioritas:** P0  
**Owner:** Agent utama

## User story

Sebagai pemilik pilot, saya memiliki bukti bahwa guru dan siswa dapat menjalankan tiga aktivitas, sesi online, offline individual, serta kelas lokal dengan data yang dapat dipulihkan.

## Scope

- Menjalankan uji penerimaan terpadu berdasarkan dokumen produk, akses, offline, deployment, dan perangkat.
- Memeriksa dokumentasi, backup, restore, migration, keamanan dasar, serta prosedur operator.
- Mencatat temuan, bukti perangkat, risiko P0, dan keputusan lanjut atau menunda pilot.

## Non-goals

- Bukan tempat menambah fitur baru yang belum menjadi acceptance criteria MVP.
- Bukan pengganti pengujian unit, integrasi, dan perangkat di issue sebelumnya.

## Acceptance criteria

- [ ] Kuis, papan tulis, dan grafik fungsi memenuhi acceptance criteria masing-masing pada IFP dan HP target.
- [ ] Guru dapat membuat sesi, siswa join, mengirim respons, dan guru melihat rekap pada deployment cloud.
- [ ] Offline individual dapat menyimpan progres dan mengirim submission tanpa duplikasi setelah koneksi pulih.
- [ ] Server lokal menjalankan sesi kelas tanpa internet dan data dapat dipulihkan setelah restart.
- [ ] Sinkronisasi server lokal ke cloud memiliki bukti pengujian retry dan tidak ada data ganda.
- [ ] Backup, restore, migration, health check, dan prosedur operator diuji serta hasilnya dicatat.
- [ ] Semua pertanyaan P0 sudah selesai atau pilot ditunda dengan alasan tertulis.
- [ ] Risiko tersisa memiliki owner, mitigasi, dan keputusan penerimaan.

## Blocked by

- [ ] Issue 003 — Papan tulis matematika
- [ ] Issue 004 — Eksplorasi grafik fungsi
- [ ] Issue 006 — Submission dan rekap sesi
- [ ] Issue 008 — Outbox dan sinkronisasi idempotent
- [ ] Issue 009 — Server lokal untuk kelas offline
- [ ] Issue 010 — Sinkronisasi server lokal ke cloud

## Referensi

- `docs/01-product/mvp-scope.md`
- `docs/06-planning/device-testing.md`
- `docs/06-planning/mvp-roadmap.md`

## Implementation packet

### Skrip pilot wajib

1. Guru membuka deployment cloud pada IFP dan memilih tiga aktivitas.
2. Dua siswa bergabung ke kuis, mengirim respons, lalu guru membuka rekap.
3. Satu siswa mengerjakan kuis offline, menutup browser, membuka kembali, lalu melakukan sinkronisasi.
4. Guru membuka sesi yang sama melalui server lokal tanpa internet; dua siswa join dan mengirim respons.
5. Server lokal direstart, backup dipulihkan pada environment setara, lalu data lokal disinkronkan ke cloud.

### Go/no-go criteria

- **Go:** semua acceptance criterion P0 lulus, tidak ada kehilangan atau duplikasi data pada skenario wajib, dan operator dapat menjalankan runbook.
- **Conditional go:** hanya batasan yang tidak mengganggu alur kelas, memiliki mitigasi tertulis, dan diterima pemilik pilot.
- **No-go:** kegagalan akses lintas sesi, kehilangan data, submission duplikat, kegagalan restore, atau perangkat target tidak dapat menjalankan alur utama.

### Bukti selesai

- Laporan pengujian mencantumkan perangkat, versi aplikasi, versi aktivitas, jaringan, langkah, hasil, dan bukti masalah.
- Daftar risiko tersisa memiliki severity, owner, mitigasi, serta keputusan penerimaan.
- Dokumen akses, konten, offline, arsitektur, deployment, dan issue diperbarui bila hasil pilot mengubah asumsi.

### Definition of done

- Pemilik pilot memberikan keputusan tertulis `go`, `conditional go`, atau `no-go`.
- Semua issue blocker ditutup atau memiliki keputusan penundaan yang terdokumentasi.

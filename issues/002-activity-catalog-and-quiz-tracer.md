# 002 — Katalog aktivitas dan kuis tracer

**Status:** proposed  
**Prioritas:** P0  
**Owner:** Agent konten

## User story

Sebagai guru, saya dapat menemukan satu kuis matematika di katalog, meninjaunya, lalu menjalankannya pada IFP atau HP untuk membuktikan alur aktivitas dari metadata sampai umpan balik.

## Scope

- Membuat kontrak Activity SDK minimum yang telah diputuskan pada issue `000`.
- Menyimpan satu definisi aktivitas, satu versi, konfigurasi valid, dan aset minimum.
- Menyediakan katalog, halaman detail, dan runtime untuk memuat aktivitas.
- Mengimplementasikan satu kuis pilihan ganda dengan satu tipe soal, satu jawaban benar, dan umpan balik langsung.
- Mencatat versi aktivitas pada state atau hasil yang disimpan.

## Non-goals

- Belum ada sesi kelas, QR, rekap guru, game, editor konten, atau banyak tipe soal.
- Belum menjanjikan offline; hanya menampilkan capability yang sebenarnya tersedia.

## Acceptance criteria

- [ ] Definition, konfigurasi valid dan tidak valid, serta capability kuis divalidasi pada frontend dan backend.
- [ ] Katalog hanya menampilkan aktivitas yang berstatus tersedia untuk pilot.
- [ ] Guru dapat membuka detail kuis dan memulai aktivitas dari sana.
- [ ] Siswa atau pengguna dapat memilih satu jawaban melalui kontrol sentuh yang layak.
- [ ] Kuis menghitung benar/salah dan memberi umpan balik sesuai konfigurasi.
- [ ] Runtime menolak versi, aset, atau konfigurasi yang tidak kompatibel dengan pesan yang dapat ditindaklanjuti.
- [ ] Alur katalog sampai jawaban diuji pada IFP dan HP serta memiliki pengujian otomatis untuk validasi dan penilaian kuis.

## Blocked by

- [ ] Issue 001 — Fondasi, cloud baseline, dan perangkat

## Referensi

- `docs/03-content/activity-model.md`
- `docs/05-architecture/activity-sdk.md`
- `docs/03-content/content-authoring.md`

## Implementation packet

### Keputusan dan batas kuis pilot

- Satu tipe soal pilihan ganda dengan empat opsi, satu jawaban benar, tanpa batas waktu.
- Umpan balik diberikan setelah submit; jawaban tidak dapat direvisi pada tracer ini kecuali issue `000` menetapkan sebaliknya.
- Konten kuis harus menyebutkan tujuan belajar, instruksi, jawaban benar, dan alasan umpan balik.
- Kuis tidak boleh membutuhkan sesi kelas, WebSocket, atau request pihak ketiga.

### Kontrak yang terdampak

- Activity definition: ID, versi, mode, capability, tujuan belajar, entry point, dan status publikasi.
- Konfigurasi kuis: prompt, empat opsi, jawaban benar, umpan balik, dan schema version.
- Katalog: metadata ringkas, detail aktivitas, dan alasan aktivitas tidak dapat dijalankan.

### Failure case yang wajib diuji

- Konfigurasi tanpa jawaban benar, opsi kurang dari empat, atau jawaban benar di luar daftar opsi.
- Versi SDK atau aset tidak kompatibel.
- Aktivitas berstatus draft atau deprecated dicoba dijalankan.
- Penilaian menerima input yang tidak sesuai tipe pilihan.

### Bukti selesai dan definition of done

- Ada fixture konten valid dan invalid, bukti validasi frontend/backend, serta uji alur IFP dan HP.
- Kontrak Activity SDK yang benar-benar dipakai didokumentasikan dan perubahan dari rancangan awal memiliki decision record.

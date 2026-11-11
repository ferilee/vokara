# 002 — Katalog aktivitas dan kuis tracer

**Status:** in progress
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

- [x] Definition, konfigurasi valid dan tidak valid, serta capability kuis divalidasi pada frontend dan backend.
- [x] Katalog hanya menampilkan aktivitas yang berstatus tersedia untuk pilot.
- [x] Guru dapat membuka detail kuis dan memulai aktivitas dari sana.
- [x] Siswa atau pengguna dapat memilih satu jawaban melalui kontrol sentuh yang layak.
- [x] Kuis menghitung benar/salah dan memberi umpan balik sesuai konfigurasi.
- [x] Runtime menolak versi atau konfigurasi yang tidak kompatibel dengan pesan yang dapat ditindaklanjuti; kuis tracer tidak memiliki aset eksternal.
- [ ] Alur katalog sampai jawaban diuji pada IFP dan HP serta memiliki pengujian otomatis untuk validasi dan penilaian kuis.

## Blocked by

- [x] Issue 001 — Fondasi, cloud baseline, dan perangkat

## Referensi

- `docs/03-content/activity-model.md`
- `docs/05-architecture/activity-sdk.md`
- `docs/03-content/content-authoring.md`

## Progress implementasi

- [x] Package `@vokara/activity-sdk` dengan definition, konfigurasi kuis, capability, versioning, dan validator.
- [x] Fixture kuis tracer Aljabar Dasar dengan empat opsi dan satu jawaban benar.
- [x] Endpoint `GET /api/activities` hanya mengembalikan aktivitas `published` yang lolos validasi.
- [x] Endpoint `GET /api/activities/:id` mengembalikan definition dan konfigurasi versi aktivitas.
- [x] Frontend memiliki alur katalog → detail → runtime kuis.
- [x] Kontrol jawaban menggunakan target sentuh dan feedback benar/salah.
- [x] Test validator SDK: konfigurasi valid, opsi kurang, dan schema tidak kompatibel.
- [x] Test API: katalog published, detail aktivitas, health, dan error aman.
- [ ] Uji alur katalog sampai feedback pada IFP dan minimal satu HP di deployment pilot.

## Checklist pengujian HP pilot

Gunakan image GHCR terbaru setelah GitHub Actions selesai dan Arcane sudah Pull/Redeploy.

- [ ] Buka `https://vokara.smkpasirian-lmj.sch.id` pada HP.
- [ ] Status menunjukkan `API terhubung`.
- [ ] Katalog menampilkan `Kuis Tracer Aljabar Dasar`.
- [ ] Detail aktivitas menampilkan tujuan belajar, capability, dan versi `1.0.0`.
- [ ] Tombol `Mulai kuis` dapat ditekan melalui touch.
- [ ] Empat pilihan jawaban tampil dan dapat dipilih.
- [ ] Jawaban benar menampilkan feedback benar.
- [ ] Jawaban salah menampilkan feedback perbaikan.
- [ ] Tombol kembali dan selesai dapat digunakan.
- [ ] Screenshot atau catatan hasil disimpan bersama model HP, browser, viewport, touch points, dan waktu pengujian.

## Bukti validasi lokal

```text
bun run typecheck  → berhasil
bun run build      → berhasil
bun run test       → 7 test berhasil, 0 gagal
```

Test mencakup validasi konfigurasi, schema compatibility, katalog published, detail aktivitas, startup runtime, health check, migration idempotent, dan error 404 aman.

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

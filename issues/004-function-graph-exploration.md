# 004 — Eksplorasi grafik fungsi

**Status:** proposed  
**Prioritas:** P0  
**Owner:** Agent konten

## User story

Sebagai siswa, saya dapat mengubah parameter fungsi linear pada HP atau IFP dan langsung melihat perubahan grafik agar memahami hubungan parameter dengan gradien serta titik potong.

## Scope

- Membuat aktivitas `explore` untuk fungsi linear berbentuk `y = mx + c`.
- Menyediakan kontrol `m` dan `c` dengan rentang yang ditetapkan pada konfigurasi.
- Menampilkan grafik, nilai parameter aktif, dan instruksi eksplorasi.
- Menyimpan konfigurasi serta state parameter untuk dibuka kembali.

## Non-goals

- Belum mendukung fungsi kuadrat, sistem persamaan, plotting bebas, GeoGebra, atau penilaian otomatis.
- Belum mengirim state parameter ke peserta lain secara real-time.

## Acceptance criteria

- [ ] Konfigurasi memvalidasi rentang, langkah perubahan, dan nilai awal `m` serta `c`.
- [ ] Perubahan parameter memperbarui grafik dan label secara konsisten.
- [ ] Grafik menampilkan sumbu, skala, dan titik potong yang cukup untuk tujuan aktivitas.
- [ ] Kontrol dapat dipakai melalui sentuhan pada IFP dan HP.
- [ ] State parameter dipulihkan setelah refresh.
- [ ] Perhitungan gradien dan titik potong memiliki pengujian otomatis.
- [ ] Aktivitas diuji pada perangkat target tanpa request jaringan pada alur eksplorasi inti.

## Blocked by

- [ ] Issue 002 — Katalog aktivitas dan kuis tracer

## Referensi

- `docs/03-content/curriculum-map.md`
- `docs/05-architecture/activity-sdk.md`

## Implementation packet

### Keputusan dan model matematika

- Rumus pilot adalah `y = mx + c`; nilai `m` dan `c`, rentang, serta langkah perubahan ditentukan melalui konfigurasi aktivitas.
- Grafik menampilkan sumbu, skala, garis, gradien, dan titik potong sesuai tujuan belajar yang dipilih.
- Aturan pembulatan label, penanganan nilai nol, dan format angka harus konsisten dan diuji.

### Kontrak yang terdampak

- Schema konfigurasi parameter `m` dan `c`.
- State eksplorasi yang menyimpan nilai parameter aktif.
- `math-core` atau fungsi matematika yang menghitung titik potong dan koordinat grafik.

### Failure case yang wajib diuji

- Nilai parameter di luar rentang atau langkah tidak valid.
- Tampilan sempit menyebabkan label, kontrol, atau grafik bertumpuk.
- Nilai `m = 0`, `c = 0`, serta kombinasi negatif.
- State lama dibuka dengan konfigurasi versi berbeda.

### Bukti selesai dan definition of done

- Tabel kasus matematis dan hasil grafik yang diharapkan.
- Uji otomatis untuk perhitungan titik potong, uji visual atau interaksi untuk kontrol sentuh, dan bukti penggunaan pada IFP serta HP.

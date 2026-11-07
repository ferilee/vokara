# 007 — Persiapan offline dan pemulihan progres

**Status:** proposed  
**Prioritas:** P0  
**Owner:** Agent kelas/offline

## User story

Sebagai guru atau siswa, saya dapat menyiapkan kuis untuk digunakan tanpa internet, mengerjakannya, lalu membuka kembali progres yang sama setelah refresh atau browser ditutup.

## Scope

- Menyediakan mekanisme persiapan aset aplikasi dan kuis untuk offline individual.
- Menyimpan konfigurasi serta progres aktivitas pada IndexedDB.
- Menampilkan status kesiapan offline, koneksi, dan batas kemampuan aktivitas.
- Memulihkan progres setelah refresh atau browser dibuka kembali.
- Menguji perilaku Service Worker atau strategi pengganti pada deployment yang dipilih.

## Non-goals

- Belum mengirim submission offline ke server.
- Belum menyinkronkan session lintas perangkat atau menjalankan kelas lokal.
- Belum menjadikan semua aktivitas otomatis offline-ready.

## Acceptance criteria

- [ ] Guru atau pengguna dapat melihat aktivitas mana yang siap digunakan offline.
- [ ] Kuis yang telah disiapkan dapat dibuka tanpa internet.
- [ ] Progres jawaban dan konfigurasi aktivitas tersedia setelah refresh serta browser restart.
- [ ] Aset atau konfigurasi yang tidak tersedia memberikan pesan yang jelas, bukan halaman rusak.
- [ ] Status offline individual dibedakan dari sesi kelas.
- [ ] Storage lokal memiliki versi dan tidak memulihkan state dari aktivitas yang tidak kompatibel.
- [ ] Pengujian perangkat mencakup online → siapkan → offline → refresh → buka kembali.

## Blocked by

- [ ] Issue 002 — Katalog aktivitas dan kuis tracer
- [ ] Issue 006 — Submission dan rekap sesi

## Referensi

- `docs/04-offline-and-sync/offline-strategy.md`
- `docs/05-architecture/frontend-architecture.md`

## Implementation packet

### Cache dan storage yang dikunci

- Paket offline minimal memuat shell aplikasi, runtime kuis, definition, konfigurasi, dan aset kuis yang dipilih.
- Metadata cache memuat activity ID, activity version, ukuran, waktu persiapan, dan status kompatibilitas.
- Storage progres memuat identity lokal, schema version, state aktivitas, serta waktu pembaruan terakhir.
- Batas storage, strategi penghapusan, dan perilaku saat storage penuh harus mengikuti keputusan issue `000` atau dokumentasi yang diperbarui.

### Failure case yang wajib diuji

- Internet putus di tengah persiapan aset.
- Sebagian aset cache hilang atau version mismatch.
- Browser menolak IndexedDB atau storage penuh.
- Browser ditutup tanpa menutup aktivitas secara normal.
- Aplikasi baru mencoba membaca state dari schema atau activity version lama.

### Bukti selesai

- Test matrix: online → siapkan → offline → refresh → restart browser → lanjutkan.
- Bukti perangkat untuk status cache, state recovery, aset tidak lengkap, dan storage error.

### Definition of done

- Pengguna dapat membedakan aktivitas siap offline, belum siap, dan tidak kompatibel.
- Cache dapat diperbarui tanpa menghapus progres aktif secara diam-diam.

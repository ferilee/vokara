# 003 — Papan tulis matematika

**Status:** proposed  
**Prioritas:** P0  
**Owner:** Agent konten

## User story

Sebagai guru, saya dapat menulis dan menjelaskan langkah matematika pada IFP dengan jari atau stylus, lalu membuka kembali papan yang sama saat aktivitas dilanjutkan.

## Scope

- Membuat aktivitas `whiteboard` yang memakai Activity SDK dari issue `002`.
- Mendukung menggambar stroke, memilih penghapus, membersihkan seluruh papan, dan menyimpan state papan.
- Memulihkan state papan setelah refresh pada kondisi koneksi normal.
- Menyediakan instruksi singkat dan metadata tujuan pembelajaran.

## Non-goals

- Belum ada kolaborasi multi-pengguna, sinkronisasi stroke real-time, pengenalan tulisan tangan, ekspor dokumen, atau penilaian otomatis.
- Undo/redo hanya ditambahkan jika diputuskan sebagai kebutuhan pilot.

## Acceptance criteria

- [ ] Aktivitas tersedia dari katalog dengan versi, capability, dan tujuan belajar yang jelas.
- [ ] Guru dapat menggambar dengan jari dan stylus pada IFP tanpa hover.
- [ ] Penghapus dan bersihkan papan bekerja tanpa menghapus state lain secara tidak sengaja.
- [ ] Rotasi atau resize layar tidak merusak stroke yang telah dibuat.
- [ ] State yang disimpan dapat dipulihkan setelah refresh.
- [ ] Aktivitas dapat digunakan pada IFP dan mobile dengan perilaku yang terdokumentasi.
- [ ] Pengujian mencakup serialisasi state, clear board, pemulihan state, dan uji sentuh perangkat.

## Blocked by

- [ ] Issue 002 — Katalog aktivitas dan kuis tracer

## Referensi

- `docs/03-content/activity-model.md`
- `docs/05-architecture/frontend-architecture.md`

## Implementation packet

### Keputusan dan model state

- State papan terdiri dari daftar stroke berurutan; setiap stroke memiliki titik, alat, dan gaya yang diperlukan untuk dirender ulang.
- Default warna, ketebalan, batas jumlah stroke, dan kebutuhan undo/redo harus ditetapkan sebelum implementasi UI final.
- `clear board` menghapus state papan secara eksplisit dan tidak dapat dianggap sebagai submission.

### Kontrak yang terdampak

- Activity state dan serialisasi stroke.
- Capability `whiteboard`, `resumeState`, serta batas offline individual.
- Metadata aktivitas: instruksi, target perangkat, dan batas state yang dapat disimpan.

### Failure case yang wajib diuji

- Pointer dibatalkan ketika pengguna menggeser keluar layar.
- Refresh saat stroke sedang aktif.
- Resize atau perubahan orientasi setelah banyak stroke dibuat.
- Storage tidak dapat menyimpan state atau state lama tidak kompatibel dengan versi aktivitas.

### Bukti selesai dan definition of done

- Rekaman atau screenshot uji stylus dan jari pada IFP, serta bukti pemulihan state setelah refresh.
- Pengujian unit mencakup serialisasi/deserialisasi stroke dan pengujian interaksi mencakup erase serta clear.

# Catatan keputusan

**Status:** accepted  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-17

Dokumen ini menjelaskan cara mencatat keputusan yang memengaruhi produk, arsitektur, data, pengalaman pengguna, atau cara pengembangan. Keputusan besar dicatat agar alasan dan dampaknya tetap dapat dipahami ketika anggota tim, kebutuhan, atau implementasi berubah.

## Status keputusan

- `proposed`: sedang diajukan untuk ditinjau.
- `accepted`: disepakati dan menjadi acuan.
- `superseded`: digantikan oleh keputusan lain.
- `rejected`: sudah dipertimbangkan dan tidak dipilih.

## Template decision record

Salin template berikut untuk keputusan baru:

```markdown
# DR-XXX: Judul keputusan

**Status:** proposed
**Tanggal:** YYYY-MM-DD
**Pemilik:** nama atau peran

## Konteks

Masalah, kebutuhan, atau batasan yang mendorong keputusan.

## Keputusan

Keputusan yang dipilih. Tulis secara langsung dan dapat diuji.

## Alternatif yang dipertimbangkan

- Alternatif A — alasan dipilih atau tidak dipilih.
- Alternatif B — alasan dipilih atau tidak dipilih.

## Dampak

- Dampak positif.
- Biaya atau batasan.
- Dokumen, data, atau komponen yang terdampak.

## Pertanyaan terbuka

Hal yang masih perlu ditentukan, jika ada.
```

## Keputusan awal proyek

Keputusan berikut dirangkum dari `docs/konsep.md`. Keputusan ini menjadi dasar awal dan dapat dipecah menjadi decision record terpisah ketika detail implementasinya mulai dibahas.

### DR-001: Frontend menggunakan React, Vite, dan TypeScript

**Status:** accepted  
**Tanggal:** 2026-10-13

Platform menggunakan React + Vite + TypeScript sebagai frontend bersama untuk IFP dan HP. Layout dapat berbeda berdasarkan ukuran layar, tetapi tetap berasal dari satu codebase.

**Alasan:** satu codebase memudahkan penggunaan komponen bersama dan menjaga perilaku produk tetap konsisten pada perangkat guru dan siswa.

### DR-002: Backend menggunakan Bun dan Hono

**Status:** accepted  
**Tanggal:** 2026-10-13

API platform menggunakan Bun + Hono. HTTP dipakai untuk katalog, konfigurasi, dan operasi biasa. WebSocket digunakan untuk interaksi sesi yang membutuhkan pembaruan langsung.

**Alasan:** stack ini sesuai dengan rancangan runtime, API REST, dan real-time yang dibutuhkan platform.

### DR-003: MVP memakai SQLite dan Drizzle ORM

**Status:** accepted  
**Tanggal:** 2026-10-13

MVP menggunakan satu SQLite pada server aplikasi lokal dengan Drizzle ORM sebagai lapisan skema dan akses data. MariaDB belum dipelihara bersamaan pada tahap MVP.

**Alasan:** mengurangi kompleksitas sinkronisasi, konflik data, migrasi, dan pemulihan kegagalan pada fase awal.

### DR-004: Aktivitas menggunakan kontrak modular

**Status:** accepted  
**Tanggal:** 2026-10-13

Setiap aktivitas harus mengikuti kontrak Activity SDK. Platform menyediakan mekanisme katalog, konfigurasi, pemuatan, dan dukungan offline secara umum sehingga aktivitas baru tidak perlu membangun ulang bagian tersebut.

**Alasan:** aktivitas seperti kuis, papan tulis, grafik, dan game memiliki interaksi berbeda tetapi membutuhkan integrasi platform yang konsisten.

### DR-005: Offline individual menjadi prioritas pertama

**Status:** accepted  
**Tanggal:** 2026-10-13

Tahap awal offline memprioritaskan media yang sudah disiapkan agar dapat berjalan pada perangkat masing-masing, dengan penyimpanan lokal dan antrean jawaban. Server lokal untuk interaksi kelas dibangun setelah kebutuhan dan fondasinya teruji.

**Alasan:** offline kelas membutuhkan server lokal, jaringan, discovery, dan sinkronisasi yang lebih kompleks. Offline individual memberikan nilai awal dengan risiko lebih rendah.

### DR-006: Server lokal menjadi jalur offline kelas

**Status:** accepted  
**Tanggal:** 2026-10-13

Ketika internet tidak tersedia tetapi kelas tetap perlu berinteraksi, komputer guru atau mini-PC menjalankan Bun + Hono + SQLite dan melayani HP siswa melalui Wi-Fi lokal.

**Alasan:** cache browser pada setiap perangkat tidak cukup untuk mengoordinasikan aktivitas dan jawaban antarpengguna.

### DR-007: Keputusan pilot MVP

**Status:** accepted  
**Tanggal:** 2026-10-17  
**Terkait:** Issue `000 — Keputusan pilot P0`

Untuk pilot MVP, siswa menggunakan identitas sementara berbasis sesi dan tidak memerlukan akun permanen. Data siswa dibatasi pada identitas participant, nama tampilan, konteks sesi, waktu join, status, dan submission terkait. Guru tetap menggunakan konteks yang diautentikasi; provisioning akun guru dilakukan manual pada pilot.

Submission kuis bersifat final setelah diterima server. Pengiriman ulang menggunakan ID yang sama dan harus idempotent. Revisi jawaban tidak termasuk MVP.

Activity SDK MVP menggunakan mode `quiz`, `explore`, dan `whiteboard`; mode `game` ditunda. Kontrak membedakan snapshot state, progres, event bermakna, dan submission final.

Ketiga aktivitas percontohan harus siap offline individual. Server lokal pilot hanya menjamin sesi kelas untuk kuis. Server lokal melayani kelas melalui Wi-Fi lokal tanpa ketergantungan pada Service Worker; persiapan offline individual dilakukan melalui deployment cloud HTTPS.

Kode join menggunakan enam karakter alfanumerik uppercase tanpa karakter ambigu dan berlaku sampai sesi ditutup. Data pilot disimpan 90 hari setelah sesi ditutup, lalu dihapus atau dianonimkan sesuai prosedur retensi.

Item outbox yang masih pending dipertahankan sampai menerima acknowledgment final. Item permanent failure dipertahankan 30 hari setelah ditandai gagal; setelah itu hanya boleh dihapus setelah export atau keputusan operator yang tercatat.

**Alasan:** keputusan ini meminimalkan data siswa dan kompleksitas autentikasi, menjaga submission dapat disinkronkan dengan aman, serta memisahkan offline individual dari koordinasi kelas lokal.

**Dampak:** model data memerlukan `session_participants`; issue 001, 002, 005, 006, 007, 008, dan 009 mengikuti scope ini. Pertanyaan tentang self-service account, iOS, revisi submission, dan kolaborasi lokal untuk papan tulis/grafik ditunda.

## Aturan perubahan keputusan

Jika keputusan `accepted` berubah, jangan mengedit alasan lama sampai hilang. Buat catatan baru atau tandai keputusan lama sebagai `superseded`, lalu tautkan kedua keputusan tersebut.

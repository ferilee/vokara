# 000 — Keputusan pilot P0

**Status:** accepted  
**Prioritas:** P0  
**Owner:** Agent utama  
**Tipe:** decision gate

**Diputuskan:** 2026-10-17

## Tujuan

Menutup keputusan produk dan teknis minimum agar agent tidak membuat asumsi yang saling bertentangan pada model data, Activity SDK, API, dan offline.

## Keputusan yang harus dibuat

- Identitas siswa pada pilot: akun permanen atau identitas sementara per sesi.
- Data minimum siswa, nama tampilan, akses hasil, retensi, dan penghapusan data.
- Submission: final atau dapat diperbarui; aturan pengiriman ulang dan revisi.
- Kontrak minimum Activity SDK: definition, konfigurasi, state, event, progres, dan submission.
- Perangkat IFP, browser, dan HP minimum yang didukung pada pilot.
- Ruang lingkup offline pilot: aktivitas mana yang wajib siap offline individual.
- Strategi server lokal: HTTPS yang dapat digunakan atau batasan PWA yang diterima.
- Kode join: format, masa berlaku, dan aturan siswa yang salah bergabung.

## Keputusan pilot

| Area | Keputusan | Alasan dan dampak |
| --- | --- | --- |
| Identitas siswa | Siswa memakai identitas sementara berbasis sesi. Siswa tidak memerlukan akun permanen pada MVP. | Join lebih singkat dan data yang dikumpulkan lebih sedikit. Diperlukan entitas `session_participants` agar identitas siswa tetap stabil di satu sesi. |
| Identitas guru | Guru memakai akun atau konteks guru yang diautentikasi. Akun pilot diprovisikan manual; self-service registration dan pemulihan akun masuk P1. | Ownership kelas dan sesi tetap dapat diperiksa backend tanpa memperluas scope autentikasi MVP. |
| Data siswa | Wajib: `session_participant_id`, session ID, nama tampilan, waktu join, status, dan submission terkait. Nama lengkap, nomor induk, email, dan nomor telepon tidak dikumpulkan. | Mengurangi data pribadi dan cukup untuk alur kelas pilot. |
| Akses hasil | Guru pemilik sesi dapat melihat rekap sesi. Siswa hanya melihat status dan hasil responsnya sendiri. | Mencegah kebocoran hasil antarsiswa dan lintas sesi. |
| Retensi pilot | Data sesi dan submission disimpan 90 hari setelah sesi ditutup, lalu dihapus atau dianonimkan sesuai prosedur. Backup mengikuti retensi backup dan tidak dijadikan pengecualian tersembunyi. | Memberi waktu untuk evaluasi pilot tanpa menyimpan data siswa tanpa batas. |
| Retensi outbox | Item pending dipertahankan sampai acknowledgment final. Permanent failure dipertahankan 30 hari setelah ditandai gagal; penghapusan memerlukan export atau keputusan operator. | Mencegah data offline hilang diam-diam dan tetap membatasi storage lokal. |
| Submission | Submission kuis bersifat final setelah diterima server. Retry memakai ID yang sama dan bersifat idempotent; revisi jawaban tidak termasuk MVP. | Menyederhanakan rekap, outbox, dan konflik data. |
| Activity SDK | Mode MVP: `quiz`, `explore`, dan `whiteboard`. `game` ditunda. Definition memiliki metadata, versi, capability, config schema version, entry point, dan tujuan belajar. | Kontrak cukup untuk tiga aktivitas percontohan tanpa membuka scope game. |
| State, event, progres | State adalah snapshot yang dapat dipulihkan; progres adalah ringkasan untuk melanjutkan; event hanya kejadian bermakna; submission adalah hasil final yang dikirim dan dinilai. Pointer atau animasi tidak dikirim sebagai event. | Membatasi ukuran data dan menjaga perbedaan antara pemulihan, histori, dan hasil belajar. |
| Offline individual | Ketiga aktivitas percontohan wajib siap offline individual setelah dipersiapkan. | Sesuai kriteria MVP dan memberi nilai offline langsung pada guru serta siswa. |
| Offline kelas | Pilot server lokal hanya menjamin sesi kuis. Papan tulis dan grafik tetap offline individual sampai kebutuhan kolaborasinya terbukti. | Mengurangi risiko real-time lokal dan menjaga scope kelas offline dapat diuji. |
| Server lokal dan HTTPS | Server lokal melayani kelas melalui Wi-Fi lokal. MVP tidak menjanjikan Service Worker atau PWA penuh pada alamat HTTP lokal; offline individual dipersiapkan melalui deployment HTTPS sebelum kelas. | Menghindari ketergantungan pada sertifikat lokal yang belum teruji pada IFP/HP. |
| Kode join | Kode terdiri dari 6 karakter alfanumerik uppercase tanpa karakter ambigu (`0/O`, `1/I`). Berlaku sampai sesi ditutup, dapat dicabut atau dibuat ulang guru, dan QR memuat alamat deployment serta kode. | Mudah dibaca dan tidak memberi akses di luar satu sesi. |
| Join ulang | Satu perangkat dapat melanjutkan participant identity yang sama bila token lokal masih tersedia. Join ulang dengan identitas baru membutuhkan konfirmasi guru atau membuat participant baru. | Mencegah submission tertukar setelah refresh atau reconnect. |
| Perangkat pilot | Dukungan ditetapkan berdasarkan IFP Merah Putih aktual yang diuji dan HP Android dengan browser Chromium yang mendukung IndexedDB, touch input, dan secure context cloud. iOS tidak menjadi target pilot pertama. | Menghindari janji dukungan generik sebelum inventaris perangkat tersedia. Issue `001` mencatat model dan versi aktual. |

## Scope pilot satu halaman

Pilot membuktikan guru dapat menjalankan kuis, papan tulis, dan eksplorasi grafik pada IFP atau HP, menggunakan ketiganya secara offline individual setelah persiapan HTTPS cloud, serta menjalankan sesi kuis bersama melalui server lokal dan Wi-Fi tanpa internet. Guru memiliki konteks terautentikasi, siswa join sebagai participant sementara, dan submission kuis bersifat final serta idempotent.

Pilot tidak mencakup akun permanen siswa, self-service account guru, iOS, revisi submission, kolaborasi lokal papan tulis atau grafik, PWA penuh pada HTTP lokal, mode `game`, editor konten visual, atau sinkronisasi konflik edit paralel.

## Acceptance criteria

- [x] Setiap keputusan di atas memiliki pilihan yang dipilih, alasan, dan dampaknya.
- [x] Keputusan dicatat pada decision record dan dokumen domain yang terdampak diperbarui.
- [x] Tidak ada pertanyaan P0 yang masih menjadi blocker untuk issue `001`, `002`, atau `005`.
- [x] Scope pilot dan non-goalsnya dapat dijelaskan dalam satu halaman.

## Blocked by

None - can start immediately.

## Referensi

- `docs/06-planning/open-questions.md`
- `docs/02-access/roles-and-permissions.md`
- `docs/03-content/activity-model.md`
- `docs/04-offline-and-sync/local-server.md`
- `docs/00-governance/decision-records.md#dr-007-keputusan-pilot-mvp`

## Implementation packet

### Output yang wajib dihasilkan

| Keputusan | Pilihan yang dipertimbangkan | Pilihan final | Alasan | Owner | Decision record |
| --- | --- | --- | --- | --- | --- |
| Identitas siswa | Akun permanen / identitas sesi | Identitas sesi | Join cepat dan minim data; perlu `session_participants` | Agent utama | DR-007 |
| Submission | Final / dapat direvisi | Final | Rekap dan sinkronisasi lebih sederhana | Agent utama | DR-007 |
| Offline pilot | Kuis saja / seluruh aktivitas percontohan | Seluruh tiga aktivitas individual; kuis untuk kelas lokal | Memenuhi MVP tanpa memaksa kolaborasi lokal untuk semua aktivitas | Agent utama | DR-007 |
| HTTPS lokal | HTTPS lokal / tanpa Service Worker | HTTP lokal untuk kelas, HTTPS cloud untuk persiapan offline | Server lokal tidak bergantung pada Service Worker | Agent utama | DR-007 |
| Retensi outbox | Sampai ack / batas waktu tetap | Sampai ack; permanent failure 30 hari setelah ditandai gagal | Data belum terkirim tidak hilang tanpa tindakan eksplisit | Agent utama | DR-007 |

### Failure case

- Jika satu keputusan P0 belum selesai pada saat issue dependen akan dimulai, issue dependen tetap berstatus blocked.
- Jika keputusan mengubah scope MVP, roadmap dan issue yang terdampak harus diperbarui sebelum implementasi dimulai.

### Bukti selesai dan definition of done

- [x] Tabel keputusan lengkap, decision record tertaut, dan semua pertanyaan P0 ditandai selesai atau dinaikkan menjadi risiko pilot.
- [x] Agent utama meninjau dampak ke akses, data, API, SDK, offline, dan deployment.
- [x] Tidak ada perubahan kode aplikasi yang diperlukan untuk menyelesaikan decision gate.

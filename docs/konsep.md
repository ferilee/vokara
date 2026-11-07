Mas Ferilee, saya akan merancang platform ini sebagai laboratorium media pembelajaran matematika SMK yang touch-first, modular, dan offline-first. Jadi, bukan sekadar website berisi kumpulan game, tetapi satu platform yang dapat digunakan guru di IFP Merah Putih untuk mengajar, sementara siswa bergabung melalui HP masing-masing.

Saya akan menggunakan Bun + Hono sebagai fondasi backend, React + Vite untuk antarmuka, dan merancang mode offline sejak awal. Prinsipnya: internet boleh mati, tetapi pembelajaran jangan ikut mati. 😄

# 1. Konsep produk dan arsitektur utama

Nama kerja sementara: MathLab SMK. Nama ini masih bisa kita ganti setelah fondasi teknisnya matang.

Guru — IFP Merah Putih

Mode mengajar · papan tulis · manipulatif · game · presentasi

Wi-Fi lokal sekolah atau internet

Siswa — HP

Gabung sesi · kerjakan aktivitas · kirim jawaban · lihat umpan balik

### Frontend bersama

React + Vite

TypeScript

PWA + IndexedDB

Cache dan data lokal

Satu codebase untuk IFP dan HP, dengan layout berbeda berdasarkan ukuran layar.

### Backend — Bun + Hono

REST API

Materi, kelas, aktivitas

WebSocket

Sinkronisasi sesi daring

SQLite

Database lokal di server sekolah atau komputer guru.

MariaDB

Database pusat untuk akun dan sinkronisasi daring.

Ada keputusan arsitektur yang sangat penting di sini: mode offline di HP siswa membutuhkan jalur komunikasi lokal jika internet sekolah mati. Cache di browser saja tidak cukup untuk membuat HP siswa menerima aktivitas baru dari IFP secara otomatis.

Karena itu, saya merekomendasikan dua mode offline:

- Offline individual: media tetap berjalan di IFP atau HP masing-masing, termasuk materi dan aktivitas yang sudah tersimpan.
- Offline kelas: komputer guru atau mini-server lokal menjalankan aplikasi dan menyediakan Wi-Fi lokal. HP siswa terhubung ke jaringan tersebut meskipun tidak ada internet.

Dengan desain ini, mode offline kelas tidak bergantung pada koneksi cloud.

# 2. Struktur proyek yang saya sarankan

Saya memilih monorepo dengan Bun Workspaces. Artinya, frontend, backend, dan paket media berbagi satu repositori sehingga lebih mudah dikembangkan dan diuji.

```
mathlab-smk/
├── apps/
│   ├── web/                    # React + Vite + TypeScript
│   │   ├── public/
│   │   │   ├── icons/
│   │   │   └── manifest.webmanifest
│   │   └── src/
│   │       ├── app/
│   │       ├── components/
│   │       ├── layouts/
│   │       │   ├── ifp/
│   │       │   └── mobile/
│   │       ├── features/
│   │       │   ├── dashboard/
│   │       │   ├── classroom/
│   │       │   ├── library/
│   │       │   └── activities/
│   │       ├── offline/
│   │       └── routes/
│   │
│   └── api/                    # Bun + Hono
│       └── src/
│           ├── routes/
│           ├── middleware/
│           ├── services/
│           ├── repositories/
│           ├── realtime/
│           └── index.ts
│
├── packages/
│   ├── activity-sdk/           # Kontrak dan tipe aktivitas
│   ├── math-core/              # Fungsi matematika
│   ├── ui/                     # Komponen UI bersama
│   ├── validators/             # Validasi data
│   └── database/               # Skema dan migrasi Drizzle
│
├── content/
│   ├── aljabar/
│   ├── geometri/
│   ├── barisan-deret/
│   ├── statistika/
│   └── numerasi-smk/
│
├── tests/
├── scripts/
├── docker-compose.yml
├── package.json
├── bun.lock
└── README.md
```

Folder `content/` berisi definisi dan aset aktivitas, bukan kode backend yang harus ditulis ulang setiap kali ada media baru.

## Arsitektur modular media

Saya ingin setiap media memiliki kontrak yang konsisten. Misalnya, aktivitas pecahan dan permainan kuis dapat menggunakan kerangka yang sama tanpa harus memiliki implementasi antarmuka yang identik.

```
export type ActivityDefinition = {
  id: string;
  title: string;
  subject: string;
  mode: "explore" | "game" | "whiteboard";
  version: number;
  entry: string;
  offlineReady: boolean;
};
```

Ini adalah contoh tipe awal, bukan keseluruhan SDK. Nantinya, setiap jenis aktivitas mempunyai komponen khusus dan menerima konfigurasi yang tervalidasi.

| Modul         | Teknologi utama               | Fungsi                                |
| ------------- | ----------------------------- | ------------------------------------- |
| Papan tulis   | SVG / Canvas                  | Menulis, menggambar, anotasi          |
| Grafik fungsi | SVG + math-core               | Mengubah parameter dan melihat grafik |
| Geometri      | SVG                           | Menggeser titik dan mengubah bentuk   |
| Game          | React; Phaser bila dibutuhkan | Tantangan dan simulasi 2D             |
| Kuis          | React                         | Soal, umpan balik, skor               |
| Sesi kelas    | Hono + WebSocket              | Pertukaran jawaban secara langsung    |

Kuncinya: media baru cukup mengikuti kontrak aktivitas. Kita tidak perlu membangun ulang dashboard, sistem kelas, dan mekanisme offline untuk setiap media.

# 3. Pilihan database: mulai sederhana

Saya merekomendasikan SQLite untuk MVP, dengan Drizzle ORM sebagai lapisan skema dan akses data. Bun menyediakan driver SQLite bawaan melalui `bun:sqlite`, termasuk transaksi dan prepared statements.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://bun.com\&sz=32)

Bun Docs

+1



Jangan langsung memelihara SQLite dan MariaDB secara bersamaan. Dua database berarti kita harus memikirkan sinkronisasi, konflik data, migrasi, dan pemulihan kegagalan sejak hari pertama.

Tahap MVP — SQLite

Rekomendasi awal

Satu berkas database pada server aplikasi lokal. Cocok untuk prototipe, perpustakaan media, sesi kelas sederhana, dan penyimpanan jawaban dengan beban yang masih terkendali.

Tahap pengembangan — MariaDB

Pertimbangkan jika platform tumbuh menjadi layanan pusat dengan banyak sekolah, pengguna, dan penulis data bersamaan. Migrasi perlu direncanakan dan diuji, bukan sekadar mengganti URL database.

### Tabel inti database

| Tabel               | Kegunaan                                  |
| ------------------- | ----------------------------------------- |
| `users`             | Akun guru dan siswa                       |
| `classes`           | Kelas yang dikelola guru                  |
| `class_members`     | Anggota kelas                             |
| `activities`        | Metadata media pembelajaran               |
| `activity_versions` | Versi media dan konfigurasi               |
| `sessions`          | Sesi pembelajaran yang sedang berlangsung |
| `session_events`    | Peristiwa dan interaksi sesi              |
| `submissions`       | Jawaban siswa                             |
| `sync_outbox`       | Data lokal yang menunggu sinkronisasi     |
| `content_assets`    | Metadata aset media                       |

Untuk materi matematika, definisi aktivitas dan aset statis dapat disimpan sebagai JSON tervalidasi serta berkas terpisah. Tidak perlu memasukkan seluruh gambar, animasi, dan kode game ke database.

Satu catatan: SQLite di server lokal berbeda dari IndexedDB di browser. SQLite menyimpan data bersama di server, sedangkan IndexedDB menyimpan data pada perangkat masing-masing. Keduanya memiliki tugas berbeda.

# 4. Strategi offline yang benar-benar berfungsi

Untuk kebutuhan Mas Ferilee, saya akan memakai tiga mekanisme berbeda.

A. PWA + Service Worker

Menyimpan shell aplikasi, JavaScript, CSS, ikon, dan aset terpilih agar media yang sudah diunduh tetap bisa dibuka ketika internet terputus.

Service Worker memerlukan secure context, umumnya HTTPS.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://developer.mozilla.org\&sz=32)

MDN

+1



B. IndexedDB

Menyimpan progres lokal, jawaban yang belum terkirim, konfigurasi aktivitas, dan antrean sinkronisasi pada setiap perangkat.

C. Server lokal Bun + Hono

Menjalankan API, menyimpan sesi kelas, dan melayani HP siswa melalui jaringan Wi-Fi lokal. Internet tidak diperlukan selama server dan jaringan lokal tetap aktif.

### Skenario penggunaannya

| Situasi                                     | Cara kerja                                                 |
| ------------------------------------------- | ---------------------------------------------------------- |
| Internet normal                             | IFP dan HP mengakses server daring                         |
| Internet putus, server lokal tersedia       | Guru dan siswa tetap berinteraksi lewat Wi-Fi lokal        |
| Internet putus, server lokal tidak tersedia | Media yang sudah tersimpan berjalan mandiri pada perangkat |
| Internet kembali                            | Data antrean disinkronkan ke server pusat                  |

Ada detail implementasi yang perlu diperhatikan: jika aplikasi diakses lewat alamat IP lokal menggunakan HTTP, fitur Service Worker umumnya tidak dapat digunakan karena batasan secure context. Jadi, deployment perlu menyiapkan HTTPS untuk PWA, atau memakai server lokal untuk menyajikan media yang dapat berjalan tanpa Service Worker.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://developer.mozilla.org\&sz=32)

MDN



Untuk MVP, saya akan mengutamakan mode offline individual terlebih dahulu, lalu menambahkan server lokal untuk kelas. Kita bisa menguji kebutuhan sebenarnya sebelum membangun mekanisme sinkronisasi yang lebih rumit.

### Bagaimana sinkronisasi bekerja?

Setiap jawaban siswa diberi ID unik dan waktu pencatatan. Jika jaringan terputus, jawaban masuk ke `sync_outbox` pada IndexedDB. Ketika koneksi kembali, klien mengirim antrean tersebut ke API.

Backend harus menerima pengiriman berulang secara aman (idempotent), agar satu jawaban tidak tercatat dua kali. Untuk data hasil belajar, kita juga perlu menyimpan waktu pengiriman dan waktu pencatatan asli, bukan hanya waktu server menerima data.

# 5. API yang perlu disiapkan

Dengan Hono, API dapat dibagi berdasarkan domain agar tidak menjadi satu berkas besar.

| Endpoint                             | Fungsi                          |
| ------------------------------------ | ------------------------------- |
| `GET /api/activities`                | Mengambil katalog media         |
| `GET /api/activities/:id`            | Mengambil konfigurasi aktivitas |
| `GET /api/classes/:id`               | Mengambil informasi kelas       |
| `POST /api/sessions`                 | Membuat sesi pembelajaran       |
| `POST /api/sessions/:id/join`        | Siswa bergabung                 |
| `POST /api/sessions/:id/submissions` | Mengirim jawaban                |
| `GET /api/sessions/:id/results`      | Mengambil rekap jawaban         |
| `POST /api/sync`                     | Mengirim antrean offline        |

Untuk interaksi real-time, misalnya guru menampilkan pertanyaan dan jawaban siswa muncul langsung di layar IFP, kita dapat menggunakan WebSocket. Hono memiliki adapter WebSocket untuk Bun.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://hono.dev\&sz=32)

Hono



Namun, jangan memakai WebSocket untuk semua hal. Mengambil daftar media cukup menggunakan HTTP; WebSocket dipakai saat interaksi langsung memang diperlukan.

## 6. Strategi deployment

Saya menyarankan arsitektur yang mendukung dua cara penggunaan tanpa memisahkan kode aplikasi.

### Deployment A — Cloud

Frontend dan backend ditempatkan pada server yang mendukung Bun. Gunakan domain HTTPS, backup database, dan penyimpanan aset yang sesuai.

Cocok untuk akses dari luar sekolah, pembaruan materi, dan pengelolaan banyak kelas.

### Deployment B — Server lokal sekolah

Bun + Hono + SQLite dijalankan di komputer guru atau mini-PC yang terhubung ke router Wi-Fi lokal.

Cocok untuk kelas yang perlu berjalan meskipun koneksi internet mati.

Keduanya bisa memakai paket aplikasi yang sama. Yang berbeda adalah konfigurasi deployment, alamat server, dan strategi sinkronisasi.

Sebelum memilih hosting, pastikan penyedia benar-benar mendukung proses server Bun yang berjalan terus-menerus. Hosting statis saja cukup untuk frontend, tetapi tidak dapat menggantikan server Hono untuk API dan WebSocket.

Untuk sinkronisasi antara server lokal dan cloud, buat lapisan `repositories/` dan layanan sinkronisasi tersendiri. Jangan menganggap dua database otomatis tersinkron hanya karena skemanya sama.

# 7. Urutan implementasi MVP

Saya menyarankan pengembangan bertahap dengan target yang bisa diuji langsung di IFP, bukan menunggu semua fitur selesai.

# 01

Fondasi dan pengujian perangkat

Prioritas tertinggi

Siapkan monorepo, React + Vite, Bun + Hono, desain responsif, serta uji browser dan layar sentuh pada IFP yang sebenarnya.

Hasil: aplikasi dasar dapat dibuka dan dioperasikan dengan jari maupun stylus.

# 02

Activity SDK dan katalog media

Bangun kontrak aktivitas, katalog, halaman detail, mekanisme konfigurasi, dan pemuatan media secara modular.

Hasil: media baru bisa ditambahkan tanpa mengubah dashboard utama.

# 03

Tiga media percontohan

Buat papan tulis matematika, eksplorasi grafik fungsi, dan kuis interaktif. Ketiganya mewakili tiga pola interaksi berbeda.

Hasil: platform memiliki nilai pembelajaran nyata, bukan hanya kerangka kosong.

# 04

PWA dan penyimpanan lokal

Tambahkan cache aset, IndexedDB, indikator status koneksi, serta penyimpanan jawaban saat offline.

Hasil: aktivitas yang telah disiapkan dapat digunakan tanpa internet.

# 05

Kelas interaktif

Bangun kode kelas, QR untuk bergabung, pengiriman jawaban siswa, rekap hasil, dan WebSocket.

Hasil: guru menjalankan aktivitas di IFP dan siswa merespons lewat HP.

# 06

Server lokal dan sinkronisasi

Uji penggunaan lewat Wi-Fi lokal tanpa internet, kemudian implementasikan sinkronisasi jawaban dan materi ketika koneksi pulih.

Hasil: skenario kelas offline teruji dan data tidak mudah hilang.

## 8. Kriteria MVP dianggap berhasil

Sebelum memperluas katalog media, saya akan menetapkan kriteria penerimaan berikut.

- Antarmuka nyaman digunakan di IFP dan HP.
- Tidak ada ketergantungan pada hover; semua fungsi penting bisa diakses dengan sentuhan.
- Tiga media percontohan berjalan tanpa koneksi internet setelah disiapkan.
- Siswa dapat bergabung melalui kode kelas atau QR ketika jaringan lokal tersedia.
- Jawaban tetap tersimpan ketika koneksi terputus dan tidak terduplikasi setelah sinkronisasi.
- Guru dapat mengakses rekap jawaban.
- Aplikasi pulih dengan baik setelah browser ditutup atau perangkat dimulai ulang.
- Data dan konfigurasi dapat dicadangkan serta dipulihkan.

Pengujian wajib dilakukan pada perangkat IFP Merah Putih yang akan digunakan. Dukungan browser, versi sistem operasi, resolusi, kemampuan sentuh multi-jari, dan penyimpanan lokal dapat berbeda antarperangkat.

## 9. Rekomendasi stack final

| Bagian                 | Pilihan                                                         |
| ---------------------- | --------------------------------------------------------------- |
| Frontend               | React + Vite + TypeScript                                       |
| UI                     | Tailwind CSS                                                    |
| Visualisasi matematika | SVG + Canvas; GeoGebra atau pustaka matematika sesuai kebutuhan |
| Game                   | React untuk game sederhana; Phaser untuk game 2D kompleks       |
| Backend                | Bun + Hono                                                      |
| Database MVP           | SQLite + Drizzle ORM                                            |
| Penyimpanan browser    | IndexedDB + Cache API                                           |
| Offline                | PWA + Service Worker, ditambah server lokal untuk kelas         |
| Real-time              | WebSocket melalui Hono                                          |
| Deployment             | Cloud HTTPS dan server lokal                                    |
| Pengujian              | Unit test, integrasi API, serta uji perangkat IFP dan HP        |

Keputusan terpenting saya: bangun dahulu satu aplikasi modular yang benar-benar nyaman dipakai di IFP, kemudian tambahkan layanan kelas dan sinkronisasi. Jangan membangun sistem cloud yang rumit sebelum kebutuhan kelas offline terbukti.

Jika berhasil, platform ini dapat berkembang menjadi ekosistem media pembelajaran matematika SMK yang dapat digunakan guru lain, dibagikan antarsekolah, dan dikembangkan bersama komunitas MGMP.

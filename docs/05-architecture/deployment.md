# Deployment

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-17

## Tujuan

Deployment harus menyediakan paket aplikasi yang dapat digunakan dalam dua konteks utama: cloud melalui internet dan server lokal melalui Wi-Fi sekolah. Perbedaan konfigurasi tidak boleh menghasilkan dua codebase yang tidak dapat dipelihara bersama.

## Target deployment

### Cloud

Cocok untuk akses dari luar sekolah, pembaruan konten, banyak kelas, dan penyimpanan pusat.

Kebutuhan awal:

- domain dan HTTPS;
- proses backend Bun yang berjalan terus-menerus;
- SQLite atau database pusat sesuai tahap produk;
- penyimpanan aset;
- backup;
- logging dan monitoring;
- konfigurasi secrets.

### Server lokal sekolah

Cocok untuk kelas yang tetap berjalan ketika internet mati.

Kebutuhan awal:

- komputer guru atau mini-PC;
- Bun + Hono + SQLite;
- router atau access point;
- alamat server yang dapat ditemukan IFP dan HP;
- paket aktivitas dan aset lokal;
- backup pada media yang sesuai;
- prosedur restart dan pemulihan.

## Artefak deployment

Paket deployment perlu menjelaskan atau menyediakan:

- frontend hasil build;
- backend dan konfigurasi runtime;
- Dockerfile API dan web;
- Compose deployment dengan external network `ferileenet`;
- migration database;
- paket aktivitas dan aset yang dipilih;
- konfigurasi environment;
- prosedur start, stop, update, dan rollback;
- health check;
- backup dan restore.

## Environment

Environment minimal yang perlu dibedakan:

- **Development:** pengembangan dan eksplorasi lokal.
- **Staging atau pilot:** validasi bersama perangkat dan pengguna terbatas.
- **Production cloud:** penggunaan pusat yang sebenarnya.
- **Production lokal:** penggunaan di sekolah atau kelas.

Data dan secrets antar-environment harus dipisahkan. Data produksi tidak digunakan dalam development tanpa perlindungan dan alasan yang jelas.

## Konfigurasi

Konfigurasi deployment dapat mencakup:

- mode cloud atau lokal;
- alamat publik atau lokal;
- port dan origin yang diizinkan;
- lokasi database;
- lokasi aset;
- feature flags;
- batas ukuran upload;
- interval retry atau sinkronisasi;
- pengaturan logging;
- secrets dan credential.

Konfigurasi sensitif tidak ditulis ke dokumentasi publik atau bundle frontend.

### Baseline issue 001

Fondasi lokal menggunakan contoh konfigurasi berikut:

- API: `apps/api/.env.example`;
- web: `apps/web/.env.example`;
- database default API: `apps/api/data/vokara.sqlite`;
- endpoint health check: `/health`.

Untuk development, jalankan dari root repository:

```bash
bun install
bun run dev:api
bun run dev:web
```

Pada staging atau pilot, `VITE_API_URL` harus menunjuk ke API melalui HTTPS dan `CORS_ORIGIN` harus berisi origin web yang digunakan. Nilai contoh localhost tidak boleh dipakai sebagai konfigurasi pilot.

Runbook rilis dan bukti yang diperlukan tersedia di `docs/06-planning/pilot-deployment-runbook.md`.

### Penempatan pada VPS pilot

VPS yang digunakan saat ini memiliki pola `/srv/apps`, `/srv/platform`, dan `/srv/data`, dengan Nginx Proxy Manager sebagai reverse proxy terpusat. Vokara mengikuti pola tersebut:

- `/srv/platform/vokara` untuk Compose dan konfigurasi runtime;
- `/srv/data/vokara` untuk SQLite serta backup;
- `/srv/platform/nginx-proxy-manager` untuk hostname dan sertifikat HTTPS, melalui external Docker network `ferileenet`.

API dan web tidak perlu membuka port publik langsung. Hostname publik diarahkan melalui Nginx Proxy Manager. Image API dan web dibangun oleh GitHub Actions lalu dipublikasikan ke GHCR; Arcane melakukan pull dan redeploy Compose. Compose Vokara bergabung ke external network `ferileenet`; target proxy yang disiapkan adalah `vokara-web:80` untuk web dan `vokara-api:3000` untuk API. Port `80`, `81`, dan `443` tetap menjadi milik Nginx Proxy Manager.

## Rilis aplikasi

Setiap rilis perlu memiliki:

- versi aplikasi;
- versi schema database;
- versi Activity SDK yang kompatibel;
- daftar perubahan;
- perubahan migrasi;
- kebutuhan upgrade aset;
- instruksi rollback jika tersedia;
- hasil validasi pada perangkat target.

Rilis server lokal perlu memperhitungkan bahwa operator mungkin tidak memiliki akses internet saat update dilakukan.

## Prosedur cloud

Alur konseptual:

1. Siapkan artefak dan konfigurasi environment.
2. Jalankan pemeriksaan migration pada salinan atau staging.
3. Buat backup sebelum perubahan database.
4. Deploy backend dan frontend sesuai urutan yang kompatibel.
5. Jalankan health check.
6. Periksa alur katalog, sesi, submission, dan WebSocket.
7. Pantau error dan rollback jika kriteria gagal terpenuhi.

## Prosedur server lokal

Alur konseptual:

1. Siapkan atau perbarui perangkat server.
2. Pastikan backup terakhir tersedia.
3. Pasang paket aplikasi dan aset.
4. Jalankan migration dengan prosedur yang aman.
5. Periksa jaringan lokal dan alamat akses.
6. Uji dari IFP dan satu atau lebih HP.
7. Buka sesi pilot sebelum digunakan untuk kelas penuh.
8. Catat versi yang digunakan dan hasil pemeriksaan.

## Backup dan restore

Backup harus dapat memulihkan setidaknya:

- database;
- konfigurasi deployment yang tidak rahasia;
- versi aplikasi yang diperlukan;
- metadata dan aset lokal yang tidak dapat diunduh ulang.

Restore perlu diuji secara berkala. Backup yang belum pernah diuji tidak boleh dianggap sebagai rencana pemulihan yang terbukti.

## Monitoring dan health check

Minimum monitoring perlu menjawab:

- apakah backend hidup;
- apakah database dapat diakses;
- apakah storage cukup;
- apakah asset package tersedia;
- apakah koneksi WebSocket dapat dibuat jika dibutuhkan;
- apakah outbox atau sinkronisasi menumpuk;
- apakah error meningkat setelah rilis.

Server lokal membutuhkan cara pemeriksaan yang sederhana dan dapat dilakukan operator tanpa tooling khusus.

## Risiko deployment

| Risiko | Tindakan awal |
| --- | --- |
| Hosting hanya mendukung frontend statis | Pastikan backend Bun dapat berjalan terus-menerus sebelum memilih hosting. |
| HTTP lokal membatasi Service Worker | Uji HTTPS lokal atau strategi offline yang sesuai perangkat. |
| Update memutus sesi aktif | Rencanakan rilis di luar waktu kelas dan cek kompatibilitas versi. |
| Database lokal rusak | Sediakan backup, shutdown aman, dan prosedur restore. |
| Aset terlalu besar | Sediakan paket konten yang dipilih dan pantau storage. |
| Perangkat lokal diganti | Simpan backup dan instruksi pemasangan pada lokasi yang aman. |

## Kriteria penerimaan deployment

- Aplikasi dapat dijalankan di environment cloud yang mendukung backend Bun.
- Aplikasi dapat dijalankan pada server lokal dengan SQLite.
- IFP dan HP dapat mengakses deployment yang sesuai.
- Migration dan backup dapat dijalankan serta dipulihkan.
- Versi aktivitas dan aplikasi dapat ditelusuri.
- Deployment gagal dengan aman ketika konfigurasi wajib tidak tersedia.
- Prosedur operator dapat diikuti tanpa pengetahuan internal kode aplikasi.

## Pertanyaan terbuka

- Penyedia cloud dan model hosting yang dipilih.
- Format paket instalasi server lokal.
- Mekanisme update tanpa internet pada server lokal.
- Strategi HTTPS dan sertifikat lokal.
- Target kapasitas dan batas hardware minimum.
- Siapa yang memiliki tanggung jawab operasional pada tiap deployment.

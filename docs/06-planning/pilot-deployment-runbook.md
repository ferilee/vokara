# Runbook deployment pilot

**Status:** proposed  
**Pemilik:** Agent utama  
**Terkait:** issue 001

## Penyesuaian dengan VPS saat ini

Struktur VPS menggunakan pemisahan berikut:

| Kebutuhan | Lokasi VPS yang disarankan |
| --- | --- |
| Compose dan konfigurasi orkestrasi | `/srv/platform/vokara` |
| Database SQLite dan backup | `/srv/data/vokara` |
| HTTPS dan reverse proxy | Nginx Proxy Manager di `/srv/platform/nginx-proxy-manager`, network `ferileenet` |
| Script operasional | `/srv/scripts/deploy`, `/srv/scripts/backup`, `/srv/scripts/maintenance` |

Pemisahan ini mengikuti pola aplikasi lain pada VPS. Source tidak menyimpan database pilot. Database harus berada pada `/srv/data/vokara` agar update source atau container tidak menghapus data.

### Struktur target

```text
/srv/
├── platform/
│   ├── nginx-proxy-manager/
│   └── vokara/
│       └── compose.yaml
├── data/
│   └── vokara/
│       ├── sqlite/
│       └── backups/
└── scripts/
    ├── backup/
    ├── deploy/
    └── maintenance/
```

Konfigurasi VPS mengonfirmasi bahwa Nginx Proxy Manager memakai external network `ferileenet` dan `mywebsite_ferileenet`. Vokara menggunakan `ferileenet` karena itu network utama yang tersedia untuk reverse proxy. Vokara tidak perlu bergabung ke `mywebsite_ferileenet`.

Artefak Compose dan instruksi pengoperasian tersedia di `deploy/compose.yaml` dan `deploy/README.md`. Pada VPS, hanya Compose dan environment deployment yang ditempatkan di `/srv/platform/vokara`; source repository dibangun oleh GitHub Actions dan tidak diperlukan di VPS.

Dockerfile yang dipakai GitHub Actions untuk membangun image berada di `apps/api/Dockerfile` dan `apps/web/Dockerfile`. Konfigurasi static server web berada di `apps/web/nginx.conf`.

## Tujuan

Menjalankan baseline Vokara pada VPS pilot berbasis HTTPS dan menghasilkan bukti yang diperlukan sebelum pengujian perangkat.

## Prasyarat

- VPS yang menjalankan Docker Compose dan dapat pull image dari GHCR;
- workflow GitHub Actions yang berhasil mempublikasikan image API dan web;
- repository GitHub `ferilee/vokara`;
- domain atau subdomain untuk web dan API;
- sertifikat HTTPS aktif pada web dan API;
- database pilot yang terpisah dari development;
- backup sebelum migration atau rilis;
- akses operator untuk membaca log dan memeriksa status proses.

## Konfigurasi

API di dalam container:

```dotenv
NODE_ENV=production
PORT=3000
DATABASE_URL=/data/vokara.sqlite
CORS_ORIGIN=https://app.example.com
```

URL API untuk image web:

```dotenv
VITE_API_URL=https://api.example.com
```

`CORS_ORIGIN` harus sama dengan origin web pilot. `VITE_API_URL` ditetapkan sebagai GitHub repository variable sebelum workflow build berjalan. Kedua nilai contoh localhost tidak boleh dipakai sebagai konfigurasi pilot.

Volume `/srv/data/vokara/sqlite` dipasang ke `/data` pada container API. Backup host disimpan di `/srv/data/vokara/backups` dan tidak berada di dalam image.

## Pembagian container

Deployment Compose Vokara memerlukan dua service:

- `api`: menjalankan `bun src/index.ts`, memakai volume SQLite `/data`, dan mendengarkan pada port container `3000`;
- `web`: menyajikan hasil `apps/web/dist` pada port container `80`.

Compose Vokara harus memakai network eksternal berikut:

```yaml
networks:
  ferileenet:
    external: true
    name: ferileenet
```

Gunakan nama container yang stabil agar mudah dipilih dari Nginx Proxy Manager:

| Proxy host | Forward hostname | Forward port |
| --- | --- | ---: |
| `app.example.com` | `vokara-web` | `80` |
| `api.example.com` | `vokara-api` | `3000` |

Kedua container harus terhubung ke `ferileenet`. Jangan mempublikasikan port `80` atau `443` dari Compose Vokara karena port tersebut sudah dipakai Nginx Proxy Manager. Port API juga tidak perlu dipublikasikan ke host.

Jangan membuat container baru untuk TLS. Sertifikat HTTPS dikelola melalui Nginx Proxy Manager yang sudah tersedia di `/srv/platform/nginx-proxy-manager`.

## Urutan rilis

1. Push source ke branch deployment.
2. Tunggu GitHub Actions mempublikasikan image API dan web ke GHCR.
3. Pastikan tag image yang akan dipakai sudah tersedia.
4. Pastikan volume `/srv/data/vokara/sqlite` dan `/srv/data/vokara/backups` tersedia.
5. Buat backup database sebelum membuka akses pengguna.
6. Jalankan Pull atau Redeploy stack Vokara melalui Arcane.
7. Buat atau perbarui proxy host web dan API pada Nginx Proxy Manager dengan target `vokara-web:80` dan `vokara-api:3000`.
8. Aktifkan sertifikat HTTPS pada kedua hostname.
9. Buka `https://api.example.com/health`.
10. Pastikan respons memiliki `status: "ok"` dan `database: "ok"`.
11. Buka web dari IFP dan HP uji.
12. Catat versi, URL, waktu rilis, hasil health check, dan temuan.

## Kriteria lulus issue 001

- web dapat dibuka melalui HTTPS;
- request web ke API tidak ditolak CORS;
- health check API mengembalikan status sehat;
- refresh halaman tidak menghasilkan error yang membocorkan detail internal;
- backup pilot tersimpan sebelum uji perangkat;
- URL dan versi yang diuji dicatat pada lembar baseline perangkat.

## Rollback

1. Kembalikan image atau artefak pada Compose ke versi sebelumnya.
2. Jalankan ulang service Vokara.
3. Pulihkan database dari `/srv/data/vokara/backups` hanya jika migration atau perubahan data mengharuskannya.
4. Periksa proxy host dan sertifikat pada Nginx Proxy Manager.
5. Jalankan health check kembali.
6. Catat penyebab, dampak, dan keputusan pemulihan.

## Bukti yang harus dilampirkan

- URL web dan API pilot;
- output health check;
- versi aplikasi dan schema;
- waktu backup;
- hasil akses IFP dan HP;
- screenshot atau log error jika ada.

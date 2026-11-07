# Deployment Vokara di VPS melalui GHCR dan Arcane

Alur deployment Vokara:

```text
git push
  → GitHub Actions build dan push image
  → GHCR
  → Arcane pull dan redeploy Compose
```

VPS tidak perlu memiliki source repository Vokara. VPS hanya menyimpan Compose, environment deployment, database, dan backup.

## Lokasi VPS

- Compose: `/srv/platform/vokara/compose.yaml`;
- environment: `/srv/platform/vokara/.env`;
- SQLite: `/srv/data/vokara/sqlite`;
- backup: `/srv/data/vokara/backups`;
- HTTPS: Nginx Proxy Manager pada network `ferileenet`.

## Instalasi pertama

Salin `deploy/compose.yaml` dan `deploy/.env.example` dari repository ke VPS, lalu simpan sebagai:

```text
/srv/platform/vokara/compose.yaml
/srv/platform/vokara/.env
```

Buat direktori data:

```bash
mkdir -p /srv/platform/vokara
mkdir -p /srv/data/vokara/sqlite
mkdir -p /srv/data/vokara/backups
```

Edit `/srv/platform/vokara/.env`:

```env
GHCR_NAMESPACE=ferilee
IMAGE_TAG=latest
CORS_ORIGIN=https://vokara.smkpasirian-lmj.sch.id
```

Image yang akan digunakan:

```text
ghcr.io/ferilee/vokara-api:latest
ghcr.io/ferilee/vokara-web:latest
```

URL API web dikonfigurasi pada GitHub repository variable bernama `VITE_API_URL` dengan nilai:

```text
https://vokara-api.smkpasirian-lmj.sch.id
```

Nilai ini dibake ke image web saat GitHub Actions berjalan. Perubahan URL API memerlukan build image baru.

## Akses GHCR

Jika package GHCR bersifat private, login dilakukan melalui credential store yang dipakai Arcane. Untuk validasi dari host Docker:

```bash
echo "$GHCR_READ_TOKEN" | docker login ghcr.io -u <github-username> --password-stdin
```

Token minimal memerlukan akses `read:packages`. Jangan menulis token ke `compose.yaml` atau repository.

## Validasi Compose

```bash
cd /srv/platform/vokara
docker compose config
docker compose pull
docker compose ps
```

Compose tidak memiliki `build` dan tidak membutuhkan `/srv/apps/vokara`. Image diambil dari GHCR.

## Backup database

Lakukan backup sebelum redeploy yang berisi migration:

```bash
docker run --rm -v /srv/data/vokara/sqlite:/data:ro -v /srv/data/vokara/backups:/backup alpine:3.22 cp /data/vokara.sqlite /backup/vokara-$(date +%Y%m%d-%H%M%S).sqlite
```

## Redeploy melalui Arcane

1. Push perubahan ke branch deployment, biasanya `main`.
2. Tunggu GitHub Actions selesai.
3. Pastikan image `vokara-api` dan `vokara-web` tersedia di GHCR dengan tag `latest`.
4. Pastikan backup SQLite terbaru tersedia.
5. Pada Arcane, pilih stack Vokara.
6. Jalankan Pull atau Redeploy.
7. Periksa status kedua container.
8. Periksa API:

```bash
curl https://vokara-api.smkpasirian-lmj.sch.id/health
```

## Nginx Proxy Manager

Buat dua Proxy Host pada network `ferileenet`:

| Domain | Forward hostname | Forward port |
| --- | --- | ---: |
| `vokara.smkpasirian-lmj.sch.id` | `vokara-web` | `80` |
| `vokara-api.smkpasirian-lmj.sch.id` | `vokara-api` | `3000` |

Aktifkan sertifikat HTTPS pada kedua hostname. Jangan mempublikasikan port `80`, `81`, atau `443` dari Compose Vokara.

## Rollback

Ubah environment:

```env
IMAGE_TAG=sha-<commit-yang-terbukti>
```

Kemudian jalankan Pull atau Redeploy dari Arcane. Database dipulihkan hanya jika migration menyebabkan masalah dan backup yang sesuai sudah tersedia.

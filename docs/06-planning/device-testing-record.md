# Lembar baseline perangkat pilot

**Status:** template  
**Terkait:** issue 001 dan `device-testing.md`

Isi satu bagian untuk setiap perangkat yang benar-benar diuji. Jangan mengisi hasil berdasarkan emulator atau perkiraan.

## Informasi pengujian

| Field | Nilai |
| --- | --- |
| Tanggal |  |
| Penguji |  |
| Environment | cloud HTTPS / lokal |
| URL atau alamat server |  |
| Versi aplikasi |  |
| Versi schema |  |
| Aktivitas yang diuji | baseline issue 001 |

## Informasi perangkat

| Field | Nilai |
| --- | --- |
| ID perangkat |  |
| Kategori | IFP / HP layar kecil / HP layar menengah |
| Model |  |
| Sistem operasi dan versi |  |
| Browser dan versi |  |
| Resolusi |  |
| RAM atau kelas performa |  |
| Storage kosong |  |
| Touch points |  |
| Stylus | tersedia / tidak tersedia / tidak diuji |
| Jenis koneksi | Wi-Fi / data seluler / lokal |

## Hasil baseline

| Skenario | Hasil | Catatan atau bukti |
| --- | --- | --- |
| Membuka web melalui HTTPS | Belum diuji |  |
| Health check API | Belum diuji |  |
| Layout portrait atau layar kecil | Belum diuji |  |
| Layout layar besar atau IFP | Belum diuji |  |
| Kontrol tanpa hover | Belum diuji |  |
| Touch dan scroll | Belum diuji |  |
| Refresh halaman | Belum diuji |  |
| Browser storage terlihat | Belum diuji |  |
| Error API ditampilkan aman | Belum diuji |  |

Nilai hasil yang diperbolehkan: **Lulus**, **Lulus dengan batasan**, **Gagal**, atau **Belum diuji**.

## Bukti yang sudah diterima

| Perangkat | Viewport | Browser | Touch points | Jaringan | API | Bukti |
| --- | --- | --- | ---: | --- | --- | --- |
| HP pilot 1 | 396 × 764 px | Firefox | 5 | Terhubung | Terhubung | Screenshot pengguna |
| Redmi Note 7 pilot 2 | 384 × 779 px | Chrome/Chromium | 5 | Terhubung | Terhubung | Android 10; RAM 6 GB; MIUI Global 12.5.3; storage 0% terpakai; screenshot pengguna |
| IFP Merah Putih pilot 1 | 1280 × 552 px | Chrome/Chromium | 1 | Terhubung | Terhubung | Screenshot pengguna |

Inventaris Redmi Note 7: model perangkat `M1901F7E`, Android `10`, RAM `6 GB`, CPU octa-core hingga `2.20 GHz`, dan MIUI Global `12.5.3`.

## Keputusan dukungan

- [ ] Didukung untuk pilot.
- [ ] Didukung dengan batasan yang tertulis.
- [ ] Tidak didukung untuk pilot.

Alasan dan tindak lanjut:

> Tulis keputusan setelah seluruh skenario baseline memiliki bukti.

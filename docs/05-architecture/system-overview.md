# Gambaran sistem

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-13

## Tujuan

Vokara adalah satu platform modular yang menghubungkan guru di IFP, siswa di HP, media pembelajaran, sesi kelas, dan penyimpanan data. Sistem harus dapat berjalan melalui server cloud maupun server lokal dengan batas perubahan konfigurasi yang jelas.

## Gambaran arsitektur

```text
Guru / IFP ─┐
            ├── Frontend React + Vite + TypeScript
Siswa / HP ─┘          │
                       ├── UI, Activity Runtime
                       ├── Cache API dan Service Worker
                       └── IndexedDB + Outbox
                                   │
                         HTTP API / WebSocket
                                   │
                          Backend Bun + Hono
                         ┌─────────┴─────────┐
                         │                   │
                  Application Services   Repositories
                         │                   │
                         └──────────┬────────┘
                                    │
                              SQLite + Drizzle
```

Frontend dan backend yang sama dapat dijalankan pada deployment cloud atau server lokal. Perbedaannya berada pada konfigurasi alamat, database, aset, jaringan, dan sinkronisasi.

## Komponen utama

| Komponen | Tanggung jawab |
| --- | --- |
| Web app | Navigasi, layout IFP dan HP, katalog, sesi, aktivitas, dan status koneksi. |
| Activity runtime | Memuat aktivitas berdasarkan kontrak dan menghubungkannya dengan konfigurasi serta state. |
| Offline layer | Cache aset, penyimpanan lokal, pemulihan progres, dan outbox. |
| API | Katalog, kelas, sesi, join, submission, hasil, dan sinkronisasi. |
| Realtime layer | Pertukaran event sesi yang memang membutuhkan pembaruan langsung. |
| Application services | Aturan bisnis dan orkestrasi antar domain. |
| Repositories | Akses data yang memisahkan domain dari SQLite atau penyimpanan lain. |
| Database | Penyimpanan bersama untuk pengguna, kelas, aktivitas, sesi, event, submission, dan aset. |
| Content package | Definisi aktivitas, konfigurasi, dan aset pembelajaran. |

## Batas arsitektur

- Aktivitas tidak mengelola autentikasi, kelas, atau sinkronisasi platform secara mandiri.
- Frontend tidak menjadi sumber kebenaran untuk izin atau hasil yang sudah diterima server.
- Route API tidak berisi seluruh aturan bisnis; aturan domain ditempatkan pada service.
- Repository tidak menentukan alur penggunaan; ia menyediakan akses data untuk service.
- WebSocket tidak menggantikan HTTP untuk katalog dan operasi biasa.
- SQLite server tidak menggantikan IndexedDB perangkat.
- Cache statis tidak dianggap sebagai database sesi.

## Deployment yang didukung

### Cloud

Frontend dan backend diakses melalui domain HTTPS. Server menyimpan data pusat dan melayani akses dari luar jaringan sekolah.

### Server lokal

Bun + Hono + SQLite berjalan pada komputer guru atau mini-PC dan diakses melalui Wi-Fi lokal. Internet tidak diperlukan selama sesi lokal berlangsung.

### Perangkat individual

Frontend menggunakan cache dan IndexedDB untuk menjalankan aktivitas yang sudah disiapkan tanpa server yang dapat dihubungi.

## Alur data utama

### Menjalankan aktivitas

1. Pengguna membuka katalog.
2. Frontend mengambil metadata dan konfigurasi aktivitas.
3. Activity runtime memuat entry point serta aset yang diperlukan.
4. Aktivitas berjalan dengan state lokal.
5. Progres dan submission disimpan sesuai kemampuan aktivitas.

### Sesi kelas

1. Guru membuat sesi melalui API.
2. Server mengembalikan identitas sesi dan kode join.
3. Siswa bergabung menggunakan kode atau QR.
4. Server menghubungkan peserta dengan aktivitas dan sesi.
5. Event real-time dikirim jika diperlukan.
6. Submission diterima melalui HTTP dan masuk ke hasil sesi.

### Offline

1. Aktivitas dan aset disiapkan pada perangkat atau server lokal.
2. Data yang dibuat disimpan lokal ketika server tidak tersedia.
3. Item yang perlu dikirim masuk ke outbox.
4. Ketika koneksi tersedia, item dikirim dengan ID unik.
5. Server memproses pengiriman secara idempotent.

## Prinsip desain

- Satu codebase untuk konteks IFP dan HP.
- Domain memiliki batas yang dapat dijelaskan.
- Kontrak aktivitas stabil dan tervalidasi.
- Data yang diterima server tidak bergantung pada state UI.
- Operasi jaringan dapat gagal dan harus dapat dipulihkan.
- Versi aktivitas dan waktu kejadian dipertahankan.
- Deployment lokal dan cloud memakai paket aplikasi yang sama sejauh memungkinkan.

## Keputusan yang masih diperlukan

- Bentuk autentikasi dan identitas pengguna.
- Strategi penyajian frontend pada server lokal.
- Target kapasitas sesi lokal.
- Kontrak final antara event, progres, dan submission.
- Rencana migrasi dari SQLite jika kebutuhan berkembang.

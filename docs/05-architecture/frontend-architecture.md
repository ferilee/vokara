# Arsitektur frontend

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-13

## Tujuan

Frontend menyediakan pengalaman yang sama secara konseptual untuk guru di IFP dan siswa di HP, dengan layout dan kontrol yang disesuaikan perangkat. Frontend juga menjadi tempat pengelolaan state lokal, cache, dan pemulihan ketika koneksi berubah.

## Struktur konseptual

```text
App shell
├── Routing dan session context
├── Layout IFP
├── Layout mobile
├── Shared UI
├── Feature modules
│   ├── Dashboard
│   ├── Classroom
│   ├── Library
│   └── Activities
├── Activity runtime
├── Offline layer
└── API client
```

Struktur ini mengikuti tanggung jawab produk. Komponen visual bersama tidak boleh menjadi tempat untuk aturan domain kelas atau sinkronisasi.

## Area frontend

| Area | Tanggung jawab |
| --- | --- |
| App shell | Inisialisasi aplikasi, routing, konfigurasi, dan pemulihan konteks. |
| Layout IFP | Navigasi, kontrol besar, presentasi, dan interaksi stylus atau sentuhan. |
| Layout mobile | Alur join, pengerjaan, status, dan umpan balik pada layar kecil. |
| Dashboard | Ringkasan kelas, sesi, aktivitas, dan tindakan utama guru. |
| Classroom | Membuat sesi, join state, peserta, event kelas, dan rekap. |
| Library | Katalog, filter, detail, persiapan, dan status offline aktivitas. |
| Activities | Runtime dan layar khusus tiap aktivitas. |
| Offline layer | Cache, IndexedDB, outbox, status koneksi, dan pemulihan data. |
| API client | Request, response, error, retry terbatas, dan transformasi data transport. |

## Kategori state

### UI state

State sementara seperti panel terbuka, tab aktif, fokus input, dan ukuran layout. State ini tidak perlu dikirim ke server.

### Activity state

State interaksi yang diperlukan untuk melanjutkan aktivitas, misalnya posisi objek atau jawaban yang sedang disusun. Penyimpanannya mengikuti kontrak aktivitas.

### Session state

State sesi yang diterima atau diumumkan server, misalnya status sesi, peserta, pertanyaan aktif, dan event kelas.

### Local persistence state

Data yang harus bertahan setelah refresh atau browser ditutup, misalnya konfigurasi offline, progres, dan outbox.

### Server state

Data yang menjadi acuan server, misalnya katalog, kelas, hasil yang sudah diterima, dan izin. Frontend boleh melakukan cache, tetapi tidak boleh menganggap cache sebagai otoritas final.

## Layout IFP dan mobile

Kedua layout menggunakan domain dan kontrak data yang sama. Perbedaan yang boleh dilakukan:

- ukuran dan susunan kontrol;
- navigasi dan jumlah informasi per layar;
- cara menampilkan status dan umpan balik;
- prioritas tindakan sesuai peran guru atau siswa;
- penggunaan ruang visual untuk presentasi dan manipulasi.

Fungsi penting tidak boleh hanya tersedia pada satu layout tanpa alasan produk yang terdokumentasi.

## Activity runtime

Runtime bertanggung jawab untuk:

- memilih aktivitas berdasarkan ID dan versi;
- memuat metadata, konfigurasi, dan aset;
- menyediakan konteks yang disetujui Activity SDK;
- menghubungkan perubahan dengan penyimpanan lokal;
- mengirim event atau submission sesuai kontrak;
- menampilkan status offline dan sinkronisasi;
- menangani aktivitas yang tidak kompatibel atau tidak tersedia.

Aktivitas tidak boleh mengakses repository database secara langsung. Aktivitas berkomunikasi melalui API runtime yang dibatasi.

## Prinsip interaksi

- Tindakan utama memiliki target sentuh yang memadai.
- Tidak ada fitur penting yang bergantung pada hover.
- Drag, pinch, atau gesture lain memiliki alternatif yang dapat ditemukan.
- Input memiliki umpan balik segera.
- Status tersimpan lokal dan status diterima server dibedakan.
- Error dapat dipahami dan memiliki tindakan pemulihan.
- Tampilan tetap dapat digunakan pada orientasi dan ukuran layar yang didukung.

## Penanganan koneksi

Frontend perlu mengamati perubahan koneksi, tetapi status browser online saja tidak cukup untuk menyimpulkan server dapat diakses. Status sebaiknya berasal dari kombinasi:

- kemampuan perangkat mendeteksi jaringan;
- pemeriksaan endpoint yang relevan;
- status antrean lokal;
- acknowledgment server.

## Batas dependensi

- Feature module bergantung pada kontrak domain, bukan pada detail database.
- Komponen UI bersama tidak bergantung pada route tertentu.
- Activity runtime tidak mengasumsikan satu bentuk layout.
- Offline layer dapat digunakan oleh aktivitas melalui kontrak, bukan melalui implementasi penyimpanan langsung.
- API client tidak menafsirkan aturan bisnis yang seharusnya menjadi tanggung jawab service atau frontend feature.

## Aksesibilitas dan perangkat

Pengujian frontend harus mencakup:

- sentuhan jari dan stylus pada IFP;
- keyboard dan mouse untuk kebutuhan alternatif;
- ukuran layar HP yang berbeda;
- kontras, ukuran teks, dan fokus input;
- orientasi layar;
- browser dan sistem operasi yang didukung;
- pemulihan setelah refresh, browser ditutup, dan koneksi putus.

## Pertanyaan terbuka

- Router frontend apa yang digunakan dan bagaimana route offline dipulihkan?
- Apakah state management memerlukan pustaka khusus?
- Bagaimana aset aktivitas dipisah antara bundle awal dan unduhan offline?
- Bagaimana aktivitas yang gagal dimuat dilaporkan tanpa mengganggu katalog?
- Apakah IFP memerlukan mode presentasi khusus tanpa kontrol siswa?

# Activity SDK

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-17

## Tujuan

Activity SDK adalah kontrak bersama untuk membuat, memuat, menjalankan, memvalidasi, dan menyimpan hasil aktivitas. SDK menjaga agar aktivitas baru dapat ditambahkan tanpa membangun ulang katalog, sesi kelas, offline layer, dan rekap.

## Konsep inti

| Konsep | Fungsi |
| --- | --- |
| Definition | Identitas, metadata, mode, versi, entry point, dan kemampuan aktivitas. |
| Configuration | Parameter isi atau perilaku yang tervalidasi. |
| Runtime | Konteks yang digunakan aktivitas saat dijalankan. |
| Activity state | State interaksi yang dapat dipulihkan sesuai aturan aktivitas. |
| Event | Perubahan atau kejadian yang diperlukan untuk sesi atau histori. |
| Submission | Respons yang dikirim untuk diproses dan direkap. |
| Asset | Berkas atau data pendukung aktivitas. |
| Capability | Kemampuan aktivitas seperti offline, real-time, atau submission. |

## Definition minimum

Definisi aktivitas perlu menyatakan:

- ID stabil;
- judul dan deskripsi;
- subject atau area matematika;
- mode `quiz`, `explore`, atau `whiteboard` untuk MVP;
- versi aktivitas;
- entry point;
- status publikasi;
- kesiapan offline;
- tujuan belajar;
- kebutuhan perangkat;
- kemampuan interaksi dan submission.

Definition MVP juga harus menyatakan `configSchemaVersion` dan capability yang dibutuhkan. Mode `game` ditunda.

Bentuk konseptualnya:

```text
ActivityDefinition
├── id, title, description, subject
├── mode: quiz | explore | whiteboard
├── version, sdkVersion, configSchemaVersion
├── entry, status, learningObjectives
├── capabilities
└── offlineReadiness
```

## Runtime context

Runtime dapat menyediakan hal-hal berikut melalui kontrak yang terkontrol:

- konfigurasi aktivitas yang sudah divalidasi;
- konteks pengguna dan peran yang telah disaring;
- konteks sesi jika aktivitas dijalankan bersama;
- API untuk menyimpan progres;
- API untuk membuat event atau submission;
- status koneksi dan sinkronisasi;
- akses ke aset yang telah disetujui.

Aktivitas tidak boleh mendapatkan akses langsung ke token rahasia, database, atau API jaringan bebas.

## Lifecycle aktivitas

```text
load → validate → initialize → interact → persist → submit → dispose
```

- `load`: metadata, konfigurasi, dan aset tersedia.
- `validate`: kontrak dan konfigurasi diperiksa.
- `initialize`: state awal dibentuk.
- `interact`: pengguna menjalankan aktivitas.
- `persist`: state yang perlu dipulihkan disimpan.
- `submit`: respons dikirim sesuai aturan aktivitas.
- `dispose`: listener, resource, dan state sementara dilepas.

Tidak semua aktivitas memiliki submission final. Aktivitas eksploratif dapat hanya menyimpan progres atau event tertentu.

## Capability

Capability membuat kebutuhan aktivitas terlihat oleh platform. Contoh:

- `offlineIndividual`;
- `classSession`;
- `realtime`;
- `submissions`;
- `teacherPresentation`;
- `studentInput`;
- `resumeState`.

Platform harus dapat menolak atau menyesuaikan aktivitas jika capability yang dibutuhkan tidak tersedia pada deployment atau mode penggunaan.

## Konfigurasi dan validasi

Konfigurasi aktivitas harus:

- memiliki bentuk yang dapat divalidasi;
- memiliki nilai default yang aman;
- memiliki aturan rentang dan dependensi;
- memiliki versi atau migrasi jika strukturnya berubah;
- menghasilkan pesan error yang dapat ditindaklanjuti;
- tidak memuat rahasia atau akses jaringan.

Konfigurasi yang digunakan dalam sesi harus disimpan bersama identitas versi aktivitas agar sesi dapat direkonstruksi.

## Event dan submission

SDK membedakan:

- **state:** kondisi aktivitas saat ini;
- **event:** kejadian yang perlu dicatat atau disiarkan;
- **submission:** respons yang dikirim untuk diproses atau dinilai;
- **progress:** informasi untuk melanjutkan aktivitas.

Aktivitas harus menjelaskan mana yang bersifat sementara, mana yang perlu disimpan, dan mana yang menjadi hasil belajar. Platform tidak boleh mengirim semua perubahan pointer atau animasi sebagai submission.

Kontrak MVP:

- **State** adalah snapshot JSON tervalidasi yang dapat dipulihkan.
- **Progress** adalah ringkasan kecil untuk melanjutkan aktivitas.
- **Event** hanya mencatat kejadian bermakna dan memiliki event type serta waktu kejadian.
- **Submission** adalah payload final yang memiliki submission ID, activity version, session context, waktu pencatatan, dan hasil yang tervalidasi.
- Submission yang sama dapat dikirim ulang dengan ID sama dan harus diproses idempotent.
- Revisi submission setelah diterima server tidak termasuk MVP.

## Offline readiness

Aktivitas yang menyatakan siap offline harus menyediakan:

- aset dan konfigurasi yang dapat tersedia lokal;
- alur utama tanpa request jaringan wajib;
- state yang dapat dipulihkan;
- submission yang dapat masuk outbox;
- perilaku saat koneksi terputus;
- kompatibilitas dengan versi platform yang didukung.

Kesiapan offline harus diverifikasi melalui pengujian, bukan hanya metadata.

## Versioning

Versi aktivitas dicatat pada katalog, konfigurasi, sesi, dan submission. Perubahan pada aturan interaksi, format hasil, tujuan belajar, atau struktur konfigurasi biasanya memerlukan versi baru.

Activity SDK sendiri juga memiliki versi. Kompatibilitas antara versi SDK dan aktivitas harus dapat diperiksa sebelum aktivitas dimuat.

## Validasi publikasi

Sebelum aktivitas berstatus `published`, platform atau proses authoring harus memeriksa:

- metadata;
- konfigurasi;
- aset;
- capability;
- entry point;
- submission schema;
- kesiapan perangkat;
- kesiapan offline;
- versi SDK.

## Prinsip extensibility

- Kontrak minimum dijaga kecil dan stabil.
- Kemampuan khusus dinyatakan secara eksplisit.
- Aktivitas tidak memaksa platform memahami detail internalnya.
- Kontrak transport dan kontrak visual tidak dicampur tanpa alasan.
- Perubahan breaking memerlukan versi dan catatan keputusan.

## Pertanyaan terbuka

- Bentuk final definition dan schema konfigurasi.
- API runtime untuk akses aset dan persistence.
- Strategi kompatibilitas beberapa versi SDK.
- Batas penggunaan library pihak ketiga seperti Phaser.

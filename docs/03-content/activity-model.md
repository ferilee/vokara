# Model aktivitas

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-17

Dokumen ini menjelaskan model konseptual aktivitas sebagai unit media yang dapat dimuat oleh platform. Model ini menjadi dasar Activity SDK, katalog, konfigurasi, versi, aset, sesi, dan submission.

## Definisi aktivitas

Aktivitas adalah unit pembelajaran yang memiliki tujuan, metadata, konfigurasi, antarmuka interaksi, dan aturan penyimpanan hasil. Aktivitas dapat digunakan secara individual atau di dalam sesi kelas sesuai kemampuan yang dinyatakan oleh aktivitas tersebut.

Aktivitas mencakup beberapa bagian:

```text
Aktivitas
├── Identitas dan metadata
├── Tujuan belajar
├── Konfigurasi
├── Entry point dan tampilan
├── Aset
├── Aturan interaksi
├── Aturan umpan balik
├── Aturan submission
└── Kemampuan offline
```

## Metadata minimum

Setiap aktivitas perlu memiliki:

- ID yang stabil dan unik;
- judul dan deskripsi;
- area atau subtopik matematika;
- tujuan belajar;
- mode aktivitas;
- versi;
- entry point;
- status publikasi;
- informasi kesiapan offline;
- kebutuhan perangkat jika ada.

Metadata digunakan untuk katalog dan pemilihan aktivitas. Metadata tidak boleh memuat logika khusus yang seharusnya menjadi bagian dari implementasi aktivitas.

## Mode aktivitas

Mode awal yang direncanakan:

| Mode | Tujuan interaksi | Contoh |
| --- | --- | --- |
| `quiz` | Siswa memilih atau mengirim jawaban terstruktur untuk dinilai. | Kuis pilihan ganda MVP. |
| `explore` | Siswa mengubah parameter atau objek dan mengamati hasil. | Grafik fungsi atau manipulasi geometri. |
| `whiteboard` | Guru atau siswa menulis, menggambar, dan memberi anotasi. | Papan tulis matematika. |

Mode `game` ditunda dari MVP. Aktivitas baru yang membutuhkan aturan game harus menambahkan decision record sebelum mode tersebut dimasukkan ke kontrak publik.

## Konfigurasi aktivitas

Konfigurasi memuat parameter yang mengubah isi atau perilaku aktivitas tanpa mengubah implementasi dasarnya. Contoh konfigurasi:

- tingkat kesulitan;
- topik atau subtopik;
- angka, soal, atau dataset;
- durasi;
- jumlah percobaan;
- aturan umpan balik;
- mode kerja individual atau kelas;
- bahasa dan instruksi.

Konfigurasi harus tervalidasi sebelum aktivitas dijalankan. Konfigurasi yang tidak valid harus menghasilkan pesan yang dapat dipahami oleh pengguna atau penulis konten.

## Versi aktivitas

Versi membedakan perubahan pada definisi, konfigurasi yang kompatibel, aset, atau perilaku yang dapat memengaruhi hasil belajar.

- Versi yang sudah dipakai pada sesi tidak boleh berubah secara diam-diam.
- Submission harus dapat dikaitkan dengan versi aktivitas yang menghasilkan atau menerima respons tersebut.
- Perubahan pada tujuan, aturan penilaian, atau format submission biasanya memerlukan versi baru.
- Aset yang berubah secara material harus tercatat sebagai bagian dari versi yang sesuai.
- Aktivitas lama tetap dapat dibuka jika data sesi atau arsip membutuhkannya.

## Kemampuan offline

Aktivitas harus menyatakan kemampuan offline-nya secara eksplisit:

| Status | Makna |
| --- | --- |
| Siap offline individual | Aktivitas dan aset dapat digunakan tanpa koneksi setelah disiapkan. |
| Siap dengan batasan | Sebagian fitur, misalnya sinkronisasi atau umpan balik langsung, membutuhkan koneksi. |
| Tidak siap offline | Aktivitas membutuhkan layanan jaringan untuk dijalankan dengan benar. |

Klaim offline harus diuji pada perangkat target. Memiliki berkas aset lokal saja belum cukup jika aktivitas masih membutuhkan API atau layanan eksternal saat berjalan.

## Siklus hidup aktivitas

```text
draft → review → published → deprecated
```

- `draft`: sedang dibuat dan belum tersedia untuk penggunaan umum.
- `review`: siap diperiksa isi, teknis, dan pengalaman pengguna.
- `published`: dapat dipilih sesuai izin dan target distribusinya.
- `deprecated`: tidak dipilih untuk penggunaan baru, tetapi mungkin tetap diperlukan oleh sesi lama.

Status aktivitas berbeda dari status sesi. Aktivitas dapat dipublikasikan tanpa sedang digunakan, sedangkan sesi memiliki siklus hidup tersendiri.

## Interaksi dan submission

Aktivitas perlu menjelaskan:

- input apa yang diberikan siswa atau guru;
- perubahan state apa yang terjadi;
- apakah state harus disimpan lokal;
- kapan respons dianggap siap dikirim;
- format hasil yang dikirim;
- apakah respons dapat diperbarui;
- umpan balik apa yang terlihat oleh siswa;
- data apa yang dapat dilihat guru.

Tidak semua perubahan interaksi harus menjadi submission. Perbedaan antara state sementara, progres, kejadian sesi, dan jawaban final harus ditetapkan pada kontrak aktivitas.

Pada MVP, gunakan batas berikut:

| Data | Arti | Contoh |
| --- | --- | --- |
| **State** | Snapshot aktivitas yang dapat dipulihkan dan tidak otomatis menjadi hasil belajar. | Stroke papan tulis atau parameter grafik aktif. |
| **Progres** | Ringkasan untuk melanjutkan aktivitas. | Soal terakhir atau persentase kuis yang sudah dikerjakan. |
| **Event** | Kejadian bermakna untuk histori atau sesi. | Aktivitas dimulai, dijeda, atau submission diterima. |
| **Submission** | Hasil final yang dikirim, divalidasi, dan direkap. | Jawaban kuis final. |

Pointer, animasi, dan perubahan state berfrekuensi tinggi tidak dikirim sebagai event atau submission.

## Aset dan dependensi

Aktivitas harus mendeklarasikan aset yang dibutuhkannya. Setiap aset perlu memiliki:

- identitas dan versi;
- tipe dan ukuran;
- hubungan dengan aktivitas atau versi aktivitas;
- status tersedia secara lokal;
- aturan cache atau distribusi;
- lisensi atau sumber jika berasal dari pihak lain.

Aktivitas tidak boleh bergantung pada aset yang tidak tercatat atau pada layanan pihak ketiga yang belum disetujui untuk penggunaan offline.

## Validasi aktivitas

Sebelum dipublikasikan, aktivitas harus diperiksa pada empat lapisan:

1. **Struktur:** metadata, konfigurasi, versi, dan aset valid.
2. **Fungsional:** alur interaksi dan submission bekerja.
3. **Pembelajaran:** tujuan, instruksi, dan umpan balik sesuai.
4. **Perangkat:** aktivitas dapat digunakan pada IFP dan HP yang menjadi target.

## Prinsip extensibility

Activity SDK menyediakan kontrak minimum bersama. Aktivitas boleh memiliki antarmuka khusus, tetapi tidak boleh mengharuskan platform menambahkan pengecualian untuk setiap jenis aktivitas.

Kontrak bersama harus stabil, sedangkan kemampuan khusus sebaiknya disediakan melalui kemampuan yang dapat dideteksi atau konfigurasi yang tervalidasi.

## Keputusan yang sudah ditetapkan untuk MVP

- Mode yang didukung: `quiz`, `explore`, dan `whiteboard`.
- Kuis MVP memakai satu tipe soal pilihan ganda.
- Submission kuis final setelah diterima server dan retry menggunakan ID yang sama.
- Ketiga aktivitas percontohan harus siap offline individual.
- Sesi kelas lokal pilot menjamin kuis; papan tulis dan grafik dipakai offline individual.

## Keputusan yang masih diperlukan

- Format final metadata dan konfigurasi aktivitas.
- Aturan penilaian untuk aktivitas eksploratif dan papan tulis.
- Strategi kompatibilitas versi Activity SDK.
- Apakah aktivitas boleh memuat kode eksternal atau seluruh dependensi harus dibundel.

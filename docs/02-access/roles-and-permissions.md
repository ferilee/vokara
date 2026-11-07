# Peran dan izin

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-17

Dokumen ini menetapkan peran pengguna dan batas akses awal untuk Vokara. Detail autentikasi, implementasi session, dan aturan keamanan akan dijabarkan pada dokumentasi arsitektur.

## Prinsip akses

- Pengguna hanya dapat mengelola data yang menjadi tanggung jawabnya.
- Guru dapat mengelola kelas dan sesi yang dibuatnya.
- Siswa dapat mengikuti sesi yang diizinkan untuknya dan mengelola responsnya sendiri.
- Data hasil belajar siswa hanya ditampilkan sesuai konteks kelas dan izin yang berlaku.
- Akses sementara untuk bergabung ke sesi tidak otomatis menjadi akun permanen.
- Peran dan izin harus dapat diperiksa oleh backend, bukan hanya disembunyikan pada antarmuka.
- Kebutuhan offline tidak boleh menghapus batas akses. Data yang disimpan lokal tetap harus terikat pada perangkat, pengguna, atau sesi yang sesuai.

## Peran MVP

### Guru

Guru adalah pemilik kelas dan pengelola utama sesi pembelajaran.

Guru dapat:

- melihat dan memilih aktivitas yang tersedia;
- menyiapkan konfigurasi aktivitas;
- membuat, membuka, menjeda, dan menutup sesi miliknya;
- membagikan kode atau QR sesi;
- melihat anggota yang bergabung;
- menerima submission siswa pada sesi miliknya;
- melihat rekap hasil sesi miliknya;
- mengulangi atau mengakhiri aktivitas sesuai alur produk.

Guru tidak otomatis dapat:

- mengubah aktivitas milik penulis konten;
- melihat data kelas guru lain;
- mengakses session atau submission di luar kewenangannya;
- mengubah data pusat tanpa aturan administrasi yang ditetapkan.

### Siswa

Siswa adalah peserta sesi yang mengerjakan aktivitas melalui HP atau perangkat lain yang didukung.

Pada MVP, siswa menggunakan identitas sementara yang hanya berlaku dalam satu sesi. Identitas ini bukan akun global dan tidak memerlukan nama lengkap, nomor induk, email, atau nomor telepon.

Siswa dapat:

- bergabung ke sesi menggunakan kode atau QR yang masih berlaku;
- melihat instruksi dan status sesi yang diikutinya;
- mengirim atau memperbarui respons sesuai aturan aktivitas;
- melihat status penyimpanan dan pengiriman responsnya;
- melihat umpan balik yang memang ditujukan kepadanya atau seluruh peserta.
- melanjutkan identitas sesi yang sama setelah refresh jika token lokal masih tersedia.

Siswa tidak dapat:

- membuat atau mengelola kelas;
- membuka sesi sebagai guru;
- melihat submission pribadi siswa lain kecuali aktivitas secara eksplisit menampilkannya;
- mengubah konfigurasi aktivitas setelah sesi dimulai;
- mengakses data kelas di luar sesi yang diikutinya.

## Peran pendukung

### Penulis konten

Penulis konten menyiapkan definisi aktivitas, konfigurasi, dan aset media. Peran ini belum menjadi alur utama MVP.

Penulis konten dapat, sesuai proses publikasi yang nanti ditetapkan:

- membuat draft aktivitas;
- memperbarui konfigurasi dan aset;
- membuat versi aktivitas;
- menjalankan validasi konten;
- mengajukan aktivitas untuk digunakan guru.

Penulis konten tidak otomatis dapat melihat data pribadi, kelas, atau submission siswa.

### Administrator

Administrator adalah peran operasional yang mungkin diperlukan ketika platform digunakan oleh lebih banyak sekolah. Peran ini belum diperlukan untuk alur MVP dan izin detailnya belum ditetapkan.

## Matriks izin awal

| Kemampuan | Guru | Siswa | Penulis konten | Administrator |
| --- | --- | --- | --- | --- |
| Melihat katalog aktivitas yang tersedia | Ya | Sesuai kebutuhan sesi | Ya | Ya |
| Membuat draft aktivitas | Tidak | Tidak | Ya | Ya |
| Membuat kelas | Ya | Tidak | Tidak | Ya |
| Mengelola anggota kelas | Ya, untuk kelas sendiri | Tidak | Tidak | Ya |
| Membuat sesi | Ya | Tidak | Tidak | Ya |
| Bergabung ke sesi | Opsional sebagai pengelola | Ya, dengan akses valid | Tidak | Ya |
| Mengirim submission | Tidak sebagai siswa | Ya, milik sendiri | Tidak | Sesuai kebutuhan dukungan |
| Melihat rekap sesi | Ya, untuk sesi sendiri | Terbatas pada hasil sendiri atau umpan balik | Tidak | Sesuai kewenangan |
| Mengelola versi aktivitas | Tidak | Tidak | Ya | Ya |
| Mengelola akun pengguna | Belum ditetapkan | Belum ditetapkan | Belum ditetapkan | Ya, jika diperlukan |

## Kepemilikan data

| Data | Pemilik atau pengelola utama | Akses peserta |
| --- | --- | --- |
| Kelas | Guru pemilik kelas | Anggota dapat melihat konteks yang diperlukan |
| Keanggotaan kelas | Guru pemilik kelas | Siswa dapat melihat status keanggotaannya |
| Sesi | Guru pembuat sesi | Peserta dapat mengakses sesi selama aksesnya berlaku |
| Submission | Siswa sebagai pemilik respons, guru sebagai pengelola sesi | Siswa melihat respons sendiri; guru melihat hasil sesi sesuai izin |
| Aktivitas yang dipublikasikan | Platform atau penulis konten sesuai proses | Guru dan siswa dapat menggunakan sesuai status publikasi |
| Aset konten | Platform atau penulis konten | Diakses melalui aktivitas yang menggunakannya |

## Akses sementara siswa

Pada MVP, siswa menggunakan identitas sesi. Akses tersebut memiliki:

- identitas unik dalam sesi;
- hubungan dengan session yang dimasuki;
- nama tampilan yang dipilih siswa, tanpa mewajibkan nama lengkap;
- masa berlaku sampai sesi ditutup atau identitas sesi dicabut;
- kemampuan untuk mengaitkan submission secara konsisten;
- aturan pemulihan ketika browser ditutup atau perangkat berganti.

Identitas sesi tidak boleh dianggap sebagai akun global sebelum keputusan produk dan privasi dibuat.

Data minimum yang disimpan adalah `session_participant_id`, session ID, nama tampilan, waktu join, status peserta, dan submission terkait. Data siswa disimpan selama 90 hari setelah sesi ditutup untuk pilot, kemudian dihapus atau dianonimkan sesuai prosedur retensi.

## Aturan saat akses dicabut

- Siswa yang dikeluarkan dari sesi tidak dapat mengirim respons baru ke sesi tersebut.
- Submission yang sudah diterima tetap mengikuti aturan penyimpanan dan pelaporan sesi.
- Sesi yang ditutup tidak menerima submission baru kecuali guru membukanya kembali.
- Perubahan izin guru atau penulis konten tidak boleh mengubah histori hasil belajar tanpa pencatatan.

## Keputusan yang masih diperlukan

- Bagaimana self-service account dan pemulihan akun guru dilakukan setelah pilot?
- Apakah satu guru dapat memiliki beberapa kelas dan beberapa sekolah?
- Apakah siswa dapat berpindah perangkat dalam sesi yang sama?
- Apakah administrator dibutuhkan sejak deployment pertama?

# Keamanan dan secrets

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-13

## Tujuan

Keamanan Vokara melindungi akun dan akses pengguna, data kelas, submission siswa, aset konten, serta server lokal. Kontrol keamanan harus sesuai dengan risiko nyata dan tetap dapat dioperasikan oleh guru atau operator sekolah.

## Prinsip keamanan

- Validasi dan otorisasi dilakukan di backend.
- Akses diberikan berdasarkan kebutuhan minimum.
- Kode join tidak memberikan hak administratif.
- Data lokal dan cloud memiliki aturan akses yang dapat dijelaskan.
- Secrets tidak disimpan dalam repository, bundle frontend, atau dokumentasi.
- Log membantu diagnosis tanpa menyalin data pribadi berlebihan.
- Backup diperlakukan sebagai salinan data yang harus dilindungi.
- Deployment lokal mempertimbangkan keamanan jaringan dan akses fisik.

## Aset yang perlu dilindungi

| Aset | Risiko utama |
| --- | --- |
| Akun guru | Pengambilalihan kelas dan sesi. |
| Identitas siswa | Paparan data pribadi atau hasil belajar. |
| Kode sesi | Peserta yang tidak diinginkan masuk ke sesi. |
| Submission | Perubahan atau pembacaan hasil tanpa izin. |
| Database | Kehilangan, kerusakan, atau salinan tidak berwenang. |
| Secrets | Akses ke API, database, atau layanan deployment. |
| Aset konten | Penggunaan atau perubahan tanpa otorisasi. |
| Server lokal | Akses fisik atau jaringan dari pihak yang tidak berwenang. |

## Identitas dan otorisasi

Detail autentikasi belum diputuskan. Apa pun mekanismenya, backend harus memeriksa:

- identitas atau konteks sesi pemanggil;
- peran;
- kepemilikan kelas dan sesi;
- hubungan siswa dengan sesi;
- izin untuk melihat hasil atau mengubah status;
- masa berlaku token atau akses.

Otorisasi tidak boleh hanya bergantung pada ID yang dikirim client.

## Secrets

Secrets mencakup password, token, kunci penandatanganan, credential database, sertifikat privat, dan nilai konfigurasi sensitif.

Aturan awal:

- simpan melalui secret manager atau environment deployment yang terlindungi;
- jangan masukkan ke source code, file konten, bundle browser, screenshot, atau dokumentasi;
- jangan menulis secrets ke log;
- rotasi jika pernah terekspos;
- pisahkan secrets cloud dan server lokal;
- batasi siapa dan proses apa yang dapat membacanya.

Frontend hanya boleh menerima konfigurasi publik yang memang aman diketahui browser.

## Server lokal

Server lokal memiliki risiko tambahan:

- perangkat dapat diakses secara fisik;
- jaringan Wi-Fi dapat digunakan perangkat yang tidak dimaksudkan;
- alamat server mungkin diketahui pengguna lain di jaringan;
- backup dapat tersalin tanpa kontrol cloud;
- proses update mungkin dilakukan secara manual.

Kontrol minimum perlu mencakup batas jaringan, akses fisik, password operator bila diperlukan, backup terlindungi, dan prosedur update yang dapat dipahami.

## Data siswa dan privasi

Kumpulkan data minimum yang dibutuhkan untuk alur belajar. Identitas sementara per sesi tidak boleh diperlakukan sebagai akun global tanpa keputusan produk.

Dokumentasi lanjutan harus menetapkan:

- data apa yang dikumpulkan;
- tujuan penggunaannya;
- siapa yang dapat melihatnya;
- masa retensi;
- cara penghapusan atau pemulihan;
- perlakuan terhadap backup dan log.

## Transport dan penyimpanan

- Deployment cloud menggunakan HTTPS dan WebSocket aman.
- Server lokal perlu memiliki strategi yang jelas untuk HTTPS atau keterbatasan secure context.
- Data sensitif pada perangkat dan server diproteksi sesuai kemampuan platform.
- Backup database tidak dianggap aman hanya karena disimpan di perangkat sekolah.
- Payload sinkronisasi mengikuti aturan akses submission.

## Validasi input dan dependensi

- Semua input jaringan divalidasi.
- Ukuran payload, file, dan batch dibatasi.
- File aset diperiksa tipe, ukuran, dan sumbernya.
- Dependensi pihak ketiga ditinjau dan diperbarui melalui proses yang dapat dilacak.
- Aktivitas tidak diberi akses jaringan atau runtime yang tidak diperlukan.

## Logging dan incident response

Log perlu mendukung diagnosis terhadap login, akses sesi, submission, sinkronisasi, dan error sistem tanpa menyimpan data pribadi secara berlebihan.

Jika terjadi insiden, prosedur awal perlu menjelaskan:

1. membatasi akses atau mencabut credential;
2. menjaga bukti dan log yang relevan;
3. menilai data yang terdampak;
4. memulihkan layanan dengan aman;
5. mencatat dan memperbaiki akar masalah;
6. memberi tahu pihak yang perlu mengetahui sesuai kebijakan yang berlaku.

## Kriteria keamanan minimum MVP

- Izin diverifikasi oleh backend.
- Secrets tidak masuk repository atau frontend bundle.
- Submission siswa tidak dapat dilihat lintas sesi tanpa izin.
- Kode sesi tidak dapat digunakan untuk membuat atau mengelola kelas.
- Backup database memiliki akses terbatas.
- Log tidak mencetak token dan payload sensitif secara utuh.
- Server lokal memiliki prosedur dasar untuk akses dan pemulihan.

## Pertanyaan terbuka

- Mekanisme autentikasi guru yang dipilih.
- Apakah siswa memakai akun atau identitas sesi.
- Secret manager untuk deployment cloud.
- Distribusi dan rotasi credential server lokal.
- Kebijakan privasi dan retensi data sekolah.
- Apakah perlu audit log yang dapat dilihat administrator.

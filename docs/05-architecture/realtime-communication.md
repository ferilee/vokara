# Komunikasi real-time

**Status:** proposed  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-13

## Tujuan

Komunikasi real-time dipakai untuk membuat perubahan penting dalam sesi kelas terlihat tanpa refresh manual, misalnya guru membuka pertanyaan dan respons siswa muncul pada layar IFP.

## Prinsip penggunaan

- Gunakan WebSocket hanya jika pembaruan langsung memberikan nilai nyata.
- Gunakan HTTP untuk katalog, konfigurasi, join, submission, dan rekap.
- Event real-time bukan pengganti penyimpanan yang dapat dipulihkan.
- Server menjadi sumber kebenaran status sesi.
- Klien harus mampu pulih setelah koneksi WebSocket putus.

## Topologi

```text
IFP guru ───────┐
                ├── WebSocket session channel ── Backend
HP siswa ───────┘
```

Pada server lokal, koneksi terjadi melalui Wi-Fi sekolah. Pada cloud, koneksi terjadi melalui jaringan internet dan domain HTTPS/WSS yang sesuai.

## Lifecycle koneksi

1. Klien meminta atau menerima konteks sesi melalui HTTP.
2. Klien membuka WebSocket dengan konteks akses yang valid.
3. Server memeriksa identitas, sesi, dan izin channel.
4. Server mengirim snapshot atau versi status terbaru.
5. Klien menerima event dan memperbarui tampilan.
6. Klien mengirim event yang memang diizinkan.
7. Server mengakui atau menolak event.
8. Saat koneksi putus, klien melakukan reconnect sesuai aturan.
9. Klien meminta snapshot atau event setelah versi terakhir untuk mengejar ketertinggalan.

## Jenis event awal

| Event | Pengirim | Penerima | Tujuan |
| --- | --- | --- | --- |
| Sesi dibuka | Server | Peserta sesi | Memberi tahu sesi siap digunakan. |
| Aktivitas dimulai | Guru melalui server | Siswa | Menyamakan aktivitas atau state presentasi. |
| Aktivitas dijeda | Guru melalui server | Siswa | Menahan interaksi sesuai aturan aktivitas. |
| Peserta bergabung | Server | Guru atau peserta sesuai izin | Memperbarui daftar peserta. |
| Respons baru tersedia | Server setelah submission | Guru | Memberi indikasi bahwa hasil baru masuk. |
| Sesi ditutup | Guru melalui server | Peserta | Menghentikan penerimaan respons baru. |

Nama dan payload event final ditetapkan bersama Activity SDK dan kontrak API.

## Ordering dan versi

Event yang perlu diurutkan harus memiliki nomor urut atau versi sesi. Timestamp saja tidak cukup ketika beberapa perangkat memiliki jam berbeda.

Klien perlu mengetahui versi status terakhir yang sudah diterima. Saat reconnect, klien dapat meminta event yang hilang atau snapshot terbaru.

## Submission dan real-time

Submission sebaiknya dikirim melalui HTTP atau jalur yang memiliki acknowledgment dan idempotensi yang jelas. WebSocket dapat memberi notifikasi bahwa submission baru tersedia, tetapi event real-time tidak boleh menjadi satu-satunya penyimpanan jawaban.

## Reconnect dan fallback

Ketika WebSocket putus:

- UI menampilkan status koneksi sesi;
- aktivitas tetap mengikuti aturan offline yang dimilikinya;
- event yang belum diakui tidak dianggap berhasil tanpa bukti;
- klien mencoba reconnect dengan jeda yang wajar;
- setelah reconnect, klien meminta snapshot atau event yang tertinggal;
- HTTP tetap digunakan untuk operasi yang dapat dilakukan tanpa real-time.

Jika real-time tidak tersedia, produk boleh turun ke refresh atau polling terbatas jika pengalaman masih dapat diterima. Fallback tidak boleh menghasilkan submission ganda.

## Channel dan isolasi sesi

Koneksi harus terikat pada satu konteks sesi. Server memastikan pengguna tidak dapat berlangganan channel kelas atau sesi lain dengan mengubah ID pada client.

Event guru, event siswa, dan event yang bersifat publik dapat memiliki audience berbeda. Payload hanya menyertakan data yang boleh dilihat penerima.

## Beban dan batasan

Implementasi perlu mempertimbangkan:

- jumlah koneksi simultan pada satu sesi;
- frekuensi event aktivitas;
- ukuran payload;
- jumlah event yang perlu disimpan;
- perilaku ketika banyak siswa mengirim respons bersamaan;
- perbedaan kapasitas server cloud dan server lokal.

Perubahan pointer atau animasi berfrekuensi tinggi tidak dikirim sebagai event kelas kecuali ada kebutuhan pembelajaran yang jelas.

## Keamanan

- Handshake memeriksa konteks akses.
- Server memvalidasi setiap event dari client.
- Channel memiliki batas sesi.
- Data pribadi tidak disiarkan ke audience yang tidak memerlukannya.
- Koneksi cloud menggunakan transport aman.
- Reconnect tidak memperpanjang izin yang sudah kedaluwarsa.

## Kriteria penerimaan

- Guru dapat memulai dan menjeda aktivitas yang membutuhkan pembaruan langsung.
- Peserta menerima perubahan status sesi dalam waktu yang sesuai konteks kelas.
- Submission tetap aman ketika WebSocket putus.
- Klien dapat reconnect dan memperoleh status terbaru.
- Pengguna tidak dapat membaca event dari sesi lain.
- Sesi lokal dan cloud mengikuti event model yang dapat dijelaskan.

## Pertanyaan terbuka

- Event mana yang benar-benar memerlukan real-time pada MVP?
- Apakah server menyimpan seluruh event atau hanya event penting?
- Strategi reconnect dan batas percobaan yang digunakan.
- Apakah fallback memakai polling, refresh manual, atau hanya status offline?
- Target jumlah koneksi simultan pada server lokal.

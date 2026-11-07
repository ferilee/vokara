# Aturan dokumentasi

**Status:** accepted  
**Pemilik:** tim proyek Vokara  
**Terakhir diperbarui:** 2026-10-13

## Tujuan

Dokumentasi proyek menjadi sumber pemahaman bersama tentang produk, keputusan, istilah, arsitektur, dan rencana kerja. Dokumentasi harus membantu pengambilan keputusan dan pelaksanaan proyek, bukan sekadar mencatat semua hal yang pernah dibahas.

## Struktur dokumentasi

Dokumen dikelompokkan berdasarkan domain dan urutan pembahasan:

```text
docs/
├── 00-governance/       # Aturan dokumentasi, istilah, dan keputusan
├── 01-product/          # Tujuan produk, pengguna, dan ruang lingkup
├── 02-access/           # Peran, izin, dan akses kelas
├── 03-content/          # Kurikulum, aktivitas, dan authoring konten
├── 04-offline-and-sync/ # Offline, server lokal, dan sinkronisasi
├── 05-architecture/     # Arsitektur teknis dan deployment
└── 06-planning/         # Roadmap, validasi, dan pertanyaan terbuka
```

Angka di awal folder menunjukkan urutan konteks, bukan urutan wajib pengerjaan. Dokumen harus ditempatkan berdasarkan subjek yang dibahas, bukan berdasarkan siapa yang menulisnya.

## Jenis dokumen

- **Overview:** menjelaskan tujuan, konteks, dan batasan suatu area.
- **Specification:** menjelaskan perilaku, kontrak, atau struktur yang harus diikuti.
- **Decision record:** mencatat keputusan, alasan, alternatif, dan dampaknya.
- **Glossary:** menetapkan arti istilah yang dipakai bersama.
- **Plan:** menjelaskan urutan kerja atau kriteria penyelesaian.

Satu dokumen boleh merujuk ke dokumen lain, tetapi tidak boleh menyembunyikan keputusan penting hanya melalui tautan. Ringkasan keputusan harus tetap terlihat pada dokumen yang bergantung padanya.

## Format dan penamaan

- Gunakan Markdown dengan judul tingkat satu sebagai judul dokumen.
- Gunakan bahasa Indonesia untuk penjelasan utama. Pertahankan istilah teknis yang sudah lazim jika terjemahannya membuat makna menjadi kabur.
- Gunakan nama file huruf kecil dengan tanda hubung, misalnya `offline-strategy.md`.
- Gunakan tabel untuk perbandingan dan daftar untuk pilihan atau kriteria.
- Gunakan diagram hanya jika hubungan antarbagian lebih mudah dipahami secara visual.
- Gunakan tanggal format `YYYY-MM-DD`.
- Hindari memasukkan rahasia, token, password, data pribadi nyata, atau kredensial ke dalam dokumentasi.

## Status dokumen

Setiap dokumen yang memuat aturan, kontrak, atau keputusan harus menyatakan statusnya:

- `draft`: sedang disusun dan belum menjadi acuan.
- `proposed`: siap ditinjau, tetapi masih dapat berubah.
- `accepted`: disepakati dan menjadi acuan proyek.
- `deprecated`: pernah berlaku, tetapi sudah digantikan.

Dokumen `deprecated` dipertahankan jika masih berguna untuk memahami sejarah keputusan. Tambahkan tautan ke dokumen penggantinya.

## Perubahan dokumentasi

Saat mengubah keputusan atau kontrak yang sudah `accepted`:

1. Jelaskan alasan perubahan.
2. Perbarui dokumen yang terdampak.
3. Tambahkan atau perbarui decision record.
4. Periksa tautan, istilah, dan contoh yang mungkin sudah tidak sesuai.

Dokumen harus diperbarui ketika keputusan berubah, bukan hanya ketika implementasi selesai. Jika dokumentasi dan implementasi berbeda, tandai perbedaannya secara eksplisit sampai salah satunya diperbaiki.

## Cara menangani pertanyaan terbuka

Pertanyaan yang belum memiliki jawaban disimpan sebagai bagian `Pertanyaan terbuka` pada dokumen yang relevan atau di `docs/06-planning/open-questions.md` setelah folder tersebut dibuat.

Setiap pertanyaan terbuka sebaiknya memiliki:

- pertanyaan yang jelas;
- konteks dan dampak jika dibiarkan;
- pihak atau keputusan yang diperlukan;
- statusnya.

Jangan menulis pilihan yang belum diputuskan seolah-olah sudah menjadi aturan proyek.

## Kriteria dokumentasi yang baik

Dokumen dianggap siap digunakan jika:

- tujuan dan ruang lingkupnya jelas;
- pembaca dapat memahami keputusan tanpa membaca seluruh riwayat percakapan;
- istilah penting memiliki definisi yang konsisten;
- keputusan yang belum final terlihat jelas;
- tautan antar dokumen dapat diikuti;
- tidak berisi rahasia atau data sensitif.

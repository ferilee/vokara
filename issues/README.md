# Issue MVP Vokara

**Status:** proposed  
**Terakhir diperbarui:** 2026-10-13

Issue di folder ini adalah backlog lokal untuk MVP. Setiap issue berisi vertical slice yang dapat didemokan atau diverifikasi sendiri, kecuali `000` yang merupakan decision gate wajib sebelum implementasi.

## Urutan kerja

```text
000 Keputusan pilot P0
 └── 001 Fondasi, cloud baseline, dan perangkat
      └── 002 Katalog + kuis tracer
           ├── 003 Papan tulis
           ├── 004 Grafik fungsi
           └── 005 Buat sesi + join
                └── 006 Submission + rekap
                     ├── 007 Offline prepare + resume
                     │    └── 008 Outbox + sinkronisasi
                     └── 009 Server lokal kelas
                          └── 010 Sinkronisasi lokal ke cloud
                               └── 011 Kesiapan pilot MVP
```

Issue `003` dan `004` dapat dikerjakan paralel setelah `002`. Issue `007` dan `009` dapat dimulai setelah kontrak submission pada `006` stabil, tetapi issue `009` tidak boleh mengasumsikan sinkronisasi cloud sudah tersedia.

## Pembagian tiga agent

| Agent | Ownership awal | Tanggung jawab tambahan |
| --- | --- | --- |
| Agent utama | `000`, `001`, `011` | Menjaga keputusan, integrasi, review, dan release gate. |
| Agent konten | `002`, `003`, `004` | Menjaga Activity SDK dan kualitas tiga aktivitas percontohan. |
| Agent kelas/offline | `005`–`010` | Menjaga kontrak sesi, submission, offline, server lokal, dan sinkronisasi. |

Agent utama harus meninjau perubahan kontrak Activity SDK, data, API, dan offline sebelum issue dependen dimulai.

## Aturan pengerjaan

- Issue hanya dapat dimulai jika semua blocker selesai atau asumsi tertulis telah disetujui.
- Setiap issue menyertakan bukti pengujian yang sesuai: otomatis, API/integrasi, atau perangkat nyata.
- Perubahan keputusan lintas domain harus memperbarui decision record dan dokumen arsitektur terkait.
- Temuan baru yang tidak termasuk scope issue dicatat sebagai issue baru atau pertanyaan terbuka.
- Penyelesaian issue berarti acceptance criteria terpenuhi dan bukti hasilnya dicatat, bukan hanya perubahan kode sudah ada.

## Daftar issue

| ID | Issue | Prioritas | Blocker utama |
| --- | --- | --- | --- |
| 000 | [Keputusan pilot P0](./000-pilot-decision-gate.md) | Accepted | — |
| 001 | [Fondasi, cloud baseline, dan perangkat](./001-foundation-cloud-and-device-baseline.md) | P0 | 000 |
| 002 | [Katalog aktivitas dan kuis tracer](./002-activity-catalog-and-quiz-tracer.md) | P0 | 001 |
| 003 | [Papan tulis matematika](./003-math-whiteboard.md) | P0 | 002 |
| 004 | [Eksplorasi grafik fungsi](./004-function-graph-exploration.md) | P0 | 002 |
| 005 | [Membuat sesi dan join siswa](./005-session-create-and-student-join.md) | P0 | 002, 000 |
| 006 | [Submission dan rekap sesi](./006-session-submission-and-results.md) | P0 | 005 |
| 007 | [Persiapan offline dan pemulihan progres](./007-offline-preparation-and-resume.md) | P0 | 002, 006 |
| 008 | [Outbox dan sinkronisasi idempotent](./008-outbox-and-idempotent-sync.md) | P0 | 006, 007 |
| 009 | [Server lokal untuk kelas offline](./009-local-server-offline-class.md) | P0 | 006, 007 |
| 010 | [Sinkronisasi server lokal ke cloud](./010-local-to-cloud-sync.md) | P0 | 008, 009 |
| 011 | [Kesiapan pilot MVP](./011-mvp-pilot-readiness.md) | P0 | 003, 004, 006, 008, 009, 010 |

## Implementation packet wajib

Setiap issue P0 harus menjelaskan konteks, keputusan yang sudah terkunci, kontrak yang terdampak, failure case, bukti pengujian, definition of done, dan rencana rollout atau rollback bila data maupun deployment berubah. Agent tidak boleh mengganti keputusan yang terkunci tanpa decision record baru.

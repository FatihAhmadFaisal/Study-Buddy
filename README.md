# AI Study Buddy — v6

Ubah catatan kuliah menjadi **flashcard 3D**, **kuis pilihan ganda**, dan **kuis True / False** langsung di browser. Tidak ada backend; semua pemrosesan berjalan lokal.

## Fitur

- **Flashcard otomatis** — catatan dipecah menjadi kartu definisi dan kartu isian rumpang, lengkap dengan animasi balik 3D.
- **Kuis pilihan ganda** — hingga 8 soal campuran, pembahasan jawaban, skor otomatis, dan daftar materi untuk diulang.
- **Kuis True / False** — pernyataan disusun dari pasangan istilah–penjelasan. Dengan 3 pasangan atau lebih, minimal 2 pernyataan bernilai benar dan sisanya acak; dengan kurang dari 3 pasangan, kombinasi benar/salah dibuat murni acak. Ada feedback instan dan skor akhir.
- **Streak & konfeti** — kuis pilihan ganda dan True / False menampilkan indikator api 🔥 saat jawaban benar beruntun mencapai 2 atau lebih. Streak kembali ke 0 saat jawaban salah, kuis direset/diacak, atau kuis selesai. Skor akhir minimal 80% memicu animasi konfeti di layar hasil.
- **Acak kartu & kuis** — tombol shuffle mengacak urutan flashcard; pada kuis pilihan ganda dan True / False, progres (skor, jawaban, indeks, streak) direset lalu soal serta kombinasi T/F dibuat ulang.
- **Dua bahasa (ID/EN)** — seluruh antarmuka berganti bahasa lewat toggle di header, termasuk label aksesibilitas streak dan pesan selebrasi. Pilihan bahasa diingat.
- **Auto-save** — catatan tersimpan otomatis di `localStorage`; saat halaman dibuka kembali, kartu dan kuis dibuat ulang otomatis.
- **Hapus catatan** — tombol reset dua langkah untuk membersihkan catatan dan penyimpanan lokal.
- **Ekspor & impor file** — unduh catatan beserta hasil kartu/kuis sebagai JSON, lalu muat kembali file JSON atau TXT kapan saja.

## Cara menjalankan

Buka `index.html` di browser. Koneksi internet diperlukan untuk Tailwind CSS (CDN) dan Google Fonts.

Untuk pengalaman terbaik (dan agar `localStorage` konsisten), jalankan server statis lokal:

```bash
python -m http.server 8000
```

Lalu buka `http://127.0.0.1:8000`.

## Struktur file

| File | Isi |
| --- | --- |
| `index.html` | Struktur halaman, panel input, flashcard, kuis pilihan ganda, kuis True / False, dan tombol penyimpanan |
| `style.css` | Gaya kustom: panel, tombol, kartu 3D, kuis, pilihan benar/salah, streak, konfeti, status simpan |
| `app.js` | Parsing catatan, penyusunan kartu/kuis/TF, streak, konfeti, i18n, auto-save, ekspor/impor |

## Format catatan

Satu poin per baris. Baris dengan titik dua menjadi kartu definisi:

```text
Overfitting terjadi ketika model terlalu hafal data latih.
Neural network: jaringan saraf tiruan berlapis neuron buatan.
```

Baris tanpa titik dua otomatis menjadi kartu isian rumpang. Minimal dua poin agar kuis bisa dibuat. Kuis True / False membutuhkan minimal dua pasangan `Istilah: penjelasan`.

## Penyimpanan

- `ai-study-buddy.notes` — catatan terakhir (JSON `{ version, text, updatedAt }`)
- `ai-study-buddy.lang` — preferensi bahasa (`id` atau `en`)

File ekspor berisi `notes`, `cards`, `quiz`, `trueFalse`, dan `summary` (jumlah kartu/soal, jawaban terisi, skor, serta jumlah soal True / False).

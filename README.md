# AI Study Buddy — v3

Ubah catatan kuliah menjadi **flashcard 3D** dan **kuis pilihan ganda** langsung di browser. Tidak ada backend; semua pemrosesan berjalan lokal.

## Fitur

- **Flashcard otomatis** — catatan dipecah menjadi kartu definisi dan kartu isian rumpang, lengkap dengan animasi balik 3D.
- **Kuis pilihan ganda** — hingga 8 soal campuran, pembahasan jawaban, skor otomatis, dan daftar materi untuk diulang.
- **Dua bahasa (ID/EN)** — seluruh antarmuka berganti bahasa lewat toggle di header. Pilihan bahasa diingat.
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
| `index.html` | Struktur halaman, panel input, flashcard, kuis, dan tombol penyimpanan |
| `style.css` | Gaya kustom: panel, tombol, kartu 3D, kuis, status simpan |
| `app.js` | Parsing catatan, penyusunan kartu/kuis, i18n, auto-save, ekspor/impor |

## Format catatan

Satu poin per baris. Baris dengan titik dua menjadi kartu definisi:

```text
Overfitting terjadi ketika model terlalu hafal data latih.
Neural network: jaringan saraf tiruan berlapis neuron buatan.
```

Baris tanpa titik dua otomatis menjadi kartu isian rumpang. Minimal dua poin agar kuis bisa dibuat.

## Penyimpanan

- `ai-study-buddy.notes` — catatan terakhir (JSON `{ version, text, updatedAt }`)
- `ai-study-buddy.lang` — preferensi bahasa (`id` atau `en`)

File ekspor berisi `notes`, `cards`, `quiz`, dan `summary` (jumlah kartu/soal, jawaban terisi, serta skor).

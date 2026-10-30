# AI Study Buddy — v8.6

Ubah catatan kuliah menjadi **flashcard 3D**, **kuis pilihan ganda**, dan **kuis True / False** langsung di browser. Tidak ada backend; semua pemrosesan berjalan lokal.

## Fitur

- **Dua mode input yang terpisah** — pilih **Tempel Teks** untuk menulis catatan bebas, atau **Formulir Soal** untuk mengisi istilah dan penjelasan satu per satu. Kedua mode tidak pernah aktif bersamaan, dan tombol **Buat Flashcard & Kuis** hanya membaca mode yang sedang aktif.
- **Formulir soal terstruktur** — tombol **Tambahkan Soal** menambahkan baris bernomor baru. Setiap baris memiliki kolom **Term / Istilah / Pertanyaan** dan **Explanation / Penjelasan / Jawaban** yang tersusun vertikal. Baris bisa dihapus, dan formulir menampilkan jumlah soal yang sudah lengkap.
- **Validasi formulir** — baris kosong diabaikan, tetapi baris yang baru terisi separuh ditandai. Materi baru bisa dibuat jika ada minimal dua baris lengkap dengan istilah yang unik; penjelasan boleh sama antar soal.
- **Flashcard otomatis** — catatan tempel dipecah menjadi kartu definisi dan kartu isian rumpang. Kartu dari formulir terstruktur selalu berupa kartu definisi, menampilkan istilah secara langsung di sisi depan, dan tidak memakai soal rumpang.
- **Kuis pilihan ganda** — setiap baris valid menjadi satu soal tanpa batas 8 soal. Setiap nomor berisi satu jawaban benar dan hingga tiga pengecoh unik; opsi kembar dan pengecoh yang sama dengan jawaban benar otomatis dibuang. Urutan soal dan susunan opsi mengikuti urutan input, tetapi posisi jawaban benar (A–D) diacak. Pengacakan urutan soal dan opsi secara menyeluruh hanya terjadi ketika tombol **Acak Kuis** diklik. Tersedia pembahasan jawaban, skor otomatis, dan daftar materi untuk diulang.
- **Posisi jawaban benar yang bervariasi** — meski **Acak Kuis** tidak dipakai, posisi jawaban benar disebar acak dan merata di antara pilihan A–D, sehingga tidak membentuk pola tetap seperti 1=A, 2=B, 3=C, 4=D. Posisi diacak ulang setiap kali kuis dibuat, diulang, atau halaman dimuat kembali, jadi tidak selalu sama dengan sesi sebelumnya. Pengecoh tetap unik dan jawaban benar tidak pernah hilang.
- **Kuis True / False** — pernyataan disusun dari pasangan istilah–penjelasan dengan urutan mengikuti input dan pola benar/salah yang seimbang. Setiap penjelasan milik istilah lain hanya dipakai sekali sebagai pengecoh dalam satu sesi, sedangkan jawaban asli pada pernyataan benar tetap boleh tampil. Tombol **Acak T/F** membuat kombinasi, pengecoh, serta urutan pernyataan acak dengan aturan yang sama. Ada feedback instan dan skor akhir.
- **Pengecoh T/F unik** — satu penjelasan tidak bisa menjadi pasangan salah dua kali dalam sesi T/F yang sama. Bila tidak ada penjelasan lain yang tersisa, soal otomatis tampil sebagai pernyataan benar. Jumlah pernyataan Benar dan Salah juga dijaga hampir seimbang, dengan selisih maksimal satu pernyataan.
- **Streak & konfeti** — kuis pilihan ganda dan True / False menampilkan indikator api 🔥 saat jawaban benar beruntun mencapai 2 atau lebih. Streak kembali ke 0 saat jawaban salah, kuis direset/diacak, atau kuis selesai. Skor akhir minimal 80% memicu animasi konfeti di layar hasil.
- **Acak kartu & kuis** — tombol shuffle mengacak urutan flashcard. Pada kuis pilihan ganda dan True / False, materi yang baru dibuat atau diulang tetap memakai urutan input. Urutan soal, susunan opsi, dan kombinasi T/F diacak penuh hanya saat tombol **Acak** diklik; khusus MCQ, posisi jawaban benar tetap diacak setiap kali kuis disusun. Progres (skor, jawaban, indeks, streak) direset, lalu kuis dimulai dari soal pertama.
- **Pintasan lanjut soal** — setelah menjawab soal pilihan ganda atau True / False, tekan **→** (`ArrowRight`) untuk langsung lanjut tanpa mengklik tombol Next. Hanya panah kanan yang memicu aksi ini; panah kiri/atas/bawah dan tombol lain tidak melompatkan soal. Pintasan nonaktif sebelum jawaban dipilih, saat mengetik di kolom input, atau saat menu timer terbuka.
- **Gulir area input dengan keyboard** — klik area **Tempel Teks** atau **Formulir Soal** (termasuk kotak teks dan kolom isian di dalamnya), lalu tekan **↑** / **↓** untuk menggulir isi area secara mulus ketika materinya panjang. Panah atas/bawah hanya bekerja di area input yang sedang aktif dan tidak mengganggu navigasi flashcard maupun pintasan **→** di kuis. Di dalam kotak teks, kursor tetap bisa dipindah lewat klik, Home/End, atau Shift + panah.
- **Timer kuis interaktif** — tombol ikon jam di kiri tombol Acak pada kuis pilihan ganda dan True / False membuka pilihan durasi 5, 10, 30, atau 60 detik. Cincin melingkar di sekitar ikon menyusut sesuai sisa waktu. Timer memulai ulang penuh di setiap soal; jika waktu habis, soal dianggap salah, umpan balik ditampilkan, lalu kuis otomatis lanjut ke soal berikutnya atau ke layar hasil. Tombol Acak/Ulangi dan perpindahan tab mematikan serta mereset timer.
- **Dua bahasa (ID/EN)** — seluruh antarmuka berganti bahasa lewat toggle di header, termasuk label formulir, tips per mode, label aksesibilitas streak, label timer, dan pesan selebrasi. Pilihan bahasa diingat.
- **Auto-save** — catatan dan formulir tersimpan otomatis di `localStorage`, termasuk mode input yang sedang aktif. Saat halaman dibuka kembali, materi dari mode aktif dibuat ulang otomatis.
- **Hapus semua** — tombol reset dua langkah untuk membersihkan catatan, formulir, materi belajar, dan penyimpanan lokal.
- **Ekspor & impor file** — unduh kedua mode input beserta hasil kartu/kuis sebagai JSON, lalu muat kembali file JSON atau TXT kapan saja. File ekspor v7 tetap bisa diimpor.

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
| `index.html` | Struktur halaman, tab mode input, formulir soal dinamis, flashcard, kuis pilihan ganda, kuis True / False, kontrol timer, dan tombol penyimpanan |
| `style.css` | Gaya kustom: panel, tab mode, baris formulir, tombol, kartu 3D, kuis, pilihan benar/salah, streak, cincin timer, konfeti, status simpan |
| `app.js` | Parsing catatan, formulir terstruktur, validasi, penyusunan kartu/kuis/TF, pengacakan lewat tombol Acak, timer kuis, streak, konfeti, i18n, auto-save, ekspor/impor |

## Format input

### Tempel teks

Satu poin per baris. Baris dengan titik dua menjadi kartu definisi:

```text
Overfitting terjadi ketika model terlalu hafal data latih.
Neural network: jaringan saraf tiruan berlapis neuron buatan.
```

Baris tanpa titik dua otomatis menjadi kartu isian rumpang. Pasangan singkat seperti `DB: Basis data` atau `Kata: Penjelasan` tetap dikenali sebagai kartu definisi. Minimal dua poin agar kuis bisa dibuat.

### Formulir soal

Isi minimal dua baris lengkap:

| Term / Istilah / Pertanyaan | Explanation / Penjelasan / Jawaban |
| --- | --- |
| Overfitting | Model terlalu hafal data latih sehingga buruk pada data baru. |
| Regularisasi | Teknik mengurangi overfitting dengan memberi penalti pada model yang kompleks. |

Setiap baris lengkap menjadi satu kartu definisi, lalu dipakai untuk menyusun soal pilihan ganda dan pernyataan True / False. Istilah harus unik, tetapi beberapa soal boleh memiliki penjelasan yang sama. Baris kosong boleh ditinggal, tetapi baris yang hanya terisi salah satu kolom akan ditandai dan harus dilengkapi atau dikosongkan.

## Penyimpanan

- `ai-study-buddy.notes` — data terakhir dalam format JSON `{ version: 4, inputMode, notes, structured, updatedAt }`
  - `inputMode`: `"paste"` atau `"structured"`
  - `notes`: isi mode tempel teks
  - `structured`: array `{ term, explanation }`
- `ai-study-buddy.lang` — preferensi bahasa (`id` atau `en`)

File ekspor memakai skema **versi 8** dan berisi `inputMode`, `notes`, `structured`, `cards`, `quiz`, `trueFalse`, serta `summary` (jumlah kartu/soal, jawaban terisi, skor, jumlah soal True / False, dan jumlah baris terstruktur yang lengkap). Setiap kartu menyertakan `sourceMode` (`paste` atau `structured`), dan setiap soal kuis menyertakan status `timedOut`.

Saat impor:

- file JSON v8 memulihkan kedua kumpulan data dan mode input yang tersimpan;
- file JSON v7 atau file TXT membuka mode **Tempel Teks** (data formulir yang sudah ada tidak dihapus);
- materi langsung dibuat dari mode yang aktif setelah impor.

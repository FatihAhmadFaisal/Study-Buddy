# AI Study Buddy — v10.0 (Final Release)

Ubah catatan kuliah menjadi **flashcard 3D**, **kuis pilihan ganda**, dan **kuis True / False** langsung di browser. Tidak ada backend; semua pemrosesan berjalan lokal.

Versi 10.0 adalah rilis final: seluruh fitur v9.1 tetap dipertahankan, ditambah **pemilih warna aksen** yang bisa diganti kapan saja dan diingat antar sesi.

## Fitur

- **Dua mode input yang terpisah** — pilih **Tempel Teks** untuk menulis catatan bebas, atau **Formulir Soal** untuk mengisi istilah dan penjelasan satu per satu. Kedua mode tidak pernah aktif bersamaan, dan tombol **Buat Flashcard & Kuis** hanya membaca mode yang sedang aktif.
- **Formulir soal terstruktur dengan foto** — tombol **Tambahkan Soal** menambahkan baris bernomor baru. Setiap baris memiliki kolom **Term / Istilah / Pertanyaan** dan **Explanation / Penjelasan / Jawaban** yang tersusun vertikal. Di samping setiap kolom ada tombol **Foto**; klik untuk memilih gambar dari perangkat atau seret file langsung ke kolomnya. Setiap kolom boleh berisi teks saja, foto saja, atau teks dan foto sekaligus. Baris bisa dihapus, dan formulir menampilkan jumlah soal yang sudah lengkap.
- **Kompresi foto otomatis** — sebelum disimpan sebagai Base64, gambar diperkecil (maksimal 1024 px) dan dikonversi ke JPEG dengan kualitas sekitar 0,72. Ukurannya terus diturunkan bila masih terlalu besar, dengan target di bawah 180 KB per foto. Pratinjau foto tampil di formulir dan bisa dihapus kapan saja tanpa menghapus teksnya. Jika penyimpanan browser penuh, aplikasi menampilkan peringatan agar beberapa foto dihapus.
- **Validasi formulir** — baris kosong diabaikan, tetapi baris yang baru terisi separuh ditandai. Sebuah kolom dianggap terisi jika ada teks atau fotonya. Materi baru bisa dibuat jika ada minimal dua baris lengkap. Istilah boleh sama antar baris selama foto pertanyaan atau jawabannya berbeda; hanya soal yang benar-benar kembar (pertanyaan dan jawaban sama persis) yang ditolak.
- **Flashcard otomatis** — catatan tempel dipecah menjadi kartu definisi dan kartu isian rumpang. Kartu dari formulir terstruktur selalu berupa kartu definisi, menampilkan istilah dan fotonya secara langsung di sisi depan, lalu penjelasan beserta fotonya di sisi belakang, dan tidak memakai soal rumpang.
- **Kuis pilihan ganda** — setiap baris valid menjadi satu soal tanpa batas 8 soal. Setiap nomor berisi satu jawaban benar dan hingga tiga pengecoh unik; opsi kembar (teks dan foto sama) dan pengecoh yang sama dengan jawaban benar otomatis dibuang. Opsi dan pembahasan ikut menampilkan foto bila ada, sehingga soal dengan teks, foto, atau keduanya tetap terbaca. Urutan soal dan susunan opsi mengikuti urutan input, tetapi posisi jawaban benar (A–D) diacak. Pengacakan urutan soal dan opsi secara menyeluruh hanya terjadi ketika tombol **Acak Kuis** diklik. Tersedia pembahasan jawaban, skor otomatis, dan daftar materi untuk diulang.
- **Posisi jawaban benar yang bervariasi** — meski **Acak Kuis** tidak dipakai, posisi jawaban benar disebar acak dan merata di antara pilihan A–D, sehingga tidak membentuk pola tetap seperti 1=A, 2=B, 3=C, 4=D. Posisi diacak ulang setiap kali kuis dibuat, diulang, atau halaman dimuat kembali, jadi tidak selalu sama dengan sesi sebelumnya. Pengecoh tetap unik dan jawaban benar tidak pernah hilang.
- **Kuis True / False** — pernyataan disusun dari pasangan istilah–penjelasan dengan urutan mengikuti input dan pola benar/salah yang seimbang. Setiap pernyataan menampilkan teks dan/atau foto secara proporsional. Setiap penjelasan milik istilah lain hanya dipakai sekali sebagai pengecoh dalam satu sesi, sedangkan jawaban asli pada pernyataan benar tetap boleh tampil. Tombol **Acak T/F** membuat kombinasi, pengecoh, serta urutan pernyataan acak dengan aturan yang sama. Ada feedback instan dan skor akhir.
- **Pengecoh T/F unik** — satu penjelasan tidak bisa menjadi pasangan salah dua kali dalam sesi T/F yang sama. Bila tidak ada penjelasan lain yang tersisa, soal otomatis tampil sebagai pernyataan benar. Jumlah pernyataan Benar dan Salah juga dijaga hampir seimbang, dengan selisih maksimal satu pernyataan.
- **Streak & konfeti** — kuis pilihan ganda dan True / False menampilkan indikator api 🔥 saat jawaban benar beruntun mencapai 2 atau lebih. Streak kembali ke 0 saat jawaban salah, kuis direset/diacak, atau kuis selesai. Skor akhir minimal 80% memicu animasi konfeti di layar hasil.
- **Acak kartu & kuis** — tombol shuffle mengacak urutan flashcard. Pada kuis pilihan ganda dan True / False, materi yang baru dibuat atau diulang tetap memakai urutan input. Urutan soal, susunan opsi, dan kombinasi T/F diacak penuh hanya saat tombol **Acak** diklik; khusus MCQ, posisi jawaban benar tetap diacak setiap kali kuis disusun. Progres (skor, jawaban, indeks, streak) direset, lalu kuis dimulai dari soal pertama.
- **Pintasan lanjut soal** — setelah menjawab soal pilihan ganda atau True / False, tekan **→** (`ArrowRight`) untuk langsung lanjut tanpa mengklik tombol Next. Hanya panah kanan yang memicu aksi ini; panah kiri/atas/bawah dan tombol lain tidak melompatkan soal. Pintasan nonaktif sebelum jawaban dipilih, saat mengetik di kolom input, atau saat menu timer/tema terbuka.
- **Gulir area input dengan keyboard** — klik area **Tempel Teks** atau **Formulir Soal** (termasuk kotak teks dan kolom isian di dalamnya), lalu tekan **↑** / **↓** untuk menggulir isi area secara mulus ketika materinya panjang. Panah atas/bawah hanya bekerja di area input yang sedang aktif dan tidak mengganggu navigasi flashcard maupun pintasan **→** di kuis. Di dalam kotak teks, kursor tetap bisa dipindah lewat klik, Home/End, atau Shift + panah.
- **Timer kuis interaktif** — tombol ikon jam di kiri tombol Acak pada kuis pilihan ganda dan True / False membuka pilihan durasi 5, 10, 30, atau 60 detik. Cincin melingkar di sekitar ikon menyusut sesuai sisa waktu. Timer memulai ulang penuh di setiap soal; jika waktu habis, soal dianggap salah, umpan balik ditampilkan, lalu kuis otomatis lanjut ke soal berikutnya atau ke layar hasil. Tombol Acak/Ulangi dan perpindahan tab mematikan serta mereset timer.
- **Dua bahasa (ID/EN)** — seluruh antarmuka berganti bahasa lewat toggle di header, termasuk label formulir, tips per mode, label aksesibilitas streak, label timer, dan pesan selebrasi. Pilihan bahasa diingat.
- **Pemilih warna aksen (v10)** — tombol palet di header, tepat di samping toggle ID/EN, membuka menu berisi 14 warna: **Biru** (default), **Merah**, **Orange**, **Hijau**, **Kuning**, **Pink**, **Hitam**, **Ungu**, **Coklat**, **Abu-abu**, **Hijau Gelap**, **Cyan**, **Teal**, dan **Zaitun**. Warna langsung diterapkan saat opsi diklik tanpa memuat ulang halaman. Yang berubah hanya warna aksen — tombol aktif, lencana, progress bar, tombol utama, tab, tautan, dan sorotan formulir — sedangkan latar putih dan warna netral tetap seperti semula. Pilihan disimpan di `localStorage` dan dipulihkan sebelum halaman selesai dimuat agar tidak berkedip. Menu mendukung klik, sentuhan, serta navigasi keyboard (panah, Home, End, Escape).
- **Auto-save** — catatan, formulir, dan foto tersimpan otomatis di `localStorage`, termasuk mode input yang sedang aktif. Saat halaman dibuka kembali, materi dari mode aktif dibuat ulang otomatis.
- **Hapus semua** — tombol reset dua langkah untuk membersihkan catatan, formulir, foto, materi belajar, dan penyimpanan lokal.
- **Ekspor & impor file** — unduh kedua mode input beserta foto dan hasil kartu/kuis sebagai JSON, lalu muat kembali file JSON atau TXT kapan saja. File ekspor v7 dan v8 tetap bisa diimpor.

## Tema warna aksen

Warna aksen diatur lewat tombol palet di header. Perubahan berlaku instan dan hanya menyentuh elemen beraksen, bukan latar utama:

| Nama | ID tema | Nama | ID tema |
| --- | --- | --- | --- |
| Biru (default) | `blue` | Coklat | `brown` |
| Merah | `red` | Abu-abu | `gray` |
| Orange | `orange` | Hijau Gelap | `dark-green` |
| Hijau | `green` | Cyan | `cyan` |
| Kuning | `yellow` | Teal | `teal` |
| Pink | `pink` | Zaitun | `olive` |
| Hitam | `black` | Ungu | `purple` |

Preferensi disimpan di `localStorage` dengan kunci `ai-study-buddy.theme`. Skrip kecil di `<head>` menerapkan tema tersimpan sebelum stylesheet dimuat, sehingga warna tidak berkedip saat halaman dibuka kembali. Untuk kembali ke tampilan awal, pilih **Biru**.

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
| `index.html` | Struktur halaman, tab mode input, formulir soal dinamis, flashcard, kuis pilihan ganda, kuis True / False, kontrol timer, pemilih warna aksen, dan tombol penyimpanan |
| `style.css` | Gaya kustom: token warna aksen dan 14 tema, panel, tab mode, baris formulir, kontrol foto, tombol, kartu 3D, kuis, pilihan benar/salah, streak, cincin timer, konfeti, status simpan |
| `app.js` | Parsing catatan, formulir terstruktur, unggah dan kompresi foto, validasi, penyusunan kartu/kuis/TF, pengacakan lewat tombol Acak, timer kuis, streak, konfeti, i18n, tema aksen, auto-save, ekspor/impor |

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

Setiap baris lengkap menjadi satu kartu definisi, lalu dipakai untuk menyusun soal pilihan ganda dan pernyataan True / False. Istilah boleh sama asalkan foto pertanyaan atau jawabannya berbeda, sehingga dua soal dengan teks yang sama tetap tampil sebagai kartu dan soal terpisah. Hanya baris yang benar-benar kembar (pertanyaan dan jawaban sama persis) yang ditolak. Beberapa soal juga boleh memiliki penjelasan yang sama. Baris kosong boleh ditinggal, tetapi baris yang hanya terisi salah satu kolom akan ditandai dan harus dilengkapi atau dikosongkan.

### Foto pada formulir soal

Setiap kolom punya tombol **Foto** dan area yang menerima seret-lepas (*drag & drop*). Foto bisa dipakai sebagai pengganti teks atau sebagai pelengkap:

| Term / Istilah / Pertanyaan | Explanation / Penjelasan / Jawaban |
| --- | --- |
| `Overfitting` + foto kurva | Model terlalu hafal data latih. |
| Foto diagram arsitektur | Foto arsitektur jaringan + keterangan singkat. |
| Foto istilah | Foto penjelasan |

Aturan yang berlaku:

- teks saja, foto saja, atau teks + foto sama-sama valid;
- istilah boleh sama selama foto pertanyaan atau jawabannya berbeda — hanya baris yang benar-benar kembar (pertanyaan dan jawaban sama) yang ditolak;
- foto dikompres otomatis ke JPEG (maksimal 1024 px, target < 180 KB) sebelum menjadi Base64;
- pratinjau foto bisa dihapus lewat tombol × tanpa mengubah teks di kolom yang sama.

## Penyimpanan

- `ai-study-buddy.notes` — data terakhir dalam format JSON `{ version: 5, inputMode, notes, structured, updatedAt }`
  - `inputMode`: `"paste"` atau `"structured"`
  - `notes`: isi mode tempel teks
  - `structured`: array `{ term, explanation, termImage, explanationImage }`; field gambar berisi data URL Base64 atau string kosong
- `ai-study-buddy.lang` — preferensi bahasa (`id` atau `en`)
- `ai-study-buddy.theme` — preferensi warna aksen (`blue`, `red`, `orange`, `green`, `yellow`, `pink`, `black`, `purple`, `brown`, `gray`, `dark-green`, `cyan`, `teal`, atau `olive`)

File ekspor memakai skema **versi 9** dan berisi `inputMode`, `notes`, `structured`, `cards`, `quiz`, `trueFalse`, serta `summary` (jumlah kartu/soal, jawaban terisi, skor, jumlah soal True / False, dan jumlah baris terstruktur yang lengkap). Setiap kartu, soal, opsi, dan pernyataan T/F menyertakan foto (`termImage`, `definitionImage`, `noteImage`, `correctTermImage`) bila ada. Setiap kartu menyertakan `sourceMode` (`paste` atau `structured`), dan setiap soal kuis menyertakan status `timedOut`. Ukuran file impor maksimal 12 MB agar ekspor berisi beberapa foto tetap bisa dimuat.

Saat impor:

- file JSON v9 memulihkan kedua kumpulan data, foto, dan mode input yang tersimpan;
- file JSON v7/v8 atau file TXT membuka mode **Tempel Teks** (data formulir yang sudah ada tidak dihapus);
- materi langsung dibuat dari mode yang aktif setelah impor.

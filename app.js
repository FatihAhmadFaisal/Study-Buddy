'use strict';

/* ============================================================
   AI Study Buddy
   ------------------------------------------------------------
   Alur kerja:
   1. Materi diambil dari mode input yang aktif saja: catatan
      tempel bebas atau formulir soal terstruktur.
   2. Setiap poin / baris dianalisis menjadi kartu.
   3. Kartu dipakai untuk menyusun kuis pilihan ganda dan T/F.
   Semua proses berjalan lokal di browser.
   ============================================================ */

const STOPWORDS = new Set([
  'yang', 'dan', 'atau', 'untuk', 'dengan', 'pada', 'dalam', 'dari', 'ke', 'di',
  'sebagai', 'oleh', 'ini', 'itu', 'adalah', 'ialah', 'merupakan', 'yaitu', 'yakni',
  'secara', 'agar', 'karena', 'jika', 'bila', 'juga', 'telah', 'akan', 'dapat',
  'the', 'a', 'an', 'of', 'to', 'in', 'is', 'are', 'and', 'or', 'for', 'with', 'by',
]);

// Kata kerja yang sering muncul setelah subjek; jangan dijadikan bagian frasa kunci.
const VERB_WORDS = new Set([
  'terjadi', 'membantu', 'mempelajari', 'memperbarui', 'menemukan', 'dimulai',
  'digunakan', 'dilakukan', 'membuat', 'menjadi', 'memiliki', 'berfungsi',
  'mengubah', 'menghasilkan', 'dihasilkan', 'meningkatkan', 'mengurangi',
  'menyebabkan', 'berpengaruh', 'terbentuk', 'terdiri', 'disebut', 'dilatih',
  'dipakai', 'mendapat', 'memberi', 'berisi', 'meliputi',
  'happens', 'occurs', 'means', 'helps', 'allows', 'enables', 'requires',
  'describes', 'refers', 'causes', 'improves', 'reduces', 'increases',
  'learns', 'predicts', 'uses', 'works', 'contains', 'includes',
]);

const SAMPLE_NOTES = `Machine Learning adalah cabang kecerdasan buatan yang memungkinkan sistem belajar dari data tanpa diprogram secara eksplisit.
Supervised learning: model dilatih memakai data berlabel untuk memprediksi hasil baru.
Unsupervised learning — model menemukan pola tersembunyi pada data tanpa label.
Overfitting terjadi ketika model terlalu hafal data latih sehingga performanya buruk pada data baru.
Regularisasi adalah teknik mengurangi overfitting dengan memberi penalti pada model yang terlalu kompleks.
Neural network: jaringan saraf tiruan yang tersusun dari lapisan neuron buatan.
Fungsi aktivasi ReLU membantu jaringan saraf mempelajari hubungan non-linear.
Gradient descent ialah algoritma optimasi yang memperbarui bobot model ke arah penurunan error.
Cross-validation adalah metode evaluasi model dengan membagi data menjadi beberapa lipatan.
Confusion matrix: tabel yang merangkum performa klasifikasi berdasarkan prediksi benar dan salah.`;

const SAMPLE_NOTES_EN = `Machine Learning is a branch of artificial intelligence that lets systems learn from data without explicit programming.
Supervised learning: a model is trained on labeled data to predict new outcomes.
Unsupervised learning — a model finds hidden patterns in unlabeled data.
Overfitting happens when a model memorizes the training data, hurting performance on new data.
Regularization is a technique that reduces overfitting by penalizing overly complex models.
Neural network: an artificial network built from layers of artificial neurons.
ReLU activation helps neural networks learn non-linear relationships.
Gradient descent is an optimization algorithm that updates model weights toward lower error.
Cross-validation is an evaluation method that splits data into several folds.
Confusion matrix: a table summarizing classification performance from correct and incorrect predictions.`;

const SAMPLE_STRUCTURED = [
  {
    term: 'Machine Learning',
    explanation: 'Cabang kecerdasan buatan yang memungkinkan sistem belajar dari data tanpa diprogram secara eksplisit.',
  },
  {
    term: 'Supervised learning',
    explanation: 'Model dilatih memakai data berlabel untuk memprediksi hasil baru.',
  },
  {
    term: 'Unsupervised learning',
    explanation: 'Model menemukan pola tersembunyi pada data tanpa label.',
  },
  {
    term: 'Overfitting',
    explanation: 'Model terlalu hafal data latih sehingga performanya buruk pada data baru.',
  },
  {
    term: 'Regularisasi',
    explanation: 'Teknik mengurangi overfitting dengan memberi penalti pada model yang terlalu kompleks.',
  },
  {
    term: 'Neural network',
    explanation: 'Jaringan saraf tiruan yang tersusun dari lapisan neuron buatan.',
  },
  {
    term: 'Fungsi aktivasi ReLU',
    explanation: 'Membantu jaringan saraf mempelajari hubungan non-linear.',
  },
  {
    term: 'Gradient descent',
    explanation: 'Algoritma optimasi yang memperbarui bobot model ke arah penurunan error.',
  },
  {
    term: 'Cross-validation',
    explanation: 'Metode evaluasi model dengan membagi data menjadi beberapa lipatan.',
  },
  {
    term: 'Confusion matrix',
    explanation: 'Tabel yang merangkum performa klasifikasi berdasarkan prediksi benar dan salah.',
  },
];

const SAMPLE_STRUCTURED_EN = [
  {
    term: 'Machine Learning',
    explanation: 'A branch of artificial intelligence that lets systems learn from data without explicit programming.',
  },
  {
    term: 'Supervised learning',
    explanation: 'A model is trained on labeled data to predict new outcomes.',
  },
  {
    term: 'Unsupervised learning',
    explanation: 'A model finds hidden patterns in unlabeled data.',
  },
  {
    term: 'Overfitting',
    explanation: 'A model memorizes the training data, hurting performance on new data.',
  },
  {
    term: 'Regularization',
    explanation: 'A technique that reduces overfitting by penalizing overly complex models.',
  },
  {
    term: 'Neural network',
    explanation: 'An artificial network built from layers of artificial neurons.',
  },
  {
    term: 'ReLU activation',
    explanation: 'Helps neural networks learn non-linear relationships.',
  },
  {
    term: 'Gradient descent',
    explanation: 'An optimization algorithm that updates model weights toward lower error.',
  },
  {
    term: 'Cross-validation',
    explanation: 'An evaluation method that splits data into several folds.',
  },
  {
    term: 'Confusion matrix',
    explanation: 'A table summarizing classification performance from correct and incorrect predictions.',
  },
];

/* ============================================================
   Kamus bahasa (ID / EN)
   ============================================================ */

const STORAGE_KEY = 'ai-study-buddy.lang';
const NOTES_KEY = 'ai-study-buddy.notes';
const THEME_KEY = 'ai-study-buddy.theme';
const DEFAULT_THEME = 'blue';

// Palet aksen v10. Urutan di sini sama dengan urutan pada menu.
const THEMES = [
  { id: 'blue', swatch: '#4f46e5' },
  { id: 'red', swatch: '#dc2626' },
  { id: 'orange', swatch: '#f97316' },
  { id: 'green', swatch: '#15803d' },
  { id: 'yellow', swatch: '#eab308' },
  { id: 'pink', swatch: '#db2777' },
  { id: 'black', swatch: '#111827' },
  { id: 'purple', swatch: '#9333ea' },
  { id: 'brown', swatch: '#92400e' },
  { id: 'gray', swatch: '#475569' },
  { id: 'dark-green', swatch: '#166534' },
  { id: 'cyan', swatch: '#06b6d4' },
  { id: 'teal', swatch: '#0f766e' },
  { id: 'olive', swatch: '#556b2f' },
];
const MAX_IMPORT_BYTES = 12 * 1024 * 1024;
const STORAGE_VERSION = 5;
const EXPORT_VERSION = 9;
const MAX_STRUCTURED_ROWS = 100;
const MIN_STRUCTURED_ROWS = 2;

// Batas gambar: sumber boleh besar, tetapi hasil kompresi dijaga kecil agar
// localStorage tidak cepat penuh.
const MAX_IMAGE_SOURCE_BYTES = 12 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1024;
const IMAGE_JPEG_QUALITY = 0.72;
const IMAGE_TARGET_BYTES = 180 * 1024;
const MAX_IMAGE_DATA_URL_LENGTH = 400 * 1024;

// Validasi catatan memakai jumlah huruf/angka, bukan jumlah kata, agar
// pasangan singkat seperti "DB: Basis data" tetap bisa diolah.
const MIN_NOTE_MEANINGFUL_CHARS = 10;
const MIN_CARD_TEXT_CHARS = 10;

const TRANSLATIONS = {
  id: {
    'app.title': 'AI Study Buddy — Catatan Jadi Flashcard & Kuis',
    'app.meta': 'Ubah catatan kuliah menjadi flashcard interaktif dan kuis pilihan ganda secara instan.',
    'app.subtitle': 'Catatan kuliah jadi flashcard & kuis dalam sekejap.',
    'app.footer': 'Dibuat untuk belajar lebih cepat. Semua materi diproses langsung di browser.',

    'theme.title': 'Warna aksen',
    'theme.blue': 'Biru',
    'theme.red': 'Merah',
    'theme.orange': 'Orange',
    'theme.green': 'Hijau',
    'theme.yellow': 'Kuning',
    'theme.pink': 'Pink',
    'theme.black': 'Hitam',
    'theme.purple': 'Ungu',
    'theme.brown': 'Coklat',
    'theme.gray': 'Abu-abu',
    'theme.dark-green': 'Hijau Gelap',
    'theme.cyan': 'Cyan',
    'theme.teal': 'Teal',
    'theme.olive': 'Zaitun',

    'stats.cards': '{n} kartu',
    'stats.questions': '{n} soal',

    'input.title': '1. Masukkan materimu',
    'input.sample': 'Pakai contoh',
    'input.desc': 'Satu poin per baris, atau tulis bebas. Kami akan memecah dan menyusunnya otomatis.',
    'input.scrollHint': 'untuk menggulir area ini',
    'input.label': 'Catatan kuliah',
    'input.placeholder': 'Contoh:\nOverfitting terjadi ketika model terlalu hafal data latih.\nNeural network: jaringan saraf tiruan berlapis.\nGradient descent adalah algoritma optimasi bobot.',
    'input.chars': '{n} karakter',
    'input.points': '{n} poin',
    'input.generate': 'Buat Flashcard & Kuis',
    'input.loading': 'Menyusun materi…',

    'mode.aria': 'Mode input materi',
    'mode.paste': 'Tempel Teks',
    'mode.structured': 'Formulir Soal',

    'structured.desc': 'Isi satu istilah dan penjelasannya per baris. Setiap baris lengkap menjadi satu kartu.',
    'structured.add': 'Tambahkan Soal',
    'structured.rowsAria': 'Daftar soal terstruktur',
    'structured.empty': 'Belum ada soal. Klik “Tambahkan Soal” untuk mulai.',
    'structured.rowLabel': 'Soal {n}',
    'structured.term': 'Term / Istilah / Pertanyaan',
    'structured.termPlaceholder': 'Contoh: Overfitting, atau Apa itu overfitting?',
    'structured.explanation': 'Explanation / Penjelasan / Jawaban',
    'structured.explanationPlaceholder': 'Contoh: Model terlalu hafal data latih sehingga buruk pada data baru.',
    'structured.remove': 'Hapus soal {n}',
    'structured.count': '{complete} dari {total} soal lengkap',
    'structured.imageAdd': 'Foto',
    'structured.imageChange': 'Ganti foto',
    'structured.imageRemove': 'Hapus foto',
    'structured.imageAddAria': 'Tambahkan foto untuk {field} soal {n}',
    'structured.imageChangeAria': 'Ganti foto untuk {field} soal {n}',
    'structured.imageRemoveAria': 'Hapus foto dari {field} soal {n}',
    'structured.imageFieldTerm': 'istilah',
    'structured.imageFieldExplanation': 'penjelasan',
    'structured.imageProcessing': 'Memproses…',
    'structured.imageErrorType': 'File harus berupa gambar (JPG, PNG, atau WebP).',
    'structured.imageErrorSize': 'Gambar terlalu besar. Maksimal 12 MB.',
    'structured.imageErrorRead': 'Gambar tidak bisa diproses. Coba file lain.',
    'structured.imageTermLabel': 'Soal bergambar {n}',
    'structured.errorMin': 'Isi minimal dua baris lengkap: istilah dan penjelasan.',
    'structured.errorIncomplete': 'Soal {n} belum lengkap. Isi istilah dan penjelasannya (teks atau foto), atau kosongkan baris itu.',
    'structured.errorDuplicateQuestion': 'Soal {first} dan {second} identik: istilah dan jawabannya sama. Ubah foto atau jawabannya agar berbeda.',
    'structured.errorEmpty': 'Formulir masih kosong. Tambahkan minimal dua soal lengkap, ya.',
    'structured.errorMax': 'Maksimal {n} soal dalam satu formulir.',

    'tips.title': 'Tips agar hasilnya bagus',
    'tips.one': 'Gunakan format <code class="code-chip">Istilah: penjelasan</code> untuk kartu definisi.',
    'tips.two': 'Baris tanpa titik dua akan diubah menjadi kartu isian rumpang.',
    'tips.three': 'Minimal 2 poin agar kuis bisa dibuat.',
    'tips.four': 'Catatan tersimpan otomatis di browser ini.',
    'structured.tips.one': 'Setiap baris lengkap menjadi <strong>kartu definisi</strong>, soal MCQ, dan pernyataan T/F.',
    'structured.tips.two': 'Isi minimal <strong>dua baris lengkap</strong>: istilah dan penjelasan.',
    'structured.tips.three': 'Istilah boleh sama asalkan foto atau jawabannya berbeda; hanya soal yang benar-benar kembar yang ditolak.',
    'structured.tips.four': 'Setiap kotak bisa berisi teks, foto, atau keduanya. Foto dikompres otomatis.',
    'structured.tips.five': 'Data formulir dan fotonya tersimpan otomatis di browser ini.',

    'storage.clear': 'Hapus semua',
    'storage.clearConfirm': 'Yakin? Klik lagi',
    'storage.saved': 'Tersimpan',
    'storage.export': 'Simpan File',
    'storage.import': 'Buka File',
    'storage.exported': 'File catatan berhasil diunduh.',
    'storage.imported': 'File “{name}” berhasil dimuat.',
    'storage.emptyExport': 'Belum ada catatan untuk disimpan.',
    'storage.invalidJson': 'File JSON tidak valid. Periksa kembali isinya.',
    'storage.invalidFile': 'File tidak berisi catatan yang bisa dibaca.',
    'storage.fileTooLarge': 'File terlalu besar. Maksimal 12 MB.',
    'storage.readError': 'Gagal membaca file. Silakan coba lagi.',
    'storage.quota': 'Penyimpanan browser penuh. Hapus beberapa foto agar materi tetap tersimpan.',

    'empty.title': 'Materi belajarmu muncul di sini',
    'empty.desc': 'Tempel catatan atau isi formulir soal, lalu tekan <span class="font-semibold text-slate-700">Buat Flashcard &amp; Kuis</span>.',
    'empty.f1': '<strong class="font-semibold text-slate-700">Flashcard 3D.</strong> Klik kartu untuk membalik.',
    'empty.f2': '<strong class="font-semibold text-slate-700">Kuis pilihan ganda.</strong> Lengkap dengan pembahasan.',
    'empty.f3': '<strong class="font-semibold text-slate-700">Skor otomatis.</strong> Pantau hasil belajarmu.',

    'tabs.cards': 'Flashcard',
    'tabs.quiz': 'Kuis',
    'tabs.tf': 'True / False',
    'tabs.aria': 'Mode belajar',
    'action.new': 'Catatan baru',

    'card.counter': 'Kartu {i} / {n}',
    'card.clickToFlip': 'Klik kartu untuk membalik',
    'card.questionBadge': 'Pertanyaan',
    'card.termBadge': 'Istilah',
    'card.clozeBadge': 'Isian rumpang',
    'card.answerBadge': 'Jawaban',
    'card.reveal': 'Klik untuk melihat jawaban',
    'card.back': 'Klik untuk kembali',
    'card.prev': 'Sebelumnya',
    'card.next': 'Berikutnya',
    'card.prevAria': 'Kartu sebelumnya',
    'card.nextAria': 'Kartu berikutnya',
    'card.flip': 'Balik kartu',
    'card.shuffle': 'Acak Kartu',
    'card.showQuestion': 'Lihat pertanyaan',
    'card.question': 'Apa yang dimaksud dengan “{term}”?',
    'card.aria': 'Flashcard. Tekan Enter atau klik untuk membalik.',
    'card.keys': 'Gunakan <kbd class="kbd">←</kbd> <kbd class="kbd">→</kbd> untuk berpindah, <kbd class="kbd">Space</kbd> untuk membalik.',

    'image.alt': 'Gambar soal',
    'image.termLabel': 'gambar ini',

    'quiz.counter': 'Soal {i} / {n}',
    'quiz.score': '{n} benar',
    'quiz.promptCloze': 'Lengkapi bagian rumpang pada poin berikut.',
    'quiz.promptMatch': 'Manakah definisi yang paling tepat untuk “{term}”?',
    'quiz.promptImage': 'Manakah definisi yang paling tepat untuk gambar berikut?',
    'quiz.explainCloze': 'Jawaban yang benar: “{term}”.',
    'quiz.correctTitle': 'Tepat sekali!',
    'quiz.wrongTitle': 'Belum tepat.',
    'quiz.next': 'Soal berikutnya →',
    'quiz.keyHint': 'Tekan → untuk lanjut',
    'quiz.seeResult': 'Lihat hasil',
    'quiz.shuffle': 'Acak Kuis',
    'quiz.emptyTitle': 'Kuis belum bisa dibuat',
    'quiz.emptyDesc': 'Butuh minimal dua poin dengan istilah berbeda. Coba tulis catatan dengan format <code class="code-chip">Istilah: penjelasan</code>.',
    'quiz.optionsAria': 'Pilihan jawaban',
    'quiz.resultLabel': 'Hasil kuis',
    'quiz.reviewLabel': 'Materi untuk diulang',

    'tf.counter': 'Soal {i} / {n}',
    'tf.statementLabel': 'Pernyataan',
    'tf.true': 'Benar',
    'tf.false': 'Salah',
    'tf.shuffle': 'Acak T/F',
    'tf.emptyTitle': 'Kuis True / False belum bisa dibuat',
    'tf.emptyDesc': 'Butuh minimal dua pasangan <code class="code-chip">Istilah: penjelasan</code> agar pernyataan benar dan salah bisa disusun.',
    'tf.correctTitle': 'Tepat!',
    'tf.wrongTitle': 'Belum tepat.',
    'tf.explainTrue': 'Pernyataan itu benar: “{term}” memang cocok dengan penjelasan tersebut.',
    'tf.explainFalse': 'Pernyataan itu salah. Penjelasan tersebut sebenarnya milik “{correctTerm}”.',
    'tf.resultLabel': 'Hasil True / False',
    'tf.retry': 'Ulangi kuis T/F',

    'timer.button': 'Atur timer kuis',
    'timer.menu': 'Pilih durasi timer',
    'timer.menuTitle': 'Durasi timer',
    'timer.seconds': '{n} detik',
    'timer.timeUpTitle': 'Waktu habis!',
    'timer.timeUpNote': 'Soal dianggap salah.',

    'streak.aria': 'Jawaban benar beruntun: {n}',
    'streak.title': 'Jawaban benar beruntun',
    'celebrate.badge': 'Skor luar biasa!',
    'celebrate.announce': 'Skor {percent}%! Konfeti selebrasi!',

    'result.retry': 'Ulangi kuis',
    'result.summary': '{score} dari {total} soal benar. {text}',
    'result.great': 'Luar biasa!',
    'result.greatText': 'Kamu sudah menguasai hampir seluruh materi. Pertahankan!',
    'result.good': 'Bagus sekali!',
    'result.goodText': 'Sebagian besar materi sudah kamu pahami. Rapikan sisanya, ya.',
    'result.ok': 'Cukup baik',
    'result.okText': 'Dasarnya sudah ada. Ulangi materi yang masih keliru agar lebih mantap.',
    'result.low': 'Terus berlatih!',
    'result.lowText': 'Baca ulang poin yang masih sulit, lalu ulangi kuisnya.',

    'hint.empty': 'Catatan masih kosong. Tempel catatan kuliahmu dulu, ya.',
    'hint.short': 'Catatan terlalu pendek. Tambahkan penjelasan pada minimal dua poin, misalnya "Istilah: penjelasan".',
    'hint.fewCards': 'Belum cukup poin yang bisa diolah. Pastikan ada minimal dua poin, misalnya dua baris "Istilah: penjelasan".',
    'hint.error': 'Terjadi kesalahan saat menyusun materi. Silakan coba lagi.',
  },

  en: {
    'app.title': 'AI Study Buddy — Turn Notes into Flashcards & Quizzes',
    'app.meta': 'Turn your lecture notes into interactive flashcards and multiple-choice quizzes instantly.',
    'app.subtitle': 'Turn your lecture notes into flashcards & quizzes in seconds.',
    'app.footer': 'Built for faster studying. Everything is processed right in your browser.',

    'theme.title': 'Accent color',
    'theme.blue': 'Blue',
    'theme.red': 'Red',
    'theme.orange': 'Orange',
    'theme.green': 'Green',
    'theme.yellow': 'Yellow',
    'theme.pink': 'Pink',
    'theme.black': 'Black',
    'theme.purple': 'Purple',
    'theme.brown': 'Brown',
    'theme.gray': 'Gray',
    'theme.dark-green': 'Dark Green',
    'theme.cyan': 'Cyan',
    'theme.teal': 'Teal',
    'theme.olive': 'Olive',

    'stats.cards': '{n} cards',
    'stats.questions': '{n} questions',

    'input.title': '1. Add your material',
    'input.sample': 'Use sample',
    'input.desc': "One point per line, or write freely. We'll split and organize it for you.",
    'input.scrollHint': 'to scroll this area',
    'input.label': 'Lecture notes',
    'input.placeholder': 'Example:\nOverfitting occurs when a model memorizes the training data too closely.\nNeural network: an artificial neural network with stacked layers.\nGradient descent is an algorithm that optimizes model weights.',
    'input.chars': '{n} characters',
    'input.points': '{n} points',
    'input.generate': 'Create Flashcards & Quiz',
    'input.loading': 'Preparing material…',

    'mode.aria': 'Input mode',
    'mode.paste': 'Paste Text',
    'mode.structured': 'Question Form',

    'structured.desc': 'Fill in one term and its explanation per row. Each complete row becomes one card.',
    'structured.add': 'Add Question',
    'structured.rowsAria': 'Structured question list',
    'structured.empty': 'No questions yet. Click “Add Question” to start.',
    'structured.rowLabel': 'Question {n}',
    'structured.term': 'Term / Question',
    'structured.termPlaceholder': 'Example: Overfitting, or What is overfitting?',
    'structured.explanation': 'Explanation / Answer',
    'structured.explanationPlaceholder': 'Example: A model memorizes the training data, hurting performance on new data.',
    'structured.remove': 'Remove question {n}',
    'structured.count': '{complete} of {total} complete',
    'structured.imageAdd': 'Photo',
    'structured.imageChange': 'Change photo',
    'structured.imageRemove': 'Remove photo',
    'structured.imageAddAria': 'Add a photo for the {field} of question {n}',
    'structured.imageChangeAria': 'Change the photo for the {field} of question {n}',
    'structured.imageRemoveAria': 'Remove the photo from the {field} of question {n}',
    'structured.imageFieldTerm': 'term',
    'structured.imageFieldExplanation': 'explanation',
    'structured.imageProcessing': 'Processing…',
    'structured.imageErrorType': 'The file must be an image (JPG, PNG, or WebP).',
    'structured.imageErrorSize': 'The image is too large. The maximum is 12 MB.',
    'structured.imageErrorRead': 'The image could not be processed. Try another file.',
    'structured.imageTermLabel': 'Image question {n}',
    'structured.errorMin': 'Add at least two complete rows: a term and an explanation.',
    'structured.errorIncomplete': 'Question {n} is incomplete. Fill in both the term and explanation (text or photo), or clear that row.',
    'structured.errorDuplicateQuestion': 'Questions {first} and {second} are identical: the term and the answer are the same. Change the photo or the answer so they differ.',
    'structured.errorEmpty': 'The form is still empty. Add at least two complete questions.',
    'structured.errorMax': 'A form can contain at most {n} questions.',

    'tips.title': 'Tips for better results',
    'tips.one': 'Use the format <code class="code-chip">Term: explanation</code> for definition cards.',
    'tips.two': 'Lines without a colon become fill-in-the-blank cards.',
    'tips.three': 'At least 2 points are needed to build a quiz.',
    'tips.four': 'Your notes are saved automatically in this browser.',
    'structured.tips.one': 'Each complete row becomes a <strong>definition card</strong>, MCQ, and T/F statement.',
    'structured.tips.two': 'Add at least <strong>two complete rows</strong>: term and explanation.',
    'structured.tips.three': 'The same term is allowed when the photo or answer differs; only identical questions are rejected.',
    'structured.tips.four': 'Each field can hold text, a photo, or both. Photos are compressed automatically.',
    'structured.tips.five': 'Form data and photos are saved automatically in this browser.',

    'storage.clear': 'Clear all',
    'storage.clearConfirm': 'Sure? Click again',
    'storage.saved': 'Saved',
    'storage.export': 'Save File',
    'storage.import': 'Open File',
    'storage.exported': 'Your notes file has been downloaded.',
    'storage.imported': 'File “{name}” loaded successfully.',
    'storage.emptyExport': 'There are no notes to export yet.',
    'storage.invalidJson': "That JSON file isn't valid. Please check its contents.",
    'storage.invalidFile': "The file doesn't contain readable notes.",
    'storage.fileTooLarge': 'That file is too large. The maximum size is 12 MB.',
    'storage.readError': "Couldn't read that file. Please try again.",
    'storage.quota': 'Browser storage is full. Remove some photos so your material keeps saving.',

    'empty.title': 'Your study material appears here',
    'empty.desc': 'Paste your notes or fill in the question form, then press <span class="font-semibold text-slate-700">Create Flashcards &amp; Quiz</span>.',
    'empty.f1': '<strong class="font-semibold text-slate-700">3D flashcards.</strong> Click a card to flip it.',
    'empty.f2': '<strong class="font-semibold text-slate-700">Multiple-choice quiz.</strong> Complete with explanations.',
    'empty.f3': '<strong class="font-semibold text-slate-700">Automatic scoring.</strong> See how well you did.',

    'tabs.cards': 'Flashcards',
    'tabs.quiz': 'Quiz',
    'tabs.tf': 'True / False',
    'tabs.aria': 'Study mode',
    'action.new': 'New notes',

    'card.counter': 'Card {i} / {n}',
    'card.clickToFlip': 'Click the card to flip',
    'card.questionBadge': 'Question',
    'card.termBadge': 'Term',
    'card.clozeBadge': 'Fill in the blank',
    'card.answerBadge': 'Answer',
    'card.reveal': 'Click to reveal the answer',
    'card.back': 'Click to flip back',
    'card.prev': 'Previous',
    'card.next': 'Next',
    'card.prevAria': 'Previous card',
    'card.nextAria': 'Next card',
    'card.flip': 'Flip card',
    'card.shuffle': 'Shuffle Cards',
    'card.showQuestion': 'Show question',
    'card.question': 'What does “{term}” mean?',
    'card.aria': 'Flashcard. Press Enter or click to flip.',
    'card.keys': 'Use <kbd class="kbd">←</kbd> <kbd class="kbd">→</kbd> to move, <kbd class="kbd">Space</kbd> to flip.',

    'image.alt': 'Question image',
    'image.termLabel': 'this image',

    'quiz.counter': 'Question {i} / {n}',
    'quiz.score': '{n} correct',
    'quiz.promptCloze': 'Fill in the blank in the following point.',
    'quiz.promptMatch': 'Which definition best matches “{term}”?',
    'quiz.promptImage': 'Which definition best matches this image?',
    'quiz.explainCloze': 'Correct answer: “{term}”.',
    'quiz.correctTitle': 'Correct!',
    'quiz.wrongTitle': 'Not quite.',
    'quiz.next': 'Next question →',
    'quiz.keyHint': 'Press → to continue',
    'quiz.seeResult': 'See results',
    'quiz.shuffle': 'Shuffle Quiz',
    'quiz.emptyTitle': "Quiz can't be created yet",
    'quiz.emptyDesc': 'You need at least two points with different terms. Try notes formatted as <code class="code-chip">Term: explanation</code>.',
    'quiz.optionsAria': 'Answer choices',
    'quiz.resultLabel': 'Quiz result',
    'quiz.reviewLabel': 'Topics to review',

    'tf.counter': 'Question {i} / {n}',
    'tf.statementLabel': 'Statement',
    'tf.true': 'True',
    'tf.false': 'False',
    'tf.shuffle': 'Shuffle T/F',
    'tf.emptyTitle': "True / False quiz can't be created yet",
    'tf.emptyDesc': 'You need at least two <code class="code-chip">Term: explanation</code> pairs so true and false statements can be created.',
    'tf.correctTitle': 'Correct!',
    'tf.wrongTitle': 'Not quite.',
    'tf.explainTrue': 'That statement is true: “{term}” does match that explanation.',
    'tf.explainFalse': 'That statement is false. That explanation actually belongs to “{correctTerm}”.',
    'tf.resultLabel': 'True / False result',
    'tf.retry': 'Retry T/F quiz',

    'timer.button': 'Set quiz timer',
    'timer.menu': 'Choose timer duration',
    'timer.menuTitle': 'Timer duration',
    'timer.seconds': '{n} seconds',
    'timer.timeUpTitle': "Time's up!",
    'timer.timeUpNote': 'This question is marked incorrect.',

    'streak.aria': 'Correct answer streak: {n}',
    'streak.title': 'Consecutive correct answers',
    'celebrate.badge': 'Outstanding score!',
    'celebrate.announce': 'Score {percent}%! Confetti celebration!',

    'result.retry': 'Retry quiz',
    'result.summary': '{score} of {total} correct. {text}',
    'result.great': 'Outstanding!',
    'result.greatText': "You've mastered almost all of the material. Keep it up!",
    'result.good': 'Great job!',
    'result.goodText': 'Most of the material is clear. Polish the rest.',
    'result.ok': 'Not bad',
    'result.okText': 'The basics are there. Review the tricky parts to make them stick.',
    'result.low': 'Keep practicing!',
    'result.lowText': 'Re-read the points you found hard, then retry the quiz.',

    'hint.empty': 'Your notes are still empty. Paste your lecture notes first.',
    'hint.short': 'Your notes are too short. Add explanations to at least two points, for example "Term: explanation".',
    'hint.fewCards': 'Not enough usable points yet. Make sure there are at least two points, for example two "Term: explanation" lines.',
    'hint.error': 'Something went wrong while preparing your material. Please try again.',
  },
};

function loadLanguage() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'id' || saved === 'en') return saved;
  } catch (error) {
    // localStorage bisa diblokir; abaikan dan pakai bahasa default.
  }
  return 'id';
}

function loadTheme() {
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved && THEMES.some((theme) => theme.id === saved)) return saved;
  } catch (error) {
    // localStorage bisa diblokir; abaikan dan pakai tema default.
  }
  return DEFAULT_THEME;
}

let lang = loadLanguage();
let currentTheme = loadTheme();

function t(key, values = {}) {
  const dictionary = TRANSLATIONS[lang] || TRANSLATIONS.id;
  let text = dictionary[key] ?? TRANSLATIONS.id[key] ?? key;

  Object.entries(values).forEach(([name, value]) => {
    text = text.split(`{${name}}`).join(String(value));
  });

  return text;
}

const state = {
  cards: [],
  quiz: [],
  cardIndex: 0,
  flipped: false,
  quizIndex: 0,
  score: 0,
  streak: 0,
  answered: false,
  tf: [],
  tfIndex: 0,
  tfScore: 0,
  tfStreak: 0,
  tfAnswered: false,
  loading: false,
  inputMode: 'paste',
  structuredRows: [],
};

let generateTimer = null;
let structuredRowSeed = 0;

const $ = (selector) => document.querySelector(selector);

const els = {
  notes: $('#notes'),
  charCount: $('#char-count'),
  lineCount: $('#line-count'),
  btnSample: $('#btn-sample'),
  btnGenerate: $('#btn-generate'),
  generateLabel: $('#generate-label'),
  generateIcon: $('#generate-icon'),
  generateSpinner: $('#generate-spinner'),
  formHint: $('#form-hint'),

  modeButtons: Array.from(document.querySelectorAll('.mode-tab')),
  pastePanel: $('#paste-panel'),
  structuredPanel: $('#structured-panel'),
  pasteCounts: $('#paste-counts'),
  structuredCount: $('#structured-count'),
  structuredRows: $('#structured-rows'),
  structuredEmpty: $('#structured-empty'),
  btnAddRow: $('#btn-add-row'),
  tipsPaste: $('#tips-paste'),
  tipsStructured: $('#tips-structured'),

  btnClear: $('#btn-clear'),
  clearLabel: $('#clear-label'),
  btnExport: $('#btn-export'),
  btnImport: $('#btn-import'),
  fileInput: $('#file-input'),
  saveStatus: $('#save-status'),

  stats: $('#stats'),
  statCards: $('#stat-cards'),
  statQuiz: $('#stat-quiz'),

  studyEmpty: $('#study-empty'),
  studyPanels: $('#study-panels'),
  tabButtons: Array.from(document.querySelectorAll('.tab-btn')),
  langButtons: Array.from(document.querySelectorAll('.lang-btn')),

  themePicker: $('#theme-picker'),
  themeToggle: $('#theme-toggle'),
  themeMenu: $('#theme-menu'),
  themeOptions: $('#theme-options'),
  themeCurrentName: $('#theme-current-name'),
  themeCurrentSwatch: $('#theme-current-swatch'),

  tabCards: $('#tab-cards'),
  tabQuiz: $('#tab-quiz'),
  tabTf: $('#tab-tf'),

  cardCounter: $('#card-counter'),
  cardProgress: $('#card-progress'),
  flashcard: $('#flashcard'),
  cardBadge: $('#card-badge'),
  cardFront: $('#card-front'),
  cardBack: $('#card-back'),
  cardNumber: $('#card-number'),
  cardNumberBack: $('#card-number-back'),
  cardPrev: $('#card-prev'),
  cardNext: $('#card-next'),
  cardFlip: $('#card-flip'),
  cardShuffle: $('#card-shuffle'),

  quizBody: $('#quiz-body'),
  quizEmpty: $('#quiz-empty'),
  quizResult: $('#quiz-result'),
  quizCounter: $('#quiz-counter'),
  quizScore: $('#quiz-score'),
  quizStreak: $('#quiz-streak'),
  quizStreakValue: $('#quiz-streak-value'),
  quizProgress: $('#quiz-progress'),
  quizPrompt: $('#quiz-prompt'),
  quizContext: $('#quiz-context'),
  quizOptions: $('#quiz-options'),
  quizFeedback: $('#quiz-feedback'),
  quizNext: $('#quiz-next'),
  quizNextHint: $('#quiz-next-hint'),
  quizShuffle: $('#quiz-shuffle'),
  quizTimer: $('#quiz-timer'),
  quizTimerMenu: $('#quiz-timer-menu'),
  quizTimerProgress: $('#quiz-timer-progress'),
  quizTimerOptions: Array.from(document.querySelectorAll('#quiz-timer-menu .timer-option')),

  resultRing: $('#result-ring'),
  resultPercent: $('#result-percent'),
  resultTitle: $('#result-title'),
  resultText: $('#result-text'),
  resultReview: $('#result-review'),
  quizCelebration: $('#quiz-celebration'),
  btnRetry: $('#btn-retry'),
  btnShuffleResult: $('#btn-shuffle-result'),
  btnNew: $('#btn-new'),
  btnNew2: $('#btn-new-2'),

  tfEmpty: $('#tf-empty'),
  tfBody: $('#tf-body'),
  tfResult: $('#tf-result'),
  tfCounter: $('#tf-counter'),
  tfScore: $('#tf-score'),
  tfStreak: $('#tf-streak'),
  tfStreakValue: $('#tf-streak-value'),
  tfProgress: $('#tf-progress'),
  tfTerm: $('#tf-term'),
  tfDefinition: $('#tf-definition'),
  tfFeedback: $('#tf-feedback'),
  tfNext: $('#tf-next'),
  tfNextHint: $('#tf-next-hint'),
  tfTrue: $('#tf-true'),
  tfFalse: $('#tf-false'),
  tfShuffle: $('#tf-shuffle'),
  tfTimer: $('#tf-timer'),
  tfTimerMenu: $('#tf-timer-menu'),
  tfTimerProgress: $('#tf-timer-progress'),
  tfTimerOptions: Array.from(document.querySelectorAll('#tf-timer-menu .timer-option')),
  tfResultRing: $('#tf-result-ring'),
  tfResultPercent: $('#tf-result-percent'),
  tfResultTitle: $('#tf-result-title'),
  tfResultText: $('#tf-result-text'),
  tfCelebration: $('#tf-celebration'),
  btnTfRetry: $('#btn-tf-retry'),
  btnTfShuffleResult: $('#btn-tf-shuffle-result'),
  btnTfNew: $('#btn-tf-new'),

  confettiCanvas: $('#confetti-canvas'),
  celebrationStatus: $('#celebration-status'),
};

/* ============================================================
   Utilitas
   ============================================================ */

function escapeHtml(value) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value ?? '').replace(/[&<>"']/g, (char) => map[char]);
}

/** Fisher-Yates shuffle: acak array tanpa mengubah array asli. */
function shuffleArray(list) {
  const array = list.slice();
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function uniqueBy(items, keyOf) {
  const seen = new Set();
  const result = [];
  items.forEach((item) => {
    if (!item) return;
    const key = keyOf(item).trim().toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    result.push(item);
  });
  return result;
}

function capitalize(text) {
  const value = String(text ?? '');
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/* ---------- Gambar ---------- */

const imageKeyCache = new Map();

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

/** Kunci ringkas untuk data URL agar tidak membandingkan string base64 panjang. */
function imageKey(dataUrl) {
  if (!dataUrl) return '';
  const cached = imageKeyCache.get(dataUrl);
  if (cached) return cached;

  const key = `${dataUrl.length}-${hashString(dataUrl)}`;
  imageKeyCache.set(dataUrl, key);
  if (imageKeyCache.size > 240) {
    const oldest = imageKeyCache.keys().next().value;
    imageKeyCache.delete(oldest);
  }
  return key;
}

/**
 * Nilai sebuah field = teks + gambar. Keduanya ikut menjadi identitas supaya
 * dua nilai berteks sama tetapi fotonya berbeda tetap dianggap berbeda
 * (v9.1). Nilai tanpa teks dan tanpa foto dianggap kosong.
 */
function valueKey(text, image = '') {
  const normalized = String(text ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
  const imagePart = image ? imageKey(image) : '';
  if (!normalized && !imagePart) return '';
  return `t:${normalized}|i:${imagePart}`;
}

/**
 * Identitas satu soal lengkap: pasangan pertanyaan (teks + foto) dan
 * jawaban (teks + foto). Dipakai untuk menolak hanya soal yang benar-benar
 * kembar, bukan sekadar istilah berteks sama.
 */
function questionKey(term, termImage, explanation, explanationImage) {
  return `${valueKey(term, termImage)}||${valueKey(explanation, explanationImage)}`;
}

function isImageDataUrl(value) {
  return typeof value === 'string'
    && value.length > 22
    && value.length <= MAX_IMAGE_DATA_URL_LENGTH
    && /^data:image\/(?:png|jpe?g|webp);base64,[a-z0-9+/=]+$/i.test(value);
}

function normalizeImageValue(value) {
  return isImageDataUrl(value) ? value : '';
}

function imageMarkup(dataUrl, { alt = '', className = 'study-image' } = {}) {
  if (!isImageDataUrl(dataUrl)) return '';
  return `<img class="${className}" src="${escapeHtml(dataUrl)}" alt="${escapeHtml(alt)}" decoding="async" />`;
}

function fieldHasContent(text, image) {
  return Boolean(String(text ?? '').trim() || normalizeImageValue(image));
}

function dataUrlBytes(dataUrl) {
  const comma = dataUrl.indexOf(',');
  if (comma < 0) return dataUrl.length;
  const base64 = dataUrl.slice(comma + 1);
  return Math.floor((base64.length * 3) / 4);
}

/** Ubah teks polos menjadi HTML aman, dengan penanda rumpang. */
function formatText(text) {
  return escapeHtml(text)
    .replace(/\[____\]/g, '<span class="blank" aria-label="bagian rumpang"></span>')
    .replace(/\n/g, '<br>');
}

/* ============================================================
   Parsing catatan
   ============================================================ */

function extractSegments(raw) {
  const segments = [];

  raw.split(/\r?\n/).forEach((rawLine) => {
    let line = rawLine.trim();
    if (!line) return;

    line = line
      .replace(/^[-*•·–—]+\s*/, '')
      .replace(/^\d+[.)]\s+/, '')
      .replace(/^#+\s*/, '')
      .trim();
    if (!line) return;

    const sentences = line.match(/[^.!?]+(?:[.!?]+|$)/g) || [line];
    const parts = sentences.map((part) => part.trim()).filter(Boolean);

    // Kalimat panjang dipecah, kecuali baris memang berupa satu poin utuh.
    if (parts.length > 1 && parts.every((part) => part.split(/\s+/).length >= 5)) {
      segments.push(...parts);
    } else {
      segments.push(line);
    }
  });

  return uniqueBy(segments, (segment) => segment.replace(/\s+/g, ' '));
}

function cleanTerm(value) {
  const term = value
    .replace(/^[\s"'“”‘’(\[]+/, '')
    .replace(/[\s"'“”‘’)\].,;:]+$/, '')
    .trim();

  if (term.length < 2 || term.length > 70) return '';
  if (term.split(/\s+/).length > 8) return '';
  return term;
}

function detectPair(text) {
  // Pasangan eksplisit boleh memakai penjelasan pendek, misalnya "DB: Basis data".
  const withSeparator = text.match(/^(.{2,70}?)\s*(?::|—|–|\s-\s|\s=\s|\s→\s)\s*(.{3,})$/);
  if (withSeparator) {
    const term = cleanTerm(withSeparator[1]);
    if (term) return { term, definition: capitalize(withSeparator[2].trim()) };
  }

  const withVerb = text.match(
    /^(.{3,70}?)\s+(adalah|ialah|merupakan|yaitu|yakni|merujuk pada|refers to|is|are|means)\s+(.{15,})$/i,
  );
  if (withVerb) {
    const term = cleanTerm(withVerb[1]);
    if (term) return { term, definition: capitalize(withVerb[3].trim()) };
  }

  return null;
}

function keyPhrase(sentence) {
  const words = sentence.replace(/[“”"'()[\]]/g, '').split(/\s+/).filter(Boolean);
  let start = 0;
  while (start < 3 && start < words.length && STOPWORDS.has(words[start].toLowerCase())) {
    start += 1;
  }
  if (start >= words.length) return '';

  const phrase = [words[start]];
  if (words[start].length <= 14 && start + 1 < words.length) {
    const next = words[start + 1];
    const nextLower = next.toLowerCase();
    const looksLikeVerb = /^(me|ber|ter|di)[a-z]{3,}$/.test(nextLower);
    if (!STOPWORDS.has(nextLower) && !VERB_WORDS.has(nextLower) && !looksLikeVerb) {
      phrase.push(next);
    }
  }

  const cleaned = phrase.join(' ').replace(/[.,;:!?]+$/, '');
  return cleaned.length >= 3 ? cleaned : '';
}

function buildCards(segments) {
  const cards = [];

  segments.forEach((segment) => {
    const text = segment.replace(/\s+/g, ' ').trim();
    if (text.length < MIN_CARD_TEXT_CHARS) return;

    const pair = detectPair(text);
    if (pair) {
      cards.push({
        kind: 'definition',
        term: pair.term,
        definition: pair.definition,
        source: text,
        sourceMode: 'paste',
      });
      return;
    }

    const phrase = keyPhrase(text);
    if (!phrase) return;

    const index = text.toLowerCase().indexOf(phrase.toLowerCase());
    const cloze = index >= 0
      ? `${text.slice(0, index)}[____]${text.slice(index + phrase.length)}`
      : text;

    cards.push({
      kind: 'concept',
      term: phrase,
      definition: text,
      source: text,
      cloze,
      sourceMode: 'paste',
    });
  });

  return uniqueBy(cards, (card) => card.term);
}

/* ============================================================
   Formulir soal terstruktur
   ============================================================ */

function cleanStructuredValue(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function createStructuredRow(term = '', explanation = '', termImage = '', explanationImage = '') {
  structuredRowSeed += 1;
  return {
    id: `srow-${structuredRowSeed}`,
    term: String(term ?? ''),
    explanation: String(explanation ?? ''),
    termImage: normalizeImageValue(termImage),
    explanationImage: normalizeImageValue(explanationImage),
  };
}

function createEmptyStructuredRows(count = MIN_STRUCTURED_ROWS) {
  return Array.from({ length: count }, () => createStructuredRow());
}

/** Terima data dari localStorage / impor dan buang entri yang bukan objek. */
function normalizeStructuredRows(rows) {
  if (!Array.isArray(rows)) return null;

  return rows
    .slice(0, MAX_STRUCTURED_ROWS)
    .filter((row) => row && typeof row === 'object')
    .map((row) => createStructuredRow(
      typeof row.term === 'string' ? row.term : '',
      typeof row.explanation === 'string'
        ? row.explanation
        : typeof row.definition === 'string'
          ? row.definition
          : '',
      row.termImage,
      row.explanationImage,
    ));
}

function autoGrowTextarea(field) {
  if (!field) return;
  field.style.height = 'auto';
  field.style.height = `${Math.max(field.scrollHeight, 44)}px`;
}

function autoGrowStructuredRows() {
  els.structuredRows.querySelectorAll('.structured-input').forEach(autoGrowTextarea);
}

function focusStructuredCell(rowId, field = 'term') {
  const rowEl = Array.from(els.structuredRows.children)
    .find((element) => element.dataset.rowId === rowId);
  if (!rowEl) return;

  const fieldEl = rowEl.querySelector(`[data-field="${field}"]`);
  if (fieldEl) fieldEl.focus();
}

function structuredImageValue(row, field) {
  return normalizeImageValue(field === 'term' ? row.termImage : row.explanationImage);
}

function structuredImageButton(row, index, field, disabled) {
  const image = structuredImageValue(row, field);
  const fieldName = t(field === 'term' ? 'structured.imageFieldTerm' : 'structured.imageFieldExplanation');
  const key = image ? 'structured.imageChangeAria' : 'structured.imageAddAria';
  const label = t(image ? 'structured.imageChange' : 'structured.imageAdd');

  return `
    <button
      type="button"
      class="image-btn"
      data-pick-image="${field}"
      data-row-id="${row.id}"
      aria-label="${escapeHtml(t(key, { field: fieldName, n: index + 1 }))}"
      title="${escapeHtml(t(key, { field: fieldName, n: index + 1 }))}"${disabled}
    >
      <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.12" aria-hidden="true">
        <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.6l1.2-2h5.4l1.2 2h1.6A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z" stroke-linejoin="round" />
        <circle cx="12" cy="12.5" r="3.2" />
      </svg>
      <span>${escapeHtml(label)}</span>
    </button>`;
}

function structuredImagePreview(row, index, field, disabled) {
  const image = structuredImageValue(row, field);
  if (!image) {
    return `<div class="structured-image-preview hidden" data-image-preview="${field}"></div>`;
  }

  const fieldName = t(field === 'term' ? 'structured.imageFieldTerm' : 'structured.imageFieldExplanation');
  const removeLabel = t('structured.imageRemoveAria', { field: fieldName, n: index + 1 });

  return `
    <div class="structured-image-preview" data-image-preview="${field}">
      ${imageMarkup(image, { alt: t('image.alt'), className: 'structured-thumb' })}
      <button
        type="button"
        class="image-remove"
        data-remove-image="${field}"
        data-row-id="${row.id}"
        aria-label="${escapeHtml(removeLabel)}"
        title="${escapeHtml(removeLabel)}"${disabled}
      >
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" stroke-linecap="round" />
        </svg>
      </button>
    </div>`;
}

function structuredFieldMarkup(row, index, field, disabled) {
  const isTerm = field === 'term';
  const inputId = `structured-${isTerm ? 'term' : 'explanation'}-${row.id}`;
  const label = isTerm ? t('structured.term') : t('structured.explanation');
  const placeholder = isTerm
    ? t('structured.termPlaceholder')
    : t('structured.explanationPlaceholder');
  const value = isTerm ? row.term : row.explanation;
  const fieldName = t(isTerm ? 'structured.imageFieldTerm' : 'structured.imageFieldExplanation');
  const hasImage = Boolean(structuredImageValue(row, field));
  const inputLabel = t(hasImage ? 'structured.imageChangeAria' : 'structured.imageAddAria', {
    field: fieldName,
    n: index + 1,
  });
  const rows = isTerm ? 2 : 3;

  return `
    <div class="structured-field" data-field-wrap="${field}">
      <div class="structured-field-head">
        <label class="structured-label" for="${inputId}">${escapeHtml(label)}</label>
        ${structuredImageButton(row, index, field, disabled)}
      </div>
      <textarea
        id="${inputId}"
        class="structured-input"
        data-field="${field}"
        rows="${rows}"
        spellcheck="false"
        aria-label="${escapeHtml(label)}"
        placeholder="${escapeHtml(placeholder)}"${disabled}
      >${escapeHtml(value)}</textarea>
      <input
        type="file"
        class="structured-image-input"
        accept="image/*"
        data-image-input="${field}"
        data-row-id="${row.id}"
        aria-label="${escapeHtml(inputLabel)}"
        hidden${disabled}
      />
      ${structuredImagePreview(row, index, field, disabled)}
    </div>`;
}

function renderStructuredRows({ focusRowId = null, focusField = 'term' } = {}) {
  const rows = state.structuredRows;

  els.structuredRows.innerHTML = rows
    .map((row, index) => {
      const rowLabel = t('structured.rowLabel', { n: index + 1 });
      const removeLabel = t('structured.remove', { n: index + 1 });
      const disabled = state.loading ? ' disabled' : '';

      return `
        <article class="structured-row" data-row-id="${row.id}" aria-labelledby="structured-label-${row.id}">
          <div class="structured-row-head">
            <span id="structured-label-${row.id}" class="structured-row-number">${escapeHtml(rowLabel)}</span>
            <button
              type="button"
              class="row-remove"
              data-remove-row="${row.id}"
              aria-label="${escapeHtml(removeLabel)}"
              title="${escapeHtml(removeLabel)}"${disabled}
            >
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
                <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
          ${structuredFieldMarkup(row, index, 'term', disabled)}
          ${structuredFieldMarkup(row, index, 'explanation', disabled)}
        </article>`;
    })
    .join('');

  els.structuredEmpty.classList.toggle('hidden', rows.length > 0);
  els.btnAddRow.disabled = state.loading;

  window.requestAnimationFrame(() => {
    autoGrowStructuredRows();
    if (focusRowId) focusStructuredCell(focusRowId, focusField);
  });
}

/** Perbarui hanya pratinjau foto pada satu baris, tanpa render ulang seluruh form. */
function renderRowImagePreview(rowEl, field, row) {
  if (!rowEl || !rowEl.isConnected) return;

  const index = state.structuredRows.indexOf(row);
  const preview = rowEl.querySelector(`[data-image-preview="${field}"]`);
  const button = rowEl.querySelector(`[data-pick-image="${field}"]`);

  if (preview) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = structuredImagePreview(row, Math.max(index, 0), field, '');
    const next = wrapper.firstElementChild;
    if (next) preview.replaceWith(next);
  }

  if (button) {
    const fieldName = t(field === 'term' ? 'structured.imageFieldTerm' : 'structured.imageFieldExplanation');
    const hasImage = Boolean(structuredImageValue(row, field));
    const label = t(hasImage ? 'structured.imageChange' : 'structured.imageAdd');
    const aria = t(hasImage ? 'structured.imageChangeAria' : 'structured.imageAddAria', {
      field: fieldName,
      n: Math.max(index, 0) + 1,
    });
    button.setAttribute('aria-label', aria);
    button.setAttribute('title', aria);
    const text = button.querySelector('span');
    if (text) text.textContent = label;

    const input = rowEl.querySelector(`[data-image-input="${field}"]`);
    if (input) input.setAttribute('aria-label', aria);
  }
}

function clearStructuredErrors() {
  els.structuredRows.querySelectorAll('.structured-row').forEach((rowEl) => {
    rowEl.classList.remove('has-error');
    rowEl.querySelectorAll('[data-field]').forEach((field) => {
      field.removeAttribute('aria-invalid');
    });
  });
}

function setStructuredRowErrors(rowIds) {
  const flagged = new Set(rowIds);

  els.structuredRows.querySelectorAll('.structured-row').forEach((rowEl) => {
    const hasError = flagged.has(rowEl.dataset.rowId);
    rowEl.classList.toggle('has-error', hasError);
    rowEl.querySelectorAll('[data-field]').forEach((field) => {
      if (hasError) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    });
  });
}

function countCompleteStructuredRows() {
  return state.structuredRows.filter(
    (row) => fieldHasContent(row.term, row.termImage)
      && fieldHasContent(row.explanation, row.explanationImage),
  ).length;
}

function hasInputData() {
  return els.notes.value.trim().length > 0
    || state.structuredRows.some(
      (row) => fieldHasContent(row.term, row.termImage)
        || fieldHasContent(row.explanation, row.explanationImage),
    );
}

function structuredSourceText(term, definition) {
  if (term && definition) return `${term}: ${definition}`;
  if (term) return term;
  return definition;
}

function buildStructuredCards() {
  const cards = state.structuredRows
    .map((row) => ({
      term: cleanStructuredValue(row.term),
      definition: cleanStructuredValue(row.explanation),
      termImage: normalizeImageValue(row.termImage),
      definitionImage: normalizeImageValue(row.explanationImage),
    }))
    .filter((row) => fieldHasContent(row.term, row.termImage)
      && fieldHasContent(row.definition, row.definitionImage))
    .map((row) => ({
      kind: 'definition',
      term: row.term,
      definition: row.definition,
      termImage: row.termImage,
      definitionImage: row.definitionImage,
      source: structuredSourceText(row.term, row.definition),
      sourceMode: 'structured',
    }));

  // Penjelasan boleh sama antar soal; istilah juga boleh berteks sama asalkan
  // foto atau jawabannya berbeda. Hanya soal yang benar-benar kembar dibuang.
  return uniqueBy(
    cards,
    (card) => questionKey(card.term, card.termImage, card.definition, card.definitionImage),
  );
}

/**
 * Validasi mode formulir:
 * - baris kosong diabaikan,
 * - setiap sisi boleh berisi teks, foto, atau keduanya,
 * - baris yang hanya terisi separuh dianggap belum lengkap,
 * - minimal dua baris lengkap,
 * - istilah boleh sama asalkan foto pertanyaan atau jawabannya berbeda,
 * - hanya soal yang benar-benar kembar (pertanyaan dan jawaban sama) ditolak.
 */
function validateStructuredRows() {
  clearStructuredErrors();

  const rows = state.structuredRows;
  const cleaned = rows.map((row, index) => {
    const term = cleanStructuredValue(row.term);
    const explanation = cleanStructuredValue(row.explanation);
    const termImage = normalizeImageValue(row.termImage);
    const explanationImage = normalizeImageValue(row.explanationImage);

    return {
      row,
      index,
      term,
      explanation,
      termImage,
      explanationImage,
      hasTerm: fieldHasContent(term, termImage),
      hasExplanation: fieldHasContent(explanation, explanationImage),
    };
  });
  const meaningful = cleaned.filter((entry) => entry.hasTerm || entry.hasExplanation);

  if (meaningful.length === 0) {
    return {
      ok: false,
      hint: t('structured.errorEmpty'),
      focus: rows[0] ? { id: rows[0].id, field: 'term' } : null,
    };
  }

  const incomplete = meaningful.find((entry) => !entry.hasTerm || !entry.hasExplanation);
  if (incomplete) {
    setStructuredRowErrors([incomplete.row.id]);
    return {
      ok: false,
      hint: t('structured.errorIncomplete', { n: incomplete.index + 1 }),
      focus: {
        id: incomplete.row.id,
        field: incomplete.hasTerm ? 'explanation' : 'term',
      },
    };
  }

  const complete = meaningful;

  if (complete.length < MIN_STRUCTURED_ROWS) {
    return {
      ok: false,
      hint: t('structured.errorMin'),
      focus: { id: complete[0].row.id, field: 'term' },
    };
  }

  const seenQuestions = new Map();
  for (const entry of complete) {
    const key = questionKey(
      entry.term,
      entry.termImage,
      entry.explanation,
      entry.explanationImage,
    );
    if (seenQuestions.has(key)) {
      const first = seenQuestions.get(key);
      setStructuredRowErrors([first.row.id, entry.row.id]);
      return {
        ok: false,
        hint: t('structured.errorDuplicateQuestion', {
          first: first.index + 1,
          second: entry.index + 1,
        }),
        focus: { id: entry.row.id, field: 'term' },
      };
    }
    seenQuestions.set(key, entry);
  }

  return {
    ok: true,
    cards: complete.map((entry) => ({
      kind: 'definition',
      term: entry.term,
      definition: entry.explanation,
      termImage: entry.termImage,
      definitionImage: entry.explanationImage,
      source: structuredSourceText(entry.term, entry.explanation),
      sourceMode: 'structured',
    })),
  };
}

function addStructuredRow() {
  if (state.loading) return;

  if (state.structuredRows.length >= MAX_STRUCTURED_ROWS) {
    showHint(t('structured.errorMax', { n: MAX_STRUCTURED_ROWS }));
    return;
  }

  const row = createStructuredRow();
  state.structuredRows.push(row);
  clearHint();
  renderStructuredRows({ focusRowId: row.id });
  updateCounters();
  saveNotes();
  flashSaveStatus();
}

function removeStructuredRow(rowId) {
  if (state.loading) return;

  const index = state.structuredRows.findIndex((row) => row.id === rowId);
  if (index < 0) return;

  state.structuredRows.splice(index, 1);
  clearStructuredErrors();
  clearHint();
  renderStructuredRows();
  updateCounters();
  saveNotes();
  flashSaveStatus();
  els.btnAddRow.focus({ preventScroll: true });
}

/* ---------- Unggah & kompresi foto ---------- */

function loadImageSource(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      const error = new Error('decode');
      error.code = 'decode';
      reject(error);
    };
    image.src = url;
  });
}

/**
 * Kecilkan resolusi dan turunkan kualitas gambar sebelum disimpan sebagai
 * Base64. Target akhir di bawah IMAGE_TARGET_BYTES agar localStorage awet.
 */
async function compressImageFile(file) {
  if (!file || !String(file.type || '').startsWith('image/')) {
    const error = new Error('type');
    error.code = 'type';
    throw error;
  }

  if (file.size > MAX_IMAGE_SOURCE_BYTES) {
    const error = new Error('size');
    error.code = 'size';
    throw error;
  }

  const image = await loadImageSource(file);
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;

  if (!sourceWidth || !sourceHeight) {
    const error = new Error('decode');
    error.code = 'decode';
    throw error;
  }

  let scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(sourceWidth, sourceHeight));
  let quality = IMAGE_JPEG_QUALITY;
  let dataUrl = '';

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      const error = new Error('decode');
      error.code = 'decode';
      throw error;
    }

    // Latar putih mencegah area transparan menjadi hitam saat dikonversi ke JPEG.
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    dataUrl = canvas.toDataURL('image/jpeg', quality);

    if (dataUrlBytes(dataUrl) <= IMAGE_TARGET_BYTES) break;
    if (quality > 0.5) quality = Math.max(0.5, quality - 0.08);
    else scale *= 0.82;
  }

  if (!isImageDataUrl(dataUrl)) {
    const error = new Error('decode');
    error.code = 'decode';
    throw error;
  }

  return dataUrl;
}

function setRowImageBusy(rowEl, field, busy) {
  if (!rowEl) return;

  rowEl.classList.toggle('is-image-busy', busy);
  const wrap = rowEl.querySelector(`[data-field-wrap="${field}"]`);
  if (wrap) wrap.classList.toggle('is-image-busy', busy);

  const button = rowEl.querySelector(`[data-pick-image="${field}"]`);
  if (button) button.disabled = busy;

  if (busy && button) {
    const text = button.querySelector('span');
    if (text) text.textContent = t('structured.imageProcessing');
  }
}

function findStructuredRowElement(rowId) {
  return Array.from(els.structuredRows.children)
    .find((element) => element.dataset.rowId === rowId) || null;
}

async function applyImageFileToRow(rowId, field, file) {
  if (state.loading || !file || (field !== 'term' && field !== 'explanation')) return;

  const row = state.structuredRows.find((item) => item.id === rowId);
  const rowEl = findStructuredRowElement(rowId);
  if (!row || !rowEl) return;

  setRowImageBusy(rowEl, field, true);

  try {
    const dataUrl = await compressImageFile(file);
    const target = state.structuredRows.find((item) => item.id === rowId);
    if (!target) return;

    target[field === 'term' ? 'termImage' : 'explanationImage'] = dataUrl;
    clearStructuredErrors();
    clearHint();
    updateCounters();
    saveNotes();
    flashSaveStatus();
  } catch (error) {
    const key = error && error.code === 'size'
      ? 'structured.imageErrorSize'
      : error && error.code === 'type'
        ? 'structured.imageErrorType'
        : 'structured.imageErrorRead';
    showHint(t(key));
  } finally {
    const current = state.structuredRows.find((item) => item.id === rowId);
    const currentEl = findStructuredRowElement(rowId);
    if (currentEl) {
      setRowImageBusy(currentEl, field, false);
      if (current) renderRowImagePreview(currentEl, field, current);
    }
  }
}

function removeStructuredRowImage(rowId, field) {
  if (state.loading) return;

  const row = state.structuredRows.find((item) => item.id === rowId);
  if (!row || (field !== 'term' && field !== 'explanation')) return;

  row[field === 'term' ? 'termImage' : 'explanationImage'] = '';
  renderRowImagePreview(findStructuredRowElement(rowId), field, row);
  clearStructuredErrors();
  clearHint();
  updateCounters();
  saveNotes();
  flashSaveStatus();
}

function togglePanel(panel, active) {
  panel.hidden = !active;
  panel.classList.toggle('hidden', !active);
  panel.setAttribute('aria-hidden', String(!active));
}

function setInputMode(mode, { persist = true, focus = false } = {}) {
  const next = mode === 'structured' ? 'structured' : 'paste';
  state.inputMode = next;
  clearHint();

  els.modeButtons.forEach((button) => {
    const active = button.dataset.inputMode === next;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  });

  togglePanel(els.pastePanel, next === 'paste');
  togglePanel(els.structuredPanel, next === 'structured');
  els.tipsPaste.classList.toggle('hidden', next !== 'paste');
  els.tipsStructured.classList.toggle('hidden', next !== 'structured');

  updateCounters();

  if (next === 'structured') {
    window.requestAnimationFrame(autoGrowStructuredRows);
  }

  if (persist) saveNotes();
  if (focus) focusActiveInput();
}

function focusActiveInput() {
  if (state.inputMode === 'structured') {
    const first = state.structuredRows[0];
    if (first) focusStructuredCell(first.id, 'term');
    else els.btnAddRow.focus();
    return;
  }

  els.notes.focus();
}

/* ============================================================
   Penyusunan kuis
   ============================================================ */

/**
 * Ambil maksimal empat opsi unik berurutan dari pool asli. Blok empat baris
 * dipakai agar pengecoh tetap dekat dengan konteks jawaban. Posisi jawaban
 * benar sendiri diacak terpisah oleh randomizeAnswerPositions().
 * Jawaban benar tidak pernah dipakai sebagai pengecoh, pengecoh kembar
 * dibuang, dan opsi yang juga sah untuk pertanyaan yang sama (misalnya
 * jawaban baris lain dengan istilah dan foto identik) tidak dipakai.
 */
function buildOptionWindow(pool, correctOption, excludedKeys = null) {
  const correctKey = valueKey(correctOption.text, correctOption.image);
  const uniquePool = uniqueOptionPool(pool).filter((option) => {
    if (!excludedKeys || excludedKeys.size === 0) return true;
    const key = valueKey(option.text, option.image);
    return key === correctKey || !excludedKeys.has(key);
  });
  const lowerCorrect = String(correctOption.text ?? '').trim().toLowerCase();

  let correctIndex = uniquePool.findIndex(
    (option) => valueKey(option.text, option.image) === correctKey,
  );

  if (correctIndex < 0 && lowerCorrect) {
    correctIndex = uniquePool.findIndex(
      (option) => String(option.text ?? '').trim().toLowerCase() === lowerCorrect,
    );
  }

  if (correctIndex < 0) {
    const options = [
      { text: correctOption.text, image: correctOption.image },
      ...uniquePool
        .filter((option) => valueKey(option.text, option.image) !== correctKey)
        .slice(0, 3),
    ];
    return { options, answerIndex: 0 };
  }

  const windowSize = 4;
  const blockStart = Math.min(
    Math.floor(correctIndex / windowSize) * windowSize,
    Math.max(0, uniquePool.length - windowSize),
  );

  const options = uniquePool.slice(blockStart, blockStart + windowSize);
  const answerIndex = options.findIndex(
    (option) => valueKey(option.text, option.image) === correctKey,
  );

  return {
    options,
    answerIndex: answerIndex >= 0 ? answerIndex : 0,
  };
}

function optionFrom(text, image) {
  return { text: String(text ?? ''), image: normalizeImageValue(image) };
}

function uniqueOptionPool(items) {
  const seen = new Set();
  const result = [];

  items.forEach((item) => {
    const option = optionFrom(item.text, item.image);
    const key = valueKey(option.text, option.image);
    if (!key || seen.has(key)) return;
    seen.add(key);
    result.push(option);
  });

  return result;
}

function makeQuestion(card, cards) {
  const termPool = uniqueOptionPool(
    cards.map((item) => ({ text: item.term, image: item.termImage })),
  );

  const definitionPool = uniqueOptionPool(
    cards
      .filter((item) => item.kind === 'definition')
      .map((item) => ({ text: item.definition, image: item.definitionImage })),
  );

  // Pertanyaan dikenali dari istilah + fotonya. Jawaban milik baris lain
  // dengan pertanyaan yang sama tetap sah, jadi tidak boleh dipakai sebagai
  // pengecoh.
  const termIdentity = valueKey(card.term, card.termImage);
  const siblingDefinitions = new Set();
  cards.forEach((item) => {
    if (valueKey(item.term, item.termImage) === termIdentity) {
      siblingDefinitions.add(valueKey(item.definition, item.definitionImage));
    }
  });

  const termText = String(card.term ?? '').trim();
  const sourceLower = String(card.source ?? '').toLowerCase();
  const termIndex = termText ? sourceLower.indexOf(termText.toLowerCase()) : -1;
  const canCloze = termIndex >= 0 && termPool.length >= 2;
  const canMatch = card.kind === 'definition' && definitionPool.length >= 2;

  // Bila jawaban unik terlalu sedikit untuk tiga pengecoh, pakai cloze dari
  // istilah unik agar soal tetap punya empat opsi yang berbeda.
  const useCloze = canCloze
    && (!canMatch || (definitionPool.length < 4 && termPool.length >= 4));

  if (canMatch && !useCloze) {
    const correct = optionFrom(card.definition, card.definitionImage);
    const { options, answerIndex } = buildOptionWindow(definitionPool, correct, siblingDefinitions);

    return {
      type: 'match',
      term: card.term,
      termImage: normalizeImageValue(card.termImage),
      definition: card.definition,
      definitionImage: normalizeImageValue(card.definitionImage),
      context: null,
      options,
      answerIndex,
      note: card.definition,
      noteImage: normalizeImageValue(card.definitionImage),
    };
  }

  if (canCloze) {
    const blanked = `${card.source.slice(0, termIndex)}[____]${card.source.slice(termIndex + card.term.length)}`;
    const correct = optionFrom(card.term, card.termImage);
    const { options, answerIndex } = buildOptionWindow(termPool, correct);

    return {
      type: 'cloze',
      term: card.term,
      termImage: normalizeImageValue(card.termImage),
      context: `“${blanked}”`,
      options,
      answerIndex,
      note: card.source,
      noteImage: '',
    };
  }

  return null;
}

function questionPrompt(question) {
  if (question.type === 'cloze') return t('quiz.promptCloze');
  if (String(question.term ?? '').trim()) {
    return t('quiz.promptMatch', { term: question.term });
  }
  return t('quiz.promptImage');
}

function questionExplanationHtml(question) {
  if (question.type === 'cloze') {
    return `
      <p>${escapeHtml(t('quiz.explainCloze', { term: question.term }))}</p>
      ${imageMarkup(question.termImage, {
        alt: t('image.alt'),
        className: 'study-image feedback-image',
      })}`;
  }

  const termLabel = String(question.term ?? '').trim()
    ? `“${question.term}”`
    : t('image.termLabel');
  const definition = String(question.definition ?? '').trim();

  return `
    <p>${escapeHtml(termLabel)}${definition ? `: ${escapeHtml(definition)}` : ''}</p>
    ${imageMarkup(question.definitionImage, {
      alt: t('image.alt'),
      className: 'study-image feedback-image',
    })}`;
}

function buildQuiz(cards) {
  const questions = [];

  // Satu soal per kartu, tanpa batas jumlah. Urutan soal mengikuti input,
  // tetapi posisi jawaban benar diacak agar tidak membentuk pola A-B-C-D.
  cards.forEach((card) => {
    const question = makeQuestion(card, cards);
    if (question) questions.push(question);
  });

  randomizeAnswerPositions(questions);

  return questions;
}

/**
 * Acak ulang opsi satu soal tanpa kehilangan jawaban benar.
 * Opsi ditandai sebelum diacak agar indeks jawaban tetap terlacak dengan tepat.
 */
function shuffleQuestionOptions(question) {
  if (!Array.isArray(question.options) || question.options.length < 2) return;
  if (!Number.isInteger(question.answerIndex)) return;
  if (question.answerIndex < 0 || question.answerIndex >= question.options.length) return;

  const taggedOptions = question.options.map((option, index) => ({
    option,
    isCorrect: index === question.answerIndex,
  }));

  const shuffled = shuffleArray(taggedOptions);
  question.options = shuffled.map((entry) => entry.option);
  question.answerIndex = shuffled.findIndex((entry) => entry.isCorrect);
}

/** Acak ulang opsi untuk seluruh soal MCQ aktif. */
function shuffleQuizOptions() {
  state.quiz.forEach(shuffleQuestionOptions);
}

/**
 * Sebar posisi jawaban benar secara acak dan merata ke seluruh soal.
 *
 * Setiap soal memakai posisi yang paling jarang terpakai agar sebaran A–D
 * seimbang, dan posisi yang sama tidak dipakai dua soal berturut-turut.
 * Hasilnya bukan pola tetap, tetapi tetap acak setiap kuis disusun ulang.
 * Opsi hanya ditukar posisinya, jadi pengecoh tetap unik dan jawaban benar
 * tidak pernah hilang.
 */
function randomizeAnswerPositions(questions) {
  const usable = questions.filter(
    (question) => Array.isArray(question.options)
      && question.options.length >= 2
      && Number.isInteger(question.answerIndex)
      && question.answerIndex >= 0
      && question.answerIndex < question.options.length,
  );
  if (usable.length === 0) return;

  const usage = [0, 0, 0, 0];
  const targets = [];
  let previous = -1;

  usable.forEach((question) => {
    const size = Math.min(question.options.length, usage.length);
    const candidates = [];
    for (let position = 0; position < size; position += 1) {
      if (position !== previous) candidates.push(position);
    }

    const pool = candidates.length > 0 ? candidates : [0];
    const lowest = Math.min(...pool.map((position) => usage[position]));
    const choices = pool.filter((position) => usage[position] === lowest);
    const target = choices[Math.floor(Math.random() * choices.length)];

    usage[target] += 1;
    previous = target;
    targets.push(target);
  });

  breakSequentialRun(targets, usable);

  usable.forEach((question, index) => {
    const target = targets[index];
    if (target === question.answerIndex) return;

    const displaced = question.options[question.answerIndex];
    question.options[question.answerIndex] = question.options[target];
    question.options[target] = displaced;
    question.answerIndex = target;
  });
}

/** Hindari pola A-B-C-D (naik atau turun) pada empat soal pertama. */
function breakSequentialRun(targets, questions) {
  if (targets.length < 4) return;

  const step = (targets[1] - targets[0] + 4) % 4;
  if (step !== 1 && step !== 3) return;

  const isRun = [0, 1, 2, 3].every(
    (offset) => targets[offset] === (targets[0] + offset * step) % 4,
  );
  if (!isRun) return;

  // Tukar dua posisi pertama, tetapi hanya bila keduanya valid untuk soal
  // yang bersangkutan (soal bisa memiliki kurang dari empat opsi).
  const canSwap = targets[1] < questions[0].options.length
    && targets[0] < questions[1].options.length;
  if (canSwap) [targets[0], targets[1]] = [targets[1], targets[0]];
}

/* ============================================================
   Penyusunan kuis True / False
   ============================================================ */

/**
 * Cocokkan setiap pernyataan salah dengan penjelasan milik istilah lain.
 *
 * `blockedKeys` berisi penjelasan yang sah untuk pertanyaan tersebut
 * (termasuk penjelasan baris lain dengan istilah dan foto yang sama), supaya
 * pernyataan yang sebenarnya benar tidak pernah dilabeli salah.
 *
 * Memakai algoritma Kuhn (pencocokan bipartit) supaya satu penjelasan hanya
 * dipakai sebagai pengecoh satu kali. Soal yang tidak mendapat pasangan
 * dibiarkan -1 dan nanti berubah menjadi pernyataan benar.
 */
function matchTfDistractors(blockedKeys, definitions) {
  const heldBy = definitions.map(() => -1);
  const chosen = blockedKeys.map(() => -1);

  const tryAssign = (questionIndex, visited) => {
    for (let valueIndex = 0; valueIndex < definitions.length; valueIndex += 1) {
      if (visited[valueIndex]) continue;
      if (blockedKeys[questionIndex].has(definitions[valueIndex].key)) continue;

      visited[valueIndex] = true;
      if (heldBy[valueIndex] === -1 || tryAssign(heldBy[valueIndex], visited)) {
        heldBy[valueIndex] = questionIndex;
        chosen[questionIndex] = valueIndex;
        return true;
      }
    }

    return false;
  };

  blockedKeys.forEach((_, questionIndex) => {
    tryAssign(questionIndex, definitions.map(() => false));
  });

  return chosen;
}

/**
 * Susun pernyataan dari pasangan definisi (Istilah: penjelasan).
 *
 * Jumlah pernyataan benar dan salah dibuat seimbang (selisih maksimal satu).
 * Pernyataan salah memakai penjelasan milik istilah lain, dan setiap
 * penjelasan hanya boleh menjadi pengecoh satu kali dalam satu sesi. Jawaban
 * asli tetap boleh tampil pada pernyataan benarnya sendiri.
 *
 * Opsi `{ randomize: true }` dipakai tombol Acak untuk mengacak kombinasi,
 * pengecoh, dan urutan pernyataan.
 */
function buildTrueFalseQuestions(cards, { randomize = false } = {}) {
  const pairs = cards.filter((card) => card.kind === 'definition');
  if (pairs.length < 2) return [];

  // Satu entri per penjelasan unik (teks + foto). Bila beberapa istilah berbagi
  // penjelasan yang sama, istilah pertama dipakai sebagai pemilik untuk feedback.
  const definitions = [];
  const seenDefinitions = new Set();
  pairs.forEach((pair) => {
    const key = valueKey(pair.definition, pair.definitionImage);
    if (!key || seenDefinitions.has(key)) return;
    seenDefinitions.add(key);
    definitions.push({
      key,
      definition: pair.definition,
      image: normalizeImageValue(pair.definitionImage),
      term: pair.term,
      termImage: normalizeImageValue(pair.termImage),
    });
  });

  // Penjelasan milik istilah yang sama (termasuk baris lain dengan istilah
  // dan foto identik) tetap sah, jadi tidak boleh menjadi pengecoh salah.
  const blockedByTerm = new Map();
  pairs.forEach((pair) => {
    const termKey = valueKey(pair.term, pair.termImage);
    if (!blockedByTerm.has(termKey)) blockedByTerm.set(termKey, new Set());
    blockedByTerm.get(termKey).add(valueKey(pair.definition, pair.definitionImage));
  });

  // Pola benar/salah seimbang: 2 soal -> 1 benar, 3 soal -> 2 benar, dst.
  const trueTarget = Math.ceil(pairs.length / 2);
  const falseTarget = pairs.length - trueTarget;

  // Cari pengecoh unik untuk semua soal lebih dulu (bukan hanya soal yang
  // sudah ditandai salah), lalu pilih soal mana yang tampil sebagai salah.
  // Dengan begitu soal yang punya pengecoh tetap bisa menyeimbangkan jumlah
  // Benar/Salah walau ada penjelasan yang kembar.
  const pool = randomize ? shuffleArray(definitions) : definitions;
  const chosen = matchTfDistractors(
    pairs.map((pair) => blockedByTerm.get(valueKey(pair.term, pair.termImage))),
    pool,
  );
  const matched = pairs.map((_, index) => index).filter((index) => chosen[index] >= 0);

  let falseIndexes;

  if (randomize) {
    falseIndexes = shuffleArray(matched).slice(0, falseTarget);
  } else {
    // Pola bawaan: soal ke-2, ke-4, dst. menjadi pernyataan salah.
    falseIndexes = matched
      .filter((index) => index % 2 === 1)
      .slice(0, falseTarget);

    if (falseIndexes.length < falseTarget) {
      const filler = matched.filter((index) => !falseIndexes.includes(index));
      falseIndexes = falseIndexes.concat(filler.slice(0, falseTarget - falseIndexes.length));
    }
  }

  const mismatches = new Map();
  falseIndexes.forEach((pairIndex) => {
    mismatches.set(pairIndex, pool[chosen[pairIndex]]);
  });

  const questions = pairs.map((pair, index) => {
    const mismatch = mismatches.get(index);

    // Tidak ada penjelasan lain yang tersisa, jadi tampilkan pasangan aslinya.
    if (!mismatch) {
      return {
        term: pair.term,
        termImage: normalizeImageValue(pair.termImage),
        definition: pair.definition,
        definitionImage: normalizeImageValue(pair.definitionImage),
        isTrue: true,
        correctTerm: pair.term,
        correctTermImage: normalizeImageValue(pair.termImage),
        selected: undefined,
        correct: undefined,
      };
    }

    return {
      term: pair.term,
      termImage: normalizeImageValue(pair.termImage),
      definition: mismatch.definition,
      definitionImage: mismatch.image,
      isTrue: false,
      correctTerm: mismatch.term,
      correctTermImage: mismatch.termImage,
      selected: undefined,
      correct: undefined,
    };
  });

  return randomize ? shuffleArray(questions) : questions;
}

/* ============================================================
   Render: flashcard
   ============================================================ */

function renderCard(options = {}) {
  const { animate = true, resetFace = true } = options;
  const card = state.cards[state.cardIndex];
  if (!card) return;

  if (resetFace) resetFlip();

  els.cardCounter.textContent = t('card.counter', { i: state.cardIndex + 1, n: state.cards.length });
  els.cardProgress.style.width = `${((state.cardIndex + 1) / state.cards.length) * 100}%`;
  const isStructured = card.sourceMode === 'structured';
  els.cardBadge.textContent = isStructured
    ? t('card.termBadge')
    : card.kind === 'definition'
      ? t('card.questionBadge')
      : t('card.clozeBadge');
  els.cardNumber.textContent = String(state.cardIndex + 1);
  els.cardNumberBack.textContent = String(state.cardIndex + 1);

  let frontText;
  if (card.kind === 'definition') {
    frontText = isStructured
      ? card.term
      : t('card.question', { term: card.term });
  } else {
    frontText = `“${card.cloze}”`;
  }

  const frontImage = card.kind === 'definition' && isStructured
    ? normalizeImageValue(card.termImage)
    : '';

  els.cardFront.className = card.kind === 'definition'
    ? 'card-content card-content--question'
    : 'card-content card-content--cloze';
  els.cardFront.innerHTML = `
    ${frontText ? `<div class="card-text">${formatText(frontText)}</div>` : ''}
    ${imageMarkup(frontImage, { alt: t('image.alt'), className: 'study-image card-image' })}`;

  els.cardBack.className = 'card-content card-content--answer';
  if (card.kind === 'definition') {
    els.cardBack.innerHTML = `
      ${card.definition ? `<div class="card-text">${formatText(card.definition)}</div>` : ''}
      ${imageMarkup(card.definitionImage, {
        alt: t('image.alt'),
        className: 'study-image card-image',
      })}`;
  } else {
    els.cardBack.innerHTML = `
      <span class="text-xl font-extrabold">${escapeHtml(card.term)}</span>
      <span class="mt-2 block text-sm leading-relaxed text-white/80">${escapeHtml(card.definition)}</span>
    `;
  }

  els.cardPrev.disabled = state.cardIndex === 0;
  els.cardNext.disabled = state.cardIndex === state.cards.length - 1;
  els.cardFlip.textContent = t(state.flipped ? 'card.showQuestion' : 'card.flip');

  // Animasi halus saat kartu berganti.
  if (animate) {
    els.flashcard.classList.remove('card-swap');
    void els.flashcard.offsetWidth;
    els.flashcard.classList.add('card-swap');
  }
}

function resetFlip() {
  state.flipped = false;
  els.flashcard.classList.remove('is-flipped');
  els.flashcard.setAttribute('aria-pressed', 'false');
  els.cardFlip.textContent = t('card.flip');
}

function toggleFlip() {
  state.flipped = !state.flipped;
  els.flashcard.classList.toggle('is-flipped', state.flipped);
  els.flashcard.setAttribute('aria-pressed', String(state.flipped));
  els.cardFlip.textContent = t(state.flipped ? 'card.showQuestion' : 'card.flip');
}

function goToCard(step) {
  const next = state.cardIndex + step;
  if (next < 0 || next >= state.cards.length) return;
  state.cardIndex = next;
  renderCard();
}

/** Acak urutan flashcard tanpa mengubah isi catatan atau data kartu. */
function shuffleCards() {
  if (state.cards.length < 2) return;

  const current = state.cards[state.cardIndex];
  state.cards = shuffleArray(state.cards);

  // Pastikan kartu yang tampil benar-benar berbeda dari kartu sebelumnya.
  if (state.cards[0] === current) {
    const swapIndex = 1 + Math.floor(Math.random() * (state.cards.length - 1));
    [state.cards[0], state.cards[swapIndex]] = [state.cards[swapIndex], state.cards[0]];
  }

  state.cardIndex = 0;
  renderCard();
}

/* ============================================================
   Render: kuis
   ============================================================ */

function renderQuizQuestion() {
  const question = state.quiz[state.quizIndex];
  if (!question) return;

  const answered = Boolean(question.timedOut)
    || (question.selected !== undefined && question.selected !== null);
  state.answered = answered;

  els.quizCounter.textContent = t('quiz.counter', { i: state.quizIndex + 1, n: state.quiz.length });
  els.quizScore.textContent = t('quiz.score', { n: state.score });
  renderQuizStreak();
  els.quizProgress.style.width = `${((state.quizIndex + (answered ? 1 : 0)) / state.quiz.length) * 100}%`;

  els.quizPrompt.innerHTML = `
    <span>${escapeHtml(questionPrompt(question))}</span>
    ${imageMarkup(question.termImage, {
      alt: t('image.alt'),
      className: 'study-image quiz-image',
    })}`;

  if (question.context) {
    els.quizContext.innerHTML = formatText(question.context);
    els.quizContext.classList.remove('hidden');
  } else {
    els.quizContext.innerHTML = '';
    els.quizContext.classList.add('hidden');
  }

  els.quizOptions.innerHTML = question.options
    .map(
      (option, index) => `
        <button type="button" class="quiz-option" data-index="${index}">
          <span class="option-key">${'ABCD'[index] || index + 1}</span>
          <span class="option-body flex-1">
            ${option.text ? `<span class="option-text">${escapeHtml(option.text)}</span>` : ''}
            ${imageMarkup(option.image, {
              alt: t('image.alt'),
              className: 'study-image option-image',
            })}
          </span>
        </button>`,
    )
    .join('');

  els.quizFeedback.className = 'quiz-feedback mt-4 hidden';
  els.quizFeedback.innerHTML = '';
  els.quizNext.classList.add('hidden');
  els.quizNextHint.classList.add('hidden');

  // Saat bahasa diganti di tengah kuis, jawaban yang sudah dipilih tetap ditampilkan.
  if (answered) paintAnswer(question);
  ensureTimerForQuestion(quizTimer);
}

function selectAnswer(index) {
  if (state.answered) return;

  const question = state.quiz[state.quizIndex];
  if (!question || index < 0 || index >= question.options.length) return;

  state.answered = true;
  question.selected = index;
  question.timedOut = false;
  question.correct = index === question.answerIndex;
  stopTimer(quizTimer, { deactivate: false });

  if (question.correct) {
    state.score += 1;
    state.streak += 1;
  } else {
    state.streak = 0;
  }

  els.quizScore.textContent = t('quiz.score', { n: state.score });
  renderQuizStreak({ bump: question.correct });
  els.quizProgress.style.width = `${((state.quizIndex + 1) / state.quiz.length) * 100}%`;

  paintAnswer(question);
}

function paintAnswer(question) {
  Array.from(els.quizOptions.children).forEach((button, buttonIndex) => {
    button.disabled = true;
    if (buttonIndex === question.answerIndex) button.classList.add('is-correct');
    else if (buttonIndex === question.selected) button.classList.add('is-wrong');
    else button.classList.add('is-dim');
  });

  const feedbackTitle = question.correct
    ? t('quiz.correctTitle')
    : question.timedOut
      ? t('timer.timeUpTitle')
      : t('quiz.wrongTitle');

  els.quizFeedback.className = `quiz-feedback mt-4 animate-in ${question.correct ? 'is-correct' : 'is-wrong'}`;
  els.quizFeedback.innerHTML = `
    <p class="font-extrabold">${feedbackTitle}</p>
    ${question.timedOut ? `<p class="mt-1 font-semibold">${t('timer.timeUpNote')}</p>` : ''}
    <div class="quiz-feedback-body mt-1">${questionExplanationHtml(question)}</div>
  `;

  els.quizNext.textContent = state.quizIndex === state.quiz.length - 1
    ? t('quiz.seeResult')
    : t('quiz.next');
  els.quizNext.classList.remove('hidden');
  els.quizNextHint.classList.remove('hidden');
}

function nextQuestion() {
  if (!state.answered) return;
  cancelTimerAdvance(quizTimer);

  if (state.quizIndex >= state.quiz.length - 1) {
    showQuizResult();
    return;
  }

  state.quizIndex += 1;
  renderQuizQuestion();
}

function scoreCopy(percent) {
  if (percent >= 90) return { title: 'result.great', text: 'result.greatText' };
  if (percent >= 70) return { title: 'result.good', text: 'result.goodText' };
  if (percent >= 50) return { title: 'result.ok', text: 'result.okText' };
  return { title: 'result.low', text: 'result.lowText' };
}

function showQuizResult({ celebrate = true } = {}) {
  const total = state.quiz.length;
  const percent = total ? Math.round((state.score / total) * 100) : 0;

  resetTimer(quizTimer);
  state.streak = 0;
  renderQuizStreak();

  els.quizBody.classList.add('hidden');
  els.quizResult.classList.remove('hidden');
  els.quizResult.classList.remove('animate-in');
  void els.quizResult.offsetWidth;
  els.quizResult.classList.add('animate-in');

  els.resultRing.style.setProperty('--p', String(percent));
  els.resultPercent.textContent = `${percent}%`;

  const copy = scoreCopy(percent);

  els.resultTitle.textContent = t(copy.title);
  els.resultText.textContent = t('result.summary', {
    score: state.score,
    total,
    text: t(copy.text),
  });

  const missed = state.quiz.filter((question) => question.correct === false);
  els.resultReview.innerHTML = missed.length
    ? `
      <p class="text-xs font-extrabold uppercase tracking-wider text-slate-400">${t('quiz.reviewLabel')}</p>
      <ul class="mt-2 space-y-2">
        ${missed
          .map(
            (question) => `
          <li class="rounded-xl bg-rose-50/80 px-3.5 py-2.5 text-xs leading-relaxed text-rose-700 ring-1 ring-rose-100">
            <span class="font-extrabold">${escapeHtml(
              String(question.term ?? '').trim() || t('image.termLabel'),
            )}</span>
            ${imageMarkup(question.termImage, {
              alt: t('image.alt'),
              className: 'study-image review-image',
            })}
            <span class="mt-1 block text-rose-600/90">${escapeHtml(question.note || '')}</span>
            ${imageMarkup(question.noteImage, {
              alt: t('image.alt'),
              className: 'study-image review-image',
            })}
          </li>`,
          )
          .join('')}
      </ul>`
    : '';

  updateCelebration(els.quizCelebration, percent, celebrate);
}

function resetQuiz() {
  state.quizIndex = 0;
  state.score = 0;
  state.streak = 0;
  state.answered = false;
  state.quiz.forEach((question) => {
    question.correct = undefined;
    question.selected = undefined;
    question.timedOut = false;
  });
  resetTimer(quizTimer);

  renderQuizStreak();
  stopConfetti();
  els.quizCelebration.hidden = true;
  els.quizResult.classList.add('hidden');
  els.quizBody.classList.remove('hidden');
}

/** Acak urutan soal dan opsi, reset progres, lalu mulai lagi dari soal pertama. */
function shuffleQuiz() {
  if (state.quiz.length < 2) return;

  const current = state.quiz[state.quizIndex];
  state.quiz = shuffleArray(state.quiz);

  // Pastikan soal baru tidak sama dengan soal yang sedang tampil.
  if (state.quiz[0] === current) {
    const swapIndex = 1 + Math.floor(Math.random() * (state.quiz.length - 1));
    [state.quiz[0], state.quiz[swapIndex]] = [state.quiz[swapIndex], state.quiz[0]];
  }

  shuffleQuizOptions();
  resetQuiz();
  renderQuizQuestion();
}

/* ============================================================
   Render: kuis True / False
   ============================================================ */

function renderTfQuestion() {
  const question = state.tf[state.tfIndex];
  if (!question) return;

  const answered = Boolean(question.timedOut)
    || (question.selected !== undefined && question.selected !== null);
  state.tfAnswered = answered;

  els.tfCounter.textContent = t('tf.counter', { i: state.tfIndex + 1, n: state.tf.length });
  els.tfScore.textContent = t('quiz.score', { n: state.tfScore });
  renderTfStreak();
  els.tfProgress.style.width = `${((state.tfIndex + (answered ? 1 : 0)) / state.tf.length) * 100}%`;

  els.tfTerm.innerHTML = `
    ${question.term ? escapeHtml(question.term) : ''}
    ${imageMarkup(question.termImage, {
      alt: t('image.alt'),
      className: 'study-image tf-image',
    })}`;
  els.tfDefinition.innerHTML = `
    ${question.definition ? escapeHtml(question.definition) : ''}
    ${imageMarkup(question.definitionImage, {
      alt: t('image.alt'),
      className: 'study-image tf-image',
    })}`;

  [els.tfTrue, els.tfFalse].forEach((button) => {
    button.disabled = false;
    button.classList.remove('is-selected', 'is-correct', 'is-wrong', 'is-dim');
  });

  els.tfFeedback.className = 'quiz-feedback mt-4 hidden';
  els.tfFeedback.innerHTML = '';
  els.tfNext.classList.add('hidden');
  els.tfNextHint.classList.add('hidden');

  // Saat bahasa diganti, jawaban yang sudah dipilih tetap ditampilkan.
  if (answered) paintTfAnswer(question);
  ensureTimerForQuestion(tfTimer);
}

function selectTfAnswer(answer) {
  if (state.tfAnswered) return;

  const question = state.tf[state.tfIndex];
  if (!question) return;

  state.tfAnswered = true;
  question.selected = answer;
  question.timedOut = false;
  question.correct = answer === question.isTrue;
  stopTimer(tfTimer, { deactivate: false });

  if (question.correct) {
    state.tfScore += 1;
    state.tfStreak += 1;
  } else {
    state.tfStreak = 0;
  }

  els.tfScore.textContent = t('quiz.score', { n: state.tfScore });
  renderTfStreak({ bump: question.correct });
  els.tfProgress.style.width = `${((state.tfIndex + 1) / state.tf.length) * 100}%`;

  paintTfAnswer(question);
}

function paintTfAnswer(question) {
  [
    { button: els.tfTrue, value: true },
    { button: els.tfFalse, value: false },
  ].forEach(({ button, value }) => {
    button.disabled = true;
    button.classList.remove('is-selected', 'is-correct', 'is-wrong', 'is-dim');

    if (question.timedOut) {
      button.classList.add(value === question.isTrue ? 'is-correct' : 'is-dim');
    } else if (value === question.selected) {
      button.classList.add('is-selected');
      button.classList.add(question.correct ? 'is-correct' : 'is-wrong');
    } else {
      button.classList.add('is-dim');
    }
  });

  const feedbackTitle = question.correct
    ? t('tf.correctTitle')
    : question.timedOut
      ? t('timer.timeUpTitle')
      : t('tf.wrongTitle');

  els.tfFeedback.className = `quiz-feedback mt-4 animate-in ${question.correct ? 'is-correct' : 'is-wrong'}`;
  const termLabel = String(question.term ?? '').trim() || t('image.termLabel');
  const ownerLabel = String(question.correctTerm ?? '').trim() || t('image.termLabel');

  els.tfFeedback.innerHTML = `
    <p class="font-extrabold">${feedbackTitle}</p>
    ${question.timedOut ? `<p class="mt-1 font-semibold">${t('timer.timeUpNote')}</p>` : ''}
    <p class="mt-1">${escapeHtml(
      question.isTrue
        ? t('tf.explainTrue', { term: termLabel })
        : t('tf.explainFalse', { term: termLabel, correctTerm: ownerLabel }),
    )}</p>
    ${question.isTrue ? '' : imageMarkup(question.correctTermImage, {
      alt: t('image.alt'),
      className: 'study-image feedback-image',
    })}
  `;

  els.tfNext.textContent = state.tfIndex === state.tf.length - 1
    ? t('quiz.seeResult')
    : t('quiz.next');
  els.tfNext.classList.remove('hidden');
  els.tfNextHint.classList.remove('hidden');
}

function nextTfQuestion() {
  if (!state.tfAnswered) return;
  cancelTimerAdvance(tfTimer);

  if (state.tfIndex >= state.tf.length - 1) {
    showTfResult();
    return;
  }

  state.tfIndex += 1;
  renderTfQuestion();
}

function showTfResult({ celebrate = true } = {}) {
  const total = state.tf.length;
  const percent = total ? Math.round((state.tfScore / total) * 100) : 0;

  resetTimer(tfTimer);
  state.tfStreak = 0;
  renderTfStreak();

  els.tfBody.classList.add('hidden');
  els.tfResult.classList.remove('hidden');
  els.tfResult.classList.remove('animate-in');
  void els.tfResult.offsetWidth;
  els.tfResult.classList.add('animate-in');

  els.tfResultRing.style.setProperty('--p', String(percent));
  els.tfResultPercent.textContent = `${percent}%`;

  const copy = scoreCopy(percent);

  els.tfResultTitle.textContent = t(copy.title);
  els.tfResultText.textContent = t('result.summary', {
    score: state.tfScore,
    total,
    text: t(copy.text),
  });

  updateCelebration(els.tfCelebration, percent, celebrate);
}

function resetTf() {
  state.tfIndex = 0;
  state.tfScore = 0;
  state.tfStreak = 0;
  state.tfAnswered = false;
  state.tf.forEach((question) => {
    question.selected = undefined;
    question.correct = undefined;
    question.timedOut = false;
  });
  resetTimer(tfTimer);

  renderTfStreak();
  stopConfetti();
  els.tfCelebration.hidden = true;
  els.tfResult.classList.add('hidden');
  els.tfBody.classList.remove('hidden');
}

/** Acak ulang kombinasi + urutan soal T/F, lalu mulai dari awal. */
function shuffleTf() {
  const questions = buildTrueFalseQuestions(state.cards, { randomize: true });
  if (questions.length === 0) return;

  state.tf = questions;
  resetTf();
  renderTfQuestion();
}

/* ============================================================
   Streak & konfeti
   ============================================================ */

let confettiFrame = null;
let celebrationTimer = null;

/**
 * Perbarui chip streak. Indikator hanya tampil saat streak >= 2.
 * `bump` dipakai untuk animasi kecil setiap kali streak bertambah.
 */
function renderStreak(element, valueElement, value, { bump = false } = {}) {
  if (!element || !valueElement) return;

  const active = value >= 2;
  element.hidden = !active;
  element.classList.toggle('is-active', active);
  element.title = t('streak.title');

  if (!active) {
    element.removeAttribute('aria-label');
    element.classList.remove('is-bump');
    return;
  }

  valueElement.textContent = String(value);
  element.setAttribute('aria-label', t('streak.aria', { n: value }));

  if (bump) {
    element.classList.remove('is-bump');
    void element.offsetWidth;
    element.classList.add('is-bump');
  }
}

function renderQuizStreak(options = {}) {
  renderStreak(els.quizStreak, els.quizStreakValue, state.streak, options);
}

function renderTfStreak(options = {}) {
  renderStreak(els.tfStreak, els.tfStreakValue, state.tfStreak, options);
}

/**
 * Tampilkan badge selebrasi dan jalankan konfeti untuk skor >= 80%.
 * `celebrate=false` dipakai saat re-render bahasa agar konfeti tidak diulang.
 */
function updateCelebration(badge, percent, celebrate) {
  const shouldCelebrate = percent >= 80;
  badge.hidden = !shouldCelebrate;

  if (!shouldCelebrate) {
    if (celebrate) stopConfetti();
    return;
  }

  if (celebrate) launchConfetti(percent);
}

function announceCelebration(percent) {
  if (!els.celebrationStatus) return;

  window.clearTimeout(celebrationTimer);
  els.celebrationStatus.textContent = '';
  celebrationTimer = window.setTimeout(() => {
    els.celebrationStatus.textContent = t('celebrate.announce', { percent });
    celebrationTimer = null;
  }, 80);
}

/** Hentikan animasi konfeti dan bersihkan canvas. Aman dipanggil berkali-kali. */
function stopConfetti() {
  if (confettiFrame !== null) {
    window.cancelAnimationFrame(confettiFrame);
    confettiFrame = null;
  }

  window.clearTimeout(celebrationTimer);
  celebrationTimer = null;
  if (els.celebrationStatus) els.celebrationStatus.textContent = '';

  const canvas = els.confettiCanvas;
  if (!canvas) return;

  const context = canvas.getContext('2d');
  if (context) {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
  }

  canvas.hidden = true;
}

/** Efek konfeti ringan: satu canvas, satu loop RAF, lalu hilang otomatis. */
function launchConfetti(percent) {
  const canvas = els.confettiCanvas;
  if (!canvas) return;

  const reducedMotion = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    stopConfetti();
    announceCelebration(percent);
    return;
  }

  stopConfetti();

  const context = canvas.getContext('2d');
  if (!context) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  canvas.hidden = false;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  const palette = ['#4f46e5', '#7c3aed', '#c026d3', '#f59e0b', '#10b981', '#0ea5e9', '#f43f5e'];
  const pieces = Array.from({ length: 110 }, () => ({
    x: Math.random() * width,
    y: -20 - Math.random() * height * 0.35,
    vx: (Math.random() - 0.5) * 2.2,
    vy: 2.4 + Math.random() * 3.4,
    size: 5 + Math.random() * 6,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.22,
    color: palette[Math.floor(Math.random() * palette.length)],
    shape: Math.random() < 0.28 ? 'circle' : 'rect',
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.02 + Math.random() * 0.03,
  }));

  const duration = 3600;
  const startedAt = performance.now();
  let lastFrameAt = startedAt;
  announceCelebration(percent);

  function drawFrame(now) {
    const elapsed = now - startedAt;
    const delta = Math.min((now - lastFrameAt) / (1000 / 60), 3);
    lastFrameAt = now;

    const fade = elapsed > duration - 600
      ? Math.max(0, (duration - elapsed) / 600)
      : 1;

    context.clearRect(0, 0, width, height);
    context.globalAlpha = fade;

    pieces.forEach((piece) => {
      piece.x += (piece.vx + Math.sin(piece.sway) * 0.8) * delta;
      piece.y += piece.vy * delta;
      piece.vy += 0.035 * delta;
      piece.angle += piece.spin * delta;
      piece.sway += piece.swaySpeed * delta;

      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.angle);
      context.fillStyle = piece.color;

      if (piece.shape === 'circle') {
        context.beginPath();
        context.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
        context.fill();
      } else {
        context.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
      }

      context.restore();
    });

    if (elapsed >= duration) {
      stopConfetti();
      return;
    }

    confettiFrame = window.requestAnimationFrame(drawFrame);
  }

  confettiFrame = window.requestAnimationFrame(drawFrame);
}

/* ============================================================
   Timer kuis
   ============================================================ */

const TIMER_DURATIONS = [5, 10, 30, 60];
const TIMER_FEEDBACK_DELAY = 1300;

function createTimerController({ button, menu, progress, options, isAvailable, onTimeout }) {
  return {
    button,
    menu,
    progress,
    options,
    isAvailable,
    onTimeout,
    duration: 0,
    remaining: 0,
    running: false,
    deadline: 0,
    frame: null,
    advanceTimer: null,
  };
}

const quizTimer = createTimerController({
  button: els.quizTimer,
  menu: els.quizTimerMenu,
  progress: els.quizTimerProgress,
  options: els.quizTimerOptions,
  isAvailable: () => state.quiz.length > 0
    && !state.answered
    && !els.tabQuiz.classList.contains('hidden')
    && !els.quizBody.classList.contains('hidden')
    && els.quizResult.classList.contains('hidden'),
  onTimeout: handleQuizTimeout,
});

const tfTimer = createTimerController({
  button: els.tfTimer,
  menu: els.tfTimerMenu,
  progress: els.tfTimerProgress,
  options: els.tfTimerOptions,
  isAvailable: () => state.tf.length > 0
    && !state.tfAnswered
    && !els.tabTf.classList.contains('hidden')
    && !els.tfBody.classList.contains('hidden')
    && els.tfResult.classList.contains('hidden'),
  onTimeout: handleTfTimeout,
});

// Status awal: timer nonaktif sampai ada soal yang siap dikerjakan.
syncTimerAvailability(quizTimer);
syncTimerAvailability(tfTimer);

function timerFraction(controller) {
  if (controller.duration <= 0) return 0;
  return Math.max(0, Math.min(1, controller.remaining / (controller.duration * 1000)));
}

function paintTimer(controller) {
  const fraction = timerFraction(controller);
  controller.progress.style.strokeDashoffset = String(100 - fraction * 100);
  controller.button.classList.toggle('is-low', controller.running && fraction <= 0.25);
}

function syncTimerOptions(controller) {
  controller.options.forEach((option) => {
    const seconds = Number(option.dataset.seconds);
    const selected = controller.duration === seconds;
    option.textContent = t('timer.seconds', { n: seconds });
    option.classList.toggle('is-selected', selected);
    option.setAttribute('aria-checked', String(selected));
  });
}

function refreshTimerLabels(controller) {
  controller.button.setAttribute('aria-label', t('timer.button'));
  controller.button.title = t('timer.button');
  controller.menu.setAttribute('aria-label', t('timer.menu'));

  const title = controller.menu.querySelector('.timer-menu-title');
  if (title) title.textContent = t('timer.menuTitle');

  syncTimerOptions(controller);
}

function closeTimerMenu(controller, { restoreFocus = false } = {}) {
  if (!controller.menu) return false;

  const wasOpen = !controller.menu.hidden;
  controller.menu.hidden = true;
  controller.button.setAttribute('aria-expanded', 'false');

  if (wasOpen && restoreFocus) controller.button.focus();
  return wasOpen;
}

function closeAllTimerMenus(options = {}) {
  const quizClosed = closeTimerMenu(quizTimer, options);
  const tfClosed = closeTimerMenu(tfTimer, options);
  return quizClosed || tfClosed;
}

function isTimerMenuOpen() {
  return !quizTimer.menu.hidden || !tfTimer.menu.hidden;
}

function openTimerMenu(controller) {
  if (controller.button.disabled) return;

  closeAllTimerMenus();
  syncTimerOptions(controller);
  controller.menu.hidden = false;
  controller.button.setAttribute('aria-expanded', 'true');
}

function toggleTimerMenu(controller) {
  if (controller.menu.hidden) {
    openTimerMenu(controller);
  } else {
    closeTimerMenu(controller);
  }
}

function syncTimerAvailability(controller) {
  const available = controller.isAvailable();
  controller.button.disabled = !available;

  if (!available) closeTimerMenu(controller);
}

function cancelTimerAdvance(controller) {
  if (controller.advanceTimer === null) return;

  window.clearTimeout(controller.advanceTimer);
  controller.advanceTimer = null;
}

function scheduleTimerAdvance(controller, callback) {
  cancelTimerAdvance(controller);
  controller.advanceTimer = window.setTimeout(() => {
    controller.advanceTimer = null;
    callback();
  }, TIMER_FEEDBACK_DELAY);
}

function stopTimer(controller, { deactivate = false } = {}) {
  controller.running = false;

  if (controller.frame !== null) {
    window.cancelAnimationFrame(controller.frame);
    controller.frame = null;
  }

  cancelTimerAdvance(controller);
  closeTimerMenu(controller);
  controller.button.classList.remove('is-low');

  if (deactivate) {
    controller.duration = 0;
    controller.remaining = 0;
    controller.progress.style.strokeDashoffset = '100';
    controller.button.classList.remove('is-active', 'is-low', 'is-timeout');
    syncTimerOptions(controller);
  } else {
    controller.button.classList.remove('is-timeout');
    paintTimer(controller);
    syncTimerOptions(controller);
  }

  syncTimerAvailability(controller);
}

function resetTimer(controller) {
  stopTimer(controller, { deactivate: true });
}

function startTimer(controller, seconds) {
  if (!controller.isAvailable() || !TIMER_DURATIONS.includes(seconds)) return;

  stopTimer(controller, { deactivate: false });

  controller.duration = seconds;
  controller.remaining = seconds * 1000;
  controller.deadline = performance.now() + controller.remaining;
  controller.running = true;

  controller.button.classList.add('is-active');
  controller.button.classList.remove('is-low', 'is-timeout');
  closeTimerMenu(controller);
  syncTimerOptions(controller);
  paintTimer(controller);
  syncTimerAvailability(controller);

  controller.frame = window.requestAnimationFrame((now) => tickTimer(controller, now));
}

function tickTimer(controller, now) {
  if (!controller.running) return;

  controller.remaining = Math.max(0, controller.deadline - now);
  paintTimer(controller);

  if (controller.remaining <= 0) {
    finishTimer(controller);
    return;
  }

  controller.frame = window.requestAnimationFrame((nextNow) => tickTimer(controller, nextNow));
}

function finishTimer(controller) {
  if (!controller.running) return;

  controller.remaining = 0;
  controller.running = false;

  if (controller.frame !== null) {
    window.cancelAnimationFrame(controller.frame);
    controller.frame = null;
  }

  cancelTimerAdvance(controller);
  controller.progress.style.strokeDashoffset = '100';
  controller.button.classList.remove('is-low');
  controller.button.classList.add('is-timeout');
  closeTimerMenu(controller);
  controller.onTimeout(controller);
}

function selectTimerDuration(controller, seconds) {
  if (!controller.isAvailable() || !TIMER_DURATIONS.includes(seconds)) return;

  startTimer(controller, seconds);
  controller.button.focus({ preventScroll: true });
}

function ensureTimerForQuestion(controller) {
  syncTimerAvailability(controller);

  if (!controller.isAvailable()) {
    if (controller.running) stopTimer(controller, { deactivate: false });
    return;
  }

  if (controller.duration > 0 && !controller.running) {
    startTimer(controller, controller.duration);
  }
}

function handleQuizTimeout(controller) {
  const question = state.quiz[state.quizIndex];
  if (!question || state.answered) return;

  state.answered = true;
  question.selected = null;
  question.correct = false;
  question.timedOut = true;
  state.streak = 0;

  els.quizScore.textContent = t('quiz.score', { n: state.score });
  renderQuizStreak();
  els.quizProgress.style.width = `${((state.quizIndex + 1) / state.quiz.length) * 100}%`;
  paintAnswer(question);
  syncTimerAvailability(controller);
  scheduleTimerAdvance(controller, advanceQuizAfterTimeout);
}

function advanceQuizAfterTimeout() {
  const question = state.quiz[state.quizIndex];
  if (!state.answered || !question || !question.timedOut) return;

  if (state.quizIndex >= state.quiz.length - 1) {
    showQuizResult();
    return;
  }

  state.quizIndex += 1;
  renderQuizQuestion();
}

function handleTfTimeout(controller) {
  const question = state.tf[state.tfIndex];
  if (!question || state.tfAnswered) return;

  state.tfAnswered = true;
  question.selected = null;
  question.correct = false;
  question.timedOut = true;
  state.tfStreak = 0;

  els.tfScore.textContent = t('quiz.score', { n: state.tfScore });
  renderTfStreak();
  els.tfProgress.style.width = `${((state.tfIndex + 1) / state.tf.length) * 100}%`;
  paintTfAnswer(question);
  syncTimerAvailability(controller);
  scheduleTimerAdvance(controller, advanceTfAfterTimeout);
}

function advanceTfAfterTimeout() {
  const question = state.tf[state.tfIndex];
  if (!state.tfAnswered || !question || !question.timedOut) return;

  if (state.tfIndex >= state.tf.length - 1) {
    showTfResult();
    return;
  }

  state.tfIndex += 1;
  renderTfQuestion();
}

/* ============================================================
   Render: keseluruhan
   ============================================================ */

function updateStats() {
  els.statCards.textContent = t('stats.cards', { n: state.cards.length });
  els.statQuiz.textContent = t('stats.questions', { n: state.quiz.length });
  els.stats.classList.remove('hidden');
}

function switchTab(tabName) {
  stopConfetti();

  els.tabButtons.forEach((button) => {
    const active = button.dataset.tab === tabName;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });

  els.tabCards.classList.toggle('hidden', tabName !== 'cards');
  els.tabQuiz.classList.toggle('hidden', tabName !== 'quiz');
  els.tabTf.classList.toggle('hidden', tabName !== 'tf');

  if (tabName !== 'quiz') resetTimer(quizTimer);
  if (tabName !== 'tf') resetTimer(tfTimer);

  closeAllTimerMenus();
  if (tabName === 'quiz') syncTimerAvailability(quizTimer);
  if (tabName === 'tf') syncTimerAvailability(tfTimer);
}

function renderWorkspace() {
  const hasCards = state.cards.length > 0;

  els.studyEmpty.classList.toggle('hidden', hasCards);
  els.studyPanels.classList.toggle('hidden', !hasCards);
  updateStats();
  els.cardShuffle.disabled = state.cards.length < 2;
  els.quizShuffle.disabled = state.quiz.length < 2;
  els.btnShuffleResult.disabled = state.quiz.length < 2;
  els.tfShuffle.disabled = state.tf.length < 2;
  els.btnTfShuffleResult.disabled = state.tf.length < 2;

  if (!hasCards) return;

  state.cardIndex = 0;
  renderCard();

  resetQuiz();
  if (state.quiz.length > 0) {
    els.quizEmpty.classList.add('hidden');
    renderQuizQuestion();
  } else {
    els.quizBody.classList.add('hidden');
    els.quizResult.classList.add('hidden');
    els.quizEmpty.classList.remove('hidden');
  }

  resetTf();
  if (state.tf.length > 0) {
    els.tfEmpty.classList.add('hidden');
    renderTfQuestion();
  } else {
    els.tfBody.classList.add('hidden');
    els.tfResult.classList.add('hidden');
    els.tfEmpty.classList.remove('hidden');
  }

  switchTab('cards');
}

/* ============================================================
   Tema warna aksen (v10.0)
   ============================================================ */

let themeMenuOpen = false;

function getThemeOptionButtons() {
  if (!els.themeOptions) return [];
  return Array.from(els.themeOptions.querySelectorAll('.theme-option'));
}

function focusThemeOption(button) {
  if (!button) return;
  getThemeOptionButtons().forEach((option) => {
    option.tabIndex = -1;
  });
  button.tabIndex = 0;
  button.focus();
}

function refreshThemeUi() {
  const theme = THEMES.find((item) => item.id === currentTheme) || THEMES[0];

  if (els.themeCurrentSwatch) {
    els.themeCurrentSwatch.style.setProperty('--swatch', theme.swatch);
  }

  if (els.themeCurrentName) {
    els.themeCurrentName.textContent = t(`theme.${theme.id}`);
  }

  if (els.themeToggle) {
    const label = t('theme.title');
    els.themeToggle.title = label;
    els.themeToggle.setAttribute('aria-label', label);
  }

  if (els.themeOptions) {
    els.themeOptions.setAttribute('aria-label', t('theme.title'));
    getThemeOptionButtons().forEach((option) => {
      const isSelected = option.dataset.theme === currentTheme;
      const name = option.querySelector('.theme-name');
      if (name) name.textContent = t(`theme.${option.dataset.theme}`);
      option.classList.toggle('is-selected', isSelected);
      option.setAttribute('aria-selected', String(isSelected));
      option.tabIndex = isSelected ? 0 : -1;
    });
  }
}

function applyTheme(themeId, options = {}) {
  const { persist = true } = options;
  const theme = THEMES.find((item) => item.id === themeId);
  currentTheme = theme ? theme.id : DEFAULT_THEME;

  document.documentElement.dataset.theme = currentTheme;
  refreshThemeUi();

  if (persist) {
    try {
      window.localStorage.setItem(THEME_KEY, currentTheme);
    } catch (error) {
      // Penyimpanan diblokir: tema hanya berlaku untuk sesi ini.
    }
  }
}

function buildThemeOptions() {
  if (!els.themeOptions) return;

  els.themeOptions.innerHTML = '';
  THEMES.forEach((theme) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'theme-option';
    option.dataset.theme = theme.id;
    option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', 'false');
    option.tabIndex = -1;

    const dot = document.createElement('span');
    dot.className = 'theme-dot';
    dot.style.setProperty('--swatch', theme.swatch);
    dot.setAttribute('aria-hidden', 'true');

    const name = document.createElement('span');
    name.className = 'theme-name';

    const check = document.createElement('span');
    check.className = 'theme-check';
    check.setAttribute('aria-hidden', 'true');
    check.textContent = '\u2713';

    option.append(dot, name, check);
    option.addEventListener('click', () => {
      applyTheme(theme.id);
      closeThemeMenu({ focusToggle: true });
    });

    els.themeOptions.append(option);
  });
}

function openThemeMenu(position = 'selected') {
  if (!els.themeMenu || !els.themeToggle) return;

  const options = getThemeOptionButtons();
  if (options.length === 0) return;

  els.themeMenu.hidden = false;
  els.themeMenu.classList.add('is-open');
  els.themeToggle.setAttribute('aria-expanded', 'true');
  themeMenuOpen = true;

  let index = options.findIndex((option) => option.dataset.theme === currentTheme);
  if (index < 0) index = 0;
  if (position === 'last') index = options.length - 1;

  focusThemeOption(options[index]);
}

function closeThemeMenu(options = {}) {
  const { focusToggle = false } = options;
  if (!els.themeMenu || !els.themeToggle) return;

  els.themeMenu.hidden = true;
  els.themeMenu.classList.remove('is-open');
  els.themeToggle.setAttribute('aria-expanded', 'false');
  themeMenuOpen = false;

  if (focusToggle) els.themeToggle.focus();
}

function toggleThemeMenu() {
  if (themeMenuOpen) {
    closeThemeMenu({ focusToggle: true });
  } else {
    openThemeMenu();
  }
}

function handleThemeMenuKeydown(event) {
  const options = getThemeOptionButtons();
  if (options.length === 0) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    closeThemeMenu({ focusToggle: true });
    return;
  }

  if (event.key === 'Tab') {
    closeThemeMenu();
    return;
  }

  const currentIndex = options.indexOf(document.activeElement);
  let nextIndex = -1;

  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % options.length;
  } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    nextIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
  } else if (event.key === 'Home') {
    nextIndex = 0;
  } else if (event.key === 'End') {
    nextIndex = options.length - 1;
  }

  if (nextIndex >= 0) {
    event.preventDefault();
    focusThemeOption(options[nextIndex]);
  }
}

/* ============================================================
   Bahasa
   ============================================================ */

function applyLanguage(nextLang, options = {}) {
  const { persist = true } = options;
  lang = nextLang === 'en' ? 'en' : 'id';

  document.documentElement.lang = lang;
  document.title = t('app.title');
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', t('app.meta'));

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    element.innerHTML = t(element.dataset.i18nHtml);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nAria));
  });

  els.langButtons.forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  refreshThemeUi();

  disarmClear();
  clearHint();

  refreshTimerLabels(quizTimer);
  refreshTimerLabels(tfTimer);

  renderStructuredRows();
  updateCounters();
  updateStats();
  setLoading(state.loading);

  if (state.cards.length > 0) {
    renderCard({ animate: false, resetFace: false });

    if (!els.quizResult.classList.contains('hidden')) {
      showQuizResult({ celebrate: false });
    } else if (state.quiz.length > 0) {
      renderQuizQuestion();
    }

    if (!els.tfResult.classList.contains('hidden')) {
      showTfResult({ celebrate: false });
    } else if (state.tf.length > 0) {
      renderTfQuestion();
    }
  }

  if (persist) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      // Penyimpanan diblokir: preferensi hanya berlaku untuk sesi ini.
    }
  }
}

/* ============================================================
   Aksi utama
   ============================================================ */

function updateCounters() {
  const value = els.notes.value;
  const points = value.split(/\r?\n/).filter((line) => line.trim().length > 0).length;
  const completeRows = countCompleteStructuredRows();

  els.charCount.textContent = t('input.chars', { n: value.length });
  els.lineCount.textContent = t('input.points', { n: points });
  els.structuredCount.textContent = t('structured.count', {
    complete: completeRows,
    total: state.structuredRows.length,
  });

  const pasteActive = state.inputMode === 'paste';
  els.pasteCounts.classList.toggle('hidden', !pasteActive);
  els.structuredCount.classList.toggle('hidden', pasteActive);
}

function showHint(message, type = 'error') {
  els.formHint.textContent = message;
  els.formHint.className = `form-hint${type === 'success' ? ' is-success' : ''}`;
}

function clearHint() {
  els.formHint.textContent = '';
  els.formHint.className = 'form-hint hidden';
}

function setLoading(loading) {
  state.loading = loading;
  els.btnGenerate.disabled = loading;
  els.btnSample.disabled = loading;
  els.btnExport.disabled = loading;
  els.btnImport.disabled = loading;
  els.btnAddRow.disabled = loading;
  els.notes.disabled = loading;

  els.modeButtons.forEach((button) => {
    button.disabled = loading;
  });

  els.structuredRows.querySelectorAll(
    '.structured-input, .row-remove, .image-btn, .image-remove, .structured-image-input',
  ).forEach((field) => {
    field.disabled = loading;
  });

  els.generateSpinner.classList.toggle('hidden', !loading);
  els.generateIcon.classList.toggle('hidden', loading);
  els.generateLabel.textContent = loading ? t('input.loading') : t('input.generate');
}

/* ============================================================
   Penyimpanan catatan (auto-save, ekspor, impor)
   ============================================================ */

let saveTimer = null;
let saveStatusTimer = null;
let clearArmed = false;
let clearTimer = null;
let lastSaveSucceeded = true;

function structuredRowsForStorage() {
  return state.structuredRows.map((row) => ({
    term: row.term,
    explanation: row.explanation,
    termImage: normalizeImageValue(row.termImage),
    explanationImage: normalizeImageValue(row.explanationImage),
  }));
}

let saveQuotaWarned = false;

function isQuotaError(error) {
  return Boolean(error) && (
    error.name === 'QuotaExceededError'
    || error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    || error.code === 22
    || error.code === 1014
  );
}

function saveNotes() {
  try {
    window.localStorage.setItem(
      NOTES_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        inputMode: state.inputMode,
        notes: els.notes.value,
        structured: structuredRowsForStorage(),
        updatedAt: new Date().toISOString(),
      }),
    );
    saveQuotaWarned = false;
    lastSaveSucceeded = true;
  } catch (error) {
    // localStorage bisa diblokir; aplikasi tetap berjalan tanpa auto-save.
    lastSaveSucceeded = false;
    if (!saveQuotaWarned && isQuotaError(error)) {
      saveQuotaWarned = true;
      showHint(t('storage.quota'));
    }
  }
}

function scheduleSave() {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    saveTimer = null;
    saveNotes();
    flashSaveStatus();
  }, 350);
}

function flashSaveStatus() {
  if (!els.saveStatus || !lastSaveSucceeded) return;

  els.saveStatus.classList.add('is-visible');
  window.clearTimeout(saveStatusTimer);
  saveStatusTimer = window.setTimeout(() => {
    els.saveStatus.classList.remove('is-visible');
  }, 1900);
}

function readSavedInput() {
  const fallback = { inputMode: 'paste', notes: '', structured: null };

  try {
    const raw = window.localStorage.getItem(NOTES_KEY);
    if (!raw) return fallback;

    try {
      const parsed = JSON.parse(raw);

      if (typeof parsed === 'string') {
        return { ...fallback, notes: parsed };
      }

      if (!parsed || typeof parsed !== 'object') return fallback;

      return {
        inputMode: parsed.inputMode === 'structured' ? 'structured' : 'paste',
        notes: typeof parsed.notes === 'string'
          ? parsed.notes
          : typeof parsed.text === 'string'
            ? parsed.text
            : '',
        structured: Array.isArray(parsed.structured)
          ? normalizeStructuredRows(parsed.structured)
          : null,
      };
    } catch (error) {
      return { ...fallback, notes: raw }; // cadangan untuk data lama berupa teks biasa
    }
  } catch (error) {
    return fallback;
  }
}

function clearSavedNotes() {
  window.clearTimeout(saveTimer);
  saveTimer = null;

  try {
    window.localStorage.removeItem(NOTES_KEY);
  } catch (error) {
    // abaikan
  }
}

/** Pasang kartu yang sudah divalidasi lalu segarkan seluruh area belajar. */
function applyCards(cards) {
  state.cards = cards;
  state.quiz = buildQuiz(cards);
  state.tf = buildTrueFalseQuestions(cards);
  state.cardIndex = 0;
  state.quizIndex = 0;
  state.score = 0;
  state.streak = 0;
  state.answered = false;
  state.tfIndex = 0;
  state.tfScore = 0;
  state.tfStreak = 0;
  state.tfAnswered = false;

  renderWorkspace();
}

/** Muat kembali kedua mode input lalu susun materi dari mode yang aktif. */
function restoreSavedInput() {
  const saved = readSavedInput();

  els.notes.value = saved.notes;
  const hasStructuredContent = Array.isArray(saved.structured)
    && saved.structured.some(
      (row) => fieldHasContent(row.term, row.termImage)
        || fieldHasContent(row.explanation, row.explanationImage),
    );
  const hasSavedContent = saved.notes.trim().length > 0 || hasStructuredContent;
  state.structuredRows = saved.structured === null || !hasSavedContent
    ? createEmptyStructuredRows()
    : saved.structured;

  renderStructuredRows();
  setInputMode(saved.inputMode, { persist: false });
  updateCounters();

  const cards = state.inputMode === 'structured'
    ? buildStructuredCards()
    : buildCards(extractSegments(saved.notes));

  if (cards.length < 2) return;

  applyCards(cards);
}

function dateStamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function buildExportData() {
  const answered = state.quiz.filter(
    (question) => question.timedOut
      || (question.selected !== undefined && question.selected !== null),
  ).length;

  return {
    app: 'AI Study Buddy',
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    language: lang,
    inputMode: state.inputMode,
    notes: els.notes.value,
    structured: structuredRowsForStorage(),
    summary: {
      cards: state.cards.length,
      questions: state.quiz.length,
      answered,
      correct: state.score,
      trueFalse: state.tf.length,
      structuredRows: countCompleteStructuredRows(),
    },
    cards: state.cards.map((card) => ({
      kind: card.kind,
      term: card.term,
      definition: card.definition,
      source: card.source,
      sourceMode: card.sourceMode || 'paste',
      termImage: normalizeImageValue(card.termImage),
      definitionImage: normalizeImageValue(card.definitionImage),
      ...(card.cloze ? { cloze: card.cloze } : {}),
    })),
    quiz: state.quiz.map((question) => ({
      type: question.type,
      term: question.term,
      termImage: normalizeImageValue(question.termImage),
      definition: question.definition ?? null,
      definitionImage: normalizeImageValue(question.definitionImage),
      context: question.context ?? null,
      options: question.options,
      answerIndex: question.answerIndex,
      note: question.note,
      noteImage: normalizeImageValue(question.noteImage),
      selected: question.selected ?? null,
      correct: question.correct ?? null,
      timedOut: Boolean(question.timedOut),
    })),
    trueFalse: state.tf.map((question) => ({
      term: question.term,
      termImage: normalizeImageValue(question.termImage),
      definition: question.definition,
      definitionImage: normalizeImageValue(question.definitionImage),
      isTrue: question.isTrue,
      correctTerm: question.correctTerm,
      correctTermImage: normalizeImageValue(question.correctTermImage),
      selected: question.selected ?? null,
      correct: question.correct ?? null,
      timedOut: Boolean(question.timedOut),
    })),
  };
}

function exportNotes() {
  if (!hasInputData()) {
    showHint(t('storage.emptyExport'));
    return;
  }

  const payload = JSON.stringify(buildExportData(), null, 2);
  const blob = new Blob([payload], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `ai-study-buddy-${dateStamp()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  showHint(t('storage.exported'), 'success');
}

function importFromText(text, fileName = '') {
  const content = String(text ?? '').trim();
  if (!content) {
    showHint(t('storage.invalidFile'));
    return;
  }

  const isJson = /\.json$/i.test(fileName)
    || (!/\.(txt|md)$/i.test(fileName) && content.startsWith('{'));

  let data = null;
  if (isJson) {
    try {
      data = JSON.parse(content);
    } catch (error) {
      showHint(t('storage.invalidJson'));
      return;
    }

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      showHint(t('storage.invalidFile'));
      return;
    }
  }

  let notes = content;
  let importedStructured = null;
  let inputMode = 'paste';

  if (isJson) {
    notes = typeof data.notes === 'string'
      ? data.notes
      : typeof data.text === 'string'
        ? data.text
        : '';

    if (Array.isArray(data.structured)) {
      importedStructured = normalizeStructuredRows(data.structured);
    }

    // File v7 dan file teks selalu kembali ke mode tempel; file v8/v9 membawa mode aktifnya.
    inputMode = data.inputMode === 'structured' ? 'structured' : 'paste';
  }

  const importedRows = importedStructured === null ? [] : importedStructured;
  const hasImportedData = notes.trim().length > 0
    || importedRows.some(
      (row) => fieldHasContent(row.term, row.termImage)
        || fieldHasContent(row.explanation, row.explanationImage),
    );

  if (!hasImportedData) {
    showHint(t('storage.invalidFile'));
    return;
  }

  els.notes.value = notes;

  if (importedStructured !== null) {
    state.structuredRows = importedStructured;
  }

  clearStructuredErrors();
  renderStructuredRows();
  setInputMode(inputMode, { persist: false });
  updateCounters();
  saveNotes();

  if (!generate()) return;

  showHint(t('storage.imported', { name: fileName || 'JSON' }), 'success');
}

function handleFileChange(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if (!file) return;

  if (file.size > MAX_IMPORT_BYTES) {
    showHint(t('storage.fileTooLarge'));
    return;
  }

  const reader = new FileReader();
  reader.onload = () => importFromText(reader.result, file.name);
  reader.onerror = () => showHint(t('storage.readError'));
  reader.readAsText(file);
}

function disarmClear() {
  clearArmed = false;
  window.clearTimeout(clearTimer);
  els.btnClear.classList.remove('is-armed');
  els.clearLabel.textContent = t('storage.clear');
}

function handleClearClick() {
  if (!clearArmed) {
    clearArmed = true;
    els.btnClear.classList.add('is-armed');
    els.clearLabel.textContent = t('storage.clearConfirm');
    window.clearTimeout(clearTimer);
    clearTimer = window.setTimeout(disarmClear, 4000);
    return;
  }

  disarmClear();
  startOver();
}

function countMeaningfulChars(text) {
  return String(text ?? '').replace(/[^\p{L}\p{N}]+/gu, '').length;
}

function generate() {
  if (state.loading) return false;
  disarmClear();
  clearHint();

  let source;

  if (state.inputMode === 'structured') {
    const result = validateStructuredRows();

    if (!result.ok) {
      showHint(result.hint);
      if (result.focus) focusStructuredCell(result.focus.id, result.focus.field);
      else els.btnAddRow.focus();
      return false;
    }

    source = { mode: 'structured', cards: result.cards };
  } else {
    const raw = els.notes.value.trim();

    if (!raw) {
      showHint(t('hint.empty'));
      els.notes.focus();
      return false;
    }

    if (countMeaningfulChars(raw) < MIN_NOTE_MEANINGFUL_CHARS) {
      showHint(t('hint.short'));
      els.notes.focus();
      return false;
    }

    source = { mode: 'paste', raw };
  }

  saveNotes();
  setLoading(true);

  // Jeda singkat supaya terasa seperti sedang menganalisis materi.
  generateTimer = window.setTimeout(() => {
    generateTimer = null;

    try {
      const cards = source.mode === 'structured'
        ? source.cards
        : buildCards(extractSegments(source.raw));

      if (cards.length < 2) {
        showHint(source.mode === 'structured' ? t('structured.errorMin') : t('hint.fewCards'));
        return;
      }

      applyCards(cards);
      els.studyPanels.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      console.error('Gagal menyusun materi:', error);
      showHint(t('hint.error'));
    } finally {
      setLoading(false);
    }
  }, 520);

  return true;
}

function loadSample() {
  clearHint();

  if (state.inputMode === 'structured') {
    const sample = lang === 'en' ? SAMPLE_STRUCTURED_EN : SAMPLE_STRUCTURED;
    state.structuredRows = sample.map((row) => createStructuredRow(row.term, row.explanation));
    clearStructuredErrors();
    renderStructuredRows();
    updateCounters();
    focusActiveInput();
  } else {
    els.notes.value = lang === 'en' ? SAMPLE_NOTES_EN : SAMPLE_NOTES;
    updateCounters();
    els.notes.focus();
    els.notes.setSelectionRange(0, 0);
    els.notes.scrollTop = 0;
  }

  saveNotes();
  flashSaveStatus();
  generate();
}

function startOver() {
  if (generateTimer) {
    window.clearTimeout(generateTimer);
    generateTimer = null;
    setLoading(false);
  }

  disarmClear();
  clearSavedNotes();
  els.saveStatus.classList.remove('is-visible');

  state.cards = [];
  state.quiz = [];
  state.tf = [];
  state.cardIndex = 0;
  state.quizIndex = 0;
  state.score = 0;
  state.streak = 0;
  state.answered = false;
  state.tfIndex = 0;
  state.tfScore = 0;
  state.tfStreak = 0;
  state.tfAnswered = false;

  resetTimer(quizTimer);
  resetTimer(tfTimer);
  renderQuizStreak();
  renderTfStreak();
  stopConfetti();
  els.quizCelebration.hidden = true;
  els.tfCelebration.hidden = true;

  els.notes.value = '';
  state.structuredRows = createEmptyStructuredRows();
  clearStructuredErrors();
  renderStructuredRows();
  updateCounters();
  clearHint();
  els.studyPanels.classList.add('hidden');
  els.studyEmpty.classList.remove('hidden');
  updateStats();
  focusActiveInput();
}

function retryQuiz() {
  // Setiap kali kuis diulang, posisi jawaban benar diacak lagi tanpa
  // mengubah urutan soal.
  randomizeAnswerPositions(state.quiz);
  resetQuiz();
  renderQuizQuestion();
}

function retryTf() {
  resetTf();
  renderTfQuestion();
}

/* ============================================================
   Event listener
   ============================================================ */

els.notes.addEventListener('input', () => {
  updateCounters();
  scheduleSave();
});

els.modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.inputMode === state.inputMode) return;
    setInputMode(button.dataset.inputMode, { focus: true });
  });

  button.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();

    const modes = els.modeButtons.map((item) => item.dataset.inputMode);
    const current = modes.indexOf(state.inputMode);
    let next = current;

    if (event.key === 'ArrowRight') next = (current + 1) % modes.length;
    else if (event.key === 'ArrowLeft') next = (current - 1 + modes.length) % modes.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = modes.length - 1;

    if (next !== current) {
      setInputMode(modes[next], { focus: false });
      els.modeButtons[next].focus();
    }
  });
});

els.btnAddRow.addEventListener('click', addStructuredRow);

els.structuredRows.addEventListener('input', (event) => {
  const field = event.target instanceof Element
    ? event.target.closest('.structured-input')
    : null;
  if (!field) return;

  const rowEl = field.closest('.structured-row');
  if (!rowEl) return;

  const row = state.structuredRows.find((item) => item.id === rowEl.dataset.rowId);
  if (!row) return;

  const name = field.dataset.field;
  if (name !== 'term' && name !== 'explanation') return;

  row[name] = field.value;
  autoGrowTextarea(field);
  clearStructuredErrors();
  clearHint();
  updateCounters();
  scheduleSave();
});

els.structuredRows.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;

  const removeRow = event.target.closest('[data-remove-row]');
  if (removeRow) {
    removeStructuredRow(removeRow.dataset.removeRow);
    return;
  }

  const pickImage = event.target.closest('[data-pick-image]');
  if (pickImage) {
    const rowEl = pickImage.closest('.structured-row');
    const field = pickImage.dataset.pickImage;
    const input = rowEl
      ? rowEl.querySelector(`[data-image-input="${field}"]`)
      : null;
    if (input) input.click();
    return;
  }

  const removeImage = event.target.closest('[data-remove-image]');
  if (removeImage) {
    removeStructuredRowImage(removeImage.dataset.rowId, removeImage.dataset.removeImage);
  }
});

els.structuredRows.addEventListener('change', (event) => {
  const input = event.target instanceof Element
    ? event.target.closest('[data-image-input]')
    : null;
  if (!input) return;

  const file = input.files && input.files[0];
  input.value = '';
  if (!file) return;

  const rowEl = input.closest('.structured-row');
  if (!rowEl) return;

  void applyImageFileToRow(rowEl.dataset.rowId, input.dataset.imageInput, file);
});

els.structuredRows.addEventListener('dragover', (event) => {
  const field = event.target instanceof Element
    ? event.target.closest('.structured-field')
    : null;
  if (!field) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  field.classList.add('is-dragover');
});

els.structuredRows.addEventListener('dragleave', (event) => {
  const field = event.target instanceof Element
    ? event.target.closest('.structured-field')
    : null;
  if (!field) return;
  if (event.relatedTarget instanceof Node && field.contains(event.relatedTarget)) return;
  field.classList.remove('is-dragover');
});

els.structuredRows.addEventListener('drop', (event) => {
  const field = event.target instanceof Element
    ? event.target.closest('.structured-field')
    : null;
  if (!field) return;
  event.preventDefault();
  field.classList.remove('is-dragover');

  const rowEl = field.closest('.structured-row');
  const file = event.dataTransfer && event.dataTransfer.files
    ? event.dataTransfer.files[0]
    : null;
  if (!rowEl || !file) return;

  void applyImageFileToRow(rowEl.dataset.rowId, field.dataset.fieldWrap, file);
});

// Cegah browser membuka file bila foto terlepas di luar kolom formulir.
function isFileDrag(event) {
  const types = event.dataTransfer && event.dataTransfer.types;
  return Boolean(types) && Array.prototype.includes.call(types, 'Files');
}

document.addEventListener('dragover', (event) => {
  if (isFileDrag(event)) event.preventDefault();
});

document.addEventListener('drop', (event) => {
  if (isFileDrag(event)) event.preventDefault();
});

els.btnGenerate.addEventListener('click', generate);
els.btnSample.addEventListener('click', loadSample);
els.btnNew.addEventListener('click', startOver);
els.btnNew2.addEventListener('click', startOver);
els.btnRetry.addEventListener('click', retryQuiz);
els.btnShuffleResult.addEventListener('click', shuffleQuiz);

els.btnClear.addEventListener('click', handleClearClick);
els.btnExport.addEventListener('click', exportNotes);
els.btnImport.addEventListener('click', () => els.fileInput.click());
els.fileInput.addEventListener('change', handleFileChange);

window.addEventListener('beforeunload', saveNotes);

els.flashcard.addEventListener('click', toggleFlip);
els.flashcard.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleFlip();
  }
});

els.cardFlip.addEventListener('click', toggleFlip);
els.cardShuffle.addEventListener('click', shuffleCards);
els.cardPrev.addEventListener('click', () => goToCard(-1));
els.cardNext.addEventListener('click', () => goToCard(1));

els.quizOptions.addEventListener('click', (event) => {
  const button = event.target.closest('.quiz-option');
  if (!button) return;
  selectAnswer(Number(button.dataset.index));
});

els.quizNext.addEventListener('click', nextQuestion);
els.quizShuffle.addEventListener('click', shuffleQuiz);
els.quizTimer.addEventListener('click', () => toggleTimerMenu(quizTimer));
els.quizTimerOptions.forEach((option) => {
  option.addEventListener('click', () => {
    selectTimerDuration(quizTimer, Number(option.dataset.seconds));
  });
});

els.tfTrue.addEventListener('click', () => selectTfAnswer(true));
els.tfFalse.addEventListener('click', () => selectTfAnswer(false));
els.tfNext.addEventListener('click', nextTfQuestion);
els.tfShuffle.addEventListener('click', shuffleTf);
els.tfTimer.addEventListener('click', () => toggleTimerMenu(tfTimer));
els.tfTimerOptions.forEach((option) => {
  option.addEventListener('click', () => {
    selectTimerDuration(tfTimer, Number(option.dataset.seconds));
  });
});
els.btnTfRetry.addEventListener('click', retryTf);
els.btnTfShuffleResult.addEventListener('click', shuffleTf);
els.btnTfNew.addEventListener('click', startOver);

document.addEventListener('click', (event) => {
  const target = event.target;
  if (target instanceof Element && target.closest('.timer-control')) return;
  closeAllTimerMenus();
});

els.tabButtons.forEach((button) => {
  button.addEventListener('click', () => switchTab(button.dataset.tab));
});

els.langButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.lang === lang) return;
    applyLanguage(button.dataset.lang);
  });
});

if (els.themeToggle) {
  els.themeToggle.addEventListener('click', toggleThemeMenu);
  els.themeToggle.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openThemeMenu('selected');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openThemeMenu('last');
    } else if (event.key === 'Escape' && themeMenuOpen) {
      event.preventDefault();
      closeThemeMenu({ focusToggle: true });
    }
  });
}

if (els.themeMenu) {
  els.themeMenu.addEventListener('keydown', handleThemeMenuKeydown);
}

document.addEventListener('click', (event) => {
  const target = event.target;
  if (target instanceof Element && target.closest('.theme-picker')) return;
  if (themeMenuOpen) closeThemeMenu();
});

/* ============================================================
   Gulir area input dengan panah atas/bawah (v8.4)
   ============================================================ */

const INPUT_SCROLL_STEP = 72;

function canScroll(element) {
  return Boolean(element) && element.scrollHeight - element.clientHeight > 1;
}

/**
 * Panah atas/bawah hanya menggulir area input yang sedang aktif.
 * Mode tempel memakai scrollbar internal textarea, sedangkan mode
 * terstruktur memakai kontainer baris. Di layar sempit baris formulir
 * mengalir ke halaman, jadi halaman itulah yang digulir.
 */
function resolveInputScrollTarget(mode) {
  if (mode === 'paste') {
    return canScroll(els.notes) ? els.notes : null;
  }

  const rows = els.structuredRows;
  if (!rows) return null;

  const overflowY = window.getComputedStyle(rows).overflowY;
  if (overflowY === 'visible' || overflowY === 'hidden') {
    const page = document.scrollingElement;
    return canScroll(page) ? page : null;
  }

  return canScroll(rows) ? rows : null;
}

function handleInputAreaScroll(event) {
  if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return false;
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return false;
  if (event.isComposing) return false;
  if (isTimerMenuOpen()) return false;

  const active = document.activeElement;
  const panel = active instanceof Element ? active.closest('.mode-panel') : null;
  if (!panel || panel.hidden) return false;

  const mode = panel === els.structuredPanel ? 'structured' : 'paste';
  if (mode !== state.inputMode) return false;

  const target = resolveInputScrollTarget(mode);
  if (!target) return false;

  event.preventDefault();
  target.scrollTop += event.key === 'ArrowUp' ? -INPUT_SCROLL_STEP : INPUT_SCROLL_STEP;
  return true;
}

document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'Escape' && closeAllTimerMenus({ restoreFocus: true })) return;
  if (isTimerMenuOpen()) return;
  if (themeMenuOpen) return;
  if (handleInputAreaScroll(event)) return;

  const tag = (document.activeElement?.tagName || '').toLowerCase();
  if (['input', 'textarea', 'select'].includes(tag)) return;
  if (els.studyPanels.classList.contains('hidden')) return;

  const cardsVisible = !els.tabCards.classList.contains('hidden');
  const quizVisible = !els.tabQuiz.classList.contains('hidden');
  const tfVisible = !els.tabTf.classList.contains('hidden');

  if (cardsVisible) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToCard(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToCard(-1);
    } else if ((event.key === ' ' || event.key === 'Enter') && tag !== 'button' && tag !== 'a') {
      event.preventDefault();
      toggleFlip();
    }
    return;
  }

  if (quizVisible && !els.quizBody.classList.contains('hidden')) {
    const choices = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
    const key = event.key.toLowerCase();

    if (Object.prototype.hasOwnProperty.call(choices, key)) {
      event.preventDefault();
      selectAnswer(choices[key]);
    } else if (
      event.key === 'ArrowRight'
      && !event.shiftKey
      && !event.repeat
      && state.answered
      && !els.quizNext.classList.contains('hidden')
    ) {
      event.preventDefault();
      nextQuestion();
    }
  }

  if (tfVisible && !els.tfBody.classList.contains('hidden')) {
    const key = event.key.toLowerCase();

    if (key === 't' || key === 'b') {
      event.preventDefault();
      selectTfAnswer(true);
    } else if (key === 'f' || key === 's') {
      event.preventDefault();
      selectTfAnswer(false);
    } else if (
      event.key === 'ArrowRight'
      && !event.shiftKey
      && !event.repeat
      && state.tfAnswered
      && !els.tfNext.classList.contains('hidden')
    ) {
      event.preventDefault();
      nextTfQuestion();
    }
  }
});

/* ============================================================
   Inisialisasi
   ============================================================ */

state.structuredRows = createEmptyStructuredRows();
renderStructuredRows();
setInputMode('paste', { persist: false });
updateCounters();
renderWorkspace();
buildThemeOptions();
applyTheme(currentTheme, { persist: false });
applyLanguage(lang, { persist: false });
restoreSavedInput();

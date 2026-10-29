import type { Article } from '@/lib/types';

export const articles: Article[] = [
  {
    id: 'a01',
    slug: 'pemerintah-targetkan-pertumbuhan-ekonomi-5-2-persen-2027',
    title:
      'Pemerintah Targetkan Pertumbuhan Ekonomi 5,2 Persen pada 2027',
    excerpt:
      'Kementerian Keuangan memproyeksikan lonjakan investasi dan ekspor sebagai mesin utama pertumbuhan, dengan fokus pada hilirisasi dan ekonomi hijau.',
    content: [
      { type: 'paragraph', text: 'Pemerintah menetapkan target pertumbuhan ekonomi sebesar 5,2 persen untuk tahun 2027, angka yang dinilai ambisius namun realistis mengingat momentum transformasi struktural yang sedang berjalan. Kementerian Keuangan menyatakan proyeksi tersebut didukung oleh peningkatan investasi di sektor hulu migas serta dorongan ekonomi hijau.' },
      { type: 'heading', text: 'Sektor andalan hilirisasi' },
      { type: 'paragraph', text: 'Hilirisasi mineral menjadi salah satu pilar utama. Dengan beroperasinya sejumlah smelter nikel dan tembaga, nilai ekspor produk olahan diprediksi melonjak dibanding ekspor mentah. Pemerintah meyakini kebijakan ini akan menambah lapangan kerja dan nilai tambah di dalam negeri.' },
      { type: 'quote', text: 'Kami melihat ada momentum yang sangat baik. Investasi terus mengalir, dan daya beli masyarakat perlahan pulih sejalan dengan pengendalian inflasi.' },
      { type: 'paragraph', text: 'Namun, ekonom senior mengingatkan bahwa target tersebut rentan terhadap tekanan eksternal. Fluktuasi harga komoditas dan kebijakan perdagangan mitra besar dapat mengganggu proyeksi. Oleh karena itu, penguatan pasar domestik tetap menjadi prioritas.' },
      { type: 'heading', text: 'Optimisme pasar' },
      { type: 'paragraph', text: 'Pasar modal menyambut positif target tersebut. Indeks saham menguat tipis pada penutupan perdagangan, seiring dengan kinerja emiten sektor tambang dan perbankan yang diproyeksikan menjadi penerima manfaat langsung dari rencana investasi pemerintah.' },
    ],
    category: 'ekonomi',
    author: {
      id: 'u01',
      name: 'Rangga Pratama',
      role: 'Reporter Ekonomi',
      avatarUrl: 'https://picsum.photos/seed/author-rangga/96/96',
    },
    publishedAt: '2026-10-28T07:30:00+07:00',
    readTime: 4,
    thumbnailUrl: 'https://picsum.photos/seed/economy-growth-2027/1200/675',
    thumbnailAlt: 'Ilustrasi grafik pertumbuhan ekonomi',
    tags: ['ekonomi', 'pertumbuhan', 'investasi', 'hilirisasi'],
    isBreaking: true,
    isFeatured: true,
  },
  {
    id: 'a02',
    slug: 'kepala-negara-tekankan-penguatan-diplomasi-di-kawasan-asia-tenggara',
    title:
      'Kepala Negara Tekankan Penguatan Diplomasi di Kawasan Asia Tenggara',
    excerpt:
      'Dalam forum regional, Indonesia mendorong penguatan kerja sama ASEAN guna menjaga stabilitas politik dan ekonomi kawasan di tengah ketegangan global.',
    content: [
      { type: 'paragraph', text: 'Kepala Negara menegaskan komitmen Indonesia untuk memperkuat diplomasi bilateral dan multilateral di kawasan Asia Tenggara. Pesan itu disampaikan dalam pertemuan puncak dengan para pemimpin ASEAN yang membahas ketegangan geopolitik global dan dampaknya terhadap kawasan.' },
      { type: 'heading', text: 'ASEAN sebagai jangkar stabilitas' },
      { type: 'paragraph', text: 'Indonesia mendorong agar ASEAN tetap menjadi sentral dalam menjawab tantangan keamanan. Pendekatan diplomasi inklusif dinilai penting agar kawasan tidak terjebak dalam rivalitas kekuatan besar. Sejumlah negara menyambut baik inisiatif ini.' },
      { type: 'quote', text: 'Kawasan ini harus menjadi penentu, bukan sekadar panggung bagi kepentingan kekuatan besar.' },
      { type: 'paragraph', text: 'Selain isu politik, kerja sama ekonomi digital juga menjadi agenda sorotan. Indonesia mengusulkan percepatan harmonisasi regulasi perdagangan elektronik lintas-negara ASEAN untuk mendukung UMKM lokal menjangkau pasar regional.' },
    ],
    category: 'internasional',
    author: {
      id: 'u02',
      name: 'Sari Wulandari',
      role: 'Editor Internasional',
      avatarUrl: 'https://picsum.photos/seed/author-sari/96/96',
    },
    publishedAt: '2026-10-28T05:15:00+07:00',
    readTime: 3,
    thumbnailUrl: 'https://picsum.photos/seed/diplomacy-asean/1200/675',
    thumbnailAlt: 'Pertemuan para pemimpin ASEAN',
    tags: ['diplomasi', 'asean', 'geopolitik'],
    isBreaking: false,
    isFeatured: true,
  },
  {
    id: 'a03',
    slug: 'timnas-indonesia-tembus-final-piala-aff-2026',
    title: 'Timnas Indonesia Tembus Final Piala AFF 2026',
    excerpt:
      'Lewat kemenangan dramatis 2-1 di semifinal, Garuda Muda siap menghadapi rival kuat di partai puncak yang digelar akhir bulan ini.',
    content: [
      { type: 'paragraph', text: 'Timnas Indonesia mengamankan tiket final Piala AFF 2026 setelah menang dramatis 2-1 atas tuan rumah di laga semifinal. Gol penentu lahir di menit akhir melalui tendangan bebas yang membuat stadion meledak dalam sorak sorai.' },
      { type: 'heading', text: 'Taktik menekan lawan' },
      { type: 'paragraph', text: 'Pelatih kepala menerapkan pola menekan tinggi sejak babak pertama. Strategi ini berhasil memaksa lawan melakukan sejumlah kesalahan di area pertahanan, yang kemudian dimanfaatkan oleh barisan penyerang untuk menciptakan peluang.' },
      { type: 'quote', text: 'Para pemain menunjukkan karakter luar biasa. Kami siap untuk laga final.' },
      { type: 'paragraph', text: 'Partai final dijadwalkan digelar pada akhir bulan. Suporter di seluruh negeri disambut baik untuk memberikan dukungan, sementara tiket pertandingan dilaporkan telah ludes terjual dalam hitungan jam.' },
    ],
    category: 'olahraga',
    author: {
      id: 'u03',
      name: 'Bayu Nugroho',
      role: 'Jurnalis Olahraga',
      avatarUrl: 'https://picsum.photos/seed/author-bayu/96/96',
    },
    publishedAt: '2026-10-27T21:45:00+07:00',
    readTime: 2,
    thumbnailUrl: 'https://picsum.photos/seed/football-aff-final/1200/675',
    thumbnailAlt: 'Pemain Timnas merayakan gol',
    tags: ['sepak bola', 'timnas', 'piala-aff'],
    isBreaking: true,
    isFeatured: true,
  },
  {
    id: 'a04',
    slug: 'startup-lokal-tembus-seri-c-dengan-valuasi-500-juta-dollar',
    title:
      'Startup Lokal Tembus Seri C dengan Valuasi 500 Juta Dollar AS',
    excerpt:
      'Perusahaan fintech asal Jakarta suai raup pendanaan baru yang dipimpin investor global, menandai tonggak penting bagi ekosistem teknologi nasional.',
    content: [
      { type: 'paragraph', text: 'Sebuah perusahaan rintisan asal Jakarta yang bergerak di sektor fintech resmi mengumumkan pendanaan Seri C senilai 500 juta dolar AS. Putaran pendanaan ini dipimpin oleh investor global besar dengan partisipasi sejumlah investor lokal.' },
      { type: 'heading', text: 'Ekspansi ke kawasan regional' },
      { type: 'paragraph', text: 'Dana segar tersebut akan digunakan untuk memperluas jangkauan layanan ke beberapa negara di kawasan Asia Tenggara. Perusahaan menargetkan dapat menjangkau lebih dari 50 juta pengguna baru dalam dua tahun ke depan.' },
      { type: 'quote', text: 'Ini bukan sekadar angka, tapi bukti bahwa ekosistem teknologi Indonesia makin matang.' },
      { type: 'paragraph', text: 'Hadirnya pendanaan besar ini juga diharapkan dapat memberi sinyal positif bagi startup lain di tanah air. Pemerintah menyambut baik dan berkomitmen terus mendukung pertumbuhan ekonomi digital nasional.' },
    ],
    category: 'teknologi',
    author: {
      id: 'u04',
      name: 'Dimas Anggara',
      role: 'Editor Teknologi',
      avatarUrl: 'https://picsum.photos/seed/author-dimas/96/96',
    },
    publishedAt: '2026-10-27T14:00:00+07:00',
    readTime: 3,
    thumbnailUrl: 'https://picsum.photos/seed/fintech-startup-funding/1200/675',
    thumbnailAlt: 'Ilustrasi investasi teknologi startup',
    tags: ['startup', 'fintech', 'pendanaan'],
    isBreaking: false,
    isFeatured: false,
  },
  {
    id: 'a05',
    slug: 'film-indonesia-ramai-juara-di-festival-sinema-asia',
    title: 'Film Indonesia Ramai Juara di Festival Sinema Asia',
    excerpt:
      'Tiga karya sutradara Tanah Air meraih penghargaan utama, memperkuat posisi sinema Indonesia di panggung regional.',
    content: [
      { type: 'paragraph', text: 'Sinema Indonesia kembali mengharumkan nama bangsa di kancah internasional. Tiga film karya sutradara Tanah Air berhasil meraih penghargaan utama dalam festival sinema Asia yang berlangsung akhir pekan lalu.' },
      { type: 'heading', text: 'Cerita yang menyentuh' },
      { type: 'paragraph', text: 'Para juri menilai film-film tersebut berhasil mengangkat isu sosial dengan pendekatan sinematik yang kuat. Cerita yang diangkat dinilai mampu menyentuh penonton lintas budaya, tidak hanya bagi penonton lokal.' },
      { type: 'quote', text: 'Sinema Indonesia menunjukkan kedewasaan bercerita. Kami bangga dengan pencapaian ini.' },
      { type: 'paragraph', text: 'Pencapaian ini diharapkan menjadi pintu bagi karya-karya berikutnya untuk menembus pasar yang lebih luas dan menambah apresiasi terhadap film nasional.' },
    ],
    category: 'hiburan',
    author: {
      id: 'u05',
      name: 'Laksmi Dewi',
      role: 'Kritikus Film',
      avatarUrl: 'https://picsum.photos/seed/author-laksmi/96/96',
    },
    publishedAt: '2026-10-27T09:20:00+07:00',
    readTime: 2,
    thumbnailUrl: 'https://picsum.photos/seed/film-festival-award/1200/675',
    thumbnailAlt: 'Penghargaan festival film',
    tags: ['film', 'festival', 'sinema'],
    isBreaking: false,
    isFeatured: false,
  },
  {
    id: 'a06',
    slug: 'pemkot-jakarta-luncurkan-program-rumah-tanah-dengan-harga-200-juta',
    title:
      'Pemkot Jakarta Luncurkan Program Rumah Tanah dengan Harga 200 Juta',
    excerpt:
      'Program perumahan terjangkau untuk masyarakat berpenghasilan rendah mulai dibuka pendaftaranannya, menargetkan 10 ribu unit di tahun pertama.',
    content: [
      { type: 'paragraph', text: 'Pemerintah Kota Jakarta meluncurkan program perumahan terjangkau dengan harga mulai 200 juta rupiah per unit. Program ini ditujukan bagi masyarakat berpenghasilan rendah yang selama ini kesulitan memiliki rumah.' },
      { type: 'heading', text: 'Syarat dan ketentuan' },
      { type: 'paragraph', text: 'Pendaftaran dibuka secara online melalui portal resmi. Calon pembeli wajib memiliki KTP Jakarta, tidak memiliki rumah, dan berpenghasilan maksimal sepuluh juta rupiah per bulan. Verifikasi dilakukan secara digital.' },
      { type: 'quote', text: 'Hak atas tempat tinggal adalah hak dasar. Kami berkomitmen mewujudkan kota yang inklusif.' },
      { type: 'paragraph', text: 'Tahun pertama, program menargetkan 10 ribu unit dibangun di beberapa kawasan. Konstruksi akan dikerjakan oleh BUMN dan swasta dengan pengawasan ketat mutu bangunan.' },
    ],
    category: 'nasional',
    author: {
      id: 'u06',
      name: 'Aditya Rahman',
      role: 'Reporter Nasional',
      avatarUrl: 'https://picsum.photos/seed/author-aditya/96/96',
    },
    publishedAt: '2026-10-27T06:10:00+07:00',
    readTime: 3,
    thumbnailUrl: 'https://picsum.photos/seed/affordable-housing-jkt/1200/675',
    thumbnailAlt: 'Proyek perumahan terjangkau',
    tags: ['perumahan', 'jakarta', 'kebijakan'],
    isBreaking: false,
    isFeatured: false,
  },
  {
    id: 'a07',
    slug: 'tren-kebugaran-fungsional-menguasai-gaya-hidup-millennial',
    title:
      'Tren Kebugaran Fungsional Menguasai Gaya Hidup Milenial',
    excerpt:
      'Lebih dari sekadar angkat beban, latihan fungsional kini jadi pilihan utama generasi muda yang menuntut efisiensi dan hasil nyata.',
    content: [
      { type: 'paragraph', text: 'Latihan kebugaran fungsional tengah menjadi tren dominan di kalangan milenial urban. Berbeda dari angkat beban tradisional, latihan ini fokus pada gerakan yang meniru aktivitas sehari-hari untuk meningkatkan kekuatan, keseimbangan, dan mobilitas tubuh secara holistik.' },
      { type: 'heading', text: 'Mengapa kini begitu populer' },
      { type: 'paragraph', text: 'Faktor utama popularitasnya adalah efisiensi waktu. Sesi latihan biasanya berdurasi 30 hingga 45 menit, namun memberi hasil komprehensif. Ini sesuai dengan pola hidup sibuk generasi muda perkotaan.' },
      { type: 'quote', text: 'Latihan fungsional bukan tren sesaat. Ini perubahan cara pandang tentang kebugaran.' },
      { type: 'paragraph', text: 'Studio-studio khusus pun mulai menjamur di kota besar, menawarkan kelas kelompok dengan pelatih tersertifikasi. Beberapa gym konvensional juga mulai menambahkan zona fungsional untuk memenuhi permintaan anggotanya.' },
    ],
    category: 'gaya-hidup',
    author: {
      id: 'u07',
      name: 'Nadia Safira',
      role: 'Penulis Gaya Hidup',
      avatarUrl: 'https://picsum.photos/seed/author-nadia/96/96',
    },
    publishedAt: '2026-10-26T16:30:00+07:00',
    readTime: 2,
    thumbnailUrl: 'https://picsum.photos/seed/functional-fitness-trend/1200/675',
    thumbnailAlt: 'Sesi latihan fungsional di studio',
    tags: ['kebugaran', 'gaya hidup', 'tren'],
    isBreaking: false,
    isFeatured: false,
  },
  {
    id: 'a08',
    slug: 'mahkamah-konstitusi-putuskan-uu-cipta-kerja-sebagian-tidak-bersalah',
    title:
      'Mahkamah Konstitusi Putuskan UU Cipta Kerja Sebagian Tidak Bersalah',
    excerpt:
      'Putusan ini memuat penjelasan rinci tentang pasal-pasal yang dianggap inkonstitusional bersyarat serta dampaknya bagi pelaku usaha.',
    content: [
      { type: 'paragraph', text: 'Mahkamah Konstitusi mengeluarkan putusan atas uji materi terhadap Undang-Undang Cipta Kerja. Putusan memutuskan bahwa sebagian pasal tidak bersalah secara konstitusional, sementara beberapa pasal lain dianggap inkonstitusional bersyarat.' },
      { type: 'heading', text: 'Pasal yang dianggap bermasalah' },
      { type: 'paragraph', text: 'Putusan menggarisbawahi pasal-pasal yang dianggap mereduksi perlindungan pekerja. Mahkamah meminta perbaikan dalam waktu tertentu, jika tidak dilakukan maka pasal tersebut menjadi inkonstitusional tanpa syarat.' },
      { type: 'quote', text: 'Perlindungan pekerja dan kepastian investasi harus berjalan beriringan, bukan saling mengalahkan.' },
      { type: 'paragraph', text: 'Pemerintah menyambut putusan tersebut dan berjanji akan menindaklanjuti dengan revisi regulasi. Pelaku usaha diharapkan membaca dengan saksama untuk menyesuaikan kebijakan internal yang sesuai dengan putusan.' },
    ],
    category: 'hukum',
    author: {
      id: 'u08',
      name: 'Hartono Wijaya',
      role: 'Editor Hukum',
      avatarUrl: 'https://picsum.photos/seed/author-hartono/96/96',
    },
    publishedAt: '2026-10-26T11:00:00+07:00',
    readTime: 4,
    thumbnailUrl: 'https://picsum.photos/seed/constitutional-court-ruling/1200/675',
    thumbnailAlt: 'Gedung Mahkamah Konstitusi',
    tags: ['hukum', 'uu-cipta-kerja', 'mk'],
    isBreaking: true,
    isFeatured: false,
  },
  {
    id: 'a09',
    slug: 'bursa-saham-asia-tutup-menguat-dipicu-data-inflasi',
    title:
      'Bursa Saham Asia Tutup Menguat Dipicu Data Inflasi',
    excerpt:
      'Indeks regional naik tipis setelah data inflasi yang lebih rendah dari ekspektasi memunculkan harapan pelonggaran kebijakan moneter.',
    content: [
      { type: 'paragraph', text: 'Bursa saham Asia ditutup menguat tipis pada perdagangan terbaru. Penguatan dipicu oleh data inflasi yang lebih rendah dari ekspektasi pasar, memunculkan harapan adanya pelonggaran kebijakan moneter dari bank sentral regional.' },
      { type: 'paragraph', text: 'Indeks utama di sejumlah bursa mencatatkan kenaikan tipis. Sektor properti dan keuangan menjadi pendorong utama penguatan, sementara saham teknologi bergerak campuran.' },
      { type: 'quote', text: 'Pasar menanggapi data inflasi dengan optimisme, namun ketidakpastian tetap ada.' },
      { type: 'paragraph', text: 'Analis menilai penguatan ini belum tentu berkelanjutan. Investor disarankan tetap berhati-hati dan mengikuti perkembangan data ekonomi di pekan-pekan mendatang.' },
    ],
    category: 'ekonomi',
    author: {
      id: 'u01',
      name: 'Rangga Pratama',
      role: 'Reporter Ekonomi',
      avatarUrl: 'https://picsum.photos/seed/author-rangga/96/96',
    },
    publishedAt: '2026-10-26T15:45:00+07:00',
    readTime: 2,
    thumbnailUrl: 'https://picsum.photos/seed/stock-market-asia/1200/675',
    thumbnailAlt: 'Layar pergerakan indeks saham',
    tags: ['saham', 'inflasi', 'bursa'],
    isBreaking: false,
    isFeatured: false,
  },
  {
    id: 'a10',
    slug: 'kebijakan-baru-pajak-hasil-rental-platforma-digital-resmi-berlaku',
    title:
      'Kebijakan Baru Pajak Hasil Rental Platforma Digital Resmi Berlaku',
    excerpt:
      'Peraturan baru menetapkan kewajiban pajak atas pendapatan dari penyewaan aset via platform digital, berlaku efektif mulai bulan ini.',
    content: [
      { type: 'paragraph', text: 'Pemerintah resmi memberlakukan kebijakan baru terkait pemungutan pajak atas pendapatan hasil rental melalui platform digital. Peraturan ini berlaku efektif mulai bulan ini dan menargetkan penyedia layanan serta para penyewa.' },
      { type: 'paragraph', text: 'Dalam aturan tersebut, platform digital wajib memotong dan menyetorkan pajak atas transaksi yang terjadi. Mekanisme ini diharapkan dapat memperluas basis pajak dan menambah penerimaan negara.' },
      { type: 'quote', text: 'Digitalisasi ekonomi harus diimbangi dengan modernisasi sistem pajak yang adil.' },
      { type: 'paragraph', text: 'Pelaku usaha disarankan untuk segera memahami ketentuan baru ini agar tidak terkena sanksi. Sosialisasi akan dilakukan secara bertahap oleh otoritas terkait.' },
    ],
    category: 'hukum',
    author: {
      id: 'u08',
      name: 'Hartono Wijaya',
      role: 'Editor Hukum',
      avatarUrl: 'https://picsum.photos/seed/author-hartono/96/96',
    },
    publishedAt: '2026-10-25T13:20:00+07:00',
    readTime: 2,
    thumbnailUrl: 'https://picsum.photos/seed/digital-tax-policy/1200/675',
    thumbnailAlt: 'Ilustrasi pajak platform digital',
    tags: ['pajak', 'digital', 'regulasi'],
    isBreaking: false,
    isFeatured: false,
  },
  {
    id: 'a11',
    slug: 'penelitian-ungkap-potensi-energi-geothermal-di-luar-jawa',
    title:
      'Penelitian Ungkap Potensi Energi Panas Bumi di Luar Jawa',
    excerpt:
      'Studi terbaru menunjukkan kapasitas panas bumi di Sumatra dan Sulawesi mencapai ribuan megawat, membuka peluang investasi energi terbarukan.',
    content: [
      { type: 'paragraph', text: 'Sebuah penelitian terbaru mengungkap potensi besar energi panas bumi di luar Pulau Jawa. Studi yang dilakukan oleh lembaga riset nasional menunjukkan kapasitas di Sumatra dan Sulawesi mencapai ribuan megawat, jauh di atas perkiraan sebelumnya.' },
      { type: 'heading', text: 'Peluang investasi hijau' },
      { type: 'paragraph', text: 'Temuan ini membuka peluang investasi besar di sektor energi terbarukan. Sejumlah investor asing dikabarkan telah menunjukkan ketertarikan untuk masuk dan mengeksplorasi wilayah konsesi baru.' },
      { type: 'quote', text: 'Indonesia duduk di atas sumber energi yang melimpah. Tinggal bagaimana kita mengelolanya secara berkelanjutan.' },
      { type: 'paragraph', text: 'Pemerintah menyambut positif hasil riset ini dan berkomitmen mempermudah perizinan bagi investasi energi bersih, sejalan dengan target transisi energi nasional.' },
    ],
    category: 'teknologi',
    author: {
      id: 'u04',
      name: 'Dimas Anggara',
      role: 'Editor Teknologi',
      avatarUrl: 'https://picsum.photos/seed/author-dimas/96/96',
    },
    publishedAt: '2026-10-25T10:00:00+07:00',
    readTime: 3,
    thumbnailUrl: 'https://picsum.photos/seed/geothermal-energy-potential/1200/675',
    thumbnailAlt: 'Pembangkit energi panas bumi',
    tags: ['energi', 'panas-bumi', 'investasi'],
    isBreaking: false,
    isFeatured: false,
  },
  {
    id: 'a12',
    slug: 'festival-kuliner-nusantara-2026-sedot-50-ribu-pengunjung',
    title:
      'Festival Kuliner Nusantara 2026 Sedot 50 Ribu Pengunjung',
    excerpt:
      'Ajang pekan kuliner terbesar tahun ini menampilkan ratusan hidangan khas daerah dan sukses mempromosikan ragam masakan tradisional.',
    content: [
      { type: 'paragraph', text: 'Festival Kuliner Nusantara 2026 sukses mengundang 50 ribu pengunjung sepanjang tiga hari penyelenggaraan. Ajang tersebut menampilkan ratusan hidangan khas dari berbagai daerah di Indonesia, menjadikannya pekan kuliner terbesar tahun ini.' },
      { type: 'heading', text: 'Ragam masakan tradisional' },
      { type: 'paragraph', text: 'Para peserta membawa menu otentik yang banyak mulai langka. Hadirnya festival ini diapresiasi karena membuka panggung bagi kuliner tradisional untuk dikenal generasi muda yang mungkin belum pernah mencicipinya.' },
      { type: 'quote', text: 'Setiap piring mengandung cerita tentang daerah asalnya. Inilah kekayaan kita.' },
      { type: 'paragraph', text: 'Panitia menyatakan akan menjadikan festival ini agenda tahunan dan berencana memperluas skala ke kota-kota lain sebagai bagian dari promosi pariwisata kuliner nasional.' },
    ],
    category: 'gaya-hidup',
    author: {
      id: 'u07',
      name: 'Nadia Safira',
      role: 'Penulis Gaya Hidup',
      avatarUrl: 'https://picsum.photos/seed/author-nadia/96/96',
    },
    publishedAt: '2026-10-25T08:00:00+07:00',
    readTime: 2,
    thumbnailUrl: 'https://picsum.photos/seed/culinary-festival-nusantara/1200/675',
    thumbnailAlt: 'Hidangan kuliner tradisional nusantara',
    tags: ['kuliner', 'festival', 'nusantara'],
    isBreaking: false,
    isFeatured: false,
  },
  {
    id: 'a13',
    slug: 'konser-musisi-popular-tujuh-negara-rilis-duet-bersama-orkestra',
    title:
      'Konser Musik Populer Tujuh Negara Rilis Duet Bersama Orkestra',
    excerpt:
      'Penampilan kolaboratif memadukan pop modern dan aransemen orkestra sukses memukau ribuan penonton di ibu kota.',
    content: [
      { type: 'paragraph', text: 'Sebuah konser kolaboratif yang memadukan musik pop modern dengan aransemen orkestra sukses digelar di ibu kota. Penampilan musisi populer dari tujuh negara bersama orkestra nasional memukau ribuan penonton yang memenuhi venue.' },
      { type: 'paragraph', text: 'Repertoar yang dibawakan mencakup lagu-lagu hits yang diaransemen ulang dengan gaya sinfonik. Perpaduan elemen modern dan klasik ini memberi pengalaman baru bagi penonton yang sebagian besar adalah anak muda.' },
      { type: 'quote', text: 'Musik adalah bahasa universal. Malam ini membuktikannya.' },
      { type: 'paragraph', text: 'Konser ini menjadi bagian dari serangkaian acara pertukaran budaya yang rencananya akan berlanjut ke sejumlah kota lain di kawasan.' },
    ],
    category: 'hiburan',
    author: {
      id: 'u05',
      name: 'Laksmi Dewi',
      role: 'Kritikus Film',
      avatarUrl: 'https://picsum.photos/seed/author-laksmi/96/96',
    },
    publishedAt: '2026-10-24T19:30:00+07:00',
    readTime: 2,
    thumbnailUrl: 'https://picsum.photos/seed/orchestra-concert-pop/1200/675',
    thumbnailAlt: 'Panggung konser orkestra',
    tags: ['musik', 'konser', 'orkestra'],
    isBreaking: false,
    isFeatured: false,
  },
  {
    id: 'a14',
    slug: 'pilkada-serentak-2026-kpu-tetapkan-tahapan-baru',
    title:
      'Pilkada Serentak 2026: KPU Tetapkan Tahapan Baru',
    excerpt:
      'Komisi Pemilihan Umum merilis jadwal lengkap tahapan pemilihan kepala daerah serentak, termasuk pendaftaran dan kampanye.',
    content: [
      { type: 'paragraph', text: 'Komisi Pemilihan Umum resmi menetapkan tahapan baru untuk pelaksanaan pemilihan kepala daerah serentak 2026. Jadwal lengkap mencakup masa pendaftaran, kampanye, hingga hari pemungutan suara telah dirilis kepada publik.' },
      { type: 'heading', text: 'Pendaftaran terbuka bulan depan' },
      { type: 'paragraph', text: 'Pendaftaran pasangan calon dijadwalkan dibuka pada awal bulan depan. KPU meminta para calon mempersiapkan dokumen secara lengkap untuk memperhalus proses verifikasi administrasi yang akan berlangsung ketat.' },
      { type: 'quote', text: 'Kami berkomitmen menyelenggarakan pemilu yang jujur, adil, dan transparan.' },
      { type: 'paragraph', text: 'Masyarakat diingatkan untuk aktif memantau tahapan dan melaporkan bila menemukan pelanggaran. KPU membuka kanal pengaduan untuk menerima laporan dari publik.' },
    ],
    category: 'nasional',
    author: {
      id: 'u06',
      name: 'Aditya Rahman',
      role: 'Reporter Nasional',
      avatarUrl: 'https://picsum.photos/seed/author-aditya/96/96',
    },
    publishedAt: '2026-10-24T14:00:00+07:00',
    readTime: 3,
    thumbnailUrl: 'https://picsum.photos/seed/election-kpu-stages/1200/675',
    thumbnailAlt: 'Rapat Komisi Pemilihan Umum',
    tags: ['pilkada', 'kpu', 'demokrasi'],
    isBreaking: false,
    isFeatured: false,
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles.filter((a) => a.category === categorySlug);
}

export function getBreakingArticles(): Article[] {
  return articles.filter((a) => a.isBreaking);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.isFeatured);
}

export function getRelatedArticles(article: Article, limit = 4): Article[] {
  return articles
    .filter(
      (a) =>
        a.id !== article.id &&
        (a.category === article.category ||
          a.tags.some((t) => article.tags.includes(t))),
    )
    .slice(0, limit);
}

export function getPopularArticles(limit = 5): Article[] {
  return [...articles]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

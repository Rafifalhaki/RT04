/**
 * ==============================================================================
 * DATA KONFIGURASI PORTAL DIGITAL RT (RUKUN TETANGGA)
 * ==============================================================================
 * File ini berisi seluruh konten dan data website RT.
 * Pengurus RT dapat dengan mudah mengubah teks, nama, nomor telepon,
 * laporan keuangan, berita, dan jadwal di file ini TANPA perlu memahami koding.
 * 
 * PANDUAN SINGKAT:
 * 1. Edit teks di dalam tanda petik "..." sesuai kebutuhan lingkungan RT Anda.
 * 2. Jangan menghapus tanda koma (,), kurung siku [...], atau kurung kurawal {...}.
 * 3. Untuk nomor WhatsApp gunakan format internasional tanpa simbol (contoh: "6281234567890").
 * ==============================================================================
 */

window.RT_DATA = {
  // 1. INFORMASI IDENTITAS RT / LINGKUNGAN
  info: {
    namaRT: "RT 04",
    namaRW: "RW 03",
    kelurahan: "Sukamaju",
    kecamatan: "Cilodong",
    kota: "Kota Depok",
    provinsi: "Jawa Barat",
    kodePos: "16415",
    slogan: "Guyub Rukun, Peduli Lingkungan, Aman & Transparan",
    deskripsi: "Portal resmi sistem informasi digital dan transparansi warga RT 04 / RW 03 Kelurahan Sukamaju untuk pelayanan administrasi warga yang cepat, modern, dan akuntabel.",
    
    // Nomor WhatsApp resmi untuk menerima Pengaduan & Layanan Surat (Format: 628xxxxxxxx)
    noWhatsAppLaporan: "6281234567890",
    namaPenerimaLaporan: "Bpk. H. Rahmat Hidayat (Ketua RT)",
    
    // Link Komunitas Warga
    linkGrupWargaWA: "https://chat.whatsapp.com/sample-rt-group",
    linkGoogleMaps: "https://maps.google.com/?q=Depok",
    
    // Kontak & Kesekretariatan
    alamatSekretariat: "Balai Warga RT 04 / RW 03, Jl. Melati Raya No. 12",
    jamPelayanan: "Senin - Sabtu: 08.00 - 21.00 WIB",
    email: "rt05rw03.sukamaju@gmail.com"
  },

  // 2. STATISTIK LINGKUNGAN WARGA
  statistik: {
    totalKK: 86,
    totalWarga: 328,
    totalPria: 162,
    totalWanita: 166,
    agendaTerdekat: "Kerja Bakti Akbar & Fogging DBD",
    agendaTanggal: "Minggu, 29 Nov 2026",
    agendaWaktu: "07.00 WIB - Selesai"
  },

  // 3. VISI, MISI & NILAI KERUKUNAN
  visiMisi: {
    visi: "Mewujudkan lingkungan RT 04 yang aman, asri, religius, guyub rukun, dan berdaya melalui semangat gotong royong serta transparansi pelayanan digital.",
    misi: [
      "Meningkatkan kerukunan, toleransi, dan kekeluargaan antar warga tanpa membedakan latar belakang.",
      "Mewujudkan sistem administrasi dan pengelolaan keuangan kas RT yang terbuka, jujur, dan dapat diakses setiap saat.",
      "Menjaga keamanan dan ketertiban lingkungan secara aktif melalui pos kamling dan siskamling terpadu.",
      "Menciptakan lingkungan yang hijau, bersih, dan bebas sampah melalui program kerja bakti berkala dan bank sampah.",
      "Memberdayakan generasi muda Karang Taruna dan peran serta ibu-ibu PKK dalam kegiatan positif kemasyarakatan."
    ],
    nilai: [
      { judul: "Guyub Rukun", deskripsi: "Mengutamakan musyawarah dan silaturahmi antar tetangga.", icon: "users" },
      { judul: "Transparan", deskripsi: "Setiap rupiah dana kas warga dilaporkan secara akuntabel.", icon: "shield-check" },
      { judul: "Aman & Siaga", deskripsi: "Siskamling rutin dan tanggap darurat lingkungan 24 jam.", icon: "shield-alert" },
      { judul: "Asri & Bersih", deskripsi: "Peduli kebersihan saluran air, taman, dan pemilahan sampah.", icon: "leaf" }
    ]
  },

  // 4. STRUKTUR PENGURUS RT
  pengurus: [
    {
      id: 1,
      nama: "Bpk. H. Rahmat Hidayat",
      jabatan: "Ketua RT 04",
      periode: "2024 - 2029",
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      whatsapp: "6281234567890",
      tugasUtama: "Memimpin pelaksanaan tugas RT dan koordinasi pelayanan masyarakat."
    },
    {
      id: 2,
      nama: "Ibu Hj. Siti Nurhaliza, S.Pd",
      jabatan: "Sekretaris RT",
      periode: "2024 - 2029",
      foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
      whatsapp: "6281234567891",
      tugasUtama: "Administrasi persuratan, pendataan kependudukan, dan notulensi rapat warga."
    },
    {
      id: 3,
      nama: "Bpk. Ir. Budi Santoso",
      jabatan: "Bendahara RT",
      periode: "2024 - 2029",
      foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
      whatsapp: "6281234567892",
      tugasUtama: "Pengelolaan iuran bulanan warga, pembukuan kas, dan laporan keuangan rutin."
    },
    {
      id: 4,
      nama: "Bpk. Joko Prabowo",
      jabatan: "Seksi Keamanan & Ketertiban",
      periode: "2024 - 2029",
      foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
      whatsapp: "6281234567893",
      tugasUtama: "Koordinasi jadwal siskamling, pengawasan pos satpam, dan keamanan lingkungan."
    },
    {
      id: 5,
      nama: "Bpk. Ahmad Fauzi",
      jabatan: "Seksi Kebersihan & Fasum",
      periode: "2024 - 2029",
      foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80",
      whatsapp: "6281234567894",
      tugasUtama: "Pengelolaan angkutan sampah, pemeliharaan lampu jalan, dan jadwal kerja bakti."
    },
    {
      id: 6,
      nama: "Dimas Aditya Pratama",
      jabatan: "Ketua Karang Taruna RT",
      periode: "2024 - 2029",
      foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      whatsapp: "6281234567895",
      tugasUtama: "Penggerak pemuda, peringatan HUT RI, kegiatan olahraga, dan kreativitas warga."
    }
  ],

  // 5. TRANSPARANSI LAPORAN KAS RT
  keuangan: {
    saldoAwalTahun: 8500000,
    // Data riwayat per bulan untuk visualisasi grafik Chart.js
    grafikBulanan: {
      labels: ["Juni", "Juli", "Agustus", "September", "Oktober", "November"],
      pemasukan: [3200000, 3450000, 4800000, 3300000, 3600000, 4150000],
      pengeluaran: [2100000, 2400000, 3950000, 2200000, 2550000, 2180000]
    },
    // Rincian mutasi transaksi detail
    transaksi: [
      {
        id: "TRX-01",
        tanggal: "2026-11-23",
        bulan: "2026-11",
        keterangan: "Iuran Warga Periode November (Blok C & D)",
        kategori: "Iuran Warga",
        jenis: "masuk",
        nominal: 1850000,
        bukti: "Kwitansi Kolektif"
      },
      {
        id: "TRX-02",
        tanggal: "2026-11-20",
        bulan: "2026-11",
        keterangan: "Pembelian Solar & Oli Mesin Fogging Nyamuk",
        kategori: "Kesehatan",
        jenis: "keluar",
        nominal: 280000,
        bukti: "Nota SPBU & Toko Kimia"
      },
      {
        id: "TRX-03",
        tanggal: "2026-11-17",
        bulan: "2026-11",
        keterangan: "Honor Petugas Satpam & Kebersihan Paruh Bulan",
        kategori: "Operasional",
        jenis: "keluar",
        nominal: 1200000,
        bukti: "Tanda Terima Honor"
      },
      {
        id: "TRX-04",
        tanggal: "2026-11-12",
        bulan: "2026-11",
        keterangan: "Sumbangan Sukarela Warga (Bpk. Handoko)",
        kategori: "Donasi / Sumbangan",
        jenis: "masuk",
        nominal: 500000,
        bukti: "Transfer Bank"
      },
      {
        id: "TRX-05",
        tanggal: "2026-11-08",
        bulan: "2026-11",
        keterangan: "Iuran Warga Periode November (Blok A & B)",
        kategori: "Iuran Warga",
        jenis: "masuk",
        nominal: 1800000,
        bukti: "Kwitansi Kolektif"
      },
      {
        id: "TRX-06",
        tanggal: "2026-11-05",
        bulan: "2026-11",
        keterangan: "Perbaikan 3 Titik Lampu Jalan LED Rusak (Gang Mawar)",
        kategori: "Perawatan Fasum",
        jenis: "keluar",
        nominal: 450000,
        bukti: "Nota Toko Listrik Jaya"
      },
      {
        id: "TRX-07",
        tanggal: "2026-11-02",
        bulan: "2026-11",
        keterangan: "Konsumsi Rapat Pengurus Pembahasan Kerja Bakti",
        kategori: "Operasional",
        jenis: "keluar",
        nominal: 250000,
        bukti: "Nota Snack"
      },
      {
        id: "TRX-08",
        tanggal: "2026-10-28",
        bulan: "2026-10",
        keterangan: "Iuran Warga Periode Oktober (Lengkap)",
        kategori: "Iuran Warga",
        jenis: "masuk",
        nominal: 3600000,
        bukti: "Kwitansi Lengkap"
      },
      {
        id: "TRX-09",
        tanggal: "2026-10-25",
        bulan: "2026-10",
        keterangan: "Pembersihan Sedimen Saluran Got Utama Menjelang Hujan",
        kategori: "Kebersihan",
        jenis: "keluar",
        nominal: 850000,
        bukti: "Tanda Terima Tukang"
      },
      {
        id: "TRX-10",
        tanggal: "2026-10-15",
        bulan: "2026-10",
        keterangan: "Honor Petugas Keamanan Bulan Oktober",
        kategori: "Operasional",
        jenis: "keluar",
        nominal: 1200000,
        bukti: "Kwitansi Satpam"
      },
      {
        id: "TRX-11",
        tanggal: "2026-10-05",
        bulan: "2026-10",
        keterangan: "Pembelian Alat Kebersihan (Cangkul, Sapu Lidi, Karung)",
        kategori: "Perawatan Fasum",
        jenis: "keluar",
        nominal: 500000,
        bukti: "Nota Toko Material"
      }
    ]
  },

  // 6. PAPAN PENGUMUMAN & AGENDA WARGA
  pengumuman: [
    {
      id: "PG-01",
      judul: "Kerja Bakti Akbar & Fogging Nyamuk DBD Serentak",
      tanggal: "24 November 2026",
      kategori: "Kebersihan & Kesehatan",
      badgeColor: "emerald",
      prioritas: "Penting",
      ringkasan: "Dihimbau seluruh warga RT 04 untuk bergotong royong membersihkan saluran air dan pekarangan rumah masing-masing guna mencegah jentik nyamuk Aedes aegypti.",
      isiLengkap: `Yth. Seluruh Bapak/Ibu Warga RT 04 / RW 03,
      
Menindaklanjuti musim penghujan dan instruksi dari Puskesmas Kelurahan Sukamaju, pengurus RT 04 akan mengadakan **Kerja Bakti Akbar dan Fogging Serentak** pada:

- 📅 **Hari / Tanggal:** Minggu, 29 November 2026
- ⏰ **Waktu:** Pukul 07.00 WIB s/d Selesai
- 📍 **Titik Kumpul:** Balai Warga & Pos Kamling Utama
- 🎯 **Fokus Kegiatan:** Pembersihan selokan/got saluran utama, pemangkasan dahan pohon yang menghalangi jalan/kabel listrik, dan pengasapan (fogging) nyamuk.

**Himbauan untuk Warga:**
1. Harap menguras dan menutup bak penampungan air di rumah masing-masing.
2. Membuka jendela saat proses fogging melintas dan mengamankan hewan peliharaan atau makanan terbuka.
3. Disediakan konsumsi ringan dan kopi gotong royong di Balai Warga.

Mari kita jaga kebersihan lingkungan demi kesehatan keluarga kita tercinta.`,
      lokasi: "Seluruh Lingkungan RT 04 (Blok A s/d Blok D)",
      waktu: "Minggu, 29 Nov 2026 (07.00 WIB)",
      gambar: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "PG-02",
      judul: "Jadwal Pelayanan Posyandu Balita & Lansia Melati 05",
      tanggal: "21 November 2026",
      kategori: "Kesehatan",
      badgeColor: "blue",
      prioritas: "Rutin",
      ringkasan: "Pelayanan penimbangan berat badan, imunisasi balita, serta pemeriksaan tensi & gula darah gratis untuk lansia.",
      isiLengkap: `Pemberitahuan kepada para Ibu yang memiliki Balita dan Warga Lansia di lingkungan RT 04:

Posyandu Melati 05 bekerja sama dengan Bidan Puskesmas Pembina akan melaksanakan penimbangan dan pemeriksaan rutin pada:

- 📅 **Hari / Tanggal:** Sabtu, 5 Desember 2026
- ⏰ **Waktu:** 08.30 - 11.30 WIB
- 📍 **Tempat:** Rumah Ibu Ketua RT (Jl. Melati No. 12)
- 🍼 **Layanan Balita:** Penimbangan berat badan, pengukuran tinggi badan, pemberian vitamin A, dan PMT (Pemberian Makanan Tambahan).
- 🩺 **Layanan Lansia:** Pengukuran tekanan darah, pemeriksaan gula darah & asam urat sederhana, serta konsultasi nutrisi.

Dimohon membawa Buku KIA/KMS bagi yang membawa balita. Gratis dan tidak dipungut biaya.`,
      lokasi: "Balai Warga RT 04",
      waktu: "Sabtu, 5 Des 2026 (08.30 - 11.30 WIB)",
      gambar: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "PG-03",
      judul: "Sosialisasi Pemutakhiran Data Kependudukan Digital (IKD)",
      tanggal: "15 November 2026",
      kategori: "Administrasi",
      badgeColor: "purple",
      prioritas: "Informasi",
      ringkasan: "Panduan aktivasi Identitas Kependudukan Digital (KTP Digital) dari Dinas Dukcapil melalui aplikasi handphone bagi warga RT 04.",
      isiLengkap: `Sesuai arahan Kelurahan, kini warga dihimbau mengaktifkan KTP Digital (IKD) melalui smartphone Android / iOS.

**Langkah Singkat:**
1. Download aplikasi **Identitas Kependudukan Digital** di Play Store / App Store.
2. Masukkan NIK, Email aktif, dan No. Handphone.
3. Lakukan verifikasi wajah (face recognition).
4. Pengurus RT akan membantu scan QR Code aktivasi secara kolektif setiap malam Sabtu di Balai Warga.

KTP Digital mempermudah urusan administrasi tanpa perlu lagi fotokopi KTP fisik.`,
      lokasi: "Online & Bantuan di Balai RT",
      waktu: "Setiap Malam Sabtu",
      gambar: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "PG-04",
      judul: "Peningkatan Kewaspadaan & Tamu Wajib Lapor 1x24 Jam",
      tanggal: "10 November 2026",
      kategori: "Keamanan",
      badgeColor: "amber",
      prioritas: "Penting",
      ringkasan: "Penegasan aturan portal lingkungan malam hari ditutup pukul 23.00 WIB dan tamu yang menginap wajib melapor ke pengurus RT.",
      isiLengkap: `Untuk menjaga kondusifitas lingkungan, keamanan kendaraan bermotor, dan ketertiban bersama:

1. **Portal Gang Utama** ditutup setiap malam mulai pukul **23.00 WIB** hingga **05.00 WIB**. Akses keluar masuk satu pintu melalui Pos Kamling Utama.
2. Tamu yang berkunjung lebih dari **1x24 jam** atau menginap di rumah warga **wajib melapor** kepada Ketua RT atau Seksi Keamanan melalui formulir website ini atau WhatsApp.
3. Pastikan kunci ganda pada kendaraan roda dua dan tidak meninggalkan barang berharga di teras luar rumah.`,
      lokasi: "Seluruh Pintu Masuk RT 04",
      waktu: "Berlaku Setiap Hari",
      gambar: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80"
    }
  ],

  // 7. JADWAL RONDA SISKAMLING
  jadwalRonda: {
    jamOperasional: "Pukul 22.00 - 04.30 WIB",
    posUtama: "Pos Kamling Indah Blok B",
    harian: [
      {
        hari: "Senin",
        koordinator: "Bpk. Joko Prabowo (Seksi Keamanan)",
        kontakKoordinator: "081234567893",
        anggota: [
          "Bpk. Hendra Wijaya (Blok A1/02)",
          "Bpk. Bambang Setiadi (Blok A1/05)",
          "Bpk. Dedi Kurniawan (Blok A2/03)",
          "Bpk. Ridwan Hakim (Blok A2/09)",
          "Bpk. Tono Sudirjo (Blok B1/04)"
        ]
      },
      {
        hari: "Selasa",
        koordinator: "Bpk. Ahmad Fauzi",
        kontakKoordinator: "081234567894",
        anggota: [
          "Bpk. Farhan Maulana (Blok B1/07)",
          "Bpk. Agus Santoso (Blok B2/02)",
          "Bpk. Rian Pratama (Blok B2/06)",
          "Bpk. Wahyu Nugroho (Blok B2/11)",
          "Bpk. Sigit Permadi (Blok C1/01)"
        ]
      },
      {
        hari: "Rabu",
        koordinator: "Bpk. Ir. Budi Santoso",
        kontakKoordinator: "081234567892",
        anggota: [
          "Bpk. Arif Wibowo (Blok C1/05)",
          "Bpk. Eko Prasetyo (Blok C1/08)",
          "Bpk. Haryono (Blok C2/03)",
          "Bpk. Teguh Wicaksono (Blok C2/07)",
          "Bpk. Fajar Ramadhan (Blok C2/10)"
        ]
      },
      {
        hari: "Kamis",
        koordinator: "Bpk. Kuswanto",
        kontakKoordinator: "081234567896",
        anggota: [
          "Bpk. Doni Kusuma (Blok D1/02)",
          "Bpk. M. Ilham (Blok D1/06)",
          "Bpk. Surya Atmaja (Blok D1/09)",
          "Bpk. Indra Lesmana (Blok D2/01)",
          "Bpk. Triyono (Blok D2/04)"
        ]
      },
      {
        hari: "Jumat",
        koordinator: "Dimas Aditya Pratama (Karang Taruna)",
        kontakKoordinator: "081234567895",
        anggota: [
          "Reza Pahlevi (Pemuda Blok A)",
          "Bagus Setiawan (Pemuda Blok B)",
          "Bayu Anggara (Pemuda Blok C)",
          "Gilang Ramadan (Pemuda Blok D)",
          "Aldi Firmansyah (Pemuda Blok B)"
        ]
      },
      {
        hari: "Sabtu",
        koordinator: "Bpk. H. Rahmat Hidayat (Ketua RT)",
        kontakKoordinator: "081234567890",
        anggota: [
          "Bpk. Hendro Siswanto (Blok A1/08)",
          "Bpk. Rudi Hermawan (Blok B1/10)",
          "Bpk. Gunawan (Blok C1/12)",
          "Bpk. Anton Sujarwo (Blok D1/11)",
          "Bpk. Lukman Hakim (Blok D2/08)",
          "Bpk. Yahya Basuki (Blok A2/04)"
        ]
      },
      {
        hari: "Minggu",
        koordinator: "Bpk. Satpam Lingkungan (Bpk. Marno)",
        kontakKoordinator: "081234567897",
        anggota: [
          "Bpk. Ferry Irawan (Blok B2/01)",
          "Bpk. Yudi Supriyadi (Blok C2/02)",
          "Bpk. Danang Joyo (Blok D2/06)",
          "Bpk. Nanang Qosim (Blok A1/03)",
          "Bpk. Syaiful Anwar (Blok A2/07)"
        ]
      }
    ]
  },

  // 8. KONTAK DARURAT & PENTING
  kontakDarurat: [
    {
      nama: "Ketua RT 04 (Bpk. Rahmat)",
      kategori: "Pengurus RT",
      telepon: "081234567890",
      whatsapp: "6281234567890",
      deskripsi: "Pelayanan umum warga & izin darurat lingkungan",
      icon: "user-check"
    },
    {
      nama: "Pos Kamling / Satpam RT",
      kategori: "Keamanan Lingkungan",
      telepon: "081234567897",
      whatsapp: "6281234567897",
      deskripsi: "Standby 24 Jam di Pos Kamling Blok B",
      icon: "shield"
    },
    {
      nama: "Bhabinkamtibmas Polsek",
      kategori: "Kepolisian",
      telepon: "081399887766",
      whatsapp: "6281399887766",
      deskripsi: "Aipda Suwardi (Pembina Kamtibmas Kelurahan)",
      icon: "badge-alert"
    },
    {
      nama: "Babinsa TNI AD Kelurahan",
      kategori: "TNI / Koramil",
      telepon: "081288776655",
      whatsapp: "6281288776655",
      deskripsi: "Serka Mulyono (Babinsa Wilayah Sukamaju)",
      icon: "shield-alert"
    },
    {
      nama: "Puskesmas Sukamaju",
      kategori: "Kesehatan",
      telepon: "02177889900",
      whatsapp: "6282112345678",
      deskripsi: "Layanan IGD & Ambulans Puskesmas 24 Jam",
      icon: "heart-pulse"
    },
    {
      nama: "Pemadam Kebakaran (Damkar)",
      kategori: "Tanggap Darurat",
      telepon: "113",
      whatsapp: "",
      deskripsi: "Pos Damkar Kota Depok Sektor Cilodong",
      icon: "flame"
    },
    {
      nama: "Call Center Darurat 112",
      kategori: "Darurat Pemkot",
      telepon: "112",
      whatsapp: "",
      deskripsi: "Bebas Pulsa untuk segala jenis kondisi darurat",
      icon: "phone-call"
    },
    {
      nama: "PLN Pengaduan Gangguan",
      kategori: "Utilitas",
      telepon: "123",
      whatsapp: "",
      deskripsi: "Layanan perbaikan padam & kabel putus",
      icon: "zap"
    }
  ],

  // 9. PANDUAN ADMINISTRASI & SURAT PENGANTAR RT
  layananSurat: [
    {
      id: "surat-domisili",
      judul: "Surat Keterangan Domisili Tinggal",
      keperluan: "Untuk pembukaan rekening bank, keperluan kerja, sekolah, pendaftaran anak, dll.",
      syarat: [
        "Fotokopi KTP Pemohon (asli ditunjukkan)",
        "Fotokopi Kartu Keluarga (KK)",
        "Surat bukti kontrak / sewa rumah (bagi warga pengontrak/kost)",
        "Surat pengantar RT lunas iuran kas minimal 3 bulan terakhir"
      ],
      prosesWaktu: "1 Hari Kerja (Bisa via WhatsApp)",
      biaya: "GRATIS / Tidak Dipungut Biaya"
    },
    {
      id: "surat-ktp-kk",
      judul: "Pengantar Pembuatan / Perubahan KTP & KK",
      keperluan: "KTP baru usia 17 tahun, perpanjangan, hilang/rusak, penambahan anggota keluarga, atau pecah KK.",
      syarat: [
        "Fotokopi Kartu Keluarga lama",
        "Fotokopi Akta Kelahiran (untuk pemohon baru)",
        "Surat Kehilangan dari Kepolisian (jika KTP/KK hilang)",
        "Fotokopi Buku Nikah / Akta Perkawinan (bagi pemohon baru menikah)"
      ],
      prosesWaktu: "1 Hari Kerja",
      biaya: "GRATIS / Tidak Dipungut Biaya"
    },
    {
      id: "surat-sktm",
      judul: "Surat Keterangan Tidak Mampu (SKTM)",
      keperluan: "Keringanan biaya rumah sakit (BPJS PBI), KIP Kuliah, beasiswa sekolah, atau bantuan sosial.",
      syarat: [
        "Fotokopi KTP dan Kartu Keluarga (KK)",
        "Surat pernyataan tidak mampu bermaterai Rp 10.000",
        "Foto kondisi rumah tampak depan",
        "Diverifikasi langsung oleh petugas Seksi Kesejahteraan Warga RT"
      ],
      prosesWaktu: "1 - 2 Hari Kerja",
      biaya: "GRATIS / Tidak Dipungut Biaya"
    },
    {
      id: "surat-nikah",
      judul: "Surat Pengantar Pernikahan (Model N1 - N4)",
      keperluan: "Pendaftaran pernikahan ke KUA atau Kantor Catatan Sipil.",
      syarat: [
        "Fotokopi KTP & KK calon pengantin",
        "Fotokopi Akta Kelahiran & Ijazah terakhir",
        "Fotokopi KTP orang tua calon pengantin",
        "Surat Kematian / Akta Cerai (jika status duda / janda)"
      ],
      prosesWaktu: "1 - 2 Hari Kerja",
      biaya: "GRATIS / Tidak Dipungut Biaya"
    },
    {
      id: "surat-kematian-kelahiran",
      judul: "Surat Keterangan Kelahiran / Kematian",
      keperluan: "Penerbitan Akta Kelahiran Baru atau Akta Kematian dari Disdukcapil.",
      syarat: [
        "Surat Keterangan Lahir / Meninggal dari RS / Bidan / Puskesmas",
        "Fotokopi KTP dan KK orang tua / almarhum",
        "Fotokopi KTP 2 orang saksi warga RT 04",
        "Buku Nikah orang tua (untuk akta lahir)"
      ],
      prosesWaktu: "Segera / Prioritas Layanan",
      biaya: "GRATIS / Tidak Dipungut Biaya"
    }
  ]
};

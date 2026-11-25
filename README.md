# Website Profil & Portal Informasi Digital RT (Rukun Tetangga)

Website profil dan transparansi informasi warga RT yang modern, mobile-first, bersih, dan **100% kompatibel di-hosting secara gratis di GitHub Pages** tanpa butuh backend server atau database.

---

## 📁 Struktur File Proyek

```
rt-digital/
├── index.html        # Halaman utama (Single Page Application / SPA)
├── style.css         # Styling kustom tambahan & print styles
├── app.js            # Logika interaktif, filter kas, Chart.js, & WhatsApp form
├── data.js           # SATU-SATUNYA file untuk mengubah data warga & konten RT
├── README.md         # Panduan penggunaan & deployment
└── assets/
    └── images/       # Folder opsional untuk foto pengurus & dokumentasi lokal
```

---

## 🚀 Cara Hosting Gratis di GitHub Pages (Tanpa Koding)

Website ini adalah **Static Site murni**, tidak memerlukan instalasi Node.js, PHP, atau build tools. Cukup lakukan langkah berikut:

1. **Buat Repository Baru di GitHub**:
   - Masuk ke akun GitHub Anda, klik **New Repository**.
   - Beri nama repository (contoh: `portal-rt05`).
   - Pilih **Public**.

2. **Upload / Push File ke Repository**:
   - Upload 4 file utama (`index.html`, `style.css`, `app.js`, `data.js`) langsung ke branch `main` (atau `master`) di posisi paling luar (root).
   - Atau lewat terminal git:
     ```bash
     git init
     git add .
     git commit -m "Inisialisasi website RT digital"
     git branch -M main
     git remote add origin https://github.com/USERNAME/portal-rt05.git
     git push -u origin main
     ```

3. **Aktifkan GitHub Pages**:
   - Buka tab **Settings** di repository GitHub Anda.
   - Di menu sebelah kiri, klik **Pages**.
   - Pada bagian **Build and deployment** > **Source**, pilih **Deploy from a branch**.
   - Pilih Branch: **main** dan folder: **/(root)**, lalu klik **Save**.
   - Tunggu 1–2 menit, link website RT Anda akan langsung aktif di:
     `https://USERNAME.github.io/portal-rt05/`

---

## ✏️ Panduan Edit Konten untuk Pengurus RT (`data.js`)

Pengurus RT hanya perlu membuka dan mengedit file **`data.js`** menggunakan teks editor biasa (Notepad, VS Code, atau langsung di website GitHub):

1. **Mengubah Nama RT & Kontak WhatsApp Laporan:**
   Cari bagian `info`:
   ```javascript
   info: {
     namaRT: "RT 05",
     namaRW: "RW 03",
     kelurahan: "Sukamaju",
     noWhatsAppLaporan: "6281234567890", // Ganti ke nomor WA Ketua RT
     ...
   }
   ```

2. **Menambah / Mengubah Transaksi Kas RT:**
   Cari bagian `keuangan.transaksi`:
   ```javascript
   {
     id: "TRX-12",
     tanggal: "2026-11-25",
     bulan: "2026-11",
     keterangan: "Iuran Warga Tambahan",
     kategori: "Iuran Warga",
     jenis: "masuk", // atau "keluar"
     nominal: 500000,
     bukti: "Kwitansi"
   }
   ```
   *Saldo total dan grafik akan dikalkulasi secara otomatis tanpa perlu dihitung manual.*

3. **Memperbarui Pengumuman Kegiatan:**
   Cari bagian `pengumuman` dan edit judul, tanggal, serta isi pengumuman.

4. **Kontak Darurat Lingkungan:**
   Cari bagian `kontakDarurat` untuk memperbarui nomor telepon darurat polsek, babinsa, damkar, atau ambulans.

---

## ✨ Fitur Unggulan

- **Desain Fresh, Modern & Ramah Warga:** Visual bernuansa hijau asri, modern, segar, tidak kaku/minimalis, dan nyaman dibuka dari ponsel.
- **Transparansi Kas Real-Time:** Filter per bulan, pencarian transaksi, visualisasi grafik Chart.js, serta tombol **Export ke CSV/Excel**.
- **Kontak Darurat Cepat:** Akses instan nomor darurat kepolisian, ambulans, dan pos damkar hanya dengan sekali klik.
- **Form Pengaduan Otomatis WhatsApp:** Laporan warga otomatis diformat rapi dan membuka aplikasi WhatsApp Ketua RT tanpa server backend.
- **Aman & Privasi Terjaga:** Tidak ada risiko kebocoran database karena 100% Client-Side.
- **100% Kompatibel Subpath GitHub Pages:** Menggunakan relative path (`./`) sehingga tidak akan error 404 saat di-refresh.

# Website Undangan Pernikahan — Biru Pastel

Website undangan responsif berbasis **HTML, CSS, dan JavaScript vanilla**. Dapat di-host gratis menggunakan GitHub Pages karena tidak memerlukan proses build.

## Isi proyek
- `index.html` — undangan publik: cover, mempelai, kisah cinta, countdown, acara, galeri, RSVP, ucapan, hadiah, musik, kalender, dan tautan berbagi.
- `styles.css` — desain biru pastel responsif untuk ponsel, tablet, dan desktop.
- `script.js` — interaksi, nama tamu dari URL, countdown, RSVP/ucapan demo, salin rekening/alamat, galeri, dan unduh kalender.
- `admin.html`, `admin.css`, `admin.js` — panel demo lokal untuk melihat data dari browser yang sama serta ekspor CSV/JSON.
- `assets/favicon.svg` — favicon.

## Cara menjalankan lokal
Buka `index.html` di browser. Untuk pengalaman lebih konsisten, jalankan server lokal sederhana, misalnya ekstensi Live Server di VS Code.

## Cara hosting di GitHub Pages
1. Buat repository baru di GitHub, misalnya `undangan-biru-pastel`.
2. Unggah semua file dan folder proyek ini ke **root repository** (jangan unggah file ZIP saja).
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/(root)`, lalu klik **Save**.
6. Tunggu proses deployment selesai. Situs akan tersedia di URL GitHub Pages yang ditampilkan di halaman Settings → Pages.
7. `index.html` menjadi halaman utama; `admin.html` adalah panel demo.

## Personalisasi sebelum dipublikasikan
Cari dan ganti contoh data di `index.html`:
- `Alya Putri Maharani`, `Raka Pratama`, nama orang tua.
- Tanggal acara (`22 November 2026`) dan waktu.
- Alamat acara dan tautan Google Maps.
- Nomor rekening, nama pemilik rekening, dan alamat hadiah.
- Tautan media sosial.
- Teks kisah cinta, dress code, dan detail lainnya.

### Foto dan musik
- Ganti blok ilustrasi `.portrait` dan `.gallery-item` dengan elemen `<img>` yang memakai foto milik Anda.
- Untuk musik, letakkan file yang Anda punya hak untuk menggunakannya di `assets/music.mp3`. File musik tidak disertakan dalam paket ini.
- Jika menambahkan foto, kompres terlebih dahulu agar halaman tetap cepat dibuka.

### Nama tamu personal
Bagikan URL seperti:
`https://USERNAME.github.io/NAMA-REPOSITORY/?to=Nama%20Tamu`

Teks nama tamu akan ditampilkan pada cover dan otomatis diisi ke form RSVP. Gunakan nama yang sesuai dan jangan memasukkan data sensitif ke URL.

## Batasan penting pada versi statis
GitHub Pages hanya menyajikan file statis. Pada versi ini, RSVP dan ucapan disimpan menggunakan `localStorage`, sehingga:
- Data hanya tersedia di browser/perangkat yang mengirimkannya.
- Dashboard admin **tidak menerima** data dari browser tamu lain.
- `admin.html` bukan dashboard privat dan tidak memiliki login server-side.
- Jangan gunakan contoh ini untuk mengumpulkan data tamu sungguhan tanpa menambahkan backend/database dan autentikasi.

Untuk versi produksi, sambungkan form ke Supabase/Firebase atau backend API, buat autentikasi admin, atur aturan keamanan database, dan siapkan kebijakan privasi serta backup.

## Fitur yang sudah tersedia
- Layout responsif dan navigasi mobile.
- Cover undangan dan sapaan tamu dari parameter URL.
- Profil pasangan dan kisah cinta.
- Countdown tanggal pernikahan.
- Detail akad/resepsi dan tautan peta.
- Galeri demo dengan modal.
- Form RSVP lokal.
- Buku ucapan lokal.
- Tombol salin rekening/alamat.
- Unduh file kalender `.ics`.
- Kontrol musik (membutuhkan file musik sendiri).
- Dashboard demo, pencarian RSVP, ekspor CSV/JSON.
- Metadata dasar untuk berbagi/SEO.
- Preferensi reduced motion.

Fitur yang belum terhubung ke layanan backend (seperti pengiriman WhatsApp otomatis, pembayaran, analitik lintas pengunjung, multi-user, akun pelanggan, dan unggah media dari dashboard) memerlukan layanan/server tambahan. Jangan menampilkan fitur itu seolah sudah aktif tanpa integrasi.

## Catatan evaluasi desain (referensi rekaman layar)

Versi ini mengambil inspirasi dari alur undangan pada rekaman: sampul pembuka, identitas pasangan, hitung mundur, detail akad/resepsi, galeri, RSVP, ucapan, hadiah, dan penutup. Desainnya tidak menyalin persis; latar dan komponen disesuaikan agar **biru pastel menjadi warna dominan**, dengan efek langit lembut, panel putih transparan, aksen biru, kartu membulat, serta tata letak responsif. Konten nama, tanggal, lokasi, foto, rekening, dan tautan tetap perlu diganti dengan data asli.

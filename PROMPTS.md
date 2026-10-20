# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
AI membuat lib/supabase/server.js (koneksi Supabase khusus server memakai SUPABASE_URL dan SUPABASE_SECRET_KEY) dan lib/supabase/index.js, lalu mengubah app/page.jsx menjadi Server Component async yang mengambil data dari tabel produk (urut berdasarkan id). Halaman menangani tiga kondisi: pesan error jika gagal, "Belum ada produk" jika kosong, dan grid KartuProduk jika ada data. CatatanBelumAktif dan data contoh sudah dihapus. Katalog menampilkan 60 produk dari database. Diuji: nama produk "Keripik Singkong Balado" diubah menjadi "Keripik Tempe Kering" di Supabase Table Editor, lalu ikut berubah di halaman setelah refresh.

**Perbaikan:**
Tidak ada.

## US-02 Detail produk

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi yang sudah ada di lib/supabase/server.js. Ingat di Next.js 16 params berupa Promise: const { id } = await params.

Tampilkan foto, kategori, nama, harga, dan deskripsi dengan tampilan yang sudah ada, tanpa mengubah desainnya. Kalau produk tidak ditemukan, panggil notFound(). Pertahankan tombol WhatsApp. Hapus CatatanBelumAktif dan pemakaian data contoh dari halaman ini.

Hanya ubah app/produk/[id]/page.jsx. Jangan jalankan terminal, browser, atau git. Cukup ubah kodenya, saya yang tes.

**Hasil:**
AI mengubah app/produk/[id]/page.jsx. Halaman detail yang tadinya memakai data palsu yang ditulis di kode sekarang mengambil data dari database Supabase sesuai id di URL, jadi perubahan data di Supabase langsung terlihat di halaman. Kalau id produk tidak ada di tabel produk, kode memanggil notFound() sehingga muncul halaman "Halaman tidak ditemukan".

Saya tes: klik kartu produk lalu halaman detail tampil lengkap, deskripsi yang saya ubah di Supabase ikut berubah, dan /produk/9999 menampilkan "Halaman tidak ditemukan".

**Perbaikan:**
Tidak ada.

## US-03 Pesan via WhatsApp

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-04 Login admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

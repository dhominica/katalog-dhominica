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
Baca AGENTS.md, docs/user-stories.md bagian US-03, dan docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx supaya membuka link https://wa.me/<nomor>?text=<pesan>. Nomor diambil dari toko.nomorWhatsApp di lib/toko.js. Pesan berisi nama produk dan harga dalam format rupiah memakai formatRupiah dari lib/format.js, contoh: "Halo Dapur Domi, saya ingin memesan Kopi Bubuk Robusta 250 g (Rp 45.000). Apakah masih tersedia?". Encode pesan dengan encodeURIComponent. Ganti <button> menjadi <a> yang dibuka di tab baru dengan target="_blank" dan rel="noopener noreferrer", dengan className yang sama persis supaya tampilannya tidak berubah. Hapus komentar "belum berfungsi" di file itu.

Hanya ubah components/TombolWhatsApp.jsx. Jangan jalankan terminal, browser, atau git. Cukup ubah kodenya, saya yang tes.

**Hasil:**
AI mengubah components/TombolWhatsApp.jsx. Tombol yang tadinya tidak berfungsi sekarang menjadi link wa.me yang membuka WhatsApp ke nomor toko di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk. Karena nomor diambil dari lib/toko.js, kalau nomor toko berganti cukup ubah satu file itu.

Saya tes: klik tombol di halaman detail produk, WhatsApp terbuka di tab baru dengan pesan berisi nama dan harga produk tersebut.

**Perbaikan:**
Awalnya tombol terlihat tidak bisa diklik karena halaman belum dimuat ulang. Setelah refresh (Ctrl + Shift + R), tombol berfungsi.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md (aturan keamanan) dan docs/user-stories.md bagian US-04.

Buat login admin dengan Supabase Auth (email dan password) yang diproses di server:

1. Buat lib/supabase/auth.js berisi fungsi createAuthClient() memakai createServerClient dari @supabase/ssr dengan SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY, menyimpan sesi di cookie lewat await cookies() dari next/headers. Jangan ubah lib/supabase/server.js.
2. Buat app/admin/actions.js ("use server") berisi Server Action login: panggil signInWithPassword. Berhasil: redirect ke /admin. Gagal: redirect ke /admin/login?error=1.
3. Di file yang sama buat Server Action logout: panggil signOut lalu redirect ke /admin/login.
4. Sambungkan form di app/admin/login/page.jsx ke action login. Baca searchParams (await, Next.js 16) dan jika ada error tampilkan pesan "Email atau password salah." Hapus CatatanBelumAktif dan komentar "belum berfungsi".
5. Di components/NavAdmin.jsx, bungkus tombol Keluar dengan form yang memanggil action logout, tanpa mengubah tampilannya.

Jangan ubah tampilan. Jangan buat proxy.js dulu (itu US-06). Jangan jalankan terminal, browser, atau git. Cukup ubah kodenya, saya yang tes.

**Hasil:**
AI membuat lib/supabase/auth.js (koneksi Supabase untuk login yang menyimpan sesi di cookie) dan app/admin/actions.js (Server Action login dan logout yang berjalan di server). Form login dan tombol Keluar di NavAdmin sudah tersambung. Login benar diarahkan ke /admin, login salah kembali ke halaman login dengan ?error=1 dan pesan "Email atau password salah.", tombol Keluar menghapus sesi lalu kembali ke halaman login.

Saya tes: login dengan password salah muncul pesan error, login benar masuk ke /admin, klik Keluar kembali ke halaman login.

**Perbaikan:**
Tidak ada.

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

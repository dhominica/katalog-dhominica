# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

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
Baca AGENTS.md dan docs/user-stories.md bagian US-05.

Di app/admin/actions.js tambahkan Server Action gantiPassword memakai createAuthClient dari lib/supabase/auth.js:
1. Cek admin sudah login dengan supabase.auth.getUser(). Kalau belum, redirect ke /admin/login.
2. Validasi di server: password_baru minimal 8 karakter dan harus sama dengan konfirmasi_password. Kalau tidak valid, redirect ke /admin/password?error=pendek atau ?error=beda.
3. Panggil supabase.auth.updateUser({ password }). Gagal: redirect ke /admin/password?error=gagal. Berhasil: redirect ke /admin/password?sukses=1.

Sambungkan form di app/admin/password/page.jsx ke action itu. Baca searchParams (await) dan tampilkan pesan yang jelas: "Password minimal 8 karakter.", "Konfirmasi password tidak sama.", "Gagal mengganti password.", atau "Password berhasil diganti." Hapus CatatanBelumAktif dan komentar "belum berfungsi". Jangan ubah tampilan form.

Hanya ubah app/admin/actions.js dan app/admin/password/page.jsx. Jangan jalankan terminal, browser, atau git. Cukup ubah kodenya, saya yang tes.

**Hasil:**
AI menambahkan Server Action gantiPassword di app/admin/actions.js. Sebelum mengganti password, server memeriksa 3 hal: admin sudah login, password minimal 8 karakter, dan password sama dengan konfirmasinya. Kalau lolos, password diganti di Supabase lewat updateUser. Hasilnya dikirim lewat URL (?sukses=1 atau ?error=...) lalu halaman menampilkan pesan berhasil atau error.

**Perbaikan:**
Awalnya kode belum masuk karena perubahan AI belum selesai/di-accept. Setelah di-accept, form tersambung.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md (aturan keamanan nomor 3 dan 4) dan docs/user-stories.md bagian US-06.

Buat proxy.js di root proyek (Next.js 16, pengganti middleware.js, export function proxy(request)). Di dalamnya buat client Supabase dengan createServerClient dari @supabase/ssr memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY, membaca dan menulis cookie dari request/response. Panggil supabase.auth.getUser(). Semua rute /admin kecuali /admin/login wajib login: kalau belum login, redirect ke /admin/login. Kalau sudah login dan membuka /admin/login, redirect ke /admin. Pasang config matcher hanya untuk /admin/:path*.

Pastikan setiap Server Action yang mengubah data di app/admin/actions.js memeriksa login di server dengan getUser() (gantiPassword sudah, cek ulang). Hapus CatatanBelumAktif dan komentar "US-06" dari app/admin/page.jsx tanpa mengubah tampilan lainnya.

Hanya buat proxy.js dan ubah app/admin/page.jsx (dan actions.js jika perlu). Jangan jalankan terminal, browser, atau git. Cukup ubah kodenya, saya yang tes.

**Hasil:**
AI membuat proxy.js di root proyek sebagai "satpam" untuk semua halaman /admin. Proxy memeriksa cookie login lewat getUser(): kalau belum login dialihkan ke /admin/login, kalau sudah login dan membuka /admin/login dialihkan ke /admin. Server Action gantiPassword juga memeriksa login di server, jadi pengamanannya dua lapis.

Saya tes di jendela penyamaran: /admin dan /admin/password dialihkan ke halaman login.

**Perbaikan:**
Saya ubah proxy.js: sebelumnya kalau environment variable Supabase tidak ada, halaman admin dibiarkan terbuka. Saya ganti agar mengembalikan error 500 supaya halaman admin tetap tertutup. Sempat salah karena blok if ikut terhapus sehingga semua halaman admin error, lalu saya kembalikan if-nya.

## Debugging dan fitur bonus

### Bonus US-22, US-26, US-27, US-28

**Prompt:** 
Baca AGENTS.md dan docs/user-stories.md bagian US-22, US-26, US-27, US-28. Kerjakan keempatnya:

US-22: buat app/tentang/page.jsx berisi profil toko, alamat, jam buka, dan kontak WhatsApp dari lib/toko.js. Tambahkan tautan "Tentang" di components/Footer.jsx.
US-26: di app/produk/[id]/page.jsx tambahkan generateMetadata (await params) yang mengambil produk dari Supabase lewat lib/supabase/server.js: title = nama produk, description = deskripsi, openGraph berisi title dan images foto_url.
US-27: buat app/sitemap.js yang mengambil semua id produk dari Supabase dan memuat URL beranda, /tentang, dan /produk/[id]. Buat app/robots.js yang mengizinkan semua halaman kecuali /admin dan menunjuk ke sitemap. Base URL dari process.env.VERCEL_PROJECT_PRODUCTION_URL (tambahkan https://), fallback http://localhost:3000.
US-28: pastikan app/not-found.jsx punya tautan kembali ke beranda. Buat app/loading.jsx dan app/produk/[id]/loading.jsx berupa skeleton sederhana sesuai DESIGN.md.

Jangan ubah tampilan yang sudah ada. Jangan jalankan terminal, browser, atau git.

**Hasil:**
AI membuat halaman /tentang (ditautkan di footer), generateMetadata di halaman detail sehingga judul dan foto produk muncul saat link dibagikan, sitemap.xml dari database dan robots.txt yang melarang /admin, serta loading skeleton di beranda dan halaman detail.

Prompt bonus diberi tanda  karena worksheet bilang prompt bonus memang ditulis sendiri, nggak ada di lembar kerja.


**Prompt:** 
Baca AGENTS.md dan docs/user-stories.md bagian US-07, US-30, US-35. Kerjakan ketiganya:

US-07: ubah app/admin/page.jsx supaya daftar produk diambil dari Supabase lewat lib/supabase/server.js (urut id), bukan data contoh. Hapus komentar US-07.
US-30: di atas tabel pada app/admin/page.jsx tampilkan ringkasan: total jumlah produk dan jumlah produk per kategori, dihitung dari data database yang sama. Gaya kartu sederhana sesuai DESIGN.md.
US-35: buat app/admin/ekspor/route.js (GET) yang WAJIB cek login dengan getUser() dari createAuthClient di lib/supabase/auth.js (belum login: return 401). Ambil semua produk, buat CSV di server dengan header id,nama,harga,kategori,deskripsi,foto_url,created_at; setiap nilai dibungkus kutip ganda dan kutip di dalamnya digandakan. Response Content-Type text/csv dan Content-Disposition attachment; filename="produk.csv". Tambahkan tombol "Ekspor CSV" berupa link <a href="/admin/ekspor"> di samping tombol Tambah produk.

Jangan ubah tampilan lain. Jangan jalankan terminal, browser, atau git.

**Hasil:**
Daftar produk di /admin sekarang diambil dari database, ada kartu ringkasan total produk dan jumlah per kategori, dan tombol "Ekspor CSV" yang mengunduh semua produk. Endpoint ekspor memeriksa login di server, tanpa login ditolak (401).
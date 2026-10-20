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


**Prompt:** 
Baca AGENTS.md dan docs/user-stories.md bagian US-07, US-30, US-35. Kerjakan ketiganya:

US-07: ubah app/admin/page.jsx supaya daftar produk diambil dari Supabase lewat lib/supabase/server.js (urut id), bukan data contoh. Hapus komentar US-07.
US-30: di atas tabel pada app/admin/page.jsx tampilkan ringkasan: total jumlah produk dan jumlah produk per kategori, dihitung dari data database yang sama. Gaya kartu sederhana sesuai DESIGN.md.
US-35: buat app/admin/ekspor/route.js (GET) yang WAJIB cek login dengan getUser() dari createAuthClient di lib/supabase/auth.js (belum login: return 401). Ambil semua produk, buat CSV di server dengan header id,nama,harga,kategori,deskripsi,foto_url,created_at; setiap nilai dibungkus kutip ganda dan kutip di dalamnya digandakan. Response Content-Type text/csv dan Content-Disposition attachment; filename="produk.csv". Tambahkan tombol "Ekspor CSV" berupa link <a href="/admin/ekspor"> di samping tombol Tambah produk.

Jangan ubah tampilan lain. Jangan jalankan terminal, browser, atau git.

**Hasil:**
Daftar produk di /admin sekarang diambil dari database, ada kartu ringkasan total produk dan jumlah per kategori, dan tombol "Ekspor CSV" yang mengunduh semua produk. Endpoint ekspor memeriksa login di server, tanpa login ditolak (401).

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-11, US-15, US-16. Ubah app/page.jsx (Server Component, baca searchParams dengan await):

US-11: form GET berisi input pencarian nama (q) dan pilihan kategori (kategori). Query Supabase memakai .ilike("nama", `%q%`) dan .eq("kategori", ...) jika diisi.
US-15: pilihan urutan (urut): terbaru (created_at desc), termurah (harga asc), termahal (harga desc), diterapkan di query .order().
US-16: paginasi 12 produk per halaman (hal) memakai .range() dan select("*", { count: "exact" }) di query. Tampilkan tombol Sebelumnya/Berikutnya dan "Halaman X dari Y", mempertahankan q, kategori, dan urut di link.

Pakai komponen Input dan Tombol yang ada, gaya sesuai DESIGN.md. Tetap pakai KartuProduk. Hanya ubah app/page.jsx. Jangan jalankan terminal, browser, atau git.

**Hasil:**
Beranda sekarang punya kotak pencarian nama produk, pilihan kategori, dan pilihan urutan (terbaru, termurah, termahal). Produk dibagi 12 per halaman dengan tombol Sebelumnya/Berikutnya dan tulisan "Halaman X dari Y". Semua penyaringan, urutan, dan pembatasan jumlah dilakukan langsung di query database (.ilike, .eq, .order, .range), bukan hanya disembunyikan di tampilan.

### Bonus US-17, US-23, US-24, US-25, US-36

**Prompt:**
Baca AGENTS.md, DESIGN.md, dan docs/user-stories.md bagian US-17, US-23, US-24, US-25, US-36. Kerjakan kelimanya. Komponen "use client" TIDAK boleh berisi Supabase.

US-25 mode gelap: di app/globals.css tambahkan blok html[data-theme="dark"] yang mengganti semua variabel warna --color-* dengan versi gelap yang tetap terbaca. Buat components/TombolTema.jsx ("use client") untuk berpindah terang/gelap, simpan pilihan di localStorage, pasang di components/Header.jsx. Di app/layout.jsx tambahkan script kecil di <head> yang menerapkan tema tersimpan sebelum halaman tampil, dan suppressHydrationWarning di <html>.
US-23: buat components/TombolBagikan.jsx ("use client") di halaman detail produk: pakai navigator.share jika ada, kalau tidak salin link dengan navigator.clipboard, lalu tampilkan "Link tersalin".
US-17: di app/produk/[id]/page.jsx tampilkan "Produk terkait": maksimal 4 produk lain dari kategori yang sama, diambil dari Supabase di server (.eq kategori, .neq id, .limit 4), pakai KartuProduk.
US-24: buat components/TombolFavorit.jsx ("use client") di halaman detail yang menyimpan produk (id, nama, harga, foto_url) ke localStorage "favorit". Buat halaman app/favorit/page.jsx yang menampilkan produk favorit dari localStorage lewat komponen client, dengan pesan jika kosong. Tambahkan tautan "Favorit" di Header.
US-36: buat components/CatatTerakhirDilihat.jsx ("use client") di halaman detail yang menyimpan produk ke localStorage "terakhir_dilihat" (maksimal 6, tanpa duplikat). Buat components/TerakhirDilihat.jsx ("use client") di beranda app/page.jsx yang menampilkan bagian "Terakhir dilihat" dan tidak tampil jika kosong.

Jangan ubah fitur lain. Jangan jalankan terminal, browser, atau git.

**Hasil:**
Ditambahkan mode gelap dengan tombol di header yang pilihannya diingat di localStorage, tombol bagikan/salin link di halaman detail, bagian "Produk terkait" dari kategori yang sama (diambil dari database di server), tombol favorit dengan halaman /favorit, dan bagian "Terakhir dilihat" di beranda. Fitur favorit, terakhir dilihat, dan tema disimpan di localStorage browser sehingga komponennya memakai "use client", tanpa Supabase di dalamnya.

### Keamanan K-6, K-7, K-8, K-9, K-12, K-13

**Prompt:** 
Baca AGENTS.md. Kerjakan pemeriksaan keamanan berikut tanpa mengubah tampilan: K-6 header keamanan di next.config.mjs (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, Strict-Transport-Security). K-7 hapus dangerouslySetInnerHTML/eval, script tema dipindah ke public/tema.js. K-8 X-Robots-Tag noindex untuk /admin dan app/admin/layout.jsx dengan metadata robots noindex. K-9 app/error.jsx dengan pesan umum tanpa error.message/stack, dan pesan error umum di beranda. K-12 rate limit login 5 percobaan per 15 menit per IP. K-13 hapus semua console.log. Jangan jalankan terminal, browser, atau git.

**Hasil:**
Ditambahkan header keamanan, script tema dipindah ke public/tema.js sehingga tidak ada dangerouslySetInnerHTML, halaman /admin diberi noindex, halaman error umum tanpa detail teknis, batas 5 percobaan login per 15 menit, dan tidak ada console.log.

### Keamanan K-10

[SENDIRI] Saya menjalankan npm audit di terminal, hasilnya: found 0 vulnerabilities.

### Bonus US-13, US-37, US-49 (dikerjakan dengan AI cadangan)

**Prompt:** [SENDIRI]
 buat web app manifest (US-13) memakai ikon di public/icons, halaman /kategori/[slug] yang menampilkan produk per kategori dari database dengan "tidak ditemukan" untuk kategori yang tidak ada dan tautan kategori di halaman detail (US-49), serta fitur bandingkan 2 produk (US-37) dengan pilihan maksimal 2 di browser dan halaman /bandingkan berdampingan.

**Hasil:**
app/manifest.js otomatis ditautkan di halaman sehingga katalog bisa di-install ke HP. Halaman /kategori/minuman dan sejenisnya menampilkan produk kategori itu, kategori yang tidak ada menampilkan "Halaman tidak ditemukan", dan nama kategori di halaman detail bisa diklik. Di halaman detail ada tombol "Bandingkan (x/2)"; pilihan ketiga menggantikan pilihan paling lama dengan pesan, dan /bandingkan?a=..&b=.. menampilkan foto, kategori, harga, dan deskripsi berdampingan. Produk yang tidak ada menampilkan "tidak ditemukan".

### Bonus US-08, US-09, US-10, US-34 (dikerjakan dengan AI cadangan)

**Prompt:** [SENDIRI]
buat tambah, ubah, dan hapus produk di halaman admin. Setiap aksi wajib cek login di server, validasi di server (nama wajib, harga angka positif) dengan pesan error per field tanpa menghapus isian, form ubah terisi data lama dari database, dan tombol hapus meminta konfirmasi.

**Hasil:**
Di app/admin/actions.js ditambahkan simpanProduk (insert jika baru, update jika ada id) dan hapusProduk, keduanya memanggil wajibLogin() sehingga tanpa login ditolak server. FormProduk memakai useActionState sehingga pesan error tampil di bawah field yang salah dan isian tidak hilang. Halaman ubah mengambil data lama dari Supabase, dan tombol Hapus menampilkan konfirmasi "Hapus produk ini?". Setelah simpan atau hapus, halaman kembali ke /admin.

### Bonus US-12, US-21, US-33, US-46 (dikerjakan dengan AI cadangan)

**Prompt:** [SENDIRI]
tambahkan pilihan jumlah di halaman detail yang ikut tertulis di pesan WhatsApp (US-12), keranjang di browser dengan ubah jumlah, hapus item, total, dan satu tombol kirim semua via WhatsApp (US-21), kolom cari dan paginasi di /admin lewat query database dengan kata kunci dan halaman di URL (US-33), serta impor produk dari CSV dengan validasi per baris, laporan nomor baris yang salah, dan ringkasan hasil (US-46).

**Hasil:**
Halaman detail punya input jumlah dan total; pesan WhatsApp memuat jumlah. Tombol "Tambah ke keranjang" menyimpan ke localStorage, halaman /keranjang bisa mengubah jumlah, menghapus item, menghitung total, dan mengirim semua isi dalam satu pesan WhatsApp. /admin punya pencarian (.ilike) dan paginasi (.range) dengan ?q= dan ?hal= di URL. /admin/impor menerima CSV, setiap baris dicek (nama wajib, harga angka positif), baris yang salah dilaporkan dengan nomor barisnya, baris valid disimpan sekaligus, lalu ringkasan berhasil/gagal ditampilkan. Semua aksi admin memeriksa login di server.

### Bonus US-44 (dikerjakan dengan AI cadangan)

**Prompt:** [SENDIRI]
buat halaman /admin/akun untuk mengelola akun admin lewat Supabase Auth. Admin bisa melihat daftar admin, menambah admin baru, serta menonaktifkan atau menghapus admin lain tetapi tidak akunnya sendiri. Semua aksi diperiksa di server.

**Hasil:**
Halaman /admin/akun menampilkan daftar admin dari supabase.auth.admin.listUsers() (memakai secret key hanya di server). Form tambah admin memanggil auth.admin.createUser, tombol Nonaktifkan memakai ban_duration, tombol Hapus memakai deleteUser. Server menolak aksi terhadap akun sendiri dan setiap aksi memeriksa login lebih dulu.

### Bonus US-19, US-20, US-32, US-40, US-41 (dikerjakan dengan AI cadangan)

**Prompt:** [SENDIRI]
tambahkan kolom aktif, stok, harga_coret, badge di tabel produk dan tabel klik_whatsapp (SQL saya jalankan sendiri di Supabase SQL Editor). Buat tombol aktif/nonaktif produk di admin dan sembunyikan produk nonaktif dari halaman publik (US-32), status stok dengan penanda "Habis" dan tombol pesan disembunyikan (US-19), harga coret dan badge (US-20), pencatatan klik pesan WhatsApp tanpa data pribadi (US-40), dan 5 produk terlaris di dashboard admin (US-41).

**Hasil:**
Semua query publik memakai .eq("aktif", true) sehingga produk nonaktif tidak tampil dan halaman detailnya "tidak ditemukan". Form admin punya isian stok, harga normal (dicoret), dan badge yang divalidasi di server. Kartu dan halaman detail menampilkan harga coret, badge, dan penanda "Habis"; jika stok 0 tombol pesan diganti tulisan "Stok habis". Klik tombol WhatsApp dicatat lewat Server Action (hanya id produk dan waktu) tanpa menunggu, dan dashboard /admin menampilkan 5 produk dengan klik terbanyak atau pesan jika belum ada data.

### Bonus US-18, US-45, US-47 (dikerjakan dengan AI cadangan)

**Prompt:** [SENDIRI]
tambahkan kolom urutan dan galeri di tabel produk serta tabel log_admin (SQL saya jalankan sendiri di Supabase). Buat galeri beberapa foto di halaman detail (US-18), log aktivitas admin untuk tambah/ubah/hapus produk dengan halaman 50 log terakhir (US-45), dan tombol naik/turun urutan produk di admin yang diikuti katalog publik (US-47).

**Hasil:**
Form produk punya isian foto tambahan (dipisah koma) yang disimpan ke kolom galeri; halaman detail menampilkan foto utama dan gambar kecil yang bisa diklik, produk dengan satu foto tampil normal. Setiap tambah, ubah, hapus, aktif/nonaktif, impor, dan geser urutan mencatat email admin, aksi, dan waktu ke log_admin; halaman /admin/log menampilkan 50 log terakhir dan dilindungi login. Tabel admin punya tombol ↑ ↓ untuk menukar urutan, dan katalog publik secara bawaan diurutkan berdasarkan kolom urutan (pilihan "Pilihan toko").

### Bonus US-38, US-39 (dikerjakan dengan AI cadangan)

**Prompt:** [SENDIRI]
buat tabel ulasan (SQL saya jalankan sendiri di Supabase), form ulasan (nama, rating 1-5, komentar) di halaman detail yang disimpan lewat Server Action dengan validasi server dan perlindungan spam, daftar ulasan dan rata-rata rating, serta halaman admin untuk menyembunyikan atau menghapus ulasan.

**Hasil:**
Halaman detail menampilkan rata-rata rating, daftar ulasan, dan form ulasan. Server memvalidasi nama (maks 50), rating 1-5, dan komentar (3-500 karakter), memakai honeypot tersembunyi, dan membatasi 3 ulasan per 10 menit per IP. Halaman /admin/ulasan menampilkan semua ulasan dengan tombol Sembunyikan/Tampilkan dan Hapus yang memeriksa login di server. Ulasan yang disembunyikan tidak tampil dan tidak dihitung di rata-rata.

### Bonus US-42 (dikerjakan dengan AI cadangan)

**Prompt:** [SENDIRI]
Dengan AI cadangan (Claude Code): buat tabel banner (SQL saya jalankan sendiri), halaman /admin/banner untuk membuat, mengubah, dan menonaktifkan banner (judul, teks, gambar, tautan) dengan login dicek di server, dan tampilkan banner aktif di beranda.

**Hasil:**
Halaman /admin/banner punya form buat dan ubah banner dengan pilihan aktif. Server Action simpanBanner memeriksa login, memvalidasi judul dan tautan, lalu mencatat log. Beranda hanya menampilkan banner dengan aktif = true dari database.

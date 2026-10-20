import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const PER_HALAMAN = 10;

export default async function HalamanAdmin({ searchParams }) {
  const sp = await searchParams;
  // US-33: kata kunci dan nomor halaman disimpan di URL.
  const q = typeof sp?.q === "string" ? sp.q.trim() : "";
  const hal = Math.max(1, parseInt(sp?.hal, 10) || 1);

  let daftarProduk = [];
  let totalCocok = 0;
  let semuaKategori = [];
  let terlaris = [];

  try {
    const supabase = createServerClient();

    // US-30: ringkasan dihitung dari seluruh produk.
    const { data: ringkas } = await supabase.from("produk").select("kategori");
    semuaKategori = ringkas || [];

    // US-41: 5 produk dengan klik pesan WhatsApp terbanyak, dihitung dari tabel klik_whatsapp.
    const { data: klik } = await supabase.from("klik_whatsapp").select("produk_id, produk(nama)");
    const hitung = {};
    for (const k of klik || []) {
      if (!k.produk_id) continue;
      hitung[k.produk_id] ??= { nama: k.produk?.nama ?? `Produk ${k.produk_id}`, jumlah: 0 };
      hitung[k.produk_id].jumlah += 1;
    }
    terlaris = Object.values(hitung)
      .sort((x, y) => y.jumlah - x.jumlah)
      .slice(0, 5);

    // US-33: pencarian dan paginasi dilakukan di query database.
    let query = supabase
      .from("produk")
      .select("*", { count: "exact" })
      .order("urutan", { ascending: true })
      .order("id", { ascending: true })
      .range((hal - 1) * PER_HALAMAN, hal * PER_HALAMAN - 1);
    if (q) {
      query = query.ilike("nama", `%${q}%`);
    }
    const { data, count, error } = await query;

    if (!error && data) {
      daftarProduk = data;
      totalCocok = count || 0;
    }
  } catch {
    // Koneksi gagal: tabel tampil kosong.
  }

  const kategoriCount = semuaKategori.reduce((acc, produk) => {
    const kat = produk.kategori || "Tanpa kategori";
    acc[kat] = (acc[kat] || 0) + 1;
    return acc;
  }, {});

  const totalHalaman = Math.max(1, Math.ceil(totalCocok / PER_HALAMAN));
  const linkHalaman = (n) => `/admin?${new URLSearchParams({ ...(q ? { q } : {}), hal: String(n) })}`;

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/admin/ekspor"
            className="inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-4 py-2.5 text-sm font-semibold text-teks transition-colors hover:border-utama hover:text-utama"
          >
            Ekspor CSV
          </a>
          <Tombol href="/admin/impor" varian="garis">
            Impor CSV
          </Tombol>
          <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
        </div>
      </div>

      {/* Ringkasan produk */}
      <section aria-label="Ringkasan produk" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-garis bg-latar p-4">
          <p className="text-xs font-semibold text-teks-lembut">Total produk</p>
          <p className="mt-1 text-2xl font-extrabold text-teks">{semuaKategori.length}</p>
        </div>
        {Object.entries(kategoriCount).map(([kategori, jumlah]) => (
          <div key={kategori} className="rounded-2xl border border-garis bg-latar p-4">
            <p className="text-xs font-semibold text-teks-lembut">{kategori}</p>
            <p className="mt-1 text-2xl font-extrabold text-teks">{jumlah}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="judul-terlaris" className="flex flex-col gap-2">
        <h2 id="judul-terlaris" className="text-lg font-bold">
          Produk terlaris (klik pesan WhatsApp)
        </h2>
        {terlaris.length === 0 ? (
          <p className="text-sm text-teks-lembut">Belum ada data klik pesan WhatsApp.</p>
        ) : (
          <ol className="list-decimal pl-5 text-sm">
            {terlaris.map((p) => (
              <li key={p.nama}>
                {p.nama}: {p.jumlah} klik
              </li>
            ))}
          </ol>
        )}
      </section>

      <form method="GET" action="/admin" className="flex max-w-md gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Cari nama produk"
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
        <Tombol type="submit">Cari</Tombol>
      </form>

      {daftarProduk.length === 0 ? (
        <p className="text-teks-lembut">Tidak ada produk yang cocok.</p>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}

      <nav aria-label="Halaman" className="flex items-center gap-3 text-sm">
        {hal > 1 && (
          <Tombol href={linkHalaman(hal - 1)} varian="garis">
            Sebelumnya
          </Tombol>
        )}
        <span className="text-teks-lembut">
          Halaman {hal} dari {totalHalaman}
        </span>
        {hal < totalHalaman && (
          <Tombol href={linkHalaman(hal + 1)} varian="garis">
            Berikutnya
          </Tombol>
        )}
      </nav>
    </div>
  );
}

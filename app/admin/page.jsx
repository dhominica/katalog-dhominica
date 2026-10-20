import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  let daftarProduk = [];

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (!error && data) {
      daftarProduk = data;
    }
  } catch (err) {
    // Tangani jika terjadi error koneksi
  }

  // Hitung jumlah produk per kategori
  const kategoriCount = daftarProduk.reduce((acc, produk) => {
    const kat = produk.kategori || "Tanpa kategori";
    acc[kat] = (acc[kat] || 0) + 1;
    return acc;
  }, {});

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
          {/* US-08 (bonus): tambah produk */}
          <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
        </div>
      </div>

      {/* Ringkasan produk */}
      <section aria-label="Ringkasan produk" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-garis bg-latar p-4">
          <p className="text-xs font-semibold text-teks-lembut">Total produk</p>
          <p className="mt-1 text-2xl font-extrabold text-teks">{daftarProduk.length}</p>
        </div>
        {Object.entries(kategoriCount).map(([kategori, jumlah]) => (
          <div key={kategori} className="rounded-2xl border border-garis bg-latar p-4">
            <p className="text-xs font-semibold text-teks-lembut">{kategori}</p>
            <p className="mt-1 text-2xl font-extrabold text-teks">{jumlah}</p>
          </div>
        ))}
      </section>

      <TabelProduk daftarProduk={daftarProduk} />
    </div>
  );
}

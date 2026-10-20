import KartuProduk from "@/components/KartuProduk";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import TerakhirDilihat from "@/components/TerakhirDilihat";
import { toko } from "@/lib/toko";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ITEM_PER_HALAMAN = 12;

export default async function HalamanKatalog({ searchParams }) {
  const sp = await searchParams;
  const q = typeof sp?.q === "string" ? sp.q.trim() : Array.isArray(sp?.q) ? sp.q[0].trim() : "";
  const kategori =
    typeof sp?.kategori === "string"
      ? sp.kategori.trim()
      : Array.isArray(sp?.kategori)
        ? sp.kategori[0].trim()
        : "";
  const urut =
    typeof sp?.urut === "string"
      ? sp.urut.trim()
      : Array.isArray(sp?.urut)
        ? sp.urut[0].trim()
        : "";
  const rawHal = typeof sp?.hal === "string" ? sp.hal : Array.isArray(sp?.hal) ? sp.hal[0] : "";
  const hal = Math.max(1, parseInt(rawHal, 10) || 1);

  let daftarProduk = [];
  let totalProduk = 0;
  let daftarKategori = ["Bumbu", "Camilan", "Kain", "Kerajinan", "Kue kering", "Minuman"];
  let errorPesan = null;

  const dari = (hal - 1) * ITEM_PER_HALAMAN;
  const sampai = dari + ITEM_PER_HALAMAN - 1;

  try {
    const supabase = createServerClient();

    // Ambil daftar kategori unik dari produk
    const { data: katData } = await supabase.from("produk").select("kategori");
    if (katData && katData.length > 0) {
      const kategoriUnik = Array.from(
        new Set(katData.map((item) => item.kategori).filter(Boolean))
      ).sort();
      if (kategoriUnik.length > 0) {
        daftarKategori = kategoriUnik;
      }
    }

    // Bangun query Supabase (US-11, US-15, US-16)
    let query = supabase.from("produk").select("*", { count: "exact" });

    // US-11: pencarian nama (q) dan filter kategori
    if (q) {
      query = query.ilike("nama", `%${q}%`);
    }
    if (kategori) {
      query = query.eq("kategori", kategori);
    }

    // US-15: pilihan urutan (urut)
    if (urut === "termurah") {
      query = query.order("harga", { ascending: true });
    } else if (urut === "termahal") {
      query = query.order("harga", { ascending: false });
    } else {
      // terbaru (created_at desc)
      query = query.order("created_at", { ascending: false });
    }

    // US-16: paginasi 12 produk per halaman memakai .range()
    query = query.range(dari, sampai);

    const { data, count, error } = await query;

    if (error) {
      errorPesan = true;
    } else {
      daftarProduk = data || [];
      totalProduk = count || 0;
    }
  } catch (err) {
    errorPesan = true;
  }

  const totalHalaman = Math.max(1, Math.ceil(totalProduk / ITEM_PER_HALAMAN));

  function buatLinkHalaman(nomorHal) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (kategori) params.set("kategori", kategori);
    if (urut) params.set("urut", urut);
    params.set("hal", nomorHal.toString());
    return `/?${params.toString()}`;
  }

  const adaFilter = Boolean(q || kategori || (urut && urut !== "terbaru"));

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-6 pb-16">
        <div className="flex flex-col gap-4">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>

          {/* Form GET: pencarian q, pilihan kategori, pilihan urut (US-11, US-15) */}
          <form
            method="GET"
            action="/"
            className="flex flex-col gap-4 rounded-2xl border border-garis bg-permukaan p-4 sm:p-5"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Cari nama produk"
                name="q"
                type="search"
                placeholder="Misal: Kopi, Keripik..."
                defaultValue={q}
              />

              <label className="flex flex-col gap-1.5 text-sm font-semibold">
                Kategori
                <select
                  name="kategori"
                  defaultValue={kategori}
                  className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none"
                >
                  <option value="">Semua kategori</option>
                  {daftarKategori.map((kat) => (
                    <option key={kat} value={kat}>
                      {kat}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-semibold">
                Urutan
                <select
                  name="urut"
                  defaultValue={urut || "terbaru"}
                  className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none"
                >
                  <option value="terbaru">Terbaru</option>
                  <option value="termurah">Termurah</option>
                  <option value="termahal">Termahal</option>
                </select>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Tombol type="submit">Cari</Tombol>
              {adaFilter && (
                <Tombol href="/" varian="garis">
                  Reset
                </Tombol>
              )}
            </div>
          </form>
        </div>

        {errorPesan ? (
          <p className="rounded-xl border border-garis bg-permukaan p-4 text-sm text-bahaya">
            Gagal memuat produk. Coba lagi nanti.
          </p>
        ) : daftarProduk.length === 0 ? (
          <p className="text-teks-lembut">
            Belum ada produk{adaFilter ? " yang sesuai" : ""}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {daftarProduk.map((produk) => (
                <KartuProduk key={produk.id} produk={produk} />
              ))}
            </div>

            {/* Navigasi Paginasi (US-16) */}
            <nav
              aria-label="Navigasi halaman"
              className="mt-4 flex items-center justify-between gap-4 border-t border-garis pt-6"
            >
              {hal > 1 ? (
                <Tombol href={buatLinkHalaman(hal - 1)} varian="garis">
                  Sebelumnya
                </Tombol>
              ) : (
                <Tombol varian="garis" disabled className="cursor-not-allowed opacity-50">
                  Sebelumnya
                </Tombol>
              )}

              <span className="text-sm font-medium text-teks-lembut">
                Halaman {hal} dari {totalHalaman}
              </span>

              {hal < totalHalaman ? (
                <Tombol href={buatLinkHalaman(hal + 1)} varian="garis">
                  Berikutnya
                </Tombol>
              ) : (
                <Tombol varian="garis" disabled className="cursor-not-allowed opacity-50">
                  Berikutnya
                </Tombol>
              )}
            </nav>
          </>
        )}
      </section>

      <div className="pb-16">
        <TerakhirDilihat />
      </div>
    </>
  );
}

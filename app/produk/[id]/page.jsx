import Link from "next/link";
import { notFound } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import PilihPesan from "@/components/PilihPesan";
import GaleriFoto from "@/components/GaleriFoto";
import TombolBagikan from "@/components/TombolBagikan";
import TombolFavorit from "@/components/TombolFavorit";
import TombolBandingkan from "@/components/TombolBandingkan";
import CatatTerakhirDilihat from "@/components/CatatTerakhirDilihat";
import { formatRupiah } from "@/lib/format";
import { createServerClient } from "@/lib/supabase/server";
import { slugKategori } from "@/lib/kategori";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const supabase = createServerClient();
    const { data: produk } = await supabase
      .from("produk")
      .select("nama, deskripsi, foto_url")
      .eq("id", id)
      .eq("aktif", true)
      .maybeSingle();

    if (!produk) {
      return {
        title: "Produk tidak ditemukan",
      };
    }

    return {
      title: produk.nama,
      description: produk.deskripsi,
      openGraph: {
        title: produk.nama,
        description: produk.deskripsi,
        images: produk.foto_url ? [produk.foto_url] : [],
      },
    };
  } catch (err) {
    return {
      title: "Produk",
    };
  }
}

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;

  let produk = null;
  let produkTerkait = [];

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .eq("aktif", true)
      .maybeSingle();

    if (!error && data) {
      produk = data;

      // US-17: Produk terkait dari kategori yang sama (.eq kategori, .neq id, .limit 4)
      if (produk.kategori) {
        const { data: terkait } = await supabase
          .from("produk")
          .select("*")
          .eq("kategori", produk.kategori)
          .neq("id", id)
          .eq("aktif", true)
          .limit(4);

        if (terkait) {
          produkTerkait = terkait;
        }
      }
    }
  } catch (err) {
    // Jika koneksi gagal atau terjadi error, dianggap tidak ditemukan
  }

  if (!produk) {
    notFound();
  }

  return (
    <>
      {/* US-36: Catat produk yang dilihat ke localStorage "terakhir_dilihat" */}
      <CatatTerakhirDilihat produk={produk} />

      <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
        <GaleriFoto
          nama={produk.nama}
          daftarFoto={[produk.foto_url, ...(Array.isArray(produk.galeri) ? produk.galeri : [])].filter(Boolean)}
        />
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
          >
            Kembali ke katalog
          </Link>
          {produk.kategori && (
            <Link
              href={`/kategori/${slugKategori(produk.kategori)}`}
              className="self-start text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
            >
              {produk.kategori}
            </Link>
          )}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            {produk.nama}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            {produk.harga_coret > produk.harga && (
              <span className="text-teks-lembut line-through">{formatRupiah(produk.harga_coret)}</span>
            )}
            <p className="rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
              {formatRupiah(produk.harga)}
            </p>
            {produk.badge && (
              <span className="rounded-full bg-utama px-2.5 py-0.5 text-xs font-bold text-white">{produk.badge}</span>
            )}
            {produk.stok <= 0 && (
              <span className="rounded-full bg-bahaya px-2.5 py-0.5 text-xs font-bold text-white">Habis</span>
            )}
          </div>
          <p className="max-w-prose leading-relaxed text-teks-lembut">
            {produk.deskripsi}
          </p>

          {produk.stok > 0 ? (
            <PilihPesan produk={{ id: produk.id, nama: produk.nama, harga: produk.harga }} />
          ) : (
            <p className="text-sm font-semibold text-bahaya">Stok habis, belum bisa dipesan.</p>
          )}

          {/* US-23 (Bagikan) dan US-24 (Favorit) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <TombolFavorit produk={produk} />
            <TombolBagikan produk={produk} />
            <TombolBandingkan produkId={produk.id} />
          </div>
        </div>
      </article>

      {/* US-17: Produk terkait */}
      {produkTerkait.length > 0 && (
        <section aria-labelledby="judul-terkait" className="border-t border-garis py-10">
          <h2 id="judul-terkait" className="text-xl font-bold">
            Produk terkait
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {produkTerkait.map((item) => (
              <KartuProduk key={item.id} produk={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

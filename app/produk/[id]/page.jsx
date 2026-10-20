import Link from "next/link";
import { notFound } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import TombolBagikan from "@/components/TombolBagikan";
import TombolFavorit from "@/components/TombolFavorit";
import CatatTerakhirDilihat from "@/components/CatatTerakhirDilihat";
import { formatRupiah } from "@/lib/format";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const supabase = createServerClient();
    const { data: produk } = await supabase
      .from("produk")
      .select("nama, deskripsi, foto_url")
      .eq("id", id)
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
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
        />
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
          >
            Kembali ke katalog
          </Link>
          <p className="text-sm text-teks-lembut">{produk.kategori}</p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            {produk.nama}
          </h1>
          <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
            {formatRupiah(produk.harga)}
          </p>
          <p className="max-w-prose leading-relaxed text-teks-lembut">
            {produk.deskripsi}
          </p>

          <TombolWhatsApp produk={produk} />

          {/* US-23 (Bagikan) dan US-24 (Favorit) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <TombolFavorit produk={produk} />
            <TombolBagikan produk={produk} />
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

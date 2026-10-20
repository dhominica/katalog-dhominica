import Link from "next/link";
import { notFound } from "next/navigation";
import { formatRupiah } from "@/lib/format";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// US-37: bandingkan dua produk berdampingan, data diambil dari database di server.
export default async function HalamanBandingkan({ searchParams }) {
  const { a, b } = await searchParams;
  const ids = [a, b].filter(Boolean).map(String);

  if (ids.length !== 2 || ids[0] === ids[1]) {
    notFound();
  }

  let daftarProduk = [];

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.from("produk").select("*").in("id", ids).eq("aktif", true);
    if (!error && data) {
      daftarProduk = ids.map((id) => data.find((p) => String(p.id) === id)).filter(Boolean);
    }
  } catch {
    // Koneksi gagal dianggap produk tidak ditemukan.
  }

  if (daftarProduk.length !== 2) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-6 py-10">
      <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
        Kembali ke katalog
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight">Bandingkan produk</h1>
      <div className="grid grid-cols-2 gap-4">
        {daftarProduk.map((produk) => (
          <article key={produk.id} className="flex flex-col gap-3 rounded-2xl border border-garis p-3">
            <img
              src={produk.foto_url}
              alt={produk.nama}
              className="aspect-square w-full rounded-xl bg-permukaan object-cover"
            />
            <p className="text-sm text-teks-lembut">{produk.kategori}</p>
            <h2 className="font-bold leading-snug">
              <Link href={`/produk/${produk.id}`} className="hover:text-utama">
                {produk.nama}
              </Link>
            </h2>
            <p className="self-start rounded-md bg-harga-latar px-2 py-0.5 font-bold text-harga">
              {formatRupiah(produk.harga)}
            </p>
            <p className="text-sm leading-relaxed text-teks-lembut">{produk.deskripsi}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

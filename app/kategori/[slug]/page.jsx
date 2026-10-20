import Link from "next/link";
import { notFound } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import { createServerClient } from "@/lib/supabase/server";
import { namaDariSlug } from "@/lib/kategori";

export const dynamic = "force-dynamic";

// US-49: halaman produk per kategori, data diambil dari database di server.
export default async function HalamanKategori({ params }) {
  const { slug } = await params;
  const namaKategori = namaDariSlug(slug);

  let daftarProduk = [];

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .ilike("kategori", namaKategori)
      .eq("aktif", true)
      .order("id", { ascending: true });

    if (!error && data) {
      daftarProduk = data;
    }
  } catch {
    // Koneksi gagal dianggap kategori tidak ditemukan.
  }

  if (!namaKategori || daftarProduk.length === 0) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-5 py-10">
      <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
        Kembali ke katalog
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight">{daftarProduk[0].kategori}</h1>
      <p className="text-sm text-teks-lembut">{daftarProduk.length} produk</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {daftarProduk.map((produk) => (
          <KartuProduk key={produk.id} produk={produk} />
        ))}
      </div>
    </section>
  );
}

import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// US-09: ubah produk, form terisi data lama dari database.
export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  let produk = null;
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("produk").select("*").eq("id", id).maybeSingle();
    produk = data;
  } catch {
    // Koneksi gagal dianggap tidak ditemukan.
  }

  if (!produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProduk produk={produk} labelTombol="Simpan perubahan" />
    </div>
  );
}

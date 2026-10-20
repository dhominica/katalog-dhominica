import NavAdmin from "@/components/NavAdmin";
import FormBanner from "@/components/FormBanner";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// US-42: kelola banner promo beranda.
export default async function HalamanBanner() {
  let daftarBanner = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("banner").select("*").order("created_at", { ascending: false });
    daftarBanner = data || [];
  } catch {
    // Gagal memuat: daftar kosong.
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Banner promo</h1>
      {daftarBanner.map((banner) => (
        <div key={banner.id} className="rounded-2xl border border-garis p-4">
          <p className="mb-3 text-sm font-semibold">
            {banner.judul} {banner.aktif ? "(aktif)" : "(nonaktif)"}
          </p>
          <FormBanner banner={banner} />
        </div>
      ))}
      <div className="rounded-2xl border border-garis p-4">
        <p className="mb-3 text-sm font-semibold">Banner baru</p>
        <FormBanner />
      </div>
    </div>
  );
}

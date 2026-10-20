import Link from "next/link";
import NavAdmin from "@/components/NavAdmin";
import Tombol from "@/components/Tombol";
import { moderasiUlasan } from "@/app/admin/actions";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// US-39: semua ulasan, admin bisa menyembunyikan, menampilkan lagi, atau menghapus.
export default async function HalamanUlasanAdmin() {
  let daftarUlasan = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("ulasan")
      .select("*, produk(nama)")
      .order("created_at", { ascending: false });
    daftarUlasan = data || [];
  } catch {
    // Gagal memuat: daftar kosong.
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ulasan</h1>
      {daftarUlasan.length === 0 ? (
        <p className="text-teks-lembut">Belum ada ulasan.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-garis rounded-2xl border border-garis text-sm">
          {daftarUlasan.map((u) => (
            <li key={u.id} className="flex flex-wrap items-start justify-between gap-3 p-4">
              <div className="max-w-xl">
                <p className="font-semibold">
                  {u.nama} <span className="text-harga">{"★".repeat(u.rating)}</span>{" "}
                  {!u.tampil && <span className="text-teks-lembut">(disembunyikan)</span>}
                </p>
                <p className="text-teks-lembut">
                  untuk{" "}
                  <Link href={`/produk/${u.produk_id}`} className="underline underline-offset-4">
                    {u.produk?.nama ?? `produk ${u.produk_id}`}
                  </Link>
                </p>
                <p className="mt-1">{u.komentar}</p>
              </div>
              <div className="flex gap-2">
                <form action={moderasiUlasan}>
                  <input type="hidden" name="id" value={u.id} />
                  <input type="hidden" name="aksi" value={u.tampil ? "sembunyikan" : "tampilkan"} />
                  <Tombol type="submit" varian="garis">
                    {u.tampil ? "Sembunyikan" : "Tampilkan"}
                  </Tombol>
                </form>
                <form action={moderasiUlasan}>
                  <input type="hidden" name="id" value={u.id} />
                  <input type="hidden" name="aksi" value="hapus" />
                  <Tombol type="submit" varian="bahaya">
                    Hapus
                  </Tombol>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

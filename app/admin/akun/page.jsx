import NavAdmin from "@/components/NavAdmin";
import Tombol from "@/components/Tombol";
import FormTambahAdmin from "@/components/FormTambahAdmin";
import { ubahStatusAdmin } from "@/app/admin/actions";
import { createAuthClient } from "@/lib/supabase/auth";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// US-44: daftar admin, tambah admin, nonaktifkan atau hapus admin lain.
export default async function HalamanAkunAdmin({ searchParams }) {
  const { error } = await searchParams;

  const auth = await createAuthClient();
  const {
    data: { user: saya },
  } = await auth.auth.getUser();

  let daftarAdmin = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase.auth.admin.listUsers();
    daftarAdmin = data?.users ?? [];
  } catch {
    // Gagal memuat: daftar kosong.
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Akun admin</h1>

      {error === "diri-sendiri" && (
        <p className="max-w-xl rounded-lg border border-garis bg-permukaan px-3 py-2 text-sm text-bahaya">
          Kamu tidak bisa menonaktifkan atau menghapus akunmu sendiri.
        </p>
      )}

      <ul className="flex max-w-2xl flex-col divide-y divide-garis rounded-2xl border border-garis">
        {daftarAdmin.map((admin) => {
          const nonaktif = admin.banned_until && new Date(admin.banned_until) > new Date();
          const diriSendiri = admin.id === saya?.id;
          return (
            <li key={admin.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
              <div>
                <p className="font-semibold">{admin.email}</p>
                <p className="text-teks-lembut">
                  {diriSendiri ? "Akun kamu" : nonaktif ? "Nonaktif" : "Aktif"}
                </p>
              </div>
              {!diriSendiri && (
                <div className="flex gap-2">
                  <form action={ubahStatusAdmin}>
                    <input type="hidden" name="id" value={admin.id} />
                    <input type="hidden" name="aksi" value={nonaktif ? "aktifkan" : "nonaktifkan"} />
                    <Tombol type="submit" varian="garis">
                      {nonaktif ? "Aktifkan" : "Nonaktifkan"}
                    </Tombol>
                  </form>
                  <form action={ubahStatusAdmin}>
                    <input type="hidden" name="id" value={admin.id} />
                    <input type="hidden" name="aksi" value="hapus" />
                    <Tombol type="submit" varian="bahaya">
                      Hapus
                    </Tombol>
                  </form>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <h2 className="text-lg font-bold">Tambah admin</h2>
      <FormTambahAdmin />
    </div>
  );
}

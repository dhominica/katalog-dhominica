import NavAdmin from "@/components/NavAdmin";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// US-45: 50 log aktivitas admin terakhir. Dilindungi proxy.js, jadi tanpa login tidak bisa dibuka.
export default async function HalamanLog() {
  let daftarLog = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("log_admin")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    daftarLog = data || [];
  } catch {
    // Gagal memuat: daftar kosong.
  }

  const formatWaktu = (iso) =>
    new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(
      new Date(iso)
    );

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Log aktivitas</h1>
      {daftarLog.length === 0 ? (
        <p className="text-teks-lembut">Belum ada aktivitas.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-garis rounded-2xl border border-garis text-sm">
          {daftarLog.map((log) => (
            <li key={log.id} className="flex flex-wrap justify-between gap-2 p-3">
              <span>
                <span className="font-semibold">{log.email ?? "Admin"}</span> {log.aksi}
              </span>
              <span className="text-teks-lembut">{formatWaktu(log.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use server";

import { createServerClient } from "@/lib/supabase/server";

// US-40: catat klik tombol pesan WhatsApp. Hanya menyimpan id produk dan waktu, tanpa data pribadi pengunjung.
export async function catatKlikWhatsApp(daftarId) {
  const ids = (Array.isArray(daftarId) ? daftarId : [daftarId])
    .map((id) => parseInt(id, 10))
    .filter((id) => Number.isInteger(id) && id > 0)
    .slice(0, 50);

  if (ids.length === 0) return;

  try {
    const supabase = createServerClient();
    await supabase.from("klik_whatsapp").insert(ids.map((produk_id) => ({ produk_id })));
  } catch {
    // Pencatatan gagal tidak boleh mengganggu pemesanan.
  }
}

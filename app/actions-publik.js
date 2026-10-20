"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
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

// US-38: batas kiriman ulasan per IP (maksimal 3 per 10 menit), disimpan di memori server.
const riwayatUlasan = new Map();

export async function kirimUlasan(prevState, formData) {
  const values = {
    nama: String(formData.get("nama") ?? "").trim(),
    rating: String(formData.get("rating") ?? ""),
    komentar: String(formData.get("komentar") ?? "").trim(),
  };
  const produkId = parseInt(formData.get("produk_id"), 10);

  // Honeypot terisi berarti bot: pura-pura berhasil tanpa menyimpan.
  if (formData.get("situs")) {
    return { sukses: true };
  }

  const rating = parseInt(values.rating, 10);
  if (!Number.isInteger(produkId) || produkId <= 0) {
    return { error: "Produk tidak valid.", values };
  }
  if (!values.nama || values.nama.length > 50) {
    return { error: "Nama wajib diisi, maksimal 50 karakter.", values };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Rating harus 1 sampai 5.", values };
  }
  if (values.komentar.length < 3 || values.komentar.length > 500) {
    return { error: "Komentar 3 sampai 500 karakter.", values };
  }

  const ip = ((await headers()).get("x-forwarded-for") ?? "lokal").split(",")[0].trim();
  const sekarang = Date.now();
  const kiriman = (riwayatUlasan.get(ip) ?? []).filter((t) => sekarang - t < 10 * 60 * 1000);
  if (kiriman.length >= 3) {
    return { error: "Terlalu banyak ulasan. Coba lagi beberapa menit lagi.", values };
  }
  riwayatUlasan.set(ip, [...kiriman, sekarang]);

  const supabase = createServerClient();
  const { error } = await supabase
    .from("ulasan")
    .insert({ produk_id: produkId, nama: values.nama, rating, komentar: values.komentar });
  if (error) {
    return { error: "Gagal menyimpan ulasan. Coba lagi.", values };
  }

  revalidatePath(`/produk/${produkId}`);
  return { sukses: true };
}

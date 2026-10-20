"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { createAuthClient } from "@/lib/supabase/auth";

// K-12: Rate limit login sederhana dalam memori (maks 5 percobaan per 15 menit)
const riwayatLogin = new Map();
const BATAS_LOGIN = 5;
const DURASI_RATE_LIMIT = 15 * 60 * 1000; // 15 menit

export async function login(formData) {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

  const now = Date.now();
  const catatan = riwayatLogin.get(ip);

  // Jika window 15 menit sudah lewat, reset
  if (catatan && now - catatan.waktuAwal > DURASI_RATE_LIMIT) {
    riwayatLogin.delete(ip);
  } else if (catatan && catatan.jumlah >= BATAS_LOGIN) {
    redirect("/admin/login?error=terlalu-banyak");
  }

  const email = formData.get("email");
  const password = formData.get("password");

  const supabase = await createAuthClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: String(email ?? ""),
    password: String(password ?? ""),
  });

  if (error) {
    const dataTerkini = riwayatLogin.get(ip);
    if (!dataTerkini || now - dataTerkini.waktuAwal > DURASI_RATE_LIMIT) {
      riwayatLogin.set(ip, { jumlah: 1, waktuAwal: now });
    } else {
      dataTerkini.jumlah += 1;
      riwayatLogin.set(ip, dataTerkini);
    }

    if (riwayatLogin.get(ip).jumlah >= BATAS_LOGIN) {
      redirect("/admin/login?error=terlalu-banyak");
    }

    redirect("/admin/login?error=1");
  }

  // Login berhasil, bersihkan riwayat percobaan gagal untuk IP ini
  riwayatLogin.delete(ip);
  redirect("/admin");
}

export async function logout() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(formData) {
  const supabase = await createAuthClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  const passwordBaru = formData.get("password_baru");
  const konfirmasiPassword = formData.get("konfirmasi_password");

  const password = typeof passwordBaru === "string" ? passwordBaru : "";
  const konfirmasi = typeof konfirmasiPassword === "string" ? konfirmasiPassword : "";

  if (password.length < 8) {
    redirect("/admin/password?error=pendek");
  }

  if (password !== konfirmasi) {
    redirect("/admin/password?error=beda");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect("/admin/password?error=gagal");
  }

  redirect("/admin/password?sukses=1");
}

// Dipakai semua aksi yang mengubah data produk: tanpa login langsung ditolak di server.
async function wajibLogin() {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }
}

// US-08 (tambah), US-09 (ubah), US-34 (validasi di server).
export async function simpanProduk(prevState, formData) {
  await wajibLogin();

  const values = {
    nama: String(formData.get("nama") ?? "").trim(),
    harga: String(formData.get("harga") ?? "").trim(),
    kategori: String(formData.get("kategori") ?? "").trim(),
    foto_url: String(formData.get("foto_url") ?? "").trim(),
    deskripsi: String(formData.get("deskripsi") ?? "").trim(),
  };
  const id = formData.get("id");

  const errors = {};
  if (!values.nama) {
    errors.nama = "Nama produk wajib diisi.";
  }
  const harga = Number(values.harga);
  if (!values.harga || !Number.isInteger(harga) || harga <= 0) {
    errors.harga = "Harga harus berupa angka bulat lebih dari 0.";
  }
  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  const data = {
    nama: values.nama,
    harga,
    kategori: values.kategori || null,
    foto_url: values.foto_url || null,
    deskripsi: values.deskripsi || null,
  };

  const supabase = createServerClient();
  const { error } = id
    ? await supabase.from("produk").update(data).eq("id", id)
    : await supabase.from("produk").insert(data);

  if (error) {
    return { errors: { umum: "Gagal menyimpan produk. Coba lagi." }, values };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

// US-10: hapus produk.
export async function hapusProduk(formData) {
  await wajibLogin();

  const id = formData.get("id");
  if (id) {
    const supabase = createServerClient();
    await supabase.from("produk").delete().eq("id", id);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

// Pecah satu baris CSV, mendukung nilai dalam kutip ganda dan kutip yang digandakan.
function pecahBarisCsv(baris) {
  const hasil = [];
  let nilai = "";
  let dalamKutip = false;
  for (let i = 0; i < baris.length; i++) {
    const c = baris[i];
    if (dalamKutip) {
      if (c === '"' && baris[i + 1] === '"') {
        nilai += '"';
        i++;
      } else if (c === '"') {
        dalamKutip = false;
      } else {
        nilai += c;
      }
    } else if (c === '"') {
      dalamKutip = true;
    } else if (c === ",") {
      hasil.push(nilai);
      nilai = "";
    } else {
      nilai += c;
    }
  }
  hasil.push(nilai);
  return hasil.map((v) => v.trim());
}

// US-46: impor produk dari CSV. Setiap baris divalidasi, baris valid disimpan sekaligus.
export async function imporProduk(prevState, formData) {
  await wajibLogin();

  const berkas = formData.get("berkas");
  if (!berkas || typeof berkas.text !== "function" || berkas.size === 0) {
    return { pesan: "Pilih file CSV terlebih dahulu." };
  }

  const baris = (await berkas.text()).replace(/^﻿/, "").split(/\r?\n/);
  const header = pecahBarisCsv(baris[0] || "").map((h) => h.toLowerCase());
  if (!header.includes("nama") || !header.includes("harga")) {
    return { pesan: "Header CSV wajib memuat kolom nama dan harga." };
  }

  const valid = [];
  const kesalahan = [];
  for (let i = 1; i < baris.length; i++) {
    if (!baris[i].trim()) continue;
    const kolom = pecahBarisCsv(baris[i]);
    const ambil = (nama) => kolom[header.indexOf(nama)] ?? "";
    const nama = ambil("nama");
    const harga = Number(ambil("harga"));

    if (!nama) {
      kesalahan.push({ baris: i + 1, alasan: "nama wajib diisi" });
    } else if (!Number.isInteger(harga) || harga <= 0) {
      kesalahan.push({ baris: i + 1, alasan: "harga harus angka bulat lebih dari 0" });
    } else {
      valid.push({
        nama,
        harga,
        kategori: ambil("kategori") || null,
        deskripsi: ambil("deskripsi") || null,
        foto_url: ambil("foto_url") || null,
      });
    }
  }

  if (valid.length > 0) {
    const supabase = createServerClient();
    const { error } = await supabase.from("produk").insert(valid);
    if (error) {
      return { pesan: "Gagal menyimpan ke database. Coba lagi." };
    }
    revalidatePath("/admin");
    revalidatePath("/");
  }

  return { ringkasan: { berhasil: valid.length, gagal: kesalahan.length }, kesalahan };
}

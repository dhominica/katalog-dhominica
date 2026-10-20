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
  return user;
}

// US-45: catat siapa, aksi apa, dan kapan. Gagal mencatat tidak membatalkan aksi utama.
async function catatLog(user, aksi) {
  try {
    const supabase = createServerClient();
    await supabase.from("log_admin").insert({ email: user?.email ?? null, aksi });
  } catch {
    // Abaikan.
  }
}

// US-08 (tambah), US-09 (ubah), US-34 (validasi di server).
export async function simpanProduk(prevState, formData) {
  const user = await wajibLogin();

  const values = {
    nama: String(formData.get("nama") ?? "").trim(),
    harga: String(formData.get("harga") ?? "").trim(),
    kategori: String(formData.get("kategori") ?? "").trim(),
    foto_url: String(formData.get("foto_url") ?? "").trim(),
    deskripsi: String(formData.get("deskripsi") ?? "").trim(),
    stok: String(formData.get("stok") ?? "").trim(),
    harga_coret: String(formData.get("harga_coret") ?? "").trim(),
    badge: String(formData.get("badge") ?? "").trim(),
    galeri: String(formData.get("galeri") ?? "").trim(),
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
  const stok = values.stok === "" ? 0 : Number(values.stok);
  if (!Number.isInteger(stok) || stok < 0) {
    errors.stok = "Stok harus angka bulat 0 atau lebih.";
  }
  const hargaCoret = values.harga_coret === "" ? null : Number(values.harga_coret);
  if (hargaCoret !== null && (!Number.isInteger(hargaCoret) || hargaCoret <= harga)) {
    errors.harga_coret = "Harga normal harus lebih besar dari harga jual.";
  }
  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  const data = {
    stok,
    harga_coret: hargaCoret,
    badge: values.badge || null,
    // US-18: foto tambahan dipisah koma
    galeri: values.galeri
      ? values.galeri.split(",").map((url) => url.trim()).filter(Boolean)
      : null,
    nama: values.nama,
    harga,
    kategori: values.kategori || null,
    foto_url: values.foto_url || null,
    deskripsi: values.deskripsi || null,
  };

  const supabase = createServerClient();
  if (!id) {
    // US-47: produk baru ditaruh di urutan paling akhir
    const { data: terakhir } = await supabase
      .from("produk")
      .select("urutan")
      .order("urutan", { ascending: false })
      .limit(1)
      .maybeSingle();
    data.urutan = (terakhir?.urutan ?? 0) + 1;
  }
  const { error } = id
    ? await supabase.from("produk").update(data).eq("id", id)
    : await supabase.from("produk").insert(data);

  if (error) {
    return { errors: { umum: "Gagal menyimpan produk. Coba lagi." }, values };
  }
  await catatLog(user, `${id ? "Mengubah" : "Menambah"} produk "${data.nama}"`);

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

// US-10: hapus produk.
export async function hapusProduk(formData) {
  const user = await wajibLogin();

  const id = formData.get("id");
  if (id) {
    const supabase = createServerClient();
    await supabase.from("produk").delete().eq("id", id);
    await catatLog(user, `Menghapus produk id ${id}`);
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
  const user = await wajibLogin();

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
    await catatLog(user, `Mengimpor ${valid.length} produk dari CSV`);
    revalidatePath("/admin");
    revalidatePath("/");
  }

  return { ringkasan: { berhasil: valid.length, gagal: kesalahan.length }, kesalahan };
}

// US-44: kelola akun admin lewat Supabase Auth (API admin memakai secret key di server).
async function adminSaatIni() {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}

export async function tambahAdmin(prevState, formData) {
  await adminSaatIni();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email.includes("@")) {
    return { error: "Email tidak valid." };
  }
  if (password.length < 8) {
    return { error: "Password minimal 8 karakter." };
  }

  const supabase = createServerClient();
  const { error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) {
    return { error: "Gagal menambah admin. Mungkin email sudah terdaftar." };
  }

  revalidatePath("/admin/akun");
  return { sukses: `Admin ${email} berhasil ditambahkan.` };
}

export async function ubahStatusAdmin(formData) {
  const saya = await adminSaatIni();
  const id = String(formData.get("id") ?? "");
  const aksi = formData.get("aksi");

  // Admin tidak boleh menonaktifkan atau menghapus akunnya sendiri.
  if (!id || id === saya.id) {
    redirect("/admin/akun?error=diri-sendiri");
  }

  const supabase = createServerClient();
  if (aksi === "hapus") {
    await supabase.auth.admin.deleteUser(id);
  } else if (aksi === "nonaktifkan") {
    await supabase.auth.admin.updateUserById(id, { ban_duration: "876000h" });
  } else if (aksi === "aktifkan") {
    await supabase.auth.admin.updateUserById(id, { ban_duration: "none" });
  }

  revalidatePath("/admin/akun");
  redirect("/admin/akun");
}

// US-32: aktif atau nonaktifkan produk.
export async function ubahAktifProduk(formData) {
  const user = await wajibLogin();

  const id = formData.get("id");
  const aktif = formData.get("aktif") === "true";
  if (id) {
    const supabase = createServerClient();
    await supabase.from("produk").update({ aktif }).eq("id", id);
    await catatLog(user, `${aktif ? "Mengaktifkan" : "Menonaktifkan"} produk id ${id}`);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

// US-47: naikkan atau turunkan urutan tampil produk (tukar dengan tetangganya).
export async function geserUrutan(formData) {
  const user = await wajibLogin();
  const id = Number(formData.get("id"));
  const arah = formData.get("arah");

  const supabase = createServerClient();
  const { data: semua } = await supabase
    .from("produk")
    .select("id, urutan")
    .order("urutan", { ascending: true })
    .order("id", { ascending: true });

  const daftar = semua || [];
  const i = daftar.findIndex((p) => p.id === id);
  const j = arah === "naik" ? i - 1 : i + 1;

  if (i >= 0 && j >= 0 && j < daftar.length) {
    // Beri nomor urut berurutan lalu tukar posisi kedua produk.
    const urutA = j + 1;
    const urutB = i + 1;
    await supabase.from("produk").update({ urutan: urutA }).eq("id", daftar[i].id);
    await supabase.from("produk").update({ urutan: urutB }).eq("id", daftar[j].id);
    await catatLog(user, `Menggeser produk id ${id} ${arah === "naik" ? "ke atas" : "ke bawah"}`);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

// US-39: sembunyikan, tampilkan, atau hapus ulasan.
export async function moderasiUlasan(formData) {
  const user = await wajibLogin();
  const id = formData.get("id");
  const aksi = formData.get("aksi");

  if (id) {
    const supabase = createServerClient();
    if (aksi === "hapus") {
      await supabase.from("ulasan").delete().eq("id", id);
    } else {
      await supabase.from("ulasan").update({ tampil: aksi === "tampilkan" }).eq("id", id);
    }
    await catatLog(user, `Moderasi ulasan id ${id}: ${aksi}`);
  }

  revalidatePath("/admin/ulasan");
  redirect("/admin/ulasan");
}

// US-42: buat, ubah, dan aktif/nonaktifkan banner promo.
export async function simpanBanner(prevState, formData) {
  const user = await wajibLogin();

  const id = formData.get("id");
  const data = {
    judul: String(formData.get("judul") ?? "").trim(),
    teks: String(formData.get("teks") ?? "").trim() || null,
    gambar_url: String(formData.get("gambar_url") ?? "").trim() || null,
    tautan: String(formData.get("tautan") ?? "").trim() || null,
    aktif: formData.get("aktif") === "on",
  };
  if (!data.judul) {
    return { error: "Judul banner wajib diisi." };
  }
  if (data.tautan && !data.tautan.startsWith("/") && !data.tautan.startsWith("https://")) {
    return { error: "Tautan harus diawali / atau https://." };
  }

  const supabase = createServerClient();
  const { error } = id
    ? await supabase.from("banner").update(data).eq("id", id)
    : await supabase.from("banner").insert(data);
  if (error) {
    return { error: "Gagal menyimpan banner." };
  }

  await catatLog(user, `${id ? "Mengubah" : "Membuat"} banner "${data.judul}"`);
  revalidatePath("/");
  revalidatePath("/admin/banner");
  return { sukses: "Banner tersimpan." };
}

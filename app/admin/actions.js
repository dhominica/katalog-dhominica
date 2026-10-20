"use server";

import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth";

export async function login(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const supabase = await createAuthClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: String(email ?? ""),
    password: String(password ?? ""),
  });

  if (error) {
    redirect("/admin/login?error=1");
  }

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


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


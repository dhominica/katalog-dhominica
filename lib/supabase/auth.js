import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createAuthClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY wajib diatur di environment variable."
    );
  }

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Dipanggil dari Server Component, perubahan cookie diabaikan
        }
      },
    },
  });
}


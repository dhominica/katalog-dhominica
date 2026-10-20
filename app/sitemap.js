import { createServerClient } from "@/lib/supabase/server";

export default async function sitemap() {
  const rawBaseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const baseUrl = rawBaseUrl
    ? (rawBaseUrl.startsWith("http://") || rawBaseUrl.startsWith("https://")
        ? rawBaseUrl
        : `https://${rawBaseUrl}`)
    : "http://localhost:3000";

  let produkUrls = [];

  try {
    const supabase = createServerClient();
    const { data: produkList, error } = await supabase
      .from("produk")
      .select("id, created_at");

    if (!error && Array.isArray(produkList)) {
      produkUrls = produkList.map((produk) => ({
        url: `${baseUrl}/produk/${produk.id}`,
        lastModified: produk.created_at ? new Date(produk.created_at) : new Date(),
      }));
    }
  } catch (err) {
    // Jika koneksi database gagal, tetap kembalikan URL halaman statis
  }

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
    },
    ...produkUrls,
  ];
}


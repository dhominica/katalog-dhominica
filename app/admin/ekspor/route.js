import { createAuthClient } from "@/lib/supabase/auth";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const authClient = await createAuthClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createServerClient();
  const { data: daftarProduk, error } = await supabase
    .from("produk")
    .select("id, nama, harga, kategori, deskripsi, foto_url, created_at")
    .order("id", { ascending: true });

  if (error) {
    return new Response("Gagal mengambil data produk", { status: 500 });
  }

  const columns = [
    "id",
    "nama",
    "harga",
    "kategori",
    "deskripsi",
    "foto_url",
    "created_at",
  ];

  const escapeNilaiCsv = (val) => {
    if (val === null || val === undefined) {
      return '""';
    }
    const str = String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const barisData = (daftarProduk || []).map((produk) =>
    columns.map((kolom) => escapeNilaiCsv(produk[kolom])).join(",")
  );

  const header = "id,nama,harga,kategori,deskripsi,foto_url,created_at";
  const csvContent = [header, ...barisData].join("\r\n");

  return new Response(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="produk.csv"',
    },
  });
}


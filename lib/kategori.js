// US-49: ubah nama kategori menjadi slug URL, contoh "Kue kering" -> "kue-kering".
export function slugKategori(nama) {
  return String(nama ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

// Kebalikannya untuk pencarian di database: "kue-kering" -> "kue kering".
export function namaDariSlug(slug) {
  return decodeURIComponent(String(slug ?? "")).replace(/-/g, " ").trim();
}

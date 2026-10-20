"use client";

import { useEffect } from "react";

export default function CatatTerakhirDilihat({ produk }) {
  useEffect(() => {
    if (!produk || !produk.id) return;

    try {
      const data = JSON.parse(localStorage.getItem("terakhir_dilihat") || "[]");
      const list = Array.isArray(data) ? data : [];

      // Tanpa duplikat: hapus item yang sudah ada sebelumnya
      const saring = list.filter((item) => String(item.id) !== String(produk.id));

      const itemBaru = {
        id: produk.id,
        nama: produk.nama,
        harga: produk.harga,
        foto_url: produk.foto_url,
        kategori: produk.kategori,
      };

      // Maksimal 6 produk terakhir dilihat
      const diperbarui = [itemBaru, ...saring].slice(0, 6);

      localStorage.setItem("terakhir_dilihat", JSON.stringify(diperbarui));
    } catch {
      // Abaikan error localStorage
    }
  }, [produk?.id, produk?.nama, produk?.harga, produk?.foto_url, produk?.kategori]);

  return null;
}


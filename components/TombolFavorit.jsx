"use client";

import { useEffect, useState } from "react";
import Tombol from "@/components/Tombol";

export default function TombolFavorit({ produk }) {
  const [isFavorit, setIsFavorit] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("favorit") || "[]");
      const ada = data.some((item) => String(item.id) === String(produk.id));
      setIsFavorit(ada);
    } catch {
      // Abaikan error parsing
    }
    setMounted(true);
  }, [produk.id]);

  function toggleFavorit() {
    try {
      const data = JSON.parse(localStorage.getItem("favorit") || "[]");
      const index = data.findIndex((item) => String(item.id) === String(produk.id));

      let dataBaru;
      if (index >= 0) {
        dataBaru = data.filter((item) => String(item.id) !== String(produk.id));
        setIsFavorit(false);
      } else {
        const itemBaru = {
          id: produk.id,
          nama: produk.nama,
          harga: produk.harga,
          foto_url: produk.foto_url,
          kategori: produk.kategori,
        };
        dataBaru = [itemBaru, ...data];
        setIsFavorit(true);
      }

      localStorage.setItem("favorit", JSON.stringify(dataBaru));
    } catch {
      // Abaikan error localStorage
    }
  }

  if (!mounted) {
    return (
      <Tombol type="button" varian="garis" className="w-full sm:w-auto opacity-50">
        Favorit
      </Tombol>
    );
  }

  return (
    <Tombol
      type="button"
      varian="garis"
      onClick={toggleFavorit}
      className={`w-full sm:w-auto transition-colors ${
        isFavorit ? "border-utama text-utama font-bold" : ""
      }`}
      aria-label={isFavorit ? "Hapus dari produk favorit" : "Tambah ke produk favorit"}
    >
      <span>{isFavorit ? "❤️ Tersimpan di Favorit" : "🤍 Tambah ke Favorit"}</span>
    </Tombol>
  );
}


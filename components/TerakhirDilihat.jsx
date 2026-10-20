"use client";

import { useEffect, useState } from "react";
import KartuProduk from "@/components/KartuProduk";

export default function TerakhirDilihat() {
  const [daftar, setDaftar] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("terakhir_dilihat") || "[]");
      setDaftar(Array.isArray(data) ? data : []);
    } catch {
      setDaftar([]);
    }
    setMounted(true);
  }, []);

  // Tidak tampil jika belum dimuat atau masih kosong
  if (!mounted || daftar.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="judul-terakhir-dilihat" className="flex flex-col gap-4 border-t border-garis pt-10">
      <h2 id="judul-terakhir-dilihat" className="text-xl font-bold">
        Terakhir dilihat
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {daftar.map((produk) => (
          <KartuProduk key={produk.id} produk={produk} />
        ))}
      </div>
    </section>
  );
}


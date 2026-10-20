"use client";

import { useEffect, useState } from "react";
import KartuProduk from "@/components/KartuProduk";
import Tombol from "@/components/Tombol";

export default function DaftarFavorit() {
  const [favorit, setFavorit] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("favorit") || "[]");
      setFavorit(Array.isArray(data) ? data : []);
    } catch {
      setFavorit([]);
    }
    setMounted(true);
  }, []);

  function hapusSemua() {
    localStorage.removeItem("favorit");
    setFavorit([]);
  }

  if (!mounted) {
    return (
      <div className="py-8 text-teks-lembut">
        Memuat favorit...
      </div>
    );
  }

  if (favorit.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 py-8">
        <p className="text-teks-lembut">Belum ada produk favorit.</p>
        <Tombol href="/" varian="garis">
          Jelajahi katalog
        </Tombol>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-teks-lembut">
          Menampilkan {favorit.length} produk favorit
        </p>
        <button
          type="button"
          onClick={hapusSemua}
          className="text-xs font-semibold text-bahaya underline underline-offset-4 hover:opacity-85"
        >
          Hapus semua favorit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {favorit.map((produk) => (
          <KartuProduk key={produk.id} produk={produk} />
        ))}
      </div>
    </div>
  );
}


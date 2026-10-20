"use client";

import { useState } from "react";

// US-18: galeri foto produk. Produk dengan satu foto tampil normal tanpa gambar kecil.
export default function GaleriFoto({ nama, daftarFoto }) {
  const [aktif, setAktif] = useState(0);
  const foto = daftarFoto.length > 0 ? daftarFoto : [""];

  return (
    <div className="flex flex-col gap-3">
      <img
        src={foto[aktif]}
        alt={nama}
        className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
      />
      {foto.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {foto.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setAktif(i)}
              aria-label={`Lihat foto ${i + 1}`}
              className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${i === aktif ? "border-utama" : "border-garis"}`}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

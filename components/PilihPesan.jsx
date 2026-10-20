"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";
import { tambahKeKeranjang } from "@/lib/keranjang";
import { catatKlikWhatsApp } from "@/app/actions-publik";

// US-12: pilih jumlah sebelum memesan, jumlahnya ikut tertulis di pesan WhatsApp.
// US-21: tombol "Tambah ke keranjang".
export default function PilihPesan({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const [pesanKeranjang, setPesanKeranjang] = useState("");

  const total = formatRupiah(produk.harga * jumlah);
  const pesan = `Halo ${toko.nama}, saya ingin memesan ${produk.nama} sebanyak ${jumlah} buah (${formatRupiah(produk.harga)} per buah, total ${total}). Apakah masih tersedia?`;
  const href = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-3 text-sm font-semibold">
        Jumlah
        <input
          type="number"
          min="1"
          value={jumlah}
          onChange={(e) => setJumlah(Math.max(1, parseInt(e.target.value, 10) || 1))}
          className="w-20 rounded-lg border border-garis bg-latar px-3 py-2 text-base text-teks focus:border-utama focus:outline-none"
        />
        <span className="font-normal text-teks-lembut">Total {total}</span>
      </label>
      <div className="flex flex-wrap gap-2">
        <a
          href={href}
          onClick={() => catatKlikWhatsApp(produk.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
        >
          Pesan via WhatsApp
        </a>
        <button
          type="button"
          onClick={() => {
            tambahKeKeranjang(produk, jumlah);
            setPesanKeranjang("Ditambahkan ke keranjang.");
          }}
          className="inline-flex w-full items-center justify-center rounded-lg border border-garis px-5 py-3 font-semibold hover:border-utama hover:text-utama sm:w-auto"
        >
          Tambah ke keranjang
        </button>
      </div>
      {pesanKeranjang && <p className="text-sm text-teks-lembut">{pesanKeranjang}</p>}
    </div>
  );
}

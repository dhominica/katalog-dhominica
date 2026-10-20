"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";
import { bacaKeranjang, simpanKeranjang } from "@/lib/keranjang";

// US-21: ubah jumlah, hapus item, total harga, dan kirim semua isi keranjang dalam satu pesan WhatsApp.
export default function IsiKeranjang() {
  const [isi, setIsi] = useState([]);
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    setIsi(bacaKeranjang());
    setSiap(true);
  }, []);

  function perbarui(baru) {
    setIsi(baru);
    simpanKeranjang(baru);
  }

  function ubahJumlah(id, jumlah) {
    perbarui(isi.map((item) => (item.id === id ? { ...item, jumlah: Math.max(1, jumlah || 1) } : item)));
  }

  function hapus(id) {
    perbarui(isi.filter((item) => item.id !== id));
  }

  if (!siap) return null;

  if (isi.length === 0) {
    return (
      <p className="text-teks-lembut">
        Keranjang masih kosong.{" "}
        <Link href="/" className="text-utama underline underline-offset-4">
          Lihat produk
        </Link>
      </p>
    );
  }

  const total = isi.reduce((jumlah, item) => jumlah + item.harga * item.jumlah, 0);
  const daftar = isi
    .map((item, i) => `${i + 1}. ${item.nama} x${item.jumlah} = ${formatRupiah(item.harga * item.jumlah)}`)
    .join("\n");
  const pesan = `Halo ${toko.nama}, saya ingin memesan:\n${daftar}\nTotal: ${formatRupiah(total)}\nApakah masih tersedia?`;
  const href = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col divide-y divide-garis rounded-2xl border border-garis">
        {isi.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <Link href={`/produk/${item.id}`} className="font-semibold hover:text-utama">
                {item.nama}
              </Link>
              <p className="text-sm text-teks-lembut">{formatRupiah(item.harga)} per buah</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={item.jumlah}
                onChange={(e) => ubahJumlah(item.id, parseInt(e.target.value, 10))}
                aria-label={`Jumlah ${item.nama}`}
                className="w-20 rounded-lg border border-garis bg-latar px-3 py-2 text-base text-teks focus:border-utama focus:outline-none"
              />
              <span className="w-28 text-right font-semibold">{formatRupiah(item.harga * item.jumlah)}</span>
              <button type="button" onClick={() => hapus(item.id)} className="text-sm text-bahaya hover:underline">
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-lg font-bold">Total: {formatRupiah(total)}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto sm:self-start"
      >
        Pesan semua via WhatsApp
      </a>
    </div>
  );
}

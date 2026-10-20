"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KUNCI = "bandingkan";

function bacaPilihan() {
  try {
    const isi = JSON.parse(localStorage.getItem(KUNCI) || "[]");
    return Array.isArray(isi) ? isi : [];
  } catch {
    return [];
  }
}

// US-37: pilih maksimal 2 produk untuk dibandingkan. Pilihan ketiga menggantikan yang paling lama.
export default function TombolBandingkan({ produkId }) {
  const [pilihan, setPilihan] = useState([]);
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    setPilihan(bacaPilihan());
  }, []);

  const id = String(produkId);
  const sudahDipilih = pilihan.includes(id);

  function tekan() {
    let baru;
    if (sudahDipilih) {
      baru = pilihan.filter((x) => x !== id);
      setPesan("");
    } else if (pilihan.length >= 2) {
      baru = [pilihan[1], id];
      setPesan("Maksimal 2 produk. Pilihan paling lama diganti.");
    } else {
      baru = [...pilihan, id];
      setPesan("");
    }
    localStorage.setItem(KUNCI, JSON.stringify(baru));
    setPilihan(baru);
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={tekan}
        className="self-start rounded-lg border border-garis px-4 py-2 text-sm font-semibold hover:border-utama hover:text-utama"
      >
        {sudahDipilih ? "Batal bandingkan" : "Bandingkan"} ({pilihan.length}/2)
      </button>
      {pesan && <p className="text-sm text-teks-lembut">{pesan}</p>}
      {pilihan.length === 2 && (
        <Link
          href={`/bandingkan?a=${pilihan[0]}&b=${pilihan[1]}`}
          className="self-start text-sm font-semibold text-utama underline underline-offset-4"
        >
          Lihat perbandingan
        </Link>
      )}
    </div>
  );
}

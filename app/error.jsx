"use client";

import Tombol from "@/components/Tombol";

export default function Error({ reset }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-extrabold text-teks">
        Terjadi kesalahan, coba lagi.
      </h1>
      <p className="max-w-md text-sm text-teks-lembut">
        Kami mengalami kendala saat memuat halaman ini.
      </p>
      <Tombol onClick={() => reset()} varian="utama">
        Coba lagi
      </Tombol>
    </div>
  );
}

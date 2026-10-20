"use client";

import Tombol from "@/components/Tombol";

// US-10: minta konfirmasi sebelum form hapus dikirim ke server.
export default function TombolHapus() {
  return (
    <Tombol
      type="submit"
      varian="bahaya"
      onClick={(event) => {
        if (!confirm("Hapus produk ini?")) {
          event.preventDefault();
        }
      }}
    >
      Hapus
    </Tombol>
  );
}

"use client";

import { useState } from "react";
import Tombol from "@/components/Tombol";

export default function TombolBagikan({ produk }) {
  const [disalin, setDisalin] = useState(false);

  async function handleBagikan() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: produk?.nama || document.title,
          text: produk?.deskripsi || "",
          url: window.location.href,
        });
        return;
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setDisalin(true);
        setTimeout(() => setDisalin(false), 2500);
      } catch (err) {
        // Abaikan jika ditolak izin clipboard
      }
    }
  }

  return (
    <Tombol
      type="button"
      varian="garis"
      onClick={handleBagikan}
      className="w-full sm:w-auto"
    >
      {disalin ? "Link tersalin" : "Bagikan link"}
    </Tombol>
  );
}


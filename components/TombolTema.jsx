"use client";

import { useEffect, useState } from "react";

export default function TombolTema() {
  const [tema, setTema] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const tersimpan = localStorage.getItem("tema");
    if (tersimpan) {
      setTema(tersimpan);
      document.documentElement.setAttribute("data-theme", tersimpan);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTema("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
    setMounted(true);
  }, []);

  function toggleTema() {
    const temaBaru = tema === "dark" ? "light" : "dark";
    setTema(temaBaru);
    document.documentElement.setAttribute("data-theme", temaBaru);
    localStorage.setItem("tema", temaBaru);
  }

  if (!mounted) {
    return (
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-lg border border-garis bg-latar px-3 py-1.5 text-xs font-semibold text-teks-lembut"
        aria-label="Pilih tema tampilan"
      >
        <span>Tema</span>
      </button>
    );
  }

  const isDark = tema === "dark";

  return (
    <button
      type="button"
      onClick={toggleTema}
      className="inline-flex items-center gap-1.5 rounded-lg border border-garis bg-latar px-3 py-1.5 text-xs font-semibold text-teks transition-colors hover:border-utama hover:text-utama"
      aria-label={`Ubah ke mode ${isDark ? "terang" : "gelap"}`}
      title={`Ubah ke mode ${isDark ? "terang" : "gelap"}`}
    >
      <span>{isDark ? "☀️" : "🌙"}</span>
      <span>{isDark ? "Terang" : "Gelap"}</span>
    </button>
  );
}


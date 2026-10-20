import Link from "next/link";
import { toko } from "@/lib/toko";
import TombolTema from "@/components/TombolTema";

export default function Header() {
  return (
    <header className="border-b border-garis bg-latar">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-utama">
          {toko.nama}
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/favorit"
            className="text-sm font-semibold text-teks-lembut transition-colors hover:text-utama"
          >
            Favorit
          </Link>
          <Link
            href="/keranjang"
            className="text-sm font-semibold text-teks-lembut transition-colors hover:text-utama"
          >
            Keranjang
          </Link>
          <TombolTema />
        </div>
      </div>
    </header>
  );
}

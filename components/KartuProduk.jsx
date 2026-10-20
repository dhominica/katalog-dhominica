import Link from "next/link";
import { formatRupiah } from "@/lib/format";

export default function KartuProduk({ produk }) {
  const habis = produk.stok !== undefined && produk.stok !== null && produk.stok <= 0;

  return (
    <Link
      href={`/produk/${produk.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar"
    >
      {/* US-19 dan US-20: penanda Habis dan badge dari data produk */}
      <div className="absolute left-2 top-2 flex gap-1">
        {produk.badge && (
          <span className="rounded-full bg-utama px-2 py-0.5 text-xs font-bold text-white">{produk.badge}</span>
        )}
        {habis && <span className="rounded-full bg-bahaya px-2 py-0.5 text-xs font-bold text-white">Habis</span>}
      </div>
      <img
        src={produk.foto_url}
        alt={produk.nama}
        className="aspect-square w-full bg-permukaan object-cover"
      />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="text-xs text-teks-lembut">{produk.kategori}</p>
        <h3 className="font-semibold leading-snug group-hover:text-utama">{produk.nama}</h3>
        <div className="mt-auto flex flex-wrap items-center gap-1.5">
          {produk.harga_coret > produk.harga && (
            <span className="text-xs text-teks-lembut line-through">{formatRupiah(produk.harga_coret)}</span>
          )}
          <p className="rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
            {formatRupiah(produk.harga)}
          </p>
        </div>
      </div>
    </Link>
  );
}

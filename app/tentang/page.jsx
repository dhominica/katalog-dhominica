import Link from "next/link";
import { toko } from "@/lib/toko";

export const metadata = {
  title: `Tentang - ${toko.nama}`,
  description: toko.tagline,
};

export default function HalamanTentang() {
  const whatsappUrl = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(
    `Halo ${toko.nama}, saya ingin bertanya tentang toko dan produk Anda.`
  )}`;

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-2xl">
        <Link
          href="/"
          className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
        >
          Kembali ke katalog
        </Link>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Tentang {toko.nama}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-teks-lembut sm:text-lg">
          {toko.tagline}
        </p>

        <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-garis bg-permukaan p-6 sm:p-8">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-teks-lembut">
              Alamat
            </h2>
            <p className="mt-1 font-medium text-teks">{toko.alamat}</p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-teks-lembut">
              Jam buka
            </h2>
            <p className="mt-1 font-medium text-teks">{toko.jamBuka}</p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-teks-lembut">
              Kontak WhatsApp
            </h2>
            <p className="mt-1 font-medium text-teks">+{toko.nomorWhatsApp}</p>
            <div className="mt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-utama px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-utama-gelap"
              >
                Hubungi via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


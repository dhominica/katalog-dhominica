import DaftarFavorit from "@/components/DaftarFavorit";

export const metadata = {
  title: "Produk Favorit",
  description: "Daftar produk favorit yang Anda simpan.",
};

export default function HalamanFavorit() {
  return (
    <section className="py-8 sm:py-12">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        Produk Favorit
      </h1>
      <p className="mt-2 text-sm text-teks-lembut">
        Produk yang Anda tandai disimpan di peramban ini.
      </p>

      <div className="mt-6">
        <DaftarFavorit />
      </div>
    </section>
  );
}


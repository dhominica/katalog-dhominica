import IsiKeranjang from "@/components/IsiKeranjang";

export const metadata = { title: "Keranjang" };

// US-21: halaman keranjang.
export default function HalamanKeranjang() {
  return (
    <section className="flex flex-col gap-6 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Keranjang</h1>
      <IsiKeranjang />
    </section>
  );
}

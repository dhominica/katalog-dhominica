import NavAdmin from "@/components/NavAdmin";
import FormImpor from "@/components/FormImpor";

// US-46: impor produk dari CSV.
export default function HalamanImpor() {
  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Impor produk dari CSV</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Baris pertama berisi header: nama,harga,kategori,deskripsi,foto_url. Kolom nama dan harga wajib.
        </p>
      </div>
      <FormImpor />
    </div>
  );
}

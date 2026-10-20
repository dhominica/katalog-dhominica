import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";
import TombolHapus from "@/components/TombolHapus";
import { hapusProduk, ubahAktifProduk, geserUrutan } from "@/app/admin/actions";

export default function TabelProduk({ daftarProduk }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-garis">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-permukaan text-teks-lembut">
          <tr>
            <th className="px-4 py-3 font-semibold">Produk</th>
            <th className="px-4 py-3 font-semibold">Kategori</th>
            <th className="px-4 py-3 font-semibold">Harga</th>
            <th className="px-4 py-3 font-semibold">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {daftarProduk.map((produk) => (
            <tr key={produk.id} className="border-t border-garis">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={produk.foto_url} alt="" className="h-10 w-10 rounded-md object-cover" />
                  <span className="font-semibold">{produk.nama}</span>
                  {produk.aktif === false && (
                    <span className="rounded-full border border-garis px-2 py-0.5 text-xs text-teks-lembut">Nonaktif</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-teks-lembut">{produk.kategori}</td>
              <td className="px-4 py-3">{formatRupiah(produk.harga)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {/* US-47: naikkan atau turunkan urutan tampil */}
                  <form action={geserUrutan} className="flex gap-1">
                    <input type="hidden" name="id" value={produk.id} />
                    <button type="submit" name="arah" value="naik" aria-label={`Naikkan ${produk.nama}`} className="rounded-lg border border-garis px-2.5 py-2 hover:border-utama hover:text-utama">
                      ↑
                    </button>
                    <button type="submit" name="arah" value="turun" aria-label={`Turunkan ${produk.nama}`} className="rounded-lg border border-garis px-2.5 py-2 hover:border-utama hover:text-utama">
                      ↓
                    </button>
                  </form>
                  <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis">
                    Ubah
                  </Tombol>
                  {/* US-32: aktif atau nonaktifkan produk */}
                  <form action={ubahAktifProduk}>
                    <input type="hidden" name="id" value={produk.id} />
                    <input type="hidden" name="aktif" value={produk.aktif === false ? "true" : "false"} />
                    <Tombol type="submit" varian="garis">
                      {produk.aktif === false ? "Aktifkan" : "Nonaktifkan"}
                    </Tombol>
                  </form>
                  <form action={hapusProduk}>
                    <input type="hidden" name="id" value={produk.id} />
                    <TombolHapus />
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { simpanProduk } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09).
// Validasi dilakukan di server (US-34); pesan error tampil per field dan isian tidak hilang.
export default function FormProduk({ produk = {}, labelTombol }) {
  const [state, formAction, sedangMenyimpan] = useActionState(simpanProduk, null);
  const nilai = state?.values ?? produk;
  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {produk.id && <input type="hidden" name="id" value={produk.id} />}
      {errors.umum && <p className="text-sm text-bahaya">{errors.umum}</p>}
      <div className="flex flex-col gap-1">
        <Input label="Nama produk" name="nama" defaultValue={nilai.nama} />
        {errors.nama && <p className="text-sm text-bahaya">{errors.nama}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <Input label="Harga (Rp)" name="harga" type="number" defaultValue={nilai.harga} />
        {errors.harga && <p className="text-sm text-bahaya">{errors.harga}</p>}
      </div>
      <Input label="Kategori" name="kategori" defaultValue={nilai.kategori} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Stok" name="stok" type="number" min="0" defaultValue={nilai.stok ?? 10} />
        <Input label="Harga normal (dicoret)" name="harga_coret" type="number" min="0" defaultValue={nilai.harga_coret ?? ""} />
        <Input label="Badge (Baru/Terlaris)" name="badge" defaultValue={nilai.badge ?? ""} />
      </div>
      {(errors.stok || errors.harga_coret) && (
        <p className="text-sm text-bahaya">{errors.stok || errors.harga_coret}</p>
      )}
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={nilai.foto_url}
      />
      <Input
        label="Foto tambahan untuk galeri (pisahkan dengan koma)"
        name="galeri"
        placeholder="/produk/kopi.svg, https://..."
        defaultValue={Array.isArray(nilai.galeri) ? nilai.galeri.join(", ") : nilai.galeri ?? ""}
      />
      <Input label="Deskripsi" name="deskripsi" textarea defaultValue={nilai.deskripsi} />
      <div className="flex gap-3">
        <Tombol type="submit" disabled={sedangMenyimpan}>
          {sedangMenyimpan ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}

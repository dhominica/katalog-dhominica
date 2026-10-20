"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { simpanBanner } from "@/app/admin/actions";

// US-42: form buat atau ubah banner, diproses di server.
export default function FormBanner({ banner = {} }) {
  const [hasil, formAction, sedangSimpan] = useActionState(simpanBanner, null);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-3">
      {banner.id && <input type="hidden" name="id" value={banner.id} />}
      <Input label="Judul" name="judul" defaultValue={banner.judul} />
      <Input label="Teks" name="teks" defaultValue={banner.teks ?? ""} />
      <Input label="Link gambar" name="gambar_url" defaultValue={banner.gambar_url ?? ""} />
      <Input label="Tautan (diawali / atau https://)" name="tautan" defaultValue={banner.tautan ?? ""} />
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="aktif" defaultChecked={banner.aktif ?? true} />
        Aktif (tampil di beranda)
      </label>
      {hasil?.error && <p className="text-sm text-bahaya">{hasil.error}</p>}
      {hasil?.sukses && <p className="text-sm text-utama">{hasil.sukses}</p>}
      <Tombol type="submit" className="self-start" disabled={sedangSimpan}>
        Simpan banner
      </Tombol>
    </form>
  );
}

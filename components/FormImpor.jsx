"use client";

import { useActionState } from "react";
import Tombol from "@/components/Tombol";
import { imporProduk } from "@/app/admin/actions";

// US-46: unggah CSV, hasil validasi per baris ditampilkan dari server.
export default function FormImpor() {
  const [hasil, formAction, sedangProses] = useActionState(imporProduk, null);

  return (
    <div className="flex flex-col gap-4">
      <form action={formAction} className="flex max-w-xl flex-col gap-4">
        <input
          type="file"
          name="berkas"
          accept=".csv,text/csv"
          required
          className="text-sm file:mr-3 file:rounded-lg file:border file:border-garis file:bg-latar file:px-3 file:py-2"
        />
        <Tombol type="submit" className="self-start" disabled={sedangProses}>
          {sedangProses ? "Mengimpor..." : "Impor"}
        </Tombol>
      </form>

      {hasil?.pesan && <p className="text-sm text-bahaya">{hasil.pesan}</p>}

      {hasil?.ringkasan && (
        <div className="flex flex-col gap-2 rounded-2xl border border-garis bg-permukaan p-4 text-sm">
          <p className="font-semibold">
            Berhasil: {hasil.ringkasan.berhasil} baris, gagal: {hasil.ringkasan.gagal} baris.
          </p>
          {hasil.kesalahan.length > 0 && (
            <ul className="list-disc pl-5 text-bahaya">
              {hasil.kesalahan.map((k) => (
                <li key={k.baris}>
                  Baris {k.baris}: {k.alasan}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

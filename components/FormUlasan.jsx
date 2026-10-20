"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { kirimUlasan } from "@/app/actions-publik";

// US-38: form ulasan. Validasi dan perlindungan spam dilakukan di server.
export default function FormUlasan({ produkId }) {
  const [hasil, formAction, sedangKirim] = useActionState(kirimUlasan, null);

  if (hasil?.sukses) {
    return <p className="text-sm text-utama">Terima kasih, ulasanmu sudah tersimpan.</p>;
  }

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-3">
      <input type="hidden" name="produk_id" value={produkId} />
      {/* Honeypot: diisi hanya oleh bot, disembunyikan dari pengunjung */}
      <input type="text" name="situs" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <Input label="Nama" name="nama" maxLength={50} defaultValue={hasil?.values?.nama} />
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Rating
        <select
          name="rating"
          defaultValue={hasil?.values?.rating ?? "5"}
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {"★".repeat(n)} ({n})
            </option>
          ))}
        </select>
      </label>
      <Input label="Komentar" name="komentar" textarea maxLength={500} defaultValue={hasil?.values?.komentar} />
      {hasil?.error && <p className="text-sm text-bahaya">{hasil.error}</p>}
      <Tombol type="submit" className="self-start" disabled={sedangKirim}>
        Kirim ulasan
      </Tombol>
    </form>
  );
}

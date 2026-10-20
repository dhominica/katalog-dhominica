"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { tambahAdmin } from "@/app/admin/actions";

// US-44: form tambah admin, diproses di server.
export default function FormTambahAdmin() {
  const [hasil, formAction, sedangProses] = useActionState(tambahAdmin, null);

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-4">
      <Input label="Email" name="email" type="email" autoComplete="off" required />
      <Input label="Password" name="password" type="password" autoComplete="new-password" required />
      {hasil?.error && <p className="text-sm text-bahaya">{hasil.error}</p>}
      {hasil?.sukses && <p className="text-sm text-utama">{hasil.sukses}</p>}
      <Tombol type="submit" className="self-start" disabled={sedangProses}>
        Tambah admin
      </Tombol>
    </form>
  );
}

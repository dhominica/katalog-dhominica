// US-21: keranjang disimpan di localStorage browser supaya bertahan saat pindah halaman.
// Hanya dipakai dari komponen "use client".
const KUNCI = "keranjang";

export function bacaKeranjang() {
  try {
    const isi = JSON.parse(localStorage.getItem(KUNCI) || "[]");
    return Array.isArray(isi) ? isi : [];
  } catch {
    return [];
  }
}

export function simpanKeranjang(isi) {
  localStorage.setItem(KUNCI, JSON.stringify(isi));
  window.dispatchEvent(new Event("keranjang-berubah"));
}

export function tambahKeKeranjang(produk, jumlah) {
  const isi = bacaKeranjang();
  const ada = isi.find((item) => item.id === produk.id);
  if (ada) {
    ada.jumlah += jumlah;
  } else {
    isi.push({ id: produk.id, nama: produk.nama, harga: produk.harga, jumlah });
  }
  simpanKeranjang(isi);
}

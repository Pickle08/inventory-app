import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function TransactionModal({
    products,
    isOpen,
    onClose,
    onRefresh,
}) {
    if (!isOpen) return null;

    const [price, setPrice] = useState("");

    const [form, setForm] = useState({
        product_id: "",
        type: "in",
        quantity: "",
        price_at_transaction: "",
    });

    useEffect(() => {
        if (form.product_id) {
            const selected = products.find((p) => p.id == form.product_id);
            if (selected) {
                setForm((prev) => ({
                    ...prev,
                    price_at_transaction: selected.price,
                }));
            }
        }
    }, [form.product_id, products]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedProduct = products.find((p) => p.id == form.product_id);
        const currentStock = Number(selectedProduct?.current_stock || 0);
        const inputQty = Number(form.quantity);
        const inputPrice = Number(form.price_at_transaction);

        // VALIDASI 1: Jangan biarkan jumlah 0 atau negatif
        if (inputQty <= 0) {
            alert("Jumlah harus lebih dari 0 ya, bre!");
            return;
        }
        if (inputPrice <= 0) {
            alert("Harga transaksi nggak boleh Rp 0, isi harganya dulu!");
            return;
        }
        // VALIDASI 2: Cegah stok minus jika Barang Keluar
        if (form.type.toLowerCase() === "out" && inputQty > currentStock) {
            alert(
                `Waduh, stok nggak cukup! Stok ${selectedProduct?.name} cuma ada ${currentStock}. \n\nLo mau ngeluarin ${inputQty}, tekor dong!`
            );
            return;
        }
        try {
            // Log ini buat mastiin harganya ada sebelum dikirim
            console.log("Mengirim transaksi...", form);

            // Kirim data yang sudah fix angka
            await axios.post("http://localhost:5000/api/transaksi", {
                product_id: form.product_id,
                type: form.type.toLowerCase(),
                quantity: inputQty,
                price_at_transaction: inputPrice, // <--- INI WAJIB ADA
            });
            alert("Transaksi Berhasil!");
            onRefresh();
            onClose();
        } catch (err) {
            console.error("Detail Error:", err.response?.data || err.message);
            alert(err.response?.data?.error || "Gagal simpan transaksi");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[1000] transition-opacity">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-transparent dark:border-slate-700 transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold dark:text-white transition-colors">
                        Catat Transaksi
                    </h2>
                    <button
                        onClick={onClose}
                        className="hover:rotate-90 transition-transform">
                        <X
                            size={24}
                            className="text-slate-400 dark:text-slate-500"
                        />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">
                            Pilih Produk
                        </label>
                        <select
                            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            value={form.product_id}
                            onChange={(e) =>
                                setForm({ ...form, product_id: e.target.value })
                            }
                            required>
                            <option value="">-- Pilih Produk --</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            Stok saat ini:{" "}
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                {products.find((p) => p.id == form.product_id)
                                    ?.current_stock || 0}
                            </span>
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">
                            Tipe
                        </label>
                        <select
                            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            onChange={(e) =>
                                setForm({ ...form, type: e.target.value })
                            }>
                            <option value="in">Barang Masuk</option>
                            <option value="out">Barang Keluar</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">
                            Jumlah
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            onChange={(e) =>
                                setForm({ ...form, quantity: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 dark:text-white">
                            Harga Satuan (Rp){" "}
                            {form.type === "in" ? "Beli" : "Jual"}
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            value={form.price_at_transaction}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    price_at_transaction: e.target.value,
                                })
                            }
                            required
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            *Harga saat barang masuk atau harga jual saat barang
                            keluar.
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95">
                        Simpan Transaksi
                    </button>
                </form>
            </div>
        </div>
    );
}

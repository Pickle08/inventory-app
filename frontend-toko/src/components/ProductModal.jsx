import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function ProductModal({
    isOpen,
    onClose,
    onRefresh,
    initialData,
}) {
    const [formData, setFormData] = useState({
        name: "",
        min_stock: 0,
        category: "",
        current_stock: 0,
        price: 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                min_stock: initialData.min_stock,
                category: initialData.category || "",
                current_stock: initialData.current_stock ?? 0,
                price: initialData.price || 0,
            });
        } else if (isOpen) {
            setFormData({
                name: "",
                min_stock: 0,
                category: "",
                current_stock: 0,
                price: 0,
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi sederhana
        if (!formData.price || parseInt(formData.price) <= 0) {
            alert("Harga produk harus diisi!");
            return;
        }

        const id = initialData?.id; // Ambil ID dari initialData
        const url = id
            ? `http://localhost:5000/api/products/${id}`
            : "http://localhost:5000/api/products";
        const method = id ? "put" : "post";

        try {
            const payload = {
                ...formData,
                name: formData.name.trim(),
                price: parseInt(formData.price) || 0,
                current_stock: parseInt(formData.current_stock) || 0,
                min_stock: parseInt(formData.min_stock) || 0,
            };

            // Kirim ke server
            await axios[method](url, payload);

            alert("Data berhasil disimpan!");
            onRefresh(); // Ini akan memanggil fetchData di App.jsx
            onClose();
        } catch (err) {
            console.error(err);
            alert(
                "Gagal simpan: " +
                    (err.response?.data?.message || "Cek koneksi server")
            );
        }
    };

    const isInvalid =
        !formData.name.trim() ||
        formData.current_stock < 0 ||
        formData.min_stock < 0 ||
        !formData.category;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[1000] transition-all">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-transparent dark:border-slate-700 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold dark:text-white">
                        {initialData ? "Edit Produk" : "Tambah Produk Baru"}
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
                    {/* INPUT NAMA */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Nama Produk
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            placeholder="Contoh: Beras 5kg"
                            required
                        />
                    </div>

                    {/* INPUT KATEGORI */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Kategori
                        </label>
                        <select
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.category}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    category: e.target.value,
                                })
                            }
                            required>
                            <option value="">-- Pilih Kategori --</option>
                            <option value="Sembako">Sembako</option>
                            <option value="Alat Mandi">Alat Mandi</option>
                            <option value="Bumbu Dapur">Bumbu Dapur</option>
                            <option value="Alat Bersih">Alat Bersih</option>
                        </select>
                    </div>

                    {/* TARUH CODE HARGA DI SINI */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Harga Satuan (Rp)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-2.5 text-slate-400">
                                Rp
                            </span>
                            <input
                                type="number"
                                min="1"
                                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        price: parseInt(e.target.value) || 0,
                                    })
                                }
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* BATAS STOK MINIMUM */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Batas Stok Minimum
                            </label>
                            <input
                                type="number"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                min="0"
                                value={formData.current_stock}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        current_stock: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        {/* STOK SAAT INI */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Stok Fisik
                            </label>
                            <input
                                type="number"
                                className="w-full px-4 py-2.5 rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-900/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                min="0"
                                value={formData.current_stock}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        current_stock:
                                            parseInt(e.target.value) || 0,
                                    })
                                }
                                required
                            />
                            {formData.current_stock < 0 && (
                                <p className="text-xs text-red-500 mt-1 italic">
                                    * Stok tidak boleh kurang dari 0
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all">
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isInvalid}
                            className={`flex-1 py-3 rounded-xl font-bold text-white transition-all active:scale-95 ${
                                isInvalid
                                    ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
                                    : initialData
                                    ? "bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200 dark:shadow-none"
                                    : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none"
                            }`}>
                            {initialData ? "Simpan Perubahan" : "Simpan Produk"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

import React from "react";
import axios from "axios";
import { Trash2, Edit } from "lucide-react";

const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka || 0);
};

export default function InventoryTable({
    data,
    onRefresh,
    onEdit,
    onShowDetail,
}) {
    const handleDeleteProduct = async (id) => {
        if (window.confirm("Hapus produk ini dari daftar master?")) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`);
                onRefresh();
            } catch (err) {
                alert(err.response?.data?.error || "Gagal menghapus produk");
            }
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-sm transition-colors duration-300">
            <div className="p-6 border-b border-slate-50 dark:border-slate-700">
                <h2 className="font-bold text-lg dark:text-white">
                    Daftar Inventaris
                </h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                Produk
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                                Stok
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                                Harga
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {data.map((item) => {
                            const stokSekarang = Number(item.current_stock);
                            const stokMinimal = Number(item.min_stock);
                            const isLow = stokSekarang <= stokMinimal + 5;

                            return (
                                <tr
                                    key={item.id}
                                    className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${
                                        isLow
                                            ? "bg-red-50/50 dark:bg-red-900/10"
                                            : ""
                                    }`}>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <button
                                                onClick={() =>
                                                    onShowDetail(item)
                                                }
                                                className="flex flex-col text-left group transition-all">
                                                <span className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 group-hover:underline">
                                                    {item.name}
                                                </span>
                                                <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-tighter">
                                                    {item.category || "Umum"}
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold">
                                        <div className="flex flex-col items-center">
                                            <span
                                                className={
                                                    isLow
                                                        ? "text-red-600"
                                                        : "dark:text-slate-200"
                                                }>
                                                {item.current_stock}
                                            </span>
                                            {isLow && (
                                                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded mt-1 animate-pulse">
                                                    LOW
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {formatRupiah(item.price)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                isLow
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-green-100 text-green-700"
                                            }`}>
                                            {isLow ? "Kritis" : "Aman"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteProduct(item.id)
                                                }
                                                className="p-2 text-slate-400 hover:text-red-600 rounded-lg">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

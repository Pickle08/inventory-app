import React from "react";
import { X, ShoppingCart, Package, TrendingUp } from "lucide-react";

const ProductDetailModal = ({ product, transactions, onClose }) => {
    if (!product) return null;

    // 1. Filter transaksi: Kita paksa cek semua kemungkinan nama kolom
    const productHistory = transactions.filter((t) => {
        // Kita ambil nama produk dari transaksi, cek kolom 'product' ATAU 'product_name'
        const trxProductName = t.product || t.product_name || t.name;

        // Kita bandingkan, hapus spasi kosong (trim) dan samakan jadi huruf kecil semua
        return (
            trxProductName?.toString().toLowerCase().trim() ===
            product.name?.toString().toLowerCase().trim()
        );
    });

    // 2. Hitung Total Masuk (Cek 'MASUK' atau 'in')
    const totalIn = productHistory
        .filter((t) => {
            const type = (t.tipe || t.type)?.toLowerCase();
            return type === "masuk" || type === "in";
        })
        .reduce((acc, t) => acc + Number(t.quantity || 0), 0);

    // 3. Hitung Terjual (Cek 'KELUAR' atau 'out')
    const totalOut = productHistory
        .filter((t) => {
            const type = (t.tipe || t.type)?.toLowerCase();
            return type === "keluar" || type === "out";
        })
        .reduce((acc, t) => acc + Number(t.quantity || 0), 0);

    // Label Performa Otomatis
    const performanceLabel = totalOut > 10 ? "Laris Manis" : "Stabil";

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4 transition-all">
            <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                {/* Header Section - Tetap Modern */}
                <div className="relative p-8 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-slate-800 dark:to-slate-950 text-white">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest">
                            {product.category || "General"}
                        </span>
                        <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                totalOut > 10
                                    ? "bg-emerald-400 text-emerald-950"
                                    : "bg-amber-400 text-amber-950"
                            }`}>
                            {performanceLabel}
                        </span>
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tight">
                        {product.name}
                    </h3>
                    <p className="text-blue-100/70 text-sm mt-1 font-medium">
                        ID Produk: #{product.id.toString().padStart(4, "0")}
                    </p>
                </div>

                {/* Body - Fokus ke Generate Angka Statistik */}
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Box Stok Sisa */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl mb-3">
                                <Package size={24} />
                            </div>
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                Stok Sisa
                            </span>
                            <p className="text-3xl font-black dark:text-white mt-1">
                                {product.current_stock}
                            </p>
                        </div>

                        {/* Box Total Masuk */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl mb-3">
                                <TrendingUp size={24} />
                            </div>
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                Total Masuk
                            </span>
                            <p className="text-3xl font-black dark:text-white mt-1">
                                {totalIn}
                            </p>
                        </div>

                        {/* Box Terjual */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                            <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-xl mb-3">
                                <ShoppingCart size={24} />
                            </div>
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                Terjual
                            </span>
                            <p className="text-3xl font-black dark:text-white mt-1">
                                {totalOut}
                            </p>
                        </div>
                    </div>

                    {/* SECTION BARU: LOG AKTIVITAS PRODUK */}
                    <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
                        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
                            Riwayat Aktivitas Terakhir
                        </h4>

                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                            {productHistory.length > 0 ? (
                                productHistory.map((trx, index) => {
                                    const isMasuk =
                                        (
                                            trx.tipe || trx.type
                                        )?.toLowerCase() === "masuk" ||
                                        (
                                            trx.tipe || trx.type
                                        )?.toLowerCase() === "in";

                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-2 rounded-lg ${
                                                        isMasuk
                                                            ? "bg-emerald-100 text-emerald-600"
                                                            : "bg-rose-100 text-rose-600"
                                                    }`}>
                                                    {isMasuk ? (
                                                        <TrendingUp size={14} />
                                                    ) : (
                                                        <ShoppingCart
                                                            size={14}
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold dark:text-white capitalize">
                                                        {isMasuk
                                                            ? "Barang Masuk"
                                                            : "Barang Keluar"}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">
                                                        {new Date(
                                                            trx.created_at ||
                                                                trx.waktu
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p
                                                    className={`text-sm font-black ${
                                                        isMasuk
                                                            ? "text-emerald-500"
                                                            : "text-rose-500"
                                                    }`}>
                                                    {isMasuk ? "+" : "-"}
                                                    {trx.quantity}
                                                </p>
                                                <p className="text-[10px] text-slate-400 italic">
                                                    Unit
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-sm text-slate-400 italic">
                                        Belum ada riwayat transaksi untuk produk
                                        ini.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-[11px] text-slate-400 italic">
                            Data di atas dihasilkan secara otomatis berdasarkan
                            seluruh riwayat transaksi yang tercatat di sistem.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;

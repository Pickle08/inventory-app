import {
    Package,
    AlertCircle,
    Wallet,
    TrendingUp,
    ShoppingBag,
    ArrowLeftRight,
} from "lucide-react";

export default function StatsGrid({
    totalItems,
    stockKritis,
    totalAsset,
    totalRevenue,
    totalSpending,
    netFlow,
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Kartu 1: Total Produk */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-5 transition-all duration-300">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Package size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Total Produk
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {totalItems}
                    </p>
                </div>
            </div>
            {/* Kartu 2: Perlu Re-stock */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-5 transition-all duration-300">
                <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
                    <AlertCircle size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Perlu Re-stock
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {stockKritis}
                    </p>
                </div>
            </div>
            {/* Kartu 3: Nilai Aset (BARU) */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-5 transition-all duration-300">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <Wallet size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Nilai Aset
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {totalAsset}
                    </p>
                </div>
            </div>
            {/* Kartu 4: Total Penjualan */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-5 transition-all duration-300">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                    <TrendingUp size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Total Penjualan
                    </p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {totalRevenue}
                    </p>
                </div>
            </div>
            {/* Kartu 5: Belanja Stok */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-5 transition-all duration-300">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
                    <ShoppingBag size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Belanja Stok
                    </p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {totalSpending}
                    </p>
                </div>
            </div>
            {/* Kartu 6: Arus Kas Bersih */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-5 transition-all duration-300">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                    <ArrowLeftRight size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Arus Kas (Net)
                    </p>
                    <p
                        className={`text-2xl font-bold ${
                            netFlow.includes("-")
                                ? "text-red-600"
                                : "text-purple-600 dark:text-purple-400"
                        }`}>
                        {netFlow}
                    </p>
                </div>
            </div>
        </div>
    );
}

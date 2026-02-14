import { ShoppingCart, CheckCircle2 } from "lucide-react";

export default function ShoppingList({ list }) {
    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-2 mb-6 text-orange-600 dark:text-orange-400">
                <ShoppingCart size={20} />
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                    Daftar Belanja
                </h2>
            </div>
            <div className="space-y-4">
                {list.length > 0 ? (
                    list.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 transition-colors">
                            <p className="font-bold text-orange-900 dark:text-orange-200">
                                {item.name}
                            </p>
                            <p className="text-xs text-orange-700 dark:text-orange-300/80 mt-1">
                                Stok tinggal {item.current_stock || 0}, segera
                                kulakan!
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <CheckCircle2
                            className="mx-auto text-green-400 dark:text-green-500 mb-2"
                            size={32}
                        />
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                            Stok aman terkendali.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

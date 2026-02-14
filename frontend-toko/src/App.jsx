import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import StatsGrid from "./components/StatsGrid";
import InventoryTable from "./components/InventoryTable";
import ShoppingList from "./components/ShoppingList";
import TransactionModal from "./components/TransactionModal";
import ProductModal from "./components/ProductModal";
import TransactionHistory from "./components/TransactionHistory";
import { Plus, PackagePlus, Search, Calendar } from "lucide-react";
import { formatRupiah } from "./utils/helpers.js";
import SalesChart from "./components/SalesChart";
import ProductDetailModal from "./components/ProductDetailModal";

function App() {
    const API_URL = import.meta.env.VITE_API_URL;

    // State Management
    const [data, setData] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductDetail, setSelectedProductDetail] = useState(null);

    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("Semua");
    const [filterCategory, setFilterCategory] = useState("Semua");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [darkMode, setDarkMode] = useState(false);

    // 1. Pembersihan Fetch Data
    const fetchData = async () => {
        try {
            const [resProduct, resRiwayat] = await Promise.all([
                fetch(`${API_URL}/products`),
                fetch(`${API_URL}/riwayat`),
            ]);

            const productsJson = await resProduct.json();
            const riwayatJson = await resRiwayat.json();

            setData(productsJson);
            setTransactions(riwayatJson);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Dark Mode Logic
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    // 3. Memoized/Derived State (Logika Filter Tabel)
    const filteredData = data.filter((item) => {
        // 1. Cek Pencarian
        const matchesSearch = item.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        // 2. Cek Status (Gunakan variabel, jangan langsung return)
        const isKritis = Number(item.current_stock) <= Number(item.min_stock);
        let matchesStatus = true;
        if (filterStatus === "Kritis") matchesStatus = isKritis;
        if (filterStatus === "Aman") matchesStatus = !isKritis;
        // 3. Cek Kategori
        const matchesCategory =
            filterCategory === "Semua" || item.category === filterCategory;
        // Gabungkan semua kriteria
        return matchesSearch && matchesStatus && matchesCategory;
    });

    // 4. Logika Shopping List (Stok Kritis)
    const listBelanja = data.filter(
        (item) => Number(item.current_stock) <= Number(item.min_stock)
    );

    // 5. Filter Transaksi Berdasarkan Tanggal
    const filteredTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.created_at)
            .toISOString()
            .split("T")[0];
        const matchesStart =
            !dateRange.start || transactionDate >= dateRange.start;
        const matchesEnd = !dateRange.end || transactionDate <= dateRange.end;
        return matchesStart && matchesEnd;
    });

    // 6. Ringkasan Finansial & Aset
    const totalAssetValue = data.reduce((acc, item) => {
        return acc + Number(item.current_stock) * Number(item.price || 0);
    }, 0);
    const financialSummary = filteredTransactions.reduce(
        (acc, t) => {
            const qty = Number(t.quantity || 0);
            const price = Number(t.price_at_transaction || 0);
            const totalLine = qty * price;

            if (t.type === "in") acc.totalSpending += totalLine;
            else if (t.type === "out") acc.totalRevenue += totalLine;

            return acc;
        },
        { totalSpending: 0, totalRevenue: 0 }
    );

    // Handlers
    const handleEditClick = (product) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };
    const handleCloseModal = () => {
        setEditingProduct(null);
        setIsProductModalOpen(false);
    };

    const netFlow =
        financialSummary.totalRevenue - financialSummary.totalSpending;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Dark Mode Toggle */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="fixed bottom-6 right-6 p-4 bg-white dark:bg-slate-800 shadow-2xl rounded-full z-[999] border border-slate-200 dark:border-slate-700 hover:scale-110 transition-all dark:text-white">
                {darkMode ? "☀️" : "🌙"}
            </button>

            <Navbar />

            <main className="p-4 md:p-8 space-y-8">
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search
                            className="absolute left-3 top-2.5 text-slate-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Cari nama produk..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                        <Calendar size={16} className="text-blue-500" />
                        <input
                            type="date"
                            className="bg-transparent outline-none text-[13px] dark:text-white [color-scheme:dark]"
                            value={dateRange.start}
                            onChange={(e) =>
                                setDateRange({
                                    ...dateRange,
                                    start: e.target.value,
                                })
                            }
                        />
                        <span className="text-slate-300">-</span>
                        <input
                            type="date"
                            className="bg-transparent outline-none text-[13px] dark:text-white [color-scheme:dark]"
                            value={dateRange.end}
                            onChange={(e) =>
                                setDateRange({
                                    ...dateRange,
                                    end: e.target.value,
                                })
                            }
                        />
                    </div>

                    <select
                        className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl outline-none dark:text-white"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="Semua">Semua Status</option>
                        <option value="Aman">Aman</option>
                        <option value="Kritis">Kritis</option>
                    </select>

                    <select
                        className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl outline-none dark:text-white"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}>
                        <option value="Semua">Semua Kategori</option>
                        <option value="Sembako">Sembako</option>
                        <option value="Alat Mandi">Alat Mandi</option>
                        <option value="Bumbu Dapur">Bumbu Dapur</option>
                    </select>
                </div>

                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold dark:text-white">
                        Ringkasan Operasional
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsProductModalOpen(true)}
                            className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl font-bold hover:bg-emerald-200 transition">
                            <PackagePlus size={20} /> Produk Baru
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:scale-105 transition">
                            <Plus size={20} /> Update Stok
                        </button>
                    </div>
                </div>

                <StatsGrid
                    totalItems={data.length}
                    stockKritis={listBelanja.length}
                    totalAsset={formatRupiah(totalAssetValue)}
                    totalRevenue={formatRupiah(financialSummary.totalRevenue)}
                    totalSpending={formatRupiah(financialSummary.totalSpending)}
                    netFlow={formatRupiah(netFlow)}
                />

                <SalesChart transactions={filteredTransactions} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <InventoryTable
                            data={filteredData}
                            onRefresh={fetchData}
                            onEdit={handleEditClick}
                            onShowDetail={setSelectedProductDetail}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <ShoppingList list={listBelanja} />
                    </div>
                </div>

                <TransactionHistory
                    transactions={filteredTransactions}
                    onRefresh={fetchData}
                />

                {/* Modals */}
                <ProductDetailModal
                    product={selectedProductDetail}
                    transactions={transactions}
                    onClose={() => setSelectedProductDetail(null)}
                />

                <TransactionModal
                    products={data}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onRefresh={fetchData}
                />

                <ProductModal
                    isOpen={isProductModalOpen}
                    onClose={handleCloseModal}
                    onRefresh={fetchData}
                    initialData={editingProduct}
                />
            </main>
        </div>
    );
}

export default App;

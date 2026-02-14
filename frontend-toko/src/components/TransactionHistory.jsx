import React, { useState } from "react"; // <-- Tambahin useState di sini
import { Trash2, FileText } from "lucide-react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatRupiah } from "../utils/helpers";

export default function TransactionHistory({ transactions, onRefresh }) {
    const [filterProduk, setFilterProduk] = useState("Semua");
    const [filterTipe, setFilterTipe] = useState("Semua");

    const handleDelete = async (id) => {
        if (window.confirm("Hapus transaksi ini?")) {
            try {
                await axios.delete(`http://127.0.0.1:5000/api/riwayat/${id}`);
                onRefresh();
            } catch (err) {
                console.error(err);
                alert("Koneksi ke server terputus, coba lagi nanti.");
            }
        }
    };

    // --- LOGIKA FILTER ---
    const riwayatFiltered = transactions.filter((t) => {
        const matchProduk = filterProduk === "Semua" || t.name === filterProduk;
        const matchTipe =
            filterTipe === "Semua" ||
            t.type.toLowerCase() === filterTipe.toLowerCase();
        return matchProduk && matchTipe;
    });

    // Ambil daftar nama produk unik buat isi dropdown secara otomatis
    const daftarProdukUnik = [...new Set(transactions.map((t) => t.name))];

    const downloadPDF = () => {
        const doc = new jsPDF();
        const now = new Date();
        const todayISO = now.toISOString().split("T")[0];
        const todayDisplay = now.toLocaleDateString("id-ID");

        // Filter PDF pake data yang udah ter-filter di layar atau tetep semua transaksi hari ini?
        // Biasanya user pengen PDF-nya sesuai apa yang dia liat (daily filtered).
        const dailyData = transactions.filter((t) => {
            const itemDate = new Date(t.created_at).toISOString().split("T")[0];
            return itemDate === todayISO;
        });

        if (dailyData.length === 0) {
            alert("Tidak ada transaksi untuk hari ini.");
            return;
        }

        doc.setFontSize(16);
        doc.text(`Laporan Transaksi Harian`, 14, 15);
        doc.setFontSize(10);
        doc.text(`Tanggal: ${todayDisplay}`, 14, 22);

        const tableRows = dailyData.map((t, index) => [
            index + 1,
            t.name,
            t.type === "in" ? "Masuk" : "Keluar",
            `${t.type === "in" ? "+" : "-"}${t.quantity}`,
            formatRupiah(t.price_at_transaction || 0),
            formatRupiah((t.price_at_transaction || 0) * t.quantity),
            new Date(t.created_at).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        ]);

        autoTable(doc, {
            head: [["No", "Produk", "Tipe", "Qty", "Harga", "Total", "Jam"]],
            body: tableRows,
            startY: 30,
            headStyles: { fillColor: [51, 65, 85], halign: "center" },
            styles: { fontSize: 8, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 10, halign: "center" },
                1: { cellWidth: "auto" },
                2: { cellWidth: 20, halign: "center" },
                3: { cellWidth: 15, halign: "center" },
                4: { cellWidth: 30, halign: "right" },
                5: { cellWidth: 35, halign: "right" },
                6: { cellWidth: 20, halign: "center" },
            },
        });

        doc.save(`Laporan_${todayISO}.pdf`);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mt-8 transition-colors duration-300">
            {/* --- HEADER & BUTTONS --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                        Riwayat Transaksi Terakhir
                    </h3>
                    <p className="text-xs text-slate-500">
                        Menampilkan {riwayatFiltered.length} transaksi
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {/* Dropdown Produk */}
                    <select
                        className="text-sm border border-slate-200 dark:border-slate-600 rounded-xl p-2 bg-white dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterProduk}
                        onChange={(e) => setFilterProduk(e.target.value)}>
                        <option value="Semua">Semua Produk</option>
                        {daftarProdukUnik.map((prod) => (
                            <option key={prod} value={prod}>
                                {prod}
                            </option>
                        ))}
                    </select>

                    {/* Dropdown Tipe */}
                    <select
                        className="text-sm border border-slate-200 dark:border-slate-600 rounded-xl p-2 bg-white dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterTipe}
                        onChange={(e) => setFilterTipe(e.target.value)}>
                        <option value="Semua">Semua Tipe</option>
                        <option value="in">Masuk</option>
                        <option value="out">Keluar</option>
                    </select>

                    <button
                        onClick={downloadPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm">
                        <FileText size={16} />
                        Cetak PDF
                    </button>
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider border-b dark:border-slate-700">
                            <th className="pb-3">Waktu</th>
                            <th className="pb-3">Produk</th>
                            <th className="pb-3 text-center">Tipe</th>
                            <th className="pb-3 text-right">Harga Satuan</th>
                            <th className="pb-3 text-right">Subtotal</th>
                            <th className="pb-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700/50">
                        {/* KUNCINYA DI SINI: Pake riwayatFiltered, bukan transactions */}
                        {riwayatFiltered.map((t) => (
                            <tr
                                key={t.id}
                                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                <td className="py-4 text-slate-500 dark:text-slate-400">
                                    {new Date(t.created_at).toLocaleString(
                                        "id-ID",
                                        {
                                            dateStyle: "short",
                                            timeStyle: "short",
                                        }
                                    )}
                                </td>
                                <td className="py-4 font-semibold text-slate-700 dark:text-slate-200">
                                    {t.name}
                                </td>
                                <td className="py-4 text-center">
                                    <span
                                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            t.type === "in"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        }`}>
                                        {t.type === "in" ? "Masuk" : "Keluar"}
                                    </span>
                                </td>
                                <td className="py-4 text-right text-slate-500 dark:text-slate-400">
                                    {formatRupiah(t.price_at_transaction || 0)}
                                </td>
                                <td
                                    className={`py-4 text-right font-bold ${
                                        t.type === "in"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}>
                                    <div className="flex flex-col items-end">
                                        <span>
                                            {t.type === "in" ? "+" : "-"}
                                            {formatRupiah(
                                                t.quantity *
                                                    (t.price_at_transaction ||
                                                        0)
                                            )}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-normal">
                                            {t.quantity} unit
                                        </span>
                                    </div>
                                </td>
                                <td className="py-3 text-center">
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {riwayatFiltered.length === 0 && (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="py-10 text-center text-slate-400 italic">
                                    Tidak ada transaksi yang cocok dengan
                                    filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

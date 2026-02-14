import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { formatRupiah } from "../utils/helpers";

// Fungsi pengolah data ditaruh di sini (di luar fungsi utama)
const prepareChartData = (transactions) => {
    const last7Days = {};

    // Inisialisasi 7 hari terakhir
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString("id-ID", { weekday: "short" });
        last7Days[dateStr] = 0;
    }

    // Hitung total penjualan (tipe 'out' / 'keluar')
    transactions.forEach((t) => {
        if (
            t.type.toLowerCase() === "out" ||
            t.type.toLowerCase() === "keluar"
        ) {
            const dateStr = new Date(t.created_at).toLocaleDateString("id-ID", {
                weekday: "short",
            });
            if (last7Days.hasOwnProperty(dateStr)) {
                last7Days[dateStr] +=
                    Number(t.quantity) * Number(t.price_at_transaction);
            }
        }
    });

    return Object.keys(last7Days).map((key) => ({
        hari: key,
        penjualan: last7Days[key],
    }));
};

export default function SalesChart({ transactions }) {
    const chartData = prepareChartData(transactions);

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mt-6 transition-colors">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">
                Tren Penjualan (7 Hari Terakhir)
            </h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient
                                id="colorSales"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            strokeOpacity={0.1}
                        />
                        <XAxis
                            dataKey="hari"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            hide={false}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 10 }}
                            tickFormatter={(value) => `Rp ${value / 1000}rb`}
                        />
                        <Tooltip
                            cursor={{ stroke: "#3b82f6", strokeWidth: 2 }}
                            contentStyle={{
                                borderRadius: "16px",
                                border: "none",
                                backgroundColor: "#0f172a",
                                color: "#fff",
                                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                            }}
                            formatter={(value) => [
                                formatRupiah(value),
                                "Omset",
                            ]}
                        />
                        <Area
                            type="monotone"
                            dataKey="penjualan"
                            stroke="#3b82f6"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorSales)"
                            dot={{
                                r: 4,
                                fill: "#3b82f6",
                                strokeWidth: 2,
                                stroke: "#fff",
                            }} // Tambah titik biar estetik
                            activeDot={{ r: 8, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

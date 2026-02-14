const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi ke Database (Sama seperti Engine di Python)
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "toko_dummy_db",
});

// Endpoint API untuk mengambil stok (Logika JOIN kamu tadi!)
app.get("/api/stok", (req, res) => {
    const sql =
        "SELECT id, name, min_stock, category, current_stock FROM products";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result);
    });
});

// Endpoint untuk menambah transaksi baru
app.post("/api/transaksi", (req, res) => {
    const { product_id, type, quantity, price_at_transaction } = req.body;
    const qty = Number(quantity);
    // 1. Ambil data produk untuk cek stok saat ini
    db.query(
        "SELECT current_stock, name FROM products WHERE id = ?",
        [product_id],
        (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.length === 0)
                return res.status(404).json({ error: "Produk tidak ketemu!" });
            const product = results[0];
            const currentStock = Number(product.current_stock);
            // 2. Validasi stok jika barang keluar
            if (type === "out" && qty > currentStock) {
                return res.status(400).json({
                    error: `Waduh, stok nggak cukup! Stok ${product.name} cuma ada ${currentStock}.`,
                });
            }
            // 3. Hitung stok baru (Tambah jika masuk, Kurang jika keluar)
            const newStock =
                type === "in" ? currentStock + qty : currentStock - qty;
            // 4. Update tabel PRODUCTS (Simpan angka stok baru)
            db.query(
                "UPDATE products SET current_stock = ? WHERE id = ?",
                [newStock, product_id],
                (err) => {
                    if (err) return res.status(500).json(err);
                    // 5. Masukkan ke tabel TRANSACTIONS (Catat riwayat)
                    db.query(
                        "INSERT INTO transactions (product_id, type, quantity, price_at_transaction) VALUES (?, ?, ?, ?)",
                        [product_id, type, qty, price_at_transaction],
                        (err) => {
                            if (err) return res.status(500).json(err);

                            res.json({
                                message:
                                    "Transaksi sukses dan stok diperbarui!",
                                newStock: newStock,
                            });
                        }
                    );
                }
            );
        }
    );
});

app.get("/api/riwayat", (req, res) => {
    const sql = `
        SELECT t.id, p.name, t.type, t.quantity, t.price_at_transaction, t.created_at 
        FROM transactions t 
        JOIN products p ON t.product_id = p.id 
        ORDER BY t.created_at DESC LIMIT 10
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 2. Endpoint Hapus Riwayat (Versi Pintar yang update stok)
app.delete("/api/riwayat/:id", (req, res) => {
    const { id } = req.params;

    // Cari dulu datanya buat tau berapa stok yang harus dibalikin
    db.query(
        "SELECT product_id, type, quantity FROM transactions WHERE id = ?",
        [id],
        (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.length === 0)
                return res.status(404).json({ error: "Data nggak ketemu!" });

            const { product_id, type, quantity } = results[0];
            const adjustment = type === "out" ? quantity : -quantity;

            // Balikin stok ke tabel products
            db.query(
                "UPDATE products SET current_stock = current_stock + ? WHERE id = ?",
                [adjustment, product_id],
                (err) => {
                    if (err) return res.status(500).json(err);

                    // Baru hapus permanen riwayatnya
                    db.query(
                        "DELETE FROM transactions WHERE id = ?",
                        [id],
                        (err) => {
                            if (err) return res.status(500).json(err);
                            res.json({
                                message: "Riwayat dihapus & stok kembali!",
                            });
                        }
                    );
                }
            );
        }
    );
});

// Endpoint untuk menambah produk baru ke database
app.post("/api/products", (req, res) => {
    // 1. Ambil category dari req.body
    const { name, min_stock, category } = req.body;
    // 2. Gunakan query INSERT yang benar dengan 3 kolom
    const sql =
        "INSERT INTO products (name, min_stock, category) VALUES (?, ?, ?)";
    db.query(sql, [name, min_stock, category], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Gagal simpan ke database" });
        }
        res.json({
            message: "Produk berhasil ditambahkan",
            id: result.insertId,
        });
    });
});

app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const { name, category, price, current_stock, min_stock } = req.body;

    db.query(
        "SELECT current_stock FROM products WHERE id = ?",
        [id],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            if (rows.length === 0)
                return res.status(404).json({ error: "Produk tidak ketemu" });

            const oldStock = rows[0].current_stock;
            const diff = current_stock - oldStock;

            // URUTAN HARUS PERSIS: 1.name, 2.category, 3.price, 4.current_stock, 5.min_stock, 6.id
            const sqlUpdate =
                "UPDATE products SET name = ?, category = ?, price = ?, current_stock = ?, min_stock = ? WHERE id = ?";

            db.query(
                sqlUpdate,
                [name, category, price, current_stock, min_stock, id], // Urutan variabel disamakan dengan SQL di atas
                (err) => {
                    if (err) {
                        console.error("Kesalahan SQL:", err);
                        return res.status(500).json(err);
                    }

                    if (diff !== 0) {
                        const type = diff > 0 ? "in" : "out";
                        const sqlLog =
                            "INSERT INTO transactions (product_id, type, quantity, price_at_transaction) VALUES (?, ?, ?, ?)";
                        db.query(
                            sqlLog,
                            [id, type, Math.abs(diff), price],
                            (err) => {
                                if (err)
                                    console.error(
                                        "Gagal catat penyesuaian:",
                                        err
                                    );
                            }
                        );
                    }
                    res.json({ message: "Update Berhasil, Bre!" });
                }
            );
        }
    );
});

app.get("/api/products", (req, res) => {
    const sql = "SELECT * FROM products";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Endpoint untuk menghapus produk dari daftar inventaris
app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;

    // Step 1: Hapus dulu riwayat transaksinya (agar tidak error constraint)
    db.query("DELETE FROM transactions WHERE product_id = ?", [id], (err) => {
        if (err) return res.status(500).json(err);

        // Step 2: Baru hapus produknya
        db.query("DELETE FROM products WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Produk dan riwayatnya berhasil dihapus!" });
        });
    });
});

app.listen(5000, () => {
    console.log("Backend jalan di port 5000, bre!");
});

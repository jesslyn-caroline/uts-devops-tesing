import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

// 1. Konfigurasi dibaca dari variabel environment.
//    Nilai setelah || hanya dipakai saat dijalankan di laptop tanpa container.
const PORT = Number(process.env.PORT) || 3000;

const pool = mysql.createPool({
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'crud_db',
    waitForConnections: true,
    connectionLimit: 10,
});

const app = express();
app.use(cors());
app.use(express.json());

// 2. Fungsi bantu agar setiap error selalu dibalas, tidak menggantung.
function handleError(res, err) {
    console.error('Database error:', err.message);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
}

// 3. Fungsi bantu untuk memeriksa input produk.
function isValidProduct(name, price) {
    const nameOk = typeof name === 'string' && name.trim() !== '';
    const priceOk = price !== '' && price !== null && price !== undefined
        && !Number.isNaN(Number(price)) && Number(price) >= 0;
    return nameOk && priceOk;
}

// 4. Health check: sehat hanya jika database bisa dihubungi.
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ ok: true, db: 'up', uptime: Math.round(process.uptime()) });
    } catch (err) {
        console.error('Health check gagal:', err.message);
        res.status(503).json({ ok: false, db: 'down' });
    }
});

// 5. Ambil semua produk.
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM product');
        res.json(rows);
    } catch (err) {
        handleError(res, err);
    }
});

// 6. Ambil satu produk (tetap dikirim sebagai array, karena front end membaca data[0]).
app.get('/api/products/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM product WHERE product_id = ?',
            [req.params.id]
        );
        res.json(rows);
    } catch (err) {
        handleError(res, err);
    }
});

// 7. Tambah produk.
app.post('/api/products', async (req, res) => {
    const { product_name, product_price } = req.body;
    if (!isValidProduct(product_name, product_price)) {
        return res.status(400).json({ message: 'product_name dan product_price wajib diisi dengan benar' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO product (product_name, product_price) VALUES (?, ?)',
            [product_name.trim(), Number(product_price)]
        );
        res.status(201).json({ message: 'Produk berhasil ditambahkan', product_id: result.insertId });
    } catch (err) {
        handleError(res, err);
    }
});

// 8. Ubah produk.
app.put('/api/products/:id', async (req, res) => {
    const { product_name, product_price } = req.body;
    if (!isValidProduct(product_name, product_price)) {
        return res.status(400).json({ message: 'product_name dan product_price wajib diisi dengan benar' });
    }
    try {
        const [result] = await pool.query(
            'UPDATE product SET product_name = ?, product_price = ? WHERE product_id = ?',
            [product_name.trim(), Number(product_price), req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
        res.json({ message: 'Produk berhasil diubah' });
    } catch (err) {
        handleError(res, err);
    }
});

// 9. Hapus produk (endpoint baru, dipanggil tombol Delete di front end).
app.delete('/api/products/:id', async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM product WHERE product_id = ?',
            [req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
        res.json({ message: 'Produk berhasil dihapus' });
    } catch (err) {
        handleError(res, err);
    }
});

// 10. Jalankan server.
const server = app.listen(PORT, () => {
    console.log(`Back end berjalan di port ${PORT}`);
});

// 11. Berhenti dengan rapi saat container dihentikan (docker stop / compose down).
function shutdown(signal) {
    console.log(`${signal} diterima, menutup server...`);
    server.close(() => {
        pool.end().finally(() => process.exit(0));
    });
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
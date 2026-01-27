const db = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.createProduct = (req, res) => {
    const { category_id, diamond_amount, price } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!category_id || !diamond_amount || !price || !image) {
        return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const sql = `
        INSERT INTO products (category_id, diamond_amount, price, image)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [category_id, diamond_amount, price, image], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Produk berhasil ditambahkan' });
    });
};

exports.getAllProducts = (req, res) => {
    const sql = `
        SELECT products.*, game_categories.name AS game_name
        FROM products
        JOIN game_categories ON products.category_id = game_categories.id
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.getProductById = (req, res) => {
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]);
    });
};

exports.updateProduct = (req, res) => {
    const { category_id, diamond_amount, price } = req.body;
    const newImage = req.file ? req.file.filename : null;

    const getOld = 'SELECT * FROM products WHERE id = ?';

    db.query(getOld, [req.params.id], (err, result) => {
        if(err) return res.status(500).json(err);
        if (!result.length) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        } 

        const oldData = result[0];

        if (newImage && oldData.image) {
            const oldPath = path.join('uploads', oldData.image);
            if (fs.existsSync(oldPath)){
                fs.unlinkSync(oldPath);
            }
        }

        const sql = `
            UPDATE products
            SET category_id=?, diamond_amount=?, price=?, image=?
            WHERE id=?
        `;

        db.query(sql, [
            category_id || oldData.category_id,
            diamond_amount || oldData.diamond_amount,
            price || oldData.price,
            newImage || oldData.image,
            req.params.id
        ], err => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Produk berhasil diupdate' });
        });
    });
};

exports.deleteProduct = (req, res) => {
    const productId = Number(req.params.id)
    if (!productId) {
        return res.status(400).json({ message: "ID produk tidak valid" })
    }

    const trxCheck = "SELECT id FROM transactions WHERE product_id = ? LIMIT 1"
    db.query(trxCheck, [productId], (err, trx) => {
        if (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
        }

        if (trx.length > 0) {
        return res.status(400).json({
            message: "Produk tidak bisa dihapus karena sudah digunakan transaksi",
        })
        }

        const getProduct = "SELECT image FROM products WHERE id = ?"
        db.query(getProduct, [productId], (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: "Server error" })
        }

        if (!result.length) {
            return res.status(404).json({ message: "Produk tidak ditemukan" })
        }

        const image = result[0].image
        const imagePath = path.join(__dirname, "..", "uploads", image || "")

        if (image && fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
            if (err) console.error("Gagal hapus gambar:", err)
            })
        }

        const del = "DELETE FROM products WHERE id = ?"
        db.query(del, [productId], (err) => {
            if (err) {
            console.error(err)
            return res.status(500).json({ message: "Gagal hapus produk" })
            }

            res.json({ message: "Produk berhasil dihapus" })
        })
        })
    })
}

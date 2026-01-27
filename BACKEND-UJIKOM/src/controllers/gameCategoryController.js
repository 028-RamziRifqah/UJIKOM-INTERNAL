const db = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.getCategories = (req, res) => {
    const sql = 'SELECT * FROM game_categories ORDER BY id ASC';
    db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal mengambil data kategori game', error: err})
    res.json({ succes: true, data: result })
    })
}

exports.getById = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM game_categories WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil info kategori game', error: err });
        if (result.length === 0) return res.status(404).json({ message: 'Kategori game tidak ditemukan' });
        res.json(result[0]);
    });
};

exports.getCategoryWithProducts = (req, res) => {
    const categoryId = req.params.id;

    const sql = `
        SELECT 
            c.id AS category_id,
            c.name,
            c.image AS category_image,
            p.id AS product_id,
            p.diamond_amount,
            p.price,
            p.image AS product_image
        FROM game_categories c
        LEFT JOIN products p ON p.category_id = c.id
        WHERE c.id = ?
    `;

    db.query(sql, [categoryId], (err, results) => {
        if (err) return res.status(500).json(err);
        if (!results.length) {
            return res.status(404).json({ message: 'Game tidak ditemukan' });
        }

        const category = {
            id: results[0].category_id,
            name: results[0].name,
            image: results[0].category_image,
            products: []
        };

        results.forEach(row => {
            if (row.product_id) {
                category.products.push({
                    id: row.product_id,
                    diamond_amount: row.diamond_amount,
                    price: row.price,
                    image: row.product_image
                });
            }
        });

        res.json(category);
    });
};


exports.createCategory = (req, res) => {
    const { name } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !image){
        return res.status(400).json({ message: 'Nama & gambar tidak dapat kosong!'});
    };

    const sql = 'INSERT INTO game_categories (name, image) VALUES (?, ?)';
    db.query(sql, [name, image],(err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal menambahkan kategori game', error: err});
        res.json({ success: true, message: 'Kategori game berhasil ditambahkan', categoryId: result.insertId});
    }); 
}

exports.updateCategory = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const image = req.file ? req.file.filename : null;

    db.query('SELECT * FROM game_categories WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data kategori game', error: err});
        if (result.length === 0) return res.status(404).json({ message: 'Kategori game tidak ditemukan' });
        
        const oldImage = result[0].image
        if (image && oldImage) {
            const oldPath = path.join(__dirname, 'uploads', oldImage);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        };

        const sql = 'UPDATE game_categories SET name = ?, image = ? WHERE id = ?'
        db.query(sql, [name, image || oldImage, id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal update kategori game', error: err});
        res.json({ succes: true, message: 'kategori berhasil diupdate'});
        });
    });
};

exports.deleteCategory = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM game_categories WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data kategori game', error: err})
        if (result.length === 0) return res.status(404).json({ message: 'Kategori game tidak ditemukan' })
        
        const oldImage = result[0].image
        if (oldImage) {
            const oldPath = path.join(__dirname, 'uploads', oldImage);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        db.query('DELETE FROM game_categories WHERE id = ?', [id], (err, result) => {
            if (err) return res.status(500).json({ message: 'Gagal hapus kategori game', error: err})
            res.json({ succes: true, message: 'kategori berhasil dihapus'})
        }) 
    })
}
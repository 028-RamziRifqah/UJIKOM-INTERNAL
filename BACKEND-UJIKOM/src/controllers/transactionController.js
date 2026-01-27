const db = require('../config/db');

exports.getAllTransactions = (req, res) => {
    const sql = `SELECT t.id, u.name AS user_name, c.name AS game_name, p.diamond_amount,
    t.game_user_id, t.status, t.total_price, t.created_at
    FROM transactions t
    JOIN users u ON t.user_id = u.id
    JOIN products p ON t.product_id = p.id
    JOIN game_categories c ON p.category_id = c.id
    ORDER BY t.created_at DESC
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data transaksi', error: err });
        res.json({ success: true, data: result });
    });
};

exports.getUserTransactions = (req, res) => {
    const userId = req.user.id;
    const sql = `
    SELECT t.id, c.name AS game_name, p.diamond_amount, t.game_user_id, 
    t.status, t.total_price, t.created_at
    FROM transactions t
    JOIN products p ON t.product_id = p.id
    JOIN game_categories c ON p.category_id = c.id
    WHERE t.user_id = ?
    ORDER BY t.created_at DESC
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data transaksi', error: err });
        res.json({ success: true, data: result });
    });
};

exports.updateTransactionStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ['pending','success','failed'];
    if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: 'Status tidak valid'});
    }

    const sql = 'UPDATE transactions SET status = ? WHERE id = ?';

    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal update status transaksi', error: err});
        if (result.affectedRows === 0 ) return res.status(404).json({ message: 'Transaksi tidak ditemukan'});
        res.json({ succes: true, message: 'Status transaksi berhasil diupdate'});
    });
};

exports.createTransaction = (req, res) => {
    const userId = req.user.id;
    const { product_id, game_user_id } = req.body;

    if (!product_id || !game_user_id) {
        return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const productSql = 'SELECT price FROM products WHERE id = ?';
    
    db.query(productSql, [product_id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (!result.length) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }

        const price = result[0].price;
        const trxSql = `
            INSERT INTO transactions (user_id, product_id, game_user_id, total_price)
            VALUES (?, ?, ?, ?)
        `;

        db.query(trxSql, [userId, product_id, game_user_id, price], err => {
            if (err) return res.status(500).json(err);
            res.json({
                success: true,
                message: 'Transaksi berhasil dibuat',
                status: 'pending'
            });
        });
    });
};

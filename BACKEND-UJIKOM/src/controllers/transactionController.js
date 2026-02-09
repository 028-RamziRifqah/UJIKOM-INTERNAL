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

exports.getSalesReport = (req, res) => {
    const { startDate, endDate } = req.query;

    let sql = "SELECT total_price, created_at FROM transactions WHERE status = 'success'";
    const params = [];

    if (startDate && endDate) {
        sql += " AND created_at BETWEEN ? AND ?";
        params.push(startDate + ' 00:00:00', endDate + ' 23:59:59');
    }

    sql += " ORDER BY created_at ASC";

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil laporan penjualan', error: err });

        const summary = { totalRevenue: 0, totalTransactions: results.length };
        const daily = {};
        const monthly = {};
        const yearly = {};

        results.forEach(t => {
            const date = new Date(t.created_at);
            const price = Number(t.total_price);

            summary.totalRevenue += price;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            const dayKey = `${year}-${month}-${day}`;
            const monthKey = `${year}-${month}`;
            const yearKey = `${year}`;

            if (!daily[dayKey]) daily[dayKey] = { date: dayKey, revenue: 0, count: 0 };
            daily[dayKey].revenue += price;
            daily[dayKey].count++;

            if (!monthly[monthKey]) monthly[monthKey] = { month: monthKey, revenue: 0, count: 0 };
            monthly[monthKey].revenue += price;
            monthly[monthKey].count++;

            if (!yearly[yearKey]) yearly[yearKey] = { year: yearKey, revenue: 0, count: 0 };
            yearly[yearKey].revenue += price;
            yearly[yearKey].count++;
        });

        res.json({
            success: true,
            data: {
                summary,
                daily: Object.values(daily),
                monthly: Object.values(monthly),
                yearly: Object.values(yearly)
            }
        });
    });
};

const db = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.createEvent = (req, res) => {
    const { category_id, name} = req.body;
    const image = req.file ? req.file.filename : null;

    if (!category_id || !name || !image) {
        return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const sql = `
        INSERT INTO events (category_id, name, image)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [category_id, name, image], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Acara berhasil ditambahkan' });
    });
};

exports.getEvents = (req, res) => {
    const sql = 'SELECT * FROM events ORDER BY id ASC';
    db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal mengambil data acara', error: err})
    res.json({ succes: true, data: result })
    })
}

exports.getEventById = (req, res) => {
    const sql = 'SELECT * FROM events WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]);
    });
};

exports.updateEvent = (req, res) => {
    const { category_id, name } = req.body;
    const newImage = req.file ? req.file.filename : null;

    const getOld = 'SELECT * FROM events WHERE id = ?';

    db.query(getOld, [req.params.id], (err, result) => {
        if(err) return res.status(500).json(err);
        if (!result.length) {
            return res.status(404).json({ message: 'Acara tidak ditemukan' });
        } 

        const oldData = result[0];

        if (newImage && oldData.image) {
            const oldPath = path.join('uploads', oldData.image);
            if (fs.existsSync(oldPath)){
                fs.unlinkSync(oldPath);
            }
        }

        const sql = `
            UPDATE events
            SET category_id=?, name=?,  image=?
            WHERE id=?
        `;

        db.query(sql, [
            category_id || oldData.category_id,
            name || oldData.name,
            newImage || oldData.image,
            req.params.id
        ], err => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Acara berhasil diupdate' });
        });
    });
};

exports.deleteEvent = (req, res) => {
    const eventId = Number(req.params.id)
    if (!eventId) {
        return res.status(400).json({ message: "ID acara tidak valid" })
    }


        const getEvent = "SELECT image FROM events WHERE id = ?"
        db.query(getEvent, [eventId], (err, result) => {
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

        const del = "DELETE FROM events WHERE id = ?"
        db.query(del, [eventId], (err) => {
            if (err) {
            console.error(err)
            return res.status(500).json({ message: "Gagal hapus acara" })
            }

            res.json({ message: "Acara berhasil dihapus" })
        })
        })
}

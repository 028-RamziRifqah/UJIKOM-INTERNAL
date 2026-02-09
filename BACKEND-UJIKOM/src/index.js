const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const transactionsRoutes = require('./routes/transactionRoutes');
const gameCategoryRoutes = require('./routes/gameCategoryRoutes');
const eventRoutes = require('./routes/eventRoutes');
const multer = require('multer');

const app = express();

app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/categories', gameCategoryRoutes);
app.use('/api/events', eventRoutes)

app.get("/", (req, res) => {
    res.send('backend aman men');
});

const PORT = process.env.PORT || 3000

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message});
    };
    if (err){
        return res.status(400).json({ message: err.message});
    };
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
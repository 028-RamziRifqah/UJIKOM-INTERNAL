const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionController');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

router.get('/report', verifyToken, isAdmin, transactionsController.getSalesReport);
router.get('/all', verifyToken, isAdmin, transactionsController.getAllTransactions);
router.post('/', verifyToken, transactionsController.createTransaction);
router.put('/:id/status', verifyToken, isAdmin, transactionsController.updateTransactionStatus);
router.get('/me', verifyToken, transactionsController.getUserTransactions);

module.exports = router;
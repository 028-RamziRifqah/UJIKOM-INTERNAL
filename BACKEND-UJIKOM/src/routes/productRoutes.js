const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const multer = require('multer');
const path = require('path');
const uploadImage = require('../middleware/uploadImage');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});
const upload = multer({ storage });

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/',verifyToken, isAdmin, uploadImage.single('image'), productController.createProduct);
router.put('/:id',verifyToken, isAdmin, uploadImage.single('image'), productController.updateProduct);
router.delete('/:id',verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;
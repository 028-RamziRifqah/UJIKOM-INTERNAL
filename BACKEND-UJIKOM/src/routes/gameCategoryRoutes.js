const express = require('express');
const router = express.Router();
const gameCategoryController = require('../controllers/gameCategoryController');
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

router.get('/', gameCategoryController.getCategories);
router.get('/:id', gameCategoryController.getById);
router.get('/:id/products', gameCategoryController.getCategoryWithProducts);
router.post('/',verifyToken, isAdmin, uploadImage.single('image'), gameCategoryController.createCategory);
router.put('/:id',verifyToken, isAdmin, uploadImage.single('image'), gameCategoryController.updateCategory);
router.delete('/:id',verifyToken, isAdmin, gameCategoryController.deleteCategory);

module.exports = router;
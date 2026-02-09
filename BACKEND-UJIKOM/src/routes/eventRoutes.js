const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
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

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.post('/',verifyToken, isAdmin, uploadImage.single('image'), eventController.createEvent);
router.put('/:id',verifyToken, isAdmin, uploadImage.single('image'), eventController.updateEvent);
router.delete('/:id',verifyToken, isAdmin, eventController.deleteEvent);

module.exports = router;
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp|svg/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (allowed.test(ext) && mime.startsWith('image/') || mime === "image/svg+xml") {
        cb(null, true);
    } else {
        cb(new Error('File harus berupa JPG, PNG, atau SVG'), false);
    }
};

const uploadImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2.5 * 1024 * 1024 
    }
});

module.exports = uploadImage;

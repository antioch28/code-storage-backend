const multer = require('multer');
const path = require('path');
const { v4: uuid } = require('uuid');

const multerStorage = multer.diskStorage({
    destination: 'public/uploads',
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname).toLocaleLowerCase());
    }
});

var upload = multer({
    storage: multerStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limitar a 10MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Solo aceptar archivos de imagen
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(null, false);
    }
});

module.exports = { upload };
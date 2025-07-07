// middlewares/upload.middleware.js
import multer from 'multer';

const storage = multer.memoryStorage(); // or use diskStorage for file saving
export const upload = multer({ storage });

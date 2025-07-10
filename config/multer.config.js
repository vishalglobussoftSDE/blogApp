import multer from 'multer';
const storage = multer.memoryStorage(); // keep in memory to upload to S3

export const upload = multer({ storage });

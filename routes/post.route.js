import express from 'express';
import {
  createPost,
  deletePostById,
  editPostById,
  getPost,
  getPostById
} from '../controllers/post.controller.js';

import { authenticate } from '../middlewares/auth.middleware.js';
import { upload } from '../config/multer.config.js';

const router = express.Router();

// ✅ Protect routes that require login
router.post('/create', authenticate, upload.single('file'), createPost);
router.get('/allpost', getPost);
router.get('/:id', getPostById);
router.put('/update/:id', authenticate, editPostById);
router.delete('/delete/:id', authenticate, deletePostById);

export default router;

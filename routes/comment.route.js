import express from 'express'
import { createComment, updateComment } from '../controllers/comment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/add-comment' , authenticate ,createComment);
router.patch('/update-comment' ,authenticate , updateComment);

export default router;

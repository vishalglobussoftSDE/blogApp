import express from 'express'
import { likeFeature } from '../controllers/like.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.post('/:postId' , authenticate ,likeFeature); // post ID:

export default router;


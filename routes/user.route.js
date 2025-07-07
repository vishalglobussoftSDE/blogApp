import express from 'express'
import { registerUser , loginUser, editUserProfile } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
const  router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch('/update-user' , authenticate ,upload.single('img'), editUserProfile);


export default router;
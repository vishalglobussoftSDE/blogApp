import express from 'express'
import { registerUser , loginUser, editUserProfile, logOutUser } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
const  router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch('/update-user' , authenticate , editUserProfile);
router.post('/logout' ,logOutUser);


export default router; 

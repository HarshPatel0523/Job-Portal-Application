import express from 'express';
import { registerUser, loginUser, logoutUser, updateProfile } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/auth.middleware.js';
import { singleUpload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.route("/register").post(singleUpload, registerUser);
router.route("/login").post(loginUser);
router.route("/profile/update").post(isAuthenticated,singleUpload, updateProfile);
router.route("/logout").get(logoutUser);

export default router;
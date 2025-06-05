import express from 'express';
import { registerUser, loginUser, logoutUser, updateProfile } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/profile/update").post(isAuthenticated, updateProfile);
router.route("/logout").get(logoutUser);

export default router;
import express from 'express';
import isAuthenticated from '../middlewares/auth.middleware.js';
import { applyJob, getApplicants, getApplications, updateApplicationStatus } from '../controllers/application.controller.js';
import { singleUpload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getApplications);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateApplicationStatus);

export default router;
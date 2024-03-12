import express, { Router } from "express";
import { generateApiKey } from "../controllers/credential";

const router: Router = express.Router();

// Public Routes
router.route("/genkey").post(generateApiKey);

export default router;

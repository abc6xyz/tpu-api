import express, { Router } from "express";
import { generateApiKey, getApiKeys, getCredential } from "../controllers/credential";

const router: Router = express.Router();

// Public Routes
router.route("/genkey").post(generateApiKey);
router.route("/keys").get(getApiKeys);
router.route("/").post(getCredential);

export default router;

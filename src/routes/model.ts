import express, { Router } from "express";
import { prediction } from "../controllers/model";

const router: Router = express.Router();

// Public Routes
router.route("/prediction").post(prediction);

export default router;

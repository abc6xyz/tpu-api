import express, { Router } from "express";
import { prediction } from "../controllers/prediction";

const router: Router = express.Router();

// Public Routes
router.route("/").post(prediction);

export default router;

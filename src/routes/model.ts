import express, { Router } from "express";
import { runModel } from "../controllers/model";

const router: Router = express.Router();

// Public Routes
// Run Model
router.route("/run").post(runModel);

export default router;

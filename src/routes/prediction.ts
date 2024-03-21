import express, { Router } from "express";
import { prediction, getPredcitionHistory } from "../controllers/prediction";

const router: Router = express.Router();

// Public Routes
router.route("/").post(prediction);
router.route("/history").get(getPredcitionHistory);

export default router;

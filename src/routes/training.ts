import express, { Router } from "express";
import { createTraining, getTraining, cancelTraining, listTrainings } from "../controllers/training";

const router: Router = express.Router();

// Public Routes
router.route("/create").post( createTraining );
router.route("/:training_id").get( getTraining );
router.route("/:training_id/cancel").get( cancelTraining );
router.route("/list").get( listTrainings );

export default router;

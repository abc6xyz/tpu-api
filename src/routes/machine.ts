import express, { Router } from "express";
import { search } from "../controllers/machine";

const router: Router = express.Router();

// Public Routes
router.route("/search").get(search);
router.route("/search").post(search);

export default router;

import express, { Router } from "express";
import { get, publish } from "../controllers/workflow";

const router: Router = express.Router();

// Public Routes
router.route("/:workflow_id").put(publish);
router.route("/:workflow_id").get(get);

export default router;

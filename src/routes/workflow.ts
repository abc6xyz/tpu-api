import express, { Router } from "express";
import { createWorkflow, deleteWorkflow, get, publish, run, workflowList } from "../controllers/workflow";

const router: Router = express.Router();

// Public Routes
router.route("/create").post(createWorkflow);
router.route("/list").get(workflowList);
router.route("/:workflow_id").get(get);
router.route("/delete/:workflow_id").delete(deleteWorkflow);
router.route("/publish/:workflow_id").put(publish);
router.route("/run/:workflow_id").post(run);

export default router;

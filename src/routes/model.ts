import express, { Router } from "express";
import { createModel, getModel, getModelVersion, listModelVersions, listModels } from "../controllers/model";

const router: Router = express.Router();

// Public Routes
router.route("/:model_owner/:model_name").get( getModel );
router.route("/:model_owner/:model_name/versions").get( listModelVersions );
router.route("/:model_owner/:model_name/versions/:version_id").get( getModelVersion );
router.route("/list").get( listModels );
router.route("/create").post( createModel );

export default router;

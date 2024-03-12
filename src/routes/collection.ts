import express, { Router } from "express";
import { getCollection, getCollections } from "../controllers/collection";

const router: Router = express.Router();

// Public Routes
router.route("/list").get(getCollections);
router.route("/:collection_slug").get(getCollection);

export default router;

import express, { Router } from "express";
import { searchByQuery, searchByFilter } from "../controllers/machine";

const router: Router = express.Router();

// Public Routes
router.route("/search").get(searchByQuery);
router.route("/filter").post(searchByFilter);

export default router;

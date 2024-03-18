import express, { Router } from "express";
import { search } from "../controllers/machine";

const router: Router = express.Router();

// Public Routes
router.route('/search').get(search);
router.route('/search').post(search);
router.route('/list/running').get();
router.route('/list/templates').get();
router.route('/instances/start/:id').post();
router.route('/instances/delete/:id').delete();

export default router;

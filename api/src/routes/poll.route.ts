import express from "express";
import {
    createPoll, getPolls, getSinglePoll, endPoll,
} from "../controllers/poll.controller";
import { protectAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", protectAdmin, createPoll);
router.get("/", getPolls);
router.get("/:id", getSinglePoll);
router.patch("/:id/end", protectAdmin, endPoll);

export default router;
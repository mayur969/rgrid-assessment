import express from "express";
import { votePoll } from "../controllers/vote.controller";

const router = express.Router();

router.post("/", votePoll);

export default router;
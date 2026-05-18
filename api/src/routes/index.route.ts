import { Router } from "express";
import adminRoute from "./admin.route"
import pollRoute from "./poll.route"
import voteRoute from "./vote.route"

const router = Router();

router.use("/admin", adminRoute)
router.use("/polls", pollRoute)
router.use("/votes", voteRoute)

export default router;
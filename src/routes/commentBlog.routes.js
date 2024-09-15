import { Router } from "express";
import {} from // getVideoComments,
// addComment,
// updateComment,
// deleteComment
"../controllers/commentBlog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

export default router;

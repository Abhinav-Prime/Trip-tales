import { Router } from "express";
import {
    // getVideoComments, 
    // addComment, 
    // updateComment,
    // deleteComment
} from "../controllers/commentVideo.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

export default router


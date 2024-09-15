import { Router } from 'express';
import {
    addVideoToWatchLater,
    getWatchLaterVideos,
    removeVideoFromWatchLater
   
} from "../controllers/watchLater.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// Route to add a video to Watch Later
router.route("/add/:videoId").post(addVideoToWatchLater);

// Route to get all videos in Watch Later
router.route("/get-videos").get(getWatchLaterVideos);

// Route to remove a video from Watch Later
router.route("/remove/:videoId").patch(removeVideoFromWatchLater);

export default router;

import { Router } from "express";
import {
    followUser,
    unfollowUser,
    getUserFollowers,
    getUserFollowing,
    removeAllFollowers,
    removeAllFollowing
} from "../controllers/follower.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

// Route to follow a user
router.route("/follow/:userId").post(followUser);

// Route to unfollow a user
router.route("/unfollow/:userId").delete(unfollowUser);

// Route to get followers of a user
router.route("/:userId/followers").get(getUserFollowers);

// Route to get the users a user is following
router.route("/:userId/following").get(getUserFollowing);

// Route to remove all followers of the authenticated user
router.route("/removeAllFollowers").delete(removeAllFollowers);

// Route to remove all users the authenticated user is following
router.route("/removeAllFollowing").delete(removeAllFollowing);

export default router;

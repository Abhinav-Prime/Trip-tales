import { Router } from 'express';
import { 
    sendMessage, 
    getMessages, 
    getConversations 
} from "../controllers/message.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT);

router.get("/conversations", getConversations);
router.get("/:otherUserId",getMessages);
router.post("/sendMessage", sendMessage);

export default router;
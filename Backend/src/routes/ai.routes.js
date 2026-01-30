import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createConversationNotebook,
  deleteConversations,
  getUserConversations,
} from "../controllers/ai.controller.js";

const router = Router();

router
  .route("/conversation/create")
  .post(verifyJWT, createConversationNotebook);

router.route("/conversation/get").get(verifyJWT, getUserConversations);

router.route("/conversation/delete/:id").delete(verifyJWT, deleteConversations);

export default router;

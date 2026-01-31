import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  checkConversationConnection,
  connectConversation,
  createConversationNotebook,
  deleteConversations,
  disconnectConversation,
  getConversationById,
  getUserConversations,
  updateConversationSources,
  updateConversationTitle,
} from "../controllers/ai.controller.js";

const router = Router();

router
  .route("/conversation/create")
  .post(verifyJWT, createConversationNotebook);

router.route("/conversation/get").get(verifyJWT, getUserConversations);

router.route("/conversation/get/:id").get(verifyJWT, getConversationById);

router
  .route("/conversation/:id/update-sources")
  .put(verifyJWT, updateConversationSources);

router
  .route("/conversation/:id/update-title")
  .put(verifyJWT, updateConversationTitle);

router.route("/conversation/delete/:id").delete(verifyJWT, deleteConversations);

router.route("/conversation/:id/connect").post(verifyJWT, connectConversation);
router
  .route("/conversation/:id/checkConnection")
  .get(verifyJWT, checkConversationConnection);
router
  .route("/conversation/:id/disconnect")
  .post(verifyJWT, disconnectConversation);

export default router;

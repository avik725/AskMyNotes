import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPrivateNotes } from "../controllers/privateNotes.controller.js";

const router = new Router();

router.route("/create-private-notes").post(verifyJWT, createPrivateNotes);

export default router;

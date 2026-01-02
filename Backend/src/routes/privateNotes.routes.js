import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPrivateNotes,
  getPrivateNotes,
  updatePrivateNotes,
} from "../controllers/privateNotes.controller.js";

const router = new Router();

router.route("/create-private-notes").post(verifyJWT, createPrivateNotes);
router.route("/get-private-notes").get(verifyJWT, getPrivateNotes);
router.route("/update-private-notes").post(verifyJWT, updatePrivateNotes);

export default router;

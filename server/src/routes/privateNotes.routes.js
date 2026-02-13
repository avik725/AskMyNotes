import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPrivateNotes,
  deletePrivateNotes,
  getPrivateNotes,
  updatePrivateNotes,
} from "../controllers/privateNotes.controller.js";

const router = new Router();

router.route("/create").post(verifyJWT, createPrivateNotes);
router.route("/get").get(verifyJWT, getPrivateNotes);
router.route("/update").post(verifyJWT, updatePrivateNotes);
router.route("/delete/:id").delete(verifyJWT, deletePrivateNotes);

export default router;

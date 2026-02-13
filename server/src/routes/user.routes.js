import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  checkUsernameIfAvailable,
  forgotPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserDetails,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("profile_pic"), registerUser);

router.route("/login").post(loginUser);

router.route("/forgot-password").post(forgotPassword);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/getCurrentUser").get(verifyJWT, getCurrentUser);

router
  .route("/update-profile")
  .post(verifyJWT, upload.single("profile_pic"), updateUserDetails);

router
  .route("/checkUsernameIfAvailable/:username")
  .get(checkUsernameIfAvailable);

export default router;

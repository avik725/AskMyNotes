import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getFiltersData,
  getMyUploads,
  getNotes,
  getFeaturesNotes,
  uploadNotes,
  getStreams,
  getCourses,
  getStreamWiseNotes,
} from "../controllers/notes.controller.js";

const router = Router();

router
  .route("/upload-notes")
  .post(
    verifyJWT,
    upload.fields([{ name: "thumbnail" }, { name: "notes_file" }]),
    uploadNotes
  );

router.route("/get-my-uploads").get(verifyJWT, getMyUploads);

router.route("/get-notes").get(getNotes);

router.route("/get-streams").get(getStreams);

router.route("/get-courses").get(getCourses);

router.route("/get-featured-notes").get(getFeaturesNotes);

router.route("/get_filters").get(getFiltersData);

router.route("/get-stream-wise-notes").get(getStreamWiseNotes);

export default router;

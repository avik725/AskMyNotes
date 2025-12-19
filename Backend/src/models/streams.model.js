import mongoose from "mongoose";
import { Course } from "../models/courses.model.js";

const streamSchema = new mongoose.Schema({
  name: String,
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

export const Stream = mongoose.model("Stream", streamSchema);

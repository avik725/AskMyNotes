import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: String,
  level: String,
  semesters: Number,
  years: Number,
});

export const Course = mongoose.model("Course", courseSchema);

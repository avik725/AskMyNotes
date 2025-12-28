import mongoose, { Aggregate } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const notesSchema = new mongoose.Schema(
  {
    file_url: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    stream: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stream",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    semester: {
      type: Number,
    },
    description: {
      type: String,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

notesSchema.plugin(mongooseAggregatePaginate);
notesSchema.plugin(mongoosePaginate);

export const Notes = mongoose.model("Notes", notesSchema, "notes");

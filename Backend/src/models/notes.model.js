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

// Find Middleware (is_deleted = false)
notesSchema.pre(/^find/, function (next) {
  if (!this.getOptions().withDeleted) {
    this.where({ is_deleted: false });
  }
  next();
});

// Custom Query To get Deleted Records
notesSchema.query.withDeleted = function () {
  return this.setOptions({ withDeleted: true });
};

// SoftDelete Method (Static)
notesSchema.statics.softDeleteById = function (id) {
  return this.updateOne(
    { _id: id, is_deleted: false },
    {
      $set: {
        is_deleted: true,
        deleted_at: new Date(),
      },
    }
  );
};

export const Notes = mongoose.model("Notes", notesSchema, "notes");

import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoosePaginate from "mongoose-paginate-v2";

const privateNotesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "pkm", // Personal Knowledge Management
        "study", // Study / Exam notes
        "thought", // Brain dump / thoughts
        "task", // Todo / task notes
        "project", // Project-specific notes
        "journal", // Diary / journal
        "memory", // AI memory notes
        "other",
      ],
      required: true,
    },
    contentJson: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    contentText: {
      type: String,
      required: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
      index: true,
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

privateNotesSchema.index({ owner: 1, is_deleted: 1 });
privateNotesSchema.index({ owner: 1, createdAt: -1 });

privateNotesSchema.plugin(mongooseAggregatePaginate);
privateNotesSchema.plugin(mongoosePaginate);

// Find Middleware (is_deleted = false)
privateNotesSchema.pre(/^find/, function (next) {
  if (!this.getOptions().withDeleted) {
    this.where({ is_deleted: false });
  }
  next();
});

// Custom Query To get Deleted Records
privateNotesSchema.query.withDeleted = function () {
  return this.setOptions({ withDeleted: true });
};

// SoftDelete Method (Static)
privateNotesSchema.statics.softDeleteById = function (id) {
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

export const PrivateNotes = mongoose.model(
  "PrivateNotes",
  privateNotesSchema,
  "private_notes"
);

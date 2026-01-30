import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "Untitled Notebook",
    },

    summary: {
      type: String,
      default: "",
    },
    allowed_sources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notes",
      },
    ],
    private_notes_allowed: {
      type: Boolean,
      default: false,
    },
    last_message_at: {
      type: Date,
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
  { timestamps: true }
);

//Find Middleware (is_deleted = false)
conversationSchema.pre(/^find/, function (next) {
  if (!this.getOptions().withDeleted) {
    this.where({ is_deleted: false });
  }
  next();
});

// Custom Query To get Deleted Records
conversationSchema.query.withDeleted = function () {
  return this.setOptions({ withDeleted: true });
};

// SoftDelete Method (Static)
conversationSchema.statics.softDeleteById = function (id) {
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

conversationSchema.index({ user_id: 1, last_message_at: -1 });

export const Conversations = mongoose.model(
  "Conversations",
  conversationSchema,
  "conversations"
);

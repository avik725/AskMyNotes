import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    coversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

messageSchema.index({ coversation_id: 1, createdAt: -1 });

export const Messages =  mongoose.model("Message", messageSchema, "messages");

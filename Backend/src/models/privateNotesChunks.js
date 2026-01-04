import mongoose from "mongoose";

const privateNotesChunksSchema = new mongoose.Schema(
  {
    note_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PrivateNotes",
      required: true,
      index: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    chunk_index: {
      type: Number,
      required: true,
    },

    chunk_text: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number], // vector embeddings
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

privateNotesChunksSchema.index({ owner: 1, is_deleted: 1 });
privateNotesChunksSchema.index({ note_id: 1, chunk_index: 1 });

export const PrivateNotesChunks = mongoose.model(
  "PrivateNotesChunks",
  privateNotesChunksSchema,
  "private_notes_chunks"
);

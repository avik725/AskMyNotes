import mongoose, { Schema } from "mongoose";


const notesChunksSchema = new Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        note_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notes",
            required: true,
            index: true
        },

        chunk_text: {
            type: String,
            required: true
        },

        chunk_index: {
            type: Number,
            required: true,
        },

        embedding: {
            type: [Number],
            required: true
        }
    },
    {
        timestamps: true,
    }
)

privateNotesChunksSchema.index({ owner: 1, is_deleted: 1 });
privateNotesChunksSchema.index({ note_id: 1, chunk_index: 1 });


export const NotesChunks = mongoose.model("NotesChunk", notesChunksSchema, "notes_chunks")
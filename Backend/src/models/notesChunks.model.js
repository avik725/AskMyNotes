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

        text: {
            type: String,
            required: true
        },

        chunk_index: {
            type: Number,
            required: true,
        },

        vectorEmbeddings: {
            type: [Number],
            required: true
        }
    },
    {
        timestamps: true,
    }
)



export const NotesChunks = mongoose.model("NotesChunk", notesChunksSchema, "notes_chunks")
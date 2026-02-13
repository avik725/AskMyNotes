import { Worker } from "bullmq";
import { QUEUE_NAMES } from "../constants.js";
import redisConnection from "../config/redis.js";
import { generateEmbeddings } from "../services/embedding.service.js";

export const embeddingWorker = new Worker(
  QUEUE_NAMES.EMBEDDING,
  async (job) => {
    console.log(`[EmbeddingWorker] Processing job ${job.id} for note: ${job.data.note_id}`);
    const { note_id, user_id, notes_file_url } = job.data;

    try {
      await generateEmbeddings({ note_id, user_id, notes_file_url });
      return { success: true, note_id };
    } catch (error) {
      console.error(`[EmbeddingWorker] Job ${job.id} failed:`, error.message);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 2,
  }
);

embeddingWorker.on("completed", (job) => {
  console.log(`[EmbeddingWorker] Job ${job.id} has been completed`);
});

embeddingWorker.on("failed", (job, err) => {
  console.error(`[EmbeddingWorker] Job ${job?.id} has failed with error: ${err.message}`);
});

embeddingWorker.on("error", (err) => {
  console.error("[EmbeddingWorker] Worker error:", err);
});

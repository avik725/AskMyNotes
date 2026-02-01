import { Worker } from "bullmq";
import { QUEUE_NAMES } from "../constants.js";
import redisConnection from "../config/redis.js";
import { generateEmbeddings } from "../services/embedding.service.js";

export const embeddingWorker = new Worker(
  QUEUE_NAMES.EMBEDDING,
  async (job) => {
    console.log(`[Worker] Processing job ${job.id} for note: ${job.data.note_id}`);
    const { note_id, user_id, notes_file_url } = job.data;

    try {
      await generateEmbeddings({ note_id, user_id, notes_file_url });
      console.log(`[Worker] Job ${job.id} completed successfully`);
      return { success: true, note_id };
    } catch (error) {
      console.error(`[Worker] Job ${job.id} failed:`, error.message);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 2,
  }
);

embeddingWorker.on("completed", (job) => {
  console.log(`[Worker] Job ${job.id} has been completed`);
});

embeddingWorker.on("failed", (job, err) => {
  console.error(`[Worker] Job ${job?.id} has failed with error: ${err.message}`);
});

embeddingWorker.on("error", (err) => {
  console.error("[Worker] Worker error:", err);
});

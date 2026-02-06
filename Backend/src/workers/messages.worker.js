import { Worker } from "bullmq";
import { QUEUE_NAMES } from "../constants.js";
import { storeMessages } from "../services/chat.service.js";
import redisConnection from "../config/redis.js";

export const messagesWorker = new Worker(
  QUEUE_NAMES.MESSAGES,
  async (job) => {
    const { conversation_id, role, content } = job.data;

    try {
      await storeMessages({
        conversation_id,
        role,
        content,
      });
      return { success: true, conversation_id };
    } catch (error) {
      console.error(`[MessagesWorker] Job ${job.id} failed:`, error.message);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 2,
  }
);

messagesWorker.on("completed", (job) => {
  console.log(`[MessagesWorker] Job ${job.id} has been completed`);
});

messagesWorker.on("failed", (job, err) => {
  console.error(
    `[MessagesWorker] Job ${job?.id} has failed with error: ${err.message}`
  );
});

messagesWorker.on("error", (err) => {
  console.error("[MessagesWorker] Worker error:", err);
});

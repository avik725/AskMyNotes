import { Queue, QueueEvents } from "bullmq";
import { QUEUE_NAMES } from "../constants.js";
import redisConnection from "../config/redis.js";

export const embeddingQueue = new Queue(QUEUE_NAMES.EMBEDDING, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, // Retry 3 times on failure
    backoff: {
      type: "exponential",
      delay: 1000, // Start with 1s delay, then 2s, 4s...
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

const embeddingQueueEvents = new QueueEvents(QUEUE_NAMES.EMBEDDING, {
  connection: redisConnection.duplicate(),
});

embeddingQueueEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log(`[Queue] Job ${jobId} completed:`, returnvalue);
});

embeddingQueueEvents.on("failed", ({ jobId, failedReason }) => {
  console.error(`[Queue] Job ${jobId} failed: ${failedReason}`);
});

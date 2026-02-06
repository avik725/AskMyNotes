import { Queue, QueueEvents } from "bullmq";
import { QUEUE_NAMES } from "../constants.js";
import redisConnection from "../config/redis.js";

export const messagesQueue = new Queue(QUEUE_NAMES.MESSAGES, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: 100,
  },
});

const messagesQueueEvents = new QueueEvents(QUEUE_NAMES.MESSAGES, {
  connection: redisConnection.duplicate(),
});

messagesQueueEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log(`[Message Queue] Job ${jobId} completed:`, returnvalue);
});

messagesQueueEvents.on("failed", (jobId, failedReason) => {
  console.log(`[Message Queue] Job ${jobId} failed:`, failedReason);
});

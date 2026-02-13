import "../config/redis.js";
import connectDB from "../databases/index.js";
import { embeddingWorker } from "./embedding.worker.js";
import { messagesWorker } from "./messages.worker.js";

connectDB()
    .then(() => {
        console.log("🚀 Workers started and listening for jobs...");
        console.log(`   - Embedding Worker: ${embeddingWorker.name}`);
        console.log(`   - Messages Worker: ${messagesWorker.name}`);
    })
    .catch((error) => {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1);
    });

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down workers gracefully...`);

    await embeddingWorker.close();
    await messagesWorker.close();
    console.log("All workers closed.");

    process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
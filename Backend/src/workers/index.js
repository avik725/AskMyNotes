// Worker runner script - Run this separately from main server
// Usage: node -r dotenv/config src/workers/index.js

import "../config/redis.js"; // Initialize Redis connection
import connectDB from "../databases/index.js"; // MongoDB connection
import { embeddingWorker } from "./embedding.worker.js";

// Connect to MongoDB before starting workers
connectDB()
    .then(() => {
        console.log("🚀 Workers started and listening for jobs...");
        console.log(`   - Embedding Worker: ${embeddingWorker.name}`);
    })
    .catch((error) => {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1);
    });

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down workers gracefully...`);

    await embeddingWorker.close();
    console.log("All workers closed.");

    process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
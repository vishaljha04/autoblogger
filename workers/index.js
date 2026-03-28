import "./blogWorker.js";
import "./imageWorker.js";
import "./publishWorker.js";

console.log("[Workers] All workers started successfully");
console.log("[Workers] Listening for jobs on queues: blog-generation, image-generation, publishing");

process.on("SIGTERM", async () => {
  console.log("[Workers] Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("[Workers] Shutting down...");
  process.exit(0);
});

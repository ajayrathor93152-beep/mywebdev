import mongoose from "mongoose";

mongoose.set("strictQuery", true);

export async function connectDB(uri) {
  mongoose.connection.on("disconnected", () => console.warn("[db] disconnected"));
  mongoose.connection.on("reconnected", () => console.info("[db] reconnected"));

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
  console.info(`[db] connected → ${mongoose.connection.name}`);
}

export async function disconnectDB() {
  await mongoose.connection.close();
}

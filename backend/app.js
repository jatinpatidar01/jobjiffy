import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import bookingRoutes from "./routes/booking.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import jobRoutes from "./routes/jobRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Socket.io setup
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] , credentials: true},
});


global.io = io; // globally accessible socket instance
global.onlineProviders = {}; // store connected providers


io.on("connection", (socket) => {
  console.log("✅ Provider registered list:", global.onlineProviders);
  console.log("🟢 New socket connected:", socket.id);
  // Provider registers themselves
  socket.on("registerProvider", (providerId) => {
    global.onlineProviders[providerId] = socket.id;
    
    console.log(`✅ Provider ${providerId} is online`);
  });

  // Clean up when disconnected
  socket.on("disconnect", () => {
    for (let id in global.onlineProviders) {
      if (global.onlineProviders[id] === socket.id) delete global.onlineProviders[id];
    }
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
// app.use("/jobs", jobRoutes);
app.use("/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { dbName: "jobjiffy" })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });

export { io };

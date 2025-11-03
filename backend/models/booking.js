import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  name: String,
  phone: String,
  address: String,
  date: String,
  time: String,
  message: String,
  status: { type: String, default: "pending" } // pending | accepted | rejected
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);

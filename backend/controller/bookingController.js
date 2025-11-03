import Booking from "../models/booking.js";

export const createBooking = async (req, res) => {
  try {
    const { userId, providerId, category, name, phone, address, date, time, message } = req.body;

    if (!userId || !providerId || !category || !name || !phone || !address) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // 🗂️ Create booking entry in DB
    const booking = new Booking({
      userId,
      providerId,
      category,
      name,
      phone,
      address,
      date,
      time,
      message,
      status: "pending"
    });
    await booking.save();

    // 📩 If provider is online — send real-time popup
    const socketId = global.onlineProviders?.[providerId];
    if (socketId) {
      global.io.to(socketId).emit("newBooking", {
        message: "📬 New booking request!",
        booking
      });
    }

    res.status(200).json({ message: "Booking created successfully", booking });
  } catch (err) {
    console.error("❌ Booking creation error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
export const PendingBookings = async (req, res) => {
  try {
    const { userId } = req.query; // ya req.params, jaisa tu bhej rahi ho frontend se

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID required" });
    }

    const bookings = await Booking.find({ userId, status: "pending" })
      .populate("userId", "name email phone")
      .populate("providerId", "name serviceType");

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("❌ Error fetching pending bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const AcceptedBookings = async (req, res) => {
  try {
    const { userId } = req.query; // ya req.params, jaisa tu bhej rahi ho frontend se

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID required" });
    }

    const bookings = await Booking.find({ userId, status: "accepted" })
      .populate("userId", "name email phone")
      .populate("providerId", "name serviceType");

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("❌ Error fetching accepted bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const accept = async (req, res) => {
  try {
    const { bookingId } = req.body; 
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    } 
    booking.status = "accepted";
    await booking.save();
    res.json({ success: true, message: "Booking accepted", booking });
  } catch (error) {
    console.error("❌ Error accepting booking:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const reject = async (req, res) => {
  try {
    const { bookingId } = req.body; 
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    } 
    booking.status = "rejected";  
    await booking.save();
    res.json({ success: true, message: "Booking rejected", booking });
  } catch (error) {
    console.error("❌ Error rejecting booking:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


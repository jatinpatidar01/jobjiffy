import User from "../models/User.js";
import mongoose from "mongoose";

export const getProvidersByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    console.log("👉 Category received:", category);

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    const providers = await User.find({
      role: "provider",
      skills: { $regex: new RegExp(category, "i") } // case-insensitive
    }).select("-passwordHash");

    console.log("✅ Providers found:", providers.length);

    res.json({ providers });
  } catch (err) {
    console.error("❌ Error fetching providers:", err);
    res.status(500).json({ error: "Server error" });
  }
};
export const finduserById = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate ObjectId to avoid CastError 500s
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    // Exclude sensitive fields like passwordHash
    const user = await User.findById(id).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("❌ Error finding user:", err);
    res.status(500).json({ error: "Server error" });
  }
};


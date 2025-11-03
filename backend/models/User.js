import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["customer", "provider"],
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    // 👇 Only for providers
    skills: {
      type: [String],
      enum: [
        "Plumber",
        "Carpenter",
        "Electrician",
        "Mechanic",
        "Tailor",
        "Washer",
      ],
      default: [],
    },

    experience: {
      type: String, // e.g. "3 years", "6 months"
      default: "",
    },

    price: {
      type: Number, // per hour or per service — you can decide
      default: 0,
    },

    bio: {
      type: String, // short description about provider
      trim: true,
      maxlength: 300,
      default: "",
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
  },
  { timestamps: true }
);

// Geo Index (for “find nearby provider” feature)
userSchema.index({ location: "2dsphere" });

export default mongoose.model("User", userSchema);

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Session from "../models/session.js";

export const register = async (req, res) => {
  try {
    const { name, phone, password, role, skills, location } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      passwordHash: hash, 
      role,
      skills,
      location
    });

    res.status(201).json(user);
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } 
    );

    res.json({
    message: "Login successful",
    token,
    role: user.role, // 👈 Add this line
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
    },
  });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// export const refresh = async (req, res) => {
//   const { refreshToken } = req.body;
//   try {
//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//     const session = await Session.findOne({ userId: decoded.id });
//     if (!session) return res.status(401).json({ error: "Invalid session" });

//     const { accessToken, refreshToken: newRefresh, refreshHash, exp } = generateTokens(decoded);
//     session.refreshTokenHash = refreshHash;
//     session.expiresAt = exp;
//     await session.save();

//     res.json({ accessToken, refreshToken: newRefresh });
//   } catch {
//     res.status(401).json({ error: "Invalid refresh token" });
//   }
// };
import { Router } from "express";
import { register, login } from "../controller/AuthController.js";

const r = Router();
r.post("/register", register);
r.post("/login", login);
r.post("/logout", (req, res) => {
  try {
    // Simply clear the token from client side — backend doesn't track it
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
});

export default r;
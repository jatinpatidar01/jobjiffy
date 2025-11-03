import { Router } from "express";
import { getProvidersByCategory, finduserById } from "../controller/UserController.js";
import { requireAuth } from "../middlewares/auth.js";

const r = Router();
r.get("/providers", requireAuth, getProvidersByCategory);
r.get("/:id", finduserById);



export default r;
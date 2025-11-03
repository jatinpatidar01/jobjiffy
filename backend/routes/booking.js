import express from "express";
import { createBooking, PendingBookings, AcceptedBookings, accept, reject} from "../controller/bookingController.js";

const router = express.Router();

router.post("/book", createBooking);
router.get("/pending-bookings", PendingBookings);
router.get("/accepted-bookings", AcceptedBookings);
router.post("/accept", accept);
router.post("/reject", reject);

export default router;

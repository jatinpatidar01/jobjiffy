import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import "./ProviderDashboard.css";
import axios from "axios";



const ProviderDashboard = () => {
    const socket = io("http://localhost:5000", {
        transports: ["websocket", "polling"],
    });


    const providerId = localStorage.getItem("providerId"); // 👈 set at login
    console.log("🚀 Provider ID:", providerId);
    const [booking, setBooking] = useState(null);

    socket.emit("registerProvider", providerId);
    

    // Listen for new bookings
    socket.on("newBooking", (data) => {
      console.log("📦 New booking received:", data);
      setBooking(data.booking);

      toast.info(`📢 New booking from ${data.booking.name}`, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    });

  const handleAccept = () => {
    toast.success("✅ Booking accepted!");
    setBooking(null);
    axios.post("http://localhost:5000/bookings/accept", {
      bookingId: booking._id,
    }).then((res) => {
      console.log("Booking accepted response:", res.data);
    }).catch((err) => {
      console.error("Error accepting booking:", err);
    });
  };

  const handleReject = () => {
    toast.error("❌ Booking rejected!");
    setBooking(null);
    // Optionally: send response to backend
  };

  return (
    <div className="provider-dashboard">
      <h1>Welcome Provider 👷</h1>
      <p>Waiting for new booking requests...</p>

      {/* Popup Modal */}
      {booking && (
        <div className="booking-popup">
          <div className="popup-content">
            <h3>📩 New Booking Request</h3>
            <p><strong>Name:</strong> {booking.name}</p>
            <p><strong>Phone:</strong> {booking.phone}</p>
            <p><strong>Address:</strong> {booking.address}</p>
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Time:</strong> {booking.time}</p>

            <div className="popup-actions">
              <button className="accept-btn" onClick={handleAccept}>Accept</button>
              <button className="reject-btn" onClick={handleReject}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;

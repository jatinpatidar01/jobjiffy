import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./BookService.css";

const BookService = () => {
  const { serviceType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 🧠 Suppose you passed providerId from previous page (like /book/:serviceType?providerId=123)
  const queryParams = new URLSearchParams(location.search);
  const selectedProviderId = queryParams.get("providerId");

  // 🧑‍💻 Suppose your logged-in userId is stored in localStorage
  const currentUserId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    date: "",
    time: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  // 🖊️ Update form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📩 Handle booking submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Booking form submitted with data:", location.state?.provider);
      localStorage.setItem("providerId", location.state?.provider._id);
      const bookingData = {
        userId: localStorage.getItem("userId"),
        providerId: location.state?.provider._id, // depends how you pass it
        category: location.state?.provider.skills[0], // or from provider object
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        date: formData.date,
        time: formData.time,
        message: formData.message,
      };

      console.log("Sending booking request:", bookingData);

      const res = await axios.post("http://localhost:5000/bookings/book", bookingData);
      console.log("✅ Booking success:", res.data);
      toast.success("Booking request sent!");
    } catch (err) {
      console.error("❌ Error booking service:", err);
      toast.error("Booking failed!");
    }
  };

  return (
    <div className="booking-form-container">
      <ToastContainer />

      <div className="booking-header">
        <h2>Book a {serviceType}</h2>
        <p>Fill out the form to book a professional {serviceType} service.</p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Preferred Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Preferred Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Additional Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Booking..." : "Book Now"}
        </button>
      </form>
    </div>
  );
};

export default BookService;

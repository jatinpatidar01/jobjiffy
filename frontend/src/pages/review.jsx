import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";  // Import loader
import "./Reviews.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ username: "", rating: 5, comment: "" });
  const [loading, setLoading] = useState(false);

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/reviews"); // Replace with your API URL
      setReviews(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/reviews", form);
      setReviews([res.data, ...reviews]); // Add new review at top
      setForm({ username: "", rating: 5, comment: "" }); // Reset form
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <div className="reviews-container">
      <h2>Customer Reviews</h2>

      {/* Review form */}
      <form className="review-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Your Name"
          value={form.username}
          onChange={handleChange}
          required
        />
        <select name="rating" value={form.rating} onChange={handleChange}>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <textarea
          name="comment"
          placeholder="Your Review"
          value={form.comment}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Review</button>
      </form>

      {/* Loader or Reviews List */}
      {loading ? (
        <Loader />
      ) : reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet.</p>
      ) : (
        <ul className="review-list">
          {reviews.map((review) => (
            <li key={review._id || review.id} className="review-card">
              <div className="review-header">
                <span className="review-username">{review.username}</span>
                <span className="review-rating">
                  {"⭐".repeat(review.rating)}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reviews;

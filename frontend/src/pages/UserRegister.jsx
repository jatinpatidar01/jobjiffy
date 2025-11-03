import React, { useState } from "react";
import "./UserRegister.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
    skill: "",
    experience: "",
    bio: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, email, phone, password, role, skill, experience, bio, price } = formData;

    if (!fullname || !email || !phone || !password || !role) {
      toast.error("All required fields must be filled");
      return;
    }

    // Extra validation for provider
    if (role === "provider" && (!skill || !experience || !bio || !price)) {
      toast.error("Please fill all provider details");
      return;
    }

    try {
      setLoading(true);
      // Build payload to match backend `User` model and auth controller expectations.
      // Backend expects `name`, `phone`, `password`, `role`, and for providers `skills` (array), experience, bio, price
      const mapSkill = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s);

      const payload = {
        name: fullname,
        email,
        phone,
        password,
        role,
      };

      if (role === "provider") {
        payload.skills = skill ? [mapSkill(skill)] : [];
        payload.experience = experience;
        payload.bio = bio;
        payload.price = price ? Number(price) : 0;
      }

      // backend auth route for registration is /auth/register
      const endpoint = "http://localhost:5000/auth/register";

      const res = await axios.post(endpoint, payload);

      toast.success("Registered successfully ✅");
      navigate("/home");
      console.log(res.data);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Error registering user";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-register-container">
      <ToastContainer />
      <div className="user-register-card">
        <h2 className="user-register-title">Create Your Account</h2>
        <p className="user-register-subtitle">Join JobJiffy</p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="customer">Customer</option>
            <option value="provider">Provider</option>
          </select>

          {/* 👇 Extra fields appear dynamically when role = provider */}
          {formData.role === "provider" && (
            <>
              <label>Skill</label>
              <select
                name="skill"
                value={formData.skill}
                onChange={handleChange}
                required
              >
                <option value="">Select Skill</option>
                <option value="plumber">Plumber</option>
                <option value="carpenter">Carpenter</option>
                <option value="mechanic">Mechanic</option>
                <option value="electrician">Electrician</option>
                <option value="tailor">Tailor</option>
                <option value="washer">Washer</option>
              </select>

              <label>Experience (in years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Enter your experience"
                required
              />

              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Short description about your work"
                rows="3"
                required
              />

              <label>Price (₹ per service)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter your service price"
                required
              />
            </>
          )}

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="login-link">Already have an account?</p>
        <div
          className="login-link"
          style={{
            cursor: "pointer",
            color: "white",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/")}
        >
          Login here
        </div>
      </div>
    </div>
  );
};

export default UserRegister;

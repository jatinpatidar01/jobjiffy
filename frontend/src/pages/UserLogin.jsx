import React, { useState } from "react";
import "./UserLogin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const UserLogin = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phone || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      // backend auth routes are mounted at /auth (see backend/app.js)
      const res = await axios.post("http://localhost:5000/auth/login", formData);
      console.log("Login response:", res.data.user);
        const token = res.data?.token;
        if (token) {
          // persist token for authenticated requests
          localStorage.setItem("token", token);
          if(res.data.role === "provider"){
            localStorage.setItem("providerId",  res.data.user.id);
          }
          else{
            localStorage.setItem("userId",  res.data.user.id);
          }
          localStorage.setItem("userName", res.data.user.name);
          localStorage.setItem("phone", res.data.user.phone);
          localStorage.setItem("email", res.data.user.email);

          // (optional) set default axios header for the session
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        toast.success("Login successful!");
        if (res.data.role === "provider") {
          navigate("/provider-dashboard");
        } else {
          navigate("/home");
        }

        console.log(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>LOGIN</h2>
        <div className="input-group">
          <label>phone</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="login-btn">Login</button>
        <a href="/register">Don't have an account? Register</a>
      </form>
    </div>
  );
};

export default UserLogin;

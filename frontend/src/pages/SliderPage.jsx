import React from "react";
import { useNavigate } from "react-router-dom";
import "./SliderPage.css";

const SliderPage = () => {
  const navigate = useNavigate();

  return (
    <div className="slider-container">
      <div className="slider-overlay">
        <h1 className="slider-title">Welcome to JOBJIFFY</h1>
        <p className="slider-subtitle">
          Choose your role to continue
        </p>

        <div className="button-group">
          <button className="slider-btn user-btn" onClick={() => navigate("/register/user")}>
            I'm a User
          </button>

          <button className="slider-btn provider-btn" onClick={() => navigate("/register/serviceprovider")}>
            I'm a Service Provider
          </button>
        </div>
      </div>
    </div>
  );
};

export default SliderPage;

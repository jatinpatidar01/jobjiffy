import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "./Home.css";
import About from "./About";
import ContactUs from "./ContactUs";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [activeTab, setActiveTab] = useState("weProvide");
  const [bookings, setBookings] = useState([]);
  const [showAccepted, setShowAccepted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
    const filteredBookings = bookings.filter((b) =>
      showAccepted ? b.status === "accepted" : b.status === "pending"
    );
  useEffect(() => {
    // Fetch user info
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`http://localhost:5000/users/${userId}`)
        .then((res) => setUserData(res.data.user))
        .catch(() => setUserData(null));
    }

    // Fetch bookings
    if(showAccepted){
      axios.get("http://localhost:5000/bookings/accepted-bookings",
        
      )
      .then((res) => {
        console.log("Fetched accepted bookings:", res.data);
        setBookings(res.data.bookings || []);
      })
      .catch(() => setBookings([]));
    }else{
    axios
      .get("http://localhost:5000/bookings/pending-bookings",
        {
          params: { userId: localStorage.getItem("userId") },
        }
      )
      .then((res) => {
        console.log("Fetched bookings:", res.data);
        setBookings(res.data.bookings || []);
      })
      .catch(() => setBookings([]));
    }
  }, []);

  const userName= localStorage.getItem("userName");
  const phone= localStorage.getItem("phone");
  const email= localStorage.getItem("email");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("phone");
    localStorage.removeItem("email");
    localStorage.removeItem("providerId");
    toast.info("👋 Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="app dark-theme" style={{ display: "flex" }}>
      {/* Left Sidebar Toggle */}
      <div
        style={{
          position: "fixed",
          top: "30px",
          left: "20px",
          color: "#fff",
          zIndex: 2000,
          cursor: "pointer",
        }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars size={24} />
      </div>

      {/* Right Profile Icon */}
      <div
        style={{
          position: "fixed",
          top: "25px",
          right: "25px",
          color: "#fff",
          cursor: "pointer",
          zIndex: 2000,
        }}
        onClick={() => setProfileOpen(!profileOpen)}
      >
        <FaUserCircle size={30} />
      </div>

      {/* Left Sidebar - Bookings */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            style={{
              width: "270px",
              background: "#111",
              color: "#fff",
              padding: "1rem",
              minHeight: "100vh",
              position: "fixed",
              top: 0,
              left: 0,
              boxShadow: "4px 0 10px rgba(0,0,0,0.5)",
              zIndex: 1500,
            }}
          >
            <h3 style={{ color: "#f5b50a", textAlign: "center" }}>
              Your Bookings
            </h3>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                margin: "10px 0",
              }}
            >
              <button
                onClick={() => setShowAccepted(false)}
                style={{
                  background: showAccepted ? "#333" : "#f5b50a",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                }}
              >
                Pending
              </button>
              <button
                onClick={() => setShowAccepted(true)}
                style={{
                  background: showAccepted ? "#f5b50a" : "#333",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                }}
              >
                Accepted
              </button>
            </div>

            {filteredBookings.length === 0 ? (
              <p style={{ textAlign: "center", color: "#aaa" }}>
                No bookings found.
              </p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {filteredBookings.map((b) => (
                  <li
                    key={b._id}
                    style={{
                      border: "1px solid #333",
                      marginBottom: "10px",
                      padding: "10px",
                      borderRadius: "8px",
                    }}
                  >
                    <div>
                      <strong>{b.category}</strong>
                    </div>
                    <div>
                      {b.name} — {b.date}, {b.time}
                    </div>
                    <div>
                      Status:{" "}
                      <span style={{ color: "#f5b50a" }}>{b.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Right Sidebar - Profile */}
      <AnimatePresence>
        {profileOpen && (
          <motion.aside
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ duration: 0.3 }}
            style={{
              width: "270px",
              background: "#111",
              color: "#fff",
              padding: "1.5rem",
              minHeight: "100vh",
              position: "fixed",
              top: 0,
              right: 0,
              boxShadow: "-4px 0 10px rgba(0,0,0,0.5)",
              zIndex: 1500,
              display: "flex",
              flexDirection: "column",
              // justifyContent: "space-between",
            }}
          >
            <div>
              <h3 style={{ color: "#f5b50a", textAlign: "center" }}>
                Profile Details
              </h3>
              <div
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  border: "1px solid #333",
                  borderRadius: "10px",
                  padding: "15px",
                }}
              >
                <FaUserCircle size={60} color="#f5b50a" />
                <h4 style={{ marginTop: "10px" }}>
                  {userName ? userName : "Guest User"}
                </h4>
                <p style={{ color: "#aaa", fontSize: "14px" }}>
                  {phone ? phone : "No phone available"}
                </p>
                <p style={{ color: "#aaa", fontSize: "14px" }}>
                  {email ? email : "No email available"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                background: "#f5b50a",
                border: "none",
                color: "#111",
                padding: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                marginTop: "40px",
              }}
            >
              Logout
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? "260px" : "0",
          marginRight: profileOpen ? "260px" : "0",
          transition: "margin 0.3s ease",
        }}
      >
        <nav className="navbar">
          <div className="logo">
            JOB<span>JIFFY</span>
          </div>
          <ul className="nav-links">
            <li><a className="nav" href="#header">Home</a></li>
            <li><a className="nav" href="#about">About Us</a></li>
            <li><a className="nav" href="#help">Help</a></li>
            <li><a className="nav" href="#contact">Contact Us</a></li>
          </ul>
        </nav>

        <header className="header" id="header">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            HIRE EXPERT SERVICES
          </motion.h1>
        </header>

        <main className="services">
          {["Electrician", "Plumber", "Carpenter", "Washer", "Tailor", "Mechanic"].map(
            (service) => (
              <div
                key={service}
                className={`service-card neon-card ${service.toLowerCase()}`}
                onClick={() => navigate(`/services/${service.toLowerCase()}`)}
              >
                <span className="service-text">{service}</span>
              </div>
            )
          )}
        </main>

        <div id="about"><About /></div>
        <div id="contact"><ContactUs /></div>
        <div id="footer"><Footer /></div>
      </div>
    </div>
  );
}

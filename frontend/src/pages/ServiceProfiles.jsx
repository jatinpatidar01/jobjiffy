import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ServiceProfiles.css";
import axios from "axios";
// import allData from "../data/serviceData.js"; // fallback local data

const ServiceProfiles = () => {
  const { serviceType } = useParams();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);
      try {
        // Capitalize only the first letter to match backend category format
        const category =
          serviceType.charAt(0).toUpperCase() + serviceType.slice(1).toLowerCase();

        const token = localStorage.getItem("token");

        // If user not logged in, use local fallback
        if (!token) {
          console.warn("No auth token found — using local data fallback");
          setProfiles(allData[serviceType] || []);
          setLoading(false);
          return;
        }
        console.log(`${encodeURIComponent(category)}`);
        // ✅ FIXED: removed quotes from query parameter (they broke the backend)
        const response = await axios.get(
          `https://jobjiffy-1.onrender.com/users/providers?category=${encodeURIComponent(
            category
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched profiles:", response.data);
        // ✅ Ensure backend response structure is handled properly
        setProfiles(response.data.providers || response.data || []);
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError("Failed to load profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [serviceType]);

  if (loading) return <p>Loading providers...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="pro-list">
      <h2>{serviceType.toUpperCase()} PROFILES</h2>
      <div className="pro-cards">
        {profiles.length > 0 ? (
          profiles.map((pro) => (
            <div className="pro-card" key={pro._id || pro.id}>
              <img
                src={pro.image || "/placeholder-profile.png"}
                alt={pro.name}
                className="pro-img"
              />
              <div className="pro-info">
                <h3>{pro.name}</h3>
                <p>
                  <strong>Skills:</strong>{" "}
                  {(pro.skills && pro.skills.join(", ")) || "N/A"}
                </p>
                <p>
                  <strong>Experience:</strong> {pro.experience || "N/A"}
                </p>
                <p>
                  <strong>Price:</strong>{" "}
                  {pro.price ? `₹ ${pro.price}` : "N/A"}
                </p>
                <p className="pro-desc">
                  {pro.bio || pro.description || "No description available"}
                </p>
                <button
                  className="book-btn"
                  onClick={() =>
                    navigate(`/services/${serviceType}/booking`, {
                      state: { provider: pro },
                    })
                  }
                >
                  Book Now
                </button>

              </div>
            </div>
          ))
        ) : (
          <p>No providers found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default ServiceProfiles;

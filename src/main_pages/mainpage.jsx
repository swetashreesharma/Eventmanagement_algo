import "../Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function MainPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* --- Hamburger Button --- */}
      <button
        className="hamburger-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>
    

      {/* --- Sidebar --- */}
      <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="datadiv">
        <div className="data" onClick={() => navigate("/dashboard")}>
          Dashboard
        </div>
        <br />
        <div className="data" onClick={() => navigate("/client")}>
          Client
        </div>
        <br />
        <div className="data" onClick={() => navigate("/projects")}>
          Project
        </div>
        <br />
        <div className="data" onClick={() => navigate("/profile")}>
          Profile
        </div><br />
        <div className="data" onClick={() => navigate("/state")}>
          State
        </div>
        </div>
      </div>

     
    </>
  );
}

export default MainPage;

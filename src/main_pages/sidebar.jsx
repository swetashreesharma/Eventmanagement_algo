import "../style/Login.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaHome, FaUsers, FaProjectDiagram, FaUserCircle } from "react-icons/fa";

function Sidebar({ onToggle }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".hamburger-btn")
      ) {
        setIsSidebarOpen(false);
        onToggle(false);
      }
    }

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen, onToggle]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    onToggle(!isSidebarOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
    onToggle(false);
  };

  return (
    <>
      {/* Hamburger stays always visible */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}
      >
        <div className="datadiv">
          <div
            className="data"
            onClick={() => handleNavigation("/dashboard")}
            title="Dashboard"
          >
            <FaHome className="menu-icon" />
            {isSidebarOpen && <span>Dashboard</span>}
          </div>

          <div
            className="data"
            onClick={() => handleNavigation("/client")}
            title="Client"
          >
            <FaUsers className="menu-icon" />
            {isSidebarOpen && <span>Client</span>}
          </div>

          <div
            className="data"
            onClick={() => handleNavigation("/projects")}
            title="Projects"
          >
            <FaProjectDiagram className="menu-icon" />
            {isSidebarOpen && <span>Projects</span>}
          </div>

          <div
            className="data"
            onClick={() => handleNavigation("/profile")}
            title="Profile"
          >
            <FaUserCircle className="menu-icon" />
            {isSidebarOpen && <span>Profile</span>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;

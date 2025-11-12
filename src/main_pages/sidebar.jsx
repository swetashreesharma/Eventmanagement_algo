import "../style/Login.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { LuLayoutDashboard, LuCircleUser, LuUsers } from "react-icons/lu";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import Logout from "../components/logout";

import { PiSignOutBold } from "react-icons/pi";

function Sidebar({ onToggle }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const logoutRef = useRef(null);

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
            <LuLayoutDashboard className="menu-icon" />
            {isSidebarOpen && <span>Dashboard</span>}
          </div>

          <div
            className="data"
            onClick={() => handleNavigation("/client")}
            title="Client"
          >
            <LuUsers className="menu-icon" />
            {isSidebarOpen && <span>Client</span>}
          </div>

          <div
            className="data"
            onClick={() => handleNavigation("/projects")}
            title="Projects"
          >
            <LiaProjectDiagramSolid className="menu-icon" />
            {isSidebarOpen && <span>Projects</span>}
          </div>

          <div
            className="data"
            onClick={() => handleNavigation("/profile")}
            title="Profile"
          >
            <LuCircleUser className="menu-icon" />
            {isSidebarOpen && <span>Profile</span>}
          </div>
        </div>

        <div
          className="logout-section"
          onClick={() => logoutRef.current.triggerLogout()}
          title="Logout"
        >
          <PiSignOutBold className="menu-icon" />
          {isSidebarOpen && <span>Logout</span>}
        </div>

        <Logout ref={logoutRef} />
      </div>
    </>
  );
}

export default Sidebar;

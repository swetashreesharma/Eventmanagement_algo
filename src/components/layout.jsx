import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../main_pages/sidebar.jsx";
import "../style/Login.css";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-container">
      <Sidebar onToggle={setSidebarOpen} />

      <div className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        <Outlet /> {/* this renders your nested route (Dashboard, Client, etc.) */}
      </div>
    </div>
  );
}

export default Layout;
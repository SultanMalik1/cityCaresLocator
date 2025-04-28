import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import styles from "./Sidebar.module.css";
import Logo from "./Logo";
import AppNav from "./AppNav";

function Sidebar() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div
      className={`${styles.sidebar} ${
        isSidebarCollapsed ? styles.collapsed : ""
      }`}
    >
      <Logo />
      <div>
        {isSidebarCollapsed ? (
          <button className={styles.expandButton} onClick={handleToggleSidebar}>
            Expand the Map
          </button>
        ) : (
          <button
            className={styles.collapseButton}
            onClick={handleToggleSidebar}
          >
            Collapse the Map
          </button>
        )}
      </div>
      <AppNav />
      <Outlet />
    </div>
  );
}

export default Sidebar;

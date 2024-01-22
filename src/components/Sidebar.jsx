import { Outlet } from "react-router-dom";
import styles from "./sidebar.module.css";
import Logo from "./Logo";
import AppNav from "./AppNav";
function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <footer className={styles.footer}>Copy right</footer>
    </div>
  );
}

export default Sidebar;

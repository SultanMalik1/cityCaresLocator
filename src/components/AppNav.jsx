import { NavLink } from "react-router-dom";
import styles from "./AppNav.module.css";

function AppNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="enterprises">Services & Bussinesses</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default AppNav;

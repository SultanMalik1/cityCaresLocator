import { useEffect } from "react";
import styles from "./Homepage.module.css";
import { Link } from "react-router-dom";
import { getData } from "../hooks/apiResources";
// import PageNav from "../components/PageNav";
export default function Homepage() {
  useEffect(function () {
    getData().then((data) => console.log(data));
  }, []);

  return (
    <main className={styles.homepage}>
      <section>
        <h1>
          CityCares <span className={styles.highlight}>Locator</span>
          <br></br>
        </h1>
        <h2>
          {}
          All resources for people in unstable housing situations in one place.
        </h2>
        <p>
          Explore this map for details on organizations aiding those in unstable
          housing. Easily find phone numbers, websites, descriptions, and
          locations. Search based on your specific needs to locate the right
          organization for assistance.
        </p>
        <Link to="/app/cities" className={styles.btn}>
          Search for organizations
        </Link>
      </section>
    </main>
  );
}

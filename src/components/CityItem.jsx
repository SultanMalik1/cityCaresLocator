// import { useCities } from "../contexts/CitiesContext";
// import styles from "./CityItem.module.css";
// import { Link } from "react-router-dom";

// const formatDate = (date) =>
//   new Intl.DateTimeFormat("en", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   }).format(new Date(date));

// function CityItem({ city }) {
//   const { currentCity, deleteCity } = useCities();
//   const { name, emoji, date, id, position, oneliner } = city;
//   function handleClick(e) {
//     e.preventDefault();
//     deleteCity(id);
//   }

//   return (
//     <li>
//       <Link
//         className={`${styles.cityItem} ${
//           id === currentCity.id ? styles["cityItem--active"] : ""
//         }`}
//         to={`${id}?lat=${position.lat}&lng=${position.lng}`}
//       >
//         <h3 className={styles.name}>{name}</h3>
//         <h3 className={styles.oneLiner}>{oneliner}</h3>

//         {/* code below deletes the data but it is commented out now */}
//         {/*
//         <button className={styles.deleteBtn} onClick={handleClick}>
//           x
//         </button> */}
//       </Link>
//     </li>
//   );
// }

// export default CityItem;

// ... (other imports)
import React, { useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import styles from "./CityItem.module.css";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  const {
    name,
    cityname,
    date,
    id,
    fivebasics,
    position,
    oneliner,
    notes,
    address,
    website,
  } = city;

  // State to manage expanded/collapsed state
  const [isExpanded, setExpanded] = useState(false);

  function handleToggleExpand() {
    setExpanded(!isExpanded);
  }

  function handleClick(e) {
    e.preventDefault();
    deleteCity(id);
  }

  return (
    <li>
      <div
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        onClick={handleToggleExpand}
      >
        <h3 className={styles.name}>{name}</h3>

        {!isExpanded && <p className={styles.oneliner}>{oneliner}</p>}

        {isExpanded && (
          <div className={styles.profileContainer}>
            <div className={styles.row}>
              <h6>Name</h6>
              <h3>{name}</h3>
            </div>

            <div className={styles.row}>
              <h6>{name}'s main focus</h6>
              <p>{fivebasics}</p>
            </div>

            {notes && (
              <div className={`${styles.row} ${styles.scrollableNotes}`}>
                <h6> About </h6>
                <p>{notes}</p>
              </div>
            )}

            <div className={styles.row}>
              <h6>{name}'s address </h6>
              <p>{address}</p>
            </div>

            <div className={styles.row}>
              <h6> Website </h6>

              <h6>
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {website}
                </a>
              </h6>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

export default CityItem;

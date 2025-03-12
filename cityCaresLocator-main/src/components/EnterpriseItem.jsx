import React, { useState } from "react";
import { useEnterprises } from "../contexts/EnterprisesContext";
import styles from "./EnterpriseItem.module.css";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function EnterpriseItem({ city }) {
  const { currentEnterprise, deleteCity } = useEnterprises();
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
    number,
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
          id === currentEnterprise.id ? styles["cityItem--active"] : ""
        }`}
        onClick={handleToggleExpand}
      >
        {!isExpanded && <h3 className={styles.name}>{name}</h3>}

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
              <h6> address </h6>
              <p>{address}</p>
            </div>

            <div className={styles.row}>
              <h6> phone number </h6>
              <p>{number}</p>
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

export default EnterpriseItem;

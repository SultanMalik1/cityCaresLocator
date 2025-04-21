import React from "react";
import { useEnterprises } from "../contexts/EnterprisesContext";
import styles from "./EnterpriseItem.module.css";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function EnterpriseItem({ city, isExpanded, onToggleExpand }) {
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
    propublica_url,
    guidestar_url,
  } = city;

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
        onClick={onToggleExpand}
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
              <h6> Website </h6>

              <h6>
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {website}
                </a>
              </h6>
            </div>
            <div>
              <h6>
                More Details (View in Private Mode for free)
              </h6>
              <h6>
                <a href ={guidestar_url} target ="_blank" rel="nonopener noreferrer">link</a>
              </h6>
            </div>
            <div>
              <h6>
                Revenue and Expense 
              </h6>
              <h6>
                <a href ={propublica_url} target ="_blank" rel="nonopener noreferrer">link</a>
              </h6>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

export default EnterpriseItem;

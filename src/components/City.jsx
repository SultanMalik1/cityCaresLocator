import { useParams } from "react-router-dom";
import styles from "./City.module.css";
import { useEffect } from "react";
import { useCities } from "../contexts/CitiesContext";
import Spinner from "./Spinner";
import BackButton from "./BackButton";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const { id } = useParams();

  const { getCity, currentCity, isLoading } = useCities();

  useEffect(
    function () {
      getCity(id);
    },
    [id]
  );

  const { name, date, notes, website, address } = currentCity;

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.row}>
        <h6>Name</h6>
        <h3>{name}</h3>
      </div>

      <div className={styles.row}>
        <h6>{name} was started on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6> About </h6>
          <p>{notes}</p>
        </div>
      )}
      <div className={styles.row}>
        <h6>{name}'s addres </h6>
        <p>{address}</p>
      </div>

      <div className={styles.row}>
        <h6> Website </h6>

        <h6>
          <a href={website} target="_blank" rel="noopener noreferrer">
            {website}.
          </a>
        </h6>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;

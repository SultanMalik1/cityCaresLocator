import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";
import { useState } from "react";

function CityList() {
  const { cities, isLoading, filterCities } = useCities();

  // State to store the search input
  const [searchInput, setSearchInput] = useState("");

  // Handler for updating the search input
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Filter cities based on search input
  const filteredCities = filterCities(searchInput);

  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Add your first business or service by clicking on the map plz" />
    );

  return (
    <div>
      {/* Search input field */}
      <input
        type="text"
        placeholder="Search by name, category or location"
        value={searchInput}
        onChange={handleSearchInputChange}
        className={styles.searchInput}
      />

      {/* Display filtered cities */}
      <ul className={styles.CityList}>
        {filteredCities.map((city) => (
          <CityItem city={city} key={city.id} />
        ))}
      </ul>
    </div>
  );
}

export default CityList;

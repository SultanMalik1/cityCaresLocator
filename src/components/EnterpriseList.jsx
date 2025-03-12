import EnterpriseItem from "./EnterpriseItem";
import styles from "./EnterpriseList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useEnterprises } from "../contexts/EnterprisesContext";
import { useState } from "react";

function EnterpriseList() {
  const { enterprises, isLoading, filterEnterprises } = useEnterprises();

  // State to store the search input
  const [searchInput, setSearchInput] = useState("");

  // Handler for updating the search input
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Filter enterprises based on search input
  const filteredCities = filterEnterprises(searchInput);

  if (isLoading) return <Spinner />;
  if (!enterprises.length)
    return (
      <Message message="Add your first business or service by clicking on the map plz" />
    );

  return (
    <div>
      {/* Search input field */}
      <input
        type="text"
        placeholder="Search for food, shelter, or jobs"
        value={searchInput}
        onChange={handleSearchInputChange}
        className={styles.searchInput}
      />

      {/* Display filtered enterprises */}
      <ul className={styles.CityList}>
        {filteredCities.map((city) => (
          <EnterpriseItem city={city} key={city.id} />
        ))}
      </ul>
    </div>
  );
}

export default EnterpriseList;

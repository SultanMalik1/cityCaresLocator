import { createContext, useState, useEffect, useContext } from "react";
import { getData } from "../hooks/apiResources";
import supabase from "../hooks/supabase";

const EnterprisesContext = createContext();

function CitiesProvider({ children }) {
  const [enterprises, setEnterprises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEnterprise, setcurrentEnterprise] = useState({});

  useEffect(() => {
    async function fetchEnterprises() {
      try {
        setIsLoading(true);

        // Replace the fetch call with getData
        const data = await getData();

        // Set the fetched data using the setEnterprises function
        setEnterprises(data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        alert("There was an error fetching data");
      } finally {
        setIsLoading(false);
      }
    }

    // Call the fetchEnterprises function when the component mounts
    fetchEnterprises();
  }, []);

  async function getEnterprise(id) {
    try {
      setIsLoading(true);
      const data = await getData();

      // Check if the city already exists in the array
      if (!enterprises.some((city) => city.id === data.id)) {
        setEnterprises((enterprises) => [...enterprises, data]); // Append only if it doesn't exist
      }

      setcurrentEnterprise(data);
    } catch (error) {
      console.error("Error getting city:", error.message);
      alert("There was an error getting city");
    } finally {
      setIsLoading(false);
    }
  }

  function filterEnterprises(searchInput) {
    return enterprises.filter(
      (item) =>
        item.name?.toLowerCase()?.includes(searchInput.toLowerCase()) ||
        item.onliner?.toLowerCase()?.includes(searchInput.toLowerCase()) ||
        (item.notes &&
          item.notes.toLowerCase().includes(searchInput.toLowerCase()))
    );
  }

  return (
    <EnterprisesContext.Provider
      value={{
        enterprises,
        isLoading,
        currentEnterprise,
        getEnterprise,
        filterEnterprises,
      }}
    >
      {children}
    </EnterprisesContext.Provider>
  );
}

function useEnterprises() {
  const context = useContext(EnterprisesContext);
  if (context === undefined)
    throw new Error("Cities Context was used outside the enterprises Provider");
  return context;
}

export { CitiesProvider, useEnterprises };

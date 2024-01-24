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

  // async function createCity(newCity) {
  //   try {
  //     setIsLoading(true);

  //     // Use Supabase API to insert data into the "organizations" table
  //     const { data, error } = await supabase
  //       .from("organizations")
  //       .upsert([newCity]);

  //     if (error) {
  //       throw new Error("Error creating city in Supabase");
  //     }

  //     // Update the local state with the new data
  //     setEnterprises((enterprises) => [...enterprises, data[0]]);
  //   } catch (error) {
  //     console.error("Error creating city:", error.message);
  //     alert("There was an error creating city");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // async function deleteCity(id) {
  //   try {
  //     setIsLoading(true);

  //     // Use Supabase API to delete a record from the "organizations" table
  //     const { data, error } = await supabase
  //       .from("organizations")
  //       .delete()
  //       .eq("id", id);

  //     if (error) {
  //       throw new Error("Error deleting city in Supabase");
  //     }

  //     // Update the local state by filtering out the deleted city
  //     setEnterprises((enterprises) =>
  //       enterprises.filter((city) => city.id !== id)
  //     );
  //   } catch (error) {
  //     console.error("Error deleting city:", error.message);
  //     alert("There was an error deleting city");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  function filterEnterprises(searchInput) {
    return enterprises.filter(
      (city) =>
        city.cityName?.toLowerCase()?.includes(searchInput.toLowerCase()) ||
        city.country?.toLowerCase()?.includes(searchInput.toLowerCase()) ||
        (city.notes &&
          city.notes.toLowerCase().includes(searchInput.toLowerCase()))
    );
  }

  return (
    <EnterprisesContext.Provider
      value={{
        enterprises,
        isLoading,
        currentEnterprise,
        getEnterprise,
        // createCity,
        // deleteCity,
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

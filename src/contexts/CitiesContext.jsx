// import { createContext, useState, useEffect, useContext } from "react";

// const BASE_URL = "http://localhost:9000";
// const CitiesContext = createContext();

// function CitiesProvider({ children }) {
//   const [cities, setCities] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentCity, setCurrentCity] = useState({});

//   useEffect(function () {
//     // Define an asynchronous function to fetch cities
//     async function fetchCities() {
//       try {
//         // Set loading state to true
//         setIsLoading(true);

//         // Fetch data from the specified URL
//         const res = await fetch(`${BASE_URL}/cities`);

//         // Parse the response as JSON
//         const data = await res.json();

//         // Set the fetched data using the setCities function
//         setCities(data);
//       } catch {
//         // Handle errors by displaying an alert
//         alert("There was an error");
//       } finally {
//         // Set loading state to false regardless of success or failure
//         setIsLoading(false);
//       }
//     }

//     // Call the fetchCities function when the component mounts
//     fetchCities();
//   }, []); // Empty dependency array ensures that the effect runs only once when the component mounts

//   async function getCity(id) {
//     try {
//       setIsLoading(true);
//       const res = await fetch(`${BASE_URL}/cities/${id}`);
//       const data = await res.json();

//       // Check if the city already exists in the array
//       if (!cities.some((city) => city.id === data.id)) {
//         setCities((cities) => [...cities, data]); // Append only if it doesn't exist
//       }

//       setCurrentCity(data);
//     } catch {
//       alert("There was an error");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   async function createCity(newCity) {
//     try {
//       setIsLoading(true);
//       const res = await fetch(`${BASE_URL}/cities`, {
//         method: "POST",
//         body: JSON.stringify(newCity),
//         headers: { "Content-Type": "application/json" },
//       });
//       const data = await res.json();
//       setCities((cities) => [...cities, data]);
//     } catch {
//       alert("There was an error creating city");
//     } finally {
//       setIsLoading(false);
//     }
//   }
//   //////////////////////////////////////////////////////////////////////////////
//   // import { createContext, useState, useEffect, useContext } from "react";
//   // import { createClient } from "@supabase/supabase-js";

//   // const supabase = createClient(
//   //   "https://zlvaaposzmbabknvxpyk.supabase.co",
//   //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsdmFhcG9zem1iYWJrbnZ4cHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2ODE2ODEsImV4cCI6MjAyMDI1NzY4MX0.uy92wGJermYJxbW7DWao6qHbCKf4NSq6a7Z94QN_eMs"
//   // );
//   // const CitiesContext = createContext();

//   // function CitiesProvider({ children }) {
//   //   const [cities, setCities] = useState([]);
//   //   const [isLoading, setIsLoading] = useState(false);
//   //   const [currentCity, setCurrentCity] = useState({});

//   //   useEffect(() => {
//   //     async function fetchCities() {
//   //       try {
//   //         setIsLoading(true);

//   //         const { data, error } = await supabase.from("cities").select();

//   //         if (error) {
//   //           throw new Error("Error fetching data from Supabase");
//   //         }

//   //         setCities(data);
//   //       } catch (error) {
//   //         console.error(error.message);
//   //       } finally {
//   //         setIsLoading(false);
//   //       }
//   //     }

//   //     fetchCities();
//   //   }, []);

//   //   async function getCity(id) {
//   //     try {
//   //       setIsLoading(true);

//   //       const { data, error } = await supabase
//   //         .from("MapProject")
//   //         .select("*")
//   //         .eq("id", id);

//   //       if (error) {
//   //         throw new Error("Error fetching city from Supabase");
//   //       }

//   //       const city = data[0];
//   //       setCities((cities) => [...cities, city]);
//   //       setCurrentCity(city);
//   //     } catch (error) {
//   //       console.error(error.message);
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   }

//   //   async function createCity(newCity) {
//   //     try {
//   //       setIsLoading(true);

//   //       const { data, error } = await supabase.from("cities").upsert([newCity]);

//   //       if (error) {
//   //         throw new Error("Error creating city in Supabase");
//   //       }

//   //       setCities((cities) => [...cities, data[0]]);
//   //     } catch (error) {
//   //       console.error(error.message);
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   }

//   async function deleteCity(id) {
//     try {
//       setIsLoading(true);
//       await fetch(`${BASE_URL}/cities/${id}`, {
//         method: "DELETE",
//       });
//       setCities((cities) => cities.filter((city) => city.id !== id));
//     } catch {
//       alert("There was an error deleting city");
//     } finally {
//       setIsLoading(false);
//     }
//   }
//   function filterCities(searchInput) {
//     return cities.filter(
//       (city) =>
//         city.cityName?.toLowerCase()?.includes(searchInput.toLowerCase()) ||
//         city.country?.toLowerCase()?.includes(searchInput.toLowerCase()) ||
//         (city.notes &&
//           city.notes.toLowerCase().includes(searchInput.toLowerCase()))
//     );
//   }

//   return (
//     <CitiesContext.Provider
//       value={{
//         cities,
//         isLoading,
//         currentCity,
//         getCity,
//         createCity,
//         deleteCity,
//         filterCities,
//       }}
//     >
//       {children}
//     </CitiesContext.Provider>
//   );
// }
// function useCities() {
//   const context = useContext(CitiesContext);
//   if (context === undefined)
//     throw new Error("Cities Context was used outside the cities Provider");
//   return context;
// }
// export { CitiesProvider, useCities };

////////////////////////////////////////////////////////////////////////////////////

import { createContext, useState, useEffect, useContext } from "react";
import { getData } from "../hooks/apiResources";
import supabase from "../hooks/supabase";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);

        // Replace the fetch call with getData
        const data = await getData();

        // Set the fetched data using the setCities function
        setCities(data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        alert("There was an error fetching data");
      } finally {
        setIsLoading(false);
      }
    }

    // Call the fetchCities function when the component mounts
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const data = await getData();

      // Check if the city already exists in the array
      if (!cities.some((city) => city.id === data.id)) {
        setCities((cities) => [...cities, data]); // Append only if it doesn't exist
      }

      setCurrentCity(data);
    } catch (error) {
      console.error("Error getting city:", error.message);
      alert("There was an error getting city");
    } finally {
      setIsLoading(false);
    }
  }

  async function createCity(newCity) {
    try {
      setIsLoading(true);

      // Use Supabase API to insert data into the "organizations" table
      const { data, error } = await supabase
        .from("organizations")
        .upsert([newCity]);

      if (error) {
        throw new Error("Error creating city in Supabase");
      }

      // Update the local state with the new data
      setCities((cities) => [...cities, data[0]]);
    } catch (error) {
      console.error("Error creating city:", error.message);
      alert("There was an error creating city");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true);

      // Use Supabase API to delete a record from the "organizations" table
      const { data, error } = await supabase
        .from("organizations")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error("Error deleting city in Supabase");
      }

      // Update the local state by filtering out the deleted city
      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (error) {
      console.error("Error deleting city:", error.message);
      alert("There was an error deleting city");
    } finally {
      setIsLoading(false);
    }
  }

  function filterCities(searchInput) {
    return cities.filter(
      (city) =>
        city.cityName?.toLowerCase()?.includes(searchInput.toLowerCase()) ||
        city.country?.toLowerCase()?.includes(searchInput.toLowerCase()) ||
        (city.notes &&
          city.notes.toLowerCase().includes(searchInput.toLowerCase()))
    );
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
        filterCities,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cities Context was used outside the cities Provider");
  return context;
}

export { CitiesProvider, useCities };

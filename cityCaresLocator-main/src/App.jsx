import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import EnterpriseList from "./components/EnterpriseList";
import Enterprise from "./components/Enterprise";
import { CitiesProvider } from "./contexts/EnterprisesContext";

function App() {
  return (
    <CitiesProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Homepage />} />
          <Route path="app" element={<AppLayout />}>
            <Route index element={<EnterpriseList />} />
            <Route path="enterprises" element={<EnterpriseList />} />
            <Route path="enterprises/:id" element={<Enterprise />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </CitiesProvider>
  );
}

export default App;

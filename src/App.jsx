import { BrowserRouter, Routes, Route } from "react-router-dom"

import Homepage from "./pages/Homepage"
import PageNotFound from "./pages/PageNotFound"
import Login from "./pages/Login"
import AppLayout from "./pages/AppLayout"
import EnterpriseList from "./components/EnterpriseList"
import OrganizationSubmitForm from "./components/OrganizationSubmitForm"
import AdminPanel from "./components/AdminPanel"
import ProtectedRoute from "./components/ProtectedRoute"
import { CitiesProvider } from "./contexts/EnterprisesContext"
import { AuthProvider } from "./contexts/AuthContext"

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Homepage />} />
            <Route path="login" element={<Login />} />
            <Route path="app" element={<AppLayout />}>
              <Route index element={<EnterpriseList />} />
              <Route
                path="submit"
                element={
                  <ProtectedRoute>
                    <OrganizationSubmitForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  )
}

export default App

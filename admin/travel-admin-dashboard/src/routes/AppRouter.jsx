import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Packages from "../pages/Packages";
import AddPackage from "../pages/AddPackage";
import Bookings from "../pages/Bookings";
import Locations from "../pages/Locations";
import Hotels from "../pages/Hotels";
import Users from "../pages/Users";
import ProtectedRoute from "./ProtectedRoute";
import AddLocation from "../pages/AddLocation";
import AddHotel from "../pages/AddHotel";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import AddUser from "../pages/AddUSer";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/packages"
          element={
            <ProtectedRoute>
              <Packages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/packages/add"
          element={
            <ProtectedRoute>
              <AddPackage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/locations"
          element={
            <ProtectedRoute>
              <Locations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/locations/add"
          element={
            <ProtectedRoute>
              <AddLocation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hotels"
          element={
            <ProtectedRoute>
              <Hotels />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hotels/add"
          element={
            <ProtectedRoute>
              <AddHotel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/add"
          element={
            <ProtectedRoute>
              <AddUser />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

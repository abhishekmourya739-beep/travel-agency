import { Navigate, useLocation } from "react-router-dom";

function isTokenExpired(token) {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    if (!payload?.exp) return true;

    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
}

function clearAdminAuth() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminRefreshToken");
  localStorage.removeItem("adminUser");
}

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  const token = localStorage.getItem("adminToken");
  const adminUser = localStorage.getItem("adminUser");

  if (!token || !adminUser) {
    clearAdminAuth();
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (isTokenExpired(token)) {
    clearAdminAuth();
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  try {
    JSON.parse(adminUser);
  } catch (error) {
    clearAdminAuth();
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

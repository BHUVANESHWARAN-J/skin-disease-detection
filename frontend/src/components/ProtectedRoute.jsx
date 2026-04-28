import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <h2>Loading...</h2>;

  return user ? children : <Navigate to="/login" />;
}

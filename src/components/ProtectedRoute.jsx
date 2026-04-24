import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children, role }) {
  const user = useAuth();
  if (user === undefined) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (role) {
    const allowed = Array.isArray(role) ? role : [role];
    if (!allowed.includes(user.role)) return <Navigate to="/" />;
  }
  return children;
}
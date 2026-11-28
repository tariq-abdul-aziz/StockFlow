import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser || !currentUser.emailVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

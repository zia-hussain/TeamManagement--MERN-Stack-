import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component, requiredRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && (!requiredRole || user.role === requiredRole)) {
    return Component;
  }

  return <Navigate to="/login" />;
};

export default PrivateRoute;

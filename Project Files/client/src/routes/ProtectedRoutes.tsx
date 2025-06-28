import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }: { children: JSX.Element }) => {
  if (localStorage.getItem("user")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoutes;

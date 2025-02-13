import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoutes: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {

      navigate("/login", { replace: true });
      
      return
    } else if (requiredRole && user?.role !== requiredRole) {
      navigate("/login", { replace: true });
    }
  }, [token, user, requiredRole, navigate]); 

  if (!token || (requiredRole && user?.role !== requiredRole)) {
    return null; 
  }

  return <>{children}</>;
};

export default ProtectedRoutes;

import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {  Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole? : string
}

const ProtectedRoutes: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole
}) => {

    const user = useSelector((state: RootState) => state.auth.user) 
    const token = useSelector((state: RootState) => state.auth.token)

    
    if(!token) {
        return <Navigate to="/login" replace />;
    }

    if(requiredRole && user?.role !== requiredRole ) {
        if (user?.role === "user") return <Navigate to="/home" replace />;
        if (user?.role === "tutor") return <Navigate to="/tutors/home" replace />;
        if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    }

    return <>{children} </>
}

export default ProtectedRoutes


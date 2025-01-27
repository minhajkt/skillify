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
    // console.log('toooooooooooooknen', token);
    // console.log("roooooole", user?.role);
    
    // const navigate = useNavigate()
    if(!token) {
        return <Navigate to="/admin/login" replace />;
        // navigate('/login')
        // return null
    }

    if(!requiredRole && user?.role !== requiredRole ) {
        return <Navigate to="/admin/login" replace />;

        // navigate('/login')
        // return null
    }

    return <>{children} </>
}

export default ProtectedRoutes
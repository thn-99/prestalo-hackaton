import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Hooks/Auth";

const ProtectedRoute = (props:any) => {
    const [isLogged] = useAuth();
    const navigate = useNavigate();
    useEffect(()=>{
        if(!isLogged){
            navigate('/login');
        }
    },[])
    return <>{props.children}</>

}

export default ProtectedRoute;
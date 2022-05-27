import { useEffect, useState } from "react"

export const useAuth = () => {
    const [isLogged,setIsLogged] = useState<boolean>(true);
    const [token,setHookToken] = useState<string>("")

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(token){
            setIsLogged(true);
        }else{
            setIsLogged(false);
        }

        window.addEventListener('storage', storageEventHandler, false);        
    },[])

    


    const storageEventHandler = () => {
        const updatedToken = localStorage.getItem("token");
        if(updatedToken && updatedToken !== token){
            setHookToken(updatedToken);
        }
    }

    const setToken = (token:string) => {
        localStorage.setItem("token",token);
    }

    const getAuthHeader = () => {
        return {'Authorization':'Bearer '+localStorage.getItem('token')};
    }

    return [localStorage.getItem("token")?true:false,getAuthHeader,setToken] as const;

}
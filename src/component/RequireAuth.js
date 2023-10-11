import { useNavigate,useLocation, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from 'react';
import Thanks from "./Thanks";
import useAuth from "../hook/useAuth.js";


const RequireAuth = () => {
    const location = useLocation();
    const { auth,setAuth } = useAuth();
    const access_token = localStorage.getItem('access_token');
    
    useEffect(() => {
      if (Object.keys(auth).length === 0 && auth.constructor === Object) {
          const user_id = localStorage.getItem('user_id');
          if (user_id && access_token) {
              setAuth({ user_id, access_token });
          }
      }
    }, [auth,setAuth]);
 

    if (access_token === 'expired' || access_token === 'finish') {
        return  <Navigate to="/logout" state={{ from: location }} replace />;
      } else if(auth.access_token){
        return <Outlet/>;
      }else if((!auth.access_token&&!access_token) && location.pathname !== '/register'){
        return <Navigate to="/register" state={{ from: location }} replace />;   
      }else{
        console.log('wired4',auth);
      }
     
}

export default RequireAuth;



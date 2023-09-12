import { useNavigate,useLocation, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from 'react';
import Thanks from "./Thanks";
import useAuth from "../hook/useAuth.js";


const RequireAuth = () => {
    const location = useLocation();
    const { auth } = useAuth();
    const token=localStorage.getItem('token');

    console.log("auth",auth);
console.log('auth type:', typeof auth);
console.log('auth is array:', Array.isArray(auth));
console.log('auth has access_token:', 'access_token' in auth);
    if (token === 'expired' || token === 'finish') {
        console.log('wired',auth);
        return  <Navigate to="/logout" state={{ from: location }} replace />;
      } else if ((Array.isArray(auth) && auth.length === 0) && location.pathname !== '/register') {
        console.log('wired2',auth);
        return <Navigate to="/register" state={{ from: location }} replace />;   
      }  else if(auth.access_token){
        console.log('wired3',auth);
        return <Outlet/>;
      }else if(Object.keys(auth).length === 0 && auth.constructor === Object && location.pathname !== '/register'){
        console.log('wired2ddd',location.pathname);
        return <Navigate to="/register" state={{ from: location }} replace />;   
      }else{
        console.log('wired4',auth);
      }
     
}

export default RequireAuth;



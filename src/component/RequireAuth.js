import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from 'react';

const RequireAuth = () => {
    const location = useLocation();
    const [token, setToken] = useState(localStorage.getItem('token'));
    
    const handleStorageChange = () => {
        setToken(localStorage.getItem('token'));
      };
    useEffect(() => { 
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
      }, [token]);

    //   const finish=localStorage.getItem('finish');
    // if (finish) {
    //     return (
    //         <div className="thanks-container">
    //         <div className="thanks-text">
    //             <p>
    //             ご協力ありがとうございました。
    //             </p>
    //         </div>
    //         </div>
    //     );    
    // } else
    if (token === 'expired'){
        console.log("get token expired");
        return (
            <div className="thanks-container">
            <div className="thanks-text">
                <p>
                長時間使用しない場合、自動的にログアウトされ、現在の実験が無効になります。
                    ご協力ありがとうございました。
                </p>
            </div>
            </div>
        );
    }else if (token) {
        return <Outlet />; // make auth work on all children route
    } else {
        return <Navigate to="/register" state={{ from: location }} replace />;
    }
}

export default RequireAuth;



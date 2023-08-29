import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    const { auth } = useContext(AuthContext);
    if (!auth) {
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
            auth = storedAuth;
        }
    }
    console.log("auth",auth);
    useDebugValue(auth, auth => auth?  "Logged In" : "Logged Out")
    return useContext(AuthContext);
}

export default useAuth;
import { set } from "d3";
import { axiosPrivate } from "../api/axios";
import { useEffect,useState } from "react";
import useAuth from "./useAuth";
// refer gitdagray/react_hooks_axios

const useAxiosPrivate = () => {
    const { auth,setAuth } = useAuth();
    const [response, setResponse] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); //different!
    const [controller, setController] = useState();

    const axiosFetch = async (configObj) => {
        const { 
            method,
            url,
            requestConfig = {}
        } = configObj;
        console.log(configObj);
        try {
            setLoading(true);
            const ctrl = new AbortController();
            setController(ctrl);
            const res = await axiosPrivate[method.toLowerCase()](url, {
                ...requestConfig,
                signal: ctrl.signal
            });
            // console.log(res);
            setResponse(res.data);
        } catch (err) {
            console.log(err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // listerner
    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.access_token}`;
                    console.log("access_token set",auth);
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                if (error?.response?.status === 403 || error?.response?.status === 401) {
                    localStorage.setItem('access_token', 'expired');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
            controller && controller.abort();
        }
    }, [auth, controller])
 
    return [response, error, loading, axiosFetch];
}

export default useAxiosPrivate;
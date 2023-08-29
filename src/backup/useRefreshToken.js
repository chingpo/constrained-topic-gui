import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.data.user_id);
            console.log(response.data.data.access_token);
            return { ...prev, accessToken: response.data.accessToken }
        });
        return response.data.data.access_token;
    }
    return refresh;
};

export default useRefreshToken;
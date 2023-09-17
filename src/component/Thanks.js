import {React,useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useAuth from "../hook/useAuth.js";


const ThanksMessage = ({ children }) => (
  <Box
    className="thanks-container"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '2rem',
      textAlign: 'center',
    }}
  >
    <Box
      className="thanks-text"
      sx={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6">{children}</Typography>
    </Box>
  </Box>
);

const Thanks = () => {
  const { setAuth } = useAuth();
  const token=localStorage.getItem('token');
  useEffect(() => {
    if (token === 'expired' || token === 'finish') {
      setAuth({});
    }
  }, []);

  if (token === 'expired') { 
    console.log("expired");
    return (
      <ThanksMessage>
        長時間操作がなかった場合、自動的にログアウトされ、実験が無効になります。
      </ThanksMessage>
    );
  } else if (token === 'finish') {
    console.log("finish");
    return (
      <ThanksMessage>
        ご協力ありがとうございました。
      </ThanksMessage>
    );
  } else{
    console.log("no show")
    return (
      <ThanksMessage>
        You do not have access to the requested page.
      </ThanksMessage>
    );
  }
};

export default Thanks;
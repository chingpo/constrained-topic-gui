import React,{ useState,useEffect,useRef } from 'react';
import "../App.css"
import { Outlet } from "react-router-dom"
import { useNavigate, useLocation } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import guide from '../guide.png';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showGuideline, setShowGuideline] = useState(false);
  const [highlightButton, setHighlightButton] = useState(null);
  
  useEffect(() => {
    if (localStorage.getItem('finish')) {
    navigate('/logout');
    }
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (highlightButton) {
      timer = setTimeout(() => {
        setHighlightButton(false);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [highlightButton]);

  useEffect(() => {
    if (highlightButton === null && location.pathname === '/display') {
      if (!localStorage.getItem('highlighted')) {
        localStorage.setItem('highlighted', 'true');
        setHighlightButton(true);
      } else {
        setHighlightButton(false);
      }
    }
  }, [ location.pathname]);
     

  const handleGuidelineClose = () => {
    setShowGuideline(false);
  
  };

  const handleGuidelineOpen = () => {
    setShowGuideline(true);
  };


  return (
    <>
     
      <div>
        <header className="header">
          <h1>画像トピック化実験</h1>
          {(location.pathname === '/display' || location.pathname === '/dnd') && <button onClick={handleGuidelineOpen} style={{ border: '1px solid hsla(0,0%,100%,.2)', 
      boxShadow: highlightButton ? '0 0 10px white' : 'none'  
      }}>ユーザーガイド</button>}
          <Dialog open={showGuideline} onClose={handleGuidelineClose}>
            <DialogTitle>操作手順</DialogTitle>
            <DialogContent>
              <p>操作は以下の通りです。4回のループの後に、「提出」をクリックしてください。</p>
              <img src={guide} alt="Guide" style={{width: '100%'}} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleGuidelineClose}>OK</Button>
            </DialogActions>
          </Dialog>
        </header>
        <div className='main-container'>
            <Outlet/>
        </div>
      </div>
    </>
  )
 }
 
export default Layout;
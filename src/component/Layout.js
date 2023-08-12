import React,{ useState,useEffect } from 'react';
import "../App.css"
import { Outlet } from "react-router-dom"
import { useLocation } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

function Layout() {
  const location = useLocation();
  const [showGuideline, setShowGuideline] = useState(false);
  const [highlightButton, setHighlightButton] = useState(false);
  

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

  const handleGuidelineClose = () => {
    setShowGuideline(false);
    if (!localStorage.getItem('highlighted')) {
      setHighlightButton(true);
      localStorage.setItem('highlighted', 'true');
    }
  };

  const handleGuidelineOpen = () => {
    setShowGuideline(true);
  };
  
  useEffect(() => {
    if (location.pathname === '/display' && !localStorage.getItem('displayVisited')) {
      setShowGuideline(true);
      localStorage.setItem('displayVisited', 'true');
    }
  }, [location.pathname]);


  return (
    <>
     
      <div>
        <header className="header">
          <h1>Experiment</h1>
          {(location.pathname === '/display' || location.pathname === '/dnd') && <button onClick={handleGuidelineOpen} style={{ border: '1px solid hsla(0,0%,100%,.2)', 
      boxShadow: highlightButton ? '0 0 10px yellow' : 'none'  
      }}>Show Guideline</button>}
          <Dialog open={showGuideline} onClose={handleGuidelineClose}>
            <DialogTitle>User Instructions</DialogTitle>
            <DialogContent>
              <p>Here are some instructions...</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleGuidelineClose}>OK</Button>
            </DialogActions>
          </Dialog>
        </header>
        <div className='main-container'>
        <Outlet />
        </div>
      </div>
    </>
  )
 }
 
export default Layout;
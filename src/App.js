import "./App.css";
import DnD from "./component/DnD";
import Display from "./component/Display";
import Layout from "./component/Layout";
import Disclaimer from "./component/Disclaimer";
import Register from "./component/Register";
import { Routes, Route, useLocation } from 'react-router-dom';
import Thanks from "./component/Thanks";
import Question from "./component/Question";
import Instruction from "./component/Instruction";
import RequireAuth from "./component/RequireAuth";
import { useEffect, useState } from "react";



function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route path="logout" element={<Thanks/>} />
        <Route path="register" element={<Register />} />


          {/* <Route path="disclaimer" element={<Disclaimer/>} />
      <Route path="instruction" element={<Instruction/>} />
      <Route path="display" element={<Display/>} />
      <Route path="dnd" element={<DnD/>} />
      <Route path="qtnr" element={<Question/>} />     
      <Route path="logout" element={<Thanks />} /> */}


          <Route path="/" element={<RequireAuth />}>  
            <Route path="disclaimer" element={<Disclaimer />} />
            <Route path="instruction" element={<Instruction />} />
            <Route path="display" element={<Display />} />
            <Route path="dnd" element={<DnD />} />
            <Route path="qtnr" element={<Question/>} />     
          </Route>
        </Route>

      </Routes>


    </>
  );
}



export default App;
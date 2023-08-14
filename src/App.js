import "./App.css";
import DnD from "./component/DnD";
import Display from "./component/Display";
import Layout from "./component/Layout";
import Disclaimer from "./component/Disclaimer";
import Register from "./component/Register";
import {   Routes, Route } from 'react-router-dom';
import Thanks from "./component/Thanks";
import RequireAuth from "./component/RequireAuth";
import { useEffect,useState } from "react";



function App() {
 
  return (
    <>
     <Routes>
      <Route path="/" element={<Layout />}> 
      <Route path="register" element={<Register/>}/>
      <Route path="disclaimer" element={<Disclaimer/>} />
      <Route path="display" element={<Display/>} />
      <Route path="dnd" element={<DnD/>} />
      <Route path="logout" element={<Thanks/>} />

      
      {/* <Route path="/" element={<RequireAuth/>}>
      <Route path="disclaimer" element={<Disclaimer/>} />
      <Route path="display" element={<Display/>} />
      <Route path="dnd" element={<DnD/>} />
      <Route path="logout" element={<Thanks/>} />
      </Route> */}
      </Route>
        
    </Routes>

  
    </>
  );
}



export default App;

import React, { useEffect, useState, useRef } from 'react';
import "../App.css"
import useLogout from "../hook/useLogout";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { useNavigate, Link, useLocation } from "react-router-dom";
import ClusterGraph from "./ClusterGraph";
import RoundStepper from "./RoundStepper";



function Display() {
  
  const topicGroups = [[1, 2, 3, 4, 5], [4, 3, 5, 6, 7], [6, 11, 1, 2, 3], [11, 12, 13]];
  const [round, setRound] = useState(() => parseInt(localStorage.getItem("round")) || 0);


  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const logout = useLogout();

  useEffect(() => {
    localStorage.setItem("round", round);
  }, [round]);

  const signOut = async () => {
    await logout();
    navigate('/logout');
  }

  const [cluster_ids, setClusters] = useState([]);
  const handleCheck = (e) => {
    const value = e.target.value.split(',').map(Number);
    if (e.target.checked) {
      setClusters(value);
    } else {
      setClusters([]); // error,cannot be empty ,must select 5 ids
    }
  };
// 图片服务器挂了，直接logout


  return (
    <div>
      <RoundStepper activeStep={round}  />
      <div>
        <h1>selected: {cluster_ids.map((item) => {
          return (
            <span key={item}>{item},</span>
          )
        })}</h1>
      {  round<4?
      <select
      value={cluster_ids.sort().toString()}
      onChange={(e) => setClusters(e.target.value.split(','))}
      className="custom-select"
    >
      <option value="">Select...</option>
      {topicGroups.map((group, index) => (
        <option key={index} value={group.sort().toString()}>
          Topic group {index + 1}
        </option>
      ))}
    </select>:<></>
}

      </div>
      
      <div style={{ border: '1px solid black' }}>
        <ClusterGraph cluster_ids={cluster_ids} setClusters={setClusters} />
      </div>
      <div class='play-button'>
        {round > 3 ? <Link to="/logout">
          <button onClick={signOut} >finish</button>
        </Link> :
          <Link to="/dnd" state={{ cluster_ids: cluster_ids, column_limit: 20 }}><button>play</button></Link>}
      </div>
    </div>

  );
}

export default Display;
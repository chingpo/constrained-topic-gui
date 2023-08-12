
import React, { useEffect, useState, useRef } from 'react';
import "../App.css"
import useLogout from "../hook/useLogout";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { useNavigate, Link, useLocation } from "react-router-dom";
import ClusterGraph from "./ClusterGraph"

function Display() {
  //dnd页面提交3次后，本页面不显示topic选择部分，只显示聚类和finish button（logout）
  const topicGroups = [[1, 2, 3, 4, 5], [4, 3, 5, 6, 7], [6, 11, 1, 2, 3], [11, 12, 13]];
  const [round] = useState(parseInt(localStorage.getItem("round")) || 0);
  const [showGuideline, setShowGuideline] = useState(false);
  
  const [graph, setGraph] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const logout = useLogout();


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



  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getGraph = async () => {
      try {
        const response = await axiosPrivate.post('/cluster',
          JSON.stringify({ "round": round }),
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            signal: controller.signal
          });
        // console.log(response.data.data);
        isMounted && setGraph(response.data.data);
      } catch (err) {
        console.error(err);
        // navigate('/logout', { state: { from: location }, params: { error: err }, replace: true });
      }
    }
    getGraph();
    return () => {
      isMounted = false;
      controller.abort();
    }

  }, [])

  return (
    <div>
      <div>
        <h1>selected: {cluster_ids.map((item) => {
          return (
            <span key={item}>{item},</span>
          )
        })}</h1>
      {  round<4?
        <ul onChange={handleCheck}>
          {topicGroups.map((group, index) => (
            <li key={index}>
              topic group {index + 1}:
              <input
                type="checkbox"
                value={group}
                checked={cluster_ids.sort().toString()===group.sort().toString()}
              />
            </li>
          ))}
        </ul>:<></>
}

      </div>
      
        {/* <p>get topic</p> */}
        {/* <article>
          <h2>Users List</h2>
          {graph?.length ? (
            <ul>
              {graph.map((item, i) => <li key={i}>{item?.user_id}</li>)}
            </ul>) :
            <img style={{ width: '2rem', height: 'auto' }} src={require('../loading.gif')}
            ></img>}
        </article> */}
        <ClusterGraph cluster_ids={cluster_ids} setClusters={setClusters} />
      
      <div class='play-button'>
        {/* link to dnd传值cluster_ids,column_limit */}
        <p>round is {round}</p>
        {/* selectedOption */}
        {round > 3 ? <Link to="/logout">
          <button onClick={signOut} >finish</button>
        </Link> :
          <Link to="/dnd" state={{ cluster_ids: cluster_ids, column_limit: 20 }}><button>play</button></Link>}
      </div>
    </div>

  );
}

export default Display;

import React, { useEffect, useState, useRef } from 'react';
import "../css/display.css"
import useLogout from "../hook/useLogout";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { useNavigate, Link, useLocation } from "react-router-dom";
import ClusterGraph from "./ClusterGraph";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LinearProgressWithLabel from "./LinearProgressWithLabel";

import submit from "../submit.png";

function Display() {

  const topicGroups = [[1, 2, 3, 4, 5], [4, 3, 5, 6, 7], [6, 11, 1, 2, 3], [11, 12, 13]];
  const [round, setRound] = useState(() => parseInt(localStorage.getItem("round")) || 0);


  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const logout = useLogout();
  const [database, setDatabase] = useState('stl'); // 新增的状态

  const handleDatabaseChange = (e) => {
    setDatabase(e.target.value);
  };

  useEffect(() => {
    localStorage.setItem("round", round);
  }, [round]);

  const signOut = async () => {
    await logout();
    navigate('/logout');
  }

  const [cluster_ids, setClusters] = useState([]);
  const [isValidTopic, setIsValidTopic] = useState(false);
  const handleSelectChange = (e) => {
    const selectedTopics = e.target.value ? e.target.value.split(',').map(Number) : [];
    setClusters(selectedTopics);
  };
  useEffect(() => {
    setIsValidTopic(cluster_ids.length >= 5);
  }, [cluster_ids]);


  return (
    <div>
      <div className="display-header">
        <div className="instruction-text">
          {round > 3 ? <p> タスクは以上になります。
            ご協力ありがとうございました。</p> :
            <p>please slect 5 topic first</p>
          }
        </div>

        <div className='topic-select'>
          <div >
            <select value={database} onChange={handleDatabaseChange}>
              <option value="coco">COCO</option>
              <option value="stl">STL</option>
            </select>
            {round < 4 ?
              <>
                <select
                  value={cluster_ids.sort().toString()}
                  onChange={handleSelectChange}
                  className="custom-select"
                >
                  {cluster_ids.length > 0 && <option value={cluster_ids.sort().toString()}>Selected: {cluster_ids.join(', ')}</option>}
                  <option value="">Select...</option>
                  {topicGroups.map((group, index) => (
                    <option key={index} value={group.sort().toString()}>
                      Topic group {index + 1}
                    </option>
                  ))}
                </select>
                {isValidTopic && <FontAwesomeIcon icon={faCheck} style={{ color: 'green', marginTop: '10px',marginLeft: '10px' }} />}
              </> : <></>
            }
          </div>
          {round > 3 ?
            // <></>   
            // test environment
            <Link to="/logout">
              <button onClick={signOut}  >finish</button>
            </Link>
            :
            <Link to="/dnd" state={{ cluster_ids: cluster_ids, column_limit: 20 }}><button disabled={!isValidTopic}>
              <img src={submit} alt="Submit" style={{ marginRight: '10px' ,width:'1.4rem',verticalAlign: 'middle' }} />
              play</button></Link>}


        </div>

      </div>


      <LinearProgressWithLabel round={round * 25} />
      <div className='projection'>
        <ClusterGraph cluster_ids={cluster_ids} setClusters={setClusters} />
      </div>
    </div>

  );
}

export default Display;
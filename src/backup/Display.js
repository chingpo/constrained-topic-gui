
import React, { useEffect, useState, useRef } from 'react';
import "../css/display.css"
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import ClusterGraph from "./ClusterGraph";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import next from "../next.png";
import submit from "../submit.png";
import Chip from '@mui/material/Chip';

function Display() {

  const topicGroups = [[1, 2, 3, 4, 5], [4, 3, 5, 6, 7], [6, 11, 1, 2, 3], [11, 12, 13]];
  const [round, setRound] = useState(() => parseInt(localStorage.getItem("round")) || 0);


  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [database, setDatabase] = useState('stl'); // 新增的状态

  const handleDatabaseChange = (e) => {
    setDatabase(e.target.value);
  };

  useEffect(() => {
    localStorage.setItem("round", round);
  }, [round]);


  const [cluster_ids, setClusters] = useState([]);
  const [isValidTopic, setIsValidTopic] = useState(false);
  const handleDelete = (idToDelete) => {
    setClusters((prevClusterIds) => prevClusterIds.filter((id) => id !== idToDelete));
};
  useEffect(() => {
    setIsValidTopic(cluster_ids.length >= 5);
    console.log(cluster_ids);
  }, [cluster_ids]);

  const [open, setOpen] = useState(false);
  useEffect(() => {
    const rate = localStorage.getItem('startRated');
    // const rate = true;  # test environment
    if (isValidTopic && !rate) {
      setOpen(true);
    }
  }, [isValidTopic]);
  const [score, setScore] = useState(0);
  const [_, __, ___, axiosFetch] = useAxiosPrivate();
  const handleRateSubmit = () => {
    axiosFetch({
      method: 'post',
      url: '/rate',
      requestConfig: {
        type: "start",
        likert: score
      }
    });
    // 错误处理
    setOpen(false);
    localStorage.setItem('startRated', true);
  }

  return (
    <div>
      <Dialog open={open} onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          handleRateSubmit();
        }
      }}>
        <DialogTitle>評価してください！</DialogTitle>
        <DialogContent>
          <Typography component="legend">クラスタリンググループには、何つ星をつけますか？</Typography>
          <div className="rating-container">
            <Rating
              name="simple-controlled"
              value={score}
              onChange={(event, newValue) => {
                setScore(newValue);
              }}
              max={7}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRateSubmit}>確認</Button>
        </DialogActions>

      </Dialog>

      <div className="display-header">
        <div className="instruction-text">
          {round > 3 ? <p> タスクは以上になります。
            「提出」をクリックしてください。 </p> :
            // <Typography variant="h6">please slect 5 topic first</Typography>
            <Typography variant="h6">科目を選択し、興味のあるトピックを5つ選んでください。</Typography>
          }
        </div>

        <div className='topic-select'>
          <div >

            {round < 4 ?
              <>
                <select value={database} onChange={handleDatabaseChange}>
                  <option value="all">全部</option>
                  <option value="animal">動物</option>
                  <option value="person">人間</option>
                  <option value="vehicle">乗り物</option>
                  <option value="indoor">室内</option>
                  <option value="food">食物</option>
                </select>
                {cluster_ids.map((id, index) => (
                  <Chip
                      key={index}
                      label={`トピック ${id}`}
                      onDelete={() => handleDelete(id)}
                      className="topic-chip"
                      style={{ marginLeft: '0.5rem' }}
                  />
              ))}
                {isValidTopic && <FontAwesomeIcon icon={faCheck} style={{ color: 'green', marginTop: '10px', marginLeft: '10px' }} />}
              </> : <></>
            }
          </div>
          {round > 3 ?
            // <></>   
            // test environment
            <Link to="/logout" >
              <button> <img src={submit} alt="Submit" />提出する</button>
            </Link>
            :
            <Link to="/dnd" state={{ cluster_ids: cluster_ids, column_limit: 20 }}>
              <button disabled={!isValidTopic}>
                <img src={next} alt="Next"/>続ける</button></Link>}
        </div>

      </div>


      <LinearProgressWithLabel round={round * 25} />
      <div className='projection'>
        <ClusterGraph cluster_ids={cluster_ids} setClusters={setClusters}  />
      </div>
    </div>

  );
}

export default Display;
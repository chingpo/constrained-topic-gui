
import React, { useEffect, useState, useRef } from 'react';
import "../css/display.css"
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import MobileStepper from '@mui/material/MobileStepper';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IMG_BASE_URL } from "../api/axios"
import ClusterGraph from "./ClusterGraph";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Chip from '@mui/material/Chip';
import ImageList from '@mui/material/ImageList';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import LastPageIcon from '@mui/icons-material/LastPage';
import ImageListItem from '@mui/material/ImageListItem';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// import Likert from "react-likert-scale";
import Likert from "../setting/likert.js";
import { likertSeven } from '../setting/likertSeven.js';
// import all from "../json/topic_image_nn.json"
// import all from "../json/nn_tsne.json"
import all from "../json/nn_init_clip.json"



const Cluster_Question = ({ getClusterInfo, setData }) => {
  const [likertValues, setLikertValues] = useState([null, null, null]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [rate, error, _, axiosFetch] = useAxiosPrivate();
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (likertValues[0] === null || likertValues[1] === null || likertValues[2] === null) {
      setOpenSnackbar(true);
      return;
    }
    const likertValuesString = `${likertValues[0]},${likertValues[1]},${likertValues[2]}`;
    axiosFetch({
      method: 'POST',
      url: '/rate',
      requestConfig: {
        type: "compare",
        likert: likertValuesString
      }
    });
    navigate('/qtnr');
  };

const likertOptions = likertValues.map((_, index) => ({
  responses: likertSeven,
  onChange: (val) => {
    setLikertValues(prevValues => {
      const newValues = [...prevValues];
      newValues[index] = val.value;
      return newValues;
    });
  }
}));
  const handleRadioChange = (event) => {
    const newValue = event.target.value;
    if (newValue === 'init') {
      setData(all.data);
    } else if (newValue === 'final') {
      getClusterInfo();
    }
  };

  const questions = [
    "最終的なグループ分けは初期のグループ分けよりも、分かりやすいと思いますか？",
    "最終的なグループ分けは初期のグループ分けよりも、もっとうまく分類できそうだと思いますか?",
    "最終的なグループ分け結果は、初期のグループ分け結果よりもあなたの期待や直感に最も合致していますか？"
  ];

  return (
    <div>
       {likertOptions.map((options, index) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} key={index}>
        <p style={{ width: '50%' }}>{index+1}.{questions[index]}</p>
        <div style={{ width: '50%' }}>
          <Likert {...options} id={`compare${index+1}`} className="likert-scale" />
        </div>
      </div>
    ))}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            defaultValue="final"
            onChange={handleRadioChange}
          >
            <FormControlLabel value="init" control={<Radio />} label="初期状態" />
            <FormControlLabel value="final" control={<Radio />} label="最終状態" />
          </RadioGroup>
        </div>
        <button onClick={handleSubmit}>
          <LastPageIcon />
          提出する
        </button>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="warning">
        {/* 回答されていない質問があります。 */}
        点数を付けてください！
        </Alert>
      </Snackbar>
    </div>
  )
}

function Display() {
  const [round, setRound] = useState(() => parseInt(localStorage.getItem("round")) || 0);
  const [response, error, loading, axiosFetch] = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    localStorage.setItem("round", round);
  }, [round]);

  const imageListRef = React.useRef();
  const [data, setData] = useState(all.data);
  const [cluster_ids, setClusters] = useState([]);
  const [isValidTopic, setIsValidTopic] = useState(false);
  const handleDelete = (idToDelete) => {
    setClusters((prevClusterIds) => prevClusterIds.filter((id) => id !== idToDelete));
  };
  useEffect(() => {
    setIsValidTopic(cluster_ids.length >= 5);
  }, [cluster_ids]);

  //only show in the first time after choose 5 topics
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const rate = localStorage.getItem('startRated');
    // const rate = true;  # test environment
    if (isValidTopic && !rate) {
      setOpen(true);
    }
  }, [isValidTopic]);
  const [activeStep, setActiveStep] = React.useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const maxSteps = all.cluster_id_range;
  const [scores, setScores] = useState([]);
  const [curScore, setCurrent] = useState(null);
  const handleNext = () => {
    if (curScore) {
      setScores((prevScores) => [...prevScores, curScore]);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setCurrent(null);
      if (imageListRef.current) {
        imageListRef.current.scrollTop = 0;
      }
      // 如果是最后一页，发送请求
      if (activeStep === maxSteps - 1) {
        axiosFetch({
          method: 'post',
          url: '/rate',
          requestConfig: {
            type: "start",
            likert: scores.toString()
          }
        });
        // console.log(scores.toString());
        // 错误处理
        setOpen(false);
        localStorage.setItem('startRated', true);
      }
    } else {
      setOpenSnackbar(true);
    }
  };

  const getClusterInfo = () => {
    axiosFetch({
      method: 'post',
      url: '/cluster',
      requestConfig: {
        round: round
      }
    });
}
useEffect(() => {
  if(round>=1){
    getClusterInfo();
  }
},[round]);
useEffect(() => {
  if (!loading && !error && response?.data) {
    // console.log(response.data);
      setData(response.data);
  }
}, [response, loading, error]);

  return (
    <div>
      <Dialog open={false}>
        <DialogTitle>Please give the topic rating!</DialogTitle>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity="warning" sx={{ width: '100%' }}>
            点数を付けてください！
            </Alert>
          </Snackbar>
          {activeStep !== null && (
            <Likert id={activeStep} question={'This group of images appear to represent a single topic.'} responses={likertSeven} onChange={(e) => {
              const newVal = e.value;
              setCurrent(newVal);
            }} />
          )}
          <ImageList
            sx={{ width: 500, height: 450 }}
            variant="quilted"
            cols={4}
            rowHeight={121}
            ref={imageListRef}
          >
            {all.data.filter(item => item.cluster_id === activeStep).map((item) => (
              <ImageListItem key={item.img_name} cols={item.cols || 1} rows={item.rows || 1}>
                <img
                  src={IMG_BASE_URL + item.img_name}
                  alt={item.img_name}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </DialogContent>
        {maxSteps && (<MobileStepper
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button size="small" onClick={handleNext}>
              {activeStep === maxSteps - 1 ? '確認' : 'next'}
            </Button>
          }
        >
          <Typography variant="body1">
            {activeStep + 1} / {maxSteps}
          </Typography>
        </MobileStepper>)}
      </Dialog>
      <LinearProgressWithLabel round={round * 25} />

      <div className="display-header">
        <div className="instruction-text">
          {round > 3 ?
            <Cluster_Question getClusterInfo={getClusterInfo} setData={setData}/> :
            // <Typography variant="h6">please slect 5 topic first</Typography>
            <Typography variant="h6">グループが重なっている箇所からグループを５つ選んでください。</Typography>
          }
        </div>

        <div className='topic-select'>
          {round > 3 ?
            null
            :
            <>
            <div>
            {cluster_ids.map((id, index) => (
              <Chip
                key={index}
                label={`グループ ${id}`}
                onDelete={() => handleDelete(id)}
                className="topic-chip"
                style={{ marginLeft: '0.5rem' }}
              />
            ))}
            {isValidTopic && <FontAwesomeIcon icon={faCheck} style={{ color: 'green', marginTop: '10px', marginLeft: '10px' }} />}
            </div>
            <Link to="/dnd" state={{ cluster_ids: cluster_ids, column_limit: 100 }}>
              <button disabled={!isValidTopic}>
                <ArrowForwardIcon />続ける</button></Link>
                </>
                }
        </div>

      </div>

      <div className='projection'>
        <ClusterGraph cluster_ids={cluster_ids} setClusters={setClusters} data={data}  />
      </div>
    </div>

  );
}

export default Display;
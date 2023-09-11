
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
import all from "../json/nn_projection_pca.json";
import animal from "../json/0_image_tsne.json";
import person from "../json/1_image_tsne.json";
import vehicle from "../json/2_image_tsne.json";
import indoor from "../json/3_image_tsne.json";
import food from "../json/4_image_tsne.json";
import final_data from "../json/nn_projection_tsne.json";

function SubjectSelect({setData}) {
  const [subject, setSubject] = useState('all');
  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
    switch (e.target.value) {
      case 'animal':
        setData(animal);
        break;
      case 'person':
        setData(person);
        break;
      case 'vehicle':
        setData(vehicle);
        break;
      case 'indoor':
        setData(indoor);
        break;
      case 'food':
        setData(food);
      default:
        setData(all.data);
    }
  };
  return (
    <select value={subject} onChange={handleSubjectChange}>
      <option value="all">全部</option>
      <option value="animal" title="鳥,猫,牛,犬,馬,羊">動物</option>
      <option value="vehicle" title="飛行機,自転車,ボート,バス,車,バイク,電車">乗り物</option>
      <option value="indoor" title="ボトル,椅子,ダイニングテーブル,鉢植えの植物,ソファ,テレビ/モニター">室内</option>
      <option value="food" title="バナナ,リンゴ,サンドイッチ,オレンジ,ブロッコリー,ニンジン,ホットドッグ,ピザ,ドーナツ,ケーキ">食物</option>
      <option value="person">人間</option>
    </select>
  );
}

const Cluster_Question = ({ data, setData }) => {
  const [likertValue, setLikertValue] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [rate, error, _, axiosFetch] = useAxiosPrivate();
  const navigate = useNavigate();
  const handleSubmit = () => {
    console.log(likertValue);
    if (likertValue === null) {
      setOpenSnackbar(true);
      return;
    }
    axiosFetch({
      method: 'POST',
      url: '/rate',
      requestConfig: {
        type: "compare",
        likert: likertValue
      }
    });
    navigate('/qtnr');
  };


  const likertOptions = {
    question: null,
    responses: likertSeven,
    onChange: (val) => {
      setLikertValue(val.value);
    }
  }
  const handleRadioChange = (event) => {
    const newValue = event.target.value;
    if (newValue === 'init') {
      setData(all.data);
    } else if (newValue === 'final') {
      setData(final_data);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p>最終的なクラスタリングは初期状態よりも良いと思いますか？</p>
        <Likert {...likertOptions} className="likert-scale" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            defaultValue="final"
            onChange={handleRadioChange}
          >
            <FormControlLabel value="init" control={<Radio />} label="初期化" />
            <FormControlLabel value="final" control={<Radio />} label="最終的" />
          </RadioGroup>
          <SubjectSelect setData={setData} />
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
          質問答え未記入です。
        </Alert>
      </Snackbar>
    </div>
  )
}

function Display() {
  const [round, setRound] = useState(() => parseInt(localStorage.getItem("round")) || 0);
  const [_, __, ___, axiosFetch] = useAxiosPrivate();
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
        console.log(scores.toString());
        // 错误处理
        setOpen(false);
        localStorage.setItem('startRated', true);
      }
    } else {
      setOpenSnackbar(true);
    }
  };


  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>本ページの各クラスタを評価してください</DialogTitle>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity="warning" sx={{ width: '100%' }}>
              まだ点数を付けていません！
            </Alert>
          </Snackbar>
          {activeStep !== null && (
            <Likert id={activeStep} question={'この写真グループはトッピクを明確に強調できます。'} responses={likertSeven} onChange={(e) => {
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
              {activeStep === maxSteps - 1 ? '確認' : '次へ'}
            </Button>
          }
        >
          <Typography variant="body1">
            {activeStep + 1} / {maxSteps}
          </Typography>
        </MobileStepper>)}
      </Dialog>

      <div className="display-header">
        <div className="instruction-text">
          {round > 3 ?
            <Cluster_Question data={data} setData={setData}/> :
            // <Typography variant="h6">please slect 5 topic first</Typography>
            <Typography variant="h6">科目を選択し、興味のあるトピックを5つ選んでください。</Typography>
          }
        </div>

        <div className='topic-select'>
          <div >
            
            
          </div>
          {round > 3 ?
            null
            :
            <>
            <SubjectSelect setData={setData}/>
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
            <Link to="/dnd" state={{ cluster_ids: cluster_ids, column_limit: 20 }}>
              <button disabled={!isValidTopic}>
                <ArrowForwardIcon />続ける</button></Link>
                </>}
        </div>

      </div>


      <LinearProgressWithLabel round={round * 25} />
      <div className='projection'>
        <ClusterGraph cluster_ids={cluster_ids} setClusters={setClusters} data={data}  />
      </div>
    </div>

  );
}

export default Display;

import '../css/logout.css';
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../hook/useAxiosPrivate";
// import Likert from "../setting/likert.js";
import Likert from "react-likert-scale";
import { likertSeven } from '../setting/likertSeven.js';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import { IMG_BASE_URL } from "../api/axios"
import useAuth from "../hook/useAuth.js";

const Question = () => {
  const CHARACTER_LIMIT = 100;
  const cluster_id_range = 20;
  const { setAuth} = useAuth();
  const [response, error, loading, axiosFetch] = useAxiosPrivate();
  const [data, setData] = useState([]); 
  const getClusterInfo = () => {
    axiosFetch({
      method: 'post',
      url: '/cluster',
      requestConfig: {
        round: 4
      }
    });
  }
  useEffect(() => {
    getClusterInfo();
  }, []);
  useEffect(() => {
    if (!loading && !error && response?.data) {
      setData(response.data); 
    }
  }, [response, loading, error]);

  const [comment, setComment] = useState('');
  const [likertValues, setLikertValues] = useState(
    Array.from({ length: cluster_id_range }, () => -1)
  );
  const [addLikert, setAddLikert] = useState([null, null, null]);
  const options = ['毎回', '2回以上', '1回', '0回'];
  const optionMap = {
    '毎回': 'everyTime',
    '2回以上': 'twicemore',
    '1回': 'twiceless',
    '0回': 'none'
  };
  const [loopQuestion, setLoopQuestions] = useState([
    { everyTime: false, twicemore: false, twiceless: false, none: false },
    { everyTime: false, twicemore: false, twiceless: false, none: false },
  ]);
  const add_questions = [
    'グループ分けにより、データへの理解が深まった。',
    '各グループに名前が無い状況でも、まず全体を見てから5つのグループを選択し、データを整理するプロセスを通じてデータを理解することができる。',
    'このグループ分け方法は、画像のコンセプトを効果的に処理できる（コンセプト：色、ラベル、形、被写体、場面、材料）。',
  ];
  const loop_questions = [
    '何回グループ分けをすると、結果は期待通りになりますか？（単一選択）',
    '何回グループ分けをすると、操作に対するの自信を持ちますか？（単一選択）'
  ];
  
  const [openAlert, setOpenAlert] = useState(false);
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState('');
  const handleSubmit = () => {
    const allValues = [...likertValues, ...addLikert];

  for (let i = 0; i < likertValues.length; i++) {
  if (likertValues[i] == -1) {
    setErrMsg(`質問${i + 1}が未記入です。`);
    setOpenAlert(true);
    return;
  }
}
for (let i = 0; i < addLikert.length; i++) {
  if (addLikert[i] == null) {
    setErrMsg(`質問${i + likertValues.length + 1}が未記入です。`);
    setOpenAlert(true);
    return;
  }
}
for (let i = 0; i < loopQuestion.length; i++) {
  const question = loopQuestion[i];
  if (!question.everyTime && !question.twicemore && !question.twiceless && !question.none) {
    setErrMsg(`質問${i + likertValues.length + addLikert.length + 1}が未記入です。`);
    setOpenAlert(true);
    return;
  }
}
      if (comment.trim() == '') {
          setErrMsg('コメントが入力されていません。');
          setOpenAlert(true);
          return;
      }
      const selectedLoopQ = loopQuestion.map(question => {
        for (let [key, value] of Object.entries(question)) {
          if (value === true) {
            return key;
          }
        }
      }).join(',');
      // console.log(likertValues.toString());
        axiosFetch({
            method: 'POST',
            url: '/rate',
            requestConfig: {
              type: "end",
              likert_topic: likertValues.toString(),
              likert_additional: addLikert.toString(),
              likert_loop: selectedLoopQ.toString(),
              comment: comment  
            }
          });
        localStorage.setItem('access_token', 'finish');
        navigate('/logout'); 
  };

  return (
    <div className="thanks-container">
      <div className='final-rate'>
        <ol>
          <li>
            <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
              アンケート
            </Typography>
            <Typography variant="body1">
            グループ分けの結果について、以下の質問に答えてください。
            </Typography>
          </li>

          {Array.from(Array(cluster_id_range).keys()).map((_, index) => (
            <li key={index}>
              {( <Typography variant="h7">質問 {index + 1}
                      <Tooltip title="必須">
                          <Typography component="span" color="error">*</Typography>
                      </Tooltip></Typography>)}         
              <Likert
                question={'適切にグループ分けされている。'}
                responses={likertSeven}
                id={index}
                className="likert-scale"
                onChange={(e) => {  
                  const newVal = e.value;
                  setLikertValues(prevLikertValues => {
                    const newLikertValues = [...prevLikertValues];
                    newLikertValues[index] = newVal;
                    return newLikertValues;
                  });
                }}
              />
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ width: '100%', height: '100%' }}
                  >
                    <ImageList
                      sx={{ width: 500, height: 450 }}
                      variant="quilted"
                      cols={4}
                      rowHeight={121}
                    >
                      {data.filter(item => item.cluster_id === index).map((item) => (
                        <ImageListItem key={item.img_name} cols={item.cols || 1} rows={item.rows || 1}>
                          <img
                            src={IMG_BASE_URL + item.img_name}
                            alt={item.img_name}
                            loading="lazy"
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                    </Box>
            </li>
          ))}

{add_questions.map((question, index) => (
    <li key={index}>
      <Typography variant="h7">質問 {index + 21}
                      <Tooltip title="必須">
                          <Typography component="span" color="error">*</Typography>
                      </Tooltip></Typography>
      <Likert
        question={question}
        responses={likertSeven}
        id={index + 21}
        className="likert-scale"
        onChange={(val) => {
          setAddLikert(prevValues => {
            const newValues = [...prevValues];
            newValues[index] = val.value;
            return newValues;
          });
        }}
      />
    </li>
  ))}

{loop_questions.map((questionText, questionIndex) => (
  <li key={questionIndex}>
    <Typography variant="h7">質問 {questionIndex + 24}
    <Tooltip title="必須">
        <Typography component="span" color="error">*</Typography>
    </Tooltip></Typography>
    <p>{questionText}</p>
  
    {options.map((option, optionIndex) => (
  <FormControlLabel
    key={optionIndex}
    control={
      <Radio
        checked={loopQuestion[questionIndex][optionMap[option]]}
        onChange={() => {
          setLoopQuestions(prevQuestions => {
            const newQuestions = [...prevQuestions];
            const newQuestion = { everyTime: false, twicemore: false, twiceless: false, none: false };
            newQuestion[optionMap[option]] = true;
            newQuestions[questionIndex] = newQuestion;
            return newQuestions;
          });
        }}
      />
    }
    label={option}
  />
))}

  </li>
))}

    <li>
                     <Typography component="span">
                     作業の感想を自由に教えてください。（例：どういう基準で並び替えましたか？作業の難易度はどうでしたか？グルーピングがうまくいったと思いますか？など）
                       <Tooltip title="必須">
                         <Typography component="span" color="error">*</Typography>
                       </Tooltip>
                     </Typography>
                     <TextField
                       multiline
                       fullWidth
                       minRows={2}
                       maxRows={4}
                       inputProps={{ maxLength: CHARACTER_LIMIT }}
                       variant="outlined"
                       placeholder="何でも入力してください…"
                       helperText={ <Box display="flex" justifyContent="space-between" alignItems="center">
                       <Typography variant="caption">
                         {/* 请勿包含任何敏感信息   <Tooltip title="敏感信息是指任何应受保护的数据。例如，请勿包含密码，信用卡号和个人详情。"> <HelpOutlineIcon fontSize="inherit" />  </Tooltip> */}
                         機密情報を含めないでください <Tooltip title="機密情報とは、保護すべき任意のデータを指します。例えば、パスワード、クレジットカード番号、個人詳細などを含めないでください。"> <HelpOutlineIcon fontSize="inherit" />  </Tooltip>
                       </Typography>
                       <Typography variant="caption">
                         {`${comment.length}/${CHARACTER_LIMIT}`}
                       </Typography>
                     </Box>}
                       value={comment}
                       onChange={e => setComment(e.target.value)}
                     />
                   </li>


                   {openAlert && (
                       <Alert severity="error" onClose={() => setOpenAlert(false)}>
                          すべての項目を記入してください。{errMsg} {/* 请填写所有必填项 */}
                       </Alert>
                   )}
          <button variant="contained" onClick={handleSubmit} className='final-rate-button'>提出する</button>
        </ol>
      </div>
    </div>
  )
}

export default Question

import '../css/logout.css';
import {  useEffect, useState,useRef,useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../hook/useAxiosPrivate";
import Likert from "react-likert-scale";
import { likertSeven } from '../setting/likertSeven.js';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import data from "../json/nn_projection_pca.json";
import { IMG_BASE_URL } from "../api/axios"

const Question = () => {
    const CHARACTER_LIMIT = 100;
    const [comment, setComment] = useState('');
    const [likertValues, setLikertValues] = useState(Array(data.cluster_id_range).fill(null));



    const [rate, error, _, axiosFetch] = useAxiosPrivate();
    const [openAlert, setOpenAlert] = useState(false);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = useCallback((index) => (val) => {
      const newValue = typeof val === 'object' && val !== null ? val.value : val;
      console.log('Old values:', likertValues);
      console.log('Changing value at index:', index);
      console.log('New value:', newValue);
      setLikertValues(prevLikertValues => {
        const newLikertValues = [...prevLikertValues];
        newLikertValues[index] = newValue;
        return newLikertValues;
      });
    }, [likertValues]);

    const handleSubmit = () => {
      for (let i = 0; i < likertValues.length; i++) {
        if (likertValues[i] === null) {
            setErrorMessage(`Likert scale ${i + 1} is not filled out.`);
            setOpenAlert(true);
            return;
        }
        }
        if (comment.trim() === '') {
            setErrorMessage('Comment is not filled out.');
            setOpenAlert(true);
            return;
        }

          // axiosFetch({
          //   method: 'POST',
          //   url: '/rate',
          //   requestConfig: {
          //     type: "end",
          //     likert: likertValues,
          //     comment: comment  
          //   }
          // });
          // localStorage.setItem('token', 'finish');
          // navigate('/logout'); 
      };
    

    return ( 
      <div className="thanks-container">   
              <div className='final-rate'>
                 <ol>
                 <li>
                   <Typography variant="h5" gutterBottom>
                     実験終了,アンケートにご協力をお願いいたします。
                   </Typography>
                   <Typography variant="body1">
                     it‘s all about the understanding of the clustering result.
                   </Typography>
                 </li>
                 
                 {Array(data.cluster_id_range).fill().map((_, index) => {
                  return (
                  <li>
                    <h6>{index}</h6>
                    <Likert 
                      question={(<Typography component="span"> この写真グループはトッピクを明確に強調できます。
                      <Tooltip title="必填">
                          <Typography component="span" color="error">*</Typography>
                      </Tooltip></Typography>)}
                  responses={likertSeven}
                  className="likert-scale"  
                  onChange={handleChange(index)}
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
                      {data.data.filter(item => item.cluster_id === index).map((item) => (
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
                  )})}
      
                   <li>
                     <Typography component="span">
                     参加した感想を自由に教えてください。
                       <Tooltip title="必填">
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
                          すべての項目を記入してください。 {/* 请填写所有必填项 */}
                       </Alert>
                   )}
                   <button variant="contained" onClick={handleSubmit} className='final-rate-button'>提出する</button>
                 </ol>
               </div>
               </div>
    )
}

export default Question

import '../css/logout.css';
import {  useEffect, useState } from "react";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import Likert from "react-likert-scale";
import TextField from '@mui/material/TextField';

const Thanks = () => {
    const CHARACTER_LIMIT = 100;
    const [comment, setComment] = useState('');
    const [likertValue, setLikertValue] = useState(null);

    // production env remove
    // localStorage.clear();
    // Object.keys(localStorage).forEach(key => {
    //     if (key !== 'finish') {
    //       localStorage.removeItem(key);
    //     }
    //   });

    const [finish, setFinish] = useState(localStorage.getItem('finish') === 'true');
    const [rate, error, _, axiosFetch] = useAxiosPrivate();

    const handleSubmit = () => {
          console.log('Likert值: ', likertValue);
          console.log('评论: ', comment);
          // axiosFetch({
          //   method: 'POST',
          //   url: '/rate',
          //   requestConfig: {
          //     type: "end",
          //     likert: likertValue,
          //     comment: comment  
          //   }
          // });
          localStorage.setItem('finish', 'true');
          setFinish(true);
      };
    

    const likertOptions = {
        question: "最終的なクラスタリングは初期状態よりも良いと思いますか？（必填）",
        responses: [
          { value: 1, text: "全く同意しない" },
          { value: 2, text: "同意しない" },
          { value: 3, text: "ある程度同意しない" },
          { value: 4, text: "どちらでもない" },
          { value: 5, text: "ある程度同意する" },
          { value: 6, text: "同意する" },
          { value: 7, text: "全く同意する" }
        ],
        onChange: (val) => {
            setLikertValue(val.value);
          }       
        }

    return ( 
        <div className="thanks-container">  
             <div className='final-rate'>
                <ol>
                  <li>
                    <h3>実験終了,アンケートにご協力をお願いいたします。</h3>
                    <p>it‘s all about the understanding of the clustering result.</p>
                  </li>
                  <li><Likert {...likertOptions} className="likert-scale" /></li>
                  <li>
                    <p>この実験についてのあなたのコメントは何ですか。（必填）</p>
                    <TextField
                      multiline
                      fullWidth
                      minRows={2}
                      maxRows={4}
                      inputProps={{ maxLength: CHARACTER_LIMIT }}
                      variant="outlined"
                      placeholder="何でも入力してください…"
                      helperText={`${comment.length}/${CHARACTER_LIMIT}`}
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                    />
                  </li>
                  <button variant="contained" onClick={handleSubmit}>提出する</button>
                </ol>
              </div>
             {/* {!finish ?:
            <div >
                <p className="thanks-text">
                    ご協力ありがとうございました。
                </p> 
            </div>  }      */}
        </div>
      
    )
}

export default Thanks
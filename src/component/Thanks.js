
import '../css/logout.css';
import {  useEffect, useState } from "react";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import Likert from "react-likert-scale";



const Thanks = () => {
    
    // production env remove
    // localStorage.clear();
    // Object.keys(localStorage).forEach(key => {
    //     if (key !== 'finish') {
    //       localStorage.removeItem(key);
    //     }
    //   });

    const [finish, setFinish] = useState(localStorage.getItem('finish') === 'true');
    const [rate, error, _, axiosFetch] = useAxiosPrivate();
    const onChange = (score) => {
        axiosFetch({
            method: 'POST',
            url: '/rate',
            requestConfig: {
                type: "end",
                likert: score  
            }
        });      
    }

    const likertOptions = {
        question: "最終的なクラスタリングは初期状態よりも良いと思いますか？",
        responses: [
          { value: 1, text: "全く同意しない" },
          { value: 2, text: "同意しない" },
          { value: 3, text: "ある程度同意しない" },
          { value: 4, text: "どちらでもない" },
          { value: 5, text: "ある程度同意する" },
          { value: 6, text: "同意する" },
          { value: 7, text: "全く同意する" }
        ],
        picked: (val) => {
          if (finish) {
            return;
          }
          onChange(val.value);
          localStorage.setItem('finish', 'true');
          setFinish(true);
        }
         
        }

       

    return ( 
        <div className="thanks-container">
                {!finish ?
             <div className='final-rate'>
                <Likert {...likertOptions} />
             </div>:
            <div >
                <p className="thanks-text">
                    ご協力ありがとうございました。
                </p> 
            </div>  }     
        </div>
      
    )
}

export default Thanks
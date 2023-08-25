
import '../css/logout.css';
import {  useEffect, useState } from "react";
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import useAxiosPrivate from "../hook/useAxiosPrivate";
import Likert from "react-likert-scale";



const Thanks = () => {
    
    // production env remove
    localStorage.clear();
    // localStorage.removeItem('round');
    // localStorage.removeItem('displayVisited');
    // localStorage.removeItem('highlighted');
    // localStorage.removeItem('startRated');
    // localStorage.removeItem('finish');

    const [finish, setFinish] = useState(localStorage.getItem('finish') === 'true');
    const [rate, error, loading, axiosFetch] = useAxiosPrivate();
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
        question: "do you think the final clustering better than init?",
        responses: [
          { value: 1, text: "Strongly disagree" },
          { value: 2, text: "disagree" },
          { value: 3, text: "Somewhat Disagree" },
          { value: 4, text: "Neutral" },
          { value: 5, text: "Somewhat Agree" },
          { value: 6, text: "agree" },
          { value: 7, text: "Strongly agree" }
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
        <div>
        <div className="thanks-container">
            
           
                {!finish ?
             <div className='final-rate'>
                <Likert {...likertOptions} />
             </div>:
            <div>
                <p className="thanks-text">
                    ご協力ありがとうございました。
                </p> 
            </div>  }    
        
        </div>
        </div>
    )
}

export default Thanks
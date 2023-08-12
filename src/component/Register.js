import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
// import '../App.css';
import '../css/register.css';

import useAuth from '../hook/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const AGE_REGEX = /^(1[8-9]|[2-9][0-9])$/;
const REGISTER_URL = '/register';

const Register = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const ageRef = useRef();
    const errRef = useRef();

    const [age, setAge] = useState('');
    const [validAge, setValidAge] = useState(false);
    const [ageFocus, setAgeFocus] = useState(false);
    const [gender, setGender] = useState('');
    const [errMsg, setErrMsg] = useState('');


    useEffect(() => {
        ageRef.current.focus();
    }, [])

    useEffect(() => {
        setValidAge(AGE_REGEX.test(age));
    }, [age])

  
    useEffect(() => {
        setErrMsg('');
    }, [age, gender])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = AGE_REGEX.test(age);
        if (!v1) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ "age":age,"gender": gender }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.data.access_token;
            const user_id = response?.data?.data.user_id;
            setAuth({ accessToken,user_id});
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setAge('');
            setGender('');
            navigate('/disclaimer', { state: { from: location }, replace: true} );
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if(err.response?.code === 4001){
                setErrMsg(err.response.msg)
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }


    return (
        <>
            <div className="register-section">
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="age">
                            Age:
                            <FontAwesomeIcon icon={faCheck} className={validAge ? "valid" : "hide"}  />
                            <FontAwesomeIcon icon={faTimes} className={validAge || !age ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="number"
                            id="age"
                            ref={ageRef}
                            autoComplete="off"
                            onChange={(e) => setAge(e.target.value)}
                            value={age}
                            required
                            aria-invalid={validAge? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setAgeFocus(true)}
                            onBlur={() => setAgeFocus(false)}
                        />
                        <p id="uidnote" className={ageFocus && age && !validAge ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            You Must be older then <br />
                            18 and younger then 99 <br />
                            years old.
                        </p>

                    <label htmlFor="gender">Gender:  </label>
                    <select 
                            id="gender"
                            onChange={(e) => setGender(e.target.value)}
                            value={gender}
                            required
                            aria-describedby="uidnote"
                            onFocus={() => setAgeFocus(true)}
                            onBlur={() => setAgeFocus(false)}
                            >
                        <option value="">Select...</option>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                        <option value="0">Other</option>
                    </select>
                       
                        <button disabled={!validAge ||!gender  ? true : false}>Submit</button>
                    </form>
                </section>
                </div>
        </>
    )
}

export default Register
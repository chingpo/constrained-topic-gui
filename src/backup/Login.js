import React, { useState,useEffect } from 'react';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

function Login() {
    let {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    let onSubmit = (data) => {
        alert(JSON.stringify(data));
    };

    let [formData, setFormData] = useState({});
    let handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      };

    let navigate = useNavigate();
    useEffect(() => {
        let queryParams = new URLSearchParams({ formData});
        fetch(`http://127.0.0.1:9999/users?${queryParams}`)
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    navigate.push('/disclaimer');
                } else {
                    console.log(data.msg);
                }
            })
            .catch((err) => console.log(err.msg));
    }, [navigate]);

    return (
        <Layout>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>Age</label>
                    <input type="number" onChange={handleInputChange} {...register("age", {required: true,valueAsNumber: true, min: 18, max: 99 })} />
                    {errors.age && (
                        <p>You Must be older then 18 and younger then 99 years old</p>
                    )}
                    <label>gender</label>
                    <select onChange={handleInputChange}  {...register("gender", {
                            required: true,
                        })}>
                        <option value="">Select...</option>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                        <option value="0">other</option>
                    </select>
                    {errors?.gender?.type === "required" && <p>This field is required</p>}
                    <input type="submit" />
                </form>


            </div>
        </Layout>
    );
}

export default Login;
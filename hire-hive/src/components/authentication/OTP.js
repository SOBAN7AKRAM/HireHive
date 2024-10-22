import { useState, useEffect, useCallback, useContext } from 'react';
import React, { memo } from 'react';
import useCsrfToken from './useCsrfToken';
import { SignUpContext } from '../context/SignUpContext';
import { useAuth } from "../AuthContext"
import { json, useNavigate } from 'react-router-dom';


const OTP = () => {
    const navigate = useNavigate();
    const csrfToken = useCsrfToken();

    // to set the user to authenticate
    const {setIsAuthenticated, user, setUser} = useAuth()

    // to store user otp input for verification
    const [otp, setOtp] = useState();

    const [time, setTime] = useState(120);  // Lift time state up

    // get the signUpData from the SignUpContext
    const { signUpData } = useContext(SignUpContext)

    // if data is empty redirect to signUp page
    if (!signUpData || Object.keys(signUpData).length <= 0) {
        navigate('/sign_up')
    }

    // send the otp to user email
    const fetchOTP = () => {
        fetch('http://localhost:8000/send_otp', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify({ email: signUpData.email })
        })
            .then(response => response.json())
            .then(data => console.log("OTP sent", data))
            .catch(err => console.error("Fetch error:", err));
    };

    // to send otp on first render
    useEffect(() => {
        fetchOTP();
        console.log(JSON.stringify(signUpData))
    }, [signUpData.email, csrfToken])

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    useEffect(() => {
        if (time > 0) {
            const intervalId = setInterval(() => {
                setTime(t => t - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [time]);

    function handleResendClick() {
        setTime(120);
        fetchOTP();
    }

    function postSignUpData() {
        fetch("http://localhost:8000/sign_up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            credentials: "include",
            body: JSON.stringify(signUpData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.success){
                setUser(data)
                setIsAuthenticated(true)
                localStorage.setItem('jwt_token', data.token);
                navigate("/")
            } 
            else{
                alert(data.error)
            }
        })
        .catch(err => console.log(err))
    }


    function handleVerifyClick() {
        fetch("http://localhost:8000/verify_otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            credentials: "include",
            body: JSON.stringify({ "otp": otp, "email" : signUpData.email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success){
                postSignUpData();
                console.log(data.Success);

            } 
            else{
                alert(data.error)
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <div className='signUpDiv'>
            <h1 className='heading'>Email Verification</h1>
            <div className='otpContainer'>
                <div className='spaceBtwDiv'>
                    <label htmlFor="otpVerification" className="form-label">Enter OTP</label>
                    <span className="timer">
                        {`0${minutes}`}: {seconds < 10 ? `0${seconds}` : seconds}
                    </span>
                </div>
                <input
                    type="text"
                    className="form-control"
                    id="otpVerification"
                    onChange={(e) => setOtp(e.target.value)}
                />
                <div className="rightDiv">
                    <button className="btn-link otpBtn" onClick={handleResendClick}>Resend OTP?</button>
                </div>
                <div className='mt-3 centerDiv'>
                    <input 
                    type="submit" 
                    className="btn btn-primary" 
                    id="verifyOtpBtn" 
                    value="Verify OTP" 
                    onClick={handleVerifyClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default OTP;
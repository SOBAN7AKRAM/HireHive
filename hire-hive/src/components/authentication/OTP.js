import {useState, useEffect, useCallback} from 'react';
import useCsrfToken from './useCsrfToken';

const OTP = ({email}) => {
    const csrfToken = useCsrfToken();
    const [time, setTime] = useState(120)

    const fetchOTP = useCallback(() => {
        console.log(csrfToken)
        fetch('http://localhost:8000/send_otp', {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':  csrfToken,
            },
            body: JSON.stringify({"email":email})
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
    },[csrfToken, email] )

    useEffect(() => {
        fetchOTP();
        if (!time) return;
        const intervalId = setInterval(() => {
            setTime(time - 1);
        }, 1000)
        return () => clearInterval(intervalId);
    }, [time, fetchOTP])

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    
    function handleClick() {
        fetchOTP();
        setTime(120);
    }

    return (
        <>
            <div className="spaceBtwDiv">
                <label for="otpVerification" className="form-label">Enter OTP</label>
                <span className="timer">{`0${minutes}`}: {seconds < 10 ? `0${seconds}`: seconds} </span>
            </div>
            <input
                type="text"
                className="form-control"
                id="otpVerification"
            />
            <div className="rightDiv">
                <button onClick={handleClick} className="btn-link otpBtn">resend otp?</button>
            </div>
            <div className='mb-3 centerDiv'>
            {<input type="submit" onClick={handleClick} className="btn btn-primary" id="verifyOtpBtn" value="Verify OTP"/>}

            </div>
        </>
    )
}
export default OTP;